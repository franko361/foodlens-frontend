'use client'

export function CategoryTabs({ categorias, categoriaActiva, onSeleccionar, formaBoton = 'redondeado' }) {
  const radius = formaBoton === 'cuadrado' ? 'rounded-md' : 'rounded-full'

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {categorias.map((cat) => {
        const activa = cat === categoriaActiva
        return (
          <button
            key={cat}
            type="button"
            onClick={() => onSeleccionar(cat)}
            className={`shrink-0 whitespace-nowrap border px-4 py-2 text-sm font-medium transition-colors ${radius} ${
              activa
                ? 'border-primario bg-primario text-white'
                : 'border-border bg-card text-muted-foreground hover:bg-muted'
            }`}
          >
            {cat}
          </button>
        )
      })}
    </div>
  )
}