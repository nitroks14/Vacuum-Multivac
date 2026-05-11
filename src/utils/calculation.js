export function calculateTime({ volume, flow, finalPressure, bends }) {
  const P0 = 1000
  const bendPenalty = Math.max(1 - bends * 0.03, 0.5)
  const effectiveFlow = flow * bendPenalty
  return (volume / effectiveFlow) * Math.log(P0 / finalPressure) * 3600
}
