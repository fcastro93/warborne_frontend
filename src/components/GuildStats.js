import React from 'react';
import { Card, CardContent, Typography, Box, Chip, Stack } from '@mui/material';
import { Group, Event, Build, TrendingUp } from '@mui/icons-material';

const stats = [
  {
    title: 'Total Members',
    value: '24',
    icon: <Group color="primary" />,
    trend: '+3 this week'
  },
  {
    title: 'Active Events',
    value: '8',
    icon: <Event color="success" />,
    trend: '+2 this week'
  },
  {
    title: 'Gear Items',
    value: '156',
    icon: <Build color="warning" />,
    trend: '+12 this week'
  },
  {
    title: 'Activity Score',
    value: '94%',
    icon: <TrendingUp color="info" />,
    trend: '+5% this week'
  }
];

const factionStats = [
  { name: 'Emberwild', count: 8, color: 'error' },
  { name: 'Ashen', count: 6, color: 'default' },
  { name: 'Sirius', count: 4, color: 'info' },
  { name: 'Magnates', count: 3, color: 'warning' },
  { name: 'Ironcreed', count: 2, color: 'secondary' },
  { name: 'Shroud', count: 1, color: 'primary' }
];

export default function GuildStats() {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Guild Statistics
        </Typography>
        <Stack spacing={2}>
          {stats.map((stat, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ color: 'primary.main' }}>
                {stat.icon}
              </Box>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  {stat.title}
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  {stat.value}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {stat.trend}
                </Typography>
              </Box>
            </Box>
          ))}
        </Stack>
        
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Faction Distribution
          </Typography>
          <Stack spacing={1}>
            {factionStats.map((faction, index) => (
              <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2">
                  {faction.name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      width: 60,
                      height: 8,
                      bgcolor: 'grey.200',
                      borderRadius: 1,
                      overflow: 'hidden'
                    }}
                  >
                    <Box
                      sx={{
                        width: `${(faction.count / 24) * 100}%`,
                        height: '100%',
                        bgcolor: `${faction.color}.main`,
                        borderRadius: 1
                      }}
                    />
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {faction.count}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
}
