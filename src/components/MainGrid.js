import React, { useState, useEffect } from 'react';
import { Grid, Box, Typography, Card, CardContent, Stack, Button } from '@mui/material';
import { TrendingUp, TrendingDown, TrendingFlat, FlashOn } from '@mui/icons-material';
import StatCard from './StatCard';
import GuildMembersTable from './GuildMembersTable';
import RecentEvents from './RecentEvents';
import GearOverview from './GearOverview';
import GuildStats from './GuildStats';
import RecommendedBuilds from './RecommendedBuilds';
import { apiService } from '../services/api';

export default function MainGrid() {
  const [guildStats, setGuildStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const stats = await apiService.getGuildStats();
        setGuildStats(stats);
      } catch (error) {
        console.error('Error fetching guild stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const data = [
    {
      title: 'Guild Members',
      value: guildStats?.total_members?.toString() || '0',
      interval: 'Active players',
      data: [18, 19, 20, 22, 21, 23, 20, 22, 24, 23, 25, 24, 26, 25, 27, 26, 28, 27, 29, 28, 30, 29, 31, 30, 32, 31, 33, 32, 34, 33],
    },
    {
      title: 'Active Events',
      value: guildStats?.active_events?.toString() || '0',
      interval: 'This week',
      data: [3, 4, 5, 6, 5, 7, 6, 8, 7, 9, 8, 10, 9, 11, 10, 12, 11, 13, 12, 14, 13, 15, 14, 16, 15, 17, 16, 18, 17, 19],
    },
    {
      title: 'Gear Items',
      value: guildStats?.total_gear?.toString() || '0',
      interval: 'Total items',
      data: [120, 125, 130, 135, 132, 138, 140, 142, 145, 148, 150, 152, 154, 156, 155, 157, 156, 158, 157, 159, 158, 160, 159, 161, 160, 162, 161, 163, 162, 164],
    },
  ];
  return (
    <Box sx={{ width: '100%', maxWidth: { sm: "100%", md: "1700px" } }}>
      {/* Guild Overview Section */}
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Guild Overview
      </Typography>
      <Grid
        container
        spacing={2}
        columns={12}
        sx={{ mb: (theme) => theme.spacing(2) }}
      >
        {data.map((card, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatCard {...card} />
          </Grid>
        ))}
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <Card sx={{ bgcolor: 'primary.main', color: 'primary.contrastText' }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                <FlashOn />
                <Typography variant="h6">Guild Management</Typography>
              </Stack>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Manage your guild members, events, and gear with powerful tools.
              </Typography>
              <Button variant="contained" color="inherit" size="small">
                Manage Guild
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <GuildMembersTable />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <RecentEvents />
        </Grid>
      </Grid>

      {/* Guild Management Section */}
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Guild Management
      </Typography>
      <Grid container spacing={2} columns={12}>
        <Grid size={{ xs: 12, lg: 9 }}>
          <GearOverview />
        </Grid>
        <Grid size={{ xs: 12, lg: 3 }}>
          <Stack gap={2} direction={{ xs: 'column', sm: 'row', lg: 'column' }}>
            <GuildStats />
            <RecommendedBuilds />
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}
