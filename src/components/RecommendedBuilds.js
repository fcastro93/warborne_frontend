import React from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemText, ListItemIcon, Chip, Box, Button } from '@mui/material';
import { Build, Shield, LocalFireDepartment, Healing, Star } from '@mui/icons-material';

const builds = [
  {
    id: 1,
    title: 'Tank Build',
    role: 'Tank',
    drifter: 'Guardian',
    description: 'High defense and health build for frontline combat',
    gear: ['Guardian Shield', 'Heavy Armor', 'Defense Boots'],
    mods: ['Defense Boost', 'Health Regen', 'Shield Wall'],
    rating: 4.8,
    usage: 'High'
  },
  {
    id: 2,
    title: 'DPS Build',
    role: 'Ranged DPS',
    drifter: 'Ranger',
    description: 'Maximum damage output with mobility',
    gear: ['Flame Bow', 'Light Armor', 'Speed Boots'],
    mods: ['Damage Boost', 'Critical Hit', 'Fire Damage'],
    rating: 4.6,
    usage: 'High'
  },
  {
    id: 3,
    title: 'Healer Build',
    role: 'Healer',
    drifter: 'Priest',
    description: 'Support build focused on healing and buffs',
    gear: ['Healing Staff', 'Robe', 'Mana Boots'],
    mods: ['Healing Boost', 'Mana Regen', 'Group Heal'],
    rating: 4.7,
    usage: 'Medium'
  },
  {
    id: 4,
    title: 'Hybrid Build',
    role: 'Offensive Support',
    drifter: 'Paladin',
    description: 'Balanced build for damage and support',
    gear: ['War Hammer', 'Medium Armor', 'Balanced Boots'],
    mods: ['Damage Boost', 'Healing Aura', 'Group Buff'],
    rating: 4.4,
    usage: 'Low'
  }
];

const getRoleIcon = (role) => {
  switch (role) {
    case 'Tank':
    case 'Defensive Tank':
    case 'Offensive Tank':
      return <Shield color="primary" />;
    case 'Healer':
    case 'Defensive Support':
      return <Healing color="success" />;
    case 'Ranged DPS':
    case 'Melee DPS':
    case 'Offensive Support':
      return <LocalFireDepartment color="error" />;
    default:
      return <Build color="action" />;
  }
};

const getUsageColor = (usage) => {
  switch (usage) {
    case 'High': return 'success';
    case 'Medium': return 'warning';
    case 'Low': return 'default';
    default: return 'default';
  }
};

export default function RecommendedBuilds() {
  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            Recommended Builds
          </Typography>
          <Button size="small" variant="outlined">
            View All
          </Button>
        </Box>
        <List>
          {builds.map((build) => (
            <ListItem key={build.id} sx={{ py: 1, px: 0 }}>
              <ListItemIcon>
                {getRoleIcon(build.role)}
              </ListItemIcon>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Typography variant="body2" fontWeight="medium">
                      {build.title}
                    </Typography>
                    <Chip
                      label={build.usage}
                      color={getUsageColor(build.usage)}
                      size="small"
                    />
                  </Box>
                }
                secondary={
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
                      {build.drifter} • {build.role}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                      {build.description}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <Star sx={{ fontSize: 16, color: 'warning.main' }} />
                      <Typography variant="caption" color="text.secondary">
                        {build.rating}/5.0
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {build.gear.slice(0, 2).map((item, index) => (
                        <Chip
                          key={index}
                          label={item}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: '0.7rem' }}
                        />
                      ))}
                      {build.gear.length > 2 && (
                        <Chip
                          label={`+${build.gear.length - 2} more`}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: '0.7rem' }}
                        />
                      )}
                    </Box>
                  </Box>
                }
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}
