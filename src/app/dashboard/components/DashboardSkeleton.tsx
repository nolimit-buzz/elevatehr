import React from 'react';
import { styled, Box, Stack, Grid, Skeleton } from '@mui/material';

const AnimatedLogo = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  width: '100%',
  background: theme.palette.background.default,
  '& svg': {
    maxWidth: '240px',
    width: '100%',
    height: 'auto',
    padding: '24px',
    '& path': {
      stroke: theme.palette.primary.main,
      strokeWidth: '0.5',
      strokeDasharray: '1000',
      strokeDashoffset: '1000',
      animation: 'flow 3s ease-in-out infinite',
      transformOrigin: 'center',
      fill: 'rgba(17, 17, 17, 0.6)',
      '&:nth-of-type(1)': {
        animation: 'flow 3s ease-in-out infinite, fillColor 3s ease-in-out infinite',
      },
      '&:nth-of-type(2)': {
        animation: 'flow 3s ease-in-out infinite, pulse 3s ease-in-out infinite 0.5s, fillColor 3s ease-in-out infinite 0.5s',
      },
      '&:nth-of-type(3)': {
        animation: 'flow 3s ease-in-out infinite, pulse 3s ease-in-out infinite 1s, fillColor 3s ease-in-out infinite 1s',
      }
    },
    '@keyframes pulse': {
      '0%, 100%': {
        transform: 'scale(1)'
      },
      '50%': {
        transform: 'scale(1.05)'
      }
    },
    '@keyframes fillColor': {
      '0%': {
        fill: 'rgba(17, 17, 17, 0.4)'
      },
      '30%': {
        fill: theme.palette.primary.main
      },
      '70%': {
        fill: theme.palette.primary.main
      },
      '100%': {
        fill: 'rgba(17, 17, 17, 0.4)'
      }
    }
  }
}));

const LineLoader = styled('div')(({ theme }) => ({
  width: '240px',
  height: '2px',
  background: theme.palette.primary.main,
  position: 'relative',
  overflow: 'hidden',
  // marginTop: '4px',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: -10,
    left: 0,
    width: '100%',
    height: '100%',
    background: theme.palette.background.default,
    animation: 'slide 2s ease-in-out infinite',
  },
  '@keyframes slide': {
    '0%': {
      transform: 'translateX(-100%)'
    },
    '100%': {
      transform: 'translateX(100%)'
    }
  }
}));

const StatCardSkeleton = styled(Box)(({ theme }) => ({
  height: '160px',
  background: '#FFFFFF',
  borderRadius: '10px',
  padding: '30px',
  transition: 'all 0.3s ease-in-out',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
    '& .stat-value': {
      color: theme.palette.primary.main
    },
    '& .stat-title': {
      color: theme.palette.primary.main
    }
  }
}));

const DashboardSkeleton = () => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', background: '#F3F4F7', minHeight: '100vh', padding: '40px 24px' }}>
      <Box sx={{ maxWidth: '1440px', width: '100%' }}>
        {/* Header Skeleton */}
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3} mt="40px">
          <Stack spacing={1}>
            <Skeleton variant="text" width={200} height={32} />
            <Skeleton variant="text" width={300} height={24} />
          </Stack>
          <Skeleton variant="rectangular" width={180} height={52} sx={{ borderRadius: '8px' }} />
        </Stack>

        {/* Stats Cards Skeleton */}
        <Grid container spacing={2} mb={3}>
          {[1, 2, 3, 4, 5, 6].map((index) => (
            <Grid item xs={2} key={index}>
              <StatCardSkeleton>
                <Stack spacing={2}>
                  <Skeleton variant="rectangular" width={120} height={120} sx={{ borderRadius: '30px' }} />
                  <Skeleton variant="text" width={100} height={40} className="stat-value" />
                  <Skeleton variant="text" width={80} height={24} className="stat-title" />
                </Stack>
              </StatCardSkeleton>
            </Grid>
          ))}
        </Grid>

        {/* Main Content Skeleton */}
        <Grid container spacing={2}>
          {/* Main Panel */}
          <Grid item xs={12} lg={8}>
            <Box sx={{ background: '#FFFFFF', borderRadius: '10px', p: 3, height: '700px' }}>
              <Stack spacing={2}>
                <Skeleton variant="text" width={200} height={32} />
                <Skeleton variant="rectangular" height={60} sx={{ borderRadius: '8px' }} />
                {[1, 2, 3, 4, 5].map((index) => (
                  <Skeleton key={index} variant="rectangular" height={150} sx={{ borderRadius: '8px' }} />
                ))}
              </Stack>
            </Box>
          </Grid>

          {/* Side Panel */}
          <Grid container item spacing={2} xs={12} lg={4}>
            <Grid item xs={12}>
              <Box sx={{ background: '#FFFFFF', borderRadius: '10px', p: 3, height: '340px' }}>
                <Stack spacing={2}>
                  <Skeleton variant="text" width={150} height={32} />
                  {[1, 2, 3].map((index) => (
                    <Skeleton key={index} variant="rectangular" height={80} sx={{ borderRadius: '8px' }} />
                  ))}
                </Stack>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ background: '#FFFFFF', borderRadius: '10px', p: 3, height: '340px' }}>
                <Stack spacing={2}>
                  <Skeleton variant="text" width={150} height={32} />
                  {[1, 2, 3].map((index) => (
                    <Skeleton key={index} variant="rectangular" height={80} sx={{ borderRadius: '8px' }} />
                  ))}
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default DashboardSkeleton;