import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Grid,
  Box,
  Paper,
  Chip,
} from '@mui/material';
import {
  Upload,
  Edit,
  Assessment,
  LocalHospital,
  Favorite,
  Psychology,
} from '@mui/icons-material';

const Dashboard = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: 'Manual Data Entry',
      description: 'Enter health parameters manually for instant disease prediction',
      icon: <Edit sx={{ fontSize: 40, color: '#667eea' }} />,
      path: '/manual',
      color: '#667eea',
    },
    {
      title: 'File Upload',
      description: 'Upload CSV or Excel files for batch prediction analysis',
      icon: <Upload sx={{ fontSize: 40, color: '#764ba2' }} />,
      path: '/upload',
      color: '#764ba2',
    },
    {
      title: 'View Results',
      description: 'Check prediction history and detailed analysis reports',
      icon: <Assessment sx={{ fontSize: 40, color: '#f093fb' }} />,
      path: '/results',
      color: '#f093fb',
    },
  ];

  const diseases = [
    {
      name: 'Diabetes',
      icon: <LocalHospital sx={{ fontSize: 24 }} />,
      description: 'Predict diabetes risk based on symptoms and health parameters',
      accuracy: '94%',
    },
    {
      name: 'Heart Disease',
      icon: <Favorite sx={{ fontSize: 24 }} />,
      description: 'Assess heart disease risk using cardiovascular indicators',
      accuracy: '92%',
    },
    {
      name: 'Thyroid Issues',
      icon: <Psychology sx={{ fontSize: 24 }} />,
      description: 'Detect thyroid disorders through hormone levels and symptoms',
      accuracy: '89%',
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Paper
        elevation={0}
        sx={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: 4,
          p: 4,
          mb: 4,
          textAlign: 'center',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        }}
      >
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700, color: '#333' }}>
          AI Healthcare Prediction System
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          Advanced machine learning models to predict diabetes, heart disease, and thyroid issues
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
          {diseases.map((disease) => (
            <Chip
              key={disease.name}
              icon={disease.icon}
              label={`${disease.name} (${disease.accuracy})`}
              variant="outlined"
              sx={{ 
                borderColor: disease.icon.props.sx?.color || '#667eea',
                color: disease.icon.props.sx?.color || '#667eea',
                '& .MuiChip-icon': { color: 'inherit' }
              }}
            />
          ))}
        </Box>
      </Paper>

      {/* Features Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {features.map((feature) => (
          <Grid item xs={12} md={4} key={feature.title}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-8px)',
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 3 }}>
                <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
                  {feature.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {feature.description}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate(feature.path)}
                  sx={{
                    background: `linear-gradient(45deg, ${feature.color}, ${feature.color}dd)`,
                    '&:hover': {
                      background: `linear-gradient(45deg, ${feature.color}dd, ${feature.color})`,
                    },
                  }}
                >
                  Get Started
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Disease Information */}
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
        <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
          Supported Disease Predictions
        </Typography>
        <Grid container spacing={3}>
          {diseases.map((disease) => (
            <Grid item xs={12} md={4} key={disease.name}>
              <Box
                sx={{
                  p: 3,
                  border: '1px solid #e0e0e0',
                  borderRadius: 2,
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: disease.icon.props.sx?.color || '#667eea',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  },
                }}
              >
                <Box sx={{ mb: 2, color: disease.icon.props.sx?.color || '#667eea' }}>
                  {disease.icon}
                </Box>
                <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
                  {disease.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {disease.description}
                </Typography>
                <Chip
                  label={`Accuracy: ${disease.accuracy}`}
                  color="primary"
                  variant="outlined"
                  size="small"
                />
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
};

export default Dashboard; 