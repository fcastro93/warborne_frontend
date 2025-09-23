import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  Tabs,
  Tab,
  Stack,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Alert,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction
} from '@mui/material';
import {
  Schedule as ScheduleIcon,
  People as PeopleIcon,
  LocationOn as LocationIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Publish as PublishIcon,
  Cancel as CancelIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import Layout from './Layout';

const EventDetails = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  
  const eventTypes = [
    { value: 'guild_war', label: 'Guild War' },
    { value: 'pvp_fight', label: 'PvP Fight' },
    { value: 'resource_farming', label: 'Resource Farming' },
    { value: 'boss_raid', label: 'Boss Raid' },
    { value: 'social_event', label: 'Social Event' },
    { value: 'training', label: 'Training' },
    { value: 'other', label: 'Other' }
  ];
  
  const [event, setEvent] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [parties, setParties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [alert, setAlert] = useState(null);
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const [removeParticipantModalOpen, setRemoveParticipantModalOpen] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_type: 'other',
    event_datetime: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    max_participants: ''
  });
  
  // Party configuration state
  const [partyConfig, setPartyConfig] = useState({
    roleComposition: {
      healer: 2,
      ranged_dps: 0,
      melee_dps: 0,
      defensive_tank: 2,
      offensive_tank: 2,
      offensive_support: 0,
      defensive_support: 0
    },
    guildSplit: false
  });

  useEffect(() => {
    fetchEventDetails();
  }, [eventId]);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      
      // Fetch event details
      const eventResponse = await fetch(`/api/events/${eventId}/`);
      const eventData = await eventResponse.json();
      setEvent(eventData);
      
      // Fetch participants
      const participantsResponse = await fetch(`/api/events/${eventId}/participants/`);
      const participantsData = await participantsResponse.json();
      setParticipants(participantsData.participants || []);
      
      // Fetch parties
      const partiesResponse = await fetch(`/api/events/${eventId}/parties/`);
      const partiesData = await partiesResponse.json();
      setParties(partiesData.parties || []);
      
      // Fetch party configuration
      const configResponse = await fetch(`/api/events/${eventId}/party-configuration/`);
      const configData = await configResponse.json();
      if (configData.configuration) {
        setPartyConfig(configData.configuration);
      }
      
    } catch (error) {
      showAlert('error', 'Error loading event details: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  };

  const formatDateTime = (dateTimeString) => {
    const cleanDateTime = dateTimeString.replace(/\+00:00Z$/, 'Z');
    const date = new Date(cleanDateTime);
    if (isNaN(date.getTime())) {
      return { date: 'Invalid Date', time: '' };
    }
    
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

  const handleCreateParties = async () => {
    try {
      const response = await fetch(`/api/events/${eventId}/create-parties/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify(partyConfig)
      });

      const data = await response.json();
      
      if (response.ok) {
        showAlert('success', data.message || 'Parties created successfully!');
        fetchEventDetails(); // Refresh data
      } else {
        showAlert('error', data.error || 'Failed to create parties');
      }
    } catch (error) {
      showAlert('error', 'Error creating parties: ' + error.message);
    }
  };

  const handleFillParties = async () => {
    try {
      const response = await fetch(`/api/events/${eventId}/fill-parties/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify(partyConfig)
      });

      const data = await response.json();
      
      if (response.ok) {
        showAlert('success', data.message || 'Parties filled successfully!');
        fetchEventDetails(); // Refresh data
      } else {
        showAlert('error', data.error || 'Failed to fill parties');
      }
    } catch (error) {
      showAlert('error', 'Error filling parties: ' + error.message);
    }
  };

  const handlePublishEvent = async () => {
    try {
      const response = await fetch(`/api/events/${eventId}/publish/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCookie('csrftoken')
        }
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

  const handleCancelEvent = async () => {
    if (window.confirm('Are you sure you want to cancel this event?')) {
      try {
        const response = await fetch(`/api/events/${eventId}/delete/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
          }
        });

        const data = await response.json();
        
        if (response.ok) {
          showAlert('success', 'Event cancelled successfully!');
          navigate('/events');
        } else {
          showAlert('error', data.error || 'Failed to cancel event');
        }
      } catch (error) {
        showAlert('error', 'Error cancelling event: ' + error.message);
      }
    }
  };

  const handleEditEvent = () => {
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

  const handleRemoveParticipant = async () => {
    if (!selectedParticipant) return;
    
    try {
      const response = await fetch(`/api/events/${eventId}/remove-participant/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({ participant_id: selectedParticipant.id })
      });

      const data = await response.json();
      
      if (response.ok) {
        showAlert('success', 'Participant removed successfully!');
        setRemoveParticipantModalOpen(false);
        setSelectedParticipant(null);
        fetchEventDetails(); // Refresh data
      } else {
        showAlert('error', data.error || 'Failed to remove participant');
      }
    } catch (error) {
      showAlert('error', 'Error removing participant: ' + error.message);
    }
  };

  const handleSavePartyConfiguration = async () => {
    try {
      const response = await fetch(`/api/events/${eventId}/save-party-configuration/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify(partyConfig)
      });

      const data = await response.json();
      
      if (response.ok) {
        showAlert('success', 'Party configuration saved successfully!');
        setConfigModalOpen(false);
      } else {
        showAlert('error', data.error || 'Failed to save party configuration');
      }
    } catch (error) {
      showAlert('error', 'Error saving party configuration: ' + error.message);
    }
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmitEvent = async () => {
    try {
      const response = await fetch(`/api/events/${eventId}/update/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (response.ok) {
        showAlert('success', 'Event updated successfully!');
        setEditModalOpen(false);
        fetchEventDetails(); // Refresh data
      } else {
        showAlert('error', data.error || 'Failed to update event');
      }
    } catch (error) {
      showAlert('error', 'Error updating event: ' + error.message);
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

  const getRoleDisplayName = (role) => {
    const roleNames = {
      healer: 'Healer',
      ranged_dps: 'Ranged DPS',
      melee_dps: 'Melee DPS',
      defensive_tank: 'Defensive Tank',
      offensive_tank: 'Offensive Tank',
      offensive_support: 'Offensive Support',
      defensive_support: 'Defensive Support'
    };
    return roleNames[role] || role;
  };

  if (loading) {
    return (
      <Layout>
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography>Loading event details...</Typography>
        </Box>
      </Layout>
    );
  }

  if (!event) {
    return (
      <Layout>
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography>Event not found</Typography>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box sx={{ p: 3 }}>
        {/* Alert */}
        {alert && (
          <Alert severity={alert.type} sx={{ mb: 2 }} onClose={() => setAlert(null)}>
            {alert.message}
          </Alert>
        )}

        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h4" component="h1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {event.title}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {event.description}
            </Typography>
          </Box>
          <Chip
            label={event.event_type_display}
            color={getEventTypeColor(event.event_type)}
            size="large"
          />
        </Box>

        {/* Top Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateParties}
            sx={{ bgcolor: '#4a9eff', '&:hover': { bgcolor: '#357abd' } }}
          >
            Create Parties
          </Button>
          <Button
            variant="outlined"
            startIcon={<SettingsIcon />}
            onClick={handleFillParties}
            sx={{ borderColor: '#9c27b0', color: '#9c27b0', '&:hover': { borderColor: '#7b1fa2', bgcolor: 'rgba(156, 39, 176, 0.1)' } }}
          >
            Fill Parties
          </Button>
          <Button
            variant="outlined"
            startIcon={<PublishIcon />}
            onClick={handlePublishEvent}
            sx={{ borderColor: '#ff6b35', color: '#ff6b35', '&:hover': { borderColor: '#e55a2b', bgcolor: 'rgba(255, 107, 53, 0.1)' } }}
          >
            Publish Event
          </Button>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={handleEditEvent}
            sx={{ borderColor: '#4a9eff', color: '#4a9eff', '&:hover': { borderColor: '#357abd', bgcolor: 'rgba(74, 158, 255, 0.1)' } }}
          >
            Edit Event
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<CancelIcon />}
            onClick={handleCancelEvent}
          >
            Cancel Event
          </Button>
        </Box>

        {/* Event Info Card */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                    <ScheduleIcon fontSize="small" color="action" sx={{ mt: 0.5 }} />
                    <Box>
                      <Typography variant="body2" sx={{ lineHeight: 1.2 }}>
                        {formatDateTime(event.event_datetime).date}
                      </Typography>
                      <Typography variant="body2" sx={{ lineHeight: 1.2, color: 'text.secondary' }}>
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
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationIcon fontSize="small" color="action" />
                    <Typography variant="body2">
                      {event.timezone}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Created by: {event.created_by_discord_name}
                    </Typography>
                  </Box>
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Paper sx={{ width: '100%' }}>
          <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
            <Tab label="Participants" />
            <Tab label="Parties" />
          </Tabs>
          
          <Box sx={{ p: 3 }}>
            {/* Participants Tab */}
            {activeTab === 0 && (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">Event Participants</Typography>
                  <Button
                    variant="outlined"
                    startIcon={<SettingsIcon />}
                    onClick={() => setConfigModalOpen(true)}
                    size="small"
                  >
                    Configure Parties
                  </Button>
                </Box>
                
                {participants.length === 0 ? (
                  <Typography color="text.secondary">No participants yet</Typography>
                ) : (
                  <List>
                    {participants.map((participant) => (
                      <ListItem key={participant.id} divider>
                        <ListItemAvatar>
                          <Avatar>
                            {participant.player?.discord_name?.charAt(0) || '?'}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={participant.player?.discord_name || 'Unknown Player'}
                          secondary={
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                Role: {getRoleDisplayName(participant.player?.game_role || 'unknown')}
                              </Typography>
                              {participant.player?.guild && (
                                <Typography variant="body2" color="text.secondary">
                                  Guild: {participant.player.guild.name}
                                </Typography>
                              )}
                            </Box>
                          }
                        />
                        <ListItemSecondaryAction>
                          <IconButton
                            edge="end"
                            color="error"
                            onClick={() => {
                              setSelectedParticipant(participant);
                              setRemoveParticipantModalOpen(true);
                            }}
                          >
                            <RemoveIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                )}
              </Box>
            )}
            
            {/* Parties Tab */}
            {activeTab === 1 && (
              <Box>
                <Typography variant="h6" sx={{ mb: 2 }}>Event Parties</Typography>
                
                {parties.length === 0 ? (
                  <Typography color="text.secondary">No parties created yet</Typography>
                ) : (
                  <Grid container spacing={2}>
                    {parties.map((party) => (
                      <Grid item xs={12} md={6} lg={4} key={party.id}>
                        <Card>
                          <CardContent>
                            <Typography variant="h6" gutterBottom>
                              Party {party.party_number}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                              {party.member_count} / {party.max_members} members
                            </Typography>
                            
                            {party.members && party.members.length > 0 ? (
                              <List dense>
                                {party.members.map((member) => (
                                  <ListItem key={member.id} sx={{ px: 0 }}>
                                    <ListItemAvatar>
                                      <Avatar sx={{ width: 32, height: 32 }}>
                                        {member.player?.discord_name?.charAt(0) || '?'}
                                      </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                      primary={
                                        <Typography variant="body2">
                                          {member.player?.discord_name || 'Unknown'}
                                        </Typography>
                                      }
                                      secondary={
                                        <Typography variant="caption" color="text.secondary">
                                          {getRoleDisplayName(member.assigned_role || 'unknown')}
                                        </Typography>
                                      }
                                    />
                                  </ListItem>
                                ))}
                              </List>
                            ) : (
                              <Typography variant="body2" color="text.secondary">
                                No members assigned
                              </Typography>
                            )}
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </Box>
            )}
          </Box>
        </Paper>

        {/* Party Configuration Modal */}
        <Dialog open={configModalOpen} onClose={() => setConfigModalOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>Configure Party Settings</DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 1 }}>
              {/* Role Composition */}
              <Box>
                <Typography variant="h6" gutterBottom>Party Composition</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Set the number of each role per party. Set to 0 to use as fillers.
                </Typography>
                <Grid container spacing={2}>
                  {Object.entries(partyConfig.roleComposition).map(([role, count]) => (
                    <Grid item xs={6} sm={4} md={3} key={role}>
                      <TextField
                        fullWidth
                        label={getRoleDisplayName(role)}
                        type="number"
                        value={count}
                        onChange={(e) => setPartyConfig({
                          ...partyConfig,
                          roleComposition: {
                            ...partyConfig.roleComposition,
                            [role]: parseInt(e.target.value) || 0
                          }
                        })}
                        inputProps={{ min: 0 }}
                        size="small"
                      />
                    </Grid>
                  ))}
                </Grid>
              </Box>
              
              <Divider />
              
              {/* Guild Split */}
              <Box>
                <Typography variant="h6" gutterBottom>Guild Split</Typography>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={partyConfig.guildSplit}
                      onChange={(e) => setPartyConfig({
                        ...partyConfig,
                        guildSplit: e.target.checked
                      })}
                    />
                  }
                  label="Create separate parties for each guild"
                />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  When enabled, participants will be grouped by guild first, then balanced within each guild.
                  When disabled, all participants will be mixed together regardless of guild.
                </Typography>
              </Box>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfigModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSavePartyConfiguration} variant="contained">Save Configuration</Button>
          </DialogActions>
        </Dialog>

        {/* Edit Event Modal */}
        <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Edit Event</DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ pt: 2 }}>
              <TextField
                label="Event Title"
                value={formData.title}
                onChange={(e) => handleFormChange('title', e.target.value)}
                fullWidth
                required
              />
              
              <TextField
                label="Description"
                value={formData.description}
                onChange={(e) => handleFormChange('description', e.target.value)}
                fullWidth
                multiline
                rows={3}
              />
              
              <FormControl fullWidth>
                <InputLabel>Event Type</InputLabel>
                <Select
                  value={formData.event_type}
                  onChange={(e) => handleFormChange('event_type', e.target.value)}
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
                label="Event Date & Time"
                type="datetime-local"
                value={formData.event_datetime}
                onChange={(e) => handleFormChange('event_datetime', e.target.value)}
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
              />
              
              <TextField
                label="Max Participants"
                type="number"
                value={formData.max_participants}
                onChange={(e) => handleFormChange('max_participants', e.target.value)}
                fullWidth
                inputProps={{ min: 1 }}
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmitEvent} variant="contained">Update Event</Button>
          </DialogActions>
        </Dialog>

        {/* Remove Participant Modal */}
        <Dialog open={removeParticipantModalOpen} onClose={() => setRemoveParticipantModalOpen(false)}>
          <DialogTitle>Remove Participant</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to remove {selectedParticipant?.player?.discord_name} from this event?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setRemoveParticipantModalOpen(false)}>Cancel</Button>
            <Button onClick={handleRemoveParticipant} color="error" variant="contained">
              Remove
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Layout>
  );
};

export default EventDetails;
