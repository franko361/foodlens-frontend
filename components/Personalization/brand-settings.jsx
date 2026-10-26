"use client"

import { useEffect, useState } from "react"
import { Check, Palette, Square, ImageIcon, Store, AlertCircle, Type, LayoutGrid } from "lucide-react"
import { LogoUploader } from "./logo-uploader"
import { FontPicker } from "./font-picker"
import { ColorPicker, BRAND_COLORS } from "./color-picker"
import { ShapePicker } from "./shape-picker"
import { MenuPreview } from "./menu-preview"
import { getMiTenant, actualizarTenant, subirLogoTenant } from "@/lib/api"
import { CardStylePicker } from "./card-style-picker"

// El backend guarda "redondeado"/"cuadrado"; la UI usa "rounded"/"square".
const FORMA_BACKEND_A_UI = { redondeado: "rounded", cuadrado: "square" }
const FORMA_UI_A_BACKEND = { rounded: "redondeado", square: "cuadrado" }

function Section({ icon: Icon, title, description, children }) {
  return (
    <section className="rounded-xl border border-border bg-card p-6">
      <div className="mb-4 flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent text-primary">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-sm font-semibold text-foreground">{title}</h2>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      {children}
    </section>
  )
}

export function BrandSettings({ tenantId }) {
  const [logo, setLogo] = useState(null)
  const [logoArchivo, setLogoArchivo] = useState(null)
  const [restaurantName, setRestaurantName] = useState("")
  const [color, setColor] = useState(BRAND_COLORS[0].value)
  const [shape, setShape] = useState("rounded")
  const [fuente, setFuente] = useState("moderna")
  const [disposicion, setDisposicion] = useState("lista")
  const [tamanoFoto, setTamanoFoto] = useState("pequena")

  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!tenantId) return
    getMiTenant(tenantId)
      .then((tenant) => {
        setRestaurantName(tenant.nombre || "")
        setColor(tenant.color_primario || BRAND_COLORS[0].value)
        setShape(FORMA_BACKEND_A_UI[tenant.forma_boton] || "rounded")
        setLogo(tenant.logo_url || null)
        setFuente(tenant.fuente || "moderna")
        setDisposicion(tenant.disposicion_tarjetas || "lista")
        setTamanoFoto(tenant.tamano_foto || "pequena")
      })
      .catch((err) => setError(err.message))
      .finally(() => setCargando(false))
  }, [tenantId])


  function handleLogoChange(url, archivo) {
    setLogo(url)
    setLogoArchivo(archivo || null)
  }

  async function handleSave() {
    setGuardando(true)
    setError("")
    try {
      let logoUrl = logo
      if (logoArchivo) {
        const res = await subirLogoTenant(logoArchivo)
        logoUrl = res.logo_url
        setLogo(logoUrl)
        setLogoArchivo(null)
      }
      await actualizarTenant(tenantId, {
        nombre: restaurantName,
        color_primario: color,
        forma_boton: FORMA_UI_A_BACKEND[shape],
        logo_url: logoUrl,
        fuente,
        disposicion_tarjetas: disposicion,
        tamano_foto: tamanoFoto,
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (err) {
      setError(err.message)
    } finally {
      setGuardando(false)
    }
  }

  if (cargando) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
        <p className="text-sm text-muted-foreground">Cargando configuración...</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
      <header className="mb-8">
        <p className="text-sm font-medium text-primary">Panel de administración</p>
        <h1 className="mt-1 text-3xl font-semibold text-foreground">Configuración de marca</h1>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
          Personaliza cómo se ve el menú de tu restaurante. Los cambios se reflejan al instante en la vista previa.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <Section icon={Store} title="Nombre del restaurante" description="Aparece en la cabecera del menú.">
            <input
              type="text"
              value={restaurantName}
              onChange={(e) => setRestaurantName(e.target.value)}
              placeholder="Nombre del restaurante"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/30"
            />
          </Section>

          <Section icon={ImageIcon} title="Logo" description="Sube o cambia el logo circular del restaurante.">
            <LogoUploader logo={logo} onChange={handleLogoChange} />
          </Section>

          <Section icon={Type} title="Tipografía" description="Elige la letra que usará el menú.">
            <FontPicker selected={fuente} onChange={setFuente} />
          </Section>

          <Section icon={Palette} title="Color principal" description="Se usa en botones, acentos y la cabecera.">
            <ColorPicker selected={color} onChange={setColor} />
          </Section>

          <Section icon={LayoutGrid} title="Estilo de las tarjetas" description="Elige cómo se muestran los platos en el menú.">
            <CardStylePicker
              disposicion={disposicion}
              tamanoFoto={tamanoFoto}
              onChangeDisposicion={setDisposicion}
              onChangeTamano={setTamanoFoto}/>
          </Section>

          <Section icon={Square} title="Forma de los botones" description="Elige el estilo de las llamadas a la acción.">
            <ShapePicker selected={shape} color={color} onChange={setShape} />
          </Section>
        </div>

        <div className="lg:sticky lg:top-8 lg:self-start">
          <div className="mb-3 flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Vista previa en vivo
            </span>
          </div>
          <MenuPreview logo={logo} color={color} shape={shape} restaurantName={restaurantName} fuente={fuente} disposicion={disposicion} tamanoFoto={tamanoFoto}/>
        </div>
      </div>

      <div className="mt-8 flex flex-col items-center justify-end gap-3 border-t border-border pt-6 sm:flex-row">
        {error && (
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-destructive">
            <AlertCircle className="h-4 w-4" aria-hidden="true" />
            {error}
          </span>
        )}
        {saved && (
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary">
            <Check className="h-4 w-4" aria-hidden="true" />
            Cambios guardados
          </span>
        )}
        <button
          type="button"
          onClick={handleSave}
          disabled={guardando}
          className="inline-flex w-full items-center justify-center rounded-md bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50 sm:w-auto"
        >
          {guardando ? "Guardando..." : "Guardar cambios"}
        </button>
      </div>
    </div>
  )
}