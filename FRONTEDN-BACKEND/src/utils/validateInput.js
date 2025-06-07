import { yearsToDays } from './convertAge';

export function validateInput(input) {
  // Validate age in days (converted from years)
  if (!input.age || input.age < yearsToDays(1) || input.age > yearsToDays(120)) 
    return { ok: false, msg: 'Usia harus antara 1-120 tahun' };
  
  if (!input.height || input.height < 100 || input.height > 250) 
    return { ok: false, msg: 'Tinggi badan harus antara 100-250 cm' };
  
  if (!input.weight || input.weight < 30 || input.weight > 300) 
    return { ok: false, msg: 'Berat badan harus antara 30-300 kg' };
  
  if (!input.systolic || input.systolic < 50 || input.systolic > 250) 
    return { ok: false, msg: 'Tekanan darah sistolik harus antara 50-250 mmHg' };
  
  if (!input.diastolic || input.diastolic < 40 || input.diastolic > 150) 
    return { ok: false, msg: 'Tekanan darah diastolik harus antara 40-150 mmHg' };

  // Categorical validations
  const categoricalFields = {
    gender: ['0', '1'],
    cholesterol: ['1', '2', '3'],
    glucose: ['1', '2', '3'],
    smoking: ['0', '1'],
    alcohol: ['0', '1'],
    activity: ['0', '1']
  };

  for (const [field, validValues] of Object.entries(categoricalFields)) {
    if (!input[field] || !validValues.includes(input[field].toString())) {
      return {
        ok: false,
        msg: `${field} harus dipilih dengan nilai yang valid`
      };
    }
  }

  return { ok: true };
}
