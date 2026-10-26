'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { X, Upload, Box } from 'lucide-react'
import { subirImagenPlato, subirModelo3D, actualizarPlato } from '@/lib/api'
import { comprimirImagen } from '@/lib/comprimirImagen'

const PLATO_VACIO = {
  nombre: '',
  descripcion: '',
  precio: '',
  calorias_estimadas: '',
  proteinas: '',
  carbohidratos: '',
  categoria_id: '',
}

export function PlatoForm({ open, onClose, onGuardar, onGuardado, platoInicial, categorias = [] }) {
  const [form, setForm] = useState(PLATO_VACIO)
  const [archivoImagen, setArchivoImagen] = useState(null)
  const [previewImagen, setPreviewImagen] = useState(null)
  const [archivoModelo3d, setArchivoModelo3d] = useState(null)
  const [tieneModelo3d, setTieneModelo3d] = useState(false)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')
  const [idCreado, setIdCreado] = useState(null)

  const esEdicion = !!platoInicial

  useEffect(() => {
    if (platoInicial) {
      setForm({
        nombre: platoInicial.nombre || '',
        descripcion: platoInicial.descripcion || '',
        precio: platoInicial.precio ?? '',
        calorias_estimadas: platoInicial.calorias_estimadas ?? '',
        proteinas: platoInicial.proteinas ?? '',
        carbohidratos: platoInicial.carbohidratos ?? '',
        categoria_id: platoInicial.categoria_id || '',
      })
      setPreviewImagen(platoInicial.imagen_url || null)
      setTieneModelo3d(!!platoInicial.modelo_3d_url)
    } else {
      setForm(PLATO_VACIO)
      setPreviewImagen(null)
      setTieneModelo3d(false)
    }
    setArchivoImagen(null)
    setArchivoModelo3d(null)
    setError('')
    setIdCreado(null)
  }, [platoInicial, open])

  function handleChange(campo, valor) {
    setForm((prev) => ({ ...prev, [campo]: valor }))
  }

  async function handleImagenSeleccionada(file) {
  if (!file) return
  const comprimida = await comprimirImagen(file)
  setArchivoImagen(comprimida)
  setPreviewImagen(URL.createObjectURL(comprimida))
}

  function handleModelo3dSeleccionado(file) {
    if (!file) return
    if (!file.name.toLowerCase().endsWith('.glb')) {
      setError('El modelo 3D debe ser un archivo .glb')
      return
    }
    setError('')
    setArchivoModelo3d(file)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.nombre.trim() || !form.precio) {
      setError('Nombre y precio son obligatorios.')
      return
    }
    setError('')
    setGuardando(true)
    let platoId = platoInicial?.id || idCreado
    let guardado = false
    try {
      const datosPlato = {
        ...form,
        precio: Number(form.precio),
        calorias_estimadas: form.calorias_estimadas ? Number(form.calorias_estimadas) : null,
        proteinas: form.proteinas ? Number(form.proteinas) : null,
        carbohidratos: form.carbohidratos ? Number(form.carbohidratos) : null,
        categoria_id: form.categoria_id || null,
        ...(platoInicial || idCreado ? {} : { estado: 'activo' }),
      }

      if (idCreado && !platoInicial) {
        // El plato ya se creó en un intento anterior: solo se actualiza
        await actualizarPlato(idCreado, datosPlato)
      } else {
        const platoGuardado = await onGuardar(datosPlato)
        platoId = platoInicial?.id || platoGuardado?.id
        if (!platoInicial) setIdCreado(platoId)
      }
      guardado = true

      if (archivoImagen && platoId) {
        await subirImagenPlato(platoId, archivoImagen)
      }
      if (archivoModelo3d && platoId) {
        await subirModelo3D(platoId, archivoModelo3d)
      }

      onGuardado?.()
      onClose()
    } catch (err) {
      setError(err.message)
      // Si el plato ya quedó guardado pero falló la foto o el modelo, refresca la lista
      if (guardado) onGuardado?.()
    } finally {
      setGuardando(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl bg-card p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">
            {esEdicion ? 'Editar plato' : 'Nuevo plato'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {/* Selector de imagen */}
          <div className="flex items-center gap-4">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-dashed border-border bg-muted">
              {previewImagen ? (
                <Image src={previewImagen} alt="Vista previa" fill sizes="80px" className="object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                  <Upload className="h-5 w-5" />
                </div>
              )}
            </div>
            <label className="cursor-pointer rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted">
              {previewImagen ? 'Cambiar foto' : 'Subir foto'}
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) => handleImagenSeleccionada(e.target.files?.[0])}
              />
            </label>
          </div>

          {/* Selector de modelo 3D */}
          <div className="flex items-center gap-4 rounded-lg border border-dashed border-border p-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
              <Box className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-foreground">
                {archivoModelo3d
                  ? archivoModelo3d.name
                  : tieneModelo3d
                    ? 'Ya tiene un modelo 3D cargado'
                    : 'Sin modelo 3D'}
              </p>
              <p className="text-[11px] text-muted-foreground">Formato .glb, para vista en AR</p>
            </div>
            <label className="cursor-pointer shrink-0 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted">
              {tieneModelo3d ? 'Cambiar' : 'Subir'}
              <input
                type="file"
                accept=".glb"
                className="sr-only"
                onChange={(e) => handleModelo3dSeleccionado(e.target.files?.[0])}
              />
            </label>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              Nombre *
            </label>
            <input
              type="text"
              value={form.nombre}
              onChange={(e) => handleChange('nombre', e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/30"
              placeholder="Ej. Lomo Saltado"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              Descripción
            </label>
            <textarea
              value={form.descripcion}
              onChange={(e) => handleChange('descripcion', e.target.value)}
              rows={10}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/30"
              placeholder="Cuéntanos sobre este producto: describe sus ingredientes, preparación, características, sabor, tamaño, acompañamientos y cualquier otro detalle que ayude a tus clientes a conocerlo mejor. El asistente de IA utilizará esta información para responder preguntas sobre este producto."
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                Precio (S/) *
              </label>
              <input
                type="number"
                step="0.01"
                value={form.precio}
                onChange={(e) => handleChange('precio', e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/30"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                Calorías
              </label>
              <input
                type="number"
                value={form.calorias_estimadas}
                onChange={(e) => handleChange('calorias_estimadas', e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/30"
                placeholder="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                Proteínas (g)
              </label>
              <input
                type="number"
                value={form.proteinas}
                onChange={(e) => handleChange('proteinas', e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/30"
                placeholder="0"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                Carbohidratos (g)
              </label>
              <input
                type="number"
                value={form.carbohidratos}
                onChange={(e) => handleChange('carbohidratos', e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/30"
                placeholder="0"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              Categoría
            </label>
            <select
              value={form.categoria_id}
              onChange={(e) => handleChange('categoria_id', e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/30"
            >
              <option value="">Sin categoría</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nombre}
                </option>
              ))}
            </select>
          </div>

          {error && <p className="text-xs text-destructive">{error}</p>}

          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={guardando}
              className="flex-1 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50"
            >
              {guardando ? 'Guardando...' : esEdicion ? 'Guardar cambios' : 'Crear plato'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}