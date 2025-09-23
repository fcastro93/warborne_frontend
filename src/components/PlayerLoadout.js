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
} from '@mui/icons-material';
import Layout from './Layout';
import { apiService } from '../services/api';

// Helper functions for styling
const getRarityColor = (rarity) => {
  switch (rarity?.toLowerCase()) {
    case 'common': return 'default';
    case 'uncommon': return 'success';
    case 'rare': return 'info';
    case 'epic': return 'warning';
    case 'legendary': return 'error';
    default: return 'default';
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
      <Box sx={{ p: 3 }}>
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

        {/* Player Information Panel */}
        <Card sx={{ mb: 3, bgcolor: 'grey.900' }}>
          <CardContent>
            <Stack spacing={1}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
                <Typography variant="body2" color="text.secondary">Discord:</Typography>
                <Typography variant="body2" fontWeight="medium">{player?.discord_name || 'N/A'}</Typography>
              </Box>
              <Divider />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
                <Typography variant="body2" color="text.secondary">Guild:</Typography>
                <Typography variant="body2" fontWeight="medium">Violence2</Typography>
              </Box>
              <Divider />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
                <Typography variant="body2" color="text.secondary">Level:</Typography>
                <Typography variant="body2" fontWeight="medium">{player?.level || 'N/A'}</Typography>
              </Box>
              <Divider />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
                <Typography variant="body2" color="text.secondary">Faction:</Typography>
                <Typography variant="body2" fontWeight="medium">{player?.faction || 'N/A'}</Typography>
              </Box>
              <Divider />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
                <Typography variant="body2" color="text.secondary">Role:</Typography>
                <Typography variant="body2" fontWeight="medium">{player?.role || 'N/A'}</Typography>
              </Box>
              <Divider />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
                <Typography variant="body2" color="text.secondary">Total Gear:</Typography>
                <Typography variant="body2" fontWeight="medium">{gearItems?.length || 0}</Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        <Grid container spacing={3}>
          {/* Left Panel - Drifter Loadouts */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Drifter Loadouts
                </Typography>
                
                <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 2 }}>
                  {drifters.map((drifter, index) => (
                    <Tab
                      key={index}
                      label={drifter.name || `Drifter ${index + 1}`}
                      sx={{ textTransform: 'none' }}
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
                        {/* Basic Stats */}
                        <Paper sx={{ p: 3, mb: 3, bgcolor: 'grey.50' }}>
                          <Typography variant="h6" sx={{ mb: 2 }}>
                            Basic stats of the drifter
                          </Typography>
                          <Grid container spacing={3}>
                            <Grid item xs={6} sm={4}>
                              <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="h4" color="primary" fontWeight="bold">
                                  {drifter.base_health || 315}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  Health
                                </Typography>
                              </Box>
                            </Grid>
                            <Grid item xs={6} sm={4}>
                              <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="h4" color="primary" fontWeight="bold">
                                  {drifter.base_energy || 375}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  Energy
                                </Typography>
                              </Box>
                            </Grid>
                            <Grid item xs={6} sm={4}>
                              <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="h4" color="primary" fontWeight="bold">
                                  {drifter.base_damage || 82}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  Damage
                                </Typography>
                              </Box>
                            </Grid>
                            <Grid item xs={6} sm={4}>
                              <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="h4" color="primary" fontWeight="bold">
                                  {drifter.base_defense || 52}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  Defense
                                </Typography>
                              </Box>
                            </Grid>
                            <Grid item xs={6} sm={4}>
                              <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="h4" color="primary" fontWeight="bold">
                                  75
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  Speed
                                </Typography>
                              </Box>
                            </Grid>
                          </Grid>
                          <Box sx={{ mt: 2, textAlign: 'center' }}>
                            <Button variant="contained" color="primary">
                              Change Drifter
                            </Button>
                          </Box>
                        </Paper>
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

          {/* Right Panel - Equipped Items */}
          <Grid item xs={12} md={4}>
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
                    { name: 'Luminous Ward', skill: 'Sanctum Arc', type: 'weapon', stats: '' },
                    { name: 'Healer\'s Hood', skill: 'Swift Aid', type: 'helmet', stats: 'HP: +714' },
                    { name: 'Cleansing Robe', skill: 'Purify', type: 'chest', stats: '' },
                    { name: 'Arcaneflow Boots', skill: 'Abundance', type: 'boots', stats: 'HP: +675' },
                    { name: 'Mass Healing Elixir', skill: 'Mass Healing Elixir', type: 'consumable', stats: '' }
                  ].map((item, index) => (
                    <Grid item xs={6} key={index}>
                      <Paper
                        sx={{
                          p: 2,
                          textAlign: 'center',
                          border: '2px solid',
                          borderColor: 'success.main',
                          bgcolor: 'success.50',
                          cursor: 'pointer',
                          '&:hover': {
                            borderColor: 'success.dark',
                            bgcolor: 'success.100',
                          },
                        }}
                      >
                        <Avatar sx={{ 
                          width: 48, 
                          height: 48, 
                          mx: 'auto', 
                          mb: 1,
                          bgcolor: 'primary.main'
                        }}>
                          {getGearTypeIcon(item.type)}
                        </Avatar>
                        <Typography variant="body2" fontWeight="medium" sx={{ mb: 0.5 }}>
                          {item.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                          {item.skill}
                        </Typography>
                        <Chip 
                          label={item.type} 
                          size="small" 
                          color="primary" 
                          variant="outlined"
                          sx={{ mb: 0.5 }}
                        />
                        {item.stats && (
                          <Typography variant="caption" color="success.main" sx={{ display: 'block' }}>
                            {item.stats}
                          </Typography>
                        )}
                      </Paper>
                    </Grid>
                  ))}
                  
                  {/* Mod Slots */}
                  {[1, 2, 3, 4].map((modNum) => (
                    <Grid item xs={6} key={`mod-${modNum}`}>
                      <Paper
                        sx={{
                          p: 2,
                          textAlign: 'center',
                          border: '2px dashed',
                          borderColor: 'grey.300',
                          cursor: 'pointer',
                          '&:hover': {
                            borderColor: 'primary.main',
                            bgcolor: 'primary.50',
                          },
                        }}
                      >
                        <Box sx={{ 
                          width: 48, 
                          height: 48, 
                          mx: 'auto', 
                          mb: 1,
                          border: '2px solid',
                          borderColor: 'grey.300',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <Typography variant="h6" color="text.secondary">
                            ⚪
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          Mod {modNum}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Bottom Panel - Game Items */}
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Game Items
                </Typography>
                
                {/* Filters */}
                <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                  {/* Category Filter */}
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Category</InputLabel>
                    <Select
                      value={filterType}
                      label="Category"
                      onChange={(e) => setFilterType(e.target.value)}
                    >
                      <MenuItem value="all">All</MenuItem>
                      <MenuItem value="weapon">Weapon</MenuItem>
                      <MenuItem value="helmet">Helmet</MenuItem>
                      <MenuItem value="chest">Chest</MenuItem>
                      <MenuItem value="boots">Boots</MenuItem>
                      <MenuItem value="consumable">Consumable</MenuItem>
                      <MenuItem value="mod">Mod</MenuItem>
                    </Select>
                  </FormControl>
                  
                  {/* Rarity Filter */}
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Rarity</InputLabel>
                    <Select
                      value={filterRarity}
                      label="Rarity"
                      onChange={(e) => setFilterRarity(e.target.value)}
                    >
                      <MenuItem value="all">All</MenuItem>
                      <MenuItem value="common">Common</MenuItem>
                      <MenuItem value="rare">Rare</MenuItem>
                      <MenuItem value="epic">Epic</MenuItem>
                      <MenuItem value="legendary">Legendary</MenuItem>
                    </Select>
                  </FormControl>
                  
                  {/* Search */}
                  <TextField
                    size="small"
                    placeholder="Search items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ minWidth: 200 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search />
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
