import React from 'react';
import { Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Box, Grid } from '@mui/material';
import { Build, Shield, LocalFireDepartment, Healing, Speed, Star } from '@mui/icons-material';

const gearItems = [
  {
    id: 1,
    name: 'Energizer Boots',
    skill: 'Vitality',
    type: 'armor',
    rarity: 'epic',
    level: 40,
    stats: { health: 150, energy: 50, speed: 10 },
    equipped: true,
    owner: 'ViolenceGuild'
  },
  {
    id: 2,
    name: 'Flame Sword',
    skill: 'Inferno',
    type: 'weapon',
    rarity: 'legendary',
    level: 45,
    stats: { damage: 200, fire: 50 },
    equipped: true,
    owner: 'ShadowStrike'
  },
  {
    id: 3,
    name: 'Healing Staff',
    skill: 'Restoration',
    type: 'weapon',
    rarity: 'rare',
    level: 35,
    stats: { healing: 100, mana: 75 },
    equipped: false,
    owner: 'HealMaster'
  },
  {
    id: 4,
    name: 'Guardian Shield',
    skill: 'Protection',
    type: 'armor',
    rarity: 'epic',
    level: 42,
    stats: { defense: 300, health: 100 },
    equipped: true,
    owner: 'TankQueen'
  },
  {
    id: 5,
    name: 'Speed Boots',
    skill: 'Swiftness',
    type: 'armor',
    rarity: 'uncommon',
    level: 30,
    stats: { speed: 25, agility: 15 },
    equipped: false,
    owner: 'DPSKing'
  }
];

const getRarityColor = (rarity) => {
  switch (rarity) {
    case 'common': return 'default';
    case 'uncommon': return 'success';
    case 'rare': return 'info';
    case 'epic': return 'warning';
    case 'legendary': return 'error';
    default: return 'default';
  }
};

const getTypeIcon = (type) => {
  switch (type) {
    case 'weapon': return <LocalFireDepartment color="error" />;
    case 'armor': return <Shield color="primary" />;
    case 'accessory': return <Star color="secondary" />;
    case 'vehicle': return <Speed color="info" />;
    case 'tactical': return <Build color="warning" />;
    default: return <Build color="action" />;
  }
};

const getStatIcon = (stat) => {
  switch (stat) {
    case 'health': return <Healing color="success" />;
    case 'damage': return <LocalFireDepartment color="error" />;
    case 'defense': return <Shield color="primary" />;
    case 'speed': return <Speed color="info" />;
    default: return <Star color="action" />;
  }
};

export default function GearOverview() {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Gear Overview
        </Typography>
        <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Item</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Rarity</TableCell>
                <TableCell>Level</TableCell>
                <TableCell>Stats</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Owner</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {gearItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {item.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {item.skill}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {getTypeIcon(item.type)}
                      <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                        {item.type}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={item.rarity}
                      color={getRarityColor(item.rarity)}
                      size="small"
                      sx={{ textTransform: 'capitalize' }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {item.level}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      {Object.entries(item.stats).map(([stat, value]) => (
                        <Box key={stat} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          {getStatIcon(stat)}
                          <Typography variant="caption">
                            {stat}: {value}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={item.equipped ? 'Equipped' : 'Available'}
                      color={item.equipped ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {item.owner}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}
