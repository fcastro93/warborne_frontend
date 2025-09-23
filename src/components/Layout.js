import React from 'react';
import { Box } from '@mui/material';
import SideMenu from './SideMenu';

export default function Layout({ children }) {
  return (
    <Box sx={{ display: 'flex' }}>
      <SideMenu />
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
