import React from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemText, ListItemIcon, Chip, Box, Avatar } from '@mui/material';
import { Event, Group, LocalFireDepartment, Shield, Healing, Schedule } from '@mui/icons-material';

const events = [
  {
    id: 1,
    title: 'Guild War - Emberwild vs Ashen',
    type: 'guild_war',
    datetime: '2024-09-25 20:00',
    participants: 15,
    maxParticipants: 20,
    status: 'upcoming',
    organizer: 'ViolenceGuild'
  },
  {
    id: 2,
    title: 'Boss Raid - Ancient Dragon',
    type: 'boss_raid',
    datetime: '2024-09-24 19:30',
    participants: 12,
    maxParticipants: 15,
    status: 'upcoming',
    organizer: 'ShadowStrike'
  },
  {
    id: 3,
    title: 'PvP Training Session',
    type: 'training',
    datetime: '2024-09-23 18:00',
    participants: 8,
    maxParticipants: 10,
    status: 'completed',
    organizer: 'HealMaster'
  },
  {
    id: 4,
    title: 'Resource Farming - Iron Mines',
    type: 'resource_farming',
    datetime: '2024-09-22 16:00',
    participants: 6,
    maxParticipants: 8,
    status: 'completed',
    organizer: 'DPSKing'
  },
  {
    id: 5,
    title: 'Social Event - Guild Meeting',
    type: 'social_event',
    datetime: '2024-09-21 15:00',
    participants: 24,
    maxParticipants: 30,
    status: 'completed',
    organizer: 'ViolenceGuild'
  }
];

const getEventIcon = (type) => {
  switch (type) {
    case 'guild_war': return <LocalFireDepartment color="error" />;
    case 'boss_raid': return <Shield color="primary" />;
    case 'training': return <Healing color="success" />;
    case 'resource_farming': return <Group color="warning" />;
    case 'social_event': return <Event color="info" />;
    default: return <Schedule color="action" />;
  }
};

const getEventTypeColor = (type) => {
  switch (type) {
    case 'guild_war': return 'error';
    case 'boss_raid': return 'primary';
    case 'training': return 'success';
    case 'resource_farming': return 'warning';
    case 'social_event': return 'info';
    default: return 'default';
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case 'upcoming': return 'info';
    case 'completed': return 'success';
    case 'cancelled': return 'error';
    default: return 'default';
  }
};

export default function RecentEvents() {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Recent Events
        </Typography>
        <List>
          {events.map((event) => (
            <ListItem key={event.id} sx={{ py: 1 }}>
              <ListItemIcon>
                {getEventIcon(event.type)}
              </ListItemIcon>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Typography variant="body2" fontWeight="medium">
                      {event.title}
                    </Typography>
                    <Chip
                      label={event.status}
                      color={getStatusColor(event.status)}
                      size="small"
                    />
                  </Box>
                }
                secondary={
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      {event.datetime} • {event.participants}/{event.maxParticipants} participants
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                      <Chip
                        label={event.type.replace('_', ' ')}
                        color={getEventTypeColor(event.type)}
                        size="small"
                        variant="outlined"
                      />
                      <Typography variant="caption" color="text.secondary">
                        by {event.organizer}
                      </Typography>
                    </Box>
                  </Box>
                }
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}
