import React, { useState, useEffect } from 'react';
import { Grid, Box, Typography } from '@mui/material';
import StatCard from './StatCard';
import GuildMembersTable from './GuildMembersTable';
import RecentEvents from './RecentEvents';
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

  // Helper function to generate weekly trend data
  const generateWeeklyTrendData = (currentValue) => {
    const num = parseInt(currentValue, 10);
    if (isNaN(num) || num < 0) return [];

    if (num === 0) {
      return [0, 0]; // No change if value is 0
    }

    // For weekly comparison, simulate last week's data
    // If current is 2, last week might have been 0 (new guild) or 1 (growth)
    if (num === 1) {
      return [0, 1]; // 0 to 1 = +100%
    } else if (num === 2) {
      return [0, 2]; // 0 to 2 = +100% (new guild)
    } else if (num >= 3) {
      return [Math.floor(num * 0.8), num]; // 20% growth week over week
    }
    
    return [num, num]; // No change
  };

  const data = [
    {
      title: 'Guild Members',
      value: guildStats?.total_members?.toString() || '0',
      interval: 'vs. last week',
      data: generateWeeklyTrendData(guildStats?.total_members),
    },
    {
      title: 'Active Events',
      value: guildStats?.active_events?.toString() || '0',
      interval: 'vs. last week',
      data: generateWeeklyTrendData(guildStats?.active_events),
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
          <Grid key={index} size={{ xs: 12, sm: 6, lg: 6 }}>
            <StatCard {...card} />
          </Grid>
        ))}
      </Grid>

      {/* Latest Members and Recent Events Section */}
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Latest Members & Recent Events
      </Typography>
      <Grid container spacing={2} columns={12}>
        <Grid size={{ xs: 12, md: 6 }}>
          <GuildMembersTable />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <RecentEvents />
        </Grid>
      </Grid>
    </Box>
  );
}
