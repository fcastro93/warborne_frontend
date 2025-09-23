import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Tabs,
  Tab,
  Grid,
  Avatar,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
  Stack,
  Divider,
  Paper,
  Badge,
  Alert,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemButton,
  ListSubheader,
} from '@mui/material';
import {
  Person,
  Shield,
  LocalFireDepartment,
  Healing,
  Search,
  Close,
  Add,
  Remove,
  Info,
  Star,
  Diamond,
  AutoAwesome,
  Edit,
  Check,
  Cancel,
  FilterList,
  ArrowBack,
  // New icons for visual improvements
  MilitaryTech,
  Public,
  WorkspacePremium,
  Inventory,
  Speed,
  Favorite,
  Security,
  FlashOn,
} from '@mui/icons-material';
import Layout from './Layout';
import { apiService } from '../services/api';

// Consistent Color Palette & Rarity System
const RARITY_COLORS = {
  common: {
    color: 'default',
    bg: 'grey.50',
    border: 'grey.400',
    text: 'grey.700',
    glow: 'rgba(158, 158, 158, 0.3)',
    icon: '⚪'
  },
  uncommon: {
    color: 'success',
    bg: 'success.50',
    border: 'success.main',
    text: 'success.dark',
    glow: 'rgba(76, 175, 80, 0.3)',
    icon: '🟢'
  },
  rare: {
    color: 'info',
    bg: 'info.50',
    border: 'info.main',
    text: 'info.dark',
    glow: 'rgba(33, 150, 243, 0.3)',
    icon: '🔵'
  },
  epic: {
    color: 'secondary',
    bg: 'secondary.50',
    border: 'secondary.main',
    text: 'secondary.dark',
    glow: 'rgba(156, 39, 176, 0.3)',
    icon: '🟣'
  },
  legendary: {
    color: 'warning',
    bg: 'warning.50',
    border: 'warning.main',
    text: 'warning.dark',
    glow: 'rgba(255, 152, 0, 0.3)',
    icon: '🟡'
  }
};

const getRarityColor = (rarity) => {
  return RARITY_COLORS[rarity?.toLowerCase()]?.color || 'default';
};

const getRarityConfig = (rarity) => {
  return RARITY_COLORS[rarity?.toLowerCase()] || RARITY_COLORS.common;
};

// Typography Hierarchy
const TYPOGRAPHY = {
  title: {
    variant: 'h6',
    fontWeight: 700,
    fontSize: '1.25rem',
    color: 'text.primary'
  },
  subtitle: {
    variant: 'subtitle1',
    fontWeight: 600,
    fontSize: '1rem',
    color: 'text.primary'
  },
  body: {
    variant: 'body2',
    fontWeight: 500,
    fontSize: '0.875rem',
    color: 'text.primary'
  },
  secondary: {
    variant: 'body2',
    fontWeight: 400,
    fontSize: '0.875rem',
    color: 'text.secondary'
  },
  caption: {
    variant: 'caption',
    fontWeight: 400,
    fontSize: '0.75rem',
    color: 'text.secondary'
  },
  statNumber: {
    variant: 'h5',
    fontWeight: 700,
    fontSize: '1.5rem'
  },
  statLabel: {
    variant: 'body2',
    fontWeight: 500,
    fontSize: '0.875rem',
    color: 'text.secondary'
  }
};

const getRarityIcon = (rarity) => {
  switch (rarity?.toLowerCase()) {
    case 'common': return <Star />;
    case 'uncommon': return <Star />;
    case 'rare': return <Diamond />;
    case 'epic': return <Diamond />;
    case 'legendary': return <AutoAwesome />;
    default: return <Star />;
  }
};

const getGearTypeIcon = (type) => {
  switch (type?.toLowerCase()) {
    case 'weapon': return <LocalFireDepartment />;
    case 'armor': return <Shield />;
    case 'accessory': return <Diamond />;
    case 'mod': return <Add />;
    default: return <Person />;
  }
};

export default function PlayerLoadout() {
  const { playerId } = useParams();
  const [player, setPlayer] = useState(null);
  const [drifters, setDrifters] = useState([]);
  const [gearItems, setGearItems] = useState([]);
  const [equippedGear, setEquippedGear] = useState({});
  const [activeTab, setActiveTab] = useState(0);
  const [selectedGear, setSelectedGear] = useState(null);
  const [gearDialogOpen, setGearDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterRarity, setFilterRarity] = useState('all');
  const [filterStat, setFilterStat] = useState('all');
  const [editingName, setEditingName] = useState(false);
  const [editName, setEditName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlayerData();
  }, [playerId]);

  const fetchPlayerData = async () => {
    try {
            // Fetch player data
            const playerData = await apiService.getPlayer(playerId);
            console.log('Player data:', playerData);
            console.log('Game role field:', playerData?.game_role, playerData?.in_game_role);
            setPlayer(playerData);
      
      // Fetch drifters data
      const driftersData = await apiService.getPlayerDrifters(playerId);
      setDrifters(driftersData.drifters || []);
      
      // Fetch gear items
      const gearData = await apiService.getGearItems();
      setGearItems(Array.isArray(gearData) ? gearData : []);
      
      // Fetch equipped gear
      const equippedData = await apiService.getPlayerEquippedGear(playerId);
      setEquippedGear(equippedData);
      
    } catch (error) {
      console.error('Error fetching player data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleGearClick = (gear) => {
    setSelectedGear(gear);
    setGearDialogOpen(true);
  };

  const handleEquipGear = async (gearId, drifterNum, slotType) => {
    try {
      await apiService.equipGear(playerId, gearId, drifterNum, slotType);
      // Refresh data
      fetchPlayerData();
    } catch (error) {
      console.error('Error equipping gear:', error);
    }
  };

  const handleUnequipGear = async (gearId) => {
    try {
      await apiService.unequipGear(playerId, gearId);
      // Refresh data
      fetchPlayerData();
    } catch (error) {
      console.error('Error unequipping gear:', error);
    }
  };

  const filteredGear = gearItems.filter(gear => {
    const matchesSearch = gear.base_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         gear.skill_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || gear.gear_type?.category === filterType;
    const matchesRarity = filterRarity === 'all' || gear.rarity === filterRarity;
    
    // Stat filtering (Strength, Agility, Intelligence)
    let matchesStat = true;
    if (filterStat !== 'all') {
      // This would need to be implemented based on your stat system
      matchesStat = true; // Placeholder
    }
    
    return matchesSearch && matchesType && matchesRarity && matchesStat;
  });

  const handleEditName = () => {
    setEditName(player.name);
    setEditingName(true);
  };

  const handleSaveName = async () => {
    // TODO: Implement API call to update player name
    setPlayer({...player, name: editName});
    setEditingName(false);
  };

  const handleCancelEdit = () => {
    setEditingName(false);
    setEditName('');
  };

  if (loading) {
    return (
      <Layout>
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography>Loading player loadout...</Typography>
        </Box>
      </Layout>
    );
  }

  if (!player) {
    return (
      <Layout>
        <Box sx={{ p: 3 }}>
          <Alert severity="error">Player not found</Alert>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box sx={{ 
        p: 3,
        background: 'linear-gradient(135deg, rgba(18, 18, 18, 0.95) 0%, rgba(33, 33, 33, 0.95) 100%)',
        minHeight: '100vh',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 80%, rgba(100, 181, 246, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(76, 175, 80, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(156, 39, 176, 0.05) 0%, transparent 50%)
          `,
          pointerEvents: 'none',
        }
      }}>
        {/* Header with Back Button */}
        <Box sx={{ mb: 3 }}>
          <Button 
            startIcon={<ArrowBack />} 
            onClick={() => window.history.back()}
            sx={{ mb: 2 }}
          >
            Back
          </Button>
          
          {/* Player Name with Edit */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            {editingName ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TextField
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  size="small"
                  variant="outlined"
                />
                <IconButton onClick={handleSaveName} color="primary">
                  <Check />
                </IconButton>
                <IconButton onClick={handleCancelEdit}>
                  <Cancel />
                </IconButton>
              </Box>
            ) : (
              <>
                <Typography variant="h4" component="h1" sx={{ 
                  fontWeight: 600,
                  color: '#64b5f6',
                  textShadow: '0 0 20px rgba(100, 181, 246, 0.5)'
                }}>
                  {player.name}
                </Typography>
                <IconButton onClick={handleEditName} size="small">
                  <Edit />
                </IconButton>
              </>
            )}
          </Box>
          
          <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
            Player Loadout
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Player Information Panel - 3-3-1 Layout */}
          <Grid item xs={12}>
            <Grid container spacing={2} sx={{ mb: 3, display: 'flex', flexWrap: 'wrap' }}>
              {/* Top Row - 3 Cards */}
              <Grid item xs={12} sm={4}>
                <Card sx={{ 
                  p: 3,
                  bgcolor: 'grey.800',
                  border: '1px solid rgba(100, 181, 246, 0.2)',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                  transition: 'all 0.3s ease',
                  minHeight: 120,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(100, 181, 246, 0.3)',
                  }
                }}>
                  <Public sx={{ color: 'primary.main', fontSize: 32, mb: 1 }} />
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                    Discord
                  </Typography>
                  <Typography variant="body2" fontWeight="bold" color="white">
                    {player?.discord_name || 'N/A'}
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Card sx={{ 
                  p: 3,
                  bgcolor: 'grey.800',
                  border: '1px solid rgba(76, 175, 80, 0.2)',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                  transition: 'all 0.3s ease',
                  minHeight: 120,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)',
                  }
                }}>
                  <Shield sx={{ color: 'success.main', fontSize: 32, mb: 1 }} />
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                    Guild
                  </Typography>
                  <Typography variant="body2" fontWeight="bold" color="success.main">
                    Violence2
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Card sx={{ 
                  p: 3,
                  bgcolor: 'grey.800',
                  border: '1px solid rgba(255, 152, 0, 0.2)',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                  transition: 'all 0.3s ease',
                  minHeight: 120,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(255, 152, 0, 0.3)',
                  }
                }}>
                  <MilitaryTech sx={{ color: 'warning.main', fontSize: 32, mb: 1 }} />
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                    Level
                  </Typography>
                  <Typography variant="body2" fontWeight="bold" color="warning.main">
                    {player?.level || 'N/A'}
                  </Typography>
                </Card>
              </Grid>
              
              {/* Middle Row - 3 Cards */}
              <Grid item xs={12} sm={4}>
                <Card sx={{ 
                  p: 3,
                  bgcolor: 'grey.800',
                  border: '1px solid rgba(33, 150, 243, 0.2)',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                  transition: 'all 0.3s ease',
                  minHeight: 120,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(33, 150, 243, 0.3)',
                  }
                }}>
                  <WorkspacePremium sx={{ color: 'info.main', fontSize: 32, mb: 1 }} />
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                    Faction
                  </Typography>
                  <Typography variant="body2" fontWeight="bold" color="info.main">
                    {player?.faction || 'N/A'}
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Card sx={{ 
                  p: 3,
                  bgcolor: 'grey.800',
                  border: '1px solid rgba(156, 39, 176, 0.2)',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                  transition: 'all 0.3s ease',
                  minHeight: 120,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(156, 39, 176, 0.3)',
                  }
                }}>
                  <Security sx={{ color: 'secondary.main', fontSize: 32, mb: 1 }} />
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                    Role
                  </Typography>
                  <Typography variant="body2" fontWeight="bold" color="secondary.main">
                    {player?.role || 'N/A'}
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Card sx={{ 
                  p: 3,
                  bgcolor: 'grey.800',
                  border: '1px solid rgba(244, 67, 54, 0.2)',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                  transition: 'all 0.3s ease',
                  minHeight: 120,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(244, 67, 54, 0.3)',
                  }
                }}>
                  <LocalFireDepartment sx={{ color: 'error.main', fontSize: 32, mb: 1 }} />
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                    In-Game Role
                  </Typography>
                  <Typography variant="body2" fontWeight="bold" color="error.main">
                    {player?.game_role || player?.in_game_role || 'N/A'}
                  </Typography>
                </Card>
              </Grid>
              
              {/* Bottom Row - 1 Card */}
              <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: 'center' }}>
                <Card sx={{ 
                  p: 3,
                  bgcolor: 'grey.800',
                  border: '1px solid rgba(100, 181, 246, 0.2)',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                  transition: 'all 0.3s ease',
                  minHeight: 120,
                  minWidth: 200,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(100, 181, 246, 0.3)',
                  }
                }}>
                  <Inventory sx={{ color: 'primary.main', fontSize: 32, mb: 1 }} />
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                    Total Gear
                  </Typography>
                  <Typography variant="body2" fontWeight="bold" color="primary.main">
                    {gearItems?.length || 0}
                  </Typography>
                </Card>
              </Grid>
            </Grid>
          </Grid>
          {/* Left Panel - Drifter Loadouts */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Drifter Loadouts
                </Typography>
                
                <Tabs 
                  value={activeTab} 
                  onChange={handleTabChange} 
                  sx={{ 
                    mb: 2,
                    '& .MuiTab-root': {
                      textTransform: 'none',
                      borderRadius: '20px',
                      minHeight: 40,
                      margin: '0 4px',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: 'rgba(100, 181, 246, 0.1)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(100, 181, 246, 0.3)',
                      },
                      '&.Mui-selected': {
                        backgroundColor: 'primary.main',
                        color: 'white',
                        boxShadow: '0 4px 20px rgba(100, 181, 246, 0.4)',
                        transform: 'translateY(-2px)',
                      }
                    }
                  }}
                >
                  {drifters.map((drifter, index) => (
                    <Tab
                      key={index}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Person sx={{ fontSize: 18 }} />
                          {drifter.name || `Drifter ${index + 1}`}
                        </Box>
                      }
                    />
                  ))}
                </Tabs>

                {/* Drifter Content */}
                {drifters.map((drifter, index) => (
                  <Box
                    key={index}
                    hidden={activeTab !== index}
                    sx={{ mt: 2 }}
                  >
                    {drifter.name ? (
                      <>
                        {/* Basic Stats - No Background Card */}
                        <Typography 
                          {...TYPOGRAPHY.title}
                          sx={{ mb: 3, textAlign: 'center' }}
                        >
                          Basic stats of the drifter
                        </Typography>
                        <Grid container spacing={2} sx={{ mb: 3 }}>
                          <Grid item xs={6} sm={4}>
                            <Card sx={{ 
                              p: 2, 
                              textAlign: 'center',
                              bgcolor: 'success.50',
                              border: '2px solid',
                              borderColor: 'success.main',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)',
                              }
                            }}>
                              <Healing sx={{ color: 'success.main', fontSize: 24, mb: 1 }} />
                              <Typography variant="h5" color="success.main" fontWeight="bold">
                                {drifter.base_health || 315}
                              </Typography>
                              <Typography variant="body2" color="success.dark" fontWeight="medium">
                                Health
                              </Typography>
                            </Card>
                          </Grid>
                          <Grid item xs={6} sm={4}>
                            <Card sx={{ 
                              p: 2, 
                              textAlign: 'center',
                              bgcolor: 'info.50',
                              border: '2px solid',
                              borderColor: 'info.main',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 4px 12px rgba(33, 150, 243, 0.3)',
                              }
                            }}>
                              <FlashOn sx={{ color: 'info.main', fontSize: 24, mb: 1 }} />
                              <Typography variant="h5" color="info.main" fontWeight="bold">
                                {drifter.base_energy || 375}
                              </Typography>
                              <Typography variant="body2" color="info.dark" fontWeight="medium">
                                Energy
                              </Typography>
                            </Card>
                          </Grid>
                          <Grid item xs={6} sm={4}>
                            <Card sx={{ 
                              p: 2, 
                              textAlign: 'center',
                              bgcolor: 'error.50',
                              border: '2px solid',
                              borderColor: 'error.main',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 4px 12px rgba(244, 67, 54, 0.3)',
                              }
                            }}>
                              <LocalFireDepartment sx={{ color: 'error.main', fontSize: 24, mb: 1 }} />
                              <Typography variant="h5" color="error.main" fontWeight="bold">
                                {drifter.base_damage || 82}
                              </Typography>
                              <Typography variant="body2" color="error.dark" fontWeight="medium">
                                Damage
                              </Typography>
                            </Card>
                          </Grid>
                          <Grid item xs={6} sm={4}>
                            <Card sx={{ 
                              p: 2, 
                              textAlign: 'center',
                              bgcolor: 'warning.50',
                              border: '2px solid',
                              borderColor: 'warning.main',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 4px 12px rgba(255, 152, 0, 0.3)',
                              }
                            }}>
                              <Shield sx={{ color: 'warning.main', fontSize: 24, mb: 1 }} />
                              <Typography variant="h5" color="warning.main" fontWeight="bold">
                                {drifter.base_defense || 52}
                              </Typography>
                              <Typography variant="body2" color="warning.dark" fontWeight="medium">
                                Defense
                              </Typography>
                            </Card>
                          </Grid>
                          <Grid item xs={6} sm={4}>
                            <Card sx={{ 
                              p: 2, 
                              textAlign: 'center',
                              bgcolor: 'secondary.50',
                              border: '2px solid',
                              borderColor: 'secondary.main',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 4px 12px rgba(156, 39, 176, 0.3)',
                              }
                            }}>
                              <Speed sx={{ color: 'secondary.main', fontSize: 24, mb: 1 }} />
                              <Typography variant="h5" color="secondary.main" fontWeight="bold">
                                75
                              </Typography>
                              <Typography variant="body2" color="secondary.dark" fontWeight="medium">
                                Speed
                              </Typography>
                            </Card>
                          </Grid>
                        </Grid>
                        <Box sx={{ textAlign: 'center' }}>
                          <Button 
                            variant="contained" 
                            color="primary" 
                            size="small"
                            sx={{
                              borderRadius: '20px',
                              px: 3,
                              py: 1,
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 4px 12px rgba(100, 181, 246, 0.4)',
                              }
                            }}
                          >
                            Change Drifter
                          </Button>
                        </Box>
                      </>
                    ) : (
                      <Box sx={{ textAlign: 'center', py: 4 }}>
                        <Typography variant="h6" color="text.secondary">
                          No Drifter Assigned
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Assign a drifter to this slot to manage their equipment
                        </Typography>
                        <Button variant="outlined" sx={{ mt: 2 }}>
                          Assign Drifter
                        </Button>
                      </Box>
                    )}
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>

          {/* Right Panel - Equipped Items and Game Items */}
          <Grid item xs={12} md={4}>
            <Stack spacing={3}>
              {/* Equipped Items Card */}
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">
                      Equipped Items:
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      5/9
                    </Typography>
                  </Box>
                  
                  {/* Equipped Items Grid */}
                  <Grid container spacing={2}>
                  {/* Main Equipment Slots */}
                  {[
                    { name: 'Luminous Ward', skill: 'Sanctum Arc', type: 'weapon', stats: '', rarity: 'epic', flavor: 'Forged in the Sanctum of Dawn' },
                    { name: 'Healer\'s Hood', skill: 'Swift Aid', type: 'helmet', stats: 'HP: +714', rarity: 'rare', flavor: 'Blessed by the Ancient Healers' },
                    { name: 'Cleansing Robe', skill: 'Purify', type: 'chest', stats: '', rarity: 'common', flavor: 'Woven with purifying threads' },
                    { name: 'Arcaneflow Boots', skill: 'Abundance', type: 'boots', stats: 'HP: +675', rarity: 'rare', flavor: 'Infused with mana currents' },
                    { name: 'Mass Healing Elixir', skill: 'Mass Healing Elixir', type: 'consumable', stats: '', rarity: 'common', isConsumable: true, flavor: 'A potent healing brew' }
                  ].map((item, index) => {
                    const rarityConfig = getRarityConfig(item.rarity);
                    
                    return (
                      <Grid item xs={6} key={index}>
                        <Tooltip 
                          title={
                            <Box>
                              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                                {item.name}
                              </Typography>
                              <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
                                {item.flavor}
                              </Typography>
                              {item.stats && (
                                <Typography variant="caption" sx={{ display: 'block', color: 'success.light' }}>
                                  {item.stats}
                                </Typography>
                              )}
                            </Box>
                          }
                          arrow
                          placement="top"
                        >
                          <Paper
                            sx={{
                              p: 2,
                              textAlign: 'center',
                              border: '2px solid',
                              borderColor: rarityConfig.border,
                              bgcolor: rarityConfig.bg,
                              cursor: 'pointer',
                              borderRadius: item.isConsumable ? '50%' : 2,
                              width: item.isConsumable ? 80 : 'auto',
                              height: item.isConsumable ? 80 : 'auto',
                              mx: 'auto',
                              transition: 'all 0.3s ease',
                              position: 'relative',
                              overflow: 'hidden',
                              '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: `linear-gradient(45deg, transparent 30%, ${rarityConfig.glow} 50%, transparent 70%)`,
                                transform: 'translateX(-100%)',
                                transition: 'transform 0.6s ease',
                              },
                              '&:hover': {
                                borderColor: rarityConfig.border,
                                bgcolor: rarityConfig.bg,
                                transform: 'translateY(-4px) scale(1.05)',
                                boxShadow: `0 8px 25px ${rarityConfig.glow}`,
                                '&::before': {
                                  transform: 'translateX(100%)',
                                },
                              },
                            }}
                          >
                            <Avatar sx={{ 
                              width: item.isConsumable ? 40 : 48, 
                              height: item.isConsumable ? 40 : 48, 
                              mx: 'auto', 
                              mb: 1,
                              bgcolor: rarityConfig.border,
                              boxShadow: `0 0 10px ${rarityConfig.glow}`,
                              position: 'relative',
                              zIndex: 1,
                            }}>
                              {getGearTypeIcon(item.type)}
                            </Avatar>
                            {!item.isConsumable && (
                              <>
                                <Typography 
                                  {...TYPOGRAPHY.body}
                                  sx={{ mb: 0.5, color: rarityConfig.text }}
                                >
                                  {item.name}
                                </Typography>
                                <Typography 
                                  {...TYPOGRAPHY.secondary}
                                  sx={{ display: 'block', mb: 0.5 }}
                                >
                                  {item.skill}
                                </Typography>
                                <Chip 
                                  label={item.type} 
                                  size="small" 
                                  color={getRarityColor(item.rarity)}
                                  variant="outlined"
                                  sx={{ mb: 0.5 }}
                                />
                                {item.stats && (
                                  <Typography 
                                    {...TYPOGRAPHY.caption}
                                    sx={{ display: 'block', fontWeight: 'bold', color: 'success.main' }}
                                  >
                                    {item.stats}
                                  </Typography>
                                )}
                              </>
                            )}
                          </Paper>
                        </Tooltip>
                      </Grid>
                    );
                  })}
                    
                    {/* Mod Slots */}
                    {[1, 2, 3, 4].map((modNum) => (
                      <Grid item xs={6} key={`mod-${modNum}`}>
                        <Tooltip 
                          title="Click to add a mod"
                          arrow
                          placement="top"
                        >
                          <Paper
                            sx={{
                              p: 2,
                              textAlign: 'center',
                              border: '2px dashed',
                              borderColor: 'grey.300',
                              borderRadius: '50%',
                              width: 80,
                              height: 80,
                              mx: 'auto',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                              position: 'relative',
                              animation: 'pulse 2s infinite',
                              '@keyframes pulse': {
                                '0%': {
                                  boxShadow: '0 0 0 0 rgba(100, 181, 246, 0.4)',
                                },
                                '70%': {
                                  boxShadow: '0 0 0 10px rgba(100, 181, 246, 0)',
                                },
                                '100%': {
                                  boxShadow: '0 0 0 0 rgba(100, 181, 246, 0)',
                                },
                              },
                              '&:hover': {
                                borderColor: 'primary.main',
                                bgcolor: 'primary.50',
                                transform: 'scale(1.1)',
                                boxShadow: '0 0 20px rgba(100, 181, 246, 0.4)',
                                animation: 'none',
                              },
                            }}
                          >
                            <Box sx={{ 
                              width: 40, 
                              height: 40, 
                              mx: 'auto', 
                              border: '2px solid',
                              borderColor: 'grey.400',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: 'radial-gradient(circle, rgba(100, 181, 246, 0.1) 0%, transparent 70%)',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                borderColor: 'primary.main',
                                background: 'radial-gradient(circle, rgba(100, 181, 246, 0.3) 0%, transparent 70%)',
                                boxShadow: '0 0 15px rgba(100, 181, 246, 0.6)',
                              }
                            }}>
                              <Add sx={{ 
                                color: 'grey.500',
                                fontSize: 20,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  color: 'primary.main',
                                  transform: 'rotate(90deg)',
                                }
                              }} />
                            </Box>
                            <Typography 
                              {...TYPOGRAPHY.caption}
                              sx={{ mt: 0.5, display: 'block' }}
                            >
                              Mod {modNum}
                            </Typography>
                          </Paper>
                        </Tooltip>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>

              {/* Game Items Card */}
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Game Items
                  </Typography>
                  
                  {/* Filters */}
                  <Stack spacing={2} sx={{ mb: 2 }}>
                    {/* Category Filter Chips */}
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                        Category:
                      </Typography>
                      <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                        {[
                          { value: 'all', label: 'All', icon: <FilterList />, color: 'default' },
                          { value: 'weapon', label: 'Weapon', icon: <LocalFireDepartment />, color: 'error' },
                          { value: 'helmet', label: 'Helmet', icon: <Person />, color: 'info' },
                          { value: 'chest', label: 'Chest', icon: <Shield />, color: 'warning' },
                          { value: 'boots', label: 'Boots', icon: <Speed />, color: 'secondary' },
                          { value: 'consumable', label: 'Consumable', icon: <Healing />, color: 'success' },
                          { value: 'mod', label: 'Mod', icon: <Add />, color: 'primary' },
                        ].map((category) => (
                          <Chip
                            key={category.value}
                            label={category.label}
                            icon={category.icon}
                            onClick={() => setFilterType(category.value)}
                            color={filterType === category.value ? category.color : 'default'}
                            variant={filterType === category.value ? 'filled' : 'outlined'}
                            sx={{
                              transition: 'all 0.3s ease',
                              fontWeight: filterType === category.value ? 600 : 400,
                              '&:hover': {
                                transform: 'translateY(-2px) scale(1.05)',
                                boxShadow: filterType === category.value 
                                  ? `0 6px 20px ${category.color === 'default' ? 'rgba(0, 0, 0, 0.2)' : `${category.color}.main`}40`
                                  : '0 4px 12px rgba(0, 0, 0, 0.15)',
                              },
                              '&.MuiChip-filled': {
                                boxShadow: `0 2px 8px ${category.color === 'default' ? 'rgba(0, 0, 0, 0.2)' : `${category.color}.main`}30`,
                              }
                            }}
                          />
                        ))}
                      </Stack>
                    </Box>
                    
                    {/* Rarity Filter Chips */}
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                        Rarity:
                      </Typography>
                      <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                        {[
                          { value: 'all', label: 'All', color: 'default', icon: '✨' },
                          { value: 'common', label: 'Common', color: 'default', icon: '⚪' },
                          { value: 'rare', label: 'Rare', color: 'info', icon: '🔵' },
                          { value: 'epic', label: 'Epic', color: 'secondary', icon: '🟣' },
                          { value: 'legendary', label: 'Legendary', color: 'warning', icon: '🟡' },
                        ].map((rarity) => (
                          <Chip
                            key={rarity.value}
                            label={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <span>{rarity.icon}</span>
                                {rarity.label}
                              </Box>
                            }
                            onClick={() => setFilterRarity(rarity.value)}
                            color={filterRarity === rarity.value ? rarity.color : 'default'}
                            variant={filterRarity === rarity.value ? 'filled' : 'outlined'}
                            sx={{
                              transition: 'all 0.3s ease',
                              fontWeight: filterRarity === rarity.value ? 600 : 400,
                              '&:hover': {
                                transform: 'translateY(-2px) scale(1.05)',
                                boxShadow: filterRarity === rarity.value 
                                  ? `0 6px 20px ${rarity.color === 'default' ? 'rgba(0, 0, 0, 0.2)' : `${rarity.color}.main`}40`
                                  : '0 4px 12px rgba(0, 0, 0, 0.15)',
                              },
                              '&.MuiChip-filled': {
                                boxShadow: `0 2px 8px ${rarity.color === 'default' ? 'rgba(0, 0, 0, 0.2)' : `${rarity.color}.main`}30`,
                              }
                            }}
                          />
                        ))}
                      </Stack>
                    </Box>
                    
                    {/* Search */}
                    <TextField
                      size="small"
                      placeholder="Search items..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      fullWidth
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '20px',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                          },
                          '&.Mui-focused': {
                            boxShadow: '0 4px 20px rgba(100, 181, 246, 0.3)',
                          }
                        }
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Search sx={{ color: 'text.secondary' }} />
                          </InputAdornment>
                        ),
                        endAdornment: searchTerm && (
                          <InputAdornment position="end">
                            <IconButton
                              size="small"
                              onClick={() => setSearchTerm('')}
                              sx={{ color: 'text.secondary' }}
                            >
                              <Close />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Stack>
                  
                  {/* Items List */}
                  <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
                    <List dense>
                      {filteredGear.map((gear) => (
                        <ListItemButton
                          key={gear.id}
                          onClick={() => handleGearClick(gear)}
                          sx={{
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 1,
                            mb: 1,
                            '&:hover': {
                              borderColor: 'primary.main',
                              bgcolor: 'action.hover',
                            },
                          }}
                        >
                          <ListItemIcon>
                            <Avatar sx={{ 
                              bgcolor: `${getRarityColor(gear.rarity)}.main`,
                              width: 32,
                              height: 32,
                            }}>
                              {getGearTypeIcon(gear.gear_type?.category)}
                            </Avatar>
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Box>
                                <Typography variant="body2" fontWeight="medium">
                                  {gear.base_name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {gear.skill_name} • {gear.gear_type?.category}
                                </Typography>
                              </Box>
                            }
                            secondary={
                              <Box sx={{ mt: 0.5 }}>
                                <Chip
                                  label={gear.rarity}
                                  color={getRarityColor(gear.rarity)}
                                  size="small"
                                  sx={{ mr: 1 }}
                                />
                                {gear.damage > 0 && (
                                  <Typography variant="caption" sx={{ mr: 1 }}>
                                    Damage: +{gear.damage}%
                                  </Typography>
                                )}
                                {gear.health_bonus > 0 && (
                                  <Typography variant="caption" sx={{ mr: 1 }}>
                                    HP: +{gear.health_bonus}
                                  </Typography>
                                )}
                                {gear.defense > 0 && (
                                  <Typography variant="caption">
                                    Defense: +{gear.defense}
                                  </Typography>
                                )}
                              </Box>
                            }
                          />
                          {equippedGear[gear.id] && (
                            <Chip
                              label="Equipped"
                              color="success"
                              size="small"
                              sx={{ ml: 1 }}
                            />
                          )}
                        </ListItemButton>
                      ))}
                    </List>
                  </Box>
                </CardContent>
              </Card>
            </Stack>
          </Grid>
        </Grid>

        {/* Gear Details Dialog */}
        <Dialog
          open={gearDialogOpen}
          onClose={() => setGearDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">
                {selectedGear?.name}
              </Typography>
              <IconButton onClick={() => setGearDialogOpen(false)}>
                <Close />
              </IconButton>
            </Stack>
          </DialogTitle>
          <DialogContent>
            {selectedGear && (
              <Stack spacing={2}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar sx={{ bgcolor: `${getRarityColor(selectedGear.rarity)}.main` }}>
                    {getGearTypeIcon(selectedGear.type)}
                  </Avatar>
                  <Box>
                    <Typography variant="h6">{selectedGear.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedGear.skill_name} • {selectedGear.type}
                    </Typography>
                  </Box>
                </Stack>
                
                <Divider />
                
                <Typography variant="body2">
                  {selectedGear.description || 'No description available'}
                </Typography>
                
                <Typography variant="subtitle2">Stats:</Typography>
                <Grid container spacing={1}>
                  {selectedGear.damage > 0 && (
                    <Grid item xs={6}>
                      <Typography variant="body2">
                        Damage: +{selectedGear.damage}%
                      </Typography>
                    </Grid>
                  )}
                  {selectedGear.defense > 0 && (
                    <Grid item xs={6}>
                      <Typography variant="body2">
                        Defense: +{selectedGear.defense}
                      </Typography>
                    </Grid>
                  )}
                  {selectedGear.health_bonus > 0 && (
                    <Grid item xs={6}>
                      <Typography variant="body2">
                        Health: +{selectedGear.health_bonus}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </Stack>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setGearDialogOpen(false)}>
              Close
            </Button>
            <Button variant="contained" color="primary">
              Equip Gear
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Layout>
  );
}
