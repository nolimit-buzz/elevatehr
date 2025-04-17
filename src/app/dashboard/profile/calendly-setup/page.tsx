'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Link,
  Stack,
  Divider,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import ArrowBack from '@mui/icons-material/ArrowBack';

const CalendlySetupPage = () => {
  const router = useRouter();
  const [origin, setOrigin] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
    }
  }, []);

  return (
    <Box sx={{ maxWidth: '800px', mx: 'auto', p: 3 }}>
      {/* Back Button */}
      <Button
        startIcon={<ArrowBack />}
        onClick={() => router.back()}
        sx={{
          color: 'rgba(17, 17, 17, 0.7)',
          fontWeight: 500,
          fontSize: '15px',
          textTransform: 'none',
          mb: 3,
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
          }
        }}
      >
        Back to Profile
      </Button>

      {/* Setup Instructions */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 4, 
          borderRadius: '10px',
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
          Calendly Integration Setup
        </Typography>

        <Stack spacing={3}>
          {/* Step 1 */}
          <Box>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 500 }}>
              Step 1: Create a Calendly Developer Account
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.grey.100', mb: 2 }}>
              Visit the Calendly Developer Portal to create your account:
            </Typography>
            <Button
              variant="contained"
              href="https://developer.calendly.com/"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ mb: 2 }}
            >
              Go to Calendly Developer Portal
            </Button>
          </Box>

          <Divider />

          {/* Step 2 */}
          <Box>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 500 }}>
              Step 2: Create an OAuth Application
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.grey.100', mb: 2 }}>
              In your Calendly Developer Dashboard:
            </Typography>
            <Box component="ol" sx={{ pl: 2, mb: 2 }}>
              <Typography component="li" variant="body1" sx={{ color: 'text.grey.100', mb: 1 }}>
                Navigate to the "OAuth Applications" section
              </Typography>
              <Typography component="li" variant="body1" sx={{ color: 'text.grey.100', mb: 1 }}>
                Click "Create New Application"
              </Typography>
              <Typography component="li" variant="body1" sx={{ color: 'text.grey.100' }}>
                Fill in the required application details
              </Typography>
            </Box>
          </Box>

          <Divider />

          {/* Step 3 */}
          <Box>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 500 }}>
              Step 3: Configure OAuth Settings
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.grey.100', mb: 2 }}>
              Set the following redirect URI in your Calendly OAuth application:
            </Typography>
            <Box
              component="pre"
              sx={{
                p: 2,
                bgcolor: 'grey.50',
                borderRadius: 1,
                overflow: 'auto',
                fontFamily: 'monospace',
              }}
            >
              {origin}/auth/calendly
            </Box>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
};

export default CalendlySetupPage; 