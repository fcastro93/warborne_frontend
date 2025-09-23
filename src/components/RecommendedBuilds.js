import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Paper, Avatar, Chip, IconButton, Tabs, Tab, Grid, Card, CardContent, TextField, InputAdornment, Stack, Divider, Badge, Alert, FormControl, Select, MenuItem, InputLabel, List, ListItem, ListItemText, ListItemIcon, ListItemButton, ListSubheader, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { ArrowBack, Add, Inventory2, Person, Search, Close, Edit, Check, Cancel, FilterList, LocalFireDepartment, Shield, Healing, Speed, FlashOn, MilitaryTech, Public, WorkspacePremium, Inventory, Security, Star, Diamond, AutoAwesome } from '@mui/icons-material';
import Layout from './Layout';
import { apiService } from '../services/api';

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

export default function RecommendedBuilds() {
  const { buildId } = useParams();
  const navigate = useNavigate();
  const [currentBuild, setCurrentBuild] = useState(null);
  const [recommendedBuilds, setRecommendedBuilds] = useState([]);
  const [drifters, setDrifters] = useState([]);
  const [allDrifters, setAllDrifters] = useState([]);
  const [gearItems, setGearItems] = useState([]);
  const [activeDrifterTab, setActiveDrifterTab] = useState(0);
  const [activeItemTab, setActiveItemTab] = useState(0);
  const [activeAttributeTab, setActiveAttributeTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRarity, setFilterRarity] = useState('all');
  const [filterStat, setFilterStat] = useState('all');
  const [filterWeaponType, setFilterWeaponType] = useState('all');
  const [skillModalOpen, setSkillModalOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [showDrifterModal, setShowDrifterModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const slotLabels = [
    'Weapon', 'Helmet', 'Chest', 'Boots', 'Consumable',
    'Mod 1', 'Mod 2', 'Mod 3', 'Mod 4'
  ];

  useEffect(() => {
    fetchData();
  }, []);

  // Reset rarity filter if current selection is not available in the category
  useEffect(() => {
    const availableRarities = getAvailableRarities();
    if (!availableRarities.includes(filterRarity)) {
      setFilterRarity('all');
    }
  }, [activeItemTab, gearItems]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch recommended builds
      const buildsData = await apiService.getRecommendedBuilds();
      console.log('Recommended builds data:', buildsData);
      setRecommendedBuilds(buildsData.builds || []);

      // If buildId is provided, find and set the current build
      if (buildId && buildsData.builds) {
        const build = buildsData.builds.find(b => b.id === parseInt(buildId));
        if (build) {
          setCurrentBuild(build);
          // Set up the drifter data from the build
          if (build.drifter) {
            setDrifters([{
              ...build.drifter,
              number: 1,
              gear_slots: [
                build.weapon ? { gear_item: build.weapon, gear_type: { category: 'weapon' } } : null,
                build.helmet ? { gear_item: build.helmet, gear_type: { category: 'helmet' } } : null,
                build.chest ? { gear_item: build.chest, gear_type: { category: 'chest' } } : null,
                build.boots ? { gear_item: build.boots, gear_type: { category: 'boots' } } : null,
                build.consumable ? { gear_item: build.consumable, gear_type: { category: 'consumable' } } : null,
                build.mod1 ? { gear_item: build.mod1, gear_type: { category: 'mod' } } : null,
                build.mod2 ? { gear_item: build.mod2, gear_type: { category: 'mod' } } : null,
                build.mod3 ? { gear_item: build.mod3, gear_type: { category: 'mod' } } : null,
                build.mod4 ? { gear_item: build.mod4, gear_type: { category: 'mod' } } : null
              ]
            }]);
          }
        } else {
          // Build not found, redirect to list
          navigate('/recbuilds');
          return;
        }
      }

      // Fetch gear items data
      const gearData = await apiService.getGearItems();
      console.log('Gear items data:', gearData);
      // The API returns the array directly, not wrapped in a gear_items property
      setGearItems(Array.isArray(gearData) ? gearData : (gearData.gear_items || []));

      // Fetch all available drifters
      const allDriftersData = await apiService.getAllDrifters();
      console.log('All drifters data:', allDriftersData);
      setAllDrifters(allDriftersData.drifters || []);

      // Initialize with first drifter selected if no buildId
      if (!buildId && allDriftersData.drifters && allDriftersData.drifters.length > 0) {
        setDrifters([allDriftersData.drifters[0]]);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
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


  const showSkillModal = (skillName, description, gameId) => {
    setSelectedSkill({ skillName, description, gameId });
    setSkillModalOpen(true);
  };

  const closeSkillModal = () => {
    setSkillModalOpen(false);
    setSelectedSkill(null);
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
            Loading recommended builds...
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
        {/* Build Header - Only show when viewing specific build */}
        {buildId && currentBuild && (
          <Box sx={{ mb: 3, textAlign: 'center' }}>
            <Button
              onClick={() => navigate('/recbuilds')}
              startIcon={<ArrowBack />}
              sx={{
                color: '#64b5f6',
                mb: 2,
                '&:hover': {
                  bgcolor: 'rgba(100, 181, 246, 0.1)'
                }
              }}
            >
              Back to Builds
            </Button>
            <Typography variant="h4" sx={{
              color: '#64b5f6',
              fontWeight: 'bold',
              mb: 1,
              textShadow: '0 0 20px rgba(100, 181, 246, 0.5)'
            }}>
              {currentBuild.title}
            </Typography>
            <Typography variant="h6" sx={{ color: '#b0bec5', mb: 1 }}>
              {currentBuild.role?.charAt(0).toUpperCase() + currentBuild.role?.slice(1)} Build
            </Typography>
            {currentBuild.description && (
              <Typography sx={{ color: '#90caf9', maxWidth: '600px', mx: 'auto' }}>
                {currentBuild.description}
              </Typography>
            )}
          </Box>
        )}

        {/* Container with 2 panels - 50% each */}
        <Box sx={{
          display: { xs: 'block', md: 'grid' },
          gridTemplateColumns: { md: '1fr 1fr' },  // 50% / 50%
          gap: 2.5,
          minHeight: 'calc(100vh - 40px)'
        }}>

          {/* LEFT PANEL - Drifter Loadouts */}
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
                      return (
                        <Box
                          key={i}
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
                            cursor: 'default',
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
                                      e.target.nextSibling.style.display = 'flex';
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
                        // For recommended builds, this could show item details or add to favorites
                        console.log('Item selected:', item);
                      }}
                      sx={{
                        background: '#64b5f6',
                        color: 'white',
                        p: '4px 8px',
                        borderRadius: 0.5,
                        cursor: 'pointer',
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          background: '#42a5f5'
                        }
                      }}
                    >
                      View Details
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
                onClick={() => {
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
              
              {allDrifters.map((drifter, index) => (
                <Button
                  key={index}
                  onClick={() => {
                    // Update local state
                    const updatedDrifters = [...drifters];
                    updatedDrifters[activeDrifterTab] = {
                      ...drifter,
                      number: activeDrifterTab + 1,
                      gear_slots: updatedDrifters[activeDrifterTab]?.gear_slots || new Array(9).fill(null)
                    };
                    setDrifters(updatedDrifters);
                    setShowDrifterModal(false);
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
              ))}
            </Box>
          </Box>
          
          <DialogActions sx={{ p: 2, justifyContent: 'center' }}>
            <Button
              onClick={() => setShowDrifterModal(false)}
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
      </Box>
    </Layout>
  );
}
