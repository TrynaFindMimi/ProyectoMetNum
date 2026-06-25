export interface WaveResponse {
  function_type: string
  x: number[]
  y: number[]
  available_functions: string[]
}

export interface InterpResponse {
  polynomial: string
  points: Array<{ x: number; y: number }>
}

export async function fetchWave(
  functionType: string,
  nControl: number,
  nPoints = 200,
  xMin = 0,
  xMax = 4,
): Promise<WaveResponse> {
  const res = await fetch('/wave', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      function_type: functionType,
      n_control: nControl,
      n_points: nPoints,
      x_min: xMin,
      x_max: xMax,
    }),
  })
  if (!res.ok) throw new Error(`Error: ${res.statusText}`)
  return res.json()
}

export async function fetchInterpolate(
  x: number[],
  y: number[],
  nPoints = 10,
): Promise<InterpResponse> {
  const res = await fetch('/interpolate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ x, y, n_points: nPoints }),
  })
  if (!res.ok) throw new Error(`Error: ${res.statusText}`)
  return res.json()
}
