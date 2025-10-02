import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Fab,
  Tabs,
  Tab,
  Badge
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
  Cancel as CancelIcon,
  SaveAlt as SaveTemplateIcon,
  Description as TemplateIcon
} from '@mui/icons-material';
import { apiService } from '../services/api';

const EventManagement = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [createTemplateModalOpen, setCreateTemplateModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', type: 'success' });
  const [dateFilter, setDateFilter] = useState('all');
  const [activeTab, setActiveTab] = useState(0);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_type: 'other',
    event_datetime: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, // Get user's timezone
    max_participants: '',
    points_per_participant: 0
  });


  // Create template form state
  const [templateFormData, setTemplateFormData] = useState({
    name: '',
    description: '',
    event_type: 'other',
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

  // Helper function to get authentication headers
  const getAuthHeaders = () => {
    const headers = {
      'Content-Type': 'application/json',
      'X-CSRFToken': getCookie('csrftoken')
    };
    
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }
    
    return headers;
  };


  useEffect(() => {
    fetchEvents();
    fetchTemplates();
  }, []);

  useEffect(() => {
    applyDateFilter();
  }, [events, dateFilter]);

  const applyDateFilter = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    let filtered = events;

    switch (dateFilter) {
      case 'upcoming':
        filtered = events.filter(event => new Date(event.event_datetime) > now);
        break;
      case 'past':
        filtered = events.filter(event => new Date(event.event_datetime) <= now);
        break;
      case 'today':
        filtered = events.filter(event => {
          const eventDate = new Date(event.event_datetime);
          const eventDateOnly = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
          return eventDateOnly.getTime() === today.getTime();
        });
        break;
      case 'this_week':
        filtered = events.filter(event => {
          const eventDate = new Date(event.event_datetime);
          return eventDate >= today && eventDate <= nextWeek;
        });
        break;
      case 'all':
      default:
        filtered = events;
        break;
    }

    setFilteredEvents(filtered);
  };

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/events/', {
        method: 'GET',
        headers: getAuthHeaders(),
        credentials: 'include'
      });
      const data = await response.json();
      setEvents(data.events || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      showAlert('Error fetching events', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/events/templates/', {
        method: 'GET',
        headers: getAuthHeaders(),
        credentials: 'include'
      });
      const data = await response.json();
      // The API returns an array directly, not wrapped in an object
      setTemplates(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching templates:', error);
      showAlert('Error fetching templates', 'error');
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
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, // Get user's timezone
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
      timezone: event.timezone, // Keep original timezone
      max_participants: event.max_participants || '',
      points_per_participant: event.points_per_participant || 0
    });
    setEditModalOpen(true);
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Are you sure you want to cancel this event?')) {
      try {
        const response = await fetch(`/api/events/${eventId}/delete/`, {
          method: 'DELETE',
          headers: getAuthHeaders(),
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
        headers: getAuthHeaders(),
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



  const handleCreateTemplate = () => {
    setTemplateFormData({
      name: '',
      description: '',
      event_type: 'other',
      max_participants: ''
    });
    setCreateTemplateModalOpen(true);
  };

  const handleSubmitCreateTemplate = async () => {
    try {
      const response = await fetch('/api/events/templates/', {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify({
          name: templateFormData.name,
          description: templateFormData.description,
          event_type: templateFormData.event_type,
          max_participants: templateFormData.max_participants ? parseInt(templateFormData.max_participants) : null
        })
      });

      const data = await response.json();

      if (response.ok) {
        showAlert('Template created successfully!', 'success');
        setCreateTemplateModalOpen(false);
        fetchTemplates();
      } else {
        showAlert(data.error || 'Error creating template', 'error');
      }
    } catch (error) {
      console.error('Error creating template:', error);
      showAlert('Error creating template', 'error');
    }
  };

  const handleCreateFromTemplate = (template) => {
    setSelectedEvent(template); // We'll use this to store the template data
    setFormData({
      title: `${template.name} Event`,
      description: template.description || '',
      event_type: template.event_type,
      event_datetime: '',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      max_participants: template.max_participants || '',
      points_per_participant: 0
    });
    setCreateModalOpen(true);
  };


  const handleDeleteTemplate = async (templateId) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      try {
        const response = await fetch(`/api/events/templates/${templateId}/delete/`, {
          method: 'DELETE',
          headers: getAuthHeaders(),
          credentials: 'include'
        });

        if (response.ok) {
          showAlert('Template deleted successfully', 'success');
          fetchTemplates();
        } else {
          const error = await response.json();
          showAlert(error.error || 'Error deleting template', 'error');
        }
      } catch (error) {
        console.error('Error deleting template:', error);
        showAlert('Error deleting template', 'error');
      }
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
    // Fix the double Z issue in the API response
    const cleanDateTime = dateTimeString.replace(/\+00:00Z$/, 'Z');
    const date = new Date(cleanDateTime);
    if (isNaN(date.getTime())) {
      return { date: 'Invalid Date', time: '' };
    }
    
    // Format date and time separately
    const dateStr = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    
    const timeStr = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });
    
    return { date: dateStr, time: timeStr };
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

  const handlePublishEvent = async (eventId) => {
    try {
      const response = await fetch(`/api/events/${eventId}/publish/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include'
      });

      const data = await response.json();
      
      if (response.ok) {
        showAlert('success', data.message || 'Event published successfully!');
      } else {
        showAlert('error', data.error || 'Failed to publish event');
      }
    } catch (error) {
      showAlert('error', 'Error publishing event: ' + error.message);
    }
  };

  const handleViewDetails = (eventId) => {
    navigate(`/events/${eventId}`);
  };

  const handleCreateParties = async (eventId) => {
    try {
      const response = await fetch(`/api/events/${eventId}/create-parties/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include'
      });

      const data = await response.json();
      
      if (response.ok) {
        showAlert('success', data.message || 'Parties created successfully!');
      } else {
        showAlert('error', data.error || 'Failed to create parties');
      }
    } catch (error) {
      showAlert('error', 'Error creating parties: ' + error.message);
    }
  };

  const handleCreateGuildParties = async (eventId) => {
    try {
      const response = await fetch(`/api/events/${eventId}/create-guild-parties/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include'
      });

      const data = await response.json();
      
      if (response.ok) {
        showAlert('success', data.message || 'Guild parties created successfully!');
      } else {
        showAlert('error', data.error || 'Failed to create guild parties');
      }
    } catch (error) {
      showAlert('error', 'Error creating guild parties: ' + error.message);
    }
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

      {/* Tabs */}
      <Box sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} sx={{ mb: 2 }}>
          <Tab 
            label={
              <Badge badgeContent={events.length} color="primary">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <EventIcon />
                  Events
                </Box>
              </Badge>
            } 
          />
          <Tab 
            label={
              <Badge badgeContent={templates.length} color="secondary">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TemplateIcon />
                  Templates
                </Box>
              </Badge>
            } 
          />
        </Tabs>

        {/* Date Filter - Only show for Events tab */}
        {activeTab === 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <span>📅</span>
              Filter Events
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {[
                { value: 'all', label: 'All Events', count: events.length },
                { value: 'upcoming', label: 'Upcoming', count: events.filter(event => new Date(event.event_datetime) > new Date()).length },
                { value: 'past', label: 'Past Events', count: events.filter(event => new Date(event.event_datetime) <= new Date()).length },
                { value: 'today', label: 'Today', count: events.filter(event => {
                  const eventDate = new Date(event.event_datetime);
                  const today = new Date();
                  const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
                  const eventDateOnly = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
                  return eventDateOnly.getTime() === todayOnly.getTime();
                }).length },
                { value: 'this_week', label: 'This Week', count: events.filter(event => {
                  const eventDate = new Date(event.event_datetime);
                  const today = new Date();
                  const nextWeek = new Date(today);
                  nextWeek.setDate(nextWeek.getDate() + 7);
                  return eventDate >= today && eventDate <= nextWeek;
                }).length }
              ].map((filter) => (
                <Chip
                  key={filter.value}
                  label={`${filter.label} (${filter.count})`}
                  onClick={() => setDateFilter(filter.value)}
                  color={dateFilter === filter.value ? 'primary' : 'default'}
                  variant={dateFilter === filter.value ? 'filled' : 'outlined'}
                  sx={{ 
                    cursor: 'pointer',
                    '&:hover': { 
                      backgroundColor: dateFilter === filter.value ? 'primary.dark' : 'action.hover' 
                    }
                  }}
                />
              ))}
            </Stack>
          </Box>
        )}
      </Box>

      {/* Content based on active tab */}
      {activeTab === 0 ? (
        // Events Tab
        filteredEvents.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <EventIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {events.length === 0 ? 'No Events Found' : 'No Events Match Filter'}
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              {events.length === 0 
                ? 'Create your first event to get started'
                : `No events found for "${dateFilter === 'all' ? 'All Events' : 
                    dateFilter === 'upcoming' ? 'Upcoming' :
                    dateFilter === 'past' ? 'Past Events' :
                    dateFilter === 'today' ? 'Today' :
                    dateFilter === 'this_week' ? 'This Week' : dateFilter}"`
              }
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
          {filteredEvents.map((event) => (
            <Grid item xs={12} sm={6} md={3} key={event.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" component="h2">
                      {event.title}
                    </Typography>
                    <Chip
                      label={event.event_type_display}
                      color={getEventTypeColor(event.event_type)}
                      size="small"
                    />
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Stack spacing={1}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ScheduleIcon fontSize="small" color="action" />
                        <Box>
                          <Typography variant="body2">
                            {formatDateTime(event.event_datetime).date}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {formatDateTime(event.event_datetime).time}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PeopleIcon fontSize="small" color="action" />
                        <Typography variant="body2">
                          {event.participant_count} participants
                          {event.max_participants && ` / ${event.max_participants} max`}
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Chip
                      label={isEventUpcoming(event.event_datetime) ? 'Upcoming' : 'Past'}
                      color={isEventUpcoming(event.event_datetime) ? 'success' : 'default'}
                      size="small"
                    />
                  </Box>

                  {/* Event action buttons */}
                  <Box sx={{ 
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: 1,
                    '& .MuiButton-root': {
                      minWidth: 'auto',
                      fontSize: '0.75rem',
                      px: 1,
                      py: 0.5
                    }
                  }}>
                    <Button
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={() => handleEditEvent(event)}
                      color="primary"
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDeleteEvent(event.id)}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<span>📢</span>}
                      onClick={() => handlePublishEvent(event.id)}
                    >
                      Publish
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<span>📊</span>}
                      onClick={() => handleViewDetails(event.id)}
                    >
                      Details
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        )
      ) : (
        // Templates Tab
        templates.length === 0 ? (
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <TemplateIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No Templates Found
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 2 }}>
                Create templates to reuse event configurations for future events
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleCreateTemplate}
                sx={{ bgcolor: '#4a9eff', '&:hover': { bgcolor: '#357abd' } }}
              >
                Create Template
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Create Template Button for Templates Tab */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleCreateTemplate}
                sx={{ bgcolor: '#4a9eff', '&:hover': { bgcolor: '#357abd' } }}
              >
                Create Template
              </Button>
            </Box>
            
            <Grid container spacing={3}>
              {templates.map((template) => (
              <Grid item xs={12} sm={6} md={3} key={template.id}>
                <Card sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  aspectRatio: '1/1'
                }}>
                  <CardContent sx={{ 
                    flexGrow: 1, 
                    display: 'flex', 
                    flexDirection: 'column',
                    p: 2
                  }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Typography variant="h6" component="h2" sx={{ 
                        fontWeight: 'bold',
                        fontSize: '1rem',
                        lineHeight: 1.2
                      }}>
                        {template.name}
                      </Typography>
                      <Chip
                        label={template.event_type ? eventTypes.find(t => t.value === template.event_type)?.label || template.event_type : 'Other'}
                        color={getEventTypeColor(template.event_type)}
                        size="small"
                        sx={{ fontSize: '0.7rem', height: 20 }}
                      />
                    </Box>

                    {template.description && (
                      <Typography color="text.secondary" sx={{ 
                        mb: 1,
                        fontSize: '0.8rem',
                        lineHeight: 1.2,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                      }}>
                        {template.description}
                      </Typography>
                    )}

                    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <Stack spacing={0.5} sx={{ mb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <PeopleIcon fontSize="small" color="action" sx={{ fontSize: '0.9rem' }} />
                          <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                            Party Size: {template.max_participants || 'Default'}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <span style={{ fontSize: '0.9rem' }}>💰</span>
                          <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                            {template.points_per_participant} points
                          </Typography>
                        </Box>
                      </Stack>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Chip
                          label="Template"
                          color="secondary"
                          size="small"
                          sx={{ fontSize: '0.7rem', height: 20 }}
                        />
                      </Box>
                    </Box>
                  </CardContent>

                  <Box sx={{ p: 1.5, pt: 0 }}>
                    <Box sx={{ 
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: 0.5,
                      '& .MuiButton-root': {
                        minWidth: 'auto',
                        fontSize: '0.7rem',
                        px: 0.5,
                        py: 0.3,
                        height: 'auto',
                        minHeight: 28
                      }
                    }}>
                      <Button
                        size="small"
                        startIcon={<AddIcon />}
                        onClick={() => handleCreateFromTemplate(template)}
                        sx={{ 
                          bgcolor: '#4a9eff', 
                          color: 'white',
                          '&:hover': { bgcolor: '#357abd' }
                        }}
                      >
                        Create Event
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDeleteTemplate(template.id)}
                        sx={{ 
                          bgcolor: '#ff4757', 
                          color: 'white',
                          '&:hover': { bgcolor: '#ff3742' }
                        }}
                      >
                        Delete
                      </Button>
                    </Box>
                  </Box>
                </Card>
              </Grid>
              ))}
            </Grid>
          </>
        )
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
            
            
            <TextField
              fullWidth
              label="Max Participants Per Party"
              type="number"
              value={formData.max_participants}
              onChange={(e) => setFormData({ ...formData, max_participants: e.target.value })}
              helperText="Maximum number of participants per party (default: 15)"
              inputProps={{ min: 1 }}
            />
            
            <TextField
              fullWidth
              label="CryptoTommys Points Per Participant"
              type="number"
              value={formData.points_per_participant}
              onChange={(e) => setFormData({ ...formData, points_per_participant: e.target.value })}
              helperText="Number of CryptoTommys points each participant will receive"
              inputProps={{ min: 0 }}
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
            
            
            <TextField
              fullWidth
              label="Max Participants Per Party"
              type="number"
              value={formData.max_participants}
              onChange={(e) => setFormData({ ...formData, max_participants: e.target.value })}
              helperText="Maximum number of participants per party (default: 15)"
              inputProps={{ min: 1 }}
            />
            
            <TextField
              fullWidth
              label="CryptoTommys Points Per Participant"
              type="number"
              value={formData.points_per_participant}
              onChange={(e) => setFormData({ ...formData, points_per_participant: e.target.value })}
              helperText="Number of CryptoTommys points each participant will receive"
              inputProps={{ min: 0 }}
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


      {/* Create Template Modal */}
      <Dialog open={createTemplateModalOpen} onClose={() => setCreateTemplateModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create Template</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Template Name"
              value={templateFormData.name}
              onChange={(e) => setTemplateFormData({ ...templateFormData, name: e.target.value })}
              required
            />
            
            <TextField
              fullWidth
              label="Template Description"
              multiline
              rows={3}
              value={templateFormData.description}
              onChange={(e) => setTemplateFormData({ ...templateFormData, description: e.target.value })}
            />

            <FormControl fullWidth>
              <InputLabel>Event Type</InputLabel>
              <Select
                value={templateFormData.event_type}
                onChange={(e) => setTemplateFormData({ ...templateFormData, event_type: e.target.value })}
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
              label="Max Members Per Party"
              type="number"
              value={templateFormData.max_participants}
              onChange={(e) => setTemplateFormData({ ...templateFormData, max_participants: e.target.value })}
              helperText="Maximum number of members per party (default: 15)"
              inputProps={{ min: 1 }}
            />
            
            <Alert severity="info">
              This will create a reusable template with the specified configuration.
            </Alert>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateTemplateModalOpen(false)} startIcon={<CancelIcon />}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmitCreateTemplate}
            variant="contained"
            startIcon={<SaveTemplateIcon />}
            disabled={!templateFormData.name}
            sx={{ bgcolor: '#6f42c1', '&:hover': { bgcolor: '#5a32a3' } }}
          >
            Create Template
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
