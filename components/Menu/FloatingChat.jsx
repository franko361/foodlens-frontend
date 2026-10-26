'use client'

import { useEffect, useRef, useState } from 'react'
import { Sparkles, Send, X } from 'lucide-react'
import { preguntarGeneral, getSugerenciasChat } from '@/lib/api'
import { useAccessibility } from '@/lib/AccessibilityContext'

export function FloatingChat({ tenantSlug, nombreRestaurante }) {
  const { idioma } = useAccessibility()
  const [abierto, setAbierto] = useState(false)
  const [sugerencias, setSugerencias] = useState([])
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'ai',
      text: `¡Hola! Soy el asistente de ${nombreRestaurante}. Pregúntame sobre cualquier plato del menú o sobre el restaurante.`,
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef(null)

  // Trae las sugerencias y el mensaje de bienvenida ya generados para este restaurante
  useEffect(() => {
    if (!tenantSlug) return
    getSugerenciasChat(tenantSlug)
      .then((data) => {
        setSugerencias(data.sugerencias || [])
        if (data.bienvenida) {
          setMessages([{ id: 1, role: 'ai', text: data.bienvenida }])
        }
      })
      .catch(() => setSugerencias([]))
  }, [tenantSlug])

  async function sendMessage(text) {
    const trimmed = text.trim()
    if (!trimmed || loading) return

    const userMsg = { id: Date.now(), role: 'user', text: trimmed }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)

    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
    })

    try {
      const data = await preguntarGeneral(tenantSlug, trimmed, idioma)
      setMessages((prev) => [...prev, { id: Date.now() + 1, role: 'ai', text: data.respuesta }])
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: 'ai', text: 'Hubo un problema al consultar. Intenta de nuevo.' },
      ])
    } finally {
      setLoading(false)
      requestAnimationFrame(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
      })
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    sendMessage(input)
  }

  // Solo muestra las sugerencias antes de la primera pregunta del cliente
  const mostrarSugerencias = sugerencias.length > 0 && messages.length === 1

  return (
    <>
      {!abierto && (
        <div className="fixed inset-x-0 bottom-5 z-40 mx-auto h-14 w-14">
          <span
            className="absolute inset-0 animate-ping rounded-full opacity-40"
            style={{ background: 'var(--primario)' }}
            aria-hidden="true"
          />
          <button
            type="button"
            onClick={() => setAbierto(true)}
            aria-label="Abrir chat"
            className="relative flex h-full w-full items-center justify-center rounded-full text-white transition-transform hover:scale-110 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, var(--primario), color-mix(in srgb, var(--primario) 50%, #7c3aed))',
              boxShadow: '0 0 24px color-mix(in srgb, var(--primario) 65%, transparent), inset 0 0 0 1px rgba(255,255,255,0.25)',
            }}
          >
            <Sparkles className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      )}

      {abierto && (
        <div className="fixed inset-x-0 bottom-5 z-40 mx-auto flex h-[75vh] w-[92vw] max-w-md flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
          <header className="flex items-center justify-between gap-2 border-b border-border bg-primario px-4 py-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4.5 w-4.5 text-white" />
              <span className="text-sm font-semibold text-white">Asistente {nombreRestaurante}</span>
            </div>
            <button
              type="button"
              onClick={() => setAbierto(false)}
              aria-label="Cerrar chat"
              className="rounded-full p-1 text-white/80 hover:bg-white/10"
            >
              <X className="h-4 w-4" />
            </button>
          </header>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-3 py-4">
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
                    m.role === 'user'
                      ? 'rounded-br-md bg-primario text-white'
                      : 'rounded-bl-md bg-muted text-foreground'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {loading && <p className="text-xs text-muted-foreground">Escribiendo...</p>}
          </div>

          {/* Sugerencias generadas por IA, basadas en el menú real del restaurante */}
          {mostrarSugerencias && (
            <div className="flex gap-2 overflow-x-auto border-t border-border px-3 pb-2 pt-3">
              {sugerencias.map((s, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => sendMessage(s)}
                  className="shrink-0 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primario hover:text-primario"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-border p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Pregunta sobre el menú o el local..."
              className="h-10 flex-1 rounded-full border border-input bg-background px-3.5 text-sm outline-none focus:ring-2 focus:ring-ring/30"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              aria-label="Enviar"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primario text-white disabled:opacity-40"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </>
  )
}