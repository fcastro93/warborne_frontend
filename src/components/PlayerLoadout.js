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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlayerData();
  }, [playerId]);

  const fetchPlayerData = async () => {
    try {
      // Fetch player data
      const playerData = await apiService.getPlayer(playerId);
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
    const matchesSearch = gear.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         gear.skill_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || gear.type === filterType;
    return matchesSearch && matchesType;
  });

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
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600, mb: 1 }}>
            {player.name} - Loadout
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage gear and equipment for your drifters
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Left Panel - Drifter Tabs */}
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
                      icon={drifter.name ? <Person /> : <Add />}
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
                        {/* Drifter Stats */}
                        <Paper sx={{ p: 2, mb: 3, bgcolor: 'grey.50' }}>
                          <Typography variant="h6" sx={{ mb: 2 }}>
                            {drifter.name} Stats
                          </Typography>
                          <Grid container spacing={2}>
                            <Grid item xs={6} sm={3}>
                              <Typography variant="body2" color="text.secondary">
                                Health
                              </Typography>
                              <Typography variant="h6">
                                {drifter.base_health || 100}
                              </Typography>
                            </Grid>
                            <Grid item xs={6} sm={3}>
                              <Typography variant="body2" color="text.secondary">
                                Energy
                              </Typography>
                              <Typography variant="h6">
                                {drifter.base_energy || 100}
                              </Typography>
                            </Grid>
                            <Grid item xs={6} sm={3}>
                              <Typography variant="body2" color="text.secondary">
                                Damage
                              </Typography>
                              <Typography variant="h6">
                                {drifter.base_damage || 50}
                              </Typography>
                            </Grid>
                            <Grid item xs={6} sm={3}>
                              <Typography variant="body2" color="text.secondary">
                                Defense
                              </Typography>
                              <Typography variant="h6">
                                {drifter.base_defense || 25}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Paper>

                        {/* Gear Slots */}
                        <Typography variant="h6" sx={{ mb: 2 }}>
                          Equipment Slots
                        </Typography>
                        <Grid container spacing={2}>
                          {/* Main Gear Slots */}
                          {['Weapon', 'Helmet', 'Chest', 'Boots', 'Consumable'].map((slot, slotIndex) => (
                            <Grid item xs={6} sm={4} md={2.4} key={slot}>
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
                                <Typography variant="body2" color="text.secondary">
                                  {slot}
                                </Typography>
                                <Typography variant="caption">
                                  Empty Slot
                                </Typography>
                              </Paper>
                            </Grid>
                          ))}
                          
                          {/* Mod Slots */}
                          {[1, 2, 3, 4].map((modNum) => (
                            <Grid item xs={6} sm={4} md={2.4} key={`mod-${modNum}`}>
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
                                <Typography variant="body2" color="text.secondary">
                                  Mod {modNum}
                                </Typography>
                                <Typography variant="caption">
                                  Empty Slot
                                </Typography>
                              </Paper>
                            </Grid>
                          ))}
                        </Grid>
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

          {/* Right Panel - Inventory */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Inventory
                </Typography>
                
                {/* Search and Filter */}
                <TextField
                  fullWidth
                  placeholder="Search gear..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 2 }}
                />

                {/* Gear List */}
                <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
                  {filteredGear.map((gear) => (
                    <Paper
                      key={gear.id}
                      sx={{
                        p: 2,
                        mb: 1,
                        cursor: 'pointer',
                        '&:hover': {
                          bgcolor: 'primary.50',
                        },
                      }}
                      onClick={() => handleGearClick(gear)}
                    >
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar sx={{ bgcolor: `${getRarityColor(gear.rarity)}.main` }}>
                          {getGearTypeIcon(gear.type)}
                        </Avatar>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            {gear.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {gear.skill_name} • {gear.type}
                          </Typography>
                        </Box>
                        <Chip
                          icon={getRarityIcon(gear.rarity)}
                          label={gear.rarity}
                          color={getRarityColor(gear.rarity)}
                          size="small"
                        />
                      </Stack>
                    </Paper>
                  ))}
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
