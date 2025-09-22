import React from 'react';
import { Card, CardContent, Typography, Box, Stack, Chip } from '@mui/material';
import { TrendingUp, TrendingDown, TrendingFlat } from '@mui/icons-material';

export default function StatCard({ title, value, interval, trend, data, icon, color = 'primary' }) {
  const getTrendColor = () => {
    switch (trend) {
      case 'up': return 'success.main';
      case 'down': return 'error.main';
      default: return 'text.secondary';
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up': return <TrendingUp fontSize="small" />;
      case 'down': return <TrendingDown fontSize="small" />;
      default: return <TrendingFlat fontSize="small" />;
    }
  };

  const getTrendPercentage = () => {
    if (!data || data.length < 2) return '';
    const current = data[data.length - 1];
    const previous = data[data.length - 2];
    const change = ((current - previous) / previous) * 100;
    return `${change > 0 ? '+' : ''}${change.toFixed(1)}%`;
  };

  return (
    <Card 
      sx={{ 
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: `linear-gradient(90deg, ${getTrendColor()}, ${getTrendColor()}40)`,
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
          <Box>
            <Typography color="text.secondary" gutterBottom variant="body2" sx={{ fontWeight: 500 }}>
              {title}
            </Typography>
            <Typography variant="h4" component="div" sx={{ fontWeight: 700, mb: 1 }}>
              {value}
            </Typography>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Chip
                icon={getTrendIcon()}
                label={getTrendPercentage()}
                size="small"
                sx={{
                  backgroundColor: getTrendColor(),
                  color: 'white',
                  fontWeight: 600,
                  '& .MuiChip-icon': {
                    color: 'white',
                  },
                }}
              />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                {interval}
              </Typography>
            </Stack>
          </Box>
          <Box
            sx={{
              color: `${color}.main`,
              opacity: 0.8,
              fontSize: '2rem',
            }}
          >
            {icon}
          </Box>
        </Stack>
        
        {/* Mini chart */}
        {data && data.length > 0 && (
          <Box sx={{ height: 40, mt: 2 }}>
            <svg width="100%" height="100%" viewBox="0 0 100 40" preserveAspectRatio="none">
              <polyline
                fill="none"
                stroke={getTrendColor()}
                strokeWidth="2"
                points={data.map((value, index) => {
                  const x = (index / (data.length - 1)) * 100;
                  const y = 40 - ((value / Math.max(...data)) * 40);
                  return `${x},${y}`;
                }).join(' ')}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
