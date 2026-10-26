export const FUENTES = [
  { value: "moderna", label: "Moderna", familia: "var(--font-geist-sans), system-ui, sans-serif" },
  { value: "elegante", label: "Elegante", familia: "var(--font-playfair), Georgia, serif" },
  { value: "clasica", label: "Clásica", familia: "var(--font-lora), Georgia, serif" },
  { value: "redondeada", label: "Redondeada", familia: "var(--font-nunito), system-ui, sans-serif" },
  { value: "marcada", label: "Marcada", familia: "var(--font-montserrat), system-ui, sans-serif" },
]

// Devuelve la familia CSS de una fuente; si el valor no existe, usa la moderna
export function familiaDeFuente(valor) {
  return (FUENTES.find((f) => f.value === valor) || FUENTES[0]).familia
}