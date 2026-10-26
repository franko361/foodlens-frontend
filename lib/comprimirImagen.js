export async function comprimirImagen(file, maxLado = 1200, calidad = 0.8, formato = 'image/jpeg') {
  if (!file.type.startsWith('image/')) return file
  const bitmap = await createImageBitmap(file)
  const escala = Math.min(1, maxLado / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bitmap.width * escala)
  canvas.height = Math.round(bitmap.height * escala)
  canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  const blob = await new Promise((res) => canvas.toBlob(res, formato, calidad))
  const ext = formato === 'image/png' ? 'png' : 'jpg'
  return new File([blob], file.name.replace(/\.\w+$/, `.${ext}`), { type: formato })
}