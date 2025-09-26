import React from 'react';
import { Card, CardContent, Typography, Box, Stack, Chip } from '@mui/material';
import { TrendingUp, TrendingDown, TrendingFlat } from '@mui/icons-material';

export default function StatCard({ title, value, interval, data, icon, color = 'primary', percentageChange }) {
  const getTrendPercentage = () => {
    // Use the real percentage from the API if available
    if (percentageChange !== undefined && percentageChange !== null) {
      return { 
        value: percentageChange, 
        display: `${percentageChange > 0 ? '+' : ''}${percentageChange.toFixed(1)}%` 
      };
    }
    
    // Fallback to calculating from data array if percentageChange not provided
    if (!data || data.length < 2) return { value: 0, display: '' };
    const current = data[data.length - 1];
    const previous = data[data.length - 2];
    
    // Handle special case: going from 0 to any number = +100%
    if (previous === 0 && current > 0) {
      return { value: 100, display: '+100%' };
    }
    
    // Handle case: both are 0 = no change
    if (previous === 0 && current === 0) {
      return { value: 0, display: '0%' };
    }
    
    // Normal percentage calculation
    const change = ((current - previous) / previous) * 100;
    return { 
      value: change, 
      display: `${change > 0 ? '+' : ''}${change.toFixed(1)}%` 
    };
  };

  const trendInfo = getTrendPercentage();
  const actualTrendValue = trendInfo.value;

  const getTrendColor = () => {
    if (actualTrendValue > 0) return 'success.main';
    if (actualTrendValue < 0) return 'error.main';
    return 'text.secondary'; // Neutral
  };

  const getTrendIcon = () => {
    if (actualTrendValue > 0) return <TrendingUp fontSize="small" />;
    if (actualTrendValue < 0) return <TrendingDown fontSize="small" />;
    return <TrendingFlat fontSize="small" />; // Neutral
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
              {trendInfo.display && (
                <Chip
                  icon={getTrendIcon()}
                  label={trendInfo.display}
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
              )}
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
