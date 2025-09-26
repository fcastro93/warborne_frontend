import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemText, ListItemIcon, Chip, Box, Avatar } from '@mui/material';
import { Event, Group, LocalFireDepartment, Shield, Healing, Schedule } from '@mui/icons-material';
import { apiService } from '../services/api';


const getEventIcon = (type) => {
  switch (type) {
    case 'guild_war': return <LocalFireDepartment color="error" />;
    case 'boss_raid': return <Shield color="primary" />;
    case 'training': return <Healing color="success" />;
    case 'resource_farming': return <Group color="warning" />;
    case 'social_event': return <Event color="info" />;
    case 'other': return <Schedule color="action" />;
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
    case 'other': return 'default';
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

const formatEventDateTime = (datetimeString) => {
  if (!datetimeString) return 'No date';
  
  try {
    const date = new Date(datetimeString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    return datetimeString;
  }
};

const getEventStatus = (event) => {
  if (!event.event_datetime) return 'completed';
  
  try {
    const eventDate = new Date(event.event_datetime);
    const now = new Date();
    
    if (eventDate > now) {
      return 'upcoming';
    } else {
      return 'completed';
    }
  } catch (error) {
    return 'completed';
  }
};

export default function RecentEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await apiService.getRecentEvents();
        if (data && data.events && data.events.length > 0) {
          // Show only the latest 5 events, sorted by creation date
          const sortedEvents = data.events
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .slice(0, 5);
          setEvents(sortedEvents);
        } else {
          // No events found, show empty state
          setEvents([]);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
        // Show empty state on error
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Recent Events
          </Typography>
          <Typography>Loading events...</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Recent Events
        </Typography>
        {events.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
            No recent events to display
          </Typography>
        ) : (
          <List>
            {events.map((event) => {
            const status = getEventStatus(event);
            const formattedDateTime = formatEventDateTime(event.event_datetime);
            const participantCount = event.participant_count || 0;
            const maxParticipants = event.max_participants || 'No limit';
            
            return (
              <ListItem key={event.id} sx={{ py: 1 }}>
                <ListItemIcon>
                  {getEventIcon(event.event_type)}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <Typography variant="body2" fontWeight="medium">
                        {event.title}
                      </Typography>
                      <Chip
                        label={status === 'upcoming' ? 'Upcoming' : 'Completed'}
                        color={getStatusColor(status)}
                        size="small"
                      />
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        {formattedDateTime} • {participantCount} participants
                        {maxParticipants !== 'No limit' && `/${maxParticipants}`}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                        <Chip
                          label={event.event_type_display || event.event_type || 'Other'}
                          color={getEventTypeColor(event.event_type)}
                          size="small"
                          variant="outlined"
                        />
                        {event.created_by_discord_name && (
                          <Typography variant="caption" color="text.secondary">
                            by {event.created_by_discord_name}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  }
                />
              </ListItem>
            );
          })}
          </List>
        )}
      </CardContent>
    </Card>
  );
}
