'use client';

import React from 'react';
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
              In your OAuth application settings:
            </Typography>
            <Box component="ol" sx={{ pl: 2, mb: 2 }}>
              <Typography component="li" variant="body1" sx={{ color: 'text.grey.100', mb: 1 }}>
                Add the following redirect URI:
                <Box component="code" sx={{ 
                  display: 'block', 
                  mt: 1, 
                  p: 1, 
                  bgcolor: 'rgba(0, 0, 0, 0.04)', 
                  borderRadius: '4px',
                  fontFamily: 'monospace'
                }}>
                  {window.location.origin}/auth/calendly
                </Box>
              </Typography>
              <Typography component="li" variant="body1" sx={{ color: 'text.grey.100' }}>
                Whitelist the following domain:
                <Box component="code" sx={{ 
                  display: 'block', 
                  mt: 1, 
                  p: 1, 
                  bgcolor: 'rgba(0, 0, 0, 0.04)', 
                  borderRadius: '4px',
                  fontFamily: 'monospace'
                }}>
                  {window.location.origin}
                </Box>
              </Typography>
            </Box>
          </Box>

          <Divider />

          {/* Step 4 */}
          <Box>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 500 }}>
              Step 4: Send Your Credentials
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.grey.100', mb: 2 }}>
              After creating your OAuth application, you'll receive:
            </Typography>
            <Box component="ul" sx={{ pl: 2, mb: 2 }}>
              <Typography component="li" variant="body1" sx={{ color: 'text.grey.100', mb: 1 }}>
                Client ID
              </Typography>
              <Typography component="li" variant="body1" sx={{ color: 'text.grey.100' }}>
                Client Secret
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ color: 'text.grey.100', mb: 2 }}>
              Please send these credentials to:
            </Typography>
            <Button
              variant="outlined"
              href="mailto:info@nolimitbuzz.net"
              sx={{ mb: 2 }}
            >
              info@nolimitbuzz.net
            </Button>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
};

export default CalendlySetupPage; 