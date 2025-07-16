# AI Healthcare Prediction System

A web-based AI Healthcare Prediction system that allows users to upload structured medical data or enter health parameters manually to predict possible diseases.

## Features

- **Multiple Disease Prediction**: Diabetes, Heart Disease, Thyroid Issues
- **File Upload Support**: CSV and Excel files
- **Manual Data Entry**: Form-based health parameter input
- **Machine Learning Models**: Random Forest, XGBoost, and Neural Network
- **Modern UI**: Responsive design with beautiful interface
- **Real-time Predictions**: Instant results with confidence scores

## Tech Stack

### Frontend
- React.js
- Material-UI
- Chart.js for visualizations
- Axios for API calls

### Backend
- Python Flask
- Scikit-learn
- XGBoost
- Pandas
- NumPy

### Machine Learning
- Random Forest
- XGBoost
- Neural Network (Multi-layer Perceptron)

## Project Structure

```
AI Healthcare/
├── frontend/                 # React frontend application
├── backend/                  # Python Flask backend
├── models/                   # Trained ML models
├── data/                     # Sample datasets
└── requirements.txt          # Python dependencies
```

## Installation & Setup

### Backend Setup
1. Navigate to the backend directory
2. Create a virtual environment: `python -m venv venv`
3. Activate the environment: `venv\Scripts\activate` (Windows) or `source venv/bin/activate` (Linux/Mac)
4. Install dependencies: `pip install -r requirements.txt`
5. Run the server: `python app.py`

### Frontend Setup
1. Navigate to the frontend directory
2. Install dependencies: `npm install`
3. Start the development server: `npm start`

## Usage

1. Open the application in your browser
2. Choose between file upload or manual data entry
3. Upload CSV/Excel file or fill in health parameters
4. Select the disease type to predict
5. Get instant predictions with confidence scores

## API Endpoints

- `POST /api/predict/diabetes` - Diabetes prediction
- `POST /api/predict/heart` - Heart disease prediction
- `POST /api/predict/thyroid` - Thyroid prediction
- `POST /api/upload` - File upload endpoint

## Sample Data Format

### Diabetes Prediction
- Age, Gender, Polyuria, Polydipsia, Weight Loss, Weakness, Polyphagia, Genital Thrush, Visual Blurring, Itching, Irritability, Delayed Healing, Partial Paresis, Muscle Stiffness, Alopecia, Obesity

### Heart Disease Prediction
- Age, Sex, Chest Pain Type, Resting BP, Cholesterol, Fasting BS, Resting ECG, Max HR, Exercise Angina, Old Peak, ST Slope

### Thyroid Prediction
- Age, Sex, On Thyroxine, Query on Thyroxine, On Antithyroid Medication, Sick, Pregnant, Thyroid Surgery, I131 Treatment, Query Hypothyroid, Query Hyperthyroid, Lithium, Goitre, Tumor, Hypopituitary, Psych, TSH, T3, TT4, T4U, FTI

## License

MIT License 