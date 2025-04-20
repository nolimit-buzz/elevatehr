'use client';

import React, { useEffect, useState } from 'react';
import { Paper, Box, Typography, List, ListItem, ListItemText, Divider, CircularProgress } from '@mui/material';
import { format } from 'date-fns';
import DashboardCard from '@/app/dashboard/components/shared/DashboardCard';
import { useTheme } from "@mui/material/styles";
import ArrowForwardOutlined from "@mui/icons-material/ArrowForwardOutlined";
interface CalendlyEvent {
  uri: string;
  name: string;
  status: string;
  start_time: string;
  end_time: string;
  event_type: string;
  location: {
    type: string;
    location: string;
  };
  invitees_counter: {
    total: number;
    active: number;
    limit: number;
  };
}

interface CalendarProps {
  customStyle?: React.CSSProperties;
}

const Calendar: React.FC<CalendarProps> = ({ customStyle }) => {
  const [events, setEvents] = useState<CalendlyEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const personalAccessToken = process.env.NEXT_PUBLIC_PERSONAL_ACCESS_TOKEN;

        if (!personalAccessToken) {
          throw new Error('Personal access token is not configured');
        }

        // First get the user profile
        const userResponse = await fetch('https://api.calendly.com/users/me', {
          headers: {
            'Authorization': `Bearer ${personalAccessToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!userResponse.ok) {
          throw new Error('Failed to fetch user profile');
        }

        const userData = await userResponse.json();
        const userUri = userData.resource.uri;
        const userUuid = userUri.split('/').pop(); // Extract UUID from URI

        // Then fetch events using the user's UUID
        const eventsResponse = await fetch(`https://api.calendly.com/scheduled_events?user=${userUri}`, {
          headers: {
            'Authorization': `Bearer ${personalAccessToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!eventsResponse.ok) {
          throw new Error('Failed to fetch events');
        }

        const eventsData = await eventsResponse.json();
        setEvents(eventsData.collection || []);
      } catch (error) {
        console.error('Error fetching Calendly events:', error);
        setError('Failed to fetch events. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <DashboardCard customStyle={{ padding: '0px', ...customStyle }}>
      <Box>
        <Box
          sx={{
            p: 2.5,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              color: "rgba(17, 17, 17, 0.92)",
              fontSize: 24,
              lineHeight: "24px",
              letterSpacing: "0.36px",
            }}
          >
            Upcoming Events
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.secondary.main,
                fontSize: 14,
                lineHeight: "14px",
                letterSpacing: "0.14px",
                mr: 0.5,
              }}
            >
              See all
            </Typography>
            <ArrowForwardOutlined
              sx={{ color: "secondary.main", width: 20, height: 20 }}
            />
          </Box>
        </Box>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress size={24} />
        </Box>
      ) : error ? (
        <Typography color="error" sx={{ p: 2 }}>
          {error}
        </Typography>
      ) : events.length === 0 ? (
        <Typography sx={{ p: 2, color: 'rgba(17, 17, 17, 0.6)' }}>
          No upcoming events
        </Typography>
      ) : (
        <List sx={{ width: '100%', bgcolor: 'background.paper', p: 0 }}>
          {events.map((event, index) => (
            <React.Fragment key={event.uri}>
              <ListItem 
                alignItems="flex-start"
                sx={{
                  p: 2,
                  backgroundColor: 'rgba(68, 68, 226, 0.04)',
                  '&:hover': {
                    backgroundColor: 'rgba(68, 68, 226, 0.04)',
                  },
                }}
              >
                <Box
                  sx={{
                    width: '4px',
                    height: '100%',
                    backgroundColor: 'primary.main',
                    borderRadius: '2px',
                    mr: 2,
                    minHeight: '60px',
                  }}
                />
                <ListItemText
                  sx={{ m: 0 }}
                  primary={
                    <Typography
                      component="span"
                      variant="subtitle1"
                      sx={{ 
                        color: 'rgba(17, 17, 17, 0.92)',
                        fontWeight: 500,
                        fontSize: '15px',
                        lineHeight: '20px',
                        mb: 0.5,
                      }}
                    >
                      {event.name}
                    </Typography>
                  }
                  secondary={
                    <Box sx={{ mt: 0.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                        <Typography
                          component="span"
                          variant="body2"
                          sx={{ 
                            color: 'rgba(17, 17, 17, 0.6)',
                            fontSize: '13px',
                            lineHeight: '16px',
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          <Box
                            component="span"
                            sx={{
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              backgroundColor: 'primary.main',
                              mr: 1,
                            }}
                          />
                          {format(new Date(event.start_time), 'EEEE, MMMM d, yyyy')}
                        </Typography>
                      </Box>
                      <Typography
                        component="span"
                        variant="body2"
                        sx={{ 
                          color: 'rgba(17, 17, 17, 0.6)',
                          fontSize: '13px',
                          lineHeight: '16px',
                          display: 'block',
                          ml: 2,
                        }}
                      >
                        {format(new Date(event.start_time), 'h:mm a')} - {format(new Date(event.end_time), 'h:mm a')}
                      </Typography>
                      {event.location && (
                        <Typography
                          component="span"
                          variant="body2"
                          sx={{ 
                            color: 'rgba(17, 17, 17, 0.6)',
                            fontSize: '13px',
                            lineHeight: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            mt: 0.5,
                            ml: 2,
                          }}
                        >
                          <Box
                            component="span"
                            sx={{
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              backgroundColor: 'rgba(17, 17, 17, 0.2)',
                              mr: 1,
                            }}
                          />
                          {event.location.type === 'physical' ? 'Location: ' : 'Meeting: '}
                          {event.location.location}
                        </Typography>
                      )}
                    </Box>
                  }
                />
              </ListItem>
              {index < events.length - 1 && (
                <Divider 
                  component="li" 
                  sx={{ 
                    borderColor: 'rgba(17, 17, 17, 0.08)',
                    mx: 2,
                  }} 
                />
              )}
            </React.Fragment>
          ))}
        </List>
      )}
      </Box>    
    </DashboardCard>
  );
};

export default Calendar; 