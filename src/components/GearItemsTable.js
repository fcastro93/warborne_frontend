import React, { useState, useEffect } from 'react';
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  Box,
  Stack,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  LocalFireDepartment,
  Shield,
  Diamond,
  Add,
  Star,
  AutoAwesome,
} from '@mui/icons-material';
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
    default: return <LocalFireDepartment />;
  }
};

export default function GearItemsTable() {
  const [gearItems, setGearItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRarity, setFilterRarity] = useState('all');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    fetchGearItems();
  }, []);

  const fetchGearItems = async () => {
    try {
      const data = await apiService.getGearItems();
      setGearItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching gear items:', error);
      // Use fallback data
      setGearItems([
        {
          id: 1,
          name: 'Energizer Boots',
          skill_name: 'Vitality',
          type: 'boots',
          rarity: 'rare',
          damage: 9.6,
          defense: 0,
          health_bonus: 675,
          description: 'Boots that provide energy and vitality bonuses',
        },
        {
          id: 2,
          name: 'Bulwark Striders',
          skill_name: 'Guardian',
          type: 'boots',
          rarity: 'epic',
          damage: 9.8,
          defense: 0,
          health_bonus: 714,
          description: 'Heavy boots for maximum protection',
        },
        {
          id: 3,
          name: 'Titan Walkers',
          skill_name: 'Titanic Growth',
          type: 'boots',
          rarity: 'epic',
          damage: 9.8,
          defense: 0,
          health_bonus: 714,
          description: 'Massive boots that enhance physical strength',
        },
        {
          id: 4,
          name: 'Vanguard\'s March',
          skill_name: 'Vanguard',
          type: 'boots',
          rarity: 'epic',
          damage: 9.8,
          defense: 0,
          health_bonus: 714,
          description: 'Military-grade boots for frontline combat',
        },
        {
          id: 5,
          name: 'Wrathstep',
          skill_name: 'Vengeance',
          type: 'boots',
          rarity: 'epic',
          damage: 9.8,
          defense: 0,
          health_bonus: 714,
          description: 'Boots that channel the power of vengeance',
        },
        {
          id: 6,
          name: 'Avalanche Boots',
          skill_name: 'Mountain Crash',
          type: 'boots',
          rarity: 'legendary',
          damage: 9.9,
          defense: 0,
          health_bonus: 755,
          description: 'Legendary boots with mountain-crushing power',
        },
        {
          id: 7,
          name: 'Impact Heavy Boots',
          skill_name: 'Lunge',
          type: 'boots',
          rarity: 'legendary',
          damage: 9.9,
          defense: 0,
          health_bonus: 755,
          description: 'Heavy boots designed for devastating impacts',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredGear = gearItems.filter(gear => {
    const matchesSearch = gear.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         gear.skill_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRarity = filterRarity === 'all' || gear.rarity === filterRarity;
    const matchesType = filterType === 'all' || gear.type === filterType;
    return matchesSearch && matchesRarity && matchesType;
  });

  if (loading) {
    return (
      <Box>
        <Typography>Loading gear items...</Typography>
      </Box>
    );
  }

  return (
    <TableContainer>
      <Table 
        sx={{
          minWidth: 650,
          '& .MuiTableRow-root': {
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
            },
          },
          '& .MuiTableCell-root': {
            borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
            padding: '8px 16px',
          },
          '& .MuiTableHead-root .MuiTableCell-root': {
            borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
            fontWeight: 600,
            fontSize: '0.875rem',
          },
        }}
        aria-label="gear items table"
      >
        <TableHead>
          <TableRow>
            <TableCell>Item</TableCell>
            <TableCell>Skill</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Rarity</TableCell>
            <TableCell>Stats</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredGear.map((gear) => (
            <TableRow key={gear.id}>
              <TableCell component="th" scope="row">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Avatar sx={{ bgcolor: `${getRarityColor(gear.rarity)}.main`, width: 32, height: 32 }}>
                    {getGearTypeIcon(gear.type)}
                  </Avatar>
                  <Box>
                    <Typography variant="body2" fontWeight="medium">
                      {gear.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {gear.description}
                    </Typography>
                  </Box>
                </Box>
              </TableCell>
              <TableCell>
                <Typography variant="body2">
                  {gear.skill_name || 'N/A'}
                </Typography>
              </TableCell>
              <TableCell>
                <Chip
                  label={gear.type}
                  size="small"
                  variant="outlined"
                />
              </TableCell>
              <TableCell>
                <Chip
                  icon={getRarityIcon(gear.rarity)}
                  label={gear.rarity}
                  color={getRarityColor(gear.rarity)}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <Stack spacing={0.5}>
                  {gear.damage > 0 && (
                    <Typography variant="caption" color="text.secondary">
                      Damage: +{gear.damage}%
                    </Typography>
                  )}
                  {gear.defense > 0 && (
                    <Typography variant="caption" color="text.secondary">
                      Defense: +{gear.defense}
                    </Typography>
                  )}
                  {gear.health_bonus > 0 && (
                    <Typography variant="caption" color="text.secondary">
                      HP: +{gear.health_bonus}
                    </Typography>
                  )}
                </Stack>
              </TableCell>
              <TableCell align="right">
                <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                  <Tooltip title="Equip">
                    <IconButton size="small" color="primary">
                      <Add fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
