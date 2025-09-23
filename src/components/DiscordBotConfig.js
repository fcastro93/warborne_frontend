import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Alert,
  Stack,
  Chip,
  Divider,
  Paper,
  IconButton,
  Tooltip,
  CircularProgress
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Power as PowerIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  PlayArrow as PlayArrowIcon,
  Stop as StopIcon
} from '@mui/icons-material';
import Layout from './Layout';

const DiscordBotConfig = () => {
  const navigate = useNavigate();
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    is_active: false,
    command_prefix: '/',
    base_url: '',
    general_channel_id: '',
    event_announcements_channel_id: '',
    violence_bot_channel_id: '',
    can_manage_messages: true,
    can_embed_links: true,
    can_attach_files: true,
    can_read_message_history: true,
    can_use_external_emojis: true
  });

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/discord-bot-config/');
      const data = await response.json();
      
      if (response.ok) {
        setConfig(data);
        setFormData({
          name: data.name || '',
          is_active: data.is_active || false,
          command_prefix: data.command_prefix || '/',
          base_url: data.base_url || '',
          general_channel_id: data.general_channel_id || '',
          event_announcements_channel_id: data.event_announcements_channel_id || '',
          violence_bot_channel_id: data.violence_bot_channel_id || '',
          can_manage_messages: data.can_manage_messages || true,
          can_embed_links: data.can_embed_links || true,
          can_attach_files: data.can_attach_files || true,
          can_read_message_history: data.can_read_message_history || true,
          can_use_external_emojis: data.can_use_external_emojis || true
        });
      } else {
        showAlert('error', 'Failed to load bot configuration: ' + data.error);
      }
    } catch (error) {
      showAlert('error', 'Error loading bot configuration: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await fetch('/api/discord-bot-config/update/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (response.ok) {
        showAlert('success', 'Bot configuration saved successfully!');
        fetchConfig(); // Refresh data
      } else {
        showAlert('error', 'Failed to save configuration: ' + data.error);
      }
    } catch (error) {
      showAlert('error', 'Error saving configuration: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleTestConnection = async () => {
    try {
      const response = await fetch('/api/discord-bot-config/test/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCookie('csrftoken')
        }
      });

      const data = await response.json();
      
      if (response.ok) {
        showAlert('success', 'Bot connection test successful!');
        fetchConfig(); // Refresh status
      } else {
        showAlert('error', 'Bot connection test failed: ' + data.error);
      }
    } catch (error) {
      showAlert('error', 'Error testing bot connection: ' + error.message);
    }
  };

  const handleStartBot = async () => {
    try {
      setSaving(true);
      const response = await fetch('/api/discord-bot-config/start/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCookie('csrftoken')
        }
      });

      const data = await response.json();
      
      if (response.ok) {
        showAlert('success', 'Bot start command sent successfully!');
        fetchConfig(); // Refresh status
      } else {
        showAlert('error', 'Failed to start bot: ' + data.error);
      }
    } catch (error) {
      showAlert('error', 'Error starting bot: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleStopBot = async () => {
    try {
      setSaving(true);
      const response = await fetch('/api/discord-bot-config/stop/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCookie('csrftoken')
        }
      });

      const data = await response.json();
      
      if (response.ok) {
        showAlert('success', 'Bot stop command sent successfully!');
        fetchConfig(); // Refresh status
      } else {
        showAlert('error', 'Failed to stop bot: ' + data.error);
      }
    } catch (error) {
      showAlert('error', 'Error stopping bot: ' + error.message);
    } finally {
      setSaving(false);
    }
  };


  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
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

  const getStatusIcon = () => {
    if (!config) return <ErrorIcon color="error" />;
    
    if (config.is_online) {
      return <CheckCircleIcon color="success" />;
    } else if (config.is_active) {
      return <WarningIcon color="warning" />;
    } else {
      return <ErrorIcon color="error" />;
    }
  };

  const getStatusText = () => {
    if (!config) return 'Unknown';
    
    if (config.is_online) {
      return '🟢 Online';
    } else if (config.is_active) {
      return '🟡 Active (Offline)';
    } else {
      return '🔴 Inactive';
    }
  };

  const getStatusColor = () => {
    if (!config) return 'error';
    
    if (config.is_online) {
      return 'success';
    } else if (config.is_active) {
      return 'warning';
    } else {
      return 'error';
    }
  };

  if (loading) {
    return (
      <Layout>
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <CircularProgress />
          <Typography sx={{ mt: 2 }}>Loading bot configuration...</Typography>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
            Discord Bot Configuration
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={fetchConfig}
              disabled={loading}
            >
              Refresh
            </Button>
            <Button
              variant="outlined"
              startIcon={<PlayArrowIcon />}
              onClick={handleStartBot}
              disabled={saving || (config && config.is_online)}
              color="success"
            >
              Start Bot
            </Button>
            <Button
              variant="outlined"
              startIcon={<StopIcon />}
              onClick={handleStopBot}
              disabled={saving || (config && !config.is_online)}
              color="error"
            >
              Stop Bot
            </Button>
            <Button
              variant="contained"
              startIcon={<PowerIcon />}
              onClick={handleTestConnection}
              disabled={saving}
            >
              Test Connection
            </Button>
          </Stack>
        </Stack>

        {/* Alert */}
        {alert && (
          <Alert 
            severity={alert.type} 
            onClose={() => setAlert(null)}
            sx={{ mb: 3 }}
          >
            {alert.message}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Bot Status */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                  {getStatusIcon()}
                  <Typography variant="h6">Bot Status</Typography>
                </Stack>
                
                <Chip 
                  label={getStatusText()} 
                  color={getStatusColor()}
                  sx={{ mb: 2 }}
                />
                
                {config && (
                  <Stack spacing={1}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Bot Name:</strong> {config.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Active:</strong> {config.is_active ? 'Yes' : 'No'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Last Heartbeat:</strong> {config.last_heartbeat ? new Date(config.last_heartbeat).toLocaleString() : 'Never'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Command Prefix:</strong> {config.command_prefix}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Base URL:</strong> {config.base_url}
                    </Typography>
                    {config.error_message && (
                      <Typography variant="body2" color="error">
                        <strong>Last Error:</strong> {config.error_message}
                      </Typography>
                    )}
                  </Stack>
                )}
              </CardContent>
            </Card>
          </Grid>


          {/* Basic Settings */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3 }}>
                  <SettingsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Basic Settings
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Bot Name"
                      value={formData.name}
                      onChange={(e) => handleFormChange('name', e.target.value)}
                      fullWidth
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Command Prefix"
                      value={formData.command_prefix}
                      onChange={(e) => handleFormChange('command_prefix', e.target.value)}
                      fullWidth
                      helperText="Prefix for bot commands (e.g., !, /, .)"
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      label="Base URL"
                      value={formData.base_url}
                      onChange={(e) => handleFormChange('base_url', e.target.value)}
                      fullWidth
                      helperText="Base URL for the application"
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formData.is_active}
                          onChange={(e) => handleFormChange('is_active', e.target.checked)}
                        />
                      }
                      label="Bot Active"
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Channel Configuration */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3 }}>
                  <InfoIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Channel Configuration
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <TextField
                      label="General Channel ID"
                      value={formData.general_channel_id}
                      onChange={(e) => handleFormChange('general_channel_id', e.target.value)}
                      fullWidth
                      type="number"
                      helperText="Channel for general bot announcements"
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <TextField
                      label="Event Announcements Channel ID"
                      value={formData.event_announcements_channel_id}
                      onChange={(e) => handleFormChange('event_announcements_channel_id', e.target.value)}
                      fullWidth
                      type="number"
                      helperText="Channel where event announcements are posted"
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <TextField
                      label="Violence Bot Channel ID"
                      value={formData.violence_bot_channel_id}
                      onChange={(e) => handleFormChange('violence_bot_channel_id', e.target.value)}
                      fullWidth
                      type="number"
                      helperText="Channel where events are created"
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Bot Permissions */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3 }}>
                  Bot Permissions
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formData.can_manage_messages}
                          onChange={(e) => handleFormChange('can_manage_messages', e.target.checked)}
                        />
                      }
                      label="Manage Messages"
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={4}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formData.can_embed_links}
                          onChange={(e) => handleFormChange('can_embed_links', e.target.checked)}
                        />
                      }
                      label="Embed Links"
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={4}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formData.can_attach_files}
                          onChange={(e) => handleFormChange('can_attach_files', e.target.checked)}
                        />
                      }
                      label="Attach Files"
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={4}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formData.can_read_message_history}
                          onChange={(e) => handleFormChange('can_read_message_history', e.target.checked)}
                        />
                      }
                      label="Read Message History"
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={4}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formData.can_use_external_emojis}
                          onChange={(e) => handleFormChange('can_use_external_emojis', e.target.checked)}
                        />
                      }
                      label="Use External Emojis"
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Save Button */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleSave}
                disabled={saving}
                startIcon={saving ? <CircularProgress size={20} /> : <SettingsIcon />}
              >
                {saving ? 'Saving...' : 'Save Configuration'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
};

export default DiscordBotConfig;
