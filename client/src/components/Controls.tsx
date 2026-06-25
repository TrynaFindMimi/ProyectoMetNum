const FUNCTIONS = [
  { value: 'cos', label: 'cos(x)' },
  { value: 'sin', label: 'sin(x)' },
  { value: 'square', label: 'x²' },
]

const LINE_STYLES = [
  { value: 'solid', label: 'Sólida' },
  { value: 'dashed', label: 'Punteada' },
] as const

interface ControlsProps {
  functionType: string
  nControl: number
  xMax: number
  loading: boolean
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
  onFunctionTypeChange: (t: string) => void
  onNControlChange: (n: number) => void
  onXMaxChange: (v: number) => void
  onShowGridChange: (v: boolean) => void
  onShowRefChange: (v: boolean) => void
  onLineColorChange: (c: string) => void
  onLineWidthChange: (w: number) => void
  onLineStyleChange: (s: 'solid' | 'dashed') => void
  onLineOpacityChange: (v: number) => void
  onFillAboveChange: (v: boolean) => void
  onFillAboveColorChange: (c: string) => void
  onFillBelowChange: (v: boolean) => void
  onFillBelowColorChange: (c: string) => void
  onShowParallelChange: (v: boolean) => void
  onParallelOffsetChange: (v: number) => void
  onParallelSameColorChange: (v: boolean) => void
  onParallelColorChange: (c: string) => void
  onParallelWidthChange: (w: number) => void
  onParallelStyleChange: (s: 'solid' | 'dashed') => void
  onParallelOpacityChange: (v: number) => void
  onGenerate: () => void
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center justify-between cursor-pointer">
      <span className="text-sm text-gray-700">{label}</span>
      <div
        className={`relative w-10 h-5 rounded-full transition-colors ${checked ? 'bg-blue-600' : 'bg-gray-300'}`}
        onClick={() => onChange(!checked)}
      >
        <div
          className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`}
        />
      </div>
    </label>
  )
}

function ColorRow({ label, color, onChange }: { label: string; color: string; onChange: (c: string) => void }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-700">{label}</span>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={color}
          onChange={(e) => onChange(e.target.value)}
          className="w-8 h-6 p-0 border border-gray-300 rounded cursor-pointer"
        />
        <span className="text-xs text-gray-500 font-mono w-14">{color}</span>
      </div>
    </div>
  )
}

function WidthSlider({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <label className="block text-xs text-gray-500 mb-1">{label}: {value}px</label>
      <input
        type="range"
        min={1}
        max={8}
        step={0.5}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-blue-600"
      />
      <div className="flex justify-between text-xs text-gray-400 mt-1">
        <span>1</span>
        <span>8</span>
      </div>
    </div>
  )
}

function StyleButtons({ value, onChange }: { value: 'solid' | 'dashed'; onChange: (s: 'solid' | 'dashed') => void }) {
  return (
    <div>
      <label className="block text-xs text-gray-500 mb-1">Estilo</label>
      <div className="flex gap-1">
        {LINE_STYLES.map((s) => (
          <button
            key={s.value}
            onClick={() => onChange(s.value)}
            className={`flex-1 rounded-lg px-2 py-1.5 text-xs font-medium border transition-colors ${
              value === s.value
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function Controls({
  functionType,
  nControl,
  xMax,
  loading,
  showGrid,
  showRef,
  lineColor,
  lineWidth,
  lineStyle,
  lineOpacity,
  fillAbove,
  fillAboveColor,
  fillBelow,
  fillBelowColor,
  showParallel,
  parallelOffset,
  parallelSameColor,
  parallelColor,
  parallelWidth,
  parallelStyle,
  parallelOpacity,
  onFunctionTypeChange,
  onNControlChange,
  onXMaxChange,
  onShowGridChange,
  onShowRefChange,
  onLineColorChange,
  onLineWidthChange,
  onLineStyleChange,
  onLineOpacityChange,
  onFillAboveChange,
  onFillAboveColorChange,
  onFillBelowChange,
  onFillBelowColorChange,
  onShowParallelChange,
  onParallelOffsetChange,
  onParallelSameColorChange,
  onParallelColorChange,
  onParallelWidthChange,
  onParallelStyleChange,
  onParallelOpacityChange,
  onGenerate,
}: ControlsProps) {
  return (
    <div className="space-y-6 rounded-xl border border-gray-200 bg-white p-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Function
        </label>
        <select
          value={functionType}
          onChange={(e) => onFunctionTypeChange(e.target.value)}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none"
        >
          {FUNCTIONS.map((f) => (
            <option key={f.value} value={f.value}>
              f(x) = {f.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Control Points: {nControl}
        </label>
        <input
          type="range"
          min={1}
          max={15}
          value={nControl}
          onChange={(e) => onNControlChange(Number(e.target.value))}
          className="w-full accent-blue-600"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>1</span>
          <span>15</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Max X: {xMax.toFixed(1)}
        </label>
        <input
          type="range"
          min={0.5}
          max={20}
          step={0.5}
          value={xMax}
          onChange={(e) => onXMaxChange(Number(e.target.value))}
          className="w-full accent-blue-600"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>0.5</span>
          <span>20</span>
        </div>
      </div>

      <hr className="border-gray-200" />

      <Toggle label="Grid" checked={showGrid} onChange={onShowGridChange} />
      <Toggle label="f(x) referencia" checked={showRef} onChange={onShowRefChange} />

      <hr className="border-gray-200" />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Línea interpolada</label>
        <div className="space-y-3">
          <ColorRow label="Color" color={lineColor} onChange={onLineColorChange} />
          <WidthSlider label="Grosor" value={lineWidth} onChange={onLineWidthChange} />
          <StyleButtons value={lineStyle} onChange={onLineStyleChange} />
          <div>
            <label className="block text-xs text-gray-500 mb-1">Opacidad: {lineOpacity.toFixed(2)}</label>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={lineOpacity}
              onChange={(e) => onLineOpacityChange(Number(e.target.value))}
              className="w-full accent-blue-600"
            />
          </div>
        </div>
      </div>

      <hr className="border-gray-200" />

      <div className="space-y-3">
        <Toggle label="Relleno superior" checked={fillAbove} onChange={onFillAboveChange} />
        {fillAbove && (
          <div className="pl-4">
            <ColorRow label="Color" color={fillAboveColor} onChange={onFillAboveColorChange} />
          </div>
        )}
        <Toggle label="Relleno inferior" checked={fillBelow} onChange={onFillBelowChange} />
        {fillBelow && (
          <div className="pl-4">
            <ColorRow label="Color" color={fillBelowColor} onChange={onFillBelowColorChange} />
          </div>
        )}
      </div>

      <hr className="border-gray-200" />

      <div className="space-y-3">
        <Toggle label={`Línea paralela (y${parallelOffset >= 0 ? '+' : ''}${parallelOffset.toFixed(2)})`} checked={showParallel} onChange={onShowParallelChange} />
        {showParallel && (
          <div className="pl-4 space-y-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Desplazamiento: {parallelOffset.toFixed(2)}</label>
              <input
                type="range"
                min={-0.5}
                max={0.5}
                step={0.05}
                value={parallelOffset}
                onChange={(e) => onParallelOffsetChange(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>-0.5</span>
                <span>0.5</span>
              </div>
            </div>
            <Toggle label="Mismo color ppal" checked={parallelSameColor} onChange={onParallelSameColorChange} />
            {!parallelSameColor && (
              <ColorRow label="Color" color={parallelColor} onChange={onParallelColorChange} />
            )}
            <WidthSlider label="Grosor" value={parallelWidth} onChange={onParallelWidthChange} />
            <StyleButtons value={parallelStyle} onChange={onParallelStyleChange} />
            <div>
              <label className="block text-xs text-gray-500 mb-1">Opacidad: {parallelOpacity.toFixed(2)}</label>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={parallelOpacity}
                onChange={(e) => onParallelOpacityChange(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
            </div>
          </div>
        )}
      </div>

      <hr className="border-gray-200" />

      <button
        onClick={onGenerate}
        disabled={loading}
        className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
      >
        {loading ? 'Generando...' : 'Generar'}
      </button>
    </div>
  )
}
