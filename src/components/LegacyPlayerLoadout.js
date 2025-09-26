import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Box, Typography, Button, Paper, Avatar, Chip, IconButton, Tabs, Tab, Grid, Card, CardContent, TextField, InputAdornment, Stack, Divider, Badge, Alert, FormControl, Select, MenuItem, InputLabel, List, ListItem, ListItemText, ListItemIcon, ListItemButton, ListSubheader, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { ArrowBack, Add, Inventory2, Person, Search, Close, Edit, Check, Cancel, FilterList, LocalFireDepartment, Shield, Healing, Speed, FlashOn, MilitaryTech, Public, WorkspacePremium, Inventory, Security, Star, Diamond, AutoAwesome } from '@mui/icons-material';
import Layout from './Layout';
import { apiService } from '../services/api';

// Tier options for gear power calculation
const TIER_OPTIONS = [
  { value: 'I', label: 'Tier I', power: 20, description: 'Base power: 20' },
  { value: 'II', label: 'Tier II', power: 40, description: 'Base power: 40' },
  { value: 'III', label: 'Tier III', power: 70, description: 'Base power: 70' },
  { value: 'IV', label: 'Tier IV', power: 90, description: 'Base power: 90' },
  { value: 'V', label: 'Tier V', power: 110, description: 'Base power: 110' },
  { value: 'VI', label: 'Tier VI', power: 130, description: 'Base power: 130' },
  { value: 'VII', label: 'Tier VII', power: 150, description: 'Base power: 150' },
  { value: 'VIII', label: 'Tier VIII', power: 170, description: 'Base power: 170' },
  { value: 'IX', label: 'Tier IX', power: 190, description: 'Base power: 190' },
  { value: 'X', label: 'Tier X', power: 210, description: 'Base power: 210' },
  { value: 'XI', label: 'Tier XI', power: 230, description: 'Base power: 230' },
];

const getGearPower = (tier, rarity, itemLevel = 30) => {
  // Handle Roman numerals for tier mapping
  const tierMapping = {
    'I': 1, 'II': 2, 'III': 3, 'IV': 4, 'V': 5, 'VI': 6,
    'VII': 7, 'VIII': 8, 'IX': 9, 'X': 10, 'XI': 11
  };
  const tierNum = tierMapping[tier] || 4;
  
  // Base power calculation
  let basePower;
  if (tierNum === 2) {  // Tier II → 40 (rarity does not change this)
    basePower = 40;
  } else if (tierNum === 3) {  // Tier III → 70 (rarity does not change this)
    basePower = 70;
  } else if (tierNum >= 4) {  // Tier ≥ IV → 90 + 20 × (Tier − 4) + Rarity Bonus
    basePower = 90 + (20 * (tierNum - 4));
    // Rarity bonus only applies to Tier ≥ IV
    const rarityBonus = {
      'common': 0,
      'rare': 12,
      'epic': 22,
      'legendary': 22,
    };
    basePower += rarityBonus[rarity] || 0;
  } else {
    basePower = 40; // Fallback
  }
  
  // Level bonus: 2 × (Item Level − 1)
  const levelBonus = 2 * (itemLevel - 1);
  
  return basePower + levelBonus;
};

// Calculate total gear power from all equipped items
const calculateTotalGearPower = (drifters) => {
  let sumPower = 0;
  let itemCount = 0;
  
  console.log('calculateTotalGearPower called with drifters:', drifters);
  
  if (drifters && drifters.length > 0) {
    drifters.forEach((drifter, drifterIndex) => {
      console.log(`Processing drifter ${drifterIndex}:`, drifter);
      if (drifter.gear_slots) {
        // Only check the first 5 slots: Weapon, Helmet, Chest, Boots, Off-hand
        const relevantSlots = drifter.gear_slots.slice(0, 5);
        relevantSlots.forEach((slot, slotIndex) => {
          console.log(`Processing slot ${slotIndex}:`, slot);
          if (slot && slot.gear_item && slot.gear_item.tier) {
            const gearItem = slot.gear_item;
            console.log(`Found equipped gear:`, gearItem);
            // Only count weapons and armor (exclude mods and consumables)
            const category = slot.gear_type?.category || gearItem.gear_type?.category;
            if (category && 
                category.toLowerCase() !== 'mod' && 
                category.toLowerCase() !== 'consumable') {
              const itemPower = getGearPower(
                gearItem.tier, 
                gearItem.rarity, 
                gearItem.item_level || 30
              );
              console.log(`Adding ${gearItem.base_name} (${gearItem.tier} ${gearItem.rarity} L${gearItem.item_level || 30}): ${itemPower} power`);
              sumPower += itemPower;
              itemCount++;
            } else {
              console.log(`Skipping ${gearItem.base_name} - category: ${category}`);
            }
          } else if (slot && slot.gear_item) {
            console.log(`Slot has gear_item but no tier:`, slot.gear_item);
          } else {
            console.log(`Empty slot ${slotIndex}`);
          }
        });
      } else {
        console.log(`Drifter ${drifterIndex} has no gear_slots`);
      }
    });
  } else {
    console.log('No drifters found or drifters is empty');
  }
  
  // Calculate average: floor(sum / 5)
  const totalPower = Math.floor(sumPower / 5);
  console.log(`Sum of equipped items: ${sumPower}, Item count: ${itemCount}, Total Gear Power (floor sum/5): ${totalPower}`);
  return totalPower;
};

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
      { id: 1, gear_item: { name: 'Luminous Ward', base_name: 'Luminous Ward', skill_name: 'Sanctum Arc', rarity: 'epic', tier: 'V', item_level: 30, health_bonus: 0, icon_url: null, game_id: 'weapon_001' }, gear_type: { category: 'Weapon' } },
      { id: 2, gear_item: { name: 'Healer\'s Hood', base_name: 'Healer\'s Hood', skill_name: 'Swift Aid', rarity: 'rare', tier: 'III', item_level: 30, health_bonus: 714, icon_url: null, game_id: 'helmet_001' }, gear_type: { category: 'Helmet' } },
      { id: 3, gear_item: { name: 'Cleansing Robe', base_name: 'Cleansing Robe', skill_name: 'Purify', rarity: 'common', tier: 'II', item_level: 30, health_bonus: 0, icon_url: null, game_id: 'chest_001' }, gear_type: { category: 'Chest' } },
      { id: 4, gear_item: { name: 'Arcaneflow Boots', base_name: 'Arcaneflow Boots', skill_name: 'Abundance', rarity: 'rare', tier: 'IV', item_level: 30, health_bonus: 675, icon_url: null, game_id: 'boots_001' }, gear_type: { category: 'Boots' } },
      { id: 5, gear_item: { name: 'Mass Healing Elixir', base_name: 'Mass Healing Elixir', skill_name: 'Mass Healing Elixir', rarity: 'common', tier: null, health_bonus: 0, icon_url: null, game_id: 'consumable_001' }, gear_type: { category: 'Consumable' } },
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
      { id: 6, gear_item: { name: 'Thunder Hammer', base_name: 'Thunder Hammer', skill_name: 'Lightning Strike', rarity: 'epic', tier: 'VII', item_level: 30, health_bonus: 0, icon_url: null, game_id: 'weapon_002' }, gear_type: { category: 'Weapon' } },
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
  const { playerId } = useParams();
  const [searchParams] = useSearchParams();
  const [player, setPlayer] = useState(null);
  const [drifters, setDrifters] = useState([]);
  const [allDrifters, setAllDrifters] = useState([]);
  const [gearItems, setGearItems] = useState([]);
  const [activeDrifterTab, setActiveDrifterTab] = useState(0);
  const [activeItemTab, setActiveItemTab] = useState(0);
  const [activeAttributeTab, setActiveAttributeTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRarity, setFilterRarity] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [accessDenied, setAccessDenied] = useState(false);
  const [filterStat, setFilterStat] = useState('all');
  const [filterWeaponType, setFilterWeaponType] = useState('all');
  const [editingName, setEditingName] = useState(false);
  const [editName, setEditName] = useState('');
  const [skillModalOpen, setSkillModalOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [showDrifterModal, setShowDrifterModal] = useState(false);
  const [drifterSearchTerm, setDrifterSearchTerm] = useState('');
  const [tierDialogOpen, setTierDialogOpen] = useState(false);
  const [selectedGearForTier, setSelectedGearForTier] = useState(null);
  const [selectedItemLevel, setSelectedItemLevel] = useState(30);

  const slotLabels = [
    'Weapon', 'Helmet', 'Chest', 'Boots', 'Consumable',
    'Mod 1', 'Mod 2', 'Mod 3', 'Mod 4'
  ];

  useEffect(() => {
    fetchPlayerData();
  }, [playerId]);

  // Reset rarity filter if current selection is not available in the category
  useEffect(() => {
    const availableRarities = getAvailableRarities();
    if (!availableRarities.includes(filterRarity)) {
      setFilterRarity('all');
    }
  }, [activeItemTab, gearItems]);

  const fetchPlayerData = async () => {
    try {
      setLoading(true);
      setError(null);
      setAccessDenied(false);

      // Check for access token
      const token = searchParams.get('token');
      if (!token) {
        setAccessDenied(true);
        setError('Access token is required to view this loadout.');
        return;
      }

      // Validate token and get player data
      const response = await apiService.validateProfileToken(playerId, token);
      if (!response.success) {
        setAccessDenied(true);
        setError(response.error || 'Invalid or expired access token.');
        return;
      }

      const playerData = response.player;
      console.log('Player data:', playerData);
      setPlayer(playerData);
      setEditName(playerData?.in_game_name || '');

      // Fetch drifters data
      const driftersData = await apiService.getPlayerDrifters(playerId);
      console.log('Drifters data:', driftersData);
      setDrifters(driftersData.drifters || []);

      // Fetch gear items data
      const gearData = await apiService.getGearItems();
      console.log('Gear items data:', gearData);
      // The API returns the array directly, not wrapped in a gear_items property
      setGearItems(Array.isArray(gearData) ? gearData : (gearData.gear_items || []));

      // Fetch all available drifters
      const allDriftersData = await apiService.getAllDrifters();
      console.log('All drifters data:', allDriftersData);
      setAllDrifters(allDriftersData.drifters || []);

    } catch (error) {
      console.error('Error fetching player data:', error);
      setError('An unexpected error occurred while loading the loadout.');
    } finally {
      setLoading(false);
    }
  };

  const handleDrifterTabChange = (event, newValue) => {
    setActiveDrifterTab(newValue);
  };

  const handleItemTabChange = (event, newValue) => {
    setActiveItemTab(newValue);
    // Reset filters when switching categories
    setSearchTerm('');
    setFilterRarity('all');
    setFilterStat('all');
    setFilterWeaponType('all');
  };

  const handleAttributeTabChange = (event, newValue) => {
    setActiveAttributeTab(newValue);
  };

  const handleEditName = () => {
    setEditName(player?.name || '');
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

  // Equip gear function - now shows tier selection dialog first
  const handleEquipGear = async (gearItem, slotType, tier = 'II', itemLevel = 30) => {
    try {
      const currentDrifter = drifters[activeDrifterTab];
      if (!currentDrifter) {
        alert('Please select a drifter first');
        return;
      }

      const response = await apiService.equipGear(
        playerId,
        gearItem.id,
        currentDrifter.number,
        slotType,
        tier,
        itemLevel
      );

      if (response.success) {
        // Update the local state without refreshing the page
        updateLocalGearState({...gearItem, tier, item_level: itemLevel}, 'equip');
      } else {
        alert('Error equipping gear: ' + (response.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error equipping gear:', error);
      alert('Error equipping gear: ' + error.message);
    }
  };

  // Show tier selection dialog
  const handleEquipButtonClick = (gearItem, slotType) => {
    // Only show tier selection for weapons and armor, not mods or consumables
    if (slotType.toLowerCase().includes('mod') || slotType.toLowerCase() === 'consumable') {
      handleEquipGear(gearItem, slotType);
    } else {
      setSelectedGearForTier({ gearItem, slotType });
      setTierDialogOpen(true);
    }
  };

  // Handle tier selection
  const handleTierSelection = (tier) => {
    if (selectedGearForTier) {
      handleEquipGear(selectedGearForTier.gearItem, selectedGearForTier.slotType, tier, selectedItemLevel);
      setTierDialogOpen(false);
      setSelectedGearForTier(null);
      setSelectedItemLevel(30); // Reset to default
    }
  };

  // Unequip gear function
  const handleUnequipGear = async (gearItem) => {
    try {
      const response = await apiService.unequipGear(playerId, gearItem.id);

      if (response.success) {
        // Update the local state without refreshing the page
        updateLocalGearState(gearItem, 'unequip');
      } else {
        alert('Error unequipping gear: ' + (response.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error unequipping gear:', error);
      alert('Error unequipping gear: ' + error.message);
    }
  };

  // Helper function to get icon URL
  const getIconUrl = (item, fallback = '⚔️') => {
    // If item has icon_url, check if it's a backend path and convert to frontend path
    if (item?.icon_url) {
      // If it's a backend static path, convert to frontend path
      if (item.icon_url.includes('/static/icons/')) {
        const filename = item.icon_url.split('/static/icons/')[1];
        return `/icons/${filename}`;
      }
      // If it's already a frontend path or external URL, use as is
      return item.icon_url;
    }
    
    // Try to find icon using different approaches
    if (item?.game_id) {
      // Use game_id to construct path to frontend icons
      return `/icons/${item.game_id}.png`;
    }
    
    if (item?.id) {
      // Fallback to using the item ID directly
      return `/icons/${item.id}.png`;
    }
    
    return null;
  };

  // Helper function to get drifter icon URL
  const getDrifterIconUrl = (iconId) => {
    return `/icons/${iconId}.png`;
  };

  // Helper function to get rarity border color
  const getRarityBorderColor = (rarity) => {
    switch (rarity?.toLowerCase()) {
      case 'common':
        return '#9e9e9e'; // Grey
      case 'uncommon':
        return '#4caf50'; // Green
      case 'rare':
        return '#2196f3'; // Blue
      case 'epic':
        return '#9c27b0'; // Purple
      case 'legendary':
        return '#ff9800'; // Orange
      default:
        return 'rgba(255, 255, 255, 0.1)'; // Default
    }
  };

  // Helper function to check if an item is equipped
  const isItemEquipped = (item) => {
    if (!currentDrifter || !currentDrifter.gear_slots) return false;
    
    return currentDrifter.gear_slots.some(slot => 
      slot && slot.gear_item && slot.gear_item.id === item.id
    );
  };

  // Helper function to get the next available mod slot
  const getNextModSlot = () => {
    if (!currentDrifter || !currentDrifter.gear_slots) return null;
    
    // Find the first empty mod slot (slots 5-8 are mods)
    for (let i = 5; i < 9; i++) {
      if (!currentDrifter.gear_slots[i]) {
        return i;
      }
    }
    return null; // All mod slots are full
  };

  // Function to update local gear state without page refresh
  const updateLocalGearState = (gearItem, action) => {
    if (!currentDrifter) return;

    const updatedDrifters = [...drifters];
    const currentDrifterIndex = activeDrifterTab;
    const currentDrifterData = updatedDrifters[currentDrifterIndex];

    if (action === 'equip') {
      // Find the appropriate slot for this gear type
      let targetSlotIndex = -1;
      
      if (gearItem.gear_type.category === 'weapon') {
        targetSlotIndex = 0;
      } else if (gearItem.gear_type.category === 'helmet') {
        targetSlotIndex = 1;
      } else if (gearItem.gear_type.category === 'chest') {
        targetSlotIndex = 2;
      } else if (gearItem.gear_type.category === 'boots') {
        targetSlotIndex = 3;
      } else if (gearItem.gear_type.category === 'consumable') {
        targetSlotIndex = 4;
      } else if (gearItem.gear_type.category === 'mod') {
        // Find the first empty mod slot
        for (let i = 5; i < 9; i++) {
          if (!currentDrifterData.gear_slots[i]) {
            targetSlotIndex = i;
            break;
          }
        }
      }

      if (targetSlotIndex !== -1) {
        // Create the gear slot data
        const gearSlotData = {
          id: Date.now(), // Temporary ID
          gear_item: {
            id: gearItem.id,
            base_name: gearItem.base_name,
            skill_name: gearItem.skill_name,
            rarity: gearItem.rarity,
            tier: gearItem.tier || 'II', // Include tier information
            item_level: gearItem.item_level || 30, // Include item level
            damage: gearItem.damage,
            defense: gearItem.defense,
            health_bonus: gearItem.health_bonus,
            energy_bonus: gearItem.energy_bonus,
            game_id: gearItem.game_id,
            icon_url: gearItem.icon_url,
          },
          gear_type: {
            category: gearItem.gear_type.category
          }
        };

        // Update the gear slot
        const updatedGearSlots = [...currentDrifterData.gear_slots];
        updatedGearSlots[targetSlotIndex] = gearSlotData;

        // Update the drifter data
        updatedDrifters[currentDrifterIndex] = {
          ...currentDrifterData,
          gear_slots: updatedGearSlots,
          equipped_count: updatedGearSlots.filter(slot => slot !== null).length
        };

        setDrifters(updatedDrifters);
      }
    } else if (action === 'unequip') {
      // Find and remove the gear item from gear slots
      const updatedGearSlots = [...currentDrifterData.gear_slots];
      for (let i = 0; i < updatedGearSlots.length; i++) {
        if (updatedGearSlots[i] && updatedGearSlots[i].gear_item.id === gearItem.id) {
          updatedGearSlots[i] = null;
          break;
        }
      }

      // Update the drifter data
      updatedDrifters[currentDrifterIndex] = {
        ...currentDrifterData,
        gear_slots: updatedGearSlots,
        equipped_count: updatedGearSlots.filter(slot => slot !== null).length
      };

      setDrifters(updatedDrifters);
    }
  };

  // Filter drifters based on search term
  const getFilteredDrifters = () => {
    if (!drifterSearchTerm.trim()) {
      return allDrifters;
    }
    
    return allDrifters.filter(drifter => 
      drifter.name.toLowerCase().includes(drifterSearchTerm.toLowerCase())
    );
  };

  // Drifter name to icon ID mapping
  const drifterIconMap = {
    'Sirokos': 'ParagonCard_Str_1',
    'Varnax': 'ParagonCard_Str_4',
    'Draknor': 'ParagonCard_Str_7',
    'Elektrix': 'ParagonCard_Dex_1',
    'Zero': 'ParagonCard_Dex_2',
    'Sanguor': 'ParagonCard_Dex_3',
    'Shadowseer': 'ParagonCard_Dex_4',
    'Veska': 'ParagonCard_Dex_5',
    'Moonveil': 'ParagonCard_Dex_6',
    'Vire': 'ParagonCard_Dex_7',
    'Kyra': 'ParagonCard_Str_2',
    'Aegis': 'ParagonCard_Str_5',
    'Auri': 'ParagonCard_Str_8',
    'Nyxa': 'ParagonCard_Int_1',
    'Vryssia': 'ParagonCard_Int_2',
    'Stormblade': 'ParagonCard_Int_3',
    'Solenne': 'ParagonCard_Int_4',
    'Helix': 'ParagonCard_Int_6',
    'Revelation': 'ParagonCard_Int_7',
    'Mole': 'ParagonCard_Gather_1',
    'Izzy': 'ParagonCard_Str_3',
    'Durion': 'ParagonCard_Str_6',
    'Firestorm': 'ParagonCard_Str_9',
    'Overdrive': 'ParagonCard_Dex_8',
    'Umbra': 'ParagonCard_Dex_9',
    'Illusarch': 'ParagonCard_Int_9',
    'Hive Queen': 'ParagonCard_Int_10',
    'Raven': 'ParagonCard_Int_11',
    'Astral Magus': 'ParagonCard_Int_13'
  };


  // Group gear by type
  
  const gearByType = {
    weapon: (gearItems || []).filter(item => item.gear_type?.category === 'weapon'),
    helmet: (gearItems || []).filter(item => item.gear_type?.category === 'helmet'),
    chest: (gearItems || []).filter(item => item.gear_type?.category === 'chest'),
    boots: (gearItems || []).filter(item => item.gear_type?.category === 'boots'),
    consumable: (gearItems || []).filter(item => item.gear_type?.category === 'consumable'),
    mod: (gearItems || []).filter(item => item.gear_type?.category === 'mod')
  };
  

  // Get current category items based on active tab
  const getCurrentCategory = () => {
    const categories = ['weapon', 'helmet', 'chest', 'boots', 'consumable', 'mod'];
    return categories[activeItemTab];
  };

  const getCurrentCategoryItems = () => {
    const currentCategory = getCurrentCategory();
    return gearByType[currentCategory] || [];
  };

  // Get available rarities for current category, sorted by rarity hierarchy
  const getAvailableRarities = () => {
    const categoryItems = getCurrentCategoryItems();
    const rarities = [...new Set(categoryItems.map(item => item.rarity).filter(Boolean))];
    
    // Define rarity hierarchy for proper sorting
    const rarityOrder = {
      'common': 1,
      'uncommon': 2,
      'rare': 3,
      'epic': 4,
      'legendary': 5
    };
    
    // Sort rarities by hierarchy
    const sortedRarities = rarities.sort((a, b) => {
      const orderA = rarityOrder[a.toLowerCase()] || 999;
      const orderB = rarityOrder[b.toLowerCase()] || 999;
      return orderA - orderB;
    });
    
    return ['all', ...sortedRarities];
  };

  // Get available weapon types dynamically from game_id prefixes
  const getWeaponTypeOptions = () => {
    if (getCurrentCategory() !== 'weapon') return [{ key: 'all', label: 'All', icon: null }];
    
    const categoryItems = getCurrentCategoryItems();
    
    // Extract weapon types from game_id prefixes
    const weaponTypeMap = {};
    categoryItems.forEach(item => {
      if (item.game_id) {
        const prefix = item.game_id.split('_')[0].toLowerCase();
        if (!weaponTypeMap[prefix]) {
          weaponTypeMap[prefix] = {
            key: prefix,
            label: prefix.charAt(0).toUpperCase() + prefix.slice(1),
            icon: getWeaponTypeIcon(prefix)
          };
        }
      }
    });
    
    // Convert to array and sort alphabetically
    const weaponTypes = Object.values(weaponTypeMap).sort((a, b) => a.label.localeCompare(b.label));
    
    return [
      { key: 'all', label: 'All', icon: null },
      ...weaponTypes
    ];
  };

  const getWeaponTypeIcon = (weaponType) => {
    const iconMap = {
      'sword': '⚔️',
      'axe': '🪓',
      'mace': '🔨',
      'bow': '🏹',
      'dagger': '🗡️',
      'spear': '🔱',
      'gun': '🔫',
      'fire': '🔥',
      'frost': '❄️',
      'nature': '🌿',
      'holy': '✨',
      'curse': '💀'
    };
    return iconMap[weaponType] || '⚔️';
  };

  // Process mod description template with parameter substitution
  const processModDescription = (item) => {
    if (!item.description) {
      return 'No description available';
    }

    let description = item.description;
    
    // For now, we'll show the template as-is since we don't have params from the API yet
    // TODO: When backend provides params array, replace placeholders %s1%, %s2%, etc.
    // description = description.replace(/%s(\d+)%/g, (match, index) => {
    //   const paramIndex = parseInt(index) - 1; // Convert to 0-indexed
    //   if (paramIndex >= 0 && paramIndex < item.params.length) {
    //     return item.params[paramIndex].toString();
    //   }
    //   return '??'; // Missing parameter
    // });

    // Convert \n to <br /> for line breaks
    description = description.replace(/\n/g, '<br />');

    // Escape HTML to prevent XSS
    description = description
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');

    return description;
  };

  // Enhanced description rendering with special formatting
  const renderModDescription = (item) => {
    const description = processModDescription(item);
    
    // Split into parts for special formatting
    const parts = description.split(/(\[[^\]]+\]|Trigger Interval:|Cooldown:|Only triggers with)/);
    
    return parts.map((part, index) => {
      if (part.startsWith('[') && part.endsWith(']')) {
        // Wrap bracketed keywords in styled spans
        return (
          <span
            key={index}
            style={{
              background: 'rgba(100, 181, 246, 0.2)',
              color: '#64b5f6',
              padding: '2px 6px',
              borderRadius: '4px',
              fontSize: '0.85em',
              fontWeight: '600'
            }}
          >
            {part}
          </span>
        );
      } else if (part === 'Trigger Interval:' || part === 'Cooldown:') {
        // Style metadata as muted
        return (
          <span
            key={index}
            style={{
              color: '#b0bec5',
              fontSize: '0.9em',
              fontStyle: 'italic'
            }}
          >
            {part}
          </span>
        );
      } else if (part === 'Only triggers with') {
        // Style requirements
        return (
          <span
            key={index}
            style={{
              color: '#ffb74d',
              fontSize: '0.9em',
              fontWeight: '600'
            }}
          >
            {part}
          </span>
        );
      } else {
        // Regular text
        return <span key={index} dangerouslySetInnerHTML={{ __html: part }} />;
      }
    });
  };

  // Filter items by search, rarity, stat, and weapon type
  const getFilteredItems = () => {
    const categoryItems = getCurrentCategoryItems();
    return categoryItems.filter(item => {
      const matchesSearch = item.base_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.skill_name?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRarity = filterRarity === 'all' || item.rarity === filterRarity;
      
      let matchesStat = true;
      // Check stat filter (only for non-weapon, non-mod, non-consumable categories)
      if (filterStat !== 'all' && !['weapon', 'mod', 'consumable'].includes(getCurrentCategory())) {
        if (item.game_id) {
          const gameId = item.game_id.toLowerCase();
          if (filterStat === 'strength') {
            matchesStat = gameId.includes('_str_');
          } else if (filterStat === 'agility') {
            matchesStat = gameId.includes('_dex_');
          } else if (filterStat === 'intelligence') {
            matchesStat = gameId.includes('_int_');
          }
        } else {
          matchesStat = false;
        }
      }
      
      let matchesWeaponType = true;
      
      if (getCurrentCategory() === 'weapon') {
        const name = item.base_name.toLowerCase();
        const skill = item.skill_name?.toLowerCase() || '';
        
        // Check weapon type filter using game_id prefix
        if (filterWeaponType !== 'all') {
          if (item.game_id) {
            const itemPrefix = item.game_id.split('_')[0].toLowerCase();
            matchesWeaponType = itemPrefix === filterWeaponType;
          } else {
            matchesWeaponType = false;
          }
        }
      }
      
      return matchesSearch && matchesRarity && matchesStat && matchesWeaponType;
    }).sort((a, b) => {
      // Sort by rarity hierarchy (common first, then uncommon, rare, epic, legendary)
      const rarityOrder = {
        'common': 1,
        'uncommon': 2,
        'rare': 3,
        'epic': 4,
        'legendary': 5
      };
      
      const orderA = rarityOrder[a.rarity?.toLowerCase()] || 0;
      const orderB = rarityOrder[b.rarity?.toLowerCase()] || 0;
      
      // If same rarity, sort alphabetically by name
      if (orderA === orderB) {
        return a.base_name.localeCompare(b.base_name);
      }
      
      return orderA - orderB; // Lower rarity first
    });
  };

  const currentDrifter = activeDrifterTab >= 0 ? drifters[activeDrifterTab] || null : null;
  const hasSelectedDrifter = currentDrifter !== null && currentDrifter.name !== null;

  if (loading) {
    return (
      <Layout>
        <Box sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Typography sx={{ color: '#ffffff', fontSize: '1.5rem' }}>
            Loading player data...
          </Typography>
        </Box>
      </Layout>
    );
  }

  if (accessDenied || error) {
    return (
      <Layout>
        <Box sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 2,
          p: 3
        }}>
          <Security color="error" sx={{ fontSize: 64, color: '#ff4444' }} />
          <Typography variant="h4" sx={{ color: '#ff4444', fontSize: '2rem' }} gutterBottom>
            Access Denied
          </Typography>
          <Typography variant="body1" sx={{ color: '#ffffff', textAlign: 'center', maxWidth: 400 }}>
            {error || 'You do not have permission to view this loadout.'}
          </Typography>
          <Typography variant="body2" sx={{ color: '#cccccc', textAlign: 'center', maxWidth: 400, mt: 2 }}>
            This loadout is only accessible to the player owner or staff members. 
            Please request a new access link from the Discord bot.
          </Typography>
        </Box>
      </Layout>
    );
  }

  if (!player) {
    return (
      <Layout>
        <Box sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Typography sx={{ color: '#ffffff', fontSize: '1.5rem' }}>
            Player not found
          </Typography>
        </Box>
      </Layout>
    );
  }

  if (!currentDrifter) {
    return (
      <Layout>
        <Box sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Typography sx={{ color: '#ffffff', fontSize: '1.5rem' }}>
            No drifter data available
          </Typography>
        </Box>
      </Layout>
    );
  }

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
                      {player?.name || 'Loading...'}
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
                <Typography sx={{ color: '#ffffff' }}>{player?.discord_name ? player.discord_name.replace(/#\d+$/, '') : 'N/A'}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, pb: 0.625, borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <Typography sx={{ color: '#90caf9', fontWeight: 600 }}>Guild:</Typography>
                <Typography sx={{ color: '#ffffff' }}>{player?.guild || 'N/A'}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, pb: 0.625, borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <Typography sx={{ color: '#90caf9', fontWeight: 600 }}>Level:</Typography>
                <Typography sx={{ color: '#ffffff' }}>{player?.level || 'N/A'}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, pb: 0.625, borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <Typography sx={{ color: '#90caf9', fontWeight: 600 }}>Faction:</Typography>
                <Typography sx={{ color: '#ffffff' }}>{player?.faction ? player.faction.charAt(0).toUpperCase() + player.faction.slice(1) : 'N/A'}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, pb: 0.625, borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <Typography sx={{ color: '#90caf9', fontWeight: 600 }}>Guild Rank:</Typography>
                <Typography sx={{ color: '#ffffff' }}>{player?.role ? player.role.charAt(0).toUpperCase() + player.role.slice(1) : 'N/A'}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, pb: 0.625, borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <Typography sx={{ color: '#90caf9', fontWeight: 600 }}>Role:</Typography>
                <Typography sx={{ color: '#ffffff' }}>{player?.game_role ? player.game_role.charAt(0).toUpperCase() + player.game_role.slice(1) : 'N/A'}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, pb: 0.625, borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <Typography sx={{ color: '#90caf9', fontWeight: 600 }}>Total Gear Power:</Typography>
                <Typography sx={{ color: '#4caf50', fontWeight: 'bold' }}>{calculateTotalGearPower(drifters)}</Typography>
              </Box>
            </Box>

            {/* Notes */}
            {player?.notes && (
              <Box sx={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: 1.25,
                p: 1.875
              }}>
                <Typography sx={{ color: '#90caf9', fontWeight: 600, mb: 1 }}>Notes:</Typography>
                <Typography sx={{ color: '#ffffff', mt: 1 }}>{player?.notes}</Typography>
              </Box>
            )}

            {/* Guild Logo - Large Empty Space */}
            <Box sx={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: 1.25,
              p: 1.875,
              mt: 2,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '250px'
            }}>
              <Box
                component="img"
                src="/violence-logo.png"
                alt="Violence Guild Logo"
                sx={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  width: 'auto',
                  height: 'auto',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 0 20px rgba(255, 255, 255, 0.2))',
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'scale(1.05)'
                  }
                }}
                onError={(e) => {
                  // Fallback if image doesn't exist
                  e.target.style.display = 'none';
                }}
              />
            </Box>
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
              {drifters.map((drifter, index) => {
                const hasGearSlots = drifter.name !== null;
                return (
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
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: '#ffffff'
                      }
                    }}
                  >
                    {hasGearSlots ? (
                      <>
                        {drifterIconMap[drifter.name] && (
                          <img 
                            src={getDrifterIconUrl(drifterIconMap[drifter.name])} 
                            alt={drifter.name}
                            style={{ 
                              width: 24, 
                              height: 24, 
                              objectFit: 'contain',
                              borderRadius: '4px'
                            }}
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        )}
                        {drifter.name}
                      </>
                    ) : (
                      <>
                        <Typography sx={{ fontSize: '20px', opacity: 0.3 }}>⚪</Typography>
                        <Typography sx={{ fontStyle: 'italic', opacity: 0.6 }}>Drifter X</Typography>
                      </>
                    )}
                  </Button>
                );
              })}
            </Box>

            {/* Drifter Content */}
            {hasSelectedDrifter ? (
              <Box>
                {/* Drifter Stats */}
                <Box sx={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: 1.25,
                  p: 1.875,
                  mb: 2.5
                }}>
                  {/* Drifter Stats */}
                  <Box
                    sx={{
                      background:
                        'linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03))',
                      borderRadius: 1.25,
                      p: 2,
                      mb: 2.5,
                      border: '1px solid rgba(255,255,255,0.08)',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    <Typography
                      sx={{
                        color: '#ffffff',
                        fontSize: '1.2rem',
                        fontWeight: 700,
                        textAlign: 'center',
                        pb: 1.25,
                        mb: 2,
                        borderBottom: '1px solid rgba(100,181,246,0.35)',
                      }}
                    >
                      Basic stats of the drifter
                    </Typography>

                    {/*
                      Build a small model for the chips so it's easy to tweak labels or colors later.
                    */}
                    {(() => {
                      const statItems = [
                        { label: 'Health',  value: currentDrifter.base_health || 0,  Icon: Healing,      accent: '#66bb6a' },
                        { label: 'Energy',  value: currentDrifter.base_energy || 0,  Icon: FlashOn,      accent: '#64b5f6' },
                        { label: 'Damage',  value: currentDrifter.base_damage || 0,  Icon: MilitaryTech, accent: '#ffb74d' },
                        { label: 'Defense', value: currentDrifter.base_defense || 0, Icon: Shield,       accent: '#b39ddb' },
                        { label: 'Speed',   value: currentDrifter.base_speed || 0,   Icon: Speed,        accent: '#4dd0e1' },
                      ];

                      return (
                        <Box
                          sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 1.25,
                            justifyContent: { xs: 'center', md: 'flex-start' },
                          }}
                        >
                          {statItems.map(({ label, value, Icon, accent }) => (
                            <Paper
                              key={label}
                              elevation={0}
                              sx={{
                                minWidth: 190,
                                px: 1.5,
                                py: 1.25,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1.25,
                                borderRadius: 1.25,
                                background:
                                  'linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.04))',
                                border: '1px solid rgba(255,255,255,0.08)',
                                position: 'relative',
                                overflow: 'hidden',
                                transition: 'transform .2s ease, box-shadow .2s ease',
                                '&::before': {
                                  content: '""',
                                  position: 'absolute',
                                  left: 0,
                                  top: 0,
                                  bottom: 0,
                                  width: 4,
                                  background: accent,
                                  opacity: 0.9,
                                },
                                '&:hover': {
                                  transform: 'translateY(-2px)',
                                  boxShadow: '0 10px 24px rgba(100,181,246,.18)',
                                },
                              }}
                            >
                              <Box
                                sx={{
                                  p: 0.75,
                                  borderRadius: 1,
                                  background: `linear-gradient(135deg, ${accent}33, ${accent}22)`,
                                  display: 'grid',
                                  placeItems: 'center',
                                }}
                              >
                                <Icon sx={{ fontSize: 20, color: accent }} />
                              </Box>
                              <Box sx={{ lineHeight: 1 }}>
                                <Typography sx={{ color: '#b0bec5', fontSize: '.9rem', fontWeight: 600 }}>
                                  {label}
                                </Typography>
                                <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: '1.15rem' }}>
                                  {value}
                                </Typography>
                              </Box>
                            </Paper>
                          ))}
                        </Box>
                      );
                    })()}

                  </Box>
                </Box>

                {/* Equipped Items Count */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.25, pb: 0.625, borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <Typography sx={{ color: '#90caf9', fontWeight: 600 }}>Equipped Items:</Typography>
                  <Typography sx={{ color: '#ffffff' }}>{currentDrifter.equipped_count || 0}/9</Typography>
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
                      const gear = currentDrifter.gear_slots?.[i] || null;
                      // Debug logging for gear data
                      if (gear && gear.gear_item) {
                        console.log(`Gear slot ${i} (${label}):`, gear.gear_item);
                        console.log('Has tier?', !!gear.gear_item.tier);
                        console.log('Tier value:', gear.gear_item.tier);
                      }
                      return (
                        <Box
                          key={i}
                          onClick={() => gear && handleUnequipGear(gear.gear_item)}
                          sx={{
                            width: '100%',
                            minWidth: 0,          // allow shrinking inside grid
                            boxSizing: 'border-box',
                            aspectRatio: '1',
                            background: gear ? `${getRarityBorderColor(gear.gear_item.rarity)}20` : 'rgba(255, 255, 255, 0.05)',
                            border: gear ? `2px solid ${getRarityBorderColor(gear.gear_item.rarity)}` : '2px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative',
                            transition: 'all 0.3s ease',
                            cursor: gear ? 'pointer' : 'default',
                            p: 1,
                            boxShadow: gear ? `0 0 15px ${getRarityBorderColor(gear.gear_item.rarity)}50` : 'none',
                            '&:hover': {
                              transform: gear ? 'translateY(-2px)' : 'none',
                              boxShadow: gear ? `0 0 20px ${getRarityBorderColor(gear.gear_item.rarity)}60` : '0 4px 12px rgba(0, 0, 0, 0.3)'
                            }
                          }}
                        >
                          {gear ? (
                            <>
                              {/* Tier Icon - Top Left Corner */}
                              {!label.toLowerCase().includes('mod') && !label.toLowerCase().includes('consumable') && (
                                <Box sx={{
                                  position: 'absolute',
                                  top: 4,
                                  left: 4,
                                  zIndex: 2,
                                }}>
                                  <Box
                                    component="img"
                                    src={`/static/icons/tiers/tier${gear.gear_item.tier || 'II'}.png`}
                                    alt={`Tier ${gear.gear_item.tier || 'II'}`}
                                    sx={{
                                      width: 32,
                                      height: 32,
                                      objectFit: 'contain',
                                      filter: 'drop-shadow(0 0 2px rgba(0,0,0,0.8))'
                                    }}
                                    onError={(e) => {
                                      console.error('Tier icon failed to load:', e.target.src);
                                      console.log('Gear item tier:', gear.gear_item.tier);
                                      console.log('Using default tier:', gear.gear_item.tier || 'II');
                                      console.log('Label:', label);
                                    }}
                                    onLoad={() => {
                                      console.log('Tier icon loaded successfully:', `/static/icons/tiers/tier${gear.gear_item.tier || 'II'}.png`);
                                    }}
                                  />
                                </Box>
                              )}
                              
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
                                {getIconUrl(gear.gear_item) ? (
                                  <img 
                                    src={getIconUrl(gear.gear_item)} 
                                    alt={gear.gear_item.base_name}
                                    style={{ 
                                      width: '100%', 
                                      height: '100%', 
                                      objectFit: 'contain',
                                      borderRadius: '4px'
                                    }}
                                    onError={(e) => {
                                      e.target.style.display = 'none';
                                      if (e.target.nextSibling) {
                                        e.target.nextSibling.style.display = 'flex';
                                      }
                                    }}
                                  />
                                ) : null}
                                <Avatar
                                  sx={{
                                    width: { xs: 40, sm: 48, md: 56 },
                                    height: { xs: 40, sm: 48, md: 56 },
                                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                                    display: getIconUrl(gear.gear_item) ? 'none' : 'flex'
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
                                {gear.gear_item?.base_name || 'Unknown Item'}
                              </Typography>

                              {gear.gear_item?.skill_name && (
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
                                    showSkillModal(gear.gear_item?.skill_name, 'No description available', gear.gear_item?.game_id)
                                  }
                                >
                                  {gear.gear_item?.skill_name}
                                </Typography>
                              )}

                              {gear.gear_item?.health_bonus > 0 && (
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
                                  color: '#4caf50',
                                  whiteSpace: 'nowrap',
                                  fontWeight: 'bold'
                                }}
                              >
                                Power: {gear.gear_item?.tier ? 
                                  getGearPower(gear.gear_item.tier, gear.gear_item.rarity, gear.gear_item.item_level || 30) : 
                                  'N/A'}
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
            ) : (
              <Box sx={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: 1.25,
                p: 3,
                textAlign: 'center',
                border: '2px dashed rgba(255, 255, 255, 0.1)'
              }}>
                <Typography sx={{
                  color: '#b0bec5',
                  fontSize: '1.1rem',
                  fontWeight: 500,
                  opacity: 0.7,
                  fontStyle: 'italic'
                }}>
                  No Drifter Selected
                </Typography>
                <Typography sx={{
                  color: '#90caf9',
                  fontSize: '0.9rem',
                  mt: 1,
                  opacity: 0.8
                }}>
                  Select a drifter to view their stats and equipment
                </Typography>
              </Box>
            )}
            
            {/* Change Drifter Button - Always Visible */}
            <Box sx={{ textAlign: 'center', mt: 2.25 }}>
              <Button
                variant="contained"
                onClick={() => setShowDrifterModal(true)}
                sx={{
                  background: 'linear-gradient(135deg, #64b5f6, #42a5f5)',
                  color: 'white',
                  border: 'none',
                  px: 3,
                  py: 1.2,
                  borderRadius: 1,
                  fontWeight: 700,
                  boxShadow: '0 12px 30px rgba(66,165,245,.25)',
                  transition: 'all .25s ease',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #42a5f5, #1e88e5)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 18px 36px rgba(66,165,245,.35)',
                  },
                }}
              >
                Change Drifter
              </Button>
            </Box>
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
                  onClick={() => {
                    setActiveItemTab(index);
                    // Reset filters when switching categories
                    setSearchTerm('');
                    setFilterRarity('all');
                    setFilterStat('all');
                    setFilterWeaponType('all');
                  }}
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
                {getAvailableRarities().map((rarity) => (
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

              {/* Stat Filters (only show for non-weapon, non-mod, non-consumable categories) */}
              {!['weapon', 'mod', 'consumable'].includes(getCurrentCategory()) && (
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                  {[
                    { key: 'all', label: 'All', icon: null },
                    { key: 'strength', label: 'Strength', icon: '💪' },
                    { key: 'agility', label: 'Agility', icon: '🏃' },
                    { key: 'intelligence', label: 'Intelligence', icon: '🧠' }
                  ].map((stat) => (
                    <Button
                      key={stat.key}
                      onClick={() => setFilterStat(stat.key)}
                      sx={{
                        p: '8px 16px',
                        border: '2px solid rgba(100, 181, 246, 0.3)',
                        borderRadius: 0.75,
                        background: filterStat === stat.key ? '#64b5f6' : 'rgba(30, 30, 30, 0.8)',
                        color: filterStat === stat.key ? 'white' : '#64b5f6',
                        cursor: 'pointer',
                        fontSize: '12px',
                        transition: 'all 0.3s ease',
                        whiteSpace: 'nowrap',
                        textTransform: 'capitalize',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        '&:hover': {
                          background: filterStat === stat.key ? '#64b5f6' : 'rgba(100, 181, 246, 0.1)',
                          borderColor: '#64b5f6'
                        }
                      }}
                    >
                      {stat.icon && <span>{stat.icon}</span>}
                      {stat.label}
                    </Button>
                  ))}
                </Box>
              )}

              {/* Weapon Type Filters (only show for weapon category) */}
              {getCurrentCategory() === 'weapon' && (
                <Box sx={{ mt: 1 }}>
                  {/* Weapon Type Filters */}
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                    <Typography sx={{ color: '#64b5f6', fontSize: '12px', fontWeight: 600, mb: 0.5, width: '100%' }}>
                      Weapon Types:
                    </Typography>
                    {getWeaponTypeOptions().map((weaponType) => (
                      <Button
                        key={weaponType.key}
                        onClick={() => setFilterWeaponType(weaponType.key)}
                        sx={{
                          p: '6px 12px',
                          border: '2px solid rgba(100, 181, 246, 0.3)',
                          borderRadius: 0.5,
                          background: filterWeaponType === weaponType.key ? '#64b5f6' : 'rgba(30, 30, 30, 0.8)',
                          color: filterWeaponType === weaponType.key ? 'white' : '#64b5f6',
                          cursor: 'pointer',
                          fontSize: '11px',
                          transition: 'all 0.3s ease',
                          whiteSpace: 'nowrap',
                          textTransform: 'capitalize',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                          '&:hover': {
                            background: filterWeaponType === weaponType.key ? '#64b5f6' : 'rgba(100, 181, 246, 0.1)',
                            borderColor: '#64b5f6'
                          }
                        }}
                      >
                        {weaponType.icon && <span>{weaponType.icon}</span>}
                        {weaponType.label}
                      </Button>
                    ))}
                  </Box>
                </Box>
              )}
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
              {getFilteredItems().length > 0 ? getFilteredItems().map((item) => (
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
                    borderLeft: `3px solid ${getRarityBorderColor(item.rarity)}`,
                    cursor: 'default',
                    position: 'relative',
                    border: `2px solid ${getRarityBorderColor(item.rarity)}`,
                    aspectRatio: '1',
                    textAlign: 'center',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.15)',
                      transform: 'scale(1.02)',
                      boxShadow: `0 4px 15px ${getRarityBorderColor(item.rarity)}40`,
                      borderColor: getRarityBorderColor(item.rarity)
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
                    {getIconUrl(item) ? (
                      <img 
                        src={getIconUrl(item)} 
                        alt={item.base_name}
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'contain',
                          borderRadius: '4px'
                        }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <Avatar sx={{ 
                      width: 60, 
                      height: 60, 
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                      display: getIconUrl(item) ? 'none' : 'flex'
                    }}>
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
                      {item.gear_type.category} • {item.rarity.charAt(0).toUpperCase() + item.rarity.slice(1)}
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
                      {item.defense > 0 && (
                        <Typography sx={{ color: '#b0bec5', fontSize: '0.8rem', mb: 0.25 }}>
                          Defense: {item.defense}
                        </Typography>
                      )}
                      {item.energy_bonus > 0 && (
                        <Typography sx={{ color: '#b0bec5', fontSize: '0.8rem' }}>
                          Energy: +{item.energy_bonus}
                        </Typography>
                      )}
                    </Box>
                    
                    {/* Mod Description */}
                    {item.gear_type.category === 'mod' && item.description && (
                      <Box sx={{ 
                        mb: 0.5, 
                        p: 0.5, 
                        background: 'rgba(0, 0, 0, 0.3)', 
                        borderRadius: 0.5,
                        maxHeight: '60px',
                        overflow: 'hidden',
                        position: 'relative'
                      }}>
                        <Typography sx={{
                          color: '#e2e8f0',
                          fontSize: '0.75rem',
                          lineHeight: 1.3,
                          textAlign: 'left',
                          wordBreak: 'break-word'
                        }}>
                          {renderModDescription(item)}
                        </Typography>
                      </Box>
                    )}
                    
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => {
                        if (isItemEquipped(item)) {
                          handleUnequipGear(item);
                        } else {
                          handleEquipButtonClick(item, item.gear_type.category);
                        }
                      }}
                      sx={{
                        background: isItemEquipped(item) ? '#f44336' : '#4caf50',
                        color: 'white',
                        p: '4px 8px',
                        borderRadius: 0.5,
                        cursor: 'pointer',
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          background: isItemEquipped(item) ? '#da190b' : '#45a049'
                        }
                      }}
                    >
                      {isItemEquipped(item) ? 'Unequip' : 'Equip'}
                    </Button>
                  </Box>
                </Box>
              )) : (
                <Box sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  p: 4,
                  color: '#b0bec5',
                  textAlign: 'center'
                }}>
                  <Typography sx={{ fontSize: '1.2rem', mb: 1 }}>
                    No items found
                  </Typography>
                  <Typography sx={{ fontSize: '0.9rem', opacity: 0.7 }}>
                    Try adjusting your search or filters
                  </Typography>
                </Box>
              )}
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
                {selectedSkill?.gameId ? (
                  <img 
                    src={`/icons/${selectedSkill.gameId}.png`} 
                    alt={selectedSkill.skillName}
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'contain',
                      borderRadius: '4px'
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                ) : null}
                <span style={{ display: selectedSkill?.gameId ? 'none' : 'block' }}>⚔️</span>
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

        {/* Drifter Selection Modal */}
        <Dialog
          open={showDrifterModal}
          onClose={() => setShowDrifterModal(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              background: 'linear-gradient(135deg, rgba(30, 30, 30, 0.95), rgba(45, 45, 45, 0.95))',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 2,
              backdropFilter: 'blur(20px)',
              color: '#ffffff'
            }
          }}
        >
          <DialogTitle sx={{ 
            color: '#64b5f6', 
            fontSize: '1.5rem', 
            fontWeight: 700, 
            textAlign: 'center',
            borderBottom: '2px solid rgba(100, 181, 246, 0.3)',
            pb: 2
          }}>
            Select Drifter
          </DialogTitle>
          
          <Box sx={{ p: 3 }}>
            <Typography sx={{ 
              color: '#b0bec5', 
              fontSize: '1rem', 
              textAlign: 'center',
              mb: 3
            }}>
              Choose a drifter for slot {activeDrifterTab + 1}
            </Typography>
            
            {/* Search Input */}
            <TextField
              fullWidth
              placeholder="Search drifters..."
              value={drifterSearchTerm}
              onChange={(e) => setDrifterSearchTerm(e.target.value)}
              sx={{
                mb: 3,
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
            
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
              gap: 2,
              mb: 3,
              maxHeight: '400px',
              overflowY: 'auto'
            }}>
              {/* No Drifter Option */}
              <Button
                onClick={async () => {
                  try {
                    // Clear the drifter slot
                    const result = await apiService.updatePlayerDrifter(playerId, null, activeDrifterTab + 1);
                    console.log('Clear drifter result:', result);
                    
                    if (result.success) {
                      // Update local state to show no drifter
                      const updatedDrifters = [...drifters];
                      updatedDrifters[activeDrifterTab] = {
                        number: activeDrifterTab + 1,
                        name: null,
                        base_health: 100,
                        base_energy: 100,
                        base_damage: 50,
                        base_defense: 25,
                        base_speed: 10,
                        gear_slots: new Array(9).fill(null)
                      };
                      setDrifters(updatedDrifters);
                      setShowDrifterModal(false);
                    } else {
                      console.error('Failed to clear drifter:', result.error);
                      alert('Failed to clear drifter: ' + result.error);
                    }
                  } catch (error) {
                    console.error('Error clearing drifter:', error);
                    alert('Error clearing drifter: ' + error.message);
                  }
                }}
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 1.5,
                  background: drifters[activeDrifterTab]?.name === null
                    ? 'rgba(100, 181, 246, 0.2)' 
                    : 'rgba(255, 255, 255, 0.05)',
                  border: drifters[activeDrifterTab]?.name === null
                    ? '2px solid #64b5f6' 
                    : '2px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 2,
                  color: drifters[activeDrifterTab]?.name === null ? '#64b5f6' : '#b0bec5',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'rgba(100, 181, 246, 0.1)',
                    borderColor: '#64b5f6',
                    color: '#64b5f6'
                  }
                }}
              >
                <Avatar sx={{ 
                  width: 48, 
                  height: 48, 
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  color: '#b0bec5',
                  fontSize: '1.5rem',
                  fontWeight: 'bold'
                }}>
                  ∅
                </Avatar>
                <Typography sx={{ 
                  fontWeight: 600, 
                  fontSize: '1rem',
                  textAlign: 'center'
                }}>
                  No Drifter
                </Typography>
                <Typography sx={{ 
                  fontSize: '0.8rem',
                  opacity: 0.7,
                  textAlign: 'center'
                }}>
                  Clear slot
                </Typography>
              </Button>
              
              {getFilteredDrifters().length > 0 ? getFilteredDrifters().map((drifter, index) => (
                <Button
                  key={index}
                  onClick={async () => {
                    try {
                      // Save to backend first
                      const result = await apiService.updatePlayerDrifter(playerId, drifter.id, activeDrifterTab + 1);
                      console.log('Drifter update result:', result);
                      
                      if (result.success) {
                        // Update local state
                        const updatedDrifters = [...drifters];
                        updatedDrifters[activeDrifterTab] = {
                          ...drifter,
                          number: activeDrifterTab + 1,
                          gear_slots: updatedDrifters[activeDrifterTab]?.gear_slots || new Array(9).fill(null)
                        };
                        setDrifters(updatedDrifters);
                        setShowDrifterModal(false);
                      } else {
                        console.error('Failed to update drifter:', result.error);
                        alert('Failed to update drifter: ' + result.error);
                      }
                    } catch (error) {
                      console.error('Error updating drifter:', error);
                      alert('Error updating drifter: ' + error.message);
                    }
                  }}
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 1.5,
                    background: drifters[activeDrifterTab]?.name === drifter.name
                      ? 'rgba(100, 181, 246, 0.2)' 
                      : 'rgba(255, 255, 255, 0.05)',
                    border: drifters[activeDrifterTab]?.name === drifter.name
                      ? '2px solid #64b5f6' 
                      : '2px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 2,
                    color: drifters[activeDrifterTab]?.name === drifter.name ? '#64b5f6' : '#b0bec5',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: 'rgba(100, 181, 246, 0.1)',
                      borderColor: '#64b5f6',
                      color: '#64b5f6'
                    }
                  }}
                >
                  {drifterIconMap[drifter.name] ? (
                    <img 
                      src={getDrifterIconUrl(drifterIconMap[drifter.name])} 
                      alt={drifter.name}
                      style={{ 
                        width: 48, 
                        height: 48, 
                        objectFit: 'contain',
                        borderRadius: '8px'
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <Avatar sx={{ 
                      width: 48, 
                      height: 48, 
                      bgcolor: 'rgba(100, 181, 246, 0.2)',
                      color: '#64b5f6',
                      fontSize: '1.5rem',
                      fontWeight: 'bold'
                    }}>
                      {drifter.name.charAt(0).toUpperCase()}
                    </Avatar>
                  )}
                  <Typography sx={{ 
                    fontWeight: 600, 
                    fontSize: '1rem',
                    textAlign: 'center'
                  }}>
                    {drifter.name}
                  </Typography>
                  <Typography sx={{ 
                    fontSize: '0.8rem',
                    opacity: 0.7,
                    textAlign: 'center'
                  }}>
                    {drifter.special_abilities ? 'Special' : 'Available'}
                  </Typography>
                </Button>
              )) : (
                <Box sx={{
                  gridColumn: '1 / -1',
                  textAlign: 'center',
                  py: 4,
                  color: '#b0bec5'
                }}>
                  <Typography sx={{ fontSize: '1rem', mb: 1 }}>
                    No drifters found
                  </Typography>
                  <Typography sx={{ fontSize: '0.9rem', opacity: 0.7 }}>
                    Try adjusting your search term
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
          
          <DialogActions sx={{ p: 2, justifyContent: 'center' }}>
            <Button
              onClick={() => {
                setShowDrifterModal(false);
                setDrifterSearchTerm('');
              }}
              sx={{
                color: '#b0bec5',
                '&:hover': {
                  color: '#ffffff',
                  background: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>

        {/* Tier Selection Dialog */}
        <Dialog
          open={tierDialogOpen}
          onClose={() => setTierDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">
                Select Tier and Level for {selectedGearForTier?.gearItem?.base_name}
              </Typography>
              <IconButton onClick={() => setTierDialogOpen(false)}>
                <Close />
              </IconButton>
            </Stack>
          </DialogTitle>
          <DialogContent>
            {selectedGearForTier && (
              <Stack spacing={3}>
                {/* Item Info */}
                <Box sx={{ 
                  p: 2, 
                  bgcolor: 'grey.800', 
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: `${getRarityBorderColor(selectedGearForTier.gearItem.rarity)}`
                }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ bgcolor: `${getRarityBorderColor(selectedGearForTier.gearItem.rarity)}` }}>
                      <Inventory2 />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight="bold" color="white">
                        {selectedGearForTier.gearItem.base_name}
                      </Typography>
                      <Typography variant="body2" color="grey.300">
                        {selectedGearForTier.gearItem.skill_name} • {selectedGearForTier.gearItem.gear_type.category} • {selectedGearForTier.gearItem.rarity}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>

                {/* Tier Selection Grid */}
                <Box>
                  {/* Item Level Selection */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
                      Item Level:
                    </Typography>
                    <TextField
                      type="number"
                      value={selectedItemLevel}
                      onChange={(e) => setSelectedItemLevel(parseInt(e.target.value) || 30)}
                      variant="outlined"
                      inputProps={{ min: 1, max: 999 }}
                      sx={{ 
                        minWidth: 120,
                        '& .MuiOutlinedInput-root': {
                          color: 'white',
                          '& fieldset': { borderColor: 'grey.600' },
                          '&:hover fieldset': { borderColor: 'grey.500' },
                          '&.Mui-focused fieldset': { borderColor: 'primary.main' }
                        },
                        '& .MuiInputBase-input': { color: 'white' }
                      }}
                    />
                  </Box>

                  <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
                    Choose Tier (affects Gear Power):
                  </Typography>
                  <Grid container spacing={2}>
                    {TIER_OPTIONS.map((tier) => {
                      const gearPower = getGearPower(tier.value, selectedGearForTier.gearItem.rarity, selectedItemLevel);
                      return (
                        <Grid item xs={6} sm={4} md={3} lg={2} key={tier.value}>
                          <Card
                            onClick={() => handleTierSelection(tier.value)}
                            sx={{
                              cursor: 'pointer',
                              border: '2px solid',
                              borderColor: 'primary.main',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: 3,
                                borderColor: 'primary.dark',
                              },
                            }}
                          >
                            <CardContent sx={{ textAlign: 'center', p: 1.5 }}>
                              {/* Tier Icon */}
                              <Box sx={{ mb: 1 }}>
                                <Box
                                  component="img"
                                  src={`/static/icons/tiers/tier${tier.value}.png`}
                                  alt={`Tier ${tier.value}`}
                                  sx={{
                                    width: 32,
                                    height: 32,
                                    objectFit: 'contain'
                                  }}
                                />
                              </Box>
                              <Typography variant="caption" fontWeight="bold" color="primary.main" sx={{ display: 'block' }}>
                                {tier.label}
                              </Typography>
                              <Typography variant="h6" fontWeight="bold" color="success.main" sx={{ my: 0.5 }}>
                                {gearPower}
                              </Typography>
                              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                                +{gearPower - tier.power} from {selectedGearForTier.gearItem.rarity}
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                      );
                    })}
                  </Grid>
                </Box>

                {/* Gear Power Formula */}
                <Alert severity="info" sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    <strong>Gear Power Formula:</strong><br/>
                    • Tier I: 20 (fixed)<br/>
                    • Tier II: 40 (fixed)<br/>
                    • Tier III: 70 (fixed)<br/>
                    • Tier IV+: 90 + (20 × (Tier − 4)) + Rarity Bonus<br/>
                    • Rarity Bonus: Common (+0), Rare (+12), Epic (+22), Legendary (+22)<br/>
                    • Level Bonus: 2 × (Item Level − 1)<br/>
                    • Total: Base + Rarity + Level
                  </Typography>
                </Alert>
                <Alert severity="warning" sx={{ mt: 1 }}>
                  <Typography variant="body2">
                    <strong>Note:</strong> This calculates only gear item power. Characters also have base power derived from level and in-game upgrades, which are excluded from this calculation.
                  </Typography>
                </Alert>
              </Stack>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setTierDialogOpen(false)}>
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Layout>
  );
}
