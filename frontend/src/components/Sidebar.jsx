import { useLocation, useNavigate } from 'react-router-dom';
import {
  Drawer, List, ListItemButton, ListItemIcon, ListItemText,
  Box, Typography, Divider,
} from '@mui/material';
import {
  Dashboard, LocalShipping, AddBox, Person,
  Notifications, Assessment, AdminPanelSettings, Route,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const menuItems = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
  { text: 'Shipments', icon: <LocalShipping />, path: '/shipments' },
  { text: 'New Shipment', icon: <AddBox />, path: '/shipments/new' },
  { text: 'Reports', icon: <Assessment />, path: '/reports' },
  { text: 'Notifications', icon: <Notifications />, path: '/notifications' },
  { text: 'Profile', icon: <Person />, path: '/profile' },
];

const adminItems = [
  { text: 'Admin Panel', icon: <AdminPanelSettings />, path: '/admin' },
];

const Sidebar = ({ drawerWidth, mobileOpen, onClose, isMobile }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Logo */}
      <Box
        sx={{
          p: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          cursor: 'pointer',
        }}
        onClick={() => navigate('/dashboard')}
      >
        <Box
          sx={{
            width: 42,
            height: 42,
            borderRadius: 2.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
            boxShadow: '0 4px 14px rgba(99, 102, 241, 0.3)',
          }}
        >
          <Route sx={{ color: '#fff', fontSize: 24 }} />
        </Box>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 800, lineHeight: 1.2, color: 'text.primary' }}>
            RouteAI
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem' }}>
            Logistics Optimizer
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ mx: 2 }} />

      {/* Navigation */}
      <List sx={{ px: 2, py: 1, flexGrow: 1 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItemButton
              key={item.text}
              onClick={() => {
                navigate(item.path);
                if (isMobile) onClose();
              }}
              sx={{
                borderRadius: 2.5,
                mb: 0.5,
                px: 2,
                py: 1.2,
                transition: 'all 0.2s ease',
                bgcolor: isActive ? 'primary.main' : 'transparent',
                color: isActive ? '#fff' : 'text.secondary',
                '&:hover': {
                  bgcolor: isActive ? 'primary.dark' : 'action.hover',
                  transform: 'translateX(4px)',
                },
                '& .MuiListItemIcon-root': {
                  color: isActive ? '#fff' : 'text.secondary',
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontSize: '0.875rem',
                  fontWeight: isActive ? 700 : 500,
                }}
              />
            </ListItemButton>
          );
        })}

        {isAdmin() && (
          <>
            <Divider sx={{ my: 1.5 }} />
            <Typography variant="overline" sx={{ px: 2, color: 'text.secondary', fontSize: '0.65rem' }}>
              Administration
            </Typography>
            {adminItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <ListItemButton
                  key={item.text}
                  onClick={() => {
                    navigate(item.path);
                    if (isMobile) onClose();
                  }}
                  sx={{
                    borderRadius: 2.5,
                    mb: 0.5,
                    px: 2,
                    py: 1.2,
                    transition: 'all 0.2s ease',
                    bgcolor: isActive ? 'primary.main' : 'transparent',
                    color: isActive ? '#fff' : 'text.secondary',
                    '&:hover': {
                      bgcolor: isActive ? 'primary.dark' : 'action.hover',
                      transform: 'translateX(4px)',
                    },
                    '& .MuiListItemIcon-root': {
                      color: isActive ? '#fff' : 'text.secondary',
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontSize: '0.875rem',
                      fontWeight: isActive ? 700 : 500,
                    }}
                  />
                </ListItemButton>
              );
            })}
          </>
        )}
      </List>

      {/* Footer */}
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="caption" color="text.secondary">
          © 2024 RouteAI v1.0
        </Typography>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            bgcolor: 'background.paper',
            borderRight: '1px solid',
            borderColor: 'divider',
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            bgcolor: 'background.paper',
            borderRight: '1px solid',
            borderColor: 'divider',
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default Sidebar;
