import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import {
  Box,
  Paper,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Grid,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  CloudUpload,
  ArrowBack,
  Assessment,
  LocalHospital,
  Favorite,
  Psychology,
} from '@mui/icons-material';
import axios from 'axios';

const FileUpload = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [diseaseType, setDiseaseType] = useState('diabetes');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const onDrop = useCallback((acceptedFiles) => {
    setSelectedFile(acceptedFiles[0]);
    setError('');
    setResults(null);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
    },
    multiple: false,
  });

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file first');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('disease_type', diseaseType);

      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setResults(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred during file upload');
    } finally {
      setLoading(false);
    }
  };

  const getDiseaseIcon = (type) => {
    switch (type) {
      case 'diabetes':
        return <LocalHospital />;
      case 'heart':
        return <Favorite />;
      case 'thyroid':
        return <Psychology />;
      default:
        return <Assessment />;
    }
  };

  const getDiseaseName = (type) => {
    switch (type) {
      case 'diabetes':
        return 'Diabetes';
      case 'heart':
        return 'Heart Disease';
      case 'thyroid':
        return 'Thyroid Issues';
      default:
        return 'Unknown';
    }
  };

  const renderResults = () => {
    if (!results) return null;

    return (
      <Card sx={{ mt: 3, background: 'rgba(255, 255, 255, 0.95)' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Analysis Results
          </Typography>
          
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center', p: 2, border: '1px solid #e0e0e0', borderRadius: 2 }}>
                <Typography variant="h4" color="primary">
                  {results.summary.total_records}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Records
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center', p: 2, border: '1px solid #e0e0e0', borderRadius: 2 }}>
                <Typography variant="h4" color="error">
                  {results.summary.high_risk_count}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  High Risk
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center', p: 2, border: '1px solid #e0e0e0', borderRadius: 2 }}>
                <Typography variant="h4" color="success.main">
                  {results.summary.low_risk_count}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Low Risk
                </Typography>
              </Box>
            </Grid>
          </Grid>

          <Typography variant="h6" gutterBottom>
            Detailed Results
          </Typography>
          
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Row</TableCell>
                  <TableCell>Prediction</TableCell>
                  <TableCell>Risk Level</TableCell>
                  <TableCell>Confidence</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {results.results.slice(0, 10).map((result) => (
                  <TableRow key={result.row}>
                    <TableCell>{result.row}</TableCell>
                    <TableCell>
                      <Chip
                        label={result.prediction === 1 ? 'Positive' : 'Negative'}
                        color={result.prediction === 1 ? 'error' : 'success'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={result.risk_level}
                        color={result.risk_level === 'High' ? 'error' : 'success'}
                        variant="outlined"
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {(result.probability * 100).toFixed(1)}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          {results.results.length > 10 && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Showing first 10 results. Total: {results.results.length} records
            </Typography>
          )}
        </CardContent>
      </Card>
    );
  };

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
          File Upload & Batch Prediction
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Upload CSV or Excel files containing health data for batch disease prediction analysis.
        </Typography>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Disease Type</InputLabel>
              <Select
                value={diseaseType}
                label="Disease Type"
                onChange={(e) => setDiseaseType(e.target.value)}
              >
                <MenuItem value="diabetes">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocalHospital />
                    Diabetes
                  </Box>
                </MenuItem>
                <MenuItem value="heart">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Favorite />
                    Heart Disease
                  </Box>
                </MenuItem>
                <MenuItem value="thyroid">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Psychology />
                    Thyroid Issues
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Box
          {...getRootProps()}
          sx={{
            border: '2px dashed #ccc',
            borderRadius: 2,
            p: 4,
            textAlign: 'center',
            background: isDragActive ? 'rgba(102, 126, 234, 0.1)' : 'rgba(255, 255, 255, 0.1)',
            borderColor: isDragActive ? '#667eea' : '#ccc',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            mb: 3,
            '&:hover': {
              borderColor: '#667eea',
              background: 'rgba(255, 255, 255, 0.2)',
            },
          }}
        >
          <input {...getInputProps()} />
          <CloudUpload sx={{ fontSize: 48, color: '#667eea', mb: 2 }} />
          {isDragActive ? (
            <Typography variant="h6">Drop the file here...</Typography>
          ) : (
            <Box>
              <Typography variant="h6" gutterBottom>
                Drag & drop a file here, or click to select
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Supports CSV, XLSX, and XLS files
              </Typography>
            </Box>
          )}
        </Box>

        {selectedFile && (
          <Box sx={{ mb: 3, p: 2, background: 'rgba(76, 175, 80, 0.1)', borderRadius: 2 }}>
            <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Assessment />
              Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
            </Typography>
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            variant="contained"
            size="large"
            onClick={handleUpload}
            disabled={!selectedFile || loading}
            startIcon={loading ? <CircularProgress size={20} /> : getDiseaseIcon(diseaseType)}
            sx={{
              background: 'linear-gradient(45deg, #667eea, #764ba2)',
              '&:hover': {
                background: 'linear-gradient(45deg, #764ba2, #667eea)',
              },
            }}
          >
            {loading ? 'Processing...' : `Analyze ${getDiseaseName(diseaseType)}`}
          </Button>
        </Box>

        {renderResults()}
      </Paper>
    </Box>
  );
};

export default FileUpload; 