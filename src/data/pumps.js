/**
 * Base de données pompes & Roots
 * Multivac – Calculateur vide
 *
 * Les débits sont exprimés en m³/s
 * La pression p est en mbar absolu
 */

/* ────────────────────────────── */
/* POMPES PRIMAIRES (si source = pompe locale) */
/* ────────────────────────────── */

export const primaryPumpModels = {
  "Busch R5 RA 0025": {
    type: "rotative",
    workingRange: [1000, 5],
    flow: (p) => (p > 100 ? 0.0069 : p > 10 ? 0.005 : 0.0035)
  },

  "Busch R5 RA 0040": {
    type: "rotative",
    workingRange: [1000, 5],
    flow: (p) => (p > 100 ? 0.011 : p > 10 ? 0.008 : 0.005)
  },

  "Busch R5 RA 0063": {
    type: "rotative",
    workingRange: [1000, 5],
    flow: (p) => (p > 100 ? 0.0175 : p > 10 ? 0.013 : 0.008)
  },

  "Busch R5 RA 0100": {
    type: "rotative",
    workingRange: [1000, 5],
    flow: (p) => (p > 100 ? 0.028 : p > 10 ? 0.020 : 0.013)
  },

  "Busch R5 RA 0160": {
    type: "rotative",
    workingRange: [1000, 5],
    flow: (p) => (p > 100 ? 0.044 : p > 10 ? 0.032 : 0.020)
  },

  "Busch R5 RA 0250": {
    type: "rotative",
    workingRange: [1000, 5],
    flow: (p) => (p > 100 ? 0.069 : p > 10 ? 0.050 : 0.035)
  },

  "Busch R5 RA 0300": {
    type: "rotative",
    workingRange: [1000, 5],
    flow: (p) => (p > 100 ? 0.083 : p > 10 ? 0.055 : 0.035)
  },

  "Busch R5 RA 0400": {
    type: "rotative",
    workingRange: [1000, 5],
    flow: (p) => (p > 100 ? 0.11 : p > 10 ? 0.07 : 0.04)
  },

  "Busch R5 RA 0630": {
    type: "rotative",
    workingRange: [1000, 5],
    flow: (p) => (p > 100 ? 0.175 : p > 10 ? 0.12 : 0.07)
  },

  "Busch R5 RA 0700": {
    type: "rotative",
    workingRange: [1000, 5],
    flow: (p) => (p > 100 ? 0.195 : p > 10 ? 0.14 : 0.08)
  }
}

/* ────────────────────────────── */
/* ROOTS (accélérateurs de débit) */
/* ────────────────────────────── */

export const rootsModels = {
  "Aucune": {
    enabled: false,
    threshold: 0,
    effectiveRange: null,
    gain: () => 1
  },

  "Atlas Copco DRT1000": {
    enabled: true,
    manufacturer: "Atlas Copco",
    nominalFlow: 1000, // m³/h
    threshold: null, // recherché par IA Gemini
    fallbackThreshold: 100, // mbar si IA échoue
    effectiveRange: [100, 40],
    gain: (p) => {
      if (p > 100) return 1
      if (p > 40) return 1 + (100 - p) / 60 * 1.5
      return 2.5
    }
  },

  "Atlas Copco DRT2000": {
    enabled: true,
    manufacturer: "Atlas Copco",
    nominalFlow: 2000,
    threshold: null,
    fallbackThreshold: 100,
    effectiveRange: [100, 40],
    gain: (p) => {
      if (p > 100) return 1
      if (p > 40) return 1 + (100 - p) / 60 * 2.5
      return 3.5
    }
  },

  "Busch PANDA WV 1000": {
    enabled: true,
    manufacturer: "Busch",
    nominalFlow: 1000,
    threshold: null,
    fallbackThreshold: 100,
    effectiveRange: [100, 40],
    gain: (p) => {
      if (p > 100) return 1
      if (p > 40) return 1 + (100 - p) / 60 * 1.7
      return 2.7
    }
  },

  "Busch PANDA WV 2000": {
    enabled: true,
    manufacturer: "Busch",
    nominalFlow: 2000,
    threshold: null,
    fallbackThreshold: 100,
    effectiveRange: [100, 40],
    gain: (p) => {
      if (p > 100) return 1
      if (p > 40) return 1 + (100 - p) / 60 * 2.8
      return 3.8
    }
  }
}

/* ────────────────────────────── */
/* POMPES SÈCHES À VIS – BUSCH COBRA */
/* ────────────────────────────── */

export const primaryPumpModels = {
  /* … Busch R5 déjà existantes … */

  "Busch COBRA NC 0300": {
    type: "dry-screw",
    manufacturer: "Busch",
    nominalFlow: 300, // m³/h
    workingRange: [1000, 0.1],
    flow: (p) => {
      if (p > 100) return 0.083   // ≈ 300 m³/h
      if (p > 40)  return 0.075
      if (p > 10)  return 0.060
      return 0.045
    }
  },

  "Busch COBRA NC 0400": {
    type: "dry-screw",
    manufacturer: "Busch",
    nominalFlow: 400,
    workingRange: [1000, 0.1],
    flow: (p) => {
      if (p > 100) return 0.11    // ≈ 400 m³/h
      if (p > 40)  return 0.100
      if (p > 10)  return 0.080
      return 0.060
    }
  },

  "Busch COBRA NC 0450": {
    type: "dry-screw",
    manufacturer: "Busch",
    nominalFlow: 450,
    workingRange: [1000, 0.1],
    flow: (p) => {
      if (p > 100) return 0.125   // ≈ 450 m³/h
      if (p > 40)  return 0.115
      if (p > 10)  return 0.095
      return 0.070
    }
  }
}
