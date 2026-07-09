import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Card, CardContent, Grid, TextField, Button,
  MenuItem, CircularProgress,
} from '@mui/material';
import { Send, ArrowBack } from '@mui/icons-material';
import api from '../api/axios';
import toast from 'react-hot-toast';

const vehicleTypes = ['TRUCK', 'VAN', 'BIKE', 'DRONE', 'SHIP', 'RAIL'];
const cargoTypes = ['GENERAL', 'FRAGILE', 'PERISHABLE', 'HAZARDOUS', 'OVERSIZED', 'LIQUID'];
const priorities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

const CreateShipment = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    pickupLocation: '', destination: '', weightKg: '',
    vehicleType: 'TRUCK', cargoType: 'GENERAL', priority: 'MEDIUM',
    deliveryDeadline: '', notes: '',
    pickupLat: '', pickupLng: '', destLat: '', destLng: '',
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        weightKg: parseFloat(form.weightKg),
        pickupLat: form.pickupLat ? parseFloat(form.pickupLat) : null,
        pickupLng: form.pickupLng ? parseFloat(form.pickupLng) : null,
        destLat: form.destLat ? parseFloat(form.destLat) : null,
        destLng: form.destLng ? parseFloat(form.destLng) : null,
        deliveryDeadline: form.deliveryDeadline || null,
      };
      const res = await api.post('/shipments', payload);
      toast.success('Shipment created & route optimized!');
      navigate(`/shipments/${res.data.data.id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create shipment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Button startIcon={<ArrowBack />} onClick={() => navigate('/shipments')} sx={{ mb: 2 }}>
        Back to Shipments
      </Button>

      <Typography variant="h4" sx={{ mb: 0.5 }}>Create New Shipment</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Enter shipment details — AI will automatically optimize the route
      </Typography>

      <Card sx={{ border: '1px solid', borderColor: 'divider' }}>
        <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Locations */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 700, color: 'primary.main' }}>
                  📍 Locations
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Pickup Location" name="pickupLocation"
                  value={form.pickupLocation} onChange={handleChange} required
                  placeholder="e.g., Mumbai, Maharashtra, India"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Destination" name="destination"
                  value={form.destination} onChange={handleChange} required
                  placeholder="e.g., Delhi, India"
                />
              </Grid>

              {/* Shipment Details */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 700, color: 'primary.main' }}>
                  📦 Shipment Details
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField fullWidth label="Weight (kg)" name="weightKg" type="number"
                  value={form.weightKg} onChange={handleChange} required
                  inputProps={{ min: 0.1, step: 0.1 }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField fullWidth select label="Vehicle Type" name="vehicleType"
                  value={form.vehicleType} onChange={handleChange}>
                  {vehicleTypes.map((v) => <MenuItem key={v} value={v}>{v}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField fullWidth select label="Cargo Type" name="cargoType"
                  value={form.cargoType} onChange={handleChange}>
                  {cargoTypes.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField fullWidth select label="Priority" name="priority"
                  value={form.priority} onChange={handleChange}>
                  {priorities.map((p) => <MenuItem key={p} value={p}>{p}</MenuItem>)}
                </TextField>
              </Grid>

              {/* Schedule */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 700, color: 'primary.main' }}>
                  📅 Schedule & Notes
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Delivery Deadline" name="deliveryDeadline"
                  type="datetime-local" value={form.deliveryDeadline} onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Notes (optional)" name="notes"
                  value={form.notes} onChange={handleChange} multiline rows={1}
                  placeholder="Any special handling instructions..."
                />
              </Grid>

              {/* Submit */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                  <Button type="submit" variant="contained" size="large" disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} /> : <Send />}
                    sx={{
                      px: 4, background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                      '&:hover': { background: 'linear-gradient(135deg, #818cf8, #6366f1)' },
                    }}
                  >
                    {loading ? 'Creating & Optimizing...' : 'Create & Optimize Route'}
                  </Button>
                  <Button variant="outlined" size="large" onClick={() => navigate('/shipments')}>
                    Cancel
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CreateShipment;
