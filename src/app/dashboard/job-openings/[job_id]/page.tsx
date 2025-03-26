'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios, { AxiosRequestConfig } from 'axios';
import {
  Container,
  Box,
  Stack,
  Typography,
  CircularProgress,
  styled,
  Chip,
  Button,
  Grid,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';

export const dynamic = 'force-dynamic';

interface JobData {
  title: string;
  location: string;
  work_model: string;
  job_type: string;
  description: string;
  about_role: string;
  responsibilities: string;
  expectations: string;
  salary_min?: number;
  salary_max?: number;
  qualifications?: string;
  experience_years?: string;
}

const Banner = styled(Box)(({ theme }) => ({
  width: '100%',
  background: theme.palette.primary.main,
  color: '#fff',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginBottom: '28px',
}));

const Pill = styled(Chip)(({ theme }) => ({
  padding: '10px 12px',
  backgroundColor: 'rgba(255, 255, 255, 0.12)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: '20px',
  color: '#fff',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '8px',
  backgroundColor: theme.palette.primary.main,
  padding: '16px 44px',
  color: theme.palette.secondary.light,
  fontSize: '16px',
  fontWeight: 500,
  lineHeight: '100%',
  letterSpacing: '0.16px',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    backgroundColor: '#6666E6',
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 12px rgba(68, 68, 226, 0.15)',
  }
}));

const JobDetailsPage = () => {
  const theme = useTheme();
  const { job_id } = useParams();
  const router = useRouter();
  const [jobData, setJobData] = useState<JobData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchJobDetails = async () => {
      if (!job_id) {
        setError('No job ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const token = localStorage.getItem('jwt');
        const config: AxiosRequestConfig = {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        };
        const response = await axios.get(`https://app.elevatehr.ai/wp-json/elevatehr/v1/jobs/${job_id}`, config);
        setJobData(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching job details:', err);
        setError('Failed to fetch job details. Please try again later.');
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [job_id]);

  if (loading) {
    return (
      <Container sx={{ textAlign: 'center', mt: 4 }}>
        <CircularProgress />
        <Typography variant="h6">Loading job details...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Box sx={{ backgroundColor: '#F1F4F9', minHeight: '100vh' }}>
      <Banner
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: theme.palette.primary.main,
          backgroundImage: "url(/images/backgrounds/banner-bg-img.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        height={'204px'}
      >
        <Typography variant="h4" sx={{ 
          color: "rgba(255, 255, 255, 0.92)", 
          fontSize: "40px", 
          fontWeight: "600",
          marginBottom: '16px'
        }}>
          {jobData?.title}
        </Typography>
        <Stack direction={'row'} alignItems={'center'} gap={'8px'}>
          <Pill label={jobData?.location} />
          <Pill label={jobData?.work_model} />
          <Pill label={jobData?.job_type} />
        </Stack>
      </Banner>

      <Container sx={{ maxWidth: '1063px !important' }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Box sx={{ 
              backgroundColor: '#fff', 
              borderRadius: '8px',
              padding: '40px',
              marginBottom: '24px'
            }}>
              <Stack spacing={4}>
                <Box>
                  <Typography variant="h5" sx={{ 
                    fontWeight: 600, 
                    marginBottom: '16px',
                    color: 'rgba(17, 17, 17, 0.92)'
                  }}>
                    Who we are
                  </Typography>
                  <Typography sx={{ color: 'rgba(17, 17, 17, 0.84)' }}>
                    {jobData?.description}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="h5" sx={{ 
                    fontWeight: 600, 
                    marginBottom: '16px',
                    color: 'rgba(17, 17, 17, 0.92)'
                  }}>
                    About the Role
                  </Typography>
                  <Box sx={{ color: 'rgba(17, 17, 17, 0.84)' }} dangerouslySetInnerHTML={{ __html: jobData?.about_role || '' }} />
                </Box>

                <Box>
                  <Typography variant="h5" sx={{ 
                    fontWeight: 600, 
                    marginBottom: '16px',
                    color: 'rgba(17, 17, 17, 0.92)'
                  }}>
                    Job Responsibilities
                  </Typography>
                  <Box sx={{ color: 'rgba(17, 17, 17, 0.84)' }} dangerouslySetInnerHTML={{ __html: jobData?.responsibilities || '' }} />
                </Box>

                <Box>
                  <Typography variant="h5" sx={{ 
                    fontWeight: 600, 
                    marginBottom: '16px',
                    color: 'rgba(17, 17, 17, 0.92)'
                  }}>
                    Expectations of this Role
                  </Typography>
                  <Stack spacing={1}>
                    {jobData?.expectations.split('|||').map((expectation: string, index: number) => (
                      <Stack key={index} direction="row" spacing={1} alignItems="flex-start">
                        <Typography sx={{ color: 'rgba(17, 17, 17, 0.84)' }}>
                        • {expectation}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>
                </Box>

                <Box>
                  <Typography variant="h5" sx={{ 
                    fontWeight: 600, 
                    marginBottom: '16px',
                    color: 'rgba(17, 17, 17, 0.92)'
                  }}>
                    Benefits
                  </Typography>
                  <Stack spacing={1}>
                    <Typography sx={{ color: 'rgba(17, 17, 17, 0.84)' }}>• Competitive Salary</Typography>
                    <Typography sx={{ color: 'rgba(17, 17, 17, 0.84)' }}>• Hybrid role</Typography>
                    <Typography sx={{ color: 'rgba(17, 17, 17, 0.84)' }}>• Collaborative team</Typography>
                    <Typography sx={{ color: 'rgba(17, 17, 17, 0.84)' }}>• Paid leave days with allowance</Typography>
                    <Typography sx={{ color: 'rgba(17, 17, 17, 0.84)' }}>• Up to 80 days in maternity leave</Typography>
                  </Stack>
                </Box>
              </Stack>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Box sx={{ 
              backgroundColor: '#fff', 
              borderRadius: '8px',
              padding: '24px',
              marginBottom: '24px'
            }}>
              <Stack spacing={2}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <AccessTimeIcon sx={{ color: 'rgba(17, 17, 17, 0.6)', fontSize: 20 }} />
                  <Typography sx={{ color: 'rgba(17, 17, 17, 0.84)' }}>
                    {jobData?.job_type || 'Full-Time'}
                  </Typography>
                </Stack>

                <Stack direction="row" spacing={1} alignItems="center">
                  <WorkIcon sx={{ color: 'rgba(17, 17, 17, 0.6)', fontSize: 20 }} />
                  <Typography sx={{ color: 'rgba(17, 17, 17, 0.84)' }}>
                    {jobData?.work_model || 'Remote'}
                  </Typography>
                </Stack>

                <Stack direction="row" spacing={1} alignItems="center">
                  <LocationOnIcon sx={{ color: 'rgba(17, 17, 17, 0.6)', fontSize: 20 }} />
                  <Typography sx={{ color: 'rgba(17, 17, 17, 0.84)' }}>
                    {jobData?.location || 'Lagos, Nigeria'}
                  </Typography>
                </Stack>

                <Stack direction="row" spacing={1} alignItems="center">
                  <SchoolIcon sx={{ color: 'rgba(17, 17, 17, 0.6)', fontSize: 20 }} />
                  <Typography sx={{ color: 'rgba(17, 17, 17, 0.84)' }}>
                    {jobData?.qualifications || 'Bachelor\'s Degree'}
                  </Typography>
                </Stack>

                <Stack direction="row" spacing={1} alignItems="center">
                  <WorkIcon sx={{ color: 'rgba(17, 17, 17, 0.6)', fontSize: 20 }} />
                  <Typography sx={{ color: 'rgba(17, 17, 17, 0.84)' }}>
                    {jobData?.experience_years || '6-7 Years of Experience'}
                  </Typography>
                </Stack>
              </Stack>
            </Box>

            <StyledButton
              variant="contained"
              fullWidth
              onClick={() => router.push(`/dashboard/job-openings/${job_id}/apply`)}
            >
              Apply for this Job
            </StyledButton>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default JobDetailsPage; 