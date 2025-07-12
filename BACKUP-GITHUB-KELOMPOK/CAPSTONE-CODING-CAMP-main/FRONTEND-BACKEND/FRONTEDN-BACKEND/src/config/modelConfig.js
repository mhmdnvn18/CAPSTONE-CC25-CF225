export const MODEL_CONFIG = {
  inputFeatures: 11,
  hiddenLayers: [64, 32],
  outputUnits: 1,
  inputNormalization: {
    age: { min: 25, max: 80 },
    restingBP: { min: 90, max: 200 },
    cholesterol: { min: 120, max: 570 },
    maxHR: { min: 70, max: 210 },
    oldpeak: { min: 0, max: 6.2 }
  },
  categoricalFeatures: {
    sex: 2,
    chestPainType: 4,
    restingECG: 3,
    fastingBS: 2,
    exerciseAngina: 2,
    stSlope: 3
  }
};
