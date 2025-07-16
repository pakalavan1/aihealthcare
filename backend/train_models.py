import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.neural_network import MLPClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, classification_report
import xgboost as xgb
import joblib
import os

# Create models directory
os.makedirs('models', exist_ok=True)

def generate_diabetes_data(n_samples=1000):
    """Generate synthetic diabetes dataset"""
    np.random.seed(42)
    
    data = {
        'age': np.random.normal(50, 15, n_samples),
        'gender': np.random.choice(['Male', 'Female'], n_samples),
        'polyuria': np.random.choice([True, False], n_samples, p=[0.3, 0.7]),
        'polydipsia': np.random.choice([True, False], n_samples, p=[0.3, 0.7]),
        'weight_loss': np.random.choice([True, False], n_samples, p=[0.4, 0.6]),
        'weakness': np.random.choice([True, False], n_samples, p=[0.5, 0.5]),
        'polyphagia': np.random.choice([True, False], n_samples, p=[0.3, 0.7]),
        'genital_thrush': np.random.choice([True, False], n_samples, p=[0.2, 0.8]),
        'visual_blurring': np.random.choice([True, False], n_samples, p=[0.3, 0.7]),
        'itching': np.random.choice([True, False], n_samples, p=[0.4, 0.6]),
        'irritability': np.random.choice([True, False], n_samples, p=[0.3, 0.7]),
        'delayed_healing': np.random.choice([True, False], n_samples, p=[0.4, 0.6]),
        'partial_paresis': np.random.choice([True, False], n_samples, p=[0.2, 0.8]),
        'muscle_stiffness': np.random.choice([True, False], n_samples, p=[0.3, 0.7]),
        'alopecia': np.random.choice([True, False], n_samples, p=[0.2, 0.8]),
        'obesity': np.random.choice([True, False], n_samples, p=[0.4, 0.6])
    }
    
    df = pd.DataFrame(data)
    
    # Create target variable based on symptoms
    conditions = (
        (df['age'] > 45) &
        (df['polyuria'] | df['polydipsia']) &
        (df['weight_loss'] | df['polyphagia'])
    )
    df['diabetes'] = conditions.astype(int)
    
    return df

def generate_heart_data(n_samples=1000):
    """Generate synthetic heart disease dataset"""
    np.random.seed(42)
    
    data = {
        'age': np.random.normal(55, 12, n_samples),
        'sex': np.random.choice(['Male', 'Female'], n_samples),
        'chest_pain_type': np.random.randint(0, 4, n_samples),
        'resting_bp': np.random.normal(130, 20, n_samples),
        'cholesterol': np.random.normal(200, 50, n_samples),
        'fasting_bs': np.random.choice([0, 1], n_samples, p=[0.7, 0.3]),
        'resting_ecg': np.random.randint(0, 3, n_samples),
        'max_hr': np.random.normal(150, 25, n_samples),
        'exercise_angina': np.random.choice([True, False], n_samples, p=[0.3, 0.7]),
        'old_peak': np.random.normal(1, 2, n_samples),
        'st_slope': np.random.randint(0, 3, n_samples)
    }
    
    df = pd.DataFrame(data)
    
    # Create target variable based on risk factors
    conditions = (
        (df['age'] > 50) &
        (df['resting_bp'] > 140) &
        (df['cholesterol'] > 200) &
        (df['exercise_angina'] | (df['old_peak'] > 2))
    )
    df['heart_disease'] = conditions.astype(int)
    
    return df

def generate_thyroid_data(n_samples=1000):
    """Generate synthetic thyroid dataset"""
    np.random.seed(42)
    
    data = {
        'age': np.random.normal(45, 15, n_samples),
        'sex': np.random.choice(['Male', 'Female'], n_samples),
        'on_thyroxine': np.random.choice([True, False], n_samples, p=[0.1, 0.9]),
        'query_on_thyroxine': np.random.choice([True, False], n_samples, p=[0.1, 0.9]),
        'on_antithyroid_medication': np.random.choice([True, False], n_samples, p=[0.05, 0.95]),
        'sick': np.random.choice([True, False], n_samples, p=[0.2, 0.8]),
        'pregnant': np.random.choice([True, False], n_samples, p=[0.1, 0.9]),
        'thyroid_surgery': np.random.choice([True, False], n_samples, p=[0.05, 0.95]),
        'i131_treatment': np.random.choice([True, False], n_samples, p=[0.02, 0.98]),
        'query_hypothyroid': np.random.choice([True, False], n_samples, p=[0.15, 0.85]),
        'query_hyperthyroid': np.random.choice([True, False], n_samples, p=[0.1, 0.9]),
        'lithium': np.random.choice([True, False], n_samples, p=[0.02, 0.98]),
        'goitre': np.random.choice([True, False], n_samples, p=[0.1, 0.9]),
        'tumor': np.random.choice([True, False], n_samples, p=[0.05, 0.95]),
        'hypopituitary': np.random.choice([True, False], n_samples, p=[0.02, 0.98]),
        'psych': np.random.choice([True, False], n_samples, p=[0.1, 0.9]),
        'tsh': np.random.normal(3, 2, n_samples),
        't3': np.random.normal(1.2, 0.3, n_samples),
        'tt4': np.random.normal(100, 25, n_samples),
        't4u': np.random.normal(1, 0.2, n_samples),
        'fti': np.random.normal(100, 25, n_samples)
    }
    
    df = pd.DataFrame(data)
    
    # Create target variable based on thyroid function
    conditions = (
        (df['tsh'] > 4.5) |  # High TSH (hypothyroid)
        (df['tsh'] < 0.5) |  # Low TSH (hyperthyroid)
        (df['query_hypothyroid'] | df['query_hyperthyroid']) |
        (df['on_thyroxine'] | df['on_antithyroid_medication'])
    )
    df['thyroid_issue'] = conditions.astype(int)
    
    return df

def preprocess_diabetes_features(df):
    """Preprocess diabetes features"""
    features = []
    features.append(df['age'].values)
    features.append((df['gender'] == 'Male').astype(int).values)
    features.extend([df[col].astype(int).values for col in [
        'polyuria', 'polydipsia', 'weight_loss', 'weakness', 'polyphagia',
        'genital_thrush', 'visual_blurring', 'itching', 'irritability',
        'delayed_healing', 'partial_paresis', 'muscle_stiffness', 'alopecia', 'obesity'
    ]])
    return np.column_stack(features)

def preprocess_heart_features(df):
    """Preprocess heart disease features"""
    features = []
    features.append(df['age'].values)
    features.append((df['sex'] == 'Male').astype(int).values)
    features.extend([df[col].values for col in [
        'chest_pain_type', 'resting_bp', 'cholesterol', 'fasting_bs',
        'resting_ecg', 'max_hr', 'exercise_angina', 'old_peak', 'st_slope'
    ]])
    return np.column_stack(features)

def preprocess_thyroid_features(df):
    """Preprocess thyroid features"""
    features = []
    features.append(df['age'].values)
    features.append((df['sex'] == 'Male').astype(int).values)
    features.extend([df[col].astype(int).values for col in [
        'on_thyroxine', 'query_on_thyroxine', 'on_antithyroid_medication',
        'sick', 'pregnant', 'thyroid_surgery', 'i131_treatment',
        'query_hypothyroid', 'query_hyperthyroid', 'lithium', 'goitre',
        'tumor', 'hypopituitary', 'psych'
    ]])
    features.extend([df[col].values for col in ['tsh', 't3', 'tt4', 't4u', 'fti']])
    return np.column_stack(features)

def train_model(X, y, model_type='random_forest'):
    """Train a model and return it"""
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    if model_type == 'random_forest':
        model = RandomForestClassifier(n_estimators=100, random_state=42)
    elif model_type == 'xgboost':
        model = xgb.XGBClassifier(random_state=42)
    elif model_type == 'neural_network':
        scaler = StandardScaler()
        X_train_scaled = scaler.fit_transform(X_train)
        X_test_scaled = scaler.transform(X_test)
        model = MLPClassifier(hidden_layer_sizes=(100, 50), max_iter=500, random_state=42)
        model.fit(X_train_scaled, y_train)
        y_pred = model.predict(X_test_scaled)
    else:
        raise ValueError(f"Unknown model type: {model_type}")
    
    if model_type != 'neural_network':
        model.fit(X_train, y_train)
        y_pred = model.predict(X_test)
    
    accuracy = accuracy_score(y_test, y_pred)
    print(f"{model_type.upper()} Accuracy: {accuracy:.4f}")
    print(classification_report(y_test, y_pred))
    
    return model

def main():
    print("Training AI Healthcare Prediction Models...")
    
    # Train Diabetes Model
    print("\n=== Training Diabetes Model ===")
    diabetes_df = generate_diabetes_data(2000)
    diabetes_features = preprocess_diabetes_features(diabetes_df)
    diabetes_target = diabetes_df['diabetes'].values
    
    diabetes_model = train_model(diabetes_features, diabetes_target, 'random_forest')
    joblib.dump(diabetes_model, 'models/diabetes_model.pkl')
    print("Diabetes model saved!")
    
    # Train Heart Disease Model
    print("\n=== Training Heart Disease Model ===")
    heart_df = generate_heart_data(2000)
    heart_features = preprocess_heart_features(heart_df)
    heart_target = heart_df['heart_disease'].values
    
    heart_model = train_model(heart_features, heart_target, 'random_forest')
    joblib.dump(heart_model, 'models/heart_model.pkl')
    print("Heart disease model saved!")
    
    # Train Thyroid Model
    print("\n=== Training Thyroid Model ===")
    thyroid_df = generate_thyroid_data(2000)
    thyroid_features = preprocess_thyroid_features(thyroid_df)
    thyroid_target = thyroid_df['thyroid_issue'].values
    
    thyroid_model = train_model(thyroid_features, thyroid_target, 'random_forest')
    joblib.dump(thyroid_model, 'models/thyroid_model.pkl')
    print("Thyroid model saved!")
    
    # Save sample datasets
    print("\n=== Saving Sample Datasets ===")
    diabetes_df.to_csv('data/diabetes_sample.csv', index=False)
    heart_df.to_csv('data/heart_sample.csv', index=False)
    thyroid_df.to_csv('data/thyroid_sample.csv', index=False)
    print("Sample datasets saved!")
    
    print("\n=== Training Complete ===")
    print("All models have been trained and saved successfully!")

if __name__ == "__main__":
    # Create data directory
    os.makedirs('data', exist_ok=True)
    main() 