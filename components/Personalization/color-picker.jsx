"use client"

import { Check, Plus } from "lucide-react"

export const BRAND_COLORS = [
  { name: "Terracota", value: "#d1603d" },
  { name: "Verde oliva", value: "#5c6b4c" },
  { name: "Vino", value: "#8b2e3c" },
  { name: "Mostaza", value: "#c99700" },
  { name: "Azul noche", value: "#2f4858" },
  { name: "Rojo cereza", value: "#c62828" },
  { name: "Coral", value: "#e0574f" },
  { name: "Naranja", value: "#e65100" },
  { name: "Rosa", value: "#c2185b" },
  { name: "Morado", value: "#7b1fa2" },
  { name: "Índigo", value: "#3949ab" },
  { name: "Azul", value: "#1565c0" },
  { name: "Turquesa", value: "#00838f" },
  { name: "Verde esmeralda", value: "#2e7d32" },
  { name: "Marrón", value: "#6d4c41" },
  { name: "Grafito", value: "#37474f" },
  { name: "Negro", value: "#212121" },
]

export function ColorPicker({ selected, onChange }) {
  const esPersonalizado = !!selected && !BRAND_COLORS.some((c) => c.value === selected)
  return (
    <div className="flex flex-wrap gap-3" role="radiogroup" aria-label="Color principal">
      {BRAND_COLORS.map((color) => {
        const isActive = selected === color.value
        return (
          <button
            key={color.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            aria-label={color.name}
            title={color.name}
            onClick={() => onChange(color.value)}
            className="relative flex h-11 w-11 items-center justify-center rounded-full transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            style={{
              backgroundColor: color.value,
              boxShadow: isActive ? `0 0 0 2px var(--background), 0 0 0 4px ${color.value}` : undefined,
            }}
          >
            {isActive && <Check className="h-5 w-5 text-white" strokeWidth={3} aria-hidden="true" />}
          </button>
        )
      })}
      
      <label
        title="Color personalizado"
        className="relative flex h-11 w-11 cursor-pointer items-center justify-center rounded-full transition-transform hover:scale-105"
        style={{
          background: esPersonalizado
            ? selected
            : "conic-gradient(red, yellow, lime, aqua, blue, magenta, red)",
          boxShadow: esPersonalizado
            ? `0 0 0 2px var(--background), 0 0 0 4px ${selected}`
            : undefined,
        }}
      >
        {esPersonalizado ? (
          <Check className="h-5 w-5 text-white" strokeWidth={3} aria-hidden="true" />
        ) : (
          <Plus className="h-5 w-5 text-white drop-shadow" aria-hidden="true" />
        )}
        <input
          type="color"
          value={selected || "#d1603d"}
          onChange={(e) => onChange(e.target.value)}
          aria-label="Color personalizado"
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        />
      </label>
    </div>
  )
}