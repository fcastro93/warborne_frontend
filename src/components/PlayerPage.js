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
  Alert
} from '@mui/material';
import {
  Person as PersonIcon,
  MilitaryTech as LevelIcon,
  Group as GuildIcon,
  Build as GearIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import Layout from './Layout';
import apiService from '../services/api';

const PlayerPage = () => {
  const { playerId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [accessDenied, setAccessDenied] = useState(false);

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
              <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold', mb: 1 }}>
                {player.in_game_name || 'Unknown Player'}
              </Typography>
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
    </Layout>
  );
};

export default PlayerPage;
