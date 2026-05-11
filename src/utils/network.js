export function calculatePipeVolume(length, diameter) {
  const d = diameter / 1000
  return Math.PI * Math.pow(d / 2, 2) * length
}

export function calculateNetwork({ rootsLength, distributionType, distributionDiameter, smallBendsBefore }) {
  let volume = 0
  let penalty = 1

  if (rootsLength) {
    volume += calculatePipeVolume(rootsLength, 60)
    penalty *= 1.5
  }

  if (distributionType === 'close') {
    volume += calculatePipeVolume(4, distributionDiameter)
    penalty *= distributionDiameter === 22 ? 2.5 : 2
  }

  penalty += smallBendsBefore * 0.03
  return { volume, penalty }
}
