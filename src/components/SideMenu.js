import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { styled } from '@mui/material/styles';
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
import Avatar from '@mui/material/Avatar';
import { useAuth } from '../contexts/AuthContext';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import RecommendRoundedIcon from '@mui/icons-material/RecommendRounded';
import EventRoundedIcon from '@mui/icons-material/EventRounded';
import AnalyticsRoundedIcon from '@mui/icons-material/AnalyticsRounded';
import SmartToyRoundedIcon from '@mui/icons-material/SmartToyRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import SecurityRoundedIcon from '@mui/icons-material/SecurityRounded';
import InventoryRoundedIcon from '@mui/icons-material/InventoryRounded';

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
  { text: 'Rec. Builds', icon: <RecommendRoundedIcon />, path: '/recbuilds' },
  { text: 'Events', icon: <EventRoundedIcon />, path: '/events' },
  { text: 'Blueprints', icon: <InventoryRoundedIcon />, path: '/blueprints' },
  { text: 'Analytics', icon: <AnalyticsRoundedIcon />, path: '/analytics' },
];

const secondaryListItems = [
  { text: 'Discord Bot', icon: <SmartToyRoundedIcon />, path: '/discord-bot-config' },
  { text: 'User Management', icon: <SecurityRoundedIcon />, path: '/users' },
  { text: 'Settings', icon: <SettingsRoundedIcon />, path: '/settings' },
];

export default function SideMenu() {
  const location = useLocation();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

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
          justifyContent: 'center',
          alignItems: 'center',
          mt: 'calc(var(--template-frame-height, 0px) + 4px)',
          p: 2,
        }}
      >
        <Avatar
          src="/violence-logo.png"
          alt="Violence Guild"
          sx={{
            width: 120,
            height: 120,
          }}
        />
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
      
      {/* Logout button at bottom */}
      <Box sx={{ mt: 'auto', p: 2 }}>
        <Divider sx={{ mb: 2 }} />
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout} sx={{ borderRadius: 1 }}>
            <ListItemIcon>
              <LogoutRoundedIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </Box>
    </Drawer>
  );
}
