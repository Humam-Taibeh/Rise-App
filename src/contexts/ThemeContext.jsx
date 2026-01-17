import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { getSetting } from '../utils/storageManager.js'
import { applyTheme, darkenColor } from '../utils/colorUtils.js'
import { THEME_COLORS } from '../constants/config.js'

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
  background: '#f6f7fb',
  surface: '#ffffff',
  surfaceLight: '#f8fafc',
  border: '#e2e8f0',
  error: '#ef4444',
  success: '#10b981',
  warning: '#f59e0b',
}

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('themeMode') || localStorage.getItem('theme-mode')
      if (savedTheme) {
        return savedTheme === 'dark'
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    return true
  })

  const currentTheme = isDark ? DARK_THEME : LIGHT_THEME
  const [accentHex, setAccentHex] = useState(() => {
    const storedThemeColor = getSetting('themeColor')
    const storedCustomColor = getSetting('customColor')
    if (storedThemeColor === 'custom') return storedCustomColor
    return THEME_COLORS?.[storedThemeColor]?.primary || THEME_COLORS.blue.primary
  })
  const [accentDarkHex, setAccentDarkHex] = useState(() => {
    const storedThemeColor = getSetting('themeColor')
    const storedCustomColor = getSetting('customColor')
    const baseHex = storedThemeColor === 'custom' ? storedCustomColor : THEME_COLORS?.[storedThemeColor]?.primary || THEME_COLORS.blue.primary
    const [r, g, b] = darkenColor(baseHex)
    return `#${[r, g, b].map(v => v.toString(16).padStart(2, '0')).join('')}`
  })

  const theme = {
    ...currentTheme,
    primary: accentHex,
    primaryLight: accentHex,
    primaryDark: accentDarkHex,
    accent: accentHex
  }

  const syncAccent = useCallback(() => {
    const storedThemeColor = getSetting('themeColor')
    const storedCustomColor = getSetting('customColor')
    applyTheme(storedThemeColor, storedCustomColor)

    const nextHex = storedThemeColor === 'custom'
      ? storedCustomColor
      : THEME_COLORS?.[storedThemeColor]?.primary || THEME_COLORS.blue.primary
    const [r, g, b] = darkenColor(nextHex)
    const nextDark = `#${[r, g, b].map(v => v.toString(16).padStart(2, '0')).join('')}`
    setAccentHex(nextHex)
    setAccentDarkHex(nextDark)
  }, [])

  useEffect(() => {
    const mode = isDark ? 'dark' : 'light'
    localStorage.setItem('themeMode', mode)
    localStorage.setItem('theme-mode', mode)

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

    syncAccent()
  }, [isDark, currentTheme, syncAccent])

  const setThemeMode = (mode) => {
    setIsDark(mode === 'dark')
  }

  const toggleTheme = () => {
    setIsDark(!isDark)
  }

  return (
    <ThemeContext.Provider value={{ isDark, themeMode: isDark ? 'dark' : 'light', setThemeMode, toggleTheme, syncAccent, theme }}>
      {children}
    </ThemeContext.Provider>
  )
}
