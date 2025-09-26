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

  const data = [
    {
      title: 'Guild Members',
      value: guildStats?.total_members?.toString() || '0',
      interval: 'vs. last week',
      data: guildStats?.member_growth ? [guildStats.member_growth.last_week, guildStats.member_growth.current] : [0, 0],
      percentageChange: guildStats?.member_growth?.percentage_change || 0,
    },
    {
      title: 'Active Events',
      value: guildStats?.active_events?.toString() || '0',
      interval: 'vs. last week',
      data: guildStats?.event_growth ? [guildStats.event_growth.last_week, guildStats.event_growth.current] : [0, 0],
      percentageChange: guildStats?.event_growth?.percentage_change || 0,
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
            <StatCard {...card} percentageChange={card.percentageChange} />
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
