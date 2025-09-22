import React from 'react';
import { Grid, Box, Typography, Card, CardContent, Stack } from '@mui/material';
import { TrendingUp, TrendingDown, TrendingFlat } from '@mui/icons-material';
import StatCard from './StatCard';
import GuildMembersTable from './GuildMembersTable';
import RecentActivity from './RecentActivity';

const guildStats = [
  {
    title: 'Active Members',
    value: '24',
    interval: 'Last 30 days',
    trend: 'up',
    icon: <TrendingUp />,
    color: 'success',
  },
  {
    title: 'Loadouts Created',
    value: '156',
    interval: 'Last 30 days',
    trend: 'up',
    icon: <TrendingUp />,
    color: 'primary',
  },
  {
    title: 'Discord Activity',
    value: '89%',
    interval: 'Last 7 days',
    trend: 'neutral',
    icon: <TrendingFlat />,
    color: 'info',
  },
  {
    title: 'Guild Events',
    value: '12',
    interval: 'This month',
    trend: 'down',
    icon: <TrendingDown />,
    color: 'warning',
  },
];

export default function MainGrid() {
  return (
    <Box sx={{ width: '100%', maxWidth: { sm: "100%", md: "1700px" } }}>
      {/* Guild Overview Cards */}
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Guild Overview
      </Typography>
      <Grid
        container
        spacing={2}
        columns={12}
        sx={{ mb: (theme) => theme.spacing(2) }}
      >
        {guildStats.map((stat, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatCard {...stat} />
          </Grid>
        ))}
      </Grid>

      {/* Main Content Grid */}
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Guild Management
      </Typography>
      <Grid container spacing={2} columns={12}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <GuildMembersTable />
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }}>
          <Stack gap={2}>
            <RecentActivity />
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Quick Actions
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Manage your guild efficiently with these quick actions.
                </Typography>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}
