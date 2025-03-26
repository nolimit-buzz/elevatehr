'use client';

import React from 'react';
import { styled } from '@mui/material';
import { Skeleton, Grid, Box } from '@mui/material';

const StatCardSkeleton = styled(Box)(({ theme }) => ({
  height: '160px',
  background: '#FFFFFF',
  borderRadius: '10px',
  padding: '30px',
  border: '1px solid rgba(17,17,17,0.12)',
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
  }
}));

const DashboardSkeleton = () => {
  return (
    <Box sx={{ 
      p: 3,
      background: '#F3F4F7',
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center'
    }}>
      <Box sx={{ 
        maxWidth: '1440px',
        width: '100%'
      }}>
        {/* Header Skeleton */}
        <Box sx={{ 
          mb: 3, 
          mt: '40px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Box>
            <Skeleton variant="text" width={200} height={32} sx={{ mb: 1 }} />
            <Skeleton variant="text" width={300} height={24} />
          </Box>
          <Skeleton variant="rectangular" width={180} height={52} sx={{ borderRadius: '8px' }} />
        </Box>

        {/* Stats Cards Skeleton */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <Grid item xs={2} key={item}>
              <StatCardSkeleton>
                <Skeleton 
                  variant="rectangular" 
                  width={120} 
                  height={120} 
                  sx={{ 
                    borderRadius: '30px',
                    bgcolor: 'rgba(17,17,17,0.04)'
                  }} 
                />
                <Skeleton 
                  variant="text" 
                  width={100} 
                  height={40} 
                  sx={{ 
                    bgcolor: 'rgba(17,17,17,0.04)'
                  }}
                />
                <Skeleton 
                  variant="text" 
                  width={80} 
                  height={24} 
                  sx={{ 
                    bgcolor: 'rgba(17,17,17,0.04)'
                  }}
                />
              </StatCardSkeleton>
            </Grid>
          ))}
        </Grid>

        {/* Main Content Skeleton */}
        <Grid container spacing={2}>
          <Grid item xs={12} lg={8}>
            <Box sx={{ 
              height: '700px',
              background: '#FFFFFF',
              borderRadius: '10px',
              p: 3
            }}>
              <Skeleton 
                variant="rectangular" 
                width="100%" 
                height="100%" 
                sx={{ 
                  borderRadius: '10px',
                  bgcolor: 'rgba(17,17,17,0.04)'
                }} 
              />
            </Box>
          </Grid>
          <Grid item xs={12} lg={4}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box sx={{ 
                  height: '340px',
                  background: '#FFFFFF',
                  borderRadius: '10px',
                  p: 3
                }}>
                  <Skeleton 
                    variant="rectangular" 
                    width="100%" 
                    height="100%" 
                    sx={{ 
                      borderRadius: '10px',
                      bgcolor: 'rgba(17,17,17,0.04)'
                    }} 
                  />
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ 
                  height: '340px',
                  background: '#FFFFFF',
                  borderRadius: '10px',
                  p: 3
                }}>
                  <Skeleton 
                    variant="rectangular" 
                    width="100%" 
                    height="100%" 
                    sx={{ 
                      borderRadius: '10px',
                      bgcolor: 'rgba(17,17,17,0.04)'
                    }} 
                  />
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default DashboardSkeleton;