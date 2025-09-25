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
  Visibility as ViewIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import Layout from './Layout';
import { apiService } from '../services/api';

const BlueprintsInventory = () => {
  const [blueprints, setBlueprints] = useState([]);
  const [crafters, setCrafters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ show: false, message: '', type: 'success' });
  const [addBlueprintDialog, setAddBlueprintDialog] = useState(false);
  const [addCrafterDialog, setAddCrafterDialog] = useState(false);
  const [selectedTab, setSelectedTab] = useState('inventory');
  const [showEmptyItems, setShowEmptyItems] = useState(false);
  const [showEmptyInventoryItems, setShowEmptyInventoryItems] = useState(false);
  const [guildMembers, setGuildMembers] = useState([]);
  const [searchInventory, setSearchInventory] = useState('');
  const [searchCrafters, setSearchCrafters] = useState('');

  // Form states
  const [blueprintForm, setBlueprintForm] = useState({
    item_name: '',
    player_id: '',
    quantity: 1
  });

  const [crafterForm, setCrafterForm] = useState({
    item_name: '',
    player_id: ''
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
      
      // Fetch guild members for the dropdown
      try {
        const membersData = await apiService.getGuildMembers();
        console.log('Raw members data:', membersData);
        // Handle nested structure: { members: [...] }
        const members = membersData?.members || membersData;
        console.log('Processed members:', members);
        setGuildMembers(Array.isArray(members) ? members : []);
      } catch (membersError) {
        console.error('Error fetching guild members:', membersError);
        setGuildMembers([]);
      }
      
      // Fetch blueprints data
      try {
        const response = await fetch('/api/blueprints/', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log('Blueprints data:', data);
          setBlueprints(data.blueprints || []);
        } else {
          console.error('Failed to fetch blueprints:', response.status);
          setBlueprints([]);
        }
      } catch (blueprintError) {
        console.error('Error fetching blueprints:', blueprintError);
        setBlueprints([]);
      }

      // Fetch crafters data
      try {
        const response = await fetch('/api/crafters/', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log('Crafters data:', data);
          setCrafters(data.crafters || []);
        } else {
          console.error('Failed to fetch crafters:', response.status);
          setCrafters([]);
        }
      } catch (crafterError) {
        console.error('Error fetching crafters:', crafterError);
        setCrafters([]);
      }
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

      const selectedPlayer = guildMembers.find(m => m.id === parseInt(blueprintForm.player_id));
      if (!selectedPlayer) {
        showAlert('Selected player not found', 'error');
        return;
      }

      const response = await fetch('/api/blueprints/create/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json',
          'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]')?.value || ''
        },
        credentials: 'include',
        body: JSON.stringify({
          item_name: blueprintForm.item_name,
          player_name: selectedPlayer.discord_name,
          quantity: parseInt(blueprintForm.quantity)
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Blueprint created/updated:', data);
        showAlert(data.message || 'Blueprint added successfully', 'success');
        setAddBlueprintDialog(false);
        setBlueprintForm({ item_name: '', player_id: '', quantity: 1 });
        fetchData();
      } else {
        const errorData = await response.json();
        showAlert(errorData.error || 'Failed to add blueprint', 'error');
      }
    } catch (error) {
      console.error('Error adding blueprint:', error);
      showAlert('Error adding blueprint', 'error');
    }
  };

  const handleDeleteBlueprint = async (id) => {
    if (window.confirm('Are you sure you want to delete this blueprint?')) {
      try {
        const response = await fetch(`/api/blueprints/${id}/delete/`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            'Content-Type': 'application/json',
            'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]')?.value || ''
          },
          credentials: 'include'
        });

        if (response.ok) {
          const data = await response.json();
          showAlert(data.message || 'Blueprint deleted successfully', 'success');
          fetchData();
        } else {
          const errorData = await response.json();
          showAlert(errorData.error || 'Failed to delete blueprint', 'error');
        }
      } catch (error) {
        console.error('Error deleting blueprint:', error);
        showAlert('Error deleting blueprint', 'error');
      }
    }
  };

  const handleAddCrafter = async () => {
    try {
      if (!crafterForm.item_name || !crafterForm.player_id) {
        showAlert('Please fill in all fields', 'error');
        return;
      }

      const selectedPlayer = guildMembers.find(m => m.id === parseInt(crafterForm.player_id));
      if (!selectedPlayer) {
        showAlert('Selected player not found', 'error');
        return;
      }

      const response = await fetch('/api/crafters/create/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json',
          'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]')?.value || ''
        },
        credentials: 'include',
        body: JSON.stringify({
          item_name: crafterForm.item_name,
          player_name: selectedPlayer.discord_name
        })
      });

      if (response.ok) {
        const data = await response.json();
        showAlert(data.message || 'Crafter added successfully', 'success');
        setAddCrafterDialog(false);
        setCrafterForm({ item_name: '', player_id: '' });
        fetchData();
      } else {
        const errorData = await response.json();
        showAlert(errorData.error || 'Failed to add crafter', 'error');
      }
    } catch (error) {
      console.error('Error adding crafter:', error);
      showAlert('Error adding crafter', 'error');
    }
  };

  const handleDeleteCrafter = async (id) => {
    if (window.confirm('Are you sure you want to remove this crafter?')) {
      try {
        const response = await fetch(`/api/crafters/${id}/delete/`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            'Content-Type': 'application/json',
            'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]')?.value || ''
          },
          credentials: 'include'
        });

        if (response.ok) {
          const data = await response.json();
          showAlert(data.message || 'Crafter removed successfully', 'success');
          fetchData();
        } else {
          const errorData = await response.json();
          showAlert(errorData.error || 'Failed to remove crafter', 'error');
        }
      } catch (error) {
        console.error('Error deleting crafter:', error);
        showAlert('Error deleting crafter', 'error');
      }
    }
  };

  const getItemIcon = (itemName) => {
    // TODO: Implement proper icon mapping based on item type
    return '/static/icons/placeholder.png';
  };

  const getPlayerDisplayName = (playerId) => {
    if (!Array.isArray(guildMembers)) return 'Loading...';
    const member = guildMembers.find(m => m.id === playerId);
    if (!member) return 'Unknown Player';
    return (member.discord_name || member.name || 'Unknown Player')?.replace('#0', '');
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
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <InventoryIcon />
                  Blueprint Inventory
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Show empty items:
                  </Typography>
                  <Button
                    variant={showEmptyInventoryItems ? 'contained' : 'outlined'}
                    size="small"
                    onClick={() => setShowEmptyInventoryItems(!showEmptyInventoryItems)}
                    sx={{ minWidth: 'auto', px: 1 }}
                  >
                    {showEmptyInventoryItems ? 'Hide' : 'Show'}
                  </Button>
                </Box>
              </Box>
              
              {/* Search Box */}
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <TextField
                  fullWidth
                  placeholder="Search items by name..."
                  value={searchInventory}
                  onChange={(e) => setSearchInventory(e.target.value)}
                  InputProps={{
                    startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
                  }}
                />
                {searchInventory && (
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setSearchInventory('')}
                    sx={{ minWidth: 'auto', px: 2 }}
                  >
                    Clear
                  </Button>
                )}
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Track legendary blueprints by item. Each item shows all players who have blueprints for it. Players with 5+ blueprints can craft for free.
                {!showEmptyInventoryItems && (() => {
                  const emptyItemsCount = legendaryItems.filter(item => {
                    const itemBlueprints = blueprints.filter(bp => bp.item_name === item);
                    return itemBlueprints.length === 0;
                  }).length;
                  return emptyItemsCount > 0 ? ` (${emptyItemsCount} items with no blueprints are hidden)` : '';
                })()}
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {legendaryItems
                  .filter((item) => {
                    const itemBlueprints = blueprints.filter(bp => bp.item_name === item);
                    const hasBlueprints = itemBlueprints.length > 0;
                    const matchesSearch = searchInventory === '' || 
                      item.toLowerCase().includes(searchInventory.toLowerCase());
                    return (showEmptyInventoryItems || hasBlueprints) && matchesSearch;
                  })
                  .map((item) => {
                    const itemBlueprints = blueprints.filter(bp => bp.item_name === item);
                    
                    return (
                      <Card key={item} variant="outlined">
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                            <Avatar
                              src={getItemIcon(item)}
                              sx={{ width: 40, height: 40 }}
                            />
                            <Typography variant="h6">{item}</Typography>
                            <Chip 
                              label={itemBlueprints.length > 0 ? 
                                `${itemBlueprints.length} player${itemBlueprints.length > 1 ? 's' : ''}` : 
                                'No blueprints'
                              }
                              size="small"
                              color={itemBlueprints.length > 0 ? 'primary' : 'default'}
                            />
                          </Box>
                          
                          {itemBlueprints.length > 0 ? (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                              {itemBlueprints.map((blueprint) => (
                                <Chip
                                  key={blueprint.id}
                                  label={`${getPlayerDisplayName(blueprint.player_id)}: ${blueprint.quantity}`}
                                  color={blueprint.quantity >= 5 ? 'success' : 'warning'}
                                  variant="outlined"
                                  onDelete={() => handleDeleteBlueprint(blueprint.id)}
                                  deleteIcon={<DeleteIcon />}
                                />
                              ))}
                            </Box>
                          ) : (
                            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                              No players have blueprints for this item yet.
                            </Typography>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                
                {legendaryItems.filter(item => {
                  const itemBlueprints = blueprints.filter(bp => bp.item_name === item);
                  const hasBlueprints = itemBlueprints.length > 0;
                  const matchesSearch = searchInventory === '' || 
                    item.toLowerCase().includes(searchInventory.toLowerCase());
                  return (showEmptyInventoryItems || hasBlueprints) && matchesSearch;
                }).length === 0 && (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      {searchInventory ? 
                        `No items found matching "${searchInventory}". Try a different search term.` :
                        'No blueprints found. Add some blueprints to get started.'
                      }
                    </Typography>
                  </Box>
                )}
              </Box>
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
              
              {/* Search Box */}
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <TextField
                  fullWidth
                  placeholder="Search items by name..."
                  value={searchCrafters}
                  onChange={(e) => setSearchCrafters(e.target.value)}
                  InputProps={{
                    startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
                  }}
                />
                {searchCrafters && (
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setSearchCrafters('')}
                    sx={{ minWidth: 'auto', px: 2 }}
                  >
                    Clear
                  </Button>
                )}
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Legendary items and their designated crafters. Crafters can craft these items for the guild.
                {!showEmptyItems && (() => {
                  const emptyItemsCount = legendaryItems.filter(item => {
                    const itemCrafters = crafters.filter(c => c.item_name === item);
                    return itemCrafters.length === 0;
                  }).length;
                  return emptyItemsCount > 0 ? ` (${emptyItemsCount} items with no crafters are hidden)` : '';
                })()}
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {legendaryItems
                  .filter((item) => {
                    const itemCrafters = crafters.filter(c => c.item_name === item);
                    const hasCrafters = itemCrafters.length > 0;
                    const matchesSearch = searchCrafters === '' || 
                      item.toLowerCase().includes(searchCrafters.toLowerCase());
                    return (showEmptyItems || hasCrafters) && matchesSearch;
                  })
                  .map((item) => {
                    const itemCrafters = crafters.filter(c => c.item_name === item);
                    
                    return (
                      <Card key={item} variant="outlined">
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Avatar
                                src={getItemIcon(item)}
                                sx={{ width: 40, height: 40 }}
                              />
                              <Typography variant="h6">{item}</Typography>
                              <Chip 
                                label={itemCrafters.length > 0 ? 
                                  `${itemCrafters.length} crafter${itemCrafters.length > 1 ? 's' : ''}` : 
                                  'No crafters'
                                }
                                size="small"
                                color={itemCrafters.length > 0 ? 'success' : 'default'}
                              />
                            </Box>
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<BuildIcon />}
                              onClick={() => {
                                setCrafterForm({ ...crafterForm, item_name: item });
                                setAddCrafterDialog(true);
                              }}
                              sx={{ minWidth: 'auto' }}
                            >
                              Add Crafter
                            </Button>
                          </Box>
                          
                          {itemCrafters.length > 0 ? (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                              {itemCrafters.map((crafter) => (
                                <Chip
                                  key={crafter.id}
                                  label={getPlayerDisplayName(crafter.player_id)}
                                  color="success"
                                  variant="outlined"
                                  onDelete={() => handleDeleteCrafter(crafter.id)}
                                  deleteIcon={<DeleteIcon />}
                                />
                              ))}
                            </Box>
                          ) : (
                            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                              No crafters assigned for this item yet. Click "Add Crafter" to assign someone.
                            </Typography>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                
                {legendaryItems.filter(item => {
                  const itemCrafters = crafters.filter(c => c.item_name === item);
                  const hasCrafters = itemCrafters.length > 0;
                  const matchesSearch = searchCrafters === '' || 
                    item.toLowerCase().includes(searchCrafters.toLowerCase());
                  return (showEmptyItems || hasCrafters) && matchesSearch;
                }).length === 0 && (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      {searchCrafters ? 
                        `No items found matching "${searchCrafters}". Try a different search term.` :
                        'No crafters found. Assign some crafters to get started.'
                      }
                    </Typography>
                  </Box>
                )}
              </Box>
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
                        {(member.discord_name || member.name)?.replace('#0', '')}
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

        {/* Add Crafter Dialog */}
        <Dialog open={addCrafterDialog} onClose={() => setAddCrafterDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <BuildIcon />
              Add Crafter
            </Box>
          </DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 2 }}>
              <FormControl fullWidth required>
                <InputLabel>Item</InputLabel>
                <Select
                  value={crafterForm.item_name}
                  onChange={(e) => setCrafterForm({ ...crafterForm, item_name: e.target.value })}
                  label="Item"
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
                  value={crafterForm.player_id}
                  onChange={(e) => setCrafterForm({ ...crafterForm, player_id: e.target.value })}
                  label="Player"
                >
                  {Array.isArray(guildMembers) && guildMembers.length > 0 ? (
                    guildMembers.map((member) => (
                      <MenuItem key={member.id} value={member.id}>
                        {(member.discord_name || member.name)?.replace('#0', '')}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>
                      {loading ? 'Loading members...' : 'No members found'}
                    </MenuItem>
                  )}
                </Select>
              </FormControl>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setAddCrafterDialog(false)}
              startIcon={<CancelIcon />}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddCrafter}
              variant="contained"
              startIcon={<BuildIcon />}
              disabled={!crafterForm.item_name || !crafterForm.player_id}
              sx={{ bgcolor: '#4a9eff', '&:hover': { bgcolor: '#357abd' } }}
            >
              Add Crafter
            </Button>
          </DialogActions>
        </Dialog>

      </Box>
    </Layout>
  );
};

export default BlueprintsInventory;
