import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Grid, Card, CardContent, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Chip, IconButton, Tooltip, Button,
} from '@mui/material';
import {
  People, LocalShipping, TrendingUp, Speed,
  ToggleOn, ToggleOff, Visibility,
} from '@mui/icons-material';
import StatsCard from '../components/StatsCard';
import api from '../api/axios';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';

const AdminPanel = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin()) { navigate('/dashboard'); return; }
    Promise.all([
      api.get('/admin/dashboard'),
      api.get('/admin/users'),
    ]).then(([dashRes, usersRes]) => {
      setStats(dashRes.data.data);
      setUsers(usersRes.data.data || []);
    }).catch(() => toast.error('Failed to load admin data'))
      .finally(() => setLoading(false));
  }, []);

  const toggleUser = async (id) => {
    try {
      await api.patch(`/admin/users/${id}/toggle-status`);
      setUsers(users.map(u => u.id === id ? { ...u, active: !u.active } : u));
      toast.success('User status updated');
    } catch { toast.error('Failed to update user'); }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 0.5 }}>Admin Panel</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        System-wide management and statistics
      </Typography>

      {/* Admin Stats */}
      {stats && (
        <Grid container spacing={2.5} sx={{ mb: 4 }}>
          <Grid item xs={6} sm={3}>
            <StatsCard title="Total Users" value={users.length}
              icon={<People />} color="#6366f1" />
          </Grid>
          <Grid item xs={6} sm={3}>
            <StatsCard title="Total Shipments" value={stats.totalShipments}
              icon={<LocalShipping />} color="#06b6d4" />
          </Grid>
          <Grid item xs={6} sm={3}>
            <StatsCard title="Delivered" value={stats.deliveredShipments}
              icon={<TrendingUp />} color="#10b981" />
          </Grid>
          <Grid item xs={6} sm={3}>
            <StatsCard title="Avg Score" value={stats.avgOptimizationScore || 0}
              icon={<Speed />} color="#f59e0b" subtitle="/100" />
          </Grid>
        </Grid>
      )}

      {/* Users Table */}
      <Typography variant="h5" sx={{ mb: 2 }}>User Management</Typography>
      <TableContainer component={Paper} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Joined</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u.id} hover>
                <TableCell fontWeight={600}>{u.name}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>
                  <Chip label={u.role} size="small"
                    color={u.role === 'ADMIN' ? 'error' : 'primary'} variant="outlined" />
                </TableCell>
                <TableCell>{u.company || '—'}</TableCell>
                <TableCell>
                  <Chip label={u.active ? 'Active' : 'Inactive'} size="small"
                    color={u.active ? 'success' : 'default'} />
                </TableCell>
                <TableCell>
                  {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                </TableCell>
                <TableCell align="right">
                  <Tooltip title={u.active ? 'Deactivate' : 'Activate'}>
                    <IconButton size="small" onClick={() => toggleUser(u.id)}
                      color={u.active ? 'success' : 'default'}>
                      {u.active ? <ToggleOn /> : <ToggleOff />}
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AdminPanel;
