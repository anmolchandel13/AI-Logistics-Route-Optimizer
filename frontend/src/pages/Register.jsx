import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box, Card, CardContent, TextField, Button, Typography, Link,
  InputAdornment, IconButton, CircularProgress,
} from '@mui/material';
import {
  Email, Lock, Person, Phone, Business, Visibility, VisibilityOff, Route,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', company: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, user } = useAuth();
  const navigate = useNavigate();

  if (user) { navigate('/dashboard', { replace: true }); return null; }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(135deg, #0a0f1e 0%, #1a1a3e 50%, #0a0f1e 100%)', p: 2,
      }}
    >
      <Box sx={{
        position: 'fixed', top: '-20%', left: '-10%', width: 500, height: 500,
        borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.15), transparent)',
        filter: 'blur(60px)',
      }} />

      <Card
        sx={{
          maxWidth: 480, width: '100%', position: 'relative', zIndex: 1,
          bgcolor: 'rgba(17, 24, 39, 0.8)', backdropFilter: 'blur(20px)',
          border: '1px solid rgba(148, 163, 184, 0.1)',
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Box
              sx={{
                width: 56, height: 56, borderRadius: 3, mx: 'auto', mb: 2,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
                boxShadow: '0 8px 24px rgba(99, 102, 241, 0.3)',
              }}
            >
              <Route sx={{ color: '#fff', fontSize: 30 }} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#f1f5f9' }}>
              Create Account
            </Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8', mt: 0.5 }}>
              Join the AI-powered logistics platform
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <TextField fullWidth label="Full Name" name="name" value={form.name}
              onChange={handleChange} required sx={{ mb: 2 }}
              InputProps={{ startAdornment: <InputAdornment position="start"><Person sx={{ color: 'text.secondary', fontSize: 20 }} /></InputAdornment> }}
            />
            <TextField fullWidth label="Email Address" name="email" value={form.email}
              onChange={handleChange} type="email" required sx={{ mb: 2 }}
              InputProps={{ startAdornment: <InputAdornment position="start"><Email sx={{ color: 'text.secondary', fontSize: 20 }} /></InputAdornment> }}
            />
            <TextField fullWidth label="Password" name="password" value={form.password}
              onChange={handleChange} type={showPassword ? 'text' : 'password'} required sx={{ mb: 2 }}
              inputProps={{ minLength: 6 }}
              InputProps={{
                startAdornment: <InputAdornment position="start"><Lock sx={{ color: 'text.secondary', fontSize: 20 }} /></InputAdornment>,
                endAdornment: <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} size="small">
                    {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                  </IconButton>
                </InputAdornment>,
              }}
            />
            <TextField fullWidth label="Phone (optional)" name="phone" value={form.phone}
              onChange={handleChange} sx={{ mb: 2 }}
              InputProps={{ startAdornment: <InputAdornment position="start"><Phone sx={{ color: 'text.secondary', fontSize: 20 }} /></InputAdornment> }}
            />
            <TextField fullWidth label="Company (optional)" name="company" value={form.company}
              onChange={handleChange} sx={{ mb: 3 }}
              InputProps={{ startAdornment: <InputAdornment position="start"><Business sx={{ color: 'text.secondary', fontSize: 20 }} /></InputAdornment> }}
            />

            <Button type="submit" fullWidth variant="contained" size="large" disabled={loading}
              sx={{
                py: 1.5, background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                fontSize: '1rem', fontWeight: 700, mb: 2,
                '&:hover': { background: 'linear-gradient(135deg, #818cf8, #6366f1)' },
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
            </Button>
          </form>

          <Typography variant="body2" align="center" sx={{ color: '#94a3b8' }}>
            Already have an account?{' '}
            <Link component={RouterLink} to="/login" sx={{ color: '#6366f1', fontWeight: 600 }}>
              Sign In
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Register;
