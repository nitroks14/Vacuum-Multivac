export function calculateToolingVolume({ laize, pitch, depth, hasFillers, fillerThickness }) {
  const effPitch = pitch - 20
  const surface = laize * effPitch
  const main = surface * depth
  const filler = hasFillers ? surface * fillerThickness * 0.95 : 0
  return (main + filler) / 1e9
}
