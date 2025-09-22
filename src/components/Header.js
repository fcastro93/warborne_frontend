import React from 'react';
import { Stack, Typography, Breadcrumbs, Link, TextField, InputAdornment, IconButton } from '@mui/material';
import { NavigateNext, Search, NotificationsRounded, SettingsBrightness } from '@mui/icons-material';
import ColorModeIconDropdown from './ColorModeIconDropdown';

export default function Header() {
  return (
    <Stack
      direction="row"
      sx={{
        display: { xs: 'none', md: 'flex' },
        width: '100%',
        alignItems: { xs: 'flex-start', md: 'center' },
        justifyContent: 'space-between',
        maxWidth: { sm: '100%', md: '1700px' },
        pt: 1.5,
      }}
      spacing={2}
    >
      <Breadcrumbs
        separator={<NavigateNext fontSize="small" />}
        aria-label="breadcrumb"
      >
        <Link underline="hover" color="inherit" href="/">
          Dashboard
        </Link>
        <Typography color="text.primary">Home</Typography>
      </Breadcrumbs>
      <Stack direction="row" sx={{ gap: 1 }}>
        <TextField
          size="small"
          placeholder="Search..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: 200 }}
        />
        <IconButton>
          <NotificationsRounded />
        </IconButton>
        <ColorModeIconDropdown />
      </Stack>
    </Stack>
  );
}
