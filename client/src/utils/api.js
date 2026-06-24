// client/src/utils/api.js
// Capa de comunicación con el backend FastAPI.
// Vite redirige /api -> http://localhost:8000/api gracias al proxy en vite.config.js

const API = '/api'

// Obtiene la configuración por defecto (función, límites)
export async function getConfig() {
  const res = await fetch(`${API}/config`)
  return res.json()
}

// Genera SVG de la onda coseno con los parámetros actuales
export async function fetchWave(params) {
  const res = await fetch(`${API}/wave`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  })
  return res.json()
}

// Calcula el área bajo la curva usando el método numérico solicitado
export async function fetchArea(params) {
  const res = await fetch(`${API}/area`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  })
  return res.json()
}
