'use client'

import { createContext, useContext, useEffect, useState } from 'react'

const AccessibilityContext = createContext(null)

const TAMANOS = ['normal', 'grande', 'muy-grande']
const ESCALA_POR_TAMANO = { normal: '1', grande: '1.15', 'muy-grande': '1.3' }

export function AccessibilityProvider({ children }) {
  const [tema, setTema] = useState('claro')
  const [tamano, setTamano] = useState('normal')
  const [idioma, setIdioma] = useState('es') // código corto para guardar; el nombre completo se usa al traducir

  // Cargar preferencias guardadas al iniciar
  useEffect(() => {
    const temaGuardado = localStorage.getItem('foodlens_tema')
    const tamanoGuardado = localStorage.getItem('foodlens_tamano')
    const idiomaGuardado = localStorage.getItem('foodlens_idioma')
    if (temaGuardado) setTema(temaGuardado)
    if (tamanoGuardado) setTamano(tamanoGuardado)
    if (idiomaGuardado) setIdioma(idiomaGuardado)
  }, [])

  // Aplicar tema (clase "dark" en <html>)
  useEffect(() => {
    document.documentElement.classList.toggle('dark', tema === 'oscuro')
    localStorage.setItem('foodlens_tema', tema)
  }, [tema])

  // Aplicar escala de texto (variable CSS global)
  useEffect(() => {
    document.documentElement.style.setProperty('--escala-texto', ESCALA_POR_TAMANO[tamano])
    localStorage.setItem('foodlens_tamano', tamano)
  }, [tamano])

  useEffect(() => {
    localStorage.setItem('foodlens_idioma', idioma)
  }, [idioma])

  function alternarTema() {
    setTema((t) => (t === 'claro' ? 'oscuro' : 'claro'))
  }

  function cambiarTamano(direccion) {
    setTamano((actual) => {
      const idx = TAMANOS.indexOf(actual)
      const nuevoIdx = direccion === 'aumentar'
        ? Math.min(idx + 1, TAMANOS.length - 1)
        : Math.max(idx - 1, 0)
      return TAMANOS[nuevoIdx]
    })
  }

  return (
    <AccessibilityContext.Provider
      value={{ tema, alternarTema, tamano, cambiarTamano, idioma, setIdioma }}
    >
      {children}
    </AccessibilityContext.Provider>
  )
}

export function useAccessibility() {
  const ctx = useContext(AccessibilityContext)
  if (!ctx) throw new Error('useAccessibility debe usarse dentro de AccessibilityProvider')
  return ctx
}