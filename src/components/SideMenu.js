import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import MuiDrawer, { drawerClasses } from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import BuildRoundedIcon from '@mui/icons-material/BuildRounded';
import RecommendRoundedIcon from '@mui/icons-material/RecommendRounded';
import EventRoundedIcon from '@mui/icons-material/EventRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';

const drawerWidth = 240;

const Drawer = styled(MuiDrawer)({
  width: drawerWidth,
  flexShrink: 0,
  boxSizing: 'border-box',
  mt: 10,
  [`& .${drawerClasses.paper}`]: {
    width: drawerWidth,
    boxSizing: 'border-box',
  },
});

const mainListItems = [
  { text: 'Dashboard', icon: <HomeRoundedIcon />, path: '/dashboard' },
  { text: 'Members', icon: <PeopleRoundedIcon />, path: '/members' },
  { text: 'Loadouts', icon: <BuildRoundedIcon />, path: '/loadouts' },
  { text: 'Rec. Builds', icon: <RecommendRoundedIcon />, path: '/recbuilds' },
  { text: 'Events', icon: <EventRoundedIcon />, path: '/events' },
];

const secondaryListItems = [
  { text: 'Settings', icon: <SettingsRoundedIcon />, path: '/settings' },
];

export default function SideMenu() {
  const location = useLocation();

  return (
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: 'none', md: 'block' },
        [`& .${drawerClasses.paper}`]: {
          backgroundColor: 'background.paper',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          mt: 'calc(var(--template-frame-height, 0px) + 4px)',
          p: 2,
          gap: 1.5,
        }}
      >
        <Avatar
          src="/violence-logo.png"
          alt="Violence Guild"
          sx={{
            width: 32,
            height: 32,
          }}
        />
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main', lineHeight: 1.2, fontSize: '1.1rem' }}>
            Warborne Guild
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
            Guild Tools
          </Typography>
        </Box>
      </Box>
      <Divider />
      <Box
        sx={{
          overflow: 'auto',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between' }}>
          <List dense>
            {mainListItems.map((item, index) => (
              <ListItem key={index} disablePadding sx={{ display: 'block' }}>
                <ListItemButton 
                  component={Link} 
                  to={item.path}
                  selected={location.pathname === item.path}
                  sx={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <List dense>
            {secondaryListItems.map((item, index) => (
              <ListItem key={index} disablePadding sx={{ display: 'block' }}>
                <ListItemButton 
                  component={Link} 
                  to={item.path}
                  selected={location.pathname === item.path}
                  sx={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Stack>
      </Box>
      <Stack
        direction="row"
        sx={{
          p: 2,
          gap: 1,
          alignItems: 'center',
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Avatar
          sizes="small"
          alt="Guild Master"
          sx={{ width: 36, height: 36, bgcolor: 'primary.main' }}
        >
          GM
        </Avatar>
        <Box sx={{ mr: 'auto' }}>
          <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: '16px' }}>
            Guild Master
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            violenceguild.duckdns.org
          </Typography>
        </Box>
      </Stack>
    </Drawer>
  );
}
