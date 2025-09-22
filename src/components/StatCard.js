import React from 'react';
import { Card, CardContent, Typography, Box, Stack } from '@mui/material';

export default function StatCard({ title, value, interval, trend, icon, color = 'primary' }) {
  const getTrendColor = () => {
    switch (trend) {
      case 'up': return 'success.main';
      case 'down': return 'error.main';
      default: return 'text.secondary';
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up': return '↗';
      case 'down': return '↘';
      default: return '→';
    }
  };

  return (
    <Card>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography color="text.secondary" gutterBottom variant="body2">
              {title}
            </Typography>
            <Typography variant="h4" component="div">
              {value}
            </Typography>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <Typography 
                variant="body2" 
                sx={{ color: getTrendColor() }}
              >
                {getTrendIcon()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {interval}
              </Typography>
            </Stack>
          </Box>
          <Box
            sx={{
              color: `${color}.main`,
              opacity: 0.8,
            }}
          >
            {icon}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
