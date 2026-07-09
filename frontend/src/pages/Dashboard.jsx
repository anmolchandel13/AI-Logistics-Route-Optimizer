import { useEffect, useState } from 'react';
import { Grid, Typography, Box } from '@mui/material';
import {
  LocalShipping, PendingActions, CheckCircle, TrendingUp,
  Speed, Co2, AttachMoney, Route,
} from '@mui/icons-material';
import { Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale,
  LinearScale, BarElement, Title,
} from 'chart.js';
import StatsCard from '../components/StatsCard';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../api/axios';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard')
      .then((res) => setStats(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner message="Loading dashboard..." />;
  if (!stats) return <Typography color="error">Failed to load dashboard</Typography>;

  const statusColors = ['#f59e0b', '#6366f1', '#3b82f6', '#10b981', '#ef4444'];
  const statusLabels = ['Pending', 'Optimized', 'In Transit', 'Delivered', 'Cancelled'];
  const statusValues = [
    stats.pendingShipments, stats.optimizedShipments, stats.inTransitShipments,
    stats.deliveredShipments, stats.cancelledShipments,
  ];

  const doughnutData = {
    labels: statusLabels,
    datasets: [{
      data: statusValues,
      backgroundColor: statusColors,
      borderWidth: 0,
      hoverOffset: 8,
    }],
  };

  const priorityData = {
    labels: stats.shipmentsByPriority ? Object.keys(stats.shipmentsByPriority) : [],
    datasets: [{
      label: 'Shipments',
      data: stats.shipmentsByPriority ? Object.values(stats.shipmentsByPriority) : [],
      backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'],
      borderRadius: 8,
      borderSkipped: false,
    }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: 'bottom', labels: { padding: 16, usePointStyle: true, color: '#94a3b8' } },
    },
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { ticks: { color: '#94a3b8' }, grid: { display: false } },
      y: { ticks: { color: '#94a3b8', stepSize: 1 }, grid: { color: 'rgba(148,163,184,0.08)' } },
    },
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 0.5 }}>Dashboard</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Overview of your logistics operations
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={3}>
          <StatsCard title="Total Shipments" value={stats.totalShipments}
            icon={<LocalShipping />} color="#6366f1" />
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatsCard title="Pending" value={stats.pendingShipments}
            icon={<PendingActions />} color="#f59e0b" />
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatsCard title="Delivered" value={stats.deliveredShipments}
            icon={<CheckCircle />} color="#10b981" />
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatsCard title="Avg Score" value={stats.avgOptimizationScore || 0}
            icon={<Speed />} color="#06b6d4" subtitle="/ 100" />
        </Grid>
      </Grid>

      {/* Secondary Stats */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={4}>
          <StatsCard title="Total Distance" value={`${stats.totalDistanceKm?.toLocaleString() || 0} km`}
            icon={<Route />} color="#8b5cf6" />
        </Grid>
        <Grid item xs={6} sm={4}>
          <StatsCard title="Total Cost" value={`$${stats.totalCostEstimate?.toLocaleString() || 0}`}
            icon={<AttachMoney />} color="#ec4899" />
        </Grid>
        <Grid item xs={6} sm={4}>
          <StatsCard title="CO₂ Emissions" value={`${stats.totalCarbonEmissionsKg?.toLocaleString() || 0} kg`}
            icon={<Co2 />} color="#10b981" />
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={2.5}>
        <Grid item xs={12} md={5}>
          <Box sx={{
            p: 3, borderRadius: 4, bgcolor: 'background.paper',
            border: '1px solid', borderColor: 'divider', height: 360,
          }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Shipments by Status</Typography>
            <Box sx={{ height: 280 }}>
              <Doughnut data={doughnutData} options={chartOptions} />
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={7}>
          <Box sx={{
            p: 3, borderRadius: 4, bgcolor: 'background.paper',
            border: '1px solid', borderColor: 'divider', height: 360,
          }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Shipments by Priority</Typography>
            <Box sx={{ height: 280 }}>
              <Bar data={priorityData} options={barOptions} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
