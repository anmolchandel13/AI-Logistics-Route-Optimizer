import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, TextField, InputAdornment, Chip, IconButton,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, MenuItem, Select, FormControl, InputLabel, Tooltip,
} from '@mui/material';
import { Search, Add, Visibility, Delete, FilterList } from '@mui/icons-material';
import api from '../api/axios';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';

const statusColors = {
  PENDING: 'warning', OPTIMIZED: 'info', IN_TRANSIT: 'primary',
  DELIVERED: 'success', CANCELLED: 'error',
};

const Shipments = () => {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const navigate = useNavigate();

  const fetchShipments = () => {
    setLoading(true);
    const endpoint = statusFilter !== 'ALL'
      ? `/shipments/status/${statusFilter}`
      : search ? `/shipments/search?query=${search}` : '/shipments';
    api.get(endpoint)
      .then((res) => setShipments(res.data.data || []))
      .catch(() => toast.error('Failed to load shipments'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchShipments(); }, [statusFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchShipments();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this shipment?')) return;
    try {
      await api.delete(`/shipments/${id}`);
      toast.success('Shipment deleted');
      fetchShipments();
    } catch { toast.error('Delete failed'); }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4">Shipments</Typography>
          <Typography variant="body2" color="text.secondary">Manage your shipments and track routes</Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />}
          onClick={() => navigate('/shipments/new')}
          sx={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}
        >
          New Shipment
        </Button>
      </Box>

      {/* Filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <form onSubmit={handleSearch} style={{ flex: 1, minWidth: 200 }}>
          <TextField fullWidth size="small" placeholder="Search by tracking #, location..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 20 }} /></InputAdornment> }}
          />
        </form>
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Status</InputLabel>
          <Select value={statusFilter} label="Status" onChange={(e) => setStatusFilter(e.target.value)}>
            <MenuItem value="ALL">All Statuses</MenuItem>
            <MenuItem value="PENDING">Pending</MenuItem>
            <MenuItem value="OPTIMIZED">Optimized</MenuItem>
            <MenuItem value="IN_TRANSIT">In Transit</MenuItem>
            <MenuItem value="DELIVERED">Delivered</MenuItem>
            <MenuItem value="CANCELLED">Cancelled</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {loading ? <LoadingSpinner /> : (
        <TableContainer component={Paper} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tracking #</TableCell>
                <TableCell>Pickup</TableCell>
                <TableCell>Destination</TableCell>
                <TableCell>Weight</TableCell>
                <TableCell>Vehicle</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Score</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {shipments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 6 }}>
                    <Typography color="text.secondary">No shipments found. Create your first!</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                shipments.map((s) => (
                  <TableRow key={s.id} hover sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}
                    onClick={() => navigate(`/shipments/${s.id}`)}
                  >
                    <TableCell sx={{ fontWeight: 600, fontFamily: 'monospace' }}>{s.trackingNumber}</TableCell>
                    <TableCell sx={{ maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {s.pickupLocation}
                    </TableCell>
                    <TableCell sx={{ maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {s.destination}
                    </TableCell>
                    <TableCell>{s.weightKg} kg</TableCell>
                    <TableCell>{s.vehicleType}</TableCell>
                    <TableCell>
                      <Chip label={s.priority} size="small"
                        color={s.priority === 'CRITICAL' ? 'error' : s.priority === 'HIGH' ? 'warning' : 'default'}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip label={s.status?.replace('_', ' ')} size="small"
                        color={statusColors[s.status] || 'default'} variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      {s.routeOptimization?.optimizationScore ? (
                        <Chip label={`${s.routeOptimization.optimizationScore}/100`} size="small"
                          color={s.routeOptimization.optimizationScore >= 80 ? 'success' : 'warning'}
                        />
                      ) : '—'}
                    </TableCell>
                    <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                      <Tooltip title="View Details">
                        <IconButton size="small" onClick={() => navigate(`/shipments/${s.id}`)}>
                          <Visibility fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton size="small" color="error" onClick={() => handleDelete(s.id)}>
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default Shipments;
