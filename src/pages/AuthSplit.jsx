import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../supabaseClient';
import { Eye, EyeOff } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import ParticlesBackground from '../components/ParticlesBackground';

const AuthSplit = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const { isDark, theme } = useTheme();

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setSuccessMessage('تم إنشاء الحساب! يرجى التحقق من بريدك الإلكتروني.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err) {
      if (err.message.includes('already registered') || err.message.includes('User already registered')) {
        setError('هذا البريد مسجل بالفعل. يرجى تسجيل الدخول بدلاً من ذلك.');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setSuccessMessage('');
    setError('');
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });
      if (error) throw error;
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      setError('يرجى إدخال عنوان بريدك الإلكتروني أولاً.');
      setSuccessMessage('');
      return;
    }
    try {
      setLoading(true);
      setError('');
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/update-password',
      });
      if (error) throw error;
      setSuccessMessage('تم إرسال رابط إعادة تعيين كلمة المرور! تحقق من بريدك الإلكتروني.');
    } catch (err) {
      setError(err.message);
      setSuccessMessage('');
    } finally {
      setLoading(false);
    }
  };

  const errorColor = isDark ? '#ff6b6b' : '#dc2626';
  const successColor = isDark ? '#51cf66' : '#059669';
  const getInputBorderColor = (focused) => {
    if (focused) return isDark ? 'rgb(var(--accent-main) / 0.9)' : 'rgb(var(--accent-main) / 0.7)';
    return isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgb(var(--accent-main) / 0.25)';
  };

  return (
    <div className="flex min-h-screen w-full overflow-hidden relative" style={{ backgroundColor: theme.background, color: theme.text }}>
      
      {/* BACKGROUND LAYERS */}
      <div 
        className="absolute inset-0 z-0 animate-gradient-flow bg-[length:200%_200%]"
        style={{
          background: isDark
            ? 'linear-gradient(135deg, #000000, rgb(var(--accent-dark) / 0.25), #0a0a0a)'
            : 'linear-gradient(135deg, #ffffff, rgb(var(--accent-main) / 0.06), #f8fbff)'
        }}
      />
      <div className="absolute inset-0 z-0">
        <ParticlesBackground />
      </div>

      {/* SPLIT CONTAINER */}
      <div className="relative z-10 flex w-full h-full">
        
        {/* LEFT PANEL: Form */}
        <div 
          className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 lg:p-16 relative z-10"
          style={{
            backgroundColor: isDark ? 'transparent' : 'rgba(255, 255, 255, 0.5)',
            backdropFilter: isDark ? 'none' : 'blur(10px)'
          }}
        >
          <div className="w-full max-w-md space-y-6" style={{ marginTop: '5vh' }}>

            {/* Header */}
            <motion.div 
              className="text-center lg:text-left"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl lg:text-4xl font-black tracking-tight leading-tight mb-2" style={{ color: theme.text }}>
                {isSignUp ? '🚀 The Journey Begins Here' : '👋 Welcome Back, Champion'}
              </h2>
              <p className="mt-3 text-sm lg:text-base leading-relaxed" style={{ color: theme.textSecondary }}>
                {isSignUp ? 'Create your account and start your path to greatness.' : 'Ready to pick up where you left off? Let\'s get to work.'}
              </p>
            </motion.div>

            {/* Notifications */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -15, scale: 0.95 }}
                  transition={{ duration: 0.4, type: 'spring', stiffness: 300, damping: 25 }}
                  className="p-4 lg:p-5 rounded-3xl lg:rounded-2xl text-sm lg:text-base text-center border-l-4 backdrop-blur-sm"
                  style={{
                    backgroundColor: isDark ? 'rgba(220, 38, 38, 0.15)' : 'rgba(220, 38, 38, 0.1)',
                    borderColor: errorColor
                  }}
                >
                  <div className="flex items-start gap-3">
                    <motion.span 
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="text-lg lg:text-2xl flex-shrink-0"
                    >
                      ⚠️
                    </motion.span>
                    <p className="font-600 text-left" style={{ color: errorColor }}>
                      {error}
                    </p>
                  </div>
                </motion.div>
              )}
              {successMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -15, scale: 0.95 }}
                  transition={{ duration: 0.4, type: 'spring', stiffness: 300, damping: 25 }}
                  className="p-4 lg:p-5 rounded-3xl lg:rounded-2xl text-sm lg:text-base text-center border-l-4 backdrop-blur-sm"
                  style={{
                    backgroundColor: isDark ? 'rgba(5, 150, 105, 0.15)' : 'rgba(5, 150, 105, 0.1)',
                    borderColor: successColor
                  }}
                >
                  <div className="flex items-start gap-3">
                    <motion.span 
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="text-lg lg:text-2xl flex-shrink-0"
                    >
                      ✓
                    </motion.span>
                    <p className="font-600 text-left" style={{ color: successColor }}>
                      {successMessage}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* FORM */}
            <form onSubmit={handleAuth} className="space-y-6">
              <div className="space-y-5">
                
                {/* Email Input */}
                <motion.div 
                  className="relative group"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-all duration-300 text-xl" style={{
                    color: emailFocused ? theme.primary : theme.textSecondary
                  }}>
                    📧
                  </div>
                  <motion.input
                    type="email"
                    id="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setEmailFocused(true)}
                    onBlur={() => setEmailFocused(false)}
                    className="peer block w-full pl-14 pr-5 pt-6 pb-2 border-b-2 focus:outline-none focus:ring-0 transition-all duration-300 text-base lg:text-base font-500 bg-transparent"
                    placeholder=" "
                    animate={{
                      borderColor: getInputBorderColor(emailFocused),
                    }}
                    transition={{ duration: 0.3 }}
                    style={{
                      borderColor: getInputBorderColor(emailFocused),
                      color: theme.text,
                      outline: 'none',
                      boxShadow: emailFocused 
                        ? `0 2px 8px ${theme.primary}20, inset 0 -2px 0 ${theme.primary}30` 
                        : 'none'
                    }}
                  />
                  <motion.label 
                    htmlFor="email"
                    className="absolute left-14 top-6 text-sm lg:text-base transition-all duration-300 pointer-events-none font-600"
                    animate={{
                      y: (email || emailFocused) ? -18 : 0,
                      scale: (email || emailFocused) ? 0.85 : 1,
                      color: (email || emailFocused) ? theme.primary : theme.textSecondary
                    }}
                    transition={{ duration: 0.3, type: 'spring', stiffness: 200, damping: 25 }}
                    style={{
                      fontFamily: "'Poppins', sans-serif",
                      letterSpacing: '0.3px'
                    }}
                  >
                    Email address
                  </motion.label>
                  
                  {/* Email validation indicator */}
                  {email && (
                    <motion.div
                      className="absolute right-5 top-6 transform -translate-y-1/2"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: 180 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    >
                      {/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? (
                        <svg className="w-5 h-5 lg:w-6 lg:h-6 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 lg:w-6 lg:h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      )}
                    </motion.div>
                  )}
                </motion.div>

                {/* Password Input */}
                <motion.div 
                  className="relative group"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.15 }}
                >
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-all duration-300 text-xl" style={{
                    color: passwordFocused ? theme.primary : theme.textSecondary
                  }}>
                    🔒
                  </div>
                  <motion.input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                    className="peer block w-full pl-14 pr-14 pt-6 pb-2 border-b-2 focus:outline-none focus:ring-0 transition-all duration-300 text-base lg:text-base font-500 bg-transparent"
                    placeholder=" "
                    animate={{
                      borderColor: getInputBorderColor(passwordFocused),
                    }}
                    transition={{ duration: 0.3 }}
                    style={{
                      borderColor: getInputBorderColor(passwordFocused),
                      color: theme.text,
                      outline: 'none',
                      boxShadow: passwordFocused 
                        ? `0 2px 8px ${theme.primary}20, inset 0 -2px 0 ${theme.primary}30` 
                        : 'none'
                    }}
                  />
                  <motion.label 
                    htmlFor="password"
                    className="absolute left-14 top-6 text-sm lg:text-base transition-all duration-300 pointer-events-none font-600"
                    animate={{
                      y: (password || passwordFocused) ? -18 : 0,
                      scale: (password || passwordFocused) ? 0.85 : 1,
                      color: (password || passwordFocused) ? theme.primary : theme.textSecondary
                    }}
                    transition={{ duration: 0.3, type: 'spring', stiffness: 200, damping: 25 }}
                    style={{
                      fontFamily: "'Poppins', sans-serif",
                      letterSpacing: '0.3px'
                    }}
                  >
                    Password
                  </motion.label>
                  <motion.button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center transition-all active:scale-95 hover:opacity-80"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    style={{ color: passwordFocused ? theme.primary : theme.textSecondary }}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </motion.button>
                </motion.div>

                {/* ALIGNED ACTIONS ROW */}
                <motion.div 
                  className="flex items-center justify-between mt-8 text-xs lg:text-sm gap-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  style={{ color: theme.textSecondary }}
                >
                  {/* Left: Sign Up Toggle */}
                  <div className="flex items-center gap-2">
                    <span>
                      {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                    </span>
                    <motion.button
                      type="button"
                      onClick={() => { setIsSignUp(!isSignUp); setError(''); setSuccessMessage(''); }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                      className="font-bold transition-all hover:opacity-80 px-2 py-1 rounded-2xl hover:bg-blue-500/10"
                      style={{ color: theme.primary }}
                    >
                      {isSignUp ? 'Sign In' : 'Sign Up'}
                    </motion.button>
                  </div>

                  {/* Right: Forgot Password - Only show in Sign In mode */}
                  {!isSignUp && (
                    <motion.button
                      type="button"
                      onClick={handleResetPassword}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                      className="font-bold transition-all hover:opacity-80 px-2 py-1 rounded-2xl hover:bg-blue-500/10"
                      style={{ color: theme.primary }}
                    >
                      Forgot password?
                    </motion.button>
                  )}
                </motion.div>
              </div>

              {/* Main Submit Button */}
              <motion.button
                type="submit"
                disabled={loading}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25 }}
                whileHover={!loading ? { scale: 1.03, y: -3 } : {}}
                whileTap={!loading ? { scale: 0.97 } : {}}
                className="group relative w-full flex justify-center py-4 lg:py-5 px-4 border border-transparent text-base lg:text-lg font-bold rounded-3xl lg:rounded-2xl text-white transition-all duration-300 shadow-lg hover:shadow-xl"
                style={{
                  background: !loading
                    ? `linear-gradient(135deg, ${theme.primary}, ${theme.primaryDark})`
                    : `linear-gradient(135deg, ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(37,99,235,0.08)'}, ${isDark ? 'rgba(255,255,255,0.03)' : 'rgba(37,99,235,0.03)'})`,
                  boxShadow: !loading
                    ? `0 12px 40px ${theme.primary}50, inset 0 1px 0 rgba(255,255,255,0.2)`
                    : 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontFamily: "'Poppins', sans-serif",
                  letterSpacing: '0.5px'
                }}
              >
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-3xl lg:rounded-2xl"
                  animate={!loading ? { backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'] } : {}}
                  transition={{ duration: 3, repeat: Infinity }}
                  style={{
                    background: 'linear-gradient(45deg, white, transparent)',
                    backgroundSize: '200% 200%'
                  }}
                />
                
                <div className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? (
                    <motion.svg 
                      className="w-5 h-5 lg:w-6 lg:h-6"
                      viewBox="0 0 24 24"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                    >
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 6.627 5.373 12 12 12v-4c-3.314 0-6-2.686-6-6z"></path>
                    </motion.svg>
                  ) : (
                    <motion.span 
                      animate={{ scale: [0.8, 1, 0.8] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="text-lg lg:text-xl font-bold"
                    >
                      ✓
                    </motion.span>
                  )}
                  <span className="font-700 tracking-wide">
                    {loading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Sign In')}
                  </span>
                </div>
              </motion.button>

              {/* OR Divider */}
              <motion.div 
                className="relative flex items-center py-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex-grow border-t" style={{ borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(37, 99, 235, 0.15)' }}></div>
                <span className="flex-shrink-0 mx-4 text-xs lg:text-sm uppercase font-bold tracking-wider" style={{ color: theme.textSecondary }}>OR</span>
                <div className="flex-grow border-t" style={{ borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(37, 99, 235, 0.15)' }}></div>
              </motion.div>

              {/* Google Button */}
              <motion.button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.35 }}
                whileHover={!loading ? { scale: 1.03, y: -2 } : {}}
                whileTap={!loading ? { scale: 0.97 } : {}}
                className="w-full flex items-center justify-center py-4 lg:py-5 px-4 border-2 rounded-3xl lg:rounded-2xl transition-all duration-300 group font-bold hover:shadow-lg"
                style={{
                  borderColor: isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(37, 99, 235, 0.3)',
                  backgroundColor: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(255, 255, 255, 0.9)',
                  color: theme.text,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontFamily: "'Poppins', sans-serif",
                  letterSpacing: '0.3px'
                }}
              >
                <svg className="h-6 w-6 lg:h-7 lg:w-7 mr-3" viewBox="0 0 24 24" style={{ filter: 'brightness(1.2) contrast(1.1)' }}>
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                <span className="font-700">Continue with Google</span>
              </motion.button>
            </form>
          </div>
        </div>

        {/* RIGHT PANEL: Visual Hero */}
        <div className="hidden lg:flex w-1/2 flex-col justify-center items-center relative overflow-hidden p-10">
          <div className="absolute text-[20rem] font-black opacity-[0.03] select-none pointer-events-none rotate-12" style={{ color: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(37, 99, 235, 0.1)' }}>
            R
          </div>
          
          <motion.div 
            className="relative z-10 text-center px-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <motion.h1 
              className="text-7xl lg:text-8xl font-extrabold tracking-tighter drop-shadow-2xl mb-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              style={{ color: theme.text, fontFamily: "'Poppins', sans-serif" }}
            >
              Ready to <motion.span 
                style={{ color: theme.primary }}
                animate={{ textShadow: ['0 0 20px rgba(37,99,235,0.3)', '0 0 40px rgba(37,99,235,0.6)', '0 0 20px rgba(37,99,235,0.3)'] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                Rise?
              </motion.span>
            </motion.h1>
            <motion.p 
              className="text-lg lg:text-2xl font-light max-w-lg mx-auto leading-relaxed tracking-wide"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              style={{ color: theme.textSecondary, fontFamily: "'Poppins', sans-serif" }}
            >
              Your ultimate hub for <span style={{ color: theme.primary, fontWeight: 700 }}>discipline, transformation, and consistency</span>.
            </motion.p>

            {/* Floating cards */}
            <motion.div 
              className="mt-12 grid grid-cols-3 gap-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
              {['✓ Master Habits', '📊 Track Progress', '💪 Build Discipline'].map((item, i) => (
                <motion.div
                  key={i}
                  className="p-4 rounded-3xl backdrop-blur-md border"
                  style={{
                    backgroundColor: isDark ? 'rgba(37, 99, 235, 0.1)' : 'rgba(37, 99, 235, 0.08)',
                    borderColor: isDark ? 'rgba(37, 99, 235, 0.3)' : 'rgba(37, 99, 235, 0.25)'
                  }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <p className="text-sm font-bold" style={{ color: theme.primary }}>
                    {item}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

      </div>

      {/* Footer */}
      <motion.div 
        className="absolute bottom-0 left-0 right-0 text-center text-xs opacity-30 pb-5 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        style={{ color: theme.text }}
      >
        © 2026 Rise | Built for Greatness
      </motion.div>
    </div>
  );
};

export default AuthSplit;
