from flask import Flask, render_template, request, flash, jsonify
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
import joblib
import os

app = Flask(__name__)
app.secret_key = 'your_secret_key_here'  # Diperlukan untuk flash messages

# Load dan training model
def train_model():
    try:
        df = pd.read_csv('Cardiovascular_Disease_Dataset.csv')
        
        # Handling missing values
        df['serumcholestrol'] = df['serumcholestrol'].replace(0, df['serumcholestrol'].median())
        
        X = df.drop(['patientid', 'target'], axis=1)
        y = df['target']
        
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        model = RandomForestClassifier(n_estimators=100, random_state=42)
        model.fit(X_train, y_train)
        
        # Save model
        joblib.dump(model, 'model.pkl')
        return True
    except Exception as e:
        print(f"Error in training model: {str(e)}")
        return False

# Load model
def load_model():
    try:
        return joblib.load('model.pkl')
    except:
        return None

# Initialize model
if not os.path.exists('model.pkl'):
    train_model()
model = load_model()

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        if request.method == 'POST':
            # Validasi input
            required_fields = ['age', 'gender', 'chestpain', 'restingBP', 'serumcholestrol',
                             'fastingbloodsugar', 'restingrelectro', 'maxheartrate',
                             'exerciseangia', 'oldpeak', 'slope', 'noofmajorvessels']
            
            # Check if request is JSON or form-data
            if request.is_json:
                data = request.json
            else:
                data = request.form.to_dict()  # Convert form data to dictionary

            # Validate all fields
            for field in required_fields:
                if field not in data:
                    return jsonify({
                        'status': 'error',
                        'message': f'Field {field} is missing',
                        'code': 400
                    }), 400

            # Convert data to features
            features = []
            input_data = {}
            for field in required_fields:
                try:
                    value = float(data[field])
                    features.append(value)
                    input_data[field] = value
                except ValueError:
                    return jsonify({
                        'status': 'error',
                        'message': f'Invalid value for {field}. Please enter a number.',
                        'code': 400
                    }), 400

            # Check if model is loaded
            if model is None:
                return jsonify({
                    'status': 'error',
                    'message': 'Model not loaded properly',
                    'code': 500
                }), 500

            # Make prediction
            prediction = model.predict([features])
            prob = model.predict_proba([features])[0]
            
            # Prepare detailed response
            prediction_result = {
                'prediction': "Positif" if prediction[0] == 1 else "Negatif",
                'probability': {
                    'negative': float(prob[0]),
                    'positive': float(prob[1])
                }
            }

            # Prepare risk factors
            risk_factors = []
            if input_data['restingBP'] > 140:
                risk_factors.append("Tekanan darah tinggi")
            if input_data['serumcholestrol'] > 200:
                risk_factors.append("Kolesterol tinggi")
            if input_data['maxheartrate'] > 100:
                risk_factors.append("Detak jantung tinggi")
            if input_data['oldpeak'] > 2:
                risk_factors.append("ST depression signifikan")
            if input_data['noofmajorvessels'] >= 2:
                risk_factors.append("Multiple vessel disease")

            # Return JSON response
            response = {
                'status': 'success',
                'code': 200,
                'data': {
                    'patient_data': input_data,
                    'prediction': prediction_result,
                    'risk_factors': risk_factors,
                    'timestamp': pd.Timestamp.now().strftime('%Y-%m-%d %H:%M:%S')
                }
            }

            # If Accept header is application/json or is_json request, return JSON
            if request.headers.get('Accept') == 'application/json' or request.is_json:
                return jsonify(response)
            
            # Otherwise return HTML template
            return render_template('result.html', 
                                prediction=prediction_result['prediction'],
                                input_data=input_data,
                                risk_factors=risk_factors)

    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e),
            'code': 500
        }), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)