"use client"

const OPTIONS = [
  { value: "square", label: "Cuadrado", radius: "rounded-none" },
  { value: "rounded", label: "Redondeado", radius: "rounded-full" },
]

export function ShapePicker({ selected, color, onChange }) {
  return (
    <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Forma de botones">
      {OPTIONS.map((option) => {
        const isActive = selected === option.value
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            aria-label={option.label}
            onClick={() => onChange(option.value)}
            className={`flex flex-col items-center gap-3 rounded-lg border-2 bg-card p-4 transition-colors ${
              isActive ? "border-primary" : "border-border hover:border-muted-foreground/40"
            }`}
          >
            <span
              className={`flex h-9 w-24 items-center justify-center text-xs font-semibold text-white ${option.radius}`}
              style={{ backgroundColor: color }}
            >
              Ordenar
            </span>
            <span className={`text-sm font-medium ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
              {option.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}