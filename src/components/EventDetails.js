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
  ListItemSecondaryAction,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
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
  Settings as SettingsIcon,
  Shield as ShieldIcon,
  LocalHospital as HealerIcon,
  SportsEsports as DPSIcon,
  Security as TankIcon,
  Support as SupportIcon,
  EmojiEvents as CrownIcon,
  CardGiftcard as RewardsIcon
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
  const [showCreatePartyDialog, setShowCreatePartyDialog] = useState(false);
  const [addMemberDialogOpen, setAddMemberDialogOpen] = useState(false);
  const [selectedPartyId, setSelectedPartyId] = useState(null);
  const [showAddParticipantDialog, setShowAddParticipantDialog] = useState(false);
  const [guildMembers, setGuildMembers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [showEditPartyDialog, setShowEditPartyDialog] = useState(false);
  const [selectedPartyForEdit, setSelectedPartyForEdit] = useState(null);
  const [showGuildConflictDialog, setShowGuildConflictDialog] = useState(false);
  const [guildConflictData, setGuildConflictData] = useState(null);
  const [showRewardsModal, setShowRewardsModal] = useState(false);
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

  useEffect(() => {
    if (showAddParticipantDialog) {
      fetchGuildMembers();
      setSelectedMembers([]); // Reset selection when opening modal
    }
  }, [showAddParticipantDialog]);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      
      // Fetch event details
      const eventResponse = await fetch(`/api/events/${eventId}/`, {
        headers: getAuthHeaders(),
        credentials: 'include'
      });
      const eventData = await eventResponse.json();
      setEvent(eventData);
      
      // Fetch participants
      const participantsResponse = await fetch(`/api/events/${eventId}/participants/`, {
        headers: getAuthHeaders(),
        credentials: 'include'
      });
      const participantsData = await participantsResponse.json();
      setParticipants(participantsData.participants || []);
      
      // Fetch parties
      const partiesResponse = await fetch(`/api/events/${eventId}/parties/`, {
        headers: getAuthHeaders(),
        credentials: 'include'
      });
      const partiesData = await partiesResponse.json();
      setParties(partiesData.parties || []);
      
      // Fetch party configuration
      const configResponse = await fetch(`/api/events/${eventId}/party-configuration/`, {
        headers: getAuthHeaders(),
        credentials: 'include'
      });
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
        headers: getAuthHeaders(),
        credentials: 'include',
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
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify(partyConfig)
      });

      const data = await response.json();
      
      if (response.ok) {
        setAlert({ type: 'success', message: data.message || 'Parties filled successfully!' });
        await fetchEventDetails(); // Refresh data
      } else {
        // Check for guild split conflict
        if (data.error === 'guild_split_conflict') {
          setGuildConflictData(data);
          setShowGuildConflictDialog(true);
        } else {
          setAlert({ type: 'error', message: data.error || 'Failed to fill parties' });
        }
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Error filling parties: ' + error.message });
    }
  };

  const handlePublishEvent = async () => {
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

  const handleCancelEvent = async () => {
    if (window.confirm('Are you sure you want to cancel this event?')) {
      try {
        const response = await fetch(`/api/events/${eventId}/delete/`, {
          method: 'DELETE',
          headers: getAuthHeaders(),
          credentials: 'include'
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
        headers: getAuthHeaders(),
        credentials: 'include',
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
        headers: getAuthHeaders(),
        credentials: 'include',
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
        headers: getAuthHeaders(),
        credentials: 'include',
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

  const getPartyLeader = (party) => {
    if (!party.members || party.members.length === 0) return null;
    // First member is typically the leader (based on creation order)
    return party.members.find(member => member.is_leader) || party.members[0];
  };

  const getRoleIcon = (role) => {
    const roleIcons = {
      healer: <HealerIcon />,
      ranged_dps: <DPSIcon />,
      melee_dps: <DPSIcon />,
      defensive_tank: <ShieldIcon />,
      offensive_tank: <TankIcon />,
      offensive_support: <SupportIcon />,
      defensive_support: <SupportIcon />
    };
    return roleIcons[role] || <PeopleIcon />;
  };

  const handleCreateParty = async (partyData) => {
    try {
      const response = await fetch(`/api/events/${eventId}/create-party/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify(partyData)
      });

      if (response.ok) {
        const data = await response.json();
        setAlert({ type: 'success', message: data.message });
        await fetchEventDetails(); // Refresh data
        setShowCreatePartyDialog(false);
      } else {
        const errorData = await response.json();
        setAlert({ type: 'error', message: errorData.error || 'Failed to create party' });
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Error creating party: ' + error.message });
    }
  };

  const handleAddMemberToParty = (partyId) => {
    setSelectedPartyId(partyId);
    setAddMemberDialogOpen(true);
  };

  const handleRemoveMemberFromParty = async (partyId, memberId) => {
    // Optimistic update - remove member from local state immediately
    setParties(prevParties => 
      prevParties.map(party => 
        party.id === partyId 
          ? {
              ...party,
              members: party.members.filter(member => member.id !== memberId),
              member_count: party.member_count - 1
            }
          : party
      )
    );

    try {
      const response = await fetch(`/api/events/${eventId}/parties/${partyId}/remove-member/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify({ member_id: memberId })
      });

      if (response.ok) {
        const data = await response.json();
        setAlert({ type: 'success', message: data.message });
        // No need to refresh - optimistic update already handled it
      } else {
        // Revert optimistic update on error
        await fetchEventDetails();
        const errorData = await response.json();
        setAlert({ type: 'error', message: errorData.error || 'Failed to remove member' });
      }
    } catch (error) {
      // Revert optimistic update on error
      await fetchEventDetails();
      setAlert({ type: 'error', message: 'Error removing member: ' + error.message });
    }
  };

  const handleMakeLeader = async (partyId, memberId) => {
    try {
      const response = await fetch(`/api/events/${eventId}/parties/${partyId}/make-leader/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify({ member_id: memberId })
      });

      if (response.ok) {
        const data = await response.json();
        setAlert({ type: 'success', message: data.message });
        await fetchEventDetails(); // Refresh to show updated leader
      } else {
        const errorData = await response.json();
        setAlert({ type: 'error', message: errorData.error || 'Failed to make leader' });
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Error making leader: ' + error.message });
    }
  };

  const handleAddMemberToPartySubmit = async (participantId) => {
    // Find the participant and party for optimistic update
    const participant = participants.find(p => p.id === participantId);
    const targetParty = parties.find(p => p.id === selectedPartyId);
    
    if (!participant || !targetParty) {
      setAlert({ type: 'error', message: 'Participant or party not found' });
      return;
    }

    // Optimistic update - add member to local state immediately
    const newMember = {
      id: `temp_${Date.now()}`, // Temporary ID for optimistic update
      player: participant.player,
      event_participant: participant,
      assigned_role: participant.player?.game_role || 'unknown'
    };

    setParties(prevParties => 
      prevParties.map(party => 
        party.id === selectedPartyId 
          ? {
              ...party,
              members: [...party.members, newMember],
              member_count: party.member_count + 1
            }
          : party
      )
    );

    try {
      const response = await fetch(`/api/events/${eventId}/parties/${selectedPartyId}/add-member/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify({ participant_id: participantId })
      });

      if (response.ok) {
        const data = await response.json();
        setAlert({ type: 'success', message: data.message });
        setAddMemberDialogOpen(false);
        // Refresh to get the real member data with proper ID
        await fetchEventDetails();
      } else {
        // Revert optimistic update on error
        await fetchEventDetails();
        const errorData = await response.json();
        setAlert({ type: 'error', message: errorData.error || 'Failed to add member' });
      }
    } catch (error) {
      // Revert optimistic update on error
      await fetchEventDetails();
      setAlert({ type: 'error', message: 'Error adding member: ' + error.message });
    }
  };

  const handleAddParticipant = async (participantData) => {
    try {
      const response = await fetch(`/api/events/${eventId}/join/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify(participantData)
      });

      if (response.ok) {
        const data = await response.json();
        setAlert({ type: 'success', message: data.message });
        await fetchEventDetails(); // Refresh data
        setShowAddParticipantDialog(false);
      } else {
        const errorData = await response.json();
        setAlert({ type: 'error', message: errorData.error || 'Failed to add participant' });
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Error adding participant: ' + error.message });
    }
  };

  const fetchGuildMembers = async () => {
    try {
      const response = await fetch('/api/members/', {
        headers: getAuthHeaders(),
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setGuildMembers(data.members || []);
      }
    } catch (error) {
      console.error('Error fetching guild members:', error);
    }
  };

  const handleSelectMember = (memberId) => {
    setSelectedMembers(prev => {
      if (prev.includes(memberId)) {
        return prev.filter(id => id !== memberId);
      } else {
        return [...prev, memberId];
      }
    });
  };

  const handleSelectAllMembers = () => {
    const availableMembers = guildMembers.filter(member => 
      !participants.some(p => p.player?.id === member.id)
    );
    
    if (selectedMembers.length === availableMembers.length) {
      setSelectedMembers([]);
    } else {
      setSelectedMembers(availableMembers.map(member => member.id));
    }
  };

  const handleAddSelectedParticipants = async () => {
    try {
      const selectedGuildMembers = guildMembers.filter(member => 
        selectedMembers.includes(member.id)
      );

      for (const member of selectedGuildMembers) {
        const participantData = {
          discord_name: member.discord_name || member.name,
          assigned_role: member.game_role
        };

        await fetch(`/api/events/${eventId}/join/`, {
          method: 'POST',
          headers: getAuthHeaders(),
          credentials: 'include',
          body: JSON.stringify(participantData)
        });
      }

      setAlert({ 
        type: 'success', 
        message: `Successfully added ${selectedGuildMembers.length} participants to the event` 
      });
      await fetchEventDetails(); // Refresh data
      setShowAddParticipantDialog(false);
      setSelectedMembers([]);
    } catch (error) {
      setAlert({ type: 'error', message: 'Error adding participants: ' + error.message });
    }
  };

  const handleDeleteParty = async (partyId) => {
    if (!window.confirm('Are you sure you want to delete this party? This action cannot be undone.')) {
      return;
    }

    // Optimistic update - remove party from local state immediately
    const deletedParty = parties.find(p => p.id === partyId);
    setParties(prevParties => prevParties.filter(party => party.id !== partyId));

    try {
      const response = await fetch(`/api/events/${eventId}/parties/${partyId}/delete/`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setAlert({ type: 'success', message: data.message });
        // No need to refresh - optimistic update already handled it
      } else {
        // Revert optimistic update on error
        setParties(prevParties => [...prevParties, deletedParty].sort((a, b) => a.party_number - b.party_number));
        const errorData = await response.json();
        setAlert({ type: 'error', message: errorData.error || 'Failed to delete party' });
      }
    } catch (error) {
      // Revert optimistic update on error
      setParties(prevParties => [...prevParties, deletedParty].sort((a, b) => a.party_number - b.party_number));
      setAlert({ type: 'error', message: 'Error deleting party: ' + error.message });
    }
  };

  const handleEditParty = (party) => {
    setSelectedPartyForEdit(party);
    setFormData({
      ...formData,
      party_name: party.party_name || '',
      max_members: party.max_members
    });
    setShowEditPartyDialog(true);
  };

  const handleUpdateParty = async () => {
    // Store original party data for potential revert
    const originalParty = parties.find(p => p.id === selectedPartyForEdit.id);
    
    // Optimistic update - update party in local state immediately
    setParties(prevParties => 
      prevParties.map(party => 
        party.id === selectedPartyForEdit.id 
          ? {
              ...party,
              party_name: formData.party_name,
              max_members: formData.max_members
            }
          : party
      )
    );

    try {
      const response = await fetch(`/api/events/${eventId}/parties/${selectedPartyForEdit.id}/update/`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify({
          party_name: formData.party_name,
          max_members: formData.max_members
        })
      });

      if (response.ok) {
        const data = await response.json();
        setAlert({ type: 'success', message: data.message });
        setShowEditPartyDialog(false);
        setSelectedPartyForEdit(null);
        // No need to refresh - optimistic update already handled it
      } else {
        // Revert optimistic update on error
        setParties(prevParties => 
          prevParties.map(party => 
            party.id === selectedPartyForEdit.id ? originalParty : party
          )
        );
        const errorData = await response.json();
        setAlert({ type: 'error', message: errorData.error || 'Failed to update party' });
      }
    } catch (error) {
      // Revert optimistic update on error
      setParties(prevParties => 
        prevParties.map(party => 
          party.id === selectedPartyForEdit.id ? originalParty : party
        )
      );
      setAlert({ type: 'error', message: 'Error updating party: ' + error.message });
    }
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
            startIcon={<RewardsIcon />}
            onClick={() => setShowRewardsModal(true)}
            sx={{ borderColor: '#9c27b0', color: '#9c27b0', '&:hover': { borderColor: '#7b1fa2', bgcolor: 'rgba(156, 39, 176, 0.1)' } }}
          >
            Give Rewards
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
                  <Typography variant="h6">Event Participants ({participants.length})</Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<AddIcon />}
                      onClick={() => setShowAddParticipantDialog(true)}
                    >
                      Add Participant
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<SettingsIcon />}
                      onClick={() => setConfigModalOpen(true)}
                      size="small"
                    >
                      Configure Parties
                    </Button>
                  </Box>
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
                          primary={participant.player?.in_game_name || 'Unknown Player'}
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
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">Event Parties ({parties.length})</Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={() => setShowCreatePartyDialog(true)}
                  >
                    Create Party
                  </Button>
                </Box>
                
                {parties.length === 0 ? (
                  <Typography color="text.secondary">No parties created yet</Typography>
                ) : (
                  <Grid container spacing={2}>
                    {parties.map((party) => (
                      <Grid item xs={12} md={6} lg={4} key={party.id}>
                        <Card>
                          <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                              <Typography variant="h6">
                                Party {party.party_number}
                                {party.party_name && ` - ${party.party_name}`}
                              </Typography>
                              <Box sx={{ display: 'flex', gap: 0.5 }}>
                                <IconButton 
                                  size="small" 
                                  onClick={() => handleEditParty(party)}
                                  title="Edit Party"
                                >
                                  <EditIcon />
                                </IconButton>
                                <IconButton 
                                  size="small" 
                                  onClick={() => handleDeleteParty(party.id)}
                                  title="Delete Party"
                                  color="error"
                                >
                                  <DeleteIcon />
                                </IconButton>
                                <IconButton 
                                  size="small" 
                                  onClick={() => handleAddMemberToParty(party.id)}
                                  disabled={party.member_count >= party.max_members}
                                  title="Add Member"
                                >
                                  <AddIcon />
                                </IconButton>
                              </Box>
                            </Box>
                            
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                              {party.member_count} / {party.max_members} members
                            </Typography>
                            
                            {/* Party Leader Display */}
                            {party.members && party.members.length > 0 && (
                              <Box sx={{ mb: 2, p: 1, bgcolor: 'rgba(76, 175, 80, 0.1)', borderRadius: 1, border: '1px solid rgba(76, 175, 80, 0.3)' }}>
                                <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                                  👑 Party Leader: {getPartyLeader(party)?.player?.in_game_name || 'Unknown'}
                                </Typography>
                              </Box>
                            )}
                            
                            {party.members && party.members.length > 0 ? (
                              <List dense>
                                {party.members.map((member) => (
                                  <ListItem key={member.id} sx={{ px: 0 }}>
                                    <ListItemAvatar>
                                      <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                                        {getRoleIcon(member.assigned_role || 'unknown')}
                                      </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                      primary={
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                          <Typography variant="body2">
                                            {member.player?.in_game_name || 'Unknown'}
                                          </Typography>
                                          {getPartyLeader(party)?.id === member.id && (
                                            <CrownIcon sx={{ fontSize: 16, color: 'gold' }} />
                                          )}
                                        </Box>
                                      }
                                      secondary={
                                        <Typography variant="caption" color="text.secondary">
                                          {getRoleDisplayName(member.assigned_role || 'unknown')}
                                        </Typography>
                                      }
                                    />
                                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                                      {getPartyLeader(party)?.id !== member.id && (
                                        <IconButton 
                                          size="small" 
                                          onClick={() => handleMakeLeader(party.id, member.id)}
                                          title="Make Leader"
                                          sx={{ color: 'gold' }}
                                        >
                                          <CrownIcon />
                                        </IconButton>
                                      )}
                                      <IconButton 
                                        size="small" 
                                        onClick={() => handleRemoveMemberFromParty(party.id, member.id)}
                                        title="Remove from Party"
                                      >
                                        <RemoveIcon />
                                      </IconButton>
                                    </Box>
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
              Are you sure you want to remove {selectedParticipant?.player?.in_game_name} from this event?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setRemoveParticipantModalOpen(false)}>Cancel</Button>
            <Button onClick={handleRemoveParticipant} color="error" variant="contained">
              Remove
            </Button>
          </DialogActions>
        </Dialog>

        {/* Create Party Modal */}
        <Dialog open={showCreatePartyDialog} onClose={() => setShowCreatePartyDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Create New Party</DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ pt: 2 }}>
              <TextField
                label="Party Name (Optional)"
                placeholder="e.g., Tommy's Party, Lytsu's Party"
                fullWidth
                onChange={(e) => setFormData({...formData, party_name: e.target.value})}
              />
              
              <TextField
                label="Max Members"
                type="number"
                defaultValue={15}
                inputProps={{ min: 1, max: 50 }}
                fullWidth
                onChange={(e) => setFormData({...formData, max_members: parseInt(e.target.value)})}
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowCreatePartyDialog(false)}>Cancel</Button>
            <Button onClick={() => handleCreateParty(formData)} variant="contained">Create Party</Button>
          </DialogActions>
        </Dialog>

        {/* Add Member to Party Modal */}
        <Dialog open={addMemberDialogOpen} onClose={() => setAddMemberDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Add Member to Party</DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ pt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Select a participant to add to this party:
              </Typography>
              
              <List>
                {participants.map((participant) => {
                  // Find which party this participant is currently in
                  const currentParty = parties.find(party => 
                    party.members?.some(member => member.event_participant?.id === participant.id)
                  );
                  
                  // Check if they're already in the selected party
                  const isInSelectedParty = currentParty?.id === selectedPartyId;
                  
                  return (
                    <ListItem 
                      key={participant.id} 
                      button 
                      onClick={() => !isInSelectedParty && handleAddMemberToPartySubmit(participant.id)}
                      disabled={isInSelectedParty}
                    >
                      <ListItemAvatar>
                        <Avatar>
                          {participant.discord_name?.charAt(0) || '?'}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={participant.player?.in_game_name || 'Unknown Player'}
                        secondary={
                          <Box>
                            <Typography variant="caption" display="block">
                              {participant.player?.game_role ? getRoleDisplayName(participant.player.game_role) : 'No role'}
                            </Typography>
                            {isInSelectedParty ? (
                              <Typography variant="caption" color="success.main" display="block">
                                Already in this party
                              </Typography>
                            ) : currentParty ? (
                              <Typography variant="caption" color="warning.main" display="block">
                                Currently in Party {currentParty.party_number}{currentParty.party_name ? ` (${currentParty.party_name})` : ''}
                              </Typography>
                            ) : (
                              <Typography variant="caption" color="text.secondary" display="block">
                                Not in any party
                              </Typography>
                            )}
                          </Box>
                        }
                      />
                    </ListItem>
                  );
                })}
              </List>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAddMemberDialogOpen(false)}>Cancel</Button>
          </DialogActions>
        </Dialog>

        {/* Add Participant Modal */}
        <Dialog open={showAddParticipantDialog} onClose={() => setShowAddParticipantDialog(false)} maxWidth="lg" fullWidth>
          <DialogTitle>Add Participants to Event</DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ pt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Select guild members to add to this event. Already participating members are shown with their status.
              </Typography>
              
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell padding="checkbox">
                        <Checkbox
                          indeterminate={selectedMembers.length > 0 && selectedMembers.length < guildMembers.length}
                          checked={guildMembers.length > 0 && selectedMembers.length === guildMembers.length}
                          onChange={handleSelectAllMembers}
                        />
                      </TableCell>
                      <TableCell>Member</TableCell>
                      <TableCell>Guild</TableCell>
                      <TableCell>Role</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {guildMembers.map((member) => {
                      const isParticipating = participants.some(p => p.player?.id === member.id);
                      const isSelected = selectedMembers.includes(member.id);
                      
                      return (
                        <TableRow key={member.id}>
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={isSelected}
                              onChange={() => handleSelectMember(member.id)}
                              disabled={isParticipating}
                            />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Avatar sx={{ width: 32, height: 32 }}>
                                {member.avatar || 'XX'}
                              </Avatar>
                              <Box>
                                <Typography variant="body2" fontWeight="medium">
                                  {member.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {member.discord_name || 'No Discord'}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={member.guild?.name || 'No Guild'} 
                              size="small"
                              color={member.guild?.name ? 'primary' : 'default'}
                            />
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={getRoleDisplayName(member.game_role || 'unknown')} 
                              size="small"
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell>
                            {isParticipating ? (
                              <Chip 
                                label="Already Participating" 
                                size="small"
                                color="success"
                                variant="outlined"
                              />
                            ) : (
                              <Chip 
                                label="Available" 
                                size="small"
                                color="default"
                                variant="outlined"
                              />
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
              
              {selectedMembers.length > 0 && (
                <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    {selectedMembers.length} member(s) selected for addition
                  </Typography>
                </Box>
              )}
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowAddParticipantDialog(false)}>Cancel</Button>
            <Button 
              onClick={handleAddSelectedParticipants} 
              variant="contained"
              disabled={selectedMembers.length === 0}
            >
              Add Selected Members ({selectedMembers.length})
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit Party Modal */}
        <Dialog open={showEditPartyDialog} onClose={() => setShowEditPartyDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Edit Party</DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ pt: 2 }}>
              <TextField
                label="Party Name"
                value={formData.party_name || ''}
                onChange={(e) => setFormData({...formData, party_name: e.target.value})}
                fullWidth
                placeholder="e.g., Tommy's Party, Lytsu's Party"
              />
              
              <TextField
                label="Max Members"
                type="number"
                value={formData.max_members || 15}
                inputProps={{ min: 1, max: 50 }}
                fullWidth
                onChange={(e) => setFormData({...formData, max_members: parseInt(e.target.value)})}
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowEditPartyDialog(false)}>Cancel</Button>
            <Button onClick={handleUpdateParty} variant="contained">Update Party</Button>
          </DialogActions>
        </Dialog>

        {/* Guild Conflict Dialog */}
        <Dialog open={showGuildConflictDialog} onClose={() => setShowGuildConflictDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>Guild Splitting Conflict</DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ pt: 2 }}>
              <Alert severity="warning">
                {guildConflictData?.message}
              </Alert>
              
              <Typography variant="body1">
                The following parties contain members from multiple guilds:
              </Typography>
              
              <List>
                {guildConflictData?.mixed_parties?.map((party, index) => (
                  <ListItem key={index} divider>
                    <ListItemText
                      primary={
                        <Typography variant="h6">
                          Party {party.party_number}{party.party_name ? ` - ${party.party_name}` : ''}
                        </Typography>
                      }
                      secondary={
                        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                          {party.guilds.map((guild, guildIndex) => (
                            <Chip 
                              key={guildIndex}
                              label={guild} 
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                          ))}
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
              
              <Alert severity="info">
                <Typography variant="body2">
                  <strong>Options to resolve this conflict:</strong>
                </Typography>
                <Typography variant="body2" component="div" sx={{ mt: 1 }}>
                  1. <strong>Remove mixed-guild members</strong> from parties to allow guild splitting
                  <br />
                  2. <strong>Disable guild splitting</strong> to fill parties without guild restrictions
                  <br />
                  3. <strong>Create separate parties</strong> for each guild manually
                </Typography>
              </Alert>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowGuildConflictDialog(false)}>Close</Button>
            <Button 
              onClick={() => {
                // Disable guild splitting and try again
                setPartyConfig({...partyConfig, guildSplit: false});
                setShowGuildConflictDialog(false);
                // Trigger fill parties again without guild split
                setTimeout(() => handleFillParties(), 100);
              }}
              variant="contained"
              color="primary"
            >
              Disable Guild Split & Fill Parties
            </Button>
          </DialogActions>
        </Dialog>

        {/* Give Rewards Modal */}
        <Dialog open={showRewardsModal} onClose={() => setShowRewardsModal(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Give CryptoTommys Rewards</DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ pt: 2 }}>
              <Alert severity="info">
                This will give {event?.points_per_participant || 0} CryptoTommys points to all {participants.length} participants of this event.
              </Alert>
              <Typography variant="body2" color="text.secondary">
                Total points to be distributed: {(event?.points_per_participant || 0) * participants.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Participants will receive: {event?.points_per_participant || 0} points each
              </Typography>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowRewardsModal(false)}>Cancel</Button>
            <Button 
              onClick={() => {
                // TODO: Implement give rewards functionality in Task 4
                setShowRewardsModal(false);
                showAlert('info', 'Give Rewards functionality will be implemented in the next step');
              }} 
              variant="contained"
              color="primary"
            >
              Give Rewards
            </Button>
          </DialogActions>
        </Dialog>

      </Box>
    </Layout>
  );
};

export default EventDetails;
