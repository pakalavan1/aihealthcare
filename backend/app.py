from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import joblib
import os
from werkzeug.utils import secure_filename
import logging
import re

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Configuration
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'csv', 'xlsx', 'xls'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Create uploads directory if it doesn't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Load trained models
def load_models():
    models = {}
    try:
        models['diabetes'] = joblib.load('models/diabetes_model.pkl')
        models['heart'] = joblib.load('models/heart_model.pkl')
        models['thyroid'] = joblib.load('models/thyroid_model.pkl')
        logger.info("Models loaded successfully")
    except Exception as e:
        logger.error(f"Error loading models: {e}")
        # Create dummy models for demonstration
        from sklearn.ensemble import RandomForestClassifier
        models['diabetes'] = RandomForestClassifier(n_estimators=100, random_state=42)
        models['heart'] = RandomForestClassifier(n_estimators=100, random_state=42)
        models['thyroid'] = RandomForestClassifier(n_estimators=100, random_state=42)
    return models

models = load_models()

# Expanded synonyms dictionary for heart disease column mapping
HEART_SYNONYMS = {
    'age': ['age', 'Age', 'years', 'Years', 'AGE'],
    'sex': ['sex', 'Sex', 'gender', 'Gender', 'SEX'],
    'chest_pain_type': [
        'chest_pain_type', 'ChestPain', 'cp', 'chestpain', 'chest pain', 'chest_pain', 'Chest Pain Type', 'Chest Pain', 'CP'
    ],
    'resting_bp': [
        'resting_bp', 'RestingBP', 'trestbps', 'resting blood pressure', 'restbp', 'Resting BP', 'Resting Blood Pressure', 'restingBP'
    ],
    'cholesterol': [
        'cholesterol', 'Chol', 'chol', 'serum cholesterol', 'cholestrol', 'Cholesterol', 'Cholestrol'
    ],
    'fasting_bs': [
        'fasting_bs', 'FastingBS', 'fbs', 'fasting blood sugar', 'fastingbs', 'Fasting Blood Sugar', 'FastingBS', 'FBS'
    ],
    'resting_ecg': [
        'resting_ecg', 'RestingECG', 'restecg', 'resting ecg', 'Resting ECG', 'RestingECG'
    ],
    'max_hr': [
        'max_hr', 'MaxHR', 'thalach', 'maximum heart rate', 'maxhr', 'Max HR', 'Maximum Heart Rate', 'Thalach'
    ],
    'exercise_angina': [
        'exercise_angina', 'ExerciseAngina', 'exang', 'exercise induced angina', 'exerciseangina', 'Exercise Induced Angina', 'Exang'
    ],
    'old_peak': [
        'old_peak', 'Oldpeak', 'oldpeak', 'st depression', 'old peak', 'Old Peak', 'ST Depression'
    ],
    'st_slope': [
        'st_slope', 'ST_Slope', 'slope', 'st slope', 'Slope', 'ST Slope'
    ],
}

REQUIRED_HEART_FEATURES = [
    'age', 'sex', 'chest_pain_type', 'resting_bp', 'cholesterol',
    'fasting_bs', 'resting_ecg', 'max_hr', 'exercise_angina', 'old_peak', 'st_slope'
]

DIABETES_SYNONYMS = {
    'age': ['age', 'Age', 'years', 'Years'],
    'gender': ['gender', 'Gender', 'sex', 'Sex'],
    'polyuria': ['polyuria', 'Polyuria'],
    'polydipsia': ['polydipsia', 'Polydipsia'],
    'weight_loss': ['weight_loss', 'WeightLoss', 'weightloss', 'Weight Loss'],
    'weakness': ['weakness', 'Weakness'],
    'polyphagia': ['polyphagia', 'Polyphagia'],
    'genital_thrush': ['genital_thrush', 'GenitalThrush', 'genitalthrush', 'Genital Thrush'],
    'visual_blurring': ['visual_blurring', 'VisualBlurring', 'visualblurring', 'Visual Blurring'],
    'itching': ['itching', 'Itching'],
    'irritability': ['irritability', 'Irritability'],
    'delayed_healing': ['delayed_healing', 'DelayedHealing', 'delayedhealing', 'Delayed Healing'],
    'partial_paresis': ['partial_paresis', 'PartialParesis', 'partialparesis', 'Partial Paresis'],
    'muscle_stiffness': ['muscle_stiffness', 'MuscleStiffness', 'musclestiffness', 'Muscle Stiffness'],
    'alopecia': ['alopecia', 'Alopecia'],
    'obesity': ['obesity', 'Obesity'],
}
REQUIRED_DIABETES_FEATURES = [
    'age', 'gender', 'polyuria', 'polydipsia', 'weight_loss', 'weakness', 'polyphagia',
    'genital_thrush', 'visual_blurring', 'itching', 'irritability', 'delayed_healing',
    'partial_paresis', 'muscle_stiffness', 'alopecia', 'obesity'
]

# Synonyms and required features for thyroid
THYROID_SYNONYMS = {
    'age': ['age', 'Age', 'years', 'Years'],
    'sex': ['sex', 'Sex', 'gender', 'Gender'],
    'on_thyroxine': ['on_thyroxine', 'OnThyroxine', 'on thyroxine', 'On Thyroxine'],
    'query_on_thyroxine': ['query_on_thyroxine', 'QueryOnThyroxine', 'query on thyroxine', 'Query On Thyroxine'],
    'on_antithyroid_medication': ['on_antithyroid_medication', 'OnAntithyroidMedication', 'on antithyroid medication', 'On Antithyroid Medication'],
    'sick': ['sick', 'Sick'],
    'pregnant': ['pregnant', 'Pregnant'],
    'thyroid_surgery': ['thyroid_surgery', 'ThyroidSurgery', 'thyroid surgery', 'Thyroid Surgery'],
    'i131_treatment': ['i131_treatment', 'I131Treatment', 'i131 treatment', 'I131 Treatment'],
    'query_hypothyroid': ['query_hypothyroid', 'QueryHypothyroid', 'query hypothyroid', 'Query Hypothyroid'],
    'query_hyperthyroid': ['query_hyperthyroid', 'QueryHyperthyroid', 'query hyperthyroid', 'Query Hyperthyroid'],
    'lithium': ['lithium', 'Lithium'],
    'goitre': ['goitre', 'Goitre', 'goiter', 'Goiter'],
    'tumor': ['tumor', 'Tumor'],
    'hypopituitary': ['hypopituitary', 'Hypopituitary'],
    'psych': ['psych', 'Psych'],
    'tsh': ['tsh', 'TSH'],
    't3': ['t3', 'T3'],
    'tt4': ['tt4', 'TT4'],
    't4u': ['t4u', 'T4U'],
    'fti': ['fti', 'FTI'],
}
REQUIRED_THYROID_FEATURES = [
    'age', 'sex', 'on_thyroxine', 'query_on_thyroxine', 'on_antithyroid_medication',
    'sick', 'pregnant', 'thyroid_surgery', 'i131_treatment', 'query_hypothyroid',
    'query_hyperthyroid', 'lithium', 'goitre', 'tumor', 'hypopituitary', 'psych',
    'tsh', 't3', 'tt4', 't4u', 'fti'
]

def normalize_col(col):
    return re.sub(r'[^a-z0-9]', '', col.lower())

def auto_map_heart_columns(df):
    """Auto-map user-uploaded heart disease columns to required names (robust)."""
    col_map = {}
    norm_cols = {normalize_col(c): c for c in df.columns}
    for std, synonyms in HEART_SYNONYMS.items():
        found = None
        for syn in synonyms:
            norm_syn = normalize_col(syn)
            if norm_syn in norm_cols:
                found = norm_cols[norm_syn]
                break
        if found:
            col_map[found] = std
    mapped_df = df.rename(columns=col_map)
    missing = [f for f in REQUIRED_HEART_FEATURES if f not in mapped_df.columns]
    return mapped_df, missing, col_map

def auto_map_diabetes_columns(df):
    def normalize_col(col):
        return re.sub(r'[^a-z0-9]', '', col.lower())
    col_map = {}
    norm_cols = {normalize_col(c): c for c in df.columns}
    for std, synonyms in DIABETES_SYNONYMS.items():
        found = None
        for syn in synonyms:
            norm_syn = normalize_col(syn)
            if norm_syn in norm_cols:
                found = norm_cols[norm_syn]
                break
        if not found:
            for norm_col, orig_col in norm_cols.items():
                if normalize_col(std) in norm_col:
                    found = orig_col
                    break
        if found:
            col_map[found] = std
    mapped_df = df.rename(columns=col_map)
    missing = [f for f in REQUIRED_DIABETES_FEATURES if f not in mapped_df.columns]
    return mapped_df, missing, col_map

def auto_map_thyroid_columns(df):
    def normalize_col(col):
        return re.sub(r'[^a-z0-9]', '', col.lower())
    col_map = {}
    norm_cols = {normalize_col(c): c for c in df.columns}
    for std, synonyms in THYROID_SYNONYMS.items():
        found = None
        for syn in synonyms:
            norm_syn = normalize_col(syn)
            if norm_syn in norm_cols:
                found = norm_cols[norm_syn]
                break
        if not found:
            for norm_col, orig_col in norm_cols.items():
                if normalize_col(std) in norm_col:
                    found = orig_col
                    break
        if found:
            col_map[found] = std
    mapped_df = df.rename(columns=col_map)
    missing = [f for f in REQUIRED_THYROID_FEATURES if f not in mapped_df.columns]
    return mapped_df, missing, col_map

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def preprocess_diabetes_data(data):
    """Preprocess diabetes prediction data"""
    # Convert categorical variables to numeric
    if isinstance(data, dict):
        features = []
        features.append(float(data.get('age', 0)))
        gender_val = data.get('gender', '').lower()
        features.append(1 if gender_val in ['male', 'm'] else 0)
        features.extend([1 if data.get(feature, False) else 0 for feature in [
            'polyuria', 'polydipsia', 'weight_loss', 'weakness', 'polyphagia',
            'genital_thrush', 'visual_blurring', 'itching', 'irritability',
            'delayed_healing', 'partial_paresis', 'muscle_stiffness', 'alopecia', 'obesity'
        ]])
        return np.array(features).reshape(1, -1)
    else:
        # DataFrame: map gender column
        if 'gender' in data.columns:
            data['gender'] = data['gender'].astype(str).str.lower().map(lambda x: 1 if x in ['male', 'm'] else 0)
        return data

def preprocess_heart_data(data):
    """Preprocess heart disease prediction data"""
    if isinstance(data, dict):
        features = []
        features.append(float(data.get('age', 0)))
        sex_val = data.get('sex', '').lower()
        features.append(1 if sex_val in ['male', 'm'] else 0)
        features.append(float(data.get('chest_pain_type', 0)))
        features.append(float(data.get('resting_bp', 0)))
        features.append(float(data.get('cholesterol', 0)))
        features.append(float(data.get('fasting_bs', 0)))
        features.append(float(data.get('resting_ecg', 0)))
        features.append(float(data.get('max_hr', 0)))
        features.append(1 if data.get('exercise_angina', False) else 0)
        features.append(float(data.get('old_peak', 0)))
        features.append(float(data.get('st_slope', 0)))
        return np.array(features).reshape(1, -1)
    else:
        # DataFrame: map sex column
        if 'sex' in data.columns:
            data['sex'] = data['sex'].astype(str).str.lower().map(lambda x: 1 if x in ['male', 'm'] else 0)
        return data

def preprocess_thyroid_data(data):
    """Preprocess thyroid prediction data"""
    if isinstance(data, dict):
        features = []
        features.append(float(data.get('age', 0)))
        sex_val = data.get('sex', '').lower()
        features.append(1 if sex_val in ['male', 'm'] else 0)
        features.extend([1 if data.get(feature, False) else 0 for feature in [
            'on_thyroxine', 'query_on_thyroxine', 'on_antithyroid_medication',
            'sick', 'pregnant', 'thyroid_surgery', 'i131_treatment',
            'query_hypothyroid', 'query_hyperthyroid', 'lithium', 'goitre',
            'tumor', 'hypopituitary', 'psych'
        ]])
        features.append(float(data.get('tsh', 0)))
        features.append(float(data.get('t3', 0)))
        features.append(float(data.get('tt4', 0)))
        features.append(float(data.get('t4u', 0)))
        features.append(float(data.get('fti', 0)))
        return np.array(features).reshape(1, -1)
    else:
        # DataFrame: map sex column
        if 'sex' in data.columns:
            data['sex'] = data['sex'].astype(str).str.lower().map(lambda x: 1 if x in ['male', 'm'] else 0)
        return data

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'message': 'AI Healthcare Prediction API is running'})

@app.route('/api/predict/diabetes', methods=['POST'])
def predict_diabetes():
    """Predict diabetes based on input data"""
    try:
        data = request.json
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Preprocess the data
        features = preprocess_diabetes_data(data)
        
        # Make prediction
        prediction = models['diabetes'].predict(features)[0]
        probability = models['diabetes'].predict_proba(features)[0]
        
        result = {
            'prediction': int(prediction),
            'probability': float(max(probability)),
            'risk_level': 'High' if prediction == 1 else 'Low',
            'message': 'High risk of diabetes detected' if prediction == 1 else 'Low risk of diabetes'
        }
        
        return jsonify(result)
    
    except Exception as e:
        logger.error(f"Error in diabetes prediction: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/predict/heart', methods=['POST'])
def predict_heart():
    """Predict heart disease based on input data"""
    try:
        data = request.json
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Preprocess the data
        features = preprocess_heart_data(data)
        
        # Make prediction
        prediction = models['heart'].predict(features)[0]
        probability = models['heart'].predict_proba(features)[0]
        
        result = {
            'prediction': int(prediction),
            'probability': float(max(probability)),
            'risk_level': 'High' if prediction == 1 else 'Low',
            'message': 'High risk of heart disease detected' if prediction == 1 else 'Low risk of heart disease'
        }
        
        return jsonify(result)
    
    except Exception as e:
        logger.error(f"Error in heart disease prediction: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/predict/thyroid', methods=['POST'])
def predict_thyroid():
    """Predict thyroid issues based on input data"""
    try:
        data = request.json
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Preprocess the data
        features = preprocess_thyroid_data(data)
        
        # Make prediction
        prediction = models['thyroid'].predict(features)[0]
        probability = models['thyroid'].predict_proba(features)[0]
        
        result = {
            'prediction': int(prediction),
            'probability': float(max(probability)),
            'risk_level': 'High' if prediction == 1 else 'Low',
            'message': 'High risk of thyroid issues detected' if prediction == 1 else 'Low risk of thyroid issues'
        }
        
        return jsonify(result)
    
    except Exception as e:
        logger.error(f"Error in thyroid prediction: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/upload', methods=['POST'])
def upload_file():
    """Handle file upload and batch prediction with auto-mapping for all diseases."""
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        disease_type = request.form.get('disease_type', 'diabetes')
        
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(filepath)
            
            # Read the file
            if filename.endswith('.csv'):
                df = pd.read_csv(filepath)
            else:
                df = pd.read_excel(filepath)
            
            mapping_message = None
            if disease_type == 'heart':
                mapped_df, missing, col_map = auto_map_heart_columns(df)
                for col in missing:
                    mapped_df[col] = 0
                df = mapped_df[REQUIRED_HEART_FEATURES]
                if missing:
                    mapping_message = (
                        "Prediction completed. Warning: The following columns were missing and filled with default values: "
                        + ", ".join(missing)
                    )
                else:
                    mapping_message = "Prediction successful. Columns were auto-mapped."
            elif disease_type == 'diabetes':
                mapped_df, missing, col_map = auto_map_diabetes_columns(df)
                for col in missing:
                    mapped_df[col] = 0
                df = mapped_df[REQUIRED_DIABETES_FEATURES]
                if missing:
                    mapping_message = (
                        "Prediction completed. Warning: The following columns were missing and filled with default values: "
                        + ", ".join(missing)
                    )
                else:
                    mapping_message = "Prediction successful. Columns were auto-mapped."
                features = preprocess_diabetes_data(df)
            elif disease_type == 'thyroid':
                mapped_df, missing, col_map = auto_map_thyroid_columns(df)
                for col in missing:
                    mapped_df[col] = 0
                df = mapped_df[REQUIRED_THYROID_FEATURES]
                # Robust sex mapping
                if 'sex' in df.columns:
                    df['sex'] = df['sex'].astype(str).str.lower().map(lambda x: 1 if x in ['male', 'm'] else 0)
                # Force all other columns to numeric
                for col in REQUIRED_THYROID_FEATURES:
                    if col in df.columns and col != 'sex':
                        df[col] = pd.to_numeric(df[col], errors='coerce').fillna(0)
                if missing:
                    mapping_message = (
                        "Prediction completed. Warning: The following columns were missing and filled with default values: "
                        + ", ".join(missing)
                    )
                else:
                    mapping_message = "Prediction successful. Columns were auto-mapped."
                features = preprocess_thyroid_data(df)
            else:
                os.remove(filepath)
                return jsonify({'error': 'Invalid disease type'}), 400
            
            if disease_type == 'heart':
                features = preprocess_heart_data(df)
            
            predictions = models[disease_type].predict(features)
            probabilities = models[disease_type].predict_proba(features)
            
            results = []
            for i, (pred, prob) in enumerate(zip(predictions, probabilities)):
                results.append({
                    'row': i + 1,
                    'prediction': int(pred),
                    'probability': float(max(prob)),
                    'risk_level': 'High' if pred == 1 else 'Low'
                })
            
            # Clean up uploaded file
            os.remove(filepath)
            
            response = {
                'message': mapping_message or f'Successfully processed {len(results)} records',
                'results': results,
                'summary': {
                    'total_records': len(results),
                    'high_risk_count': sum(1 for r in results if r['prediction'] == 1),
                    'low_risk_count': sum(1 for r in results if r['prediction'] == 0)
                }
            }
            if mapping_message:
                response['mapping'] = col_map
            return jsonify(response)
        
        return jsonify({'error': 'Invalid file type'}), 400
    
    except Exception as e:
        logger.error(f"Error in file upload: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/features/<disease_type>', methods=['GET'])
def get_features(disease_type):
    """Get required features for a specific disease type"""
    feature_maps = {
        'diabetes': [
            'age', 'gender', 'polyuria', 'polydipsia', 'weight_loss', 'weakness',
            'polyphagia', 'genital_thrush', 'visual_blurring', 'itching',
            'irritability', 'delayed_healing', 'partial_paresis', 'muscle_stiffness',
            'alopecia', 'obesity'
        ],
        'heart': [
            'age', 'sex', 'chest_pain_type', 'resting_bp', 'cholesterol',
            'fasting_bs', 'resting_ecg', 'max_hr', 'exercise_angina',
            'old_peak', 'st_slope'
        ],
        'thyroid': [
            'age', 'sex', 'on_thyroxine', 'query_on_thyroxine', 'on_antithyroid_medication',
            'sick', 'pregnant', 'thyroid_surgery', 'i131_treatment', 'query_hypothyroid',
            'query_hyperthyroid', 'lithium', 'goitre', 'tumor', 'hypopituitary', 'psych',
            'tsh', 't3', 'tt4', 't4u', 'fti'
        ]
    }
    
    if disease_type not in feature_maps:
        return jsonify({'error': 'Invalid disease type'}), 400
    
    return jsonify({
        'disease_type': disease_type,
        'features': feature_maps[disease_type]
    })

if __name__ == '__main__':
    import os
    cert_file = 'cert.pem'
    key_file = 'key.pem'
    if os.path.exists(cert_file) and os.path.exists(key_file):
        app.run(debug=True, host='0.0.0.0', port=5000, ssl_context=(cert_file, key_file))
    else:
        app.run(debug=True, host='0.0.0.0', port=5000) 