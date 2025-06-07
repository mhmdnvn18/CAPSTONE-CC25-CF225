// CardioPredict Main Application Script

// Set current year in footer
document.addEventListener('DOMContentLoaded', function() {
    const currentYear = document.getElementById('currentYear');
    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }
});

// Age input is now a number input, no slider needed
// const ageSlider = document.getElementById('age');
// const ageValue = document.getElementById('ageValue');

// if (ageSlider && ageValue) {
//     ageSlider.addEventListener('input', function() {
//         ageValue.textContent = this.value;
//     });
// }

// Prediction functionality
const predictBtn = document.getElementById('predictBtn');
const predictionForm = document.getElementById('predictionForm');
const predictionResult = document.getElementById('predictionResult');
const resetBtn = document.getElementById('resetBtn');

// Prediction button click handler
if (predictBtn) {
    predictBtn.addEventListener('click', function() {
        try {
            // Collect form data
            const formData = collectFormData();
            
            // Validate required fields
            if (!formData.age || !formData.height || !formData.weight || !formData.ap_hi || !formData.ap_lo) {
                alert('Mohon lengkapi semua field yang diperlukan');
                return;
            }
            
            // Get prediction
            const prediction = predictCardiovascularRisk(formData);
            
            // Update result display
            updatePredictionResult(prediction);
            
            // Hide the form
            predictionForm.classList.add('hidden');
            
            // Show the result with animation
            setTimeout(() => {
                predictionResult.classList.remove('hidden');
                predictionResult.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 500);
            
        } catch (error) {
            console.error('Error during prediction:', error);
            alert('Terjadi kesalahan saat melakukan prediksi. Silakan coba lagi.');
        }
    });
}

// Reset button click handler
if (resetBtn) {
    resetBtn.addEventListener('click', function() {
        // Hide the result
        predictionResult.classList.add('hidden');
        
        // Show the form with animation
        setTimeout(() => {
            predictionForm.classList.remove('hidden');
            predictionForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 500);
    });
}

// Animation effects for predict button
if (predictBtn) {
    predictBtn.addEventListener('mouseenter', function() {
        this.classList.remove('animate-pulse-slow');
    });
    
    predictBtn.addEventListener('mouseleave', function() {
        this.classList.add('animate-pulse-slow');
    });
}

// Form validation and data collection
function collectFormData() {
    const formData = {
        id: Date.now(), // Generate unique ID
        age: parseInt(document.getElementById('age').value),
        gender: parseInt(document.getElementById('gender').value),
        height: parseInt(document.getElementById('height').value),
        weight: parseInt(document.getElementById('weight').value),
        ap_hi: parseInt(document.getElementById('ap_hi').value),
        ap_lo: parseInt(document.getElementById('ap_lo').value),
        cholesterol: parseInt(document.getElementById('cholesterol').value),
        gluc: parseInt(document.getElementById('gluc').value),
        smoke: parseInt(document.getElementById('smoke').value),
        alco: parseInt(document.getElementById('alco').value),
        active: parseInt(document.getElementById('active').value)
    };
    
    return formData;
}

// Mock prediction function (replace with actual ML model)
function predictCardiovascularRisk(formData) {
    // This is a mock prediction - replace with actual ML model integration
    console.log('Form Data:', formData); // For debugging
    
    // Calculate BMI
    const heightInM = formData.height / 100;
    const bmi = formData.weight / (heightInM * heightInM);
    
    // Risk factors based on dataset features
    const riskFactors = [
        formData.age > 55 ? 25 : formData.age > 45 ? 15 : 5, // Age factor
        formData.gender === 2 ? 10 : 5, // Male gender higher risk
        bmi > 30 ? 20 : bmi > 25 ? 10 : 0, // BMI factor
        formData.ap_hi > 140 ? 25 : formData.ap_hi > 120 ? 15 : 5, // Systolic BP
        formData.ap_lo > 90 ? 20 : formData.ap_lo > 80 ? 10 : 5, // Diastolic BP
        formData.cholesterol === 3 ? 25 : formData.cholesterol === 2 ? 15 : 0, // Cholesterol
        formData.gluc === 3 ? 20 : formData.gluc === 2 ? 10 : 0, // Glucose
        formData.smoke === 1 ? 15 : 0, // Smoking
        formData.alco === 1 ? 5 : 0, // Alcohol
        formData.active === 0 ? 10 : 0 // Physical inactivity
    ];
    
    const totalRisk = riskFactors.reduce((sum, risk) => sum + risk, 0);
    const riskPercentage = Math.min(Math.max(totalRisk, 10), 95); // Between 10-95%
    
    let riskLevel = 'Rendah';
    let riskColor = 'green';
    
    if (riskPercentage >= 65) {
        riskLevel = 'Tinggi';
        riskColor = 'red';
    } else if (riskPercentage >= 40) {
        riskLevel = 'Sedang';
        riskColor = 'yellow';
    }
    
    return {
        percentage: riskPercentage,
        level: riskLevel,
        color: riskColor,
        bmi: bmi.toFixed(1),
        formData: formData
    };
}

// Update prediction result display
function updatePredictionResult(prediction) {
    // Add error checking for predictionResult
    if (!predictionResult) {
        console.error('predictionResult element not found');
        return;
    }
    
    // Find the result container - try different selectors
    let resultContainer = predictionResult.querySelector('.risk-high') || 
                         predictionResult.querySelector('.border-4') ||
                         predictionResult.querySelector('[class*="border-"]');
    
    if (!resultContainer) {
        console.error('Result container not found');
        return;
    }
    
    // Find elements with error checking
    const riskTitle = resultContainer.querySelector('h4');
    const riskPercentage = resultContainer.querySelector('.flex .text-2xl:last-child');
    const riskDescription = resultContainer.querySelector('p.text-gray-700.mb-4');
    let riskBar = resultContainer.querySelector('.bg-red-500') || 
                  resultContainer.querySelector('[class*="bg-"][class*="h-4"]') ||
                  resultContainer.querySelector('.rounded-full');
    const riskStats = resultContainer.querySelector('.bg-gray-50 p');
    
    if (!riskTitle || !riskPercentage || !riskDescription || !riskStats) {
        console.error('Some result elements not found:', {
            riskTitle: !!riskTitle,
            riskPercentage: !!riskPercentage,
            riskDescription: !!riskDescription,
            riskStats: !!riskStats
        });
        return;
    }
    
    // Update colors and text based on risk level
    if (prediction.color === 'green') {
        resultContainer.className = 'border-4 border-green-500 rounded-xl p-6 mb-6 text-center risk-low';
        const iconContainer = resultContainer.querySelector('.bg-red-100');
        const icon = resultContainer.querySelector('.text-red-500');
        
        if (iconContainer) iconContainer.className = 'mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-4';
        if (icon) icon.className = 'fas fa-heart-pulse text-green-500 text-4xl animate-heartbeat';
        
        riskTitle.className = 'text-2xl font-bold text-green-500';
        riskTitle.textContent = 'RISIKO RENDAH';
        
        riskPercentage.className = 'text-2xl font-bold text-green-500';
        
        if (riskBar) riskBar.className = 'bg-green-500 h-4 rounded-full';
    } else if (prediction.color === 'yellow') {
        resultContainer.className = 'border-4 border-yellow-500 rounded-xl p-6 mb-6 text-center risk-medium';
        const iconContainer = resultContainer.querySelector('.bg-red-100');
        const icon = resultContainer.querySelector('.text-red-500');
        
        if (iconContainer) iconContainer.className = 'mx-auto w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mb-4';
        if (icon) icon.className = 'fas fa-heart-pulse text-yellow-500 text-4xl animate-heartbeat';
        
        riskTitle.className = 'text-2xl font-bold text-yellow-500';
        riskTitle.textContent = 'RISIKO SEDANG';
        
        riskPercentage.className = 'text-2xl font-bold text-yellow-500';
        
        if (riskBar) riskBar.className = 'bg-yellow-500 h-4 rounded-full';
    } else {
        // High risk (red) - reset to original
        resultContainer.className = 'border-4 border-red-500 rounded-xl p-6 mb-6 text-center risk-high';
        riskTitle.className = 'text-2xl font-bold text-red-500';
        riskTitle.textContent = 'RISIKO TINGGI';
        
        riskPercentage.className = 'text-2xl font-bold text-red-500';
        
        if (riskBar) riskBar.className = 'bg-red-500 h-4 rounded-full';
    }
    
    // Update risk bar width
    if (riskBar) {
        riskBar.style.width = `${prediction.percentage}%`;
    }
    
    // Update percentage
    riskPercentage.textContent = `${prediction.percentage}%`;
    
    // Update BMI and Age stats only
    riskStats.innerHTML = `
        BMI: <span class="font-medium">${prediction.bmi}</span> | Usia: <span class="font-medium">${prediction.formData.age} tahun</span>
    `;
    
    // Update description with more details
    const genderText = prediction.formData.gender === 1 ? 'perempuan' : 'laki-laki';
    
    // Build BMI alert message
    let bmiAlert = '';
    if (prediction.bmi > 25) {
        bmiAlert = '<br><small class="text-orange-600 font-medium">⚠️ BMI Anda menunjukkan kelebihan berat badan</small>';
        console.log('BMI Alert triggered:', prediction.bmi);
    } else {
        console.log('BMI normal:', prediction.bmi);
    }
    
    // Build smoking alert message  
    let smokingAlert = '';
    if (prediction.formData.smoke === 1) {
        smokingAlert = '<br><small class="text-red-600 font-medium">🚭 Merokok meningkatkan risiko kardiovaskular</small>';
    }
    
    if (riskDescription) {
        riskDescription.innerHTML = `
            Berdasarkan analisis data (${genderText}, ${prediction.formData.age} tahun), Anda memiliki 
            <span class="font-semibold">risiko ${prediction.level.toLowerCase()}</span> terkena penyakit kardiovaskular.
            ${bmiAlert}
            ${smokingAlert}
        `;
    } else {
        console.error('riskDescription element not found - trying fallback');
        // Fallback: find the first p element with correct classes
        const fallbackDesc = resultContainer.querySelector('p') || 
                             document.querySelector('#predictionResult p.text-gray-700');
        if (fallbackDesc) {
            fallbackDesc.innerHTML = `
                Berdasarkan analisis data (${genderText}, ${prediction.formData.age} tahun), Anda memiliki 
                <span class="font-semibold">risiko ${prediction.level.toLowerCase()}</span> terkena penyakit kardiovaskular.
                ${bmiAlert}
                ${smokingAlert}
            `;
        }
    }
} 