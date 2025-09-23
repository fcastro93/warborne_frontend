import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Alert,
  Stack,
  Avatar,
  Divider,
  Paper,
  Fab
} from '@mui/material';
import Layout from './Layout';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Event as EventIcon,
  People as PeopleIcon,
  Schedule as ScheduleIcon,
  LocationOn as LocationIcon,
  Close as CloseIcon,
  Save as SaveIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { apiService } from '../services/api';

const EventManagement = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', type: 'success' });

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_type: 'other',
    event_datetime: '',
    timezone: 'UTC',
    max_participants: ''
  });

  const eventTypes = [
    { value: 'guild_war', label: 'Guild War' },
    { value: 'pvp_fight', label: 'PvP Fight' },
    { value: 'resource_farming', label: 'Resource Farming' },
    { value: 'boss_raid', label: 'Boss Raid' },
    { value: 'social_event', label: 'Social Event' },
    { value: 'training', label: 'Training' },
    { value: 'other', label: 'Other' }
  ];

  const timezones = [
    'UTC', 'EST', 'PST', 'CST', 'MST', 'CET', 'GMT', 'JST', 'AEST', 'PDT', 'EDT', 'CDT', 'MDT'
  ];

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/events/');
      const data = await response.json();
      setEvents(data.events || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      showAlert('Error fetching events', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (message, type = 'success') => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: 'success' }), 5000);
  };

  const handleCreateEvent = () => {
    setFormData({
      title: '',
      description: '',
      event_type: 'other',
      event_datetime: '',
      timezone: 'UTC',
      max_participants: ''
    });
    setCreateModalOpen(true);
  };

  const handleEditEvent = (event) => {
    setSelectedEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      event_type: event.event_type,
      event_datetime: new Date(event.event_datetime).toISOString().slice(0, 16),
      timezone: event.timezone,
      max_participants: event.max_participants || ''
    });
    setEditModalOpen(true);
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Are you sure you want to cancel this event?')) {
      try {
        const response = await fetch(`/api/events/${eventId}/delete/`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
          },
          credentials: 'include'
        });
        
        if (response.ok) {
          showAlert('Event cancelled successfully', 'success');
          fetchEvents();
        } else {
          const error = await response.json();
          showAlert(error.error || 'Error cancelling event', 'error');
        }
      } catch (error) {
        console.error('Error cancelling event:', error);
        showAlert('Error cancelling event', 'error');
      }
    }
  };

  const handleSubmitEvent = async () => {
    try {
      const submitData = {
        ...formData,
        created_by_discord_id: 0,
        created_by_discord_name: 'Web User',
        max_participants: formData.max_participants ? parseInt(formData.max_participants) : null
      };

      const url = selectedEvent ? `/api/events/${selectedEvent.id}/update/` : '/api/events/create/';
      const method = selectedEvent ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCookie('csrftoken')
        },
        credentials: 'include',
        body: JSON.stringify(submitData)
      });

      if (response.ok) {
        showAlert(selectedEvent ? 'Event updated successfully' : 'Event created successfully', 'success');
        setCreateModalOpen(false);
        setEditModalOpen(false);
        setSelectedEvent(null);
        fetchEvents();
      } else {
        const error = await response.json();
        showAlert(error.error || 'Error saving event', 'error');
      }
    } catch (error) {
      console.error('Error saving event:', error);
      showAlert('Error saving event', 'error');
    }
  };

  const getCookie = (name) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  };

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEventTypeColor = (eventType) => {
    const colors = {
      guild_war: 'error',
      pvp_fight: 'warning',
      resource_farming: 'info',
      boss_raid: 'secondary',
      social_event: 'success',
      training: 'primary',
      other: 'default'
    };
    return colors[eventType] || 'default';
  };

  const isEventUpcoming = (eventDateTime) => {
    return new Date(eventDateTime) > new Date();
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography>Loading events...</Typography>
      </Box>
    );
  }

  return (
    <Layout>
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <EventIcon />
            Event Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateEvent}
            sx={{ bgcolor: '#4a9eff', '&:hover': { bgcolor: '#357abd' } }}
          >
            Create Event
          </Button>
        </Box>

      {/* Alert */}
      {alert.show && (
        <Alert severity={alert.type} sx={{ mb: 2 }} onClose={() => setAlert({ show: false, message: '', type: 'success' })}>
          {alert.message}
        </Alert>
      )}

      {/* Events Grid */}
      {events.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <EventIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No Events Found
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              Create your first event to get started
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateEvent}
              sx={{ bgcolor: '#4a9eff', '&:hover': { bgcolor: '#357abd' } }}
            >
              Create Event
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {events.map((event) => (
            <Grid item xs={12} md={6} lg={4} key={event.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                      {event.title}
                    </Typography>
                    <Chip
                      label={event.event_type_display}
                      color={getEventTypeColor(event.event_type)}
                      size="small"
                    />
                  </Box>

                  {event.description && (
                    <Typography color="text.secondary" sx={{ mb: 2 }}>
                      {event.description}
                    </Typography>
                  )}

                  <Stack spacing={1} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <ScheduleIcon fontSize="small" color="action" />
                      <Typography variant="body2">
                        {formatDateTime(event.event_datetime)}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PeopleIcon fontSize="small" color="action" />
                      <Typography variant="body2">
                        {event.participant_count} participants
                        {event.max_participants && ` / ${event.max_participants} max`}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LocationIcon fontSize="small" color="action" />
                      <Typography variant="body2">
                        {event.timezone}
                      </Typography>
                    </Box>
                  </Stack>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Chip
                      label={isEventUpcoming(event.event_datetime) ? 'Upcoming' : 'Past'}
                      color={isEventUpcoming(event.event_datetime) ? 'success' : 'default'}
                      size="small"
                    />
                    <Typography variant="caption" color="text.secondary">
                      by {event.created_by_discord_name}
                    </Typography>
                  </Box>
                </CardContent>

                <Box sx={{ p: 2, pt: 0 }}>
                  <Stack direction="row" spacing={1}>
                    <Button
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={() => handleEditEvent(event)}
                      disabled={!isEventUpcoming(event.event_datetime)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDeleteEvent(event.id)}
                      disabled={!isEventUpcoming(event.event_datetime)}
                    >
                      Cancel
                    </Button>
                  </Stack>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Create Event Modal */}
      <Dialog open={createModalOpen} onClose={() => setCreateModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Event</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Event Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
            
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            
            <FormControl fullWidth>
              <InputLabel>Event Type</InputLabel>
              <Select
                value={formData.event_type}
                onChange={(e) => setFormData({ ...formData, event_type: e.target.value })}
                label="Event Type"
              >
                {eventTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <TextField
              fullWidth
              label="Event Date & Time"
              type="datetime-local"
              value={formData.event_datetime}
              onChange={(e) => setFormData({ ...formData, event_datetime: e.target.value })}
              InputLabelProps={{ shrink: true }}
              required
            />
            
            <FormControl fullWidth>
              <InputLabel>Timezone</InputLabel>
              <Select
                value={formData.timezone}
                onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                label="Timezone"
              >
                {timezones.map((tz) => (
                  <MenuItem key={tz} value={tz}>
                    {tz}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <TextField
              fullWidth
              label="Max Participants (optional)"
              type="number"
              value={formData.max_participants}
              onChange={(e) => setFormData({ ...formData, max_participants: e.target.value })}
              helperText="Leave empty for unlimited participants"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateModalOpen(false)} startIcon={<CancelIcon />}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmitEvent}
            variant="contained"
            startIcon={<SaveIcon />}
            disabled={!formData.title || !formData.event_datetime}
            sx={{ bgcolor: '#4a9eff', '&:hover': { bgcolor: '#357abd' } }}
          >
            Create Event
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Event Modal */}
      <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Event</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Event Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
            
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            
            <FormControl fullWidth>
              <InputLabel>Event Type</InputLabel>
              <Select
                value={formData.event_type}
                onChange={(e) => setFormData({ ...formData, event_type: e.target.value })}
                label="Event Type"
              >
                {eventTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <TextField
              fullWidth
              label="Event Date & Time"
              type="datetime-local"
              value={formData.event_datetime}
              onChange={(e) => setFormData({ ...formData, event_datetime: e.target.value })}
              InputLabelProps={{ shrink: true }}
              required
            />
            
            <FormControl fullWidth>
              <InputLabel>Timezone</InputLabel>
              <Select
                value={formData.timezone}
                onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                label="Timezone"
              >
                {timezones.map((tz) => (
                  <MenuItem key={tz} value={tz}>
                    {tz}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <TextField
              fullWidth
              label="Max Participants (optional)"
              type="number"
              value={formData.max_participants}
              onChange={(e) => setFormData({ ...formData, max_participants: e.target.value })}
              helperText="Leave empty for unlimited participants"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditModalOpen(false)} startIcon={<CancelIcon />}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmitEvent}
            variant="contained"
            startIcon={<SaveIcon />}
            disabled={!formData.title || !formData.event_datetime}
            sx={{ bgcolor: '#4a9eff', '&:hover': { bgcolor: '#357abd' } }}
          >
            Update Event
          </Button>
        </DialogActions>
      </Dialog>

      {/* Floating Action Button for Mobile */}
      <Fab
        color="primary"
        aria-label="create event"
        onClick={handleCreateEvent}
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          bgcolor: '#4a9eff',
          '&:hover': { bgcolor: '#357abd' },
          display: { xs: 'flex', md: 'none' }
        }}
      >
        <AddIcon />
      </Fab>
      </Box>
    </Layout>
  );
};

export default EventManagement;
