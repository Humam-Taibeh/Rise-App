import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../supabaseClient'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import ParticlesBackground from '../components/ParticlesBackground'

function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [currentWord, setCurrentWord] = useState(0)
  const [showPassword, setShowPassword] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [emailFocused, setEmailFocused] = useState(false)
  const [passwordFocused, setPasswordFocused] = useState(false)
  const { isDark, theme } = useTheme()
  
  // Validation helpers
  const isEmailValid = email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const getPasswordStrength = (pwd) => {
    if (!pwd) return 0
    let strength = 0
    if (pwd.length >= 8) strength += 1
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength += 1
    if (/\d/.test(pwd)) strength += 1
    if (/[^a-zA-Z\d]/.test(pwd)) strength += 1
    return strength
  }
  const passwordStrength = getPasswordStrength(password)
  const canSubmit = isEmailValid && password.length >= 6

  const words = ['Productivity', 'Discipline', 'Transformation', 'Consistency']

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const handleAuth = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { error } = isSignUp
        ? await supabase.auth.signUp({ email, password })
        : await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        if (error.message.includes('already registered')) {
          setError('هذا البريد مسجل بالفعل. جرب تسجيل الدخول بدلاً من ذلك.')
        } else {
          setError(error.message)
        }
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' })
    if (error) setError(error.message)
  }

  const handleForgotPassword = async () => {
    setError('')
    setSuccessMessage('')
    if (!email) {
      setError('الرجاء إدخال بريدك الإلكتروني أولاً.')
      return
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email)
    if (error) setError(error.message)
    else setSuccessMessage('تم إرسال رابط إعادة تعيين كلمة المرور. تحقق من بريدك الإلكتروني.')
  }

  const errorColor = isDark ? '#ff6b6b' : '#dc2626'
  const successColor = isDark ? '#51cf66' : '#059669'
  const getInputBorderColor = (focused) => {
    if (focused) return isDark ? 'rgba(37, 99, 235, 0.9)' : 'rgba(37, 99, 235, 0.6)'
    return isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(37, 99, 235, 0.2)'
  }
  const getInputBgColor = (focused) => {
    if (focused) return isDark ? 'rgba(37, 99, 235, 0.12)' : 'rgba(37, 99, 235, 0.05)'
    return isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.95)'
  }
  const getIconColor = (focused) => {
    if (focused) return theme.primary
    return isDark ? '#9ca3af' : '#475569'
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 sm:p-8 relative overflow-hidden" style={{ backgroundColor: theme.background, fontFamily: "'Poppins', sans-serif" }}>
      <ParticlesBackground />
      
      {/* Animated floating elements - Blue and Black theme */}
      <motion.div
        animate={{
          x: [0, 100, -50, 0],
          y: [0, -50, 100, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute top-20 left-20 w-32 h-32 rounded-full blur-xl opacity-50"
        style={{ 
          backgroundColor: isDark ? 'rgba(37, 99, 235, 0.08)' : 'rgba(37, 99, 235, 0.1)'
        }}
      />
      <motion.div
        animate={{
          x: [0, -80, 60, 0],
          y: [0, 80, -40, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute bottom-32 right-16 w-24 h-24 rounded-full blur-lg opacity-40"
        style={{ 
          backgroundColor: isDark ? 'rgba(0, 0, 0, 0.2)' : 'rgba(37, 99, 235, 0.12)'
        }}
      />
      <motion.div
        animate={{
          x: [0, 120, -30, 0],
          y: [0, -60, 90, 0],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute top-1/2 left-10 w-20 h-20 rounded-full blur-md opacity-40"
        style={{ 
          backgroundColor: isDark ? 'rgba(37, 99, 235, 0.06)' : 'rgba(37, 99, 235, 0.08)'
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md rounded-3xl px-8 py-12 sm:px-10 sm:py-14 shadow-2xl backdrop-blur-[20px] relative overflow-hidden border"
        style={{
          background: isDark
            ? 'radial-gradient(circle at 50% 50%, rgba(37, 99, 235, 0.1) 0%, rgba(37, 99, 235, 0.04) 50%, transparent 70%), rgba(5, 5, 5, 0.85)'
            : 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.95) 0%, rgba(37, 99, 235, 0.04) 50%, transparent 70%), rgba(255, 255, 255, 0.92)',
          borderColor: isDark ? 'rgba(37, 99, 235, 0.3)' : 'rgba(37, 99, 235, 0.35)',
          boxShadow: isDark
            ? '0 20px 60px rgba(37, 99, 235, 0.2), 0 0 40px rgba(37, 99, 235, 0.1)'
            : '0 20px 60px rgba(37, 99, 235, 0.12), 0 0 40px rgba(37, 99, 235, 0.06)'
        }}
      >
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: isDark 
              ? 'radial-gradient(circle at 50% 50%, rgba(37, 99, 235, 0.1) 0%, transparent 50%)'
              : 'radial-gradient(circle at 50% 50%, rgba(37, 99, 235, 0.08) 0%, transparent 50%)',
            animation: 'pulse-glow 4s ease-in-out infinite'
          }}
        />
        
        <h1 className="text-5xl sm:text-6xl font-black text-center mb-3 sm:mb-4 relative z-10 leading-tight" style={{ color: theme.text, fontFamily: "'Poppins', sans-serif", letterSpacing: '-0.02em' }}>
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Ready to{' '}
            <motion.span
              className="font-black"
              animate={{
                opacity: [0.6, 1, 0.6],
                textShadow: isDark
                  ? ["0 0 20px #2563eb", "0 0 35px #2563eb", "0 0 20px #2563eb"]
                  : ["0 0 15px #1e40af", "0 0 30px #1e40af", "0 0 15px #1e40af"]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              style={{ color: theme.primary }}
            >
              Rise
            </motion.span>
            ?{' '}
          </motion.span>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, rotate: [0, 20, 0, 20, 0] }}
            transition={{ duration: 0.6, delay: 0.8, rotate: { duration: 1.2, repeat: Infinity, ease: "easeInOut" } }}
            className="inline-block ml-2"
          >
            ⚔️
          </motion.span>
        </h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-center mb-2 sm:mb-3 text-lg sm:text-xl font-500"
          style={{ color: theme.textSecondary, fontFamily: "'Poppins', sans-serif" }}
        >
          Your ultimate hub for{' '}
          <motion.span
            key={currentWord}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
            className="font-600"
            style={{ color: theme.primary }}
          >
            {words[currentWord]}
          </motion.span>
        </motion.p>
        
        <p className="text-center text-sm sm:text-base mb-8 sm:mb-10 leading-relaxed font-400" style={{ color: isDark ? '#b4bcc4' : '#64748b', fontFamily: "'Poppins', sans-serif" }}>
          Master your habits, tasks, and health in one integrated dashboard.
        </p>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={isSignUp ? 'signup' : 'login'}
            initial={{ x: isSignUp ? 300 : -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: isSignUp ? -300 : 300, opacity: 0 }}
            transition={{ duration: 0.5, type: 'tween', ease: 'easeInOut' }}
          >
            <form onSubmit={handleAuth} className="space-y-6">
              {/* Email Input Field */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <motion.div
                  className="relative h-14 sm:h-14 rounded-2xl focus-within:ring-2 focus-within:ring-offset-0 transition-all"
                  animate={{
                    boxShadow: emailFocused
                      ? `0 0 0 3px ${isDark ? 'rgba(37, 99, 235, 0.2)' : 'rgba(37, 99, 235, 0.15)'}, 0 0 25px ${isDark ? 'rgba(37, 99, 235, 0.35)' : 'rgba(37, 99, 235, 0.25)'}`
                      : 'none'
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <Mail className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 z-20 transition-all duration-300" style={{ color: getIconColor(emailFocused) }} />
                  <motion.input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setEmailFocused(true)}
                    onBlur={() => setEmailFocused(false)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !loading) handleAuth(e); }}
                    placeholder=""
                    className="w-full h-full pl-16 pr-12 py-0 rounded-2xl focus:outline-none transition-all duration-300 font-500 text-base sm:text-base"
                    animate={{
                      backgroundColor: getInputBgColor(emailFocused),
                      borderColor: getInputBorderColor(emailFocused),
                    }}
                    transition={{ duration: 0.3 }}
                    style={{
                      border: `2px solid ${getInputBorderColor(emailFocused)}`,
                      color: theme.text,
                      fontSize: '1rem',
                      fontFamily: "'Poppins', sans-serif",
                      letterSpacing: '0.3px'
                    }}
                    required
                  />
                  <motion.label
                    animate={{
                      y: (emailFocused || email) ? -32 : -2,
                      scale: (emailFocused || email) ? 0.82 : 1,
                      opacity: (emailFocused || email) ? 1 : 0,
                      color: emailFocused ? theme.primary : (isDark ? '#b4bcc4' : '#64748b')
                    }}
                    transition={{ duration: 0.3, type: 'spring', stiffness: 200, damping: 25 }}
                    className="absolute left-5 top-1/2 transform -translate-y-1/2 pointer-events-none font-600 z-10 transition-colors duration-300"
                    style={{
                      fontSize: '0.8rem',
                      letterSpacing: '0.4px',
                      fontFamily: "'Poppins', sans-serif"
                    }}
                  >
                    Email Address
                  </motion.label>
                  
                  {/* Email validation indicator */}
                  {email && (
                    <motion.div
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: 180 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    >
                      {isEmailValid ? (
                        <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                          <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center">
                          <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              </motion.div>
              
              {/* Password Input Field */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25 }}
              >
                <motion.div
                  className="relative h-14 sm:h-14 rounded-2xl transition-all"
                  animate={{
                    boxShadow: passwordFocused
                      ? `0 0 0 3px ${isDark ? 'rgba(37, 99, 235, 0.2)' : 'rgba(37, 99, 235, 0.15)'}, 0 0 25px ${isDark ? 'rgba(37, 99, 235, 0.35)' : 'rgba(37, 99, 235, 0.25)'}`
                      : 'none'
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <Lock className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 z-20 transition-all duration-300" style={{ color: getIconColor(passwordFocused) }} />
                  <motion.input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !loading) handleAuth(e); }}
                    placeholder=""
                    className="w-full h-full pl-16 pr-16 py-0 rounded-2xl focus:outline-none transition-all duration-300 font-500 text-base sm:text-base"
                    animate={{
                      backgroundColor: getInputBgColor(passwordFocused),
                      borderColor: getInputBorderColor(passwordFocused),
                    }}
                    transition={{ duration: 0.3 }}
                    style={{
                      border: `2px solid ${getInputBorderColor(passwordFocused)}`,
                      color: theme.text,
                      fontSize: '1rem',
                      fontFamily: "'Poppins', sans-serif",
                      letterSpacing: '0.3px'
                    }}
                    required
                  />
                  <motion.label
                    animate={{
                      y: (passwordFocused || password) ? -32 : 0,
                      scale: (passwordFocused || password) ? 0.82 : 1,
                      opacity: (passwordFocused || password) ? 1 : 0,
                      color: passwordFocused ? theme.primary : (isDark ? '#b4bcc4' : '#64748b')
                    }}
                    transition={{ duration: 0.3, type: 'spring', stiffness: 200, damping: 25 }}
                    className="absolute left-5 top-1/2 transform -translate-y-1/2 pointer-events-none font-600 z-10 transition-colors duration-300"
                    style={{
                      fontSize: '0.8rem',
                      letterSpacing: '0.4px',
                      fontFamily: "'Poppins', sans-serif"
                    }}
                  >
                    Password
                  </motion.label>
                  <motion.button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)} 
                    className="absolute right-5 top-1/2 transform -translate-y-1/2 transition-all z-20 hover:opacity-80 active:scale-95"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    style={{ color: getIconColor(passwordFocused) }}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </motion.button>
                </motion.div>
                
                {/* Password Strength Indicator */}
                {password && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 sm:mt-3 space-y-2.5"
                  >
                    <div className="flex gap-1.5">
                      {[0, 1, 2, 3].map((i) => (
                        <motion.div
                          key={i}
                          className="flex-1 h-2.5 rounded-full transition-all"
                          animate={{
                            backgroundColor: i < passwordStrength
                              ? passwordStrength === 1 ? '#dc2626'
                              : passwordStrength === 2 ? '#d97706'
                              : passwordStrength === 3 ? '#2563eb'
                              : '#059669'
                              : isDark ? 'rgba(255,255,255,0.1)' : 'rgba(37,99,235,0.1)',
                            boxShadow: i < passwordStrength
                              ? passwordStrength === 1 ? '0 0 12px rgba(220, 38, 38, 0.6)'
                              : passwordStrength === 2 ? '0 0 12px rgba(217, 119, 6, 0.6)'
                              : passwordStrength === 3 ? '0 0 12px rgba(37, 99, 235, 0.6)'
                              : '0 0 12px rgba(5, 150, 105, 0.6)'
                              : 'none',
                            scaleY: i < passwordStrength ? 1 : 0.85
                          }}
                          transition={{ duration: 0.35, delay: i * 0.05 }}
                        />
                      ))}
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-xs sm:text-sm font-700 tracking-wide" style={{
                        color: passwordStrength === 1 ? '#dc2626'
                          : passwordStrength === 2 ? '#d97706'
                          : passwordStrength === 3 ? '#2563eb'
                          : '#059669',
                        fontFamily: "'Poppins', sans-serif"
                      }}>
                        {passwordStrength === 1 ? '⚠️ Weak' : passwordStrength === 2 ? '📊 Fair' : passwordStrength === 3 ? '✓ Good' : '🔒 Strong'} Password
                      </p>
                      {passwordStrength === 4 && (
                        <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-emerald-500 font-bold text-lg">✓</motion.span>
                      )}
                    </div>
                  </motion.div>
                )}
              </motion.div>
              
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4 sm:mt-5 mb-8 sm:mb-10">
                <motion.button 
                  type="button"
                  onClick={() => { setIsSignUp(!isSignUp); setError(''); setSuccessMessage(''); }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="text-sm sm:text-base font-600 transition-all hover:opacity-80 px-3 py-1.5 rounded-lg hover:bg-blue-500/10"
                  style={{ color: theme.primary, fontFamily: "'Poppins', sans-serif" }}
                >
                  {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                </motion.button>
                <motion.button 
                  type="button"
                  onClick={handleForgotPassword} 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="text-sm sm:text-base font-600 transition-all hover:opacity-80 px-3 py-1.5 rounded-lg hover:bg-blue-500/10"
                  style={{ color: theme.primary, fontFamily: "'Poppins', sans-serif" }}
                >
                  Forgot password?
                </motion.button>
              </div>
              
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -15, scale: 0.95 }}
                  transition={{ duration: 0.4, type: 'spring', stiffness: 300, damping: 25 }}
                  className="p-4 sm:p-5 rounded-2xl mb-6 sm:mb-8 border-l-4 backdrop-blur-sm"
                  style={{
                    backgroundColor: isDark ? 'rgba(220, 38, 38, 0.15)' : 'rgba(220, 38, 38, 0.1)',
                    borderColor: errorColor
                  }}
                >
                  <div className="flex items-start gap-3">
                    <motion.span 
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="text-2xl flex-shrink-0 mt-0.5"
                    >
                      ⚠️
                    </motion.span>
                    <p className="text-sm sm:text-base font-600 leading-relaxed" style={{ color: errorColor, fontFamily: "'Poppins', sans-serif" }}>
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
                  className="p-4 sm:p-5 rounded-2xl mb-6 sm:mb-8 border-l-4 backdrop-blur-sm"
                  style={{
                    backgroundColor: isDark ? 'rgba(5, 150, 105, 0.15)' : 'rgba(5, 150, 105, 0.1)',
                    borderColor: successColor
                  }}
                >
                  <div className="flex items-start gap-3">
                    <motion.span 
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="text-2xl flex-shrink-0 mt-0.5"
                    >
                      ✓
                    </motion.span>
                    <p className="text-sm sm:text-base font-600 leading-relaxed" style={{ color: successColor, fontFamily: "'Poppins', sans-serif" }}>
                      {successMessage}
                    </p>
                  </div>
                </motion.div>
              )}
              
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                whileHover={canSubmit && !loading ? { scale: 1.03, y: -3 } : {}}
                whileTap={canSubmit && !loading ? { scale: 0.97 } : {}}
                type="submit"
                disabled={loading || !canSubmit}
                className="w-full py-5 sm:py-6 text-white font-bold rounded-2xl transition-all duration-300 flex items-center justify-center relative overflow-hidden group text-base sm:text-lg shadow-lg"
                style={{
                  background: canSubmit && !loading
                    ? `linear-gradient(135deg, ${theme.primary}, ${theme.primaryDark})`
                    : `linear-gradient(135deg, ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(37,99,235,0.08)'}, ${isDark ? 'rgba(255,255,255,0.03)' : 'rgba(37,99,235,0.03)'})`,
                  boxShadow: canSubmit && !loading
                    ? `0 12px 40px ${theme.primary}50, inset 0 1px 0 rgba(255,255,255,0.2)`
                    : 'none',
                  cursor: canSubmit && !loading ? 'pointer' : 'not-allowed',
                  fontFamily: "'Poppins', sans-serif",
                  letterSpacing: '0.5px'
                }}
              >
                {/* Animated background effect */}
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                  animate={canSubmit && !loading ? { backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'] } : {}}
                  transition={{ duration: 3, repeat: Infinity }}
                  style={{
                    background: 'linear-gradient(45deg, white, transparent)',
                    backgroundSize: '200% 200%'
                  }}
                />
                
                <div className="relative z-10 flex items-center justify-center gap-3">
                  {loading ? (
                    <motion.svg 
                      className="animate-spin h-6 w-6 sm:h-7 sm:w-7" 
                      viewBox="0 0 24 24"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                    >
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 6.627 5.373 12 12 12v-4c-3.314 0-6-2.686-6-6z"></path>
                    </motion.svg>
                  ) : (
                    <motion.span animate={canSubmit ? { opacity: [0.7, 1, 0.7] } : {}} transition={{ duration: 2, repeat: Infinity }} className="text-lg sm:text-xl font-bold">
                      ✓
                    </motion.span>
                  )}
                  <span className="font-700 tracking-wide">
                    {loading ? (isSignUp ? 'Creating Account...' : 'Signing In...') : (isSignUp ? 'Sign Up' : 'Login')}
                  </span>
                </div>
              </motion.button>
            </form>
            
            <div className="flex items-center my-7 sm:my-8">
              <div className="flex-1 h-px" style={{ backgroundColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(37, 99, 235, 0.15)' }}></div>
              <span className="px-4 text-sm sm:text-base font-600" style={{ color: isDark ? '#9ca3af' : '#6b7280', fontFamily: "'Poppins', sans-serif" }}>OR</span>
              <div className="flex-1 h-px" style={{ backgroundColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(37, 99, 235, 0.15)' }}></div>
            </div>
            
            <div className="mt-0 space-y-4">
              <div className="flex justify-center">
                <motion.button
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleGoogleLogin}
                  className="w-full py-5 sm:py-6 rounded-2xl text-base sm:text-lg font-700 shadow-lg transition-all duration-300 flex items-center justify-center gap-3 hover:shadow-xl"
                  style={{
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.88)',
                    border: `1.5px solid ${isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(37, 99, 235, 0.25)'}`,
                    color: isDark ? '#ffffff' : '#1f2937',
                    backdropFilter: 'blur(15px)',
                    boxShadow: isDark ? '0 8px 32px rgba(37, 99, 235, 0.12)' : '0 8px 32px rgba(37, 99, 235, 0.1)',
                    fontFamily: "'Poppins', sans-serif",
                    letterSpacing: '0.3px'
                  }}
                >
                  <svg className="w-7 h-7 sm:w-8 sm:h-8" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="font-700">Continue with Google</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

export default Auth
