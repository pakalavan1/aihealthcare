import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  ArrowBack,
  Assessment,
  LocalHospital,
  Favorite,
  Psychology,
  TrendingUp,
  PieChart,
} from '@mui/icons-material';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const Results = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [mockData, setMockData] = useState({
    diabetes: [],
    heart: [],
    thyroid: [],
  });

  useEffect(() => {
    // Generate mock data for demonstration
    const generateMockData = () => {
      const diseases = ['diabetes', 'heart', 'thyroid'];
      const mockResults = {};

      diseases.forEach(disease => {
        const results = [];
        for (let i = 1; i <= 20; i++) {
          const prediction = Math.random() > 0.6 ? 1 : 0;
          const probability = Math.random() * 0.4 + 0.6;
          results.push({
            id: i,
            date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
            prediction,
            probability,
            risk_level: prediction === 1 ? 'High' : 'Low',
            confidence: (probability * 100).toFixed(1),
          });
        }
        mockResults[disease] = results;
      });

      setMockData(mockResults);
    };

    generateMockData();
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
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

  const getCurrentData = () => {
    const diseaseTypes = ['diabetes', 'heart', 'thyroid'];
    return mockData[diseaseTypes[activeTab]] || [];
  };

  const getChartData = () => {
    const data = getCurrentData();
    const highRisk = data.filter(item => item.prediction === 1).length;
    const lowRisk = data.filter(item => item.prediction === 0).length;

    return {
      pie: {
        labels: ['High Risk', 'Low Risk'],
        datasets: [
          {
            data: [highRisk, lowRisk],
            backgroundColor: ['#d32f2f', '#388e3c'],
            borderColor: ['#b71c1c', '#2e7d32'],
            borderWidth: 2,
          },
        ],
      },
      bar: {
        labels: data.slice(0, 10).map(item => `Test ${item.id}`),
        datasets: [
          {
            label: 'Confidence (%)',
            data: data.slice(0, 10).map(item => parseFloat(item.confidence)),
            backgroundColor: data.slice(0, 10).map(item => 
              item.prediction === 1 ? 'rgba(211, 47, 47, 0.8)' : 'rgba(56, 142, 60, 0.8)'
            ),
            borderColor: data.slice(0, 10).map(item => 
              item.prediction === 1 ? '#d32f2f' : '#388e3c'
            ),
            borderWidth: 1,
          },
        ],
      },
    };
  };

  const renderSummary = () => {
    const data = getCurrentData();
    const totalTests = data.length;
    const highRiskCount = data.filter(item => item.prediction === 1).length;
    const lowRiskCount = data.filter(item => item.prediction === 0).length;
    const avgConfidence = (data.reduce((sum, item) => sum + parseFloat(item.confidence), 0) / totalTests).toFixed(1);

    return (
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'rgba(255, 255, 255, 0.95)' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary">
                {totalTests}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Tests
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'rgba(255, 255, 255, 0.95)' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="error">
                {highRiskCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                High Risk
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'rgba(255, 255, 255, 0.95)' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="success.main">
                {lowRiskCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Low Risk
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'rgba(255, 255, 255, 0.95)' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="info.main">
                {avgConfidence}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Avg Confidence
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };

  const renderCharts = () => {
    const chartData = getChartData();

    return (
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ background: 'rgba(255, 255, 255, 0.95)' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PieChart />
                Risk Distribution
              </Typography>
              <Box sx={{ height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Pie
                  data={chartData.pie}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom',
                      },
                    },
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ background: 'rgba(255, 255, 255, 0.95)' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TrendingUp />
                Confidence Levels
              </Typography>
              <Box sx={{ height: 300 }}>
                <Bar
                  data={chartData.bar}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                        max: 100,
                      },
                    },
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };

  const renderTable = () => {
    const data = getCurrentData();

    return (
      <Card sx={{ background: 'rgba(255, 255, 255, 0.95)' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Recent Predictions
          </Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Prediction</TableCell>
                  <TableCell>Risk Level</TableCell>
                  <TableCell>Confidence</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.slice(0, 10).map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.date}</TableCell>
                    <TableCell>
                      <Chip
                        label={row.prediction === 1 ? 'Positive' : 'Negative'}
                        color={row.prediction === 1 ? 'error' : 'success'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={row.risk_level}
                        color={row.risk_level === 'High' ? 'error' : 'success'}
                        variant="outlined"
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{row.confidence}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
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
          Prediction Results & Analytics
        </Typography>

        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{ mb: 4 }}
          variant="fullWidth"
        >
          <Tab
            label="Diabetes"
            icon={<LocalHospital />}
            iconPosition="start"
          />
          <Tab
            label="Heart Disease"
            icon={<Favorite />}
            iconPosition="start"
          />
          <Tab
            label="Thyroid Issues"
            icon={<Psychology />}
            iconPosition="start"
          />
        </Tabs>

        {renderSummary()}
        {renderCharts()}
        {renderTable()}
      </Paper>
    </Box>
  );
};

export default Results; 