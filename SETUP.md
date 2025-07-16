# AI Healthcare Prediction System - Setup Guide

This guide will help you set up and run the AI Healthcare Prediction System on your local machine.

## Prerequisites

Before you begin, make sure you have the following installed:

### 1. Python (3.8 or higher)
- Download from: https://www.python.org/downloads/
- Make sure to check "Add Python to PATH" during installation
- Verify installation: `python --version`

### 2. Node.js (14 or higher)
- Download from: https://nodejs.org/
- This includes npm (Node Package Manager)
- Verify installation: `node --version` and `npm --version`

### 3. Git (optional)
- Download from: https://git-scm.com/
- For cloning the repository

## Quick Start (Windows)

If you're on Windows, you can use the provided batch file:

1. Double-click `start.bat`
2. The script will automatically:
   - Install dependencies
   - Train the ML models
   - Start both servers
   - Open the application in your browser

## Manual Setup

### Step 1: Install Python Dependencies

Open a terminal/command prompt in the project root directory and run:

```bash
pip install -r requirements.txt
```

### Step 2: Train Machine Learning Models

Navigate to the backend directory and train the models:

```bash
cd backend
python train_models.py
cd ..
```

This will:
- Generate synthetic training data
- Train Random Forest models for diabetes, heart disease, and thyroid prediction
- Save the trained models in the `backend/models/` directory

### Step 3: Install Frontend Dependencies

Navigate to the frontend directory and install Node.js dependencies:

```bash
cd frontend
npm install
cd ..
```

### Step 4: Start the Backend Server

In a new terminal window, start the Flask backend:

```bash
cd backend
python app.py
```

The backend server will start on `http://localhost:5000`

### Step 5: Start the Frontend Server

In another terminal window, start the React frontend:

```bash
cd frontend
npm start
```

The frontend application will start on `http://localhost:3000` and automatically open in your browser.

## Using the Application

### 1. Dashboard
- Overview of the system
- Navigation to different features
- Information about supported diseases

### 2. Manual Data Entry
- Enter health parameters manually
- Choose disease type (Diabetes, Heart Disease, Thyroid)
- Get instant predictions with confidence scores

### 3. File Upload
- Upload CSV or Excel files
- Batch prediction for multiple records
- Download results summary

### 4. Results & Analytics
- View prediction history
- Interactive charts and visualizations
- Risk distribution analysis

## API Endpoints

The backend provides the following REST API endpoints:

- `GET /api/health` - Health check
- `POST /api/predict/diabetes` - Diabetes prediction
- `POST /api/predict/heart` - Heart disease prediction
- `POST /api/predict/thyroid` - Thyroid prediction
- `POST /api/upload` - File upload endpoint
- `GET /api/features/<disease_type>` - Get required features for a disease type

## Sample Data

The system includes sample datasets in the `data/` directory:

- `diabetes_sample.csv` - Sample diabetes data
- `heart_sample.csv` - Sample heart disease data
- `thyroid_sample.csv` - Sample thyroid data

You can use these files to test the file upload functionality.

## Troubleshooting

### Common Issues

1. **Port already in use**
   - Backend: Change port in `backend/app.py` (line 291)
   - Frontend: React will automatically suggest an alternative port

2. **Python dependencies not found**
   - Make sure you're in the correct directory
   - Try: `pip install --upgrade pip`
   - Then: `pip install -r requirements.txt`

3. **Node.js dependencies not found**
   - Make sure you're in the frontend directory
   - Try: `npm cache clean --force`
   - Then: `npm install`

4. **Models not found**
   - Make sure you've run `python train_models.py`
   - Check that the `backend/models/` directory exists

5. **CORS errors**
   - Make sure the backend is running on port 5000
   - Check that Flask-CORS is installed

### Getting Help

If you encounter any issues:

1. Check the console output for error messages
2. Verify all prerequisites are installed correctly
3. Make sure all dependencies are installed
4. Check that both servers are running

## Development

### Project Structure

```
AI Healthcare/
├── backend/                 # Python Flask backend
│   ├── app.py              # Main Flask application
│   ├── train_models.py     # Model training script
│   └── models/             # Trained ML models
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── App.js          # Main app component
│   │   └── index.js        # Entry point
│   └── package.json        # Node.js dependencies
├── data/                   # Sample datasets
├── requirements.txt        # Python dependencies
└── README.md              # Project documentation
```

### Adding New Features

1. **New Disease Type**:
   - Add preprocessing function in `backend/app.py`
   - Add training data generation in `backend/train_models.py`
   - Add form fields in `frontend/src/components/ManualPrediction.js`
   - Update routing and navigation

2. **New ML Model**:
   - Import the model in `backend/train_models.py`
   - Add training code
   - Update the model loading in `backend/app.py`

3. **New UI Component**:
   - Create component in `frontend/src/components/`
   - Add routing in `frontend/src/App.js`
   - Update navigation as needed

## Security Notes

- This is a demonstration system with synthetic data
- Do not use for actual medical diagnosis
- Always consult healthcare professionals for medical advice
- Consider adding authentication for production use

## License

This project is for educational and demonstration purposes only. 