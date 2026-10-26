"use client"

const linea = "h-1.5 rounded-full bg-muted-foreground/30"

function Opcion({ activa, etiqueta, onClick, children }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={activa}
      aria-label={etiqueta}
      onClick={onClick}
      className={`flex flex-col items-center gap-3 rounded-lg border-2 bg-card p-4 transition-colors ${
        activa ? "border-primary" : "border-border hover:border-muted-foreground/40"
      }`}
    >
      {children}
      <span className={`text-sm font-medium ${activa ? "text-foreground" : "text-muted-foreground"}`}>
        {etiqueta}
      </span>
    </button>
  )
}

function DibujoFila({ anchoFoto }) {
  return (
    <div className="flex h-14 w-24 items-center gap-2 rounded-md border border-border p-1.5">
      <div className={`shrink-0 rounded bg-muted-foreground/30 ${anchoFoto}`} />
      <div className="flex flex-1 flex-col gap-1.5">
        <div className={`${linea} w-full`} />
        <div className={`${linea} w-2/3`} />
      </div>
    </div>
  )
}

function DibujoCuadricula() {
  return (
    <div className="flex h-14 w-24 gap-1.5">
      {[0, 1].map((i) => (
        <div key={i} className="flex flex-1 flex-col gap-1 rounded-md border border-border p-1">
          <div className="h-6 rounded bg-muted-foreground/30" />
          <div className={`${linea} w-full`} />
        </div>
      ))}
    </div>
  )
}

export function CardStylePicker({ disposicion, tamanoFoto, onChangeDisposicion, onChangeTamano }) {
  return (
    <div className="space-y-5">
      <div>
        <p className="mb-2 text-xs font-medium text-muted-foreground">Disposición</p>
        <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Disposición de las tarjetas">
          <Opcion activa={disposicion === "lista"} etiqueta="Lista" onClick={() => onChangeDisposicion("lista")}>
            <DibujoFila anchoFoto="h-full w-8" />
          </Opcion>
          <Opcion activa={disposicion === "cuadricula"} etiqueta="Cuadrícula" onClick={() => onChangeDisposicion("cuadricula")}>
            <DibujoCuadricula />
          </Opcion>
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-medium text-muted-foreground">Tamaño de la foto</p>
        <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Tamaño de la foto">
          <Opcion activa={tamanoFoto === "pequena"} etiqueta="Pequeña" onClick={() => onChangeTamano("pequena")}>
            <DibujoFila anchoFoto="h-6 w-6" />
          </Opcion>
          <Opcion activa={tamanoFoto === "grande"} etiqueta="Grande" onClick={() => onChangeTamano("grande")}>
            <DibujoFila anchoFoto="h-full w-11" />
          </Opcion>
        </div>
      </div>
    </div>
  )
}