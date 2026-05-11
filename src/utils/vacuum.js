function rootsThreshold(type) {
  return 100
}

export function calculateVacuumTime({ volume, finalPressure, hasRoots, rootsType, penalty }) {
  const P0 = 1000
  let time = 0

  if (!hasRoots || finalPressure >= 100) {
    const Q = 400 / penalty
    time = (volume / Q) * Math.log(P0 / finalPressure) * 3600
  } else {
    const threshold = rootsThreshold(rootsType)
    const Q1 = 400 / penalty
    const Q2 = 1200 / penalty

    time += (volume / Q1) * Math.log(P0 / threshold) * 3600
    time += (volume / Q2) * Math.log(threshold / finalPressure) * 3600
  }
  return time
}
