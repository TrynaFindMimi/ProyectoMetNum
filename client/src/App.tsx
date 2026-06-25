import { useState, useRef, useCallback } from 'react'
import WavePlot from './components/WavePlot'
import Controls from './components/Controls'
import { useWave } from './hooks/useWave'

function App() {
  const [functionType, setFunctionType] = useState('cos')
  const [nControl, setNControl] = useState(5)
  const [xMax, setXMax] = useState(4)
  const [showGrid, setShowGrid] = useState(true)
  const [showRef, setShowRef] = useState(true)
  const [lineColor, setLineColor] = useState('#3b82f6')
  const [lineWidth, setLineWidth] = useState(4)
  const [lineStyle, setLineStyle] = useState<'solid' | 'dashed'>('solid')
  const [lineOpacity, setLineOpacity] = useState(1)
  const [copied, setCopied] = useState(false)

  const [fillAbove, setFillAbove] = useState(false)
  const [fillAboveColor, setFillAboveColor] = useState('#93c5fd')
  const [fillBelow, setFillBelow] = useState(false)
  const [fillBelowColor, setFillBelowColor] = useState('#fda4af')

  const [showParallel, setShowParallel] = useState(false)
  const [parallelOffset, setParallelOffset] = useState(0.1)
  const [parallelSameColor, setParallelSameColor] = useState(true)
  const [parallelColor, setParallelColor] = useState('#10b981')
  const [parallelWidth, setParallelWidth] = useState(2)
  const [parallelStyle, setParallelStyle] = useState<'solid' | 'dashed'>('dashed')
  const [parallelOpacity, setParallelOpacity] = useState(1)

  const { waveData, loading, error, generate } = useWave()

  const svgContainerRef = useRef<HTMLDivElement>(null)

  const copySvg = useCallback(() => {
    const svg = svgContainerRef.current?.querySelector('svg')
    if (!svg) return
    navigator.clipboard.writeText(svg.outerHTML).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }, [])

  const tableData = useCallback(() => {
    if (!waveData) return null
    const rows: { x: string; y: string }[] = []
    const step = Math.max(1, Math.floor(waveData.x.length / 200))
    for (let i = 0; i < waveData.x.length; i += step) {
      rows.push({
        x: waveData.x[i]!.toFixed(4),
        y: waveData.y[i]!.toFixed(4),
      })
    }
    return rows
  }, [waveData])

  const rows = waveData ? tableData() : null

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header className="border-b border-gray-200 px-6 py-4">
        <h1 className="text-2xl font-bold tracking-tight">
          Interpolación de Newton
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          f(x) seleccionable &middot; puntos de control uniformes &middot; 1&ndash;15 puntos
        </p>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
          <Controls
            functionType={functionType}
            nControl={nControl}
            xMax={xMax}
            loading={loading}
            showGrid={showGrid}
            showRef={showRef}
            lineColor={lineColor}
            lineWidth={lineWidth}
            lineStyle={lineStyle}
            lineOpacity={lineOpacity}
            fillAbove={fillAbove}
            fillAboveColor={fillAboveColor}
            fillBelow={fillBelow}
            fillBelowColor={fillBelowColor}
            showParallel={showParallel}
            parallelOffset={parallelOffset}
            parallelSameColor={parallelSameColor}
            parallelColor={parallelColor}
            parallelWidth={parallelWidth}
            parallelStyle={parallelStyle}
            parallelOpacity={parallelOpacity}
            onFunctionTypeChange={setFunctionType}
            onNControlChange={setNControl}
            onXMaxChange={setXMax}
            onShowGridChange={setShowGrid}
            onShowRefChange={setShowRef}
            onLineColorChange={setLineColor}
            onLineWidthChange={setLineWidth}
            onLineStyleChange={setLineStyle}
            onLineOpacityChange={setLineOpacity}
            onFillAboveChange={setFillAbove}
            onFillAboveColorChange={setFillAboveColor}
            onFillBelowChange={setFillBelow}
            onFillBelowColorChange={setFillBelowColor}
            onShowParallelChange={setShowParallel}
            onParallelOffsetChange={setParallelOffset}
            onParallelSameColorChange={setParallelSameColor}
            onParallelColorChange={setParallelColor}
            onParallelWidthChange={setParallelWidth}
            onParallelStyleChange={setParallelStyle}
            onParallelOpacityChange={setParallelOpacity}
            onGenerate={() => generate(functionType, nControl, 0, xMax)}
          />

          <div className="flex flex-col gap-4">
            <div className="min-h-[400px] rounded-xl border border-gray-200 bg-gray-50 p-4">
              {error && (
                <div className="flex h-full items-center justify-center text-red-400">
                  {error}
                </div>
              )}
              {!error && !waveData && !loading && (
                <div className="flex h-full items-center justify-center text-gray-400">
                  Seleccioná una función y generá
                </div>
              )}
              {loading && (
                <div className="flex h-full items-center justify-center text-gray-400">
                  Generando...
                </div>
              )}
              {waveData && !loading && (
                <div ref={svgContainerRef}>
                  <WavePlot
                    data={waveData}
                    functionType={functionType}
                    showGrid={showGrid}
                    showRef={showRef}
                    lineColor={lineColor}
                    lineWidth={lineWidth}
                    lineStyle={lineStyle}
                    lineOpacity={lineOpacity}
                    fillAbove={fillAbove}
                    fillAboveColor={fillAboveColor}
                    fillBelow={fillBelow}
                    fillBelowColor={fillBelowColor}
                    showParallel={showParallel}
                    parallelOffset={parallelOffset}
                    parallelSameColor={parallelSameColor}
                    parallelColor={parallelColor}
                    parallelWidth={parallelWidth}
                    parallelStyle={parallelStyle}
                    parallelOpacity={parallelOpacity}
                  />
                </div>
              )}
            </div>

            {waveData && !loading && (
              <div className="rounded-xl border border-gray-200 bg-white">
                <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200">
                  <span className="text-sm font-medium text-gray-700">Datos de interpolación</span>
                  <button
                    onClick={copySvg}
                    className="text-xs px-3 py-1.5 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    {copied ? '¡Copiado!' : 'Copiar SVG'}
                  </button>
                </div>
                <div className="overflow-auto max-h-60">
                  <table className="w-full text-xs text-left">
                    <thead className="sticky top-0 bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 font-medium text-gray-500 border-b border-gray-200">x</th>
                        <th className="px-4 py-2 font-medium text-gray-500 border-b border-gray-200">f(x)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows?.map((r, i) => (
                        <tr key={i} className="hover:bg-gray-50">
                          <td className="px-4 py-1.5 font-mono text-gray-700 border-b border-gray-100">{r.x}</td>
                          <td className="px-4 py-1.5 font-mono text-gray-700 border-b border-gray-100">{r.y}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
