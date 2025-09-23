import React, { useState } from 'react';
import { Box, Typography, Button, Paper, Avatar, Chip, IconButton, Tabs, Tab, Grid, Card, CardContent, TextField, InputAdornment, Stack, Divider, Badge, Alert, FormControl, Select, MenuItem, InputLabel, List, ListItem, ListItemText, ListItemIcon, ListItemButton, ListSubheader, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { ArrowBack, Add, Inventory2, Person, Search, Close, Edit, Check, Cancel, FilterList, LocalFireDepartment, Shield, Healing, Speed, FlashOn, MilitaryTech, Public, WorkspacePremium, Inventory, Security, Star, Diamond, AutoAwesome } from '@mui/icons-material';
import Layout from './Layout';

// Mock data
const mockPlayer = {
  id: 7,
  name: 'Charfire',
  discord_name: 'charfire#0',
  role: 'member',
  game_role: 'healer',
  character_level: 15,
  faction: 'Light',
  guild: { name: 'Violence2' },
  total_gear: 42,
  notes: 'Experienced healer with focus on support builds'
};

const mockDrifters = [
  {
    id: 1,
    name: 'Solenne',
    base_health: 315,
    base_energy: 375,
    base_damage: 82,
    base_defense: 52,
    base_speed: 75,
    equipped_count: 5,
    gear_slots: [
      { id: 1, gear_item: { name: 'Luminous Ward', base_name: 'Luminous Ward', skill_name: 'Sanctum Arc', rarity: 'epic', health_bonus: 0, icon_url: null, game_id: 'weapon_001' }, gear_type: { category: 'Weapon' } },
      { id: 2, gear_item: { name: 'Healer\'s Hood', base_name: 'Healer\'s Hood', skill_name: 'Swift Aid', rarity: 'rare', health_bonus: 714, icon_url: null, game_id: 'helmet_001' }, gear_type: { category: 'Helmet' } },
      { id: 3, gear_item: { name: 'Cleansing Robe', base_name: 'Cleansing Robe', skill_name: 'Purify', rarity: 'common', health_bonus: 0, icon_url: null, game_id: 'chest_001' }, gear_type: { category: 'Chest' } },
      { id: 4, gear_item: { name: 'Arcaneflow Boots', base_name: 'Arcaneflow Boots', skill_name: 'Abundance', rarity: 'rare', health_bonus: 675, icon_url: null, game_id: 'boots_001' }, gear_type: { category: 'Boots' } },
      { id: 5, gear_item: { name: 'Mass Healing Elixir', base_name: 'Mass Healing Elixir', skill_name: 'Mass Healing Elixir', rarity: 'common', health_bonus: 0, icon_url: null, game_id: 'consumable_001' }, gear_type: { category: 'Consumable' } },
      null, null, null, null // 4 empty mod slots
    ]
  },
  {
    id: 2,
    name: 'Drifter 2',
    base_health: 280,
    base_energy: 320,
    base_damage: 95,
    base_defense: 45,
    base_speed: 80,
    equipped_count: 3,
    gear_slots: [
      { id: 6, gear_item: { name: 'Thunder Hammer', base_name: 'Thunder Hammer', skill_name: 'Lightning Strike', rarity: 'epic', health_bonus: 0, icon_url: null, game_id: 'weapon_002' }, gear_type: { category: 'Weapon' } },
      null, null, null, null, null, null, null, null, null // 9 empty slots
    ]
  },
  {
    id: 3,
    name: 'Drifter 3',
    base_health: 250,
    base_energy: 400,
    base_damage: 70,
    base_defense: 60,
    base_speed: 65,
    equipped_count: 0,
    gear_slots: new Array(9).fill(null)
  }
];

const mockGearItems = [
  { id: 1, name: 'Luminous Ward', base_name: 'Luminous Ward', skill_name: 'Sanctum Arc', rarity: 'epic', gear_type: { category: 'weapon', name: 'Weapon' }, damage: 15, health_bonus: 0, armor: 0, magic_resistance: 0, icon_url: null, game_id: 'weapon_001' },
  { id: 2, name: 'Healer\'s Hood', base_name: 'Healer\'s Hood', skill_name: 'Swift Aid', rarity: 'rare', gear_type: { category: 'helmet', name: 'Helmet' }, damage: 0, health_bonus: 714, armor: 5, magic_resistance: 0, icon_url: null, game_id: 'helmet_001' },
  { id: 3, name: 'Cleansing Robe', base_name: 'Cleansing Robe', skill_name: 'Purify', rarity: 'common', gear_type: { category: 'chest', name: 'Chest' }, damage: 0, health_bonus: 0, armor: 3, magic_resistance: 2, icon_url: null, game_id: 'chest_001' },
  { id: 4, name: 'Arcaneflow Boots', base_name: 'Arcaneflow Boots', skill_name: 'Abundance', rarity: 'rare', gear_type: { category: 'boots', name: 'Boots' }, damage: 0, health_bonus: 675, armor: 2, magic_resistance: 0, icon_url: null, game_id: 'boots_001' },
  { id: 5, name: 'Mass Healing Elixir', base_name: 'Mass Healing Elixir', skill_name: 'Mass Healing Elixir', rarity: 'common', gear_type: { category: 'consumable', name: 'Consumable' }, damage: 0, health_bonus: 0, armor: 0, magic_resistance: 0, icon_url: null, game_id: 'consumable_001' },
  { id: 6, name: 'Thunder Hammer', base_name: 'Thunder Hammer', skill_name: 'Lightning Strike', rarity: 'epic', gear_type: { category: 'weapon', name: 'Weapon' }, damage: 25, health_bonus: 0, armor: 0, magic_resistance: 0, icon_url: null, game_id: 'weapon_002' },
  { id: 7, name: 'Shadow Dagger', base_name: 'Shadow Dagger', skill_name: 'Shadow Strike', rarity: 'rare', gear_type: { category: 'weapon', name: 'Weapon' }, damage: 20, health_bonus: 0, armor: 0, magic_resistance: 0, icon_url: null, game_id: 'weapon_003' },
  { id: 8, name: 'Mystic Orb', base_name: 'Mystic Orb', skill_name: 'Arcane Blast', rarity: 'legendary', gear_type: { category: 'weapon', name: 'Weapon' }, damage: 35, health_bonus: 0, armor: 0, magic_resistance: 0, icon_url: null, game_id: 'weapon_004' }
];

export default function LegacyPlayerLoadout() {
  const [activeDrifterTab, setActiveDrifterTab] = useState(0);
  const [activeItemTab, setActiveItemTab] = useState(0);
  const [activeAttributeTab, setActiveAttributeTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRarity, setFilterRarity] = useState('all');
  const [editingName, setEditingName] = useState(false);
  const [editName, setEditName] = useState(mockPlayer.name);
  const [skillModalOpen, setSkillModalOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState(null);

  const slotLabels = [
    'Weapon', 'Helmet', 'Chest', 'Boots', 'Consumable',
    'Mod 1', 'Mod 2', 'Mod 3', 'Mod 4'
  ];

  const handleDrifterTabChange = (event, newValue) => {
    setActiveDrifterTab(newValue);
  };

  const handleItemTabChange = (event, newValue) => {
    setActiveItemTab(newValue);
  };

  const handleAttributeTabChange = (event, newValue) => {
    setActiveAttributeTab(newValue);
  };

  const handleEditName = () => {
    setEditName(mockPlayer.name);
    setEditingName(true);
  };

  const handleSaveName = () => {
    // In real implementation, this would call an API
    setEditingName(false);
  };

  const handleCancelEdit = () => {
    setEditingName(false);
    setEditName(mockPlayer.name);
  };

  const showSkillModal = (skillName, description, gameId) => {
    setSelectedSkill({ skillName, description, gameId });
    setSkillModalOpen(true);
  };

  const closeSkillModal = () => {
    setSkillModalOpen(false);
    setSelectedSkill(null);
  };

  // Filter gear items
  const filteredGear = mockGearItems.filter(gear => {
    const matchesSearch = gear.base_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         gear.skill_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRarity = filterRarity === 'all' || gear.rarity === filterRarity;
    return matchesSearch && matchesRarity;
  });

  // Group gear by type
  const gearByType = {
    weapon: mockGearItems.filter(item => item.gear_type.category === 'weapon'),
    helmet: mockGearItems.filter(item => item.gear_type.category === 'helmet'),
    chest: mockGearItems.filter(item => item.gear_type.category === 'chest'),
    boots: mockGearItems.filter(item => item.gear_type.category === 'boots'),
    consumable: mockGearItems.filter(item => item.gear_type.category === 'consumable'),
    mod: mockGearItems.filter(item => item.gear_type.category === 'mod')
  };

  const currentDrifter = mockDrifters[activeDrifterTab];

  return (
    <Layout>
      <Box sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        color: '#ffffff',
        p: 2.5
      }}>
        {/* Container with 3 panels */}
        <Box sx={{
          display: { xs: 'block', md: 'grid' },
          gridTemplateColumns: { md: '3fr 5fr 6fr' },  // ≈ 25% / 35% / 40%
          gap: 2.5,
          minHeight: 'calc(100vh - 40px)'
        }}>
          {/* LEFT PANEL - Player Info */}
          <Box sx={{
            minWidth: 0,          // allow panel to shrink inside grid/flex
            overflow: 'hidden',   // prevent children from bleeding out
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: 2,
            p: 2.5,
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>

            {/* Player Header */}
            <Box sx={{ textAlign: 'center', mb: 3, pb: 2.5, borderBottom: '2px solid rgba(255, 255, 255, 0.1)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
                {editingName ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TextField
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      size="small"
                      variant="outlined"
                      sx={{ 
                        '& .MuiOutlinedInput-root': {
                          color: 'white',
                          '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                          '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                          '&.Mui-focused fieldset': { borderColor: '#64b5f6' }
                        }
                      }}
                    />
                    <IconButton onClick={handleSaveName} color="primary" size="small">
                      <Check />
                    </IconButton>
                    <IconButton onClick={handleCancelEdit} size="small">
                      <Cancel />
                    </IconButton>
                  </Box>
                ) : (
                  <>
                    <Typography variant="h4" sx={{
                      color: '#64b5f6',
                      fontSize: '2.5rem',
                      fontWeight: 'bold',
                      textShadow: '0 0 20px rgba(100, 181, 246, 0.5)',
                      display: 'inline-block'
                    }}>
                      {mockPlayer.name}
                    </Typography>
                    <IconButton onClick={handleEditName} size="small" sx={{ color: '#888', fontSize: '0.6em' }}>
                      <Edit />
                    </IconButton>
                  </>
                )}
              </Box>
              <Typography variant="h6" sx={{ color: '#b0bec5', fontSize: '1.1rem' }}>
                Player Loadout
              </Typography>
            </Box>

            {/* Player Info */}
            <Box sx={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: 1.25,
              p: 1.875,
              mb: 2.5
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, pb: 0.625, borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <Typography sx={{ color: '#90caf9', fontWeight: 600 }}>Discord:</Typography>
                <Typography sx={{ color: '#ffffff' }}>{mockPlayer.discord_name}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, pb: 0.625, borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <Typography sx={{ color: '#90caf9', fontWeight: 600 }}>Guild:</Typography>
                <Typography sx={{ color: '#ffffff' }}>{mockPlayer.guild.name}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, pb: 0.625, borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <Typography sx={{ color: '#90caf9', fontWeight: 600 }}>Level:</Typography>
                <Typography sx={{ color: '#ffffff' }}>{mockPlayer.character_level}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, pb: 0.625, borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <Typography sx={{ color: '#90caf9', fontWeight: 600 }}>Faction:</Typography>
                <Typography sx={{ color: '#ffffff' }}>{mockPlayer.faction}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, pb: 0.625, borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <Typography sx={{ color: '#90caf9', fontWeight: 600 }}>Guild Rank:</Typography>
                <Typography sx={{ color: '#ffffff' }}>{mockPlayer.role}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, pb: 0.625, borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <Typography sx={{ color: '#90caf9', fontWeight: 600 }}>Role:</Typography>
                <Typography sx={{ color: '#ffffff' }}>{mockPlayer.game_role}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, pb: 0.625, borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <Typography sx={{ color: '#90caf9', fontWeight: 600 }}>Total Gear:</Typography>
                <Typography sx={{ color: '#ffffff' }}>{mockPlayer.total_gear}</Typography>
              </Box>
            </Box>

            {/* Notes */}
            {mockPlayer.notes && (
              <Box sx={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: 1.25,
                p: 1.875
              }}>
                <Typography sx={{ color: '#90caf9', fontWeight: 600, mb: 1 }}>Notes:</Typography>
                <Typography sx={{ color: '#ffffff', mt: 1 }}>{mockPlayer.notes}</Typography>
              </Box>
            )}
          </Box>

          {/* MIDDLE PANEL - Drifter Loadouts */}
          <Box sx={{
            minWidth: 0,          // allow panel to shrink inside grid/flex
            overflow: 'hidden',   // prevent children from bleeding out
            position: 'relative',
            zIndex: 1,
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: 2,
            p: 2.5,
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <Typography variant="h6" sx={{
              color: '#64b5f6',
              fontSize: '1.2rem',
              fontWeight: 600,
              mb: 2.5,
              textAlign: 'center',
              borderBottom: '2px solid rgba(100, 181, 246, 0.3)',
              pb: 1.25
            }}>
              Drifter Loadouts
            </Typography>

            {/* Drifter Tabs */}
            <Box sx={{
              display: 'flex',
              mb: 2.5,
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: 1.25,
              p: 0.625
            }}>
              {mockDrifters.map((drifter, index) => (
                <Button
                  key={index}
                  onClick={() => setActiveDrifterTab(index)}
                  sx={{
                    flex: 1,
                    p: '12px 20px',
                    textAlign: 'center',
                    background: activeDrifterTab === index ? 'rgba(100, 181, 246, 0.2)' : 'transparent',
                    color: activeDrifterTab === index ? '#64b5f6' : '#b0bec5',
                    borderRadius: 1,
                    transition: 'all 0.3s ease',
                    fontWeight: 600,
                    boxShadow: activeDrifterTab === index ? '0 0 15px rgba(100, 181, 246, 0.3)' : 'none',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: '#ffffff'
                    }
                  }}
                >
                  {drifter.name}
                </Button>
              ))}
            </Box>

            {/* Drifter Content */}
            {currentDrifter && (
              <Box>
                {/* Drifter Stats */}
                <Box sx={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: 1.25,
                  p: 1.875,
                  mb: 2.5
                }}>
                  <Typography sx={{
                    color: '#ffffff',
                    fontSize: '1.2rem',
                    fontWeight: 600,
                    mb: 1.875,
                    textAlign: 'center',
                    borderBottom: '2px solid rgba(100, 181, 246, 0.3)',
                    pb: 1.25
                  }}>
                    Basic stats of the drifter
                  </Typography>
                  
                  <Grid container spacing={1.25}>
                    <Grid item xs={6}>
                      <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        p: '8px 12px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: 0.75,
                        borderLeft: '3px solid #64b5f6'
                      }}>
                        <Typography sx={{ color: '#90caf9', fontSize: '0.9rem' }}>Health</Typography>
                        <Typography sx={{ color: '#ffffff', fontWeight: 600 }}>{currentDrifter.base_health}</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        p: '8px 12px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: 0.75,
                        borderLeft: '3px solid #64b5f6'
                      }}>
                        <Typography sx={{ color: '#90caf9', fontSize: '0.9rem' }}>Energy</Typography>
                        <Typography sx={{ color: '#ffffff', fontWeight: 600 }}>{currentDrifter.base_energy}</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        p: '8px 12px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: 0.75,
                        borderLeft: '3px solid #64b5f6'
                      }}>
                        <Typography sx={{ color: '#90caf9', fontSize: '0.9rem' }}>Damage</Typography>
                        <Typography sx={{ color: '#ffffff', fontWeight: 600 }}>{currentDrifter.base_damage}</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        p: '8px 12px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: 0.75,
                        borderLeft: '3px solid #64b5f6'
                      }}>
                        <Typography sx={{ color: '#90caf9', fontSize: '0.9rem' }}>Defense</Typography>
                        <Typography sx={{ color: '#ffffff', fontWeight: 600 }}>{currentDrifter.base_defense}</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        p: '8px 12px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: 0.75,
                        borderLeft: '3px solid #64b5f6'
                      }}>
                        <Typography sx={{ color: '#90caf9', fontSize: '0.9rem' }}>Speed</Typography>
                        <Typography sx={{ color: '#ffffff', fontWeight: 600 }}>{currentDrifter.base_speed}</Typography>
                      </Box>
                    </Grid>
                  </Grid>

                  <Box sx={{ textAlign: 'center', mt: 1.875 }}>
                    <Button
                      variant="contained"
                      sx={{
                        background: 'linear-gradient(135deg, #64b5f6, #42a5f5)',
                        color: 'white',
                        border: 'none',
                        p: '10px 20px',
                        borderRadius: 1,
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 15px rgba(100, 181, 246, 0.3)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #42a5f5, #1e88e5)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 6px 20px rgba(100, 181, 246, 0.4)'
                        }
                      }}
                    >
                      Change Drifter
                    </Button>
                  </Box>
                </Box>

                {/* Equipped Items Count */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.25, pb: 0.625, borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <Typography sx={{ color: '#90caf9', fontWeight: 600 }}>Equipped Items:</Typography>
                  <Typography sx={{ color: '#ffffff' }}>{currentDrifter.equipped_count}/9</Typography>
                </Box>

                {/* Gear Slots */}
                <Box sx={{ mb: 2 }}>
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                      gap: 1.25,
                      width: '100%',
                      alignContent: 'start'
                    }}
                  >
                    {slotLabels.map((label, i) => {
                      const gear = currentDrifter.gear_slots[i];
                      return (
                        <Box
                          key={i}
                          sx={{
                            width: '100%',
                            minWidth: 0,          // allow shrinking inside grid
                            boxSizing: 'border-box',
                            aspectRatio: '1',
                            background: gear ? 'rgba(76, 175, 80, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                            border: gear ? '2px solid #4caf50' : '2px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative',
                            transition: 'all 0.3s ease',
                            cursor: 'pointer',
                            p: 1,
                            boxShadow: gear ? '0 0 15px rgba(76, 175, 80, 0.3)' : 'none',
                            '&:hover': {
                              transform: 'translateY(-2px)',
                              boxShadow: gear ? '0 0 20px rgba(76, 175, 80, 0.4)' : '0 4px 12px rgba(0, 0, 0, 0.3)'
                            }
                          }}
                        >
                          {gear ? (
                            <>
                              <Box
                                sx={{
                                  width: { xs: 56, sm: 64, md: 80 },
                                  height: { xs: 56, sm: 64, md: 80 },
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  mb: 1
                                }}
                              >
                                <Avatar
                                  sx={{
                                    width: { xs: 40, sm: 48, md: 56 },
                                    height: { xs: 40, sm: 48, md: 56 },
                                    bgcolor: 'rgba(255, 255, 255, 0.1)'
                                  }}
                                >
                                  <Inventory2 />
                                </Avatar>
                              </Box>

                              <Typography
                                sx={{
                                  fontSize: '0.8rem',
                                  color: '#ffffff',
                                  fontWeight: 600,
                                  textAlign: 'center',
                                  mb: 0.375,
                                  lineHeight: 1.1,
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  maxWidth: '100%'
                                }}
                              >
                                {gear.gear_item.base_name}
                              </Typography>

                              {gear.gear_item.skill_name && (
                                <Typography
                                  sx={{
                                    fontSize: '0.7rem',
                                    color: '#64b5f6',
                                    fontStyle: 'italic',
                                    textAlign: 'center',
                                    mb: 0.375,
                                    lineHeight: 1.1,
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    maxWidth: '100%',
                                    cursor: 'pointer',
                                    borderBottom: '1px dotted #64b5f6',
                                    transition: 'color 0.2s ease',
                                    '&:hover': { color: '#90caf9', borderBottomColor: '#90caf9' }
                                  }}
                                  onClick={() =>
                                    showSkillModal(gear.gear_item.skill_name, 'No description available', gear.gear_item.game_id)
                                  }
                                >
                                  {gear.gear_item.skill_name}
                                </Typography>
                              )}

                              {gear.gear_item.health_bonus > 0 && (
                                <Typography sx={{ fontSize: '0.7rem', color: '#4caf50', textAlign: 'center', lineHeight: 1.1 }}>
                                  HP: +{gear.gear_item.health_bonus}
                                </Typography>
                              )}

                              <Typography
                                sx={{
                                  position: 'absolute',
                                  bottom: 8,               // avoid bleeding outside the square
                                  left: '50%',
                                  transform: 'translateX(-50%)',
                                  fontSize: '0.7rem',
                                  color: '#b0bec5',
                                  whiteSpace: 'nowrap'
                                }}
                              >
                                {gear.gear_type.category}
                              </Typography>
                            </>
                          ) : (
                            <>
                              <Typography sx={{ fontSize: '20px', opacity: 0.3, mb: 1 }}>⚪</Typography>
                              <Typography
                                sx={{
                                  position: 'absolute',
                                  bottom: 8,
                                  left: '50%',
                                  transform: 'translateX(-50%)',
                                  fontSize: '0.7rem',
                                  color: '#b0bec5',
                                  whiteSpace: 'nowrap'
                                }}
                              >
                                {label}
                              </Typography>
                            </>
                          )}
                        </Box>
                      );
                    })}
                  </Box>
                </Box>
              </Box>
            )}
          </Box>

          {/* RIGHT PANEL - Game Items */}
          <Box sx={{
            minWidth: 0,          // allow panel to shrink inside grid/flex
            overflow: 'hidden',   // prevent children from bleeding out
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: 2,
            p: 2.5,
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            height: { xs: 'auto', md: 'calc(100vh - 40px)' }
          }}>
            <Typography variant="h6" sx={{
              color: '#64b5f6',
              fontSize: '1.2rem',
              fontWeight: 600,
              mb: 2.5,
              textAlign: 'center',
              borderBottom: '2px solid rgba(100, 181, 246, 0.3)',
              pb: 1.25
            }}>
              Game Items
            </Typography>

            {/* Item Type Tabs */}
            <Box sx={{
              display: 'flex',
              mb: 2.5,
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: 1.25,
              p: 0.625
            }}>
              {Object.keys(gearByType).map((category, index) => (
                <Button
                  key={category}
                  onClick={() => setActiveItemTab(index)}
                  sx={{
                    flex: 1,
                    p: '12px 20px',
                    textAlign: 'center',
                    background: activeItemTab === index ? 'rgba(100, 181, 246, 0.2)' : 'transparent',
                    color: activeItemTab === index ? '#64b5f6' : '#b0bec5',
                    borderRadius: 1,
                    transition: 'all 0.3s ease',
                    fontWeight: 600,
                    boxShadow: activeItemTab === index ? '0 0 15px rgba(100, 181, 246, 0.3)' : 'none',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: '#ffffff'
                    }
                  }}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)} ({gearByType[category].length})
                </Button>
              ))}
            </Box>

            {/* Search and Filters */}
            <Box sx={{ mb: 2.5 }}>
              <TextField
                fullWidth
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '2px solid rgba(100, 181, 246, 0.3)',
                    borderRadius: 1,
                    color: 'white',
                    '&:hover': {
                      borderColor: 'rgba(100, 181, 246, 0.6)',
                      background: 'rgba(255, 255, 255, 0.15)'
                    },
                    '&.Mui-focused': {
                      borderColor: '#64b5f6',
                      background: 'rgba(255, 255, 255, 0.15)',
                      boxShadow: '0 0 10px rgba(100, 181, 246, 0.3)'
                    }
                  },
                  '& .MuiInputBase-input::placeholder': {
                    color: 'rgba(255, 255, 255, 0.6)'
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: 'rgba(255, 255, 255, 0.6)' }} />
                    </InputAdornment>
                  )
                }}
              />

              {/* Rarity Filters */}
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {['all', 'common', 'rare', 'epic', 'legendary'].map((rarity) => (
                  <Button
                    key={rarity}
                    onClick={() => setFilterRarity(rarity)}
                    sx={{
                      p: '8px 16px',
                      border: '2px solid rgba(100, 181, 246, 0.3)',
                      borderRadius: 0.75,
                      background: filterRarity === rarity ? '#64b5f6' : 'rgba(30, 30, 30, 0.8)',
                      color: filterRarity === rarity ? 'white' : '#64b5f6',
                      cursor: 'pointer',
                      fontSize: '12px',
                      transition: 'all 0.3s ease',
                      whiteSpace: 'nowrap',
                      textTransform: 'capitalize',
                      '&:hover': {
                        background: filterRarity === rarity ? '#64b5f6' : 'rgba(100, 181, 246, 0.1)',
                        borderColor: '#64b5f6'
                      }
                    }}
                  >
                    {rarity}
                  </Button>
                ))}
              </Box>
            </Box>

            {/* Items Grid */}
            <Box sx={{
              flex: 1,
              overflowY: 'auto',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: 1.25,
              p: '10px 0',
              alignContent: 'start'
            }}>
              {filteredGear.map((item) => (
                <Box
                  key={item.id}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    p: 1.25,
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: 1,
                    mb: 1,
                    transition: 'all 0.3s ease',
                    borderLeft: '3px solid transparent',
                    cursor: 'default',
                    position: 'relative',
                    border: '2px solid transparent',
                    aspectRatio: '1',
                    textAlign: 'center',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.15)',
                      transform: 'scale(1.02)',
                      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)'
                    }
                  }}
                >
                  <Box sx={{
                    width: 60,
                    height: 60,
                    mb: 0.75,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Avatar sx={{ width: 60, height: 60, bgcolor: 'rgba(255, 255, 255, 0.1)' }}>
                      <Inventory2 />
                    </Avatar>
                  </Box>
                  
                  <Box sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%'
                  }}>
                    <Typography sx={{
                      color: '#ffffff',
                      fontWeight: 600,
                      mb: 0.25
                    }}>
                      {item.base_name}
                    </Typography>
                    
                    {item.skill_name && (
                      <Typography sx={{
                        fontSize: '0.85rem',
                        color: '#64b5f6',
                        fontStyle: 'italic',
                        mb: 0.5
                      }}>
                        {item.skill_name}
                      </Typography>
                    )}
                    
                    <Typography sx={{
                      color: '#90caf9',
                      fontSize: '0.9rem',
                      mb: 0.25
                    }}>
                      {item.gear_type.name} • {item.rarity.charAt(0).toUpperCase() + item.rarity.slice(1)}
                    </Typography>
                    
                    <Box sx={{ mb: 0.5 }}>
                      {item.damage > 0 && (
                        <Typography sx={{ color: '#b0bec5', fontSize: '0.8rem', mb: 0.25 }}>
                          Damage & Heal bonus: {item.damage}%
                        </Typography>
                      )}
                      {item.health_bonus > 0 && (
                        <Typography sx={{ color: '#b0bec5', fontSize: '0.8rem', mb: 0.25 }}>
                          HP: {item.health_bonus}
                        </Typography>
                      )}
                      {item.armor > 0 && (
                        <Typography sx={{ color: '#b0bec5', fontSize: '0.8rem', mb: 0.25 }}>
                          Armor: {item.armor}
                        </Typography>
                      )}
                      {item.magic_resistance > 0 && (
                        <Typography sx={{ color: '#b0bec5', fontSize: '0.8rem' }}>
                          Magic resistance: {item.magic_resistance}
                        </Typography>
                      )}
                    </Box>
                    
                    <Button
                      variant="contained"
                      size="small"
                      sx={{
                        background: '#4caf50',
                        color: 'white',
                        p: '4px 8px',
                        borderRadius: 0.5,
                        cursor: 'pointer',
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          background: '#45a049'
                        }
                      }}
                    >
                      Equip
                    </Button>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

        {/* Skill Modal */}
        <Dialog
          open={skillModalOpen}
          onClose={closeSkillModal}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              background: 'linear-gradient(135deg, #1e293b, #334155)',
              border: '2px solid #64b5f6',
              borderRadius: 1.5,
              color: 'white'
            }
          }}
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <Box sx={{
                width: 48,
                height: 48,
                borderRadius: 1,
                background: '#475569',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px'
              }}>
                ⚔️
              </Box>
              <Typography variant="h6" sx={{ color: '#ffffff', fontSize: '1.2rem', fontWeight: 600, margin: 0 }}>
                {selectedSkill?.skillName || 'Unknown Skill'}
              </Typography>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Typography sx={{ color: '#e2e8f0', fontSize: '0.9rem', lineHeight: 1.5, margin: 0 }}>
              {selectedSkill?.description || 'No description available'}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={closeSkillModal}
              sx={{
                position: 'absolute',
                top: 12,
                right: 12,
                background: 'none',
                border: 'none',
                color: '#94a3b8',
                fontSize: '1.5rem',
                cursor: 'pointer',
                p: 0.5,
                borderRadius: 0.5,
                transition: 'all 0.2s ease',
                '&:hover': {
                  color: '#ffffff',
                  background: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              ×
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Layout>
  );
}
