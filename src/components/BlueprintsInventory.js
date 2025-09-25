import React, { useState, useEffect } from 'react';
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
  Paper,
  Chip,
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Stack,
  Divider,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Build as BuildIcon,
  Inventory as InventoryIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import Layout from './Layout';
import { apiService } from '../services/api';

const BlueprintsInventory = () => {
  const [blueprints, setBlueprints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ show: false, message: '', type: 'success' });
  const [addBlueprintDialog, setAddBlueprintDialog] = useState(false);
  const [selectedTab, setSelectedTab] = useState('inventory');
  const [showEmptyItems, setShowEmptyItems] = useState(false);
  const [guildMembers, setGuildMembers] = useState([]);

  // Form states
  const [blueprintForm, setBlueprintForm] = useState({
    item_name: '',
    player_id: '',
    quantity: 1
  });

  // Legendary items list
  const legendaryItems = [
    'Judicator', 'Sovereigns Radiance', 'Voideye', 'Prismcloak', 'Wreckingsaw', 'Wingblade',
    'Abyssal Conduit', 'Thunderlords Wrath', 'Menders Ruin', 'Eclypse Bow', 'Corrosive Piercer',
    'Phantom Spear', 'Spirits Call', 'Sanctuary of Growth', 'Bloodthirst', 'Scarlet Hunger',
    'Solarflare', 'Molten Mortar', 'Glacier Spark', 'Frosts Caller', 'Necromist', 'Withermaul',
    'Celestial Redeemer', 'Sol Protector', 'Stormveil Mask', 'Wardens Gaze', 'Ironwill Veil',
    'Folly Helm', 'Sanctum Shroud', 'Twilight Mantle', 'Wardens Shell', 'Magsurge Armor',
    'Rangers Hide', 'Heros Embrace', 'Warding Shroud', 'Dreadcloak', 'Impact Heavy Boots',
    'Avalanche Boots', 'Evasion Striders', 'Exodrift Slippers', 'Phantomstep Boots', 'Savagefoot Boots'
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API calls
      // const blueprintsData = await apiService.getBlueprints();
      // setBlueprints(blueprintsData);
      
      // Fetch guild members for the dropdown
      try {
        const membersData = await apiService.getGuildMembers();
        setGuildMembers(Array.isArray(membersData) ? membersData : []);
      } catch (membersError) {
        console.error('Error fetching guild members:', membersError);
        setGuildMembers([]);
      }
      
      // For now, using mock data
      setBlueprints([]);
    } catch (error) {
      console.error('Error fetching data:', error);
      showAlert('Error fetching data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (message, type = 'success') => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: 'success' }), 5000);
  };

  const handleAddBlueprint = async () => {
    try {
      if (!blueprintForm.item_name || !blueprintForm.player_id || !blueprintForm.quantity) {
        showAlert('Please fill in all fields', 'error');
        return;
      }

      // TODO: Implement API call to add blueprint
      console.log('Adding blueprint:', blueprintForm);
      showAlert('Blueprint added successfully', 'success');
      setAddBlueprintDialog(false);
      setBlueprintForm({ item_name: '', player_id: '', quantity: 1 });
      fetchData();
    } catch (error) {
      console.error('Error adding blueprint:', error);
      showAlert('Error adding blueprint', 'error');
    }
  };

  const handleDeleteBlueprint = async (id) => {
    if (window.confirm('Are you sure you want to delete this blueprint?')) {
      try {
        // TODO: Implement API call to delete blueprint
        console.log('Deleting blueprint:', id);
        showAlert('Blueprint deleted successfully', 'success');
        fetchData();
      } catch (error) {
        console.error('Error deleting blueprint:', error);
        showAlert('Error deleting blueprint', 'error');
      }
    }
  };

  const getItemIcon = (itemName) => {
    // TODO: Implement proper icon mapping based on item type
    return '/static/icons/placeholder.png';
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography>Loading blueprints inventory...</Typography>
      </Box>
    );
  }

  return (
    <Layout>
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <InventoryIcon />
            Blueprints Inventory
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setAddBlueprintDialog(true)}
            sx={{ bgcolor: '#4a9eff', '&:hover': { bgcolor: '#357abd' } }}
          >
            Add Blueprint
          </Button>
        </Box>

        {/* Alert */}
        {alert.show && (
          <Alert severity={alert.type} sx={{ mb: 2 }} onClose={() => setAlert({ show: false, message: '', type: 'success' })}>
            {alert.message}
          </Alert>
        )}

        {/* Tab Navigation */}
        <Box sx={{ mb: 3 }}>
          <Stack direction="row" spacing={1}>
            <Button
              variant={selectedTab === 'inventory' ? 'contained' : 'outlined'}
              onClick={() => setSelectedTab('inventory')}
              startIcon={<InventoryIcon />}
            >
              Blueprint Inventory
            </Button>
            <Button
              variant={selectedTab === 'crafters' ? 'contained' : 'outlined'}
              onClick={() => setSelectedTab('crafters')}
              startIcon={<BuildIcon />}
            >
              Who Can Craft
            </Button>
          </Stack>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Blueprints Inventory Table */}
        {selectedTab === 'inventory' && (
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <InventoryIcon />
                Blueprint Inventory
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Track individual legendary blueprints owned by each player. Players with 5+ blueprints can craft for free, others consume blueprints when crafting.
              </Typography>
              
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Item</TableCell>
                      <TableCell>Player</TableCell>
                      <TableCell>Quantity</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {blueprints.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                          <Typography variant="body2" color="text.secondary">
                            No blueprints found. Add some blueprints to get started.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      blueprints.map((blueprint) => (
                        <TableRow key={blueprint.id}>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Avatar
                                src={getItemIcon(blueprint.item_name)}
                                sx={{ width: 32, height: 32 }}
                              />
                              <Typography variant="body2" fontWeight="medium">
                                {blueprint.item_name}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {Array.isArray(guildMembers) ? 
                                guildMembers.find(m => m.id === blueprint.player_id)?.discord_name || 'Unknown Player' :
                                'Loading...'
                              }
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={blueprint.quantity} 
                              color={blueprint.quantity >= 5 ? 'success' : 'primary'}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={blueprint.quantity >= 5 ? 'Can Craft Free' : 'Needs More'}
                              color={blueprint.quantity >= 5 ? 'success' : 'warning'}
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Stack direction="row" spacing={1} justifyContent="center">
                              <Tooltip title="Edit">
                                <IconButton size="small" color="primary">
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete">
                                <IconButton 
                                  size="small" 
                                  color="error"
                                  onClick={() => handleDeleteBlueprint(blueprint.id)}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        )}

        {/* Who Can Craft Table */}
        {selectedTab === 'crafters' && (
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <BuildIcon />
                  Who Can Craft
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Show empty items:
                  </Typography>
                  <Button
                    variant={showEmptyItems ? 'contained' : 'outlined'}
                    size="small"
                    onClick={() => setShowEmptyItems(!showEmptyItems)}
                    sx={{ minWidth: 'auto', px: 1 }}
                  >
                    {showEmptyItems ? 'Hide' : 'Show'}
                  </Button>
                </Box>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Players who can craft legendary items. Green = Free crafting (5+ blueprints), Orange = Consumes blueprint (1-4 blueprints).
                {!showEmptyItems && (() => {
                  const emptyItemsCount = legendaryItems.filter(item => {
                    const itemBlueprints = blueprints.filter(bp => bp.item_name === item);
                    return itemBlueprints.length === 0;
                  }).length;
                  return emptyItemsCount > 0 ? ` (${emptyItemsCount} items with no blueprints are hidden)` : '';
                })()}
              </Typography>
              
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Item</TableCell>
                      <TableCell>Players Who Can Craft</TableCell>
                      <TableCell>Total Crafters</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {legendaryItems
                      .map((item) => {
                        // TODO: Replace with actual data from API
                        const itemBlueprints = blueprints.filter(bp => bp.item_name === item);
                        const freeCrafters = itemBlueprints.filter(bp => bp.quantity >= 5);
                        const consumeCrafters = itemBlueprints.filter(bp => bp.quantity > 0 && bp.quantity < 5);
                        
                        return { item, itemBlueprints, freeCrafters, consumeCrafters };
                      })
                      .filter(({ itemBlueprints }) => showEmptyItems || itemBlueprints.length > 0)
                      .map(({ item, itemBlueprints, freeCrafters, consumeCrafters }) => (
                        <TableRow key={item}>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Avatar
                                src={getItemIcon(item)}
                                sx={{ width: 32, height: 32 }}
                              />
                              <Typography variant="body2" fontWeight="medium">
                                {item}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Stack spacing={1}>
                              {freeCrafters.length > 0 && (
                                <Box>
                                  <Typography variant="caption" color="success.main" fontWeight="bold">
                                    Free Crafting ({freeCrafters.length}):
                                  </Typography>
                                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                                    {freeCrafters.map((bp) => (
                                      <Chip
                                        key={bp.id}
                                        label={Array.isArray(guildMembers) ? 
                                          guildMembers.find(m => m.id === bp.player_id)?.discord_name || 'Unknown Player' :
                                          'Loading...'
                                        }
                                        color="success"
                                        size="small"
                                        variant="outlined"
                                      />
                                    ))}
                                  </Box>
                                </Box>
                              )}
                              {consumeCrafters.length > 0 && (
                                <Box>
                                  <Typography variant="caption" color="warning.main" fontWeight="bold">
                                    Consumes Blueprint ({consumeCrafters.length}):
                                  </Typography>
                                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                                    {consumeCrafters.map((bp) => (
                                      <Chip
                                        key={bp.id}
                                        label={`${Array.isArray(guildMembers) ? 
                                          guildMembers.find(m => m.id === bp.player_id)?.discord_name || 'Unknown Player' :
                                          'Loading...'
                                        } (${bp.quantity})`}
                                        color="warning"
                                        size="small"
                                        variant="outlined"
                                      />
                                    ))}
                                  </Box>
                                </Box>
                              )}
                              {itemBlueprints.length === 0 && (
                                <Typography variant="body2" color="text.secondary">
                                  No one can craft this item yet
                                </Typography>
                              )}
                            </Stack>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={itemBlueprints.length} 
                              color={itemBlueprints.length > 0 ? 'primary' : 'default'}
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        )}

        {/* Add Blueprint Dialog */}
        <Dialog open={addBlueprintDialog} onClose={() => setAddBlueprintDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Add Legendary Blueprint</DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 1 }}>
              <FormControl fullWidth>
                <InputLabel>Item Name</InputLabel>
                <Select
                  value={blueprintForm.item_name}
                  onChange={(e) => setBlueprintForm({ ...blueprintForm, item_name: e.target.value })}
                  label="Item Name"
                >
                  {legendaryItems.map((item) => (
                    <MenuItem key={item} value={item}>
                      {item}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <FormControl fullWidth required>
                <InputLabel>Player</InputLabel>
                <Select
                  value={blueprintForm.player_id}
                  onChange={(e) => setBlueprintForm({ ...blueprintForm, player_id: e.target.value })}
                  label="Player"
                >
                  {Array.isArray(guildMembers) && guildMembers.length > 0 ? (
                    guildMembers.map((member) => (
                      <MenuItem key={member.id} value={member.id}>
                        {member.discord_name || member.username}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>
                      {loading ? 'Loading members...' : 'No members found'}
                    </MenuItem>
                  )}
                </Select>
              </FormControl>
              
              <TextField
                fullWidth
                label="Quantity"
                type="number"
                value={blueprintForm.quantity}
                onChange={(e) => setBlueprintForm({ ...blueprintForm, quantity: parseInt(e.target.value) || 1 })}
                inputProps={{ min: 1, max: 100 }}
                helperText="Number of blueprints this player has"
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAddBlueprintDialog(false)} startIcon={<CancelIcon />}>
              Cancel
            </Button>
            <Button
              onClick={handleAddBlueprint}
              variant="contained"
              startIcon={<SaveIcon />}
              disabled={!blueprintForm.item_name || !blueprintForm.player_id}
              sx={{ bgcolor: '#4a9eff', '&:hover': { bgcolor: '#357abd' } }}
            >
              Add Blueprint
            </Button>
          </DialogActions>
        </Dialog>

      </Box>
    </Layout>
  );
};

export default BlueprintsInventory;
