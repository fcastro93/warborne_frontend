import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Avatar,
  Chip,
  Divider,
  Paper,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  IconButton,
  Button as MuiButton
} from '@mui/material';
import {
  Person as PersonIcon,
  MilitaryTech as LevelIcon,
  Group as GuildIcon,
  Build as GearIcon,
  Visibility as ViewIcon,
  Settings
} from '@mui/icons-material';
import Layout from './Layout';
import { apiService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

// Game roles from Discord bot
const GAME_ROLES = [
  { value: 'healer', label: 'Healer' },
  { value: 'defensive_tank', label: 'Defensive Tank' },
  { value: 'offensive_tank', label: 'Offensive Tank' },
  { value: 'ranged_dps', label: 'Ranged DPS' },
  { value: 'melee_dps', label: 'Melee DPS' },
  { value: 'defensive_support', label: 'Defensive Support' },
  { value: 'offensive_support', label: 'Offensive Support' },
  { value: 'support', label: 'Support' }
];

const PlayerPage = () => {
  const { playerId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [accessDenied, setAccessDenied] = useState(false);
  
  // Edit modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    in_game_name: '',
    character_level: 1,
    game_role: '',
    guild_id: 'none'
  });
  const [guilds, setGuilds] = useState([]);
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    fetchPlayerData();
  }, [playerId]);

  const fetchPlayerData = async () => {
    try {
      setLoading(true);
      setError(null);
      setAccessDenied(false);

      // Check for access token
      const token = searchParams.get('token');
      console.log('Token from URL:', token);
      console.log('Player ID:', playerId);
      
      if (!token) {
        setAccessDenied(true);
        setError('Access token is required to view this player page.');
        return;
      }

      // Validate token and get player data
      console.log('Calling validateProfileToken with:', { playerId, token });
      const response = await apiService.validateProfileToken(playerId, token);
      console.log('validateProfileToken response:', response);
      
      if (!response.success) {
        setAccessDenied(true);
        setError(response.error || 'Invalid or expired access token.');
        return;
      }

      const playerData = response.player;
      console.log('Player data:', playerData);
      setPlayer(playerData);
    } catch (error) {
      console.error('Error fetching player data:', error);
      setError('An unexpected error occurred while loading the player page.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewLoadout = () => {
    const token = searchParams.get('token');
    if (token) {
      navigate(`/player/${playerId}/loadout?token=${token}`);
    } else {
      navigate(`/player/${playerId}/loadout`);
    }
  };

  // Edit modal functions
  const handleOpenEditModal = async () => {
    try {
      // Load guilds list
      const guildsResponse = await apiService.getGuildsList();
      if (guildsResponse.success) {
        setGuilds(guildsResponse.guilds);
      }
      
      // Set form data with current player data
      setEditFormData({
        in_game_name: player?.in_game_name || '',
        character_level: player?.character_level || 1,
        game_role: player?.game_role || '',
        guild_id: player?.guild?.id || 'none'
      });
      
      setEditModalOpen(true);
    } catch (error) {
      console.error('Error loading edit data:', error);
    }
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setEditFormData({
      in_game_name: '',
      character_level: 1,
      game_role: '',
      guild_id: 'none'
    });
  };

  const handleFormChange = (field, value) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSavePlayer = async () => {
    try {
      setEditLoading(true);
      
      // Get token from URL params if available (for Discord bot users)
      const token = searchParams.get('token');
      
      const response = await apiService.updatePlayerProfile(playerId, editFormData, token);
      
      if (response.success) {
        // Update local player state
        setPlayer(prev => ({
          ...prev,
          ...response.player
        }));
        
        handleCloseEditModal();
      } else {
        alert('Error updating player: ' + (response.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error updating player:', error);
      alert('Error updating player: ' + error.message);
    } finally {
      setEditLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Box sx={{ p: 3 }}>
          <Alert severity={accessDenied ? "warning" : "error"}>
            {error}
            {accessDenied && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  This page requires a valid access token. Please use the Discord bot to generate a new access link.
                </Typography>
              </Box>
            )}
          </Alert>
        </Box>
      </Layout>
    );
  }

  if (!player) {
    return (
      <Layout>
        <Box sx={{ p: 3 }}>
          <Alert severity="warning">Player not found</Alert>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
        {/* Header */}
        <Paper sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: 'rgba(255,255,255,0.2)',
                  fontSize: '2rem'
                }}
              >
                <PersonIcon fontSize="large" />
              </Avatar>
            </Grid>
            <Grid item xs>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold', mb: 1 }}>
                  {player.in_game_name || 'Unknown Player'}
                </Typography>
                {/* Settings icon - visible to staff users or users with Discord token */}
                {(user?.is_staff || user?.is_superuser || searchParams.get('token')) && (
                  <IconButton 
                    onClick={handleOpenEditModal}
                    sx={{ 
                      color: 'rgba(255,255,255,0.7)', 
                      '&:hover': { color: 'white' },
                      mb: 1
                    }}
                    size="small"
                  >
                    <Settings />
                  </IconButton>
                )}
              </Box>
              <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.8)', mb: 2 }}>
                {player.discord_name || 'No Discord Name'}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip
                  icon={<LevelIcon />}
                  label={`Level ${player.character_level || 1}`}
                  sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                />
                {player.game_role && (
                  <Chip
                    label={player.game_role}
                    sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                  />
                )}
              </Box>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                startIcon={<ViewIcon />}
                onClick={handleViewLoadout}
                sx={{
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.3)'
                  }
                }}
              >
                View Loadout
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Player Stats */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PersonIcon color="primary" />
                  Player Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Player ID:</Typography>
                    <Typography variant="body2">{player.id}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">In-Game Name:</Typography>
                    <Typography variant="body2">{player.in_game_name || 'Not set'}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Discord Name:</Typography>
                    <Typography variant="body2">{player.discord_name || 'Not set'}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Character Level:</Typography>
                    <Typography variant="body2">{player.character_level || 1}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Game Role:</Typography>
                    <Typography variant="body2">{player.game_role || 'Not set'}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <GuildIcon color="primary" />
                  Guild Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Guild:</Typography>
                    <Typography variant="body2">{player.guild?.name || 'No guild'}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Guild Role:</Typography>
                    <Typography variant="body2">{player.guild_role || 'No role'}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Joined:</Typography>
                    <Typography variant="body2">
                      {player.created_at ? new Date(player.created_at).toLocaleDateString() : 'Unknown'}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Quick Actions */}
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Quick Actions
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                startIcon={<ViewIcon />}
                onClick={handleViewLoadout}
              >
                View Loadout
              </Button>
              <Button
                variant="outlined"
                startIcon={<GearIcon />}
                onClick={handleViewLoadout}
              >
                Manage Equipment
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
      
      {/* Edit Player Modal */}
      <Dialog open={editModalOpen} onClose={handleCloseEditModal} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Player Information</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Player Name */}
            <TextField
              label="Player Name"
              value={editFormData.in_game_name}
              onChange={(e) => handleFormChange('in_game_name', e.target.value)}
              fullWidth
              required
            />
            
            {/* Character Level */}
            <TextField
              label="Character Level"
              type="number"
              value={editFormData.character_level}
              onChange={(e) => handleFormChange('character_level', parseInt(e.target.value) || 1)}
              fullWidth
              inputProps={{ min: 1 }}
            />
            
            {/* Game Role */}
            <FormControl fullWidth>
              <InputLabel>Game Role</InputLabel>
              <Select
                value={editFormData.game_role}
                onChange={(e) => handleFormChange('game_role', e.target.value)}
                label="Game Role"
              >
                <MenuItem value="">No Role</MenuItem>
                {GAME_ROLES.map((role) => (
                  <MenuItem key={role.value} value={role.value}>
                    {role.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            {/* Guild */}
            <FormControl fullWidth>
              <InputLabel>Guild</InputLabel>
              <Select
                value={editFormData.guild_id}
                onChange={(e) => handleFormChange('guild_id', e.target.value)}
                label="Guild"
              >
                {guilds.map((guild) => (
                  <MenuItem key={guild.id} value={guild.id}>
                    {guild.name} ({guild.member_count} members)
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <MuiButton onClick={handleCloseEditModal}>Cancel</MuiButton>
          <MuiButton 
            onClick={handleSavePlayer} 
            variant="contained" 
            disabled={editLoading}
          >
            {editLoading ? 'Saving...' : 'Save Changes'}
          </MuiButton>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default PlayerPage;
