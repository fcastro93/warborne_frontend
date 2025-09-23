import React from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import Layout from './Layout';

export default function PlayerLoadout() {
  const { playerId } = useParams();

  return (
    <Layout>
      <Box sx={{ p: 3 }}>
        {/* Header with Back Button */}
        <Box sx={{ mb: 3 }}>
          <Button 
            startIcon={<ArrowBack />} 
            onClick={() => window.history.back()}
            sx={{ mb: 2 }}
          >
            Back
          </Button>
          
          <Typography variant="h4" component="h1" sx={{ mb: 1 }}>
            Player Loadout
          </Typography>
          
          <Typography variant="body1" color="text.secondary">
            Player ID: {playerId}
          </Typography>
        </Box>

        {/* Placeholder content */}
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            New Player Loadout Page
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This page will be replaced with new content
          </Typography>
        </Box>
      </Box>
    </Layout>
  );
}
