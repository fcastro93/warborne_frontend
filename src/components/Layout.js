import React from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import { Logout as LogoutIcon } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import SideMenu from './SideMenu';

export default function Layout({ children }) {
  const { logout, isAuthenticated } = useAuth();

  // If user is not authenticated, don't show the menu
  if (!isAuthenticated) {
    return (
      <Box sx={{ width: '100%', minHeight: '100vh' }}>
        {children}
      </Box>
    );
  }

  // If user is authenticated, show the full layout with menu
  return (
    <Box sx={{ display: 'flex' }}>
      <SideMenu />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          backgroundColor: 'background.default',
          overflow: 'auto',
          position: 'relative',
        }}
      >
        {/* Logout Button */}
        <Tooltip title="Logout">
          <IconButton
            onClick={logout}
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              zIndex: 1000,
              bgcolor: 'background.paper',
              boxShadow: 1,
              '&:hover': {
                bgcolor: 'action.hover',
              },
            }}
          >
            <LogoutIcon />
          </IconButton>
        </Tooltip>
        
        {children}
      </Box>
    </Box>
  );
}
