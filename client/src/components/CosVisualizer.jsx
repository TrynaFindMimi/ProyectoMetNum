// client/src/components/CosVisualizer.jsx
// Componente principal de la app. Tiene dos tabs:
//   1. "Visualizador de Onda" — sliders para controlar una onda coseno y copiar el SVG
//   2. "Área bajo la curva"   — parámetros numéricos + método de integración, muestra
//      el área calculada por el backend y dibuja los rectángulos/trapecios en SVG puro.

import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { fetchWave, fetchArea } from '../utils/api'

// Métodos de integración disponibles. El backend recibe el value string.
const METHODS = [
  { value: 'left', label: 'Riemann Izq' },
  { value: 'right', label: 'Riemann Der' },
  { value: 'midpoint', label: 'Riemann Mid' },
  { value: 'trapezoidal', label: 'Trapecio' },
  { value: 'simpson', label: 'Simpson' },
]

// ─── Tab 1: Visualizador de onda coseno ─────────────────────────
// Genera un SVG de una onda coseno con controles deslizantes para
// frecuencia, amplitud, fase y offset vertical. Todo el cómputo
// se delega al backend (POST /api/wave).
function WaveTab() {
  const [freq, setFreq] = useState(1)
  const [amp, setAmp] = useState(1)
  const [phase, setPhase] = useState(0)
  const [offset, setOffset] = useState(0)
  const [color, setColor] = useState('#a78bfa')
  const [svg, setSvg] = useState('')
  const [copied, setCopied] = useState(false)

  // Cada vez que cambia un parámetro, pedimos el SVG al backend
  useEffect(() => {
    fetchWave({ freq, amp, phase, offset, color }).then(data => setSvg(data.svg))
  }, [freq, amp, phase, offset, color])

  // Convertimos el string SVG a un Blob URL para mostrarlo como imagen
  const svgBlob = useMemo(() => {
    if (!svg) return ''
    const blob = new Blob([svg], { type: 'image/svg+xml' })
    return URL.createObjectURL(blob)
  }, [svg])

  // Copia el código SVG al portapapeles. Si falla, descarga el archivo.
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(svg)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      const blob = new Blob([svg], { type: 'image/svg+xml' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'wave.svg'
      a.click()
      URL.revokeObjectURL(url)
    }
  }, [svg])

  return (
    <div className="card">
      {/* Vista previa del SVG renderizado */}
      <div className="preview">
        {svgBlob && <img src={svgBlob} alt="Wave SVG" />}
      </div>

      {/* Controles: sliders + color picker + botón copiar */}
      <div className="controls">
        <div className="control-group">
          <label>Frecuencia</label>
          <input type="range" min={0.1} max={5} step={0.1} value={freq}
            onChange={e => setFreq(Number(e.target.value))} />
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{freq.toFixed(1)}</span>
        </div>
        <div className="control-group">
          <label>Amplitud</label>
          <input type="range" min={0} max={2} step={0.1} value={amp}
            onChange={e => setAmp(Number(e.target.value))} />
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{amp.toFixed(1)}</span>
        </div>
        <div className="control-group">
          <label>Fase</label>
          <input type="range" min={0} max={6.28} step={0.01} value={phase}
            onChange={e => setPhase(Number(e.target.value))} />
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{phase.toFixed(2)}</span>
        </div>
        <div className="control-group">
          <label>Offset</label>
          <input type="range" min={-1} max={1} step={0.1} value={offset}
            onChange={e => setOffset(Number(e.target.value))} />
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{offset.toFixed(1)}</span>
        </div>
        <input type="color" value={color} onChange={e => setColor(e.target.value)} />
        <button className="btn btn-primary" onClick={handleCopy}>
          {copied ? '¡Copiado!' : 'Copiar SVG'}
        </button>
      </div>

      {/* Código SVG generado (texto, no imagen) */}
      <div className="code-block">{svg}</div>
    </div>
  )
}

// ─── Tab 2: Área bajo la curva ──────────────────────────────────
// Permite elegir intervalo [a, b], número de subintervalos (n) y
// método de integración. El backend devuelve el área calculada +
// los polígonos para dibujar cada subdivisión en el frontend.
function AreaTab() {
  const [a, setA] = useState(0)
  const [b, setB] = useState(10)
  const [n, setN] = useState(100)
  const [method, setMethod] = useState('trapezoidal')
  const [data, setData] = useState(null)

  // Dispara el cálculo cada vez que cambia algún parámetro
  const compute = useCallback(() => {
    fetchArea({ a, b, n, method }).then(setData)
  }, [a, b, n, method])

  useEffect(() => { compute() }, [compute])

  return (
    <div className="card">
      {/* Fila de controles: a, b, n, método */}
      <div className="controls" style={{ marginBottom: 16 }}>
        <div className="control-group">
          <label>Desde (a)</label>
          <input type="number" step={0.1} value={a}
            onChange={e => setA(Number(e.target.value))}
            style={{ width: '100%', padding: '6px 8px', borderRadius: 6, border: '1px solid #334155', background: '#0f172a', color: '#f1f5f9' }} />
        </div>
        <div className="control-group">
          <label>Hasta (b)</label>
          <input type="number" step={0.1} value={b}
            onChange={e => setB(Number(e.target.value))}
            style={{ width: '100%', padding: '6px 8px', borderRadius: 6, border: '1px solid #334155', background: '#0f172a', color: '#f1f5f9' }} />
        </div>
        <div className="control-group">
          <label>Subintervalos (n)</label>
          <input type="range" min={4} max={500} step={2} value={n}
            onChange={e => setN(Number(e.target.value))} />
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{n}</span>
        </div>
        <div className="control-group">
          <label>Método</label>
          <select value={method} onChange={e => setMethod(e.target.value)}
            style={{ width: '100%', padding: '6px 8px', borderRadius: 6, border: '1px solid #334155', background: '#0f172a', color: '#f1f5f9', cursor: 'pointer' }}>
            {METHODS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
          </select>
        </div>
      </div>

      {/* Resultados: solo se muestran cuando el backend respondió */}
      {data && (
        <>
          {/* Resumen numérico del área */}
          <div className="area-info">
            <div className="area-info-item">
              <div className="value">{data.area.toFixed(8)}</div>
              <div className="label">Área aproximada</div>
            </div>
            <div className="area-info-item">
              <div className="value">{data.method} (n={data.n})</div>
              <div className="label">Método</div>
            </div>
          </div>

          {/* Gráfico SVG generado con los datos del backend */}
          <div className="canvas-container">
            <AreaCanvas data={data} />
          </div>

          {/* Detalle en formato LaTeX-ish */}
          <div className="code-block">
            f(x) = sin(x + 1) &nbsp;|&nbsp; ∫{data.a.toFixed(2)}_{data.b.toFixed(2)} f(x) dx ≈ {data.area.toFixed(10)}
          </div>
        </>
      )}
    </div>
  )
}

// ─── Componente que dibuja el gráfico en SVG puro ───────────────
// Recibe la data del backend (curva, rectángulos/trapecios) y
// dibuja todo con coordenadas escaladas al viewBox.
function AreaCanvas({ data, width = 700, height = 350 }) {
  const { curve_x, curve_y, rects, a, b, method, area } = data

  // Márgenes internos para que los ejes no queden pegados al borde
  const margin = { top: 20, right: 20, bottom: 30, left: 40 }
  const innerW = width - margin.left - margin.right
  const innerH = height - margin.top - margin.bottom

  // Rangos de los datos
  const minX = a
  const maxX = b
  let minY = 0
  let maxY = 0
  for (const y of curve_y) {
    if (y < minY) minY = y
    if (y > maxY) maxY = y
  }
  const yPad = (maxY - minY) * 0.1 || 0.5  // 10% de padding vertical
  minY -= yPad
  maxY += yPad

  // Funciones de escala: mapean coordenadas del dominio al viewBox SVG
  const scaleX = (x) => margin.left + ((x - minX) / (maxX - minX)) * innerW
  const scaleY = (y) => margin.top + innerH - ((y - minY) / (maxY - minY)) * innerH

  // Path de la curva (línea quebrada de 1000 puntos)
  const curvePath = curve_x.map((x, i) => {
    const cmd = i === 0 ? 'M' : 'L'
    return `${cmd}${scaleX(x)},${scaleY(curve_y[i])}`
  }).join(' ')

  // Path para rellenar el área bajo Simpson
  const yZero = scaleY(0)
  const fillPath = curve_x.map((x, i) => {
    const cmd = i === 0 ? 'M' : 'L'
    return `${cmd}${scaleX(x)},${scaleY(curve_y[i])}`
  }).join(' ') + ` L${scaleX(curve_x[curve_x.length - 1])},${yZero} L${scaleX(curve_x[0])},${yZero} Z`

  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', display: 'block' }}>
      {/* Fondo oscuro */}
      <rect width={width} height={height} fill="#0f172a" />

      {/* Relleno semitransparente de los rectángulos/trapecios (excepto Simpson) */}
      {method !== 'simpson' && rects.map((rect, i) => {
        const pts = rect.map(p => `${scaleX(p[0])},${scaleY(p[1])}`).join(' ')
        return <polygon key={i} points={pts} fill="#a78bfa" fillOpacity="0.2" stroke="#a78bfa" strokeWidth="0.5" />
      })}

      {/* Para Simpson: relleno continuo del área bajo la curva */}
      {method === 'simpson' && (
        <path d={fillPath} fill="#a78bfa" fillOpacity="0.2" />
      )}

      {/* Línea de la función */}
      <path d={curvePath} fill="none" stroke="#818cf8" strokeWidth="2" />

      {/* Contorno de los rectángulos/trapecios */}
      {method !== 'simpson' && rects.map((rect, i) => {
        const pts = rect.map(p => `${scaleX(p[0])},${scaleY(p[1])}`).join(' ')
        return <polygon key={i} points={pts} fill="none" stroke="#f472b6" strokeWidth="1" />
      })}

      {/* Eje X en y=0 */}
      <line x1={scaleX(minX)} y1={yZero} x2={scaleX(maxX)} y2={yZero}
        stroke="#334155" strokeWidth="1" />

      {/* Etiqueta del 0 */}
      <text x={scaleX(maxX)} y={yZero - 4} fill="#64748b" fontSize="10"
        fontFamily="monospace">0</text>
    </svg>
  )
}

// ─── Componente exportado: tabs + contenido ─────────────────────
export default function WaveGenerator() {
  const [tab, setTab] = useState('wave')

  return (
    <div>
      <h1>Métodos Numéricos</h1>

      {/* Barra de pestañas */}
      <div className="tabs">
        <button className={`tab ${tab === 'wave' ? 'active' : ''}`}
          onClick={() => setTab('wave')}>Visualizador de Onda</button>
        <button className={`tab ${tab === 'area' ? 'active' : ''}`}
          onClick={() => setTab('area')}>Área bajo la curva</button>
      </div>

      {tab === 'wave' ? <WaveTab /> : <AreaTab />}
    </div>
  )
}
