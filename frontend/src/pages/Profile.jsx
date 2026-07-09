import { useState, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent, TextField, Button, Avatar, Grid,
  CircularProgress,
} from '@mui/material';
import { Save, Person } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({ name: '', phone: '', company: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/users/profile')
      .then((res) => {
        const d = res.data.data;
        setForm({ name: d.name || '', phone: d.phone || '', company: d.company || '' });
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put('/users/profile', form);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 0.5 }}>Profile</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Manage your account information
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ textAlign: 'center', border: '1px solid', borderColor: 'divider' }}>
            <CardContent sx={{ p: 4 }}>
              <Avatar
                sx={{
                  width: 100, height: 100, mx: 'auto', mb: 2, fontSize: '2.5rem',
                  background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
                  fontWeight: 800,
                }}
              >
                {user?.name?.charAt(0)?.toUpperCase()}
              </Avatar>
              <Typography variant="h5" fontWeight={700}>{user?.name}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{user?.email}</Typography>
              <Typography variant="caption" sx={{
                mt: 1, display: 'inline-block', px: 2, py: 0.5, borderRadius: 2,
                bgcolor: user?.role === 'ADMIN' ? 'error.main' : 'primary.main',
                color: '#fff', fontWeight: 700,
              }}>
                {user?.role}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ border: '1px solid', borderColor: 'divider' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ mb: 3 }}>Edit Profile</Typography>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2.5}>
                  <Grid item xs={12}>
                    <TextField fullWidth label="Full Name" value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Phone" value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Company" value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })} />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth label="Email" value={user?.email || ''} disabled
                      helperText="Email cannot be changed" />
                  </Grid>
                  <Grid item xs={12}>
                    <Button type="submit" variant="contained" startIcon={loading ? <CircularProgress size={20} /> : <Save />}
                      disabled={loading}
                      sx={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile;
