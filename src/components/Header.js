import React from 'react';
import { Stack, Typography, Breadcrumbs, FormControl, InputAdornment, OutlinedInput, Badge, IconButton } from '@mui/material';
import { NavigateNextRounded, SearchRounded, NotificationsRounded } from '@mui/icons-material';
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
        aria-label="breadcrumb"
        separator={<NavigateNextRounded fontSize="small" />}
        sx={{
          margin: (theme) => theme.spacing(1, 0),
          '& .MuiBreadcrumbs-separator': {
            color: 'action.disabled',
            margin: 1,
          },
          '& .MuiBreadcrumbs-ol': {
            alignItems: 'center',
          },
        }}
      >
        <Typography variant="body1">Dashboard</Typography>
        <Typography variant="body1" sx={{ color: 'text.primary', fontWeight: 600 }}>
          Home
        </Typography>
      </Breadcrumbs>
      <Stack direction="row" sx={{ gap: 1 }}>
        <FormControl sx={{ width: { xs: '100%', md: '25ch' } }} variant="outlined">
          <OutlinedInput
            size="small"
            id="search"
            placeholder="Search…"
            sx={{ flexGrow: 1 }}
            startAdornment={
              <InputAdornment position="start" sx={{ color: 'text.primary' }}>
                <SearchRounded fontSize="small" />
              </InputAdornment>
            }
            inputProps={{
              'aria-label': 'search',
            }}
          />
        </FormControl>
        <Badge
          color="error"
          variant="dot"
          invisible={false}
          sx={{ '& .MuiBadge-badge': { right: 2, top: 2 } }}
        >
          <IconButton size="small" aria-label="Open notifications">
            <NotificationsRounded />
          </IconButton>
        </Badge>
        <ColorModeIconDropdown />
      </Stack>
    </Stack>
  );
}
