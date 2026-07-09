import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Card, CardContent, Grid, Chip, Button,
  Divider, LinearProgress, MenuItem, Select, FormControl, InputLabel,
} from '@mui/material';
import {
  ArrowBack, Route, Speed, AttachMoney, LocalGasStation,
  Co2, Warning, Cloud, AltRoute, Lightbulb, Refresh, LocalShipping,
} from '@mui/icons-material';
import api from '../api/axios';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';

const statusColors = {
  PENDING: 'warning', OPTIMIZED: 'info', IN_TRANSIT: 'primary',
  DELIVERED: 'success', CANCELLED: 'error',
};

const ShipmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [shipment, setShipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reOptimizing, setReOptimizing] = useState(false);
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    api.get(`/shipments/${id}`)
      .then((res) => {
        setShipment(res.data.data);
        setNewStatus(res.data.data.status);
      })
      .catch(() => toast.error('Shipment not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleReOptimize = async () => {
    setReOptimizing(true);
    try {
      const res = await api.post(`/shipments/${id}/re-optimize`);
      setShipment(res.data.data);
      toast.success('Route re-optimized!');
    } catch { toast.error('Re-optimization failed'); }
    finally { setReOptimizing(false); }
  };

  const handleStatusUpdate = async (status) => {
    try {
      const res = await api.patch(`/shipments/${id}/status?status=${status}`);
      setShipment(res.data.data);
      setNewStatus(status);
      toast.success('Status updated');
    } catch { toast.error('Update failed'); }
  };

  if (loading) return <LoadingSpinner />;
  if (!shipment) return <Typography>Not found</Typography>;

  const ro = shipment.routeOptimization;

  const parseJson = (str) => {
    try { return JSON.parse(str); } catch { return str; }
  };

  return (
    <Box>
      <Button startIcon={<ArrowBack />} onClick={() => navigate('/shipments')} sx={{ mb: 2 }}>
        Back to Shipments
      </Button>

      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocalShipping /> {shipment.trackingNumber}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
            <Chip label={shipment.status?.replace('_', ' ')} color={statusColors[shipment.status]} />
            <Chip label={shipment.priority} variant="outlined"
              color={shipment.priority === 'CRITICAL' ? 'error' : 'default'} />
            <Chip label={shipment.vehicleType} variant="outlined" />
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Status</InputLabel>
            <Select value={newStatus} label="Status" onChange={(e) => handleStatusUpdate(e.target.value)}>
              {['PENDING','OPTIMIZED','IN_TRANSIT','DELIVERED','CANCELLED'].map(s => (
                <MenuItem key={s} value={s}>{s.replace('_', ' ')}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="contained" startIcon={<Refresh />}
            onClick={handleReOptimize} disabled={reOptimizing}
            sx={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}
          >
            {reOptimizing ? 'Optimizing...' : 'Re-Optimize'}
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Shipment Info */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', border: '1px solid', borderColor: 'divider' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Shipment Details</Typography>
              <InfoRow label="Pickup" value={shipment.pickupLocation} />
              <InfoRow label="Destination" value={shipment.destination} />
              <InfoRow label="Weight" value={`${shipment.weightKg} kg`} />
              <InfoRow label="Vehicle" value={shipment.vehicleType} />
              <InfoRow label="Cargo" value={shipment.cargoType} />
              <InfoRow label="Deadline" value={shipment.deliveryDeadline
                ? new Date(shipment.deliveryDeadline).toLocaleString() : 'Not set'} />
              {shipment.notes && <InfoRow label="Notes" value={shipment.notes} />}
            </CardContent>
          </Card>
        </Grid>

        {/* Route Optimization Results */}
        <Grid item xs={12} md={8}>
          {ro ? (
            <Box>
              {/* Score & Key Metrics */}
              <Card sx={{ mb: 2.5, border: '1px solid', borderColor: 'divider',
                background: (theme) => theme.palette.mode === 'dark'
                  ? 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(6,182,212,0.05))'
                  : 'linear-gradient(135deg, rgba(99,102,241,0.04), rgba(6,182,212,0.02))',
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">AI Route Analysis</Typography>
                    <Chip label={`Score: ${ro.optimizationScore}/100`}
                      color={ro.optimizationScore >= 80 ? 'success' : ro.optimizationScore >= 60 ? 'warning' : 'error'}
                      sx={{ fontWeight: 700 }}
                    />
                  </Box>
                  <LinearProgress variant="determinate" value={ro.optimizationScore}
                    sx={{ height: 8, borderRadius: 4, mb: 3,
                      bgcolor: 'rgba(148,163,184,0.15)',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 4,
                        background: ro.optimizationScore >= 80
                          ? 'linear-gradient(90deg, #10b981, #06b6d4)'
                          : 'linear-gradient(90deg, #f59e0b, #ef4444)',
                      },
                    }}
                  />
                  <Grid container spacing={2}>
                    <Grid item xs={6} sm={3}>
                      <MetricCard icon={<Route />} label="Distance" value={`${ro.distanceKm} km`} color="#6366f1" />
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <MetricCard icon={<Speed />} label="Est. Time" value={ro.estimatedTime} color="#06b6d4" />
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <MetricCard icon={<AttachMoney />} label="Cost" value={`$${ro.costEstimate}`} color="#10b981" />
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <MetricCard icon={<LocalGasStation />} label="Fuel" value={`${ro.fuelConsumptionLiters}L`} color="#f59e0b" />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* Recommended Route */}
              <Card sx={{ mb: 2.5, border: '1px solid', borderColor: 'divider' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                    <Route color="primary" /> Recommended Route
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                    {ro.recommendedRoute}
                  </Typography>
                </CardContent>
              </Card>

              {/* Risks & Weather */}
              <Grid container spacing={2.5}>
                <Grid item xs={12} md={6}>
                  <Card sx={{ height: '100%', border: '1px solid', borderColor: 'divider' }}>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                        <Warning color="warning" /> Delay Risks
                      </Typography>
                      {(() => {
                        const risks = parseJson(ro.delayRisks);
                        return Array.isArray(risks) ? risks.map((r, i) => (
                          <Typography key={i} variant="body2" color="text.secondary" sx={{ mb: 1, pl: 2, borderLeft: '3px solid', borderColor: 'warning.main' }}>
                            {r}
                          </Typography>
                        )) : <Typography variant="body2" color="text.secondary">{String(risks)}</Typography>;
                      })()}
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card sx={{ height: '100%', border: '1px solid', borderColor: 'divider' }}>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                        <Cloud color="info" /> Weather Impact
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                        {(() => {
                          const w = parseJson(ro.weatherImpact);
                          return typeof w === 'object' ? JSON.stringify(w, null, 2) : String(w);
                        })()}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              {/* Suggestions */}
              <Card sx={{ mt: 2.5, border: '1px solid', borderColor: 'divider' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                    <Lightbulb color="success" /> Optimization Suggestions
                  </Typography>
                  {(() => {
                    const suggestions = parseJson(ro.optimizationSuggestions);
                    return Array.isArray(suggestions) ? suggestions.map((s, i) => (
                      <Box key={i} sx={{ display: 'flex', gap: 1.5, mb: 1.5, alignItems: 'flex-start' }}>
                        <Chip label={i + 1} size="small" color="success" sx={{ minWidth: 28, fontWeight: 700 }} />
                        <Typography variant="body2" color="text.secondary">{s}</Typography>
                      </Box>
                    )) : <Typography variant="body2" color="text.secondary">{String(suggestions)}</Typography>;
                  })()}
                </CardContent>
              </Card>

              {/* Alternative Routes */}
              <Card sx={{ mt: 2.5, border: '1px solid', borderColor: 'divider' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                    <AltRoute color="secondary" /> Alternative Routes
                  </Typography>
                  {(() => {
                    const routes = parseJson(ro.alternativeRoutes);
                    return Array.isArray(routes) ? routes.map((r, i) => (
                      <Box key={i} sx={{ p: 2, mb: 1, borderRadius: 2, bgcolor: 'action.hover' }}>
                        <Typography variant="subtitle2" fontWeight={700}>{r.name || `Route ${i + 2}`}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Distance: {r.distance} | Time: {r.time}
                        </Typography>
                        {r.pros && <Typography variant="body2" color="success.main">✓ {r.pros}</Typography>}
                        {r.cons && <Typography variant="body2" color="error.main">✗ {r.cons}</Typography>}
                      </Box>
                    )) : <Typography variant="body2" color="text.secondary">{String(routes)}</Typography>;
                  })()}
                </CardContent>
              </Card>

              {/* Footer */}
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="caption" color="text.secondary">
                  AI Model: {ro.aiModelUsed}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Generated: {ro.generatedAt ? new Date(ro.generatedAt).toLocaleString() : 'N/A'}
                </Typography>
              </Box>
            </Box>
          ) : (
            <Card sx={{ p: 6, textAlign: 'center', border: '1px solid', borderColor: 'divider' }}>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                No route optimization available
              </Typography>
              <Button variant="contained" onClick={handleReOptimize} startIcon={<Refresh />}>
                Run AI Optimization
              </Button>
            </Card>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

const InfoRow = ({ label, value }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
    <Typography variant="body2" color="text.secondary">{label}</Typography>
    <Typography variant="body2" fontWeight={600} sx={{ textAlign: 'right', maxWidth: '60%' }}>{value}</Typography>
  </Box>
);

const MetricCard = ({ icon, label, value, color }) => (
  <Box sx={{ textAlign: 'center', p: 1.5, borderRadius: 2, bgcolor: 'action.hover' }}>
    <Box sx={{ color, mb: 0.5 }}>{icon}</Box>
    <Typography variant="h6" fontWeight={800}>{value}</Typography>
    <Typography variant="caption" color="text.secondary">{label}</Typography>
  </Box>
);

export default ShipmentDetail;
