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
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import BuildIcon from '@mui/icons-material/Build';
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationsIcon from '@mui/icons-material/Notifications';

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

const menuItems = [
  { text: 'Dashboard', icon: <HomeIcon />, path: '/dashboard' },
  { text: 'Members', icon: <PeopleIcon />, path: '/members' },
  { text: 'Loadouts', icon: <BuildIcon />, path: '/loadouts' },
  { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
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
          mt: 'calc(var(--template-frame-height, 0px) + 4px)',
          p: 1.5,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Warborne Guild
        </Typography>
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
        <List>
          {menuItems.map((item) => (
            <ListItem 
              key={item.text} 
              component={Link} 
              to={item.path}
              sx={{
                textDecoration: 'none',
                color: 'inherit',
                backgroundColor: location.pathname === item.path ? 'primary.main' : 'transparent',
                '&:hover': {
                  backgroundColor: location.pathname === item.path ? 'primary.dark' : 'action.hover',
                },
                '& .MuiListItemIcon-root': {
                  color: location.pathname === item.path ? 'white' : 'inherit',
                },
                '& .MuiListItemText-primary': {
                  color: location.pathname === item.path ? 'white' : 'inherit',
                  fontWeight: location.pathname === item.path ? 600 : 400,
                },
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
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
