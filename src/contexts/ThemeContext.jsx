import React, { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}

// Color palettes for light and dark modes
const DARK_THEME = {
  primary: '#2563eb', // Blue
  primaryDark: '#1e40af',
  primaryLight: '#3b82f6',
  secondary: '#000000', // Black
  accent: '#3b82f6',
  text: '#ffffff',
  textSecondary: '#d1d5db',
  background: '#000000',
  surface: '#0f172a',
  surfaceLight: '#1e293b',
  border: '#334155',
  error: '#ef4444',
  success: '#10b981',
  warning: '#f59e0b',
}

const LIGHT_THEME = {
  primary: '#2563eb', // Blue
  primaryDark: '#1e40af',
  primaryLight: '#3b82f6',
  secondary: '#ffffff', // White
  accent: '#2563eb',
  text: '#1f2937',
  textSecondary: '#6b7280',
  background: '#ffffff',
  surface: '#f9fafb',
  surfaceLight: '#f3f4f6',
  border: '#e5e7eb',
  error: '#ef4444',
  success: '#10b981',
  warning: '#f59e0b',
}

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme-mode')
      if (savedTheme) {
        return savedTheme === 'dark'
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    return true
  })

  const currentTheme = isDark ? DARK_THEME : LIGHT_THEME

  useEffect(() => {
    localStorage.setItem('theme-mode', isDark ? 'dark' : 'light')

    // Update HTML element class
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }

    // Set CSS variables for theme colors
    Object.entries(currentTheme).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--color-${key}`, value)
    })

    // Set accent color for CSS animations
    document.documentElement.style.setProperty('--accent-main', isDark ? '37 99 235' : '37 99 235')
  }, [isDark, currentTheme])

  const toggleTheme = () => {
    setIsDark(!isDark)
  }

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, theme: currentTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
