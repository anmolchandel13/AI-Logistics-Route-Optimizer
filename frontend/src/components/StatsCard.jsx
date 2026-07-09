import { Card, CardContent, Box, Typography } from '@mui/material';

const StatsCard = ({ title, value, icon, color = 'primary.main', subtitle }) => (
  <Card
    sx={{
      height: '100%',
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: (theme) =>
          theme.palette.mode === 'dark'
            ? '0 12px 40px rgba(99, 102, 241, 0.15)'
            : '0 12px 40px rgba(0, 0, 0, 0.1)',
      },
    }}
  >
    <CardContent sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, fontWeight: 500 }}>
            {title}
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 800, color }}>
            {value}
          </Typography>
          {subtitle && (
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        <Box
          sx={{
            p: 1.5,
            borderRadius: 3,
            background: `linear-gradient(135deg, ${color}22, ${color}11)`,
            color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

export default StatsCard;
