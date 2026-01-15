import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from './supabaseClient'
import ErrorBoundary from './components/ErrorBoundary'
import { ThemeProvider } from './contexts/ThemeContext'
// import Auth from './pages/Auth'
import Auth from './pages/AuthSplit'
import Dashboard from './pages/Dashboard'

const DEBUG = false // Set to true for development console logs

function App() {
  if (DEBUG) console.log('App component rendering')
  const [user, setUser] = useState(null)
  const [displayName, setDisplayName] = useState('')

  const fetchProfile = async () => {
    if (user) {
      const { data, error } = await supabase.from('profiles').select('display_name').eq('id', user.id).single()
      console.log('[APP fetchProfile] profiles table:', data, 'error:', error)
      if (data && !error) {
        console.log('[APP setDisplayName]', data.display_name)
        setDisplayName(data.display_name || '')
      }
    }
  }

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (DEBUG) console.log('Initial user check:', user ? 'Logged in' : 'Not logged in', user?.id)
      setUser(user)
    }
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (DEBUG) console.log('Auth state change:', _event, 'User:', session?.user?.id || 'null')
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    fetchProfile()
  }, [user])

  return (
    <ThemeProvider>
      <ErrorBoundary>
        <AnimatePresence mode="wait">
          {user ? (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              style={{ width: "100%", height: "100%" }}
            >
              <Dashboard user={user} displayName={displayName} />
            </motion.div>
          ) : (
            <motion.div
              key="auth"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              style={{ width: "100%", height: "100%" }}
            >
              <Auth />
            </motion.div>
          )}
        </AnimatePresence>
      </ErrorBoundary>
    </ThemeProvider>
  )
}

export default App