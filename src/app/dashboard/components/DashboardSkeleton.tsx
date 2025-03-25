import React from 'react';
import {
  Box,
  Grid,
  Skeleton,
  Stack,
  Typography,
  styled
} from '@mui/material';
import PageContainer from '@/app/dashboard/components/container/PageContainer';
import DashboardCard from './shared/DashboardCard';

const ToolbarStyled = styled(Stack)(({ theme }) => ({
  width: "100%",
  color: theme.palette.text.secondary,
  display: "flex",
  justifyContent: "space-between",
  marginBottom: theme.spacing(3),
  marginTop: '40px'
}));

const Greeting = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontFamily: theme.typography.fontFamily,
  fontWeight: theme.typography.fontWeightBold,
  fontSize: theme.typography.pxToRem(24),
}));

const DashboardSkeleton = () => {
  // Create an array of 6 for the stat cards
  const statCards = Array(6).fill(0);

  return (
    <PageContainer title="Dashboard" description="this is Dashboard">
      <ToolbarStyled direction='row' alignItems='center' justifyContent='space-between'>
        <Stack spacing={'12px'}>
          <Greeting variant='body1' fontWeight='semibold'>Hello Recruiter,</Greeting>
          <Typography variant='body2' fontWeight='semibold' fontSize='16px' color={'rgba(17,17,17,0.62)'}>Welcome to your Dashboard</Typography>
        </Stack>
        <Skeleton variant="rectangular" width={220} height={52} sx={{ borderRadius: '8px' }} />
      </ToolbarStyled>
      <Box>
        <Grid container spacing={3}>
          {/* Stat Cards Skeleton */}
          <Grid container item xs={12} marginBottom={3}>
            {statCards.map((_, index) => (
              <Grid item xs={2} key={index}>
                <DashboardCard
                  customStyle={{
                    borderRadius: index === 0 ? '10px 0 0 10px' : (index === statCards.length - 1 ? '0 10px 10px 0' : '0px'),
                    borderRight: index < statCards.length - 1 ? '1px solid rgba(17,17,17,0.12)' : 'none',
                    padding: '30px',
                  }}
                >
                  <Stack>
                    <Skeleton variant="circular" width={32} height={32} />
                    <Skeleton variant="text" width={80} height={50} sx={{ marginTop: '20px', marginBottom: '10px' }} />
                    <Skeleton variant="text" width={100} height={24} />
                  </Stack>
                </DashboardCard>
              </Grid>
            ))}
          </Grid>

          {/* Job Postings and Notifications Skeleton */}
          <Grid container item xs={12} spacing={3} justifyContent={'space-between'} minHeight={'500px'} maxHeight={'700px'} px={2}>
            {/* Job Postings Column */}
            <Grid item xs={12} lg={8} maxHeight={'100%'} overflow={'scroll'} p={2}>
              <DashboardCard customStyle={{ height: '100%', overflow: 'scroll', padding: '16px' }}>
                <Stack spacing={2}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Skeleton variant="text" width={150} height={32} />
                    <Skeleton variant="text" width={100} height={32} />
                  </Stack>
                  
                  {/* Job posting items */}
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Box key={index} sx={{ mb: 2 }}>
                      <Skeleton variant="rectangular" width="100%" height={120} sx={{ borderRadius: '8px' }} />
                    </Box>
                  ))}
                </Stack>
              </DashboardCard>
            </Grid>

            {/* Notifications and Email Templates */}
            <Grid container item spacing={'12px'} xs={12} lg={4} minHeight={'500px'} maxHeight={'700px'}>
              {/* Notifications */}
              <Grid item xs={12} sm={6} lg={12} flex={1} maxHeight={'50%'} overflow={'scroll'}>
                <DashboardCard customStyle={{ height: '100%', overflow: 'scroll', padding: '16px' }}>
                  <Stack spacing={2}>
                    <Skeleton variant="text" width={140} height={32} />
                    
                    {/* Notification items */}
                    {Array.from({ length: 3 }).map((_, index) => (
                      <Box key={index} sx={{ mb: 2 }}>
                        <Skeleton variant="rectangular" width="100%" height={80} sx={{ borderRadius: '8px' }} />
                      </Box>
                    ))}
                  </Stack>
                </DashboardCard>
              </Grid>
              
              {/* Email Templates */}
              <Grid item xs={12} sm={6} lg={12} flex={1} maxHeight={'50%'} overflow={'scroll'}>
                <DashboardCard customStyle={{ height: '100%', overflow: 'scroll', padding: '16px' }}>
                  <Stack spacing={2}>
                    <Skeleton variant="text" width={160} height={32} />
                    
                    {/* Email template items */}
                    {Array.from({ length: 3 }).map((_, index) => (
                      <Box key={index} sx={{ mb: 2 }}>
                        <Skeleton variant="rectangular" width="100%" height={80} sx={{ borderRadius: '8px' }} />
                      </Box>
                    ))}
                  </Stack>
                </DashboardCard>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default DashboardSkeleton;