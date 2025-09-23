import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  Stack,
  Button,
  IconButton,
  Tooltip,
  Grid,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from '@mui/material';
import {
  Person,
  Shield,
  LocalFireDepartment,
  Healing,
  Search,
  Add,
  Edit,
  Delete,
  Visibility,
  Message,
  Circle,
} from '@mui/icons-material';
import Layout from './Layout';
import { apiService } from '../services/api';

// Helper functions for styling
const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case 'online': return 'success';
    case 'offline': return 'default';
    case 'away': return 'warning';
    default: return 'default';
  }
};

const getRoleColor = (role) => {
  switch (role.toLowerCase()) {
    case 'leader': return 'error';
    case 'officer': return 'warning';
    case 'member': return 'primary';
    case 'recruiter': return 'info';
    default: return 'default';
  }
};

const getGameRoleIcon = (gameRole) => {
  switch (gameRole?.toLowerCase()) {
    case 'defensive_tank':
    case 'offensive_tank':
      return <Shield color="primary" />;
    case 'healer':
    case 'defensive_support':
      return <Healing color="success" />;
    case 'ranged_dps':
    case 'melee_dps':
    case 'offensive_support':
      return <LocalFireDepartment color="error" />;
    default:
      return <Person color="action" />;
  }
};

const getFactionColor = (faction) => {
  switch (faction?.toLowerCase()) {
    case 'emberwild': return 'error';
    case 'magnates': return 'warning';
    case 'ashen': return 'default';
    case 'ironcreed': return 'info';
    case 'sirius': return 'secondary';
    case 'shroud': return 'primary';
    default: return 'default';
  }
};

// Discord-specific helper functions
const getDiscordStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'online': return 'success';
    case 'idle': return 'warning';
    case 'dnd': return 'error';
    case 'offline': return 'default';
    default: return 'default';
  }
};

const getDiscordStatusIcon = (status) => {
  switch (status?.toLowerCase()) {
    case 'online': return <Circle sx={{ color: '#43b581', fontSize: 12 }} />;
    case 'idle': return <Circle sx={{ color: '#faa61a', fontSize: 12 }} />;
    case 'dnd': return <Circle sx={{ color: '#f04747', fontSize: 12 }} />;
    case 'offline': return <Circle sx={{ color: '#747f8d', fontSize: 12 }} />;
    default: return <Circle sx={{ color: '#747f8d', fontSize: 12 }} />;
  }
};

const handleDiscordMessage = (discordUserId) => {
  if (!discordUserId) {
    console.warn('No Discord User ID provided');
    return;
  }
  
  // Open Discord DM in new tab
  const discordUrl = `https://discord.com/users/${discordUserId}`;
  window.open(discordUrl, '_blank');
};

export default function MembersPage() {
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [discordPresence, setDiscordPresence] = useState({});
  const [editFormData, setEditFormData] = useState({
    name: '',
    role: '',
    game_role: '',
    level: '',
    faction: '',
    status: ''
  });
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const data = await apiService.getGuildMembers();
        if (data.members) {
          setMembers(data.members);
          // Fetch Discord presence for members with Discord IDs
          fetchDiscordPresence(data.members);
        }
      } catch (error) {
        console.error('Error fetching guild members:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  const fetchDiscordPresence = async (members) => {
    try {
      // Get members with Discord user IDs
      const membersWithDiscord = members.filter(member => member.discord_user_id);
      
      if (membersWithDiscord.length === 0) return;
      
      // Fetch Discord presence data from backend
      const presenceData = await apiService.getDiscordPresence(
        membersWithDiscord.map(member => member.discord_user_id)
      );
      
      setDiscordPresence(presenceData);
    } catch (error) {
      console.error('Error fetching Discord presence:', error);
      // Set default offline status for all members
      const defaultPresence = {};
      members.forEach(member => {
        if (member.discord_user_id) {
          defaultPresence[member.discord_user_id] = { status: 'offline' };
        }
      });
      setDiscordPresence(defaultPresence);
    }
  };

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.game_role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.faction?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditMember = (member) => {
    setSelectedMember(member);
    setEditFormData({
      name: member.name || '',
      role: member.role || '',
      game_role: member.game_role || '',
      level: member.level || '',
      faction: member.faction || '',
      status: member.status || ''
    });
    setEditModalOpen(true);
  };

  const handleFormChange = (field, value) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveMember = async () => {
    try {
      // TODO: Implement API call to update member
      console.log('Updating member:', selectedMember.id, editFormData);
      
      // For now, just update local state
      setMembers(prev => prev.map(member => 
        member.id === selectedMember.id 
          ? { ...member, ...editFormData }
          : member
      ));
      
      setAlert({ type: 'success', message: 'Member updated successfully!' });
      setEditModalOpen(false);
    } catch (error) {
      setAlert({ type: 'error', message: 'Error updating member: ' + error.message });
    }
  };

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  };

  if (loading) {
    return (
      <Layout>
        <Box sx={{ p: 3 }}>
          <Typography>Loading members...</Typography>
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
          Guild Members
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          sx={{ borderRadius: 2 }}
        >
          Add Member
        </Button>
      </Stack>

      {/* Search and Stats */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          <TextField
            fullWidth
            placeholder="Search members by name, role, or faction..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{ borderRadius: 2 }}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Total Members
              </Typography>
              <Typography variant="h3" component="div" sx={{ fontWeight: 700 }}>
                {members.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Members Table */}
      <TableContainer>
        <Table 
          sx={{
            '& .MuiTableRow-root': {
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
              },
            },
            '& .MuiTableCell-root': {
              borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
              padding: '8px 16px',
            },
            '& .MuiTableHead-root .MuiTableCell-root': {
              borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
              fontWeight: 600,
              fontSize: '0.875rem',
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              color: 'rgba(255, 255, 255, 0.87)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            },
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell>Player</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Game Role</TableCell>
              <TableCell>Level</TableCell>
              <TableCell>Faction</TableCell>
              <TableCell>Discord Status</TableCell>
              <TableCell>Drifters</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredMembers.map((member) => (
              <TableRow key={member.id}>
                <TableCell>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                      {member.avatar}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {member.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ID: {member.id}
                      </Typography>
                    </Box>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Chip
                    label={member.role}
                    color={getRoleColor(member.role)}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    {getGameRoleIcon(member.game_role)}
                    <Typography variant="body2">
                      {member.game_role?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'N/A'}
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {member.level}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={member.faction?.replace(/\b\w/g, l => l.toUpperCase()) || 'None'}
                    color={getFactionColor(member.faction)}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  {member.discord_user_id ? (
                    <Stack direction="row" alignItems="center" spacing={1}>
                      {getDiscordStatusIcon(
                        discordPresence[member.discord_user_id]?.status || 'offline'
                      )}
                      <Chip
                        label={
                          discordPresence[member.discord_user_id]?.status?.toUpperCase() || 'OFFLINE'
                        }
                        color={getDiscordStatusColor(
                          discordPresence[member.discord_user_id]?.status || 'offline'
                        )}
                        size="small"
                      />
                    </Stack>
                  ) : (
                    <Chip
                      label="NO DISCORD"
                      color="default"
                      size="small"
                      variant="outlined"
                    />
                  )}
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
                    {member.drifters?.map((drifter, index) => (
                      <Chip
                        key={index}
                        label={drifter}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: '0.7rem', height: 20 }}
                      />
                    )) || <Typography variant="caption" color="text.secondary">None</Typography>}
                  </Stack>
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <Tooltip title="View Loadout">
                      <IconButton 
                        size="small" 
                        color="primary"
                        onClick={() => navigate(`/player/${member.id}/loadout`)}
                      >
                        <Visibility fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    {member.discord_user_id && (
                      <Tooltip title="Message on Discord">
                        <IconButton 
                          size="small" 
                          color="info"
                          onClick={() => handleDiscordMessage(member.discord_user_id)}
                        >
                          <Message fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip title="Edit Member">
                      <IconButton 
                        size="small" 
                        color="secondary"
                        onClick={() => handleEditMember(member)}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Remove Member">
                      <IconButton size="small" color="error">
                        <Delete fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {filteredMembers.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No members found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {searchTerm ? 'Try adjusting your search terms' : 'No members in the guild yet'}
          </Typography>
        </Box>
      )}

      {/* Alert */}
      {alert && (
        <Alert 
          severity={alert.type} 
          onClose={() => setAlert(null)}
          sx={{ position: 'fixed', top: 20, right: 20, zIndex: 9999 }}
        >
          {alert.message}
        </Alert>
      )}

      {/* Edit Member Modal */}
      <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Member</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ pt: 2 }}>
            <TextField
              label="Member Name"
              value={editFormData.name}
              onChange={(e) => handleFormChange('name', e.target.value)}
              fullWidth
              required
            />
            
            <FormControl fullWidth>
              <InputLabel>Guild Role</InputLabel>
              <Select
                value={editFormData.role}
                onChange={(e) => handleFormChange('role', e.target.value)}
                label="Guild Role"
              >
                <MenuItem value="leader">Leader</MenuItem>
                <MenuItem value="officer">Officer</MenuItem>
                <MenuItem value="member">Member</MenuItem>
                <MenuItem value="recruiter">Recruiter</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl fullWidth>
              <InputLabel>Game Role</InputLabel>
              <Select
                value={editFormData.game_role}
                onChange={(e) => handleFormChange('game_role', e.target.value)}
                label="Game Role"
              >
                <MenuItem value="ranged_dps">Ranged DPS</MenuItem>
                <MenuItem value="melee_dps">Melee DPS</MenuItem>
                <MenuItem value="healer">Healer</MenuItem>
                <MenuItem value="defensive_tank">Defensive Tank</MenuItem>
                <MenuItem value="offensive_tank">Offensive Tank</MenuItem>
                <MenuItem value="offensive_support">Offensive Support</MenuItem>
                <MenuItem value="defensive_support">Defensive Support</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              label="Level"
              type="number"
              value={editFormData.level}
              onChange={(e) => handleFormChange('level', e.target.value)}
              fullWidth
              inputProps={{ min: 1, max: 100 }}
            />
            
            <FormControl fullWidth>
              <InputLabel>Faction</InputLabel>
              <Select
                value={editFormData.faction}
                onChange={(e) => handleFormChange('faction', e.target.value)}
                label="Faction"
              >
                <MenuItem value="empire">Empire</MenuItem>
                <MenuItem value="rebellion">Rebellion</MenuItem>
                <MenuItem value="shroud">Shroud</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={editFormData.status}
                onChange={(e) => handleFormChange('status', e.target.value)}
                label="Status"
              >
                <MenuItem value="online">Online</MenuItem>
                <MenuItem value="offline">Offline</MenuItem>
                <MenuItem value="away">Away</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditModalOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveMember} variant="contained">Save Changes</Button>
        </DialogActions>
      </Dialog>
      </Box>
    </Layout>
  );
}
