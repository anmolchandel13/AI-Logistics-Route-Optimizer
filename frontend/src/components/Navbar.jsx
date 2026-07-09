import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar, Toolbar, IconButton, Typography, Badge, Avatar, Menu, MenuItem,
  Box, Tooltip,
} from '@mui/material';
import {
  Menu as MenuIcon, Notifications as NotifIcon,
  DarkMode, LightMode, Logout, Person,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useThemeContext } from '../context/ThemeContext';
import api from '../api/axios';

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const { mode, toggleTheme } = useThemeContext();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    api.get('/notifications/unread-count')
      .then((res) => setUnreadCount(res.data.data?.count || 0))
      .catch(() => {});
  }, []);

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
        backdropFilter: 'blur(20px)',
      }}
    >
      <Toolbar sx={{ gap: 1 }}>
        <IconButton onClick={onMenuClick} sx={{ display: { md: 'none' } }}>
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" sx={{ flexGrow: 1, color: 'text.primary', fontWeight: 700 }}>
          {/* Spacer */}
        </Typography>

        <Tooltip title={mode === 'dark' ? 'Light mode' : 'Dark mode'}>
          <IconButton onClick={toggleTheme} sx={{ color: 'text.secondary' }}>
            {mode === 'dark' ? <LightMode /> : <DarkMode />}
          </IconButton>
        </Tooltip>

        <Tooltip title="Notifications">
          <IconButton onClick={() => navigate('/notifications')} sx={{ color: 'text.secondary' }}>
            <Badge badgeContent={unreadCount} color="error">
              <NotifIcon />
            </Badge>
          </IconButton>
        </Tooltip>

        <Tooltip title="Account">
          <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
            <Avatar
              sx={{
                width: 36, height: 36,
                bgcolor: 'primary.main',
                fontSize: '0.9rem',
                fontWeight: 700,
              }}
            >
              {user?.name?.charAt(0)?.toUpperCase()}
            </Avatar>
          </IconButton>
        </Tooltip>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          PaperProps={{
            sx: { mt: 1, minWidth: 180, borderRadius: 2 },
          }}
        >
          <MenuItem disabled>
            <Typography variant="body2" fontWeight={600}>{user?.name}</Typography>
          </MenuItem>
          <MenuItem onClick={() => { setAnchorEl(null); navigate('/profile'); }}>
            <Person sx={{ mr: 1, fontSize: 20 }} /> Profile
          </MenuItem>
          <MenuItem onClick={() => { setAnchorEl(null); logout(); navigate('/login'); }}>
            <Logout sx={{ mr: 1, fontSize: 20 }} /> Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
