import React from 'react';
import { Box } from '@mui/material';
import SideMenu from './SideMenu';
import AppNavbar from './AppNavbar';

export default function Layout({ children }) {
  return (
    <Box sx={{ display: 'flex' }}>
      <SideMenu />
      <AppNavbar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          backgroundColor: 'background.default',
          overflow: 'auto',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
