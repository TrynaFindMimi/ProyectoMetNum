import { useState, useCallback } from 'react'
import { fetchWave, type WaveResponse } from '../services/api'

export interface WaveData {
  x: number[]
  y: number[]
}

export function useWave() {
  const [waveData, setWaveData] = useState<WaveData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generate = useCallback(
    async (functionType: string, nControl: number, xMin: number, xMax: number) => {
      setLoading(true)
      setError(null)
      try {
        const data: WaveResponse = await fetchWave(functionType, nControl, 200, xMin, xMax)
        setWaveData({ x: data.x, y: data.y })
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to fetch wave')
      } finally {
        setLoading(false)
      }
    },
    [],
  )

  const reset = useCallback(() => {
    setWaveData(null)
    setError(null)
    setLoading(false)
  }, [])

  return { waveData, loading, error, generate, reset }
}
