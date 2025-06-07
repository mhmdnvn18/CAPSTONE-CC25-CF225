import * as tf from '@tensorflow/tfjs';

let model = null;

export async function loadModel() {
  if (!model) {
    try {
      // Create sequential model
      model = tf.sequential();
      
      // Add layers with explicit input shape
      model.add(tf.layers.dense({
        inputShape: [11], // Must match number of features
        units: 64,
        activation: 'relu',
        kernelInitializer: 'glorotUniform',
        name: 'dense_1'
      }));

      model.add(tf.layers.dense({
        units: 32,
        activation: 'relu',
        kernelInitializer: 'glorotUniform',
        name: 'dense_2'
      }));

      model.add(tf.layers.dense({
        units: 1,
        activation: 'sigmoid',
        kernelInitializer: 'glorotUniform',
        name: 'dense_3'
      }));

      // Compile model
      model.compile({
        optimizer: tf.train.adam(0.001),
        loss: 'binaryCrossentropy',
        metrics: ['accuracy']
      });

      // Load pre-trained weights
      try {
        const weightsResponse = await fetch('/model/group1-shard1of1.bin');
        if (!weightsResponse.ok) {
          throw new Error('Failed to fetch model weights');
        }
        const weightsData = await weightsResponse.arrayBuffer();
        const weights = new Float32Array(weightsData);

        // Set weights manually
        let offset = 0;
        for (const layer of model.layers) {
          const weightShapes = layer.getWeights().map(w => w.shape);
          const weightSizes = weightShapes.map(shape => 
            shape.reduce((a, b) => a * b)
          );
          
          for (let i = 0; i < weightShapes.length; i++) {
            const size = weightSizes[i];
            const values = weights.slice(offset, offset + size);
            const tensor = tf.tensor(values, weightShapes[i]);
            layer.weights[i].val.assign(tensor);
            offset += size;
          }
        }

        console.log('Model loaded successfully');
        return model;
      } catch (weightError) {
        console.error('Weight loading error:', weightError);
        throw new Error('Failed to load model weights');
      }
    } catch (error) {
      console.error('Model creation error:', error);
      throw new Error('Failed to create model');
    }
  }
  return model;
}

// Update normalisasi sesuai dengan range data training yang sebenarnya
const NORMALIZATION = {
  age: { min: 29, max: 77 },           // umur dalam tahun
  height: { min: 140, max: 200 },      // cm
  weight: { min: 40, max: 160 },       // kg
  systolic: { min: 90, max: 170 },     // mmHg (normal: 90-120)
  diastolic: { min: 60, max: 100 },    // mmHg (normal: 60-80)
  cholesterol: { min: 1, max: 3 },     // kategorikal
  glucose: { min: 1, max: 3 }          // kategorikal
};

function normalizeInput(input) {
  // Normalisasi input numerik
  const normalized = {
    age: (Number(input.age) - NORMALIZATION.age.min) / (NORMALIZATION.age.max - NORMALIZATION.age.min),
    height: (Number(input.height) - NORMALIZATION.height.min) / (NORMALIZATION.height.max - NORMALIZATION.height.min),
    weight: (Number(input.weight) - NORMALIZATION.weight.min) / (NORMALIZATION.weight.max - NORMALIZATION.weight.min),
    systolic: (Number(input.systolic) - NORMALIZATION.systolic.min) / (NORMALIZATION.systolic.max - NORMALIZATION.systolic.min),
    diastolic: (Number(input.diastolic) - NORMALIZATION.diastolic.min) / (NORMALIZATION.diastolic.max - NORMALIZATION.diastolic.min),
    
    // Input biner (sudah 0 atau 1)
    gender: Number(input.gender),
    smoking: Number(input.smoking),
    alcohol: Number(input.alcohol),
    active: Number(input.activity),
    
    // Input kategorikal
    cholesterol: (Number(input.cholesterol) - 1) / 2, // 1,2,3 -> 0,0.5,1
    glucose: (Number(input.glucose) - 1) / 2         // 1,2,3 -> 0,0.5,1
  };

  // Batasi nilai ke range 0-1
  Object.keys(normalized).forEach(key => {
    normalized[key] = Math.max(0, Math.min(1, normalized[key]));
  });

  // Debug log
  console.log('Input asli:', input);
  console.log('Input ternormalisasi:', normalized);

  return [
    normalized.age,
    normalized.gender,
    normalized.height,
    normalized.weight,
    normalized.systolic,
    normalized.diastolic,
    normalized.cholesterol,
    normalized.glucose,
    normalized.smoking,
    normalized.alcohol,
    normalized.active
  ];
}

function yearsToDays(years) {
  return Math.round(years * 365.25);
}

export async function predict(input) {
  try {
    if (!model) {
      console.log('Loading model...');
      await loadModel();
    }

    // Normalisasi input
    const normalizedInputs = normalizeInput(input);
    const inputTensor = tf.tensor2d([normalizedInputs], [1, 11]);

    // Prediksi
    const prediction = model.predict(inputTensor);
    const probability = (await prediction.data())[0];

    // Cleanup
    inputTensor.dispose();
    prediction.dispose();

    // Evaluasi risiko berdasarkan faktor medis
    const hasHighRisk = evaluateRiskFactors(input);
    
    // Kombinasikan prediksi model dengan evaluasi manual
    const finalProbability = adjustProbability(probability, hasHighRisk, input);

    // Format hasil
    const result = {
      probability: finalProbability,
      percentage: finalProbability * 100,
      risk: finalProbability > 0.5 ? 'high' : 'low',
      riskFactors: generateRiskFactors(input)
    };

    console.log('Final prediction:', result);
    return result;
  } catch (error) {
    console.error('Prediction error:', error);
    throw error;
  }
}

// Fungsi untuk mengevaluasi faktor risiko berdasarkan guidelines medis
function evaluateRiskFactors(input) {
  let riskPoints = 0;
  const age = Number(input.age);
  const systolic = Number(input.systolic);
  const diastolic = Number(input.diastolic);
  
  // Faktor usia
  if (age > 60) riskPoints += 2;
  else if (age > 45) riskPoints += 1;

  // Tekanan darah
  if (systolic >= 140 || diastolic >= 90) riskPoints += 2;
  else if (systolic >= 130 || diastolic >= 85) riskPoints += 1;

  // Kolesterol
  if (input.cholesterol === '3') riskPoints += 2;
  else if (input.cholesterol === '2') riskPoints += 1;

  // Glukosa
  if (input.glucose === '3') riskPoints += 2;
  else if (input.glucose === '2') riskPoints += 1;

  // Faktor gaya hidup
  if (input.smoking === '1') riskPoints += 2;
  if (input.alcohol === '1') riskPoints += 1;
  if (input.activity === '0') riskPoints += 1;

  // Hitung BMI
  const heightInM = Number(input.height) / 100;
  const bmi = Number(input.weight) / (heightInM * heightInM);
  if (bmi >= 30) riskPoints += 2;
  else if (bmi >= 25) riskPoints += 1;

  return riskPoints >= 6; // True jika risiko tinggi
}

// Fungsi untuk menyesuaikan probabilitas berdasarkan evaluasi medis
function adjustProbability(modelProb, hasHighRisk, input) {
  let adjustedProb = modelProb;

  // Jika prediksi model dan evaluasi medis berbeda jauh
  if (hasHighRisk && modelProb < 0.3) {
    adjustedProb = Math.min(0.7, modelProb + 0.4);
  } else if (!hasHighRisk && modelProb > 0.7) {
    adjustedProb = Math.max(0.3, modelProb - 0.4);
  }

  // Pertimbangkan faktor usia dan tekanan darah
  const age = Number(input.age);
  const systolic = Number(input.systolic);
  const diastolic = Number(input.diastolic);

  if (age < 40 && systolic < 120 && diastolic < 80 && !hasHighRisk) {
    adjustedProb = Math.min(adjustedProb, 0.4);
  }

  return adjustedProb;
}

function generateRiskFactors(input) {
  const factors = [];
  
  if (Number(input.systolic) > 140) factors.push("Tekanan darah sistolik tinggi");
  if (Number(input.diastolic) > 90) factors.push("Tekanan darah diastolik tinggi");
  if (input.cholesterol === '3') factors.push("Kolesterol tinggi");
  if (input.glucose === '3') factors.push("Glukosa tinggi");
  if (input.smoking === '1') factors.push("Merokok");
  if (input.alcohol === '1') factors.push("Konsumsi alkohol");
  if (input.activity === '0') factors.push("Kurang aktivitas fisik");
  
  // Calculate BMI
  const heightInM = Number(input.height) / 100;
  const bmi = Number(input.weight) / (heightInM * heightInM);
  if (bmi >= 30) factors.push("Obesitas (BMI ≥ 30)");
  else if (bmi >= 25) factors.push("Berat badan berlebih (BMI ≥ 25)");

  return factors;
}
