import React from 'react';
import { Box, Stack } from '@mui/material';
import { alpha } from '@mui/material/styles';
import SideMenu from './SideMenu';
import AppNavbar from './AppNavbar';
import Header from './Header';
import MainGrid from './MainGrid';
import AppTheme from './AppTheme';

export default function Dashboard() {
  return (
    <AppTheme>
      <Box sx={{ display: 'flex' }}>
        <SideMenu />
        <AppNavbar />
        {/* Main content */}
        <Box
          component="main"
          sx={(theme) => ({
            flexGrow: 1,
            backgroundColor: theme.vars
              ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
              : alpha(theme.palette.background.default, 1),
            overflow: 'auto',
          })}
        >
          <Stack
            spacing={2}
            sx={{
              alignItems: 'center',
              mx: 3,
              pb: 5,
              mt: { xs: 8, md: 0 },
            }}
          >
            <Header />
            <MainGrid />
          </Stack>
        </Box>
      </Box>
    </AppTheme>
  );
}
