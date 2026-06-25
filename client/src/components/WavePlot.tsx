import { useMemo } from 'react'

interface WavePlotProps {
  data: { x: number[]; y: number[] }
  functionType: string
  showGrid: boolean
  showRef: boolean
  lineColor: string
  lineWidth: number
  lineStyle: 'solid' | 'dashed'
  lineOpacity: number
  fillAbove: boolean
  fillAboveColor: string
  fillBelow: boolean
  fillBelowColor: string
  showParallel: boolean
  parallelOffset: number
  parallelSameColor: boolean
  parallelColor: string
  parallelWidth: number
  parallelStyle: 'solid' | 'dashed'
  parallelOpacity: number
}

function fn(x: number, type: string): number {
  switch (type) {
    case 'sin': return Math.sin(x)
    case 'square': return x * x
    default: return Math.cos(x)
  }
}

function toSvgPoints(xs: number[], ys: number[], w: number, h: number, pad: number, yMin: number, yRange: number) {
  return xs
    .map((x, i) => {
      const px = pad + ((x - xs[0]!) / (xs[xs.length - 1]! - xs[0]!)) * (w - 2 * pad)
      const py = pad + (1 - (ys[i]! - yMin) / yRange) * (h - 2 * pad)
      return `${px},${py}`
    })
    .join(' ')
}

function fillPath(xs: number[], ys: number[], w: number, h: number, pad: number, yMin: number, yRange: number, edge: 'top' | 'bottom') {
  const xMin = xs[0]!
  const xMax = xs[xs.length - 1]!
  const xRange = xMax - xMin || 1
  const edgeY = edge === 'top' ? pad : h - pad

  let d = `M ${pad},${edgeY} `
  for (let i = 0; i < xs.length; i++) {
    const px = pad + ((xs[i]! - xMin) / xRange) * (w - 2 * pad)
    const py = pad + (1 - (ys[i]! - yMin) / yRange) * (h - 2 * pad)
    d += `L ${px},${py} `
  }
  d += `L ${w - pad},${edgeY} Z`
  return d
}

const FN_LABELS: Record<string, string> = {
  cos: 'f(x) = cos(x)',
  sin: 'f(x) = sin(x)',
  square: 'f(x) = x²',
}

export default function WavePlot({
  data, functionType, showGrid, showRef,
  lineColor, lineWidth, lineStyle, lineOpacity,
  fillAbove, fillAboveColor, fillBelow, fillBelowColor,
  showParallel, parallelOffset, parallelSameColor, parallelColor, parallelWidth, parallelStyle, parallelOpacity,
}: WavePlotProps) {
  const pad = 40
  const w = 700
  const h = 350

  const { x: xs, y: ys } = data

  const trueYs = useMemo(() => xs.map((x) => fn(x, functionType)), [xs, functionType])
  const parallelYs = useMemo(() => (showParallel ? ys.map((y) => y + parallelOffset) : []), [ys, showParallel, parallelOffset])

  const allYs = useMemo(() => {
    const arr = [...ys]
    if (showRef) arr.push(...trueYs)
    if (showParallel) arr.push(...parallelYs)
    return arr
  }, [ys, showRef, trueYs, showParallel, parallelYs])

  const pColor = parallelSameColor ? lineColor : parallelColor
  const pWidth = parallelSameColor ? lineWidth : parallelWidth
  const pStyle = parallelSameColor ? lineStyle : parallelStyle
  const pOpacity = parallelSameColor ? lineOpacity : parallelOpacity

  const xMin = xs[0]!
  const xMax = xs[xs.length - 1]!
  const yMin = Math.min(...allYs)
  const yMax = Math.max(...allYs)
  const yRange = yMax - yMin || 1

  const xTicks = useMemo(() => {
    const start = Math.ceil(xMin)
    const end = Math.floor(xMax)
    const count = Math.min(end - start, 40)
    return Array.from({ length: count + 1 }, (_, i) => start + i)
  }, [xMin, xMax])

  const yTicks = useMemo(() => {
    const step = yRange / 4
    return Array.from({ length: 5 }, (_, i) => yMin + i * step)
  }, [yMin, yMax, yRange])

  const interpPoints = useMemo(
    () => toSvgPoints(xs, ys, w, h, pad, yMin, yRange),
    [xs, ys, w, h, pad, yMin, yRange],
  )

  const truePoints = useMemo(
    () => toSvgPoints(xs, trueYs, w, h, pad, yMin, yRange),
    [xs, trueYs, w, h, pad, yMin, yRange],
  )

  const parallelSvgPoints = useMemo(
    () => toSvgPoints(xs, parallelYs, w, h, pad, yMin, yRange),
    [xs, parallelYs, w, h, pad, yMin, yRange],
  )

  const abovePath = useMemo(
    () => fillPath(xs, ys, w, h, pad, yMin, yRange, 'top'),
    [xs, ys, w, h, pad, yMin, yRange],
  )

  const belowPath = useMemo(
    () => fillPath(xs, ys, w, h, pad, yMin, yRange, 'bottom'),
    [xs, ys, w, h, pad, yMin, yRange],
  )

  const dashArray = lineStyle === 'dashed' ? `${lineWidth * 3} ${lineWidth * 2}` : undefined
  const parallelDashArray = pStyle === 'dashed' ? `${pWidth * 3} ${pWidth * 2}` : undefined

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto" role="img" aria-label="Wave plot">
        <rect x={0} y={0} width={w} height={h} fill="transparent" />

        {fillAbove && (
          <path d={abovePath} fill={fillAboveColor} opacity={0.4} />
        )}
        {fillBelow && (
          <path d={belowPath} fill={fillBelowColor} opacity={0.4} />
        )}

        {showGrid && xTicks.map((v) => {
          const x = pad + ((v - xMin) / (xMax - xMin)) * (w - 2 * pad)
          return (
            <line key={`gx${v}`} x1={x} y1={pad} x2={x} y2={h - pad} stroke="#e5e7eb" strokeWidth={1} />
          )
        })}
        {showGrid && yTicks.map((_, i) => {
          const y = pad + (i / 4) * (h - 2 * pad)
          return (
            <line key={`gy${i}`} x1={pad} y1={y} x2={w - pad} y2={y} stroke="#e5e7eb" strokeWidth={1} />
          )
        })}

        {showGrid && (
          <line x1={pad} y1={pad} x2={pad} y2={h - pad} stroke="#9ca3af" strokeWidth={1.5} />
        )}
        {showGrid && (
          <line x1={pad} y1={h - pad} x2={w - pad} y2={h - pad} stroke="#9ca3af" strokeWidth={1.5} />
        )}

        {showGrid && xTicks.map((v) => {
          const x = pad + ((v - xMin) / (xMax - xMin)) * (w - 2 * pad)
          return (
            <text key={`tx${v}`} x={x} y={h - pad + 16} textAnchor="middle" fill="#6b7280" fontSize={11}>
              {v.toFixed(1)}
            </text>
          )
        })}

        {showGrid && yTicks.map((v, i) => {
          const y = pad + (i / 4) * (h - 2 * pad)
          return (
            <text key={`ty${i}`} x={pad - 8} y={y + 4} textAnchor="end" fill="#6b7280" fontSize={11}>
              {v.toFixed(2)}
            </text>
          )
        })}

        {showRef && (
          <polyline
            points={truePoints}
            fill="none"
            stroke="#f59e0b"
            strokeWidth={1.5}
            strokeDasharray="6 3"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        )}

        {showParallel && (
          <polyline
            points={parallelSvgPoints}
            fill="none"
            stroke={pColor}
            strokeWidth={pWidth}
            strokeDasharray={parallelDashArray}
            opacity={pOpacity}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        )}

        <polyline
          points={interpPoints}
          fill="none"
          stroke={lineColor}
          strokeWidth={lineWidth}
          strokeDasharray={dashArray}
          opacity={lineOpacity}
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {showRef && (
          <>
            <line x1={w - 160} y1={pad + 12} x2={w - 160 + 20} y2={pad + 12} stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="6 3" />
            <text x={w - 134} y={pad + 16} fill="#6b7280" fontSize={11}>{FN_LABELS[functionType] || functionType}</text>
          </>
        )}

        {showGrid && (
          <line x1={w - 160} y1={showRef ? pad + 30 : pad + 12} x2={w - 160 + 20} y2={showRef ? pad + 30 : pad + 12} stroke={lineColor} strokeWidth={2} />
        )}
        {showGrid && (
          <text x={w - 134} y={showRef ? pad + 34 : pad + 16} fill="#6b7280" fontSize={11}>Newton interp.</text>
        )}
      </svg>
    </div>
  )
}
