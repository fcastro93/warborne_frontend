import React from 'react';
import { Stack, Typography, Breadcrumbs, Link, TextField, InputAdornment, IconButton, Box, Avatar } from '@mui/material';
import { NavigateNext, Search, NotificationsRounded, SettingsBrightness } from '@mui/icons-material';
import ColorModeIconDropdown from './ColorModeIconDropdown';

export default function Header() {
  return (
    <Stack
      direction="row"
      sx={{
        display: { xs: 'none', md: 'flex' },
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        maxWidth: { sm: '100%', md: '1700px' },
        py: 2,
        px: 3,
      }}
      spacing={2}
    >
      {/* Left side - Guild branding */}
      <Stack direction="row" alignItems="center" spacing={2}>
        <Avatar
          sx={{
            width: 40,
            height: 40,
            bgcolor: 'primary.main',
            fontWeight: 'bold',
            fontSize: '1.2rem',
          }}
        >
          V
        </Avatar>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary', lineHeight: 1.2 }}>
            Warborne Guild
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
            Guild Management Tools
          </Typography>
        </Box>
      </Stack>

      {/* Right side - Search and actions */}
      <Stack direction="row" sx={{ gap: 1, alignItems: 'center' }}>
        <TextField
          size="small"
          placeholder="Search players, events, gear..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ 
            minWidth: 280,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
            }
          }}
        />
        <IconButton sx={{ color: 'text.secondary' }}>
          <NotificationsRounded />
        </IconButton>
        <ColorModeIconDropdown />
      </Stack>
    </Stack>
  );
}
