import { useState, useEffect } from 'react'
import { calculateToolingVolume } from './utils/toolingVolume'
import { calculateNetwork } from './utils/network'
import { calculateVacuumTime } from './utils/vacuum'

const KEY = 'vacuum-multivac-state'

export default function App() {
  const [s, setS] = useState(() => JSON.parse(localStorage.getItem(KEY)) || {
    laize: 520,
    pitch: 1020,
    depth: 70,
    hasFillers: true,
    fillerThickness: 60,
    hasRoots: true,
    rootsType: 'DRT2000',
    mainLength: 0,
    rootsLength: 3,
    distributionType: 'close',
    distributionDiameter: 32,
    smallBendsBefore: 2,
    largeBendsBefore: 0,
    smallBendsAfter: 0,
    largeBendsAfter: 0,
    finalPressure: 8
  })

  useEffect(() => localStorage.setItem(KEY, JSON.stringify(s)), [s])

  const toolingVolume = calculateToolingVolume(s)
  const network = calculateNetwork(s)
  const result = calculateVacuumTime({
    volume: toolingVolume + network.volume,
    finalPressure: s.finalPressure,
    hasRoots: s.hasRoots,
    rootsType: s.rootsType,
    penalty: network.penalty
  })

  return (
    <div className="app">
      <h1>Calculateur Vide Multivac</h1>
      <div className="result">Temps estimé : <b>{result.toFixed(2)} s</b></div>
    </div>
  )
}
