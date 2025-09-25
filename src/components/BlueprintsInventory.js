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

const BlueprintsInventory = () => {
  const [blueprints, setBlueprints] = useState([]);
  const [craftedItems, setCraftedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ show: false, message: '', type: 'success' });
  const [addBlueprintDialog, setAddBlueprintDialog] = useState(false);
  const [addCraftedDialog, setAddCraftedDialog] = useState(false);
  const [selectedTab, setSelectedTab] = useState('blueprints');

  // Form states
  const [blueprintForm, setBlueprintForm] = useState({
    item_name: '',
    player_name: '',
    quantity: 1
  });
  const [craftedForm, setCraftedForm] = useState({
    item_name: '',
    player_name: ''
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
      // For now, using mock data
      setBlueprints([]);
      setCraftedItems([]);
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
      // TODO: Implement API call to add blueprint
      console.log('Adding blueprint:', blueprintForm);
      showAlert('Blueprint added successfully', 'success');
      setAddBlueprintDialog(false);
      setBlueprintForm({ item_name: '', player_name: '', quantity: 1 });
      fetchData();
    } catch (error) {
      console.error('Error adding blueprint:', error);
      showAlert('Error adding blueprint', 'error');
    }
  };

  const handleAddCrafted = async () => {
    try {
      // TODO: Implement API call to add crafted item
      console.log('Adding crafted item:', craftedForm);
      showAlert('Crafted item added successfully', 'success');
      setAddCraftedDialog(false);
      setCraftedForm({ item_name: '', player_name: '' });
      fetchData();
    } catch (error) {
      console.error('Error adding crafted item:', error);
      showAlert('Error adding crafted item', 'error');
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

  const handleDeleteCrafted = async (id) => {
    if (window.confirm('Are you sure you want to delete this crafted item?')) {
      try {
        // TODO: Implement API call to delete crafted item
        console.log('Deleting crafted item:', id);
        showAlert('Crafted item deleted successfully', 'success');
        fetchData();
      } catch (error) {
        console.error('Error deleting crafted item:', error);
        showAlert('Error deleting crafted item', 'error');
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
          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setAddBlueprintDialog(true)}
              sx={{ bgcolor: '#4a9eff', '&:hover': { bgcolor: '#357abd' } }}
            >
              Add Blueprint
            </Button>
            <Button
              variant="outlined"
              startIcon={<BuildIcon />}
              onClick={() => setAddCraftedDialog(true)}
              sx={{ 
                borderColor: '#9c27b0', 
                color: '#9c27b0',
                '&:hover': { borderColor: '#7b1fa2', bgcolor: 'rgba(156, 39, 176, 0.1)' }
              }}
            >
              Add Crafted
            </Button>
          </Stack>
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
              variant={selectedTab === 'blueprints' ? 'contained' : 'outlined'}
              onClick={() => setSelectedTab('blueprints')}
              startIcon={<InventoryIcon />}
            >
              Legendary Blueprints
            </Button>
            <Button
              variant={selectedTab === 'crafted' ? 'contained' : 'outlined'}
              onClick={() => setSelectedTab('crafted')}
              startIcon={<BuildIcon />}
            >
              Crafted Items
            </Button>
          </Stack>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Blueprints Table */}
        {selectedTab === 'blueprints' && (
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <InventoryIcon />
                Legendary Blueprints Inventory
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Track how many legendary blueprints each player has. Blueprints are consumed when used to craft, but 5 blueprints allow free crafting.
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
                              {blueprint.player_name}
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

        {/* Crafted Items Table */}
        {selectedTab === 'crafted' && (
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <BuildIcon />
                Crafted Legendary Items
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Players who have successfully crafted legendary items. No limit on how many items a player can craft.
              </Typography>
              
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Item</TableCell>
                      <TableCell>Player</TableCell>
                      <TableCell>Crafted Date</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {craftedItems.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                          <Typography variant="body2" color="text.secondary">
                            No crafted items found. Add crafted items to track player achievements.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      craftedItems.map((crafted) => (
                        <TableRow key={crafted.id}>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Avatar
                                src={getItemIcon(crafted.item_name)}
                                sx={{ width: 32, height: 32 }}
                              />
                              <Typography variant="body2" fontWeight="medium">
                                {crafted.item_name}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {crafted.player_name}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary">
                              {crafted.crafted_date || 'N/A'}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Stack direction="row" spacing={1} justifyContent="center">
                              <Tooltip title="View Details">
                                <IconButton size="small" color="primary">
                                  <ViewIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete">
                                <IconButton 
                                  size="small" 
                                  color="error"
                                  onClick={() => handleDeleteCrafted(crafted.id)}
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
              
              <TextField
                fullWidth
                label="Player Name"
                value={blueprintForm.player_name}
                onChange={(e) => setBlueprintForm({ ...blueprintForm, player_name: e.target.value })}
                required
              />
              
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
              disabled={!blueprintForm.item_name || !blueprintForm.player_name}
              sx={{ bgcolor: '#4a9eff', '&:hover': { bgcolor: '#357abd' } }}
            >
              Add Blueprint
            </Button>
          </DialogActions>
        </Dialog>

        {/* Add Crafted Item Dialog */}
        <Dialog open={addCraftedDialog} onClose={() => setAddCraftedDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Add Crafted Legendary Item</DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 1 }}>
              <FormControl fullWidth>
                <InputLabel>Item Name</InputLabel>
                <Select
                  value={craftedForm.item_name}
                  onChange={(e) => setCraftedForm({ ...craftedForm, item_name: e.target.value })}
                  label="Item Name"
                >
                  {legendaryItems.map((item) => (
                    <MenuItem key={item} value={item}>
                      {item}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <TextField
                fullWidth
                label="Player Name"
                value={craftedForm.player_name}
                onChange={(e) => setCraftedForm({ ...craftedForm, player_name: e.target.value })}
                required
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAddCraftedDialog(false)} startIcon={<CancelIcon />}>
              Cancel
            </Button>
            <Button
              onClick={handleAddCrafted}
              variant="contained"
              startIcon={<SaveIcon />}
              disabled={!craftedForm.item_name || !craftedForm.player_name}
              sx={{ bgcolor: '#9c27b0', '&:hover': { bgcolor: '#7b1fa2' } }}
            >
              Add Crafted Item
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Layout>
  );
};

export default BlueprintsInventory;
