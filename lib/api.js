// Funciones centralizadas para hablar con el backend de FoodLens (FastAPI)

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function getToken() {
  if (typeof window === "undefined") return null
  return localStorage.getItem("foodlens_token")
}

export function getUsuarioActual() {
  if (typeof window === "undefined") return null
  const raw = localStorage.getItem("foodlens_usuario")
  return raw ? JSON.parse(raw) : null
}

export function cerrarSesion() {
  localStorage.removeItem("foodlens_token")
  localStorage.removeItem("foodlens_usuario")
}

// Envuelve fetch agregando el token automáticamente, para rutas protegidas
async function fetchProtegido(path, options = {}) {
  const token = getToken()
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  })
  let data = {}
  try {
    data = await res.json()
  } catch {}
  if (!res.ok) {
    const detalle = typeof data.detail === "string" ? data.detail : null
    if (res.status === 403 && detalle?.includes("suspendida")) {
      window.dispatchEvent(new Event("cuenta-suspendida"))
    }
    throw new Error(detalle || "Error en la petición")
  }
  return data
}

// ---------- Rutas públicas ----------

export async function getPlatosPorRestaurante(tenantSlug) {
  const res = await fetch(`${API_URL}/platos/${tenantSlug}`)
  if (!res.ok) throw new Error("No se pudo cargar el menú")
  return res.json()
}

export async function getTenants() {
  const res = await fetch(`${API_URL}/tenants`)
  if (!res.ok) throw new Error("No se pudo cargar la lista de restaurantes")
  return res.json()
}


// ---------- Rutas protegidas (requieren login) ----------

export async function getMisPlatos() {
  return fetchProtegido("/admin/platos")
}

export async function crearPlato(datos) {
  return fetchProtegido("/admin/platos", {
    method: "POST",
    body: JSON.stringify(datos),
  })
}

export async function actualizarPlato(platoId, datos) {
  return fetchProtegido(`/admin/platos/${platoId}`, {
    method: "PUT",
    body: JSON.stringify(datos),
  })
}

export async function eliminarPlato(platoId) {
  return fetchProtegido(`/admin/platos/${platoId}`, {
    method: "DELETE",
  })
}

export async function getTodosLosTenants() {
  return fetchProtegido("/admin/tenants")
}

export async function actualizarTenant(tenantId, datos) {
  return fetchProtegido(`/admin/tenants/${tenantId}`, {
    method: "PUT",
    body: JSON.stringify(datos),
  })
}

// Trae los datos del tenant del usuario actualmente logueado (ruta protegida).
export async function getMiTenant() {
  return fetchProtegido("/admin/mi-tenant")
}

// Sube una imagen para un plato específico
export async function subirImagenPlato(platoId, archivo) {
  const token = getToken()
  const formData = new FormData()
  formData.append("file", archivo)

  const res = await fetch(`${API_URL}/admin/platos/${platoId}/imagen`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.detail || "No se pudo subir la imagen")
  return data
}

// Sube el logo del restaurante a Storage y devuelve la URL pública
export async function subirLogoTenant(archivo) {
  const token = getToken()
  const formData = new FormData()
  formData.append("file", archivo)

  const res = await fetch(`${API_URL}/admin/tenant/logo`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.detail || "No se pudo subir el logo")
  return data
}



// Sube un modelo 3D (.glb) para un plato específico
export async function subirModelo3D(platoId, archivo) {
  const token = getToken()
  const formData = new FormData()
  formData.append("file", archivo)

  const res = await fetch(`${API_URL}/admin/platos/${platoId}/modelo3d`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.detail || "No se pudo subir el modelo 3D")
  return data
}

// ---------- Categorías ----------

export async function getMisCategorias() {
  return fetchProtegido("/admin/categorias")
}

export async function crearCategoria(datos) {
  return fetchProtegido("/admin/categorias", {
    method: "POST",
    body: JSON.stringify(datos),
  })
}

export async function eliminarCategoria(categoriaId) {
  return fetchProtegido(`/admin/categorias/${categoriaId}`, {
    method: "DELETE",
  })
}

// ---------- Traducción / idiomas ----------

export const IDIOMAS_DISPONIBLES = [
  { codigo: 'es', nombre: 'Español' },
  { codigo: 'en', nombre: 'English' },
  { codigo: 'pt', nombre: 'Português' },
  { codigo: 'fr', nombre: 'Français' },
  { codigo: 'de', nombre: 'Deutsch' },
  { codigo: 'it', nombre: 'Italiano' },
  { codigo: 'zh', nombre: '中文' },
  { codigo: 'ja', nombre: '日本語' },
  { codigo: 'ko', nombre: '한국어' },
  { codigo: 'ru', nombre: 'Русский' },
]

export function nombreIdioma(codigo) {
  return IDIOMAS_DISPONIBLES.find((i) => i.codigo === codigo)?.nombre || 'Español'
}

// Traduce una lista de textos, usando caché en localStorage para no repetir
// la misma traducción cada vez (ahorra llamadas a la IA).
export async function traducirTextos(textos, idiomaCodigo) {
  if (idiomaCodigo === 'es') return textos // ya están en español, no hay nada que traducir

  const claveCache = `foodlens_trad_${idiomaCodigo}_${textos.length}_${textos.join('|')}`
  const cacheado = sessionStorage.getItem(claveCache)
  if (cacheado) return JSON.parse(cacheado)

  const res = await fetch(`${API_URL}/traducir`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ textos, idioma_destino: idiomaCodigo }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.detail || 'No se pudo traducir')

  sessionStorage.setItem(claveCache, JSON.stringify(data.traducciones))
  return data.traducciones
}


export async function preguntarGeneral(tenantSlug, pregunta, idiomaCodigo, platoActualId = null) {
  const res = await fetch(`${API_URL}/ia/preguntar-general`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      tenant_slug: tenantSlug,
      pregunta,
      idioma: idiomaCodigo && idiomaCodigo !== "es" ? idiomaCodigo : null,
      plato_actual_id: platoActualId,
    }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.detail || "No se pudo obtener respuesta de la IA")
  return data
}

 
export async function getSugerenciasChat(tenantSlug) {
  const res = await fetch(`${API_URL}/tenant/${tenantSlug}/sugerencias-chat`)
  if (!res.ok) return { sugerencias: [] }
  return res.json()
}


// ---------- Super Admin avanzado ----------

export async function buscarTenants(query = "", estado = "", orden = "recientes") {
  const params = new URLSearchParams()
  if (query) params.append("q", query)
  if (estado) params.append("estado", estado)
  params.append("orden", orden)
  return fetchProtegido(`/admin/tenants/buscar?${params.toString()}`)
}
 
export async function getDetalleTenant(tenantId) {
  return fetchProtegido(`/admin/tenants/${tenantId}/detalle`)
}
 
export async function getMetricasGlobales() {
  return fetchProtegido("/admin/metricas-globales")
}

export async function crearTenant(datos) {
  return fetchProtegido("/admin/tenants", { method: "POST", body: JSON.stringify(datos) })
}

export async function crearUsuario(datos) {
  return fetchProtegido("/admin/usuarios", { method: "POST", body: JSON.stringify(datos) })
}