import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Box,
} from '@mui/material';
import {
  PersonAdd,
  Build,
  Event,
  Message,
} from '@mui/icons-material';

const activities = [
  {
    icon: <PersonAdd />,
    text: 'New member joined: RogueShadow',
    time: '2 hours ago',
  },
  {
    icon: <Build />,
    text: 'Loadout created: PvP Warrior Build',
    time: '4 hours ago',
  },
  {
    icon: <Event />,
    text: 'Guild event scheduled: Raid Night',
    time: '1 day ago',
  },
  {
    icon: <Message />,
    text: 'Discord announcement posted',
    time: '2 days ago',
  },
];

export default function RecentActivity() {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Recent Activity
        </Typography>
        <List>
          {activities.map((activity, index) => (
            <React.Fragment key={index}>
              <ListItem sx={{ px: 0 }}>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  {activity.icon}
                </ListItemIcon>
                <ListItemText
                  primary={activity.text}
                  secondary={activity.time}
                  primaryTypographyProps={{ variant: 'body2' }}
                  secondaryTypographyProps={{ variant: 'caption' }}
                />
              </ListItem>
              {index < activities.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}
