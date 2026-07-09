import { useEffect, useState } from 'react';
import {
  Box, Typography, Card, CardContent, List, ListItem, ListItemIcon,
  ListItemText, IconButton, Button, Chip, Divider,
} from '@mui/material';
import {
  Info, Warning, CheckCircle, Error, MarkEmailRead, DoneAll,
} from '@mui/icons-material';
import api from '../api/axios';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';

const typeIcons = {
  INFO: <Info color="info" />,
  WARNING: <Warning color="warning" />,
  SUCCESS: <CheckCircle color="success" />,
  ERROR: <Error color="error" />,
};

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = () => {
    api.get('/notifications')
      .then((res) => setNotifications(res.data.data || []))
      .catch(() => toast.error('Failed to load notifications'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchNotifications(); }, []);

  const markAsRead = async (id) => {
    await api.patch(`/notifications/${id}/read`);
    setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllAsRead = async () => {
    await api.patch('/notifications/read-all');
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    toast.success('All marked as read');
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4">Notifications</Typography>
          <Typography variant="body2" color="text.secondary">
            {notifications.filter(n => !n.isRead).length} unread notifications
          </Typography>
        </Box>
        <Button variant="outlined" startIcon={<DoneAll />} onClick={markAllAsRead}>
          Mark All Read
        </Button>
      </Box>

      <Card sx={{ border: '1px solid', borderColor: 'divider' }}>
        <CardContent sx={{ p: 0 }}>
          <List>
            {notifications.length === 0 ? (
              <ListItem>
                <ListItemText primary="No notifications yet" sx={{ textAlign: 'center', py: 4 }} />
              </ListItem>
            ) : (
              notifications.map((n, i) => (
                <Box key={n.id}>
                  <ListItem
                    sx={{
                      py: 2, px: 3,
                      bgcolor: n.isRead ? 'transparent' : 'action.hover',
                      transition: 'background 0.2s ease',
                    }}
                    secondaryAction={
                      !n.isRead && (
                        <IconButton onClick={() => markAsRead(n.id)}>
                          <MarkEmailRead sx={{ fontSize: 20 }} />
                        </IconButton>
                      )
                    }
                  >
                    <ListItemIcon sx={{ minWidth: 44 }}>
                      {typeIcons[n.type] || <Info />}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography fontWeight={n.isRead ? 400 : 700} variant="body1">
                            {n.title}
                          </Typography>
                          {!n.isRead && <Chip label="New" size="small" color="primary" sx={{ height: 20, fontSize: '0.65rem' }} />}
                        </Box>
                      }
                      secondary={
                        <>
                          <Typography variant="body2" color="text.secondary">{n.message}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {n.createdAt ? new Date(n.createdAt).toLocaleString() : ''}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                  {i < notifications.length - 1 && <Divider />}
                </Box>
              ))
            )}
          </List>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Notifications;
