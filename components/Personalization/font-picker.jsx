"use client"

import { FUENTES } from "@/lib/fuentes"

export function FontPicker({ selected, onChange }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3" role="radiogroup" aria-label="Tipografía">
      {FUENTES.map((fuente) => {
        const isActive = selected === fuente.value
        return (
          <button
            key={fuente.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            aria-label={fuente.label}
            onClick={() => onChange(fuente.value)}
            className={`flex flex-col items-center gap-1 rounded-lg border-2 bg-card p-4 transition-colors ${
              isActive ? "border-primary" : "border-border hover:border-muted-foreground/40"
            }`}
          >
            <span className="text-3xl text-foreground" style={{ fontFamily: fuente.familia }}>
              Aa
            </span>
            <span
              className={`text-sm font-medium ${isActive ? "text-foreground" : "text-muted-foreground"}`}
              style={{ fontFamily: fuente.familia }}
            >
              {fuente.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}