import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Grid,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Chip,
} from '@mui/material';
import {
  LocalHospital,
  Favorite,
  Psychology,
  ArrowBack,
  Send,
} from '@mui/icons-material';
import axios from 'axios';

const ManualPrediction = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState('');

  // Form states for different diseases
  const [diabetesForm, setDiabetesForm] = useState({
    age: '',
    gender: '',
    polyuria: false,
    polydipsia: false,
    weight_loss: false,
    weakness: false,
    polyphagia: false,
    genital_thrush: false,
    visual_blurring: false,
    itching: false,
    irritability: false,
    delayed_healing: false,
    partial_paresis: false,
    muscle_stiffness: false,
    alopecia: false,
    obesity: false,
  });

  const [heartForm, setHeartForm] = useState({
    age: '',
    sex: '',
    chest_pain_type: '',
    resting_bp: '',
    cholesterol: '',
    fasting_bs: '',
    resting_ecg: '',
    max_hr: '',
    exercise_angina: false,
    old_peak: '',
    st_slope: '',
  });

  const [thyroidForm, setThyroidForm] = useState({
    age: '',
    sex: '',
    on_thyroxine: false,
    query_on_thyroxine: false,
    on_antithyroid_medication: false,
    sick: false,
    pregnant: false,
    thyroid_surgery: false,
    i131_treatment: false,
    query_hypothyroid: false,
    query_hyperthyroid: false,
    lithium: false,
    goitre: false,
    tumor: false,
    hypopituitary: false,
    psych: false,
    tsh: '',
    t3: '',
    tt4: '',
    t4u: '',
    fti: '',
  });

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setPrediction(null);
    setError('');
  };

  const handleDiabetesChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setDiabetesForm(prev => ({ ...prev, [field]: value }));
  };

  const handleHeartChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setHeartForm(prev => ({ ...prev, [field]: value }));
  };

  const handleThyroidChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setThyroidForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    setPrediction(null);

    try {
      let endpoint = '';
      let data = {};

      switch (activeTab) {
        case 0: // Diabetes
          endpoint = '/api/predict/diabetes';
          data = diabetesForm;
          break;
        case 1: // Heart
          endpoint = '/api/predict/heart';
          data = heartForm;
          break;
        case 2: // Thyroid
          endpoint = '/api/predict/thyroid';
          data = thyroidForm;
          break;
        default:
          throw new Error('Invalid disease type');
      }

      const response = await axios.post(endpoint, data);
      setPrediction(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred during prediction');
    } finally {
      setLoading(false);
    }
  };

  const renderDiabetesForm = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Age"
          type="number"
          value={diabetesForm.age}
          onChange={handleDiabetesChange('age')}
          required
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <FormControl fullWidth required>
          <InputLabel>Gender</InputLabel>
          <Select
            value={diabetesForm.gender}
            label="Gender"
            onChange={handleDiabetesChange('gender')}
          >
            <MenuItem value="male">Male</MenuItem>
            <MenuItem value="female">Female</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      
      {[
        'polyuria', 'polydipsia', 'weight_loss', 'weakness', 'polyphagia',
        'genital_thrush', 'visual_blurring', 'itching', 'irritability',
        'delayed_healing', 'partial_paresis', 'muscle_stiffness', 'alopecia', 'obesity'
      ].map((symptom) => (
        <Grid item xs={12} md={6} key={symptom}>
          <FormControlLabel
            control={
              <Checkbox
                checked={diabetesForm[symptom]}
                onChange={handleDiabetesChange(symptom)}
              />
            }
            label={symptom.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          />
        </Grid>
      ))}
    </Grid>
  );

  const renderHeartForm = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Age"
          type="number"
          value={heartForm.age}
          onChange={handleHeartChange('age')}
          required
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <FormControl fullWidth required>
          <InputLabel>Sex</InputLabel>
          <Select
            value={heartForm.sex}
            label="Sex"
            onChange={handleHeartChange('sex')}
          >
            <MenuItem value="male">Male</MenuItem>
            <MenuItem value="female">Female</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Chest Pain Type (0-3)"
          type="number"
          value={heartForm.chest_pain_type}
          onChange={handleHeartChange('chest_pain_type')}
          required
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Resting Blood Pressure"
          type="number"
          value={heartForm.resting_bp}
          onChange={handleHeartChange('resting_bp')}
          required
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Cholesterol"
          type="number"
          value={heartForm.cholesterol}
          onChange={handleHeartChange('cholesterol')}
          required
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Fasting Blood Sugar"
          type="number"
          value={heartForm.fasting_bs}
          onChange={handleHeartChange('fasting_bs')}
          required
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Resting ECG (0-2)"
          type="number"
          value={heartForm.resting_ecg}
          onChange={handleHeartChange('resting_ecg')}
          required
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Max Heart Rate"
          type="number"
          value={heartForm.max_hr}
          onChange={handleHeartChange('max_hr')}
          required
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <FormControlLabel
          control={
            <Checkbox
              checked={heartForm.exercise_angina}
              onChange={handleHeartChange('exercise_angina')}
            />
          }
          label="Exercise Angina"
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Old Peak"
          type="number"
          value={heartForm.old_peak}
          onChange={handleHeartChange('old_peak')}
          required
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="ST Slope (0-2)"
          type="number"
          value={heartForm.st_slope}
          onChange={handleHeartChange('st_slope')}
          required
        />
      </Grid>
    </Grid>
  );

  const renderThyroidForm = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Age"
          type="number"
          value={thyroidForm.age}
          onChange={handleThyroidChange('age')}
          required
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <FormControl fullWidth required>
          <InputLabel>Sex</InputLabel>
          <Select
            value={thyroidForm.sex}
            label="Sex"
            onChange={handleThyroidChange('sex')}
          >
            <MenuItem value="male">Male</MenuItem>
            <MenuItem value="female">Female</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      
      {[
        'on_thyroxine', 'query_on_thyroxine', 'on_antithyroid_medication',
        'sick', 'pregnant', 'thyroid_surgery', 'i131_treatment',
        'query_hypothyroid', 'query_hyperthyroid', 'lithium', 'goitre',
        'tumor', 'hypopituitary', 'psych'
      ].map((condition) => (
        <Grid item xs={12} md={6} key={condition}>
          <FormControlLabel
            control={
              <Checkbox
                checked={thyroidForm[condition]}
                onChange={handleThyroidChange(condition)}
              />
            }
            label={condition.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          />
        </Grid>
      ))}
      
      {['tsh', 't3', 'tt4', 't4u', 'fti'].map((hormone) => (
        <Grid item xs={12} md={6} key={hormone}>
          <TextField
            fullWidth
            label={hormone.toUpperCase()}
            type="number"
            value={thyroidForm[hormone]}
            onChange={handleThyroidChange(hormone)}
            required
          />
        </Grid>
      ))}
    </Grid>
  );

  const renderPredictionResult = () => {
    if (!prediction) return null;

    return (
      <Card sx={{ mt: 3, background: 'rgba(255, 255, 255, 0.95)' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Prediction Result
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Chip
              label={prediction.risk_level}
              color={prediction.risk_level === 'High' ? 'error' : 'success'}
              variant="filled"
            />
            <Typography variant="body1">
              Confidence: {(prediction.probability * 100).toFixed(1)}%
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary">
            {prediction.message}
          </Typography>
        </CardContent>
      </Card>
    );
  };

  const diseaseTypes = [
    { label: 'Diabetes', icon: <LocalHospital /> },
    { label: 'Heart Disease', icon: <Favorite /> },
    { label: 'Thyroid Issues', icon: <Psychology /> },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/')}
          sx={{ mr: 2 }}
        >
          Back to Dashboard
        </Button>
      </Box>

      <Paper
        elevation={0}
        sx={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: 4,
          p: 4,
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
          Manual Health Data Entry
        </Typography>

        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{ mb: 3 }}
          variant="fullWidth"
        >
          {diseaseTypes.map((disease, index) => (
            <Tab
              key={disease.label}
              label={disease.label}
              icon={disease.icon}
              iconPosition="start"
            />
          ))}
        </Tabs>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ mb: 3 }}>
          {activeTab === 0 && renderDiabetesForm()}
          {activeTab === 1 && renderHeartForm()}
          {activeTab === 2 && renderThyroidForm()}
        </Box>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            variant="contained"
            size="large"
            onClick={handleSubmit}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <Send />}
            sx={{
              background: 'linear-gradient(45deg, #667eea, #764ba2)',
              '&:hover': {
                background: 'linear-gradient(45deg, #764ba2, #667eea)',
              },
            }}
          >
            {loading ? 'Analyzing...' : 'Get Prediction'}
          </Button>
        </Box>

        {renderPredictionResult()}
      </Paper>
    </Box>
  );
};

export default ManualPrediction; 