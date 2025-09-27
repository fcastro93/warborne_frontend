import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Avatar,
  Stack,
  Divider,
  Alert,
  CircularProgress,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  IconButton
} from '@mui/material';
import {
  Person,
  Shield,
  LocalFireDepartment,
  Healing,
  Group,
  Star,
  AccessTime,
  Security,
  Build,
  ArrowForward,
  Settings
} from '@mui/icons-material';
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

const getFactionColor = (faction) => {
  switch (faction) {
    case 'emberwild': return 'error';
    case 'ashen': return 'default';
    case 'sirius': return 'info';
    case 'magnates': return 'warning';
    case 'ironcreed': return 'secondary';
    case 'shroud': return 'primary';
    default: return 'default';
  }
};

const getDiscordDisplayName = (discordName) => {
  if (!discordName) return 'Not Set';
  // Remove the #0 discriminator suffix
  return discordName.replace(/#0$/, '');
};

const getGameRoleIcon = (gameRole) => {
  switch (gameRole) {
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

const getRoleColor = (role) => {
  switch (role) {
    case 'leader': return 'error';
    case 'officer': return 'warning';
    case 'recruiter': return 'info';
    default: return 'primary';
  }
};

export default function PlayerProfile() {
  const { playerId } = useParams();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tokenExpired, setTokenExpired] = useState(false);
  
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
    const fetchPlayerProfile = async () => {
      try {
        const token = searchParams.get('token');
        if (!token) {
          setError('Access token is required');
          setLoading(false);
          return;
        }

        const response = await apiService.validateProfileToken(playerId, token);
        
        if (response.success) {
          setPlayer(response.player);
        } else {
          if (response.error === 'Token has expired') {
            setTokenExpired(true);
          }
          setError(response.error);
        }
      } catch (err) {
        console.error('Error fetching player profile:', err);
        setError('Failed to load player profile');
      } finally {
        setLoading(false);
      }
    };

    fetchPlayerProfile();
  }, [playerId, searchParams]);

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
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
        <Alert 
          severity={tokenExpired ? "warning" : "error"}
          action={
            tokenExpired ? (
              <Button color="inherit" size="small" onClick={() => window.close()}>
                Close
              </Button>
            ) : null
          }
        >
          {tokenExpired ? (
            <>
              <Typography variant="h6" gutterBottom>
                🔒 Access Token Expired
              </Typography>
              <Typography variant="body2">
                Your profile access token has expired. Please generate a new one from the Discord bot using the "My Profile" button.
              </Typography>
            </>
          ) : (
            <>
              <Typography variant="h6" gutterBottom>
                ❌ Access Denied
              </Typography>
              <Typography variant="body2">
                {error}
              </Typography>
            </>
          )}
        </Alert>
      </Box>
    );
  }

  if (!player) {
    return (
      <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
        <Alert severity="error">
          <Typography variant="h6" gutterBottom>
            Player Not Found
          </Typography>
          <Typography variant="body2">
            The requested player profile could not be found.
          </Typography>
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', maxWidth: { sm: "100%", md: "1200px" }, mx: 'auto', p: 3 }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, mb: 2 }}>
          <Typography component="h1" variant="h4" sx={{ 
            fontWeight: 700,
            background: 'linear-gradient(45deg, #4a9eff, #6bb6ff)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: 0
          }}>
            Player Profile
          </Typography>
          {(user && (user.is_staff || user.is_superuser)) || searchParams.get('token') ? (
            <IconButton
              onClick={handleOpenEditModal}
              sx={{
                color: 'primary.main',
                '&:hover': {
                  backgroundColor: 'primary.light',
                  color: 'white'
                }
              }}
              title={user && (user.is_staff || user.is_superuser) ? "Edit Player (Staff)" : "Edit Player"}
            >
              <Settings />
            </IconButton>
          ) : null}
        </Box>
        <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', mb: 3 }}>
          Personal player information and statistics
        </Typography>
      </Box>

      {/* Player Overview Card */}
      <Card sx={{ mb: 3, background: 'linear-gradient(135deg, rgba(74, 158, 255, 0.1), rgba(107, 182, 255, 0.05))' }}>
        <CardContent sx={{ p: 4 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={3} sx={{ textAlign: 'center' }}>
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  mx: 'auto',
                  mb: 2,
                  bgcolor: 'primary.main',
                  fontSize: '2.5rem',
                  fontWeight: 'bold'
                }}
              >
                {player.in_game_name.substring(0, 2).toUpperCase()}
              </Avatar>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                {player.in_game_name}
              </Typography>
              <Chip
                label={`Level ${player.character_level}`}
                color="primary"
                variant="outlined"
                size="small"
              />
            </Grid>
            
            <Grid item xs={12} md={9}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                    <Group color="action" />
                    <Typography variant="body2" color="text.secondary">
                      Guild
                    </Typography>
                  </Stack>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    {player.guild?.name || 'No Guild'}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                    {getGameRoleIcon(player.game_role)}
                    <Typography variant="body2" color="text.secondary">
                      Game Role
                    </Typography>
                  </Stack>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    {player.game_role ? player.game_role.replace('_', ' ').toUpperCase() : 'No Role'}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                    <Shield color="action" />
                    <Typography variant="body2" color="text.secondary">
                      Faction
                    </Typography>
                  </Stack>
                  <Chip
                    label={player.faction ? player.faction.replace('_', ' ').toUpperCase() : 'No Faction'}
                    color={getFactionColor(player.faction)}
                    variant="outlined"
                    sx={{ mb: 2 }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                    <Star color="action" />
                    <Typography variant="body2" color="text.secondary">
                      Guild Role
                    </Typography>
                  </Stack>
                  <Chip
                    label={player.role ? player.role.toUpperCase() : 'Member'}
                    color={getRoleColor(player.role)}
                    variant="outlined"
                    sx={{ mb: 2 }}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.1), rgba(76, 175, 80, 0.05))' }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Typography variant="h4" fontWeight="bold" color="success.main" gutterBottom>
                {player.total_gear_power}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Gear Power
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', background: 'linear-gradient(135deg, rgba(255, 193, 7, 0.1), rgba(255, 193, 7, 0.05))' }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Typography variant="h4" fontWeight="bold" color="warning.main" gutterBottom>
                {player.crypto_tommys}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                CryptoTommys Points
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.1), rgba(33, 150, 243, 0.05))' }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Typography variant="h4" fontWeight="bold" color="info.main" gutterBottom>
                {player.character_level}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Character Level
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', background: 'linear-gradient(135deg, rgba(156, 39, 176, 0.1), rgba(156, 39, 176, 0.05))' }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Typography variant="h4" fontWeight="bold" color="secondary.main" gutterBottom>
                {player.is_active ? 'Active' : 'Inactive'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Status
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Drifters Section */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Person color="primary" />
            Drifters
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <List>
            {[player.drifter_1, player.drifter_2, player.drifter_3].map((drifter, index) => (
              <ListItem key={index} sx={{ px: 0 }}>
                <ListItemIcon>
                  <Person color="action" />
                </ListItemIcon>
                <ListItemText
                  primary={`Drifter ${index + 1}`}
                  secondary={drifter || 'Not Assigned'}
                  secondaryTypographyProps={{
                    color: drifter ? 'text.primary' : 'text.secondary'
                  }}
                />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>

      {/* Loadout Section */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Build color="primary" />
            Loadout
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            View and manage your equipment, weapons, and gear configurations.
          </Typography>
          <Button
            component={Link}
            to={`/guilds-legacy/player/${player.id}/loadout/?token=${searchParams.get('token')}`}
            variant="contained"
            startIcon={<Build />}
            endIcon={<ArrowForward />}
            sx={{ 
              background: 'linear-gradient(45deg, #4a9eff, #6bb6ff)',
              '&:hover': {
                background: 'linear-gradient(45deg, #3a8eef, #5ba6ef)',
              }
            }}
          >
            Open Loadout
          </Button>
        </CardContent>
      </Card>

      {/* Additional Information */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AccessTime color="primary" />
            Additional Information
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Discord Name
              </Typography>
              <Typography variant="body1" gutterBottom>
                {getDiscordDisplayName(player.discord_name)}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Member Since
              </Typography>
              <Typography variant="body1" gutterBottom>
                {new Date(player.created_at).toLocaleDateString()}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Security Notice */}
      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Paper sx={{ p: 2, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
          <Stack direction="row" alignItems="center" justifyContent="center" spacing={1}>
            <Security color="action" />
            <Typography variant="body2" color="text.secondary">
              This profile is protected and only accessible to you. The access token expires automatically.
            </Typography>
          </Stack>
        </Paper>
      </Box>

      {/* Edit Player Modal */}
      <Dialog open={editModalOpen} onClose={handleCloseEditModal} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Settings color="primary" />
            Edit Player
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            {/* Player Name */}
            <TextField
              fullWidth
              label="Player Name"
              value={editFormData.in_game_name}
              onChange={(e) => handleFormChange('in_game_name', e.target.value)}
              margin="normal"
              required
            />
            
            {/* Character Level */}
            <TextField
              fullWidth
              label="Character Level"
              type="number"
              value={editFormData.character_level}
              onChange={(e) => handleFormChange('character_level', parseInt(e.target.value) || 1)}
              margin="normal"
              inputProps={{ min: 1, max: 100 }}
              required
            />
            
            {/* Game Role */}
            <FormControl fullWidth margin="normal">
              <InputLabel>Game Role</InputLabel>
              <Select
                value={editFormData.game_role}
                onChange={(e) => handleFormChange('game_role', e.target.value)}
                label="Game Role"
              >
                <MenuItem value="">
                  <em>No Role</em>
                </MenuItem>
                {GAME_ROLES.map((role) => (
                  <MenuItem key={role.value} value={role.value}>
                    {role.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            {/* Guild */}
            <FormControl fullWidth margin="normal">
              <InputLabel>Guild</InputLabel>
              <Select
                value={editFormData.guild_id}
                onChange={(e) => handleFormChange('guild_id', e.target.value)}
                label="Guild"
              >
                {guilds.map((guild) => (
                  <MenuItem key={guild.id} value={guild.id}>
                    {guild.name} {guild.member_count > 0 && `(${guild.member_count} members)`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditModal} disabled={editLoading}>
            Cancel
          </Button>
          <Button 
            onClick={handleSavePlayer} 
            variant="contained" 
            disabled={editLoading || !editFormData.in_game_name}
          >
            {editLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
