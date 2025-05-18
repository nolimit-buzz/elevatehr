'use client';
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Paper,
  DialogActions,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Stack,
  Typography,
  styled,
  SvgIcon,
  Grid,
  Box,
  IconButton,
  InputBase,
  FormControl,
  InputLabel,
  CircularProgress,
  Skeleton
} from '@mui/material';
import { Avatar } from '@mui/material';
import DashboardSkeleton from './components/DashboardSkeleton';
import CloseIcon from "@mui/icons-material/Close";
import PageContainer from '@/app/dashboard/components/container/PageContainer';
import JobPostings from '@/app/dashboard/components/dashboard/JobPostings';
import theme from '@/utils/theme';
import DashboardCard from './components/shared/DashboardCard';
import Notifications from './components/dashboard/Notifications';
import EmailTemplates from './components/dashboard/EmailTemplates';
import { useRouter } from 'next/navigation';
import Calendar from '@/components/Calendar';
import { CalendlyEvent } from '@/types/calendly';

const statCards = [
  {
    icon: (
      <SvgIcon>
        <svg width="120" height="120" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="60" height="60" rx="30" fill="#1CC47E" />
          <path d="M22.1879 22.1879L37.8128 37.8128" stroke="white" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M37.8125 25.3125L37.8125 37.8125L25.3125 37.8125" stroke="white" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </SvgIcon>
    ),
    color: '#1CC47E',
    id: 'active_jobs',
    title: "Open Roles",
    value: 0,
  },
  {
    icon: (
      <SvgIcon>
        <svg width="120" height="120" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="60" height="60" rx="30" fill="#5656E6" />
          <path d="M28.4375 41.7188H44.0626" stroke="white" stroke-width="1.875" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M28.4375 30.7813H44.0626" stroke="white" stroke-width="1.875" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M28.4375 19.8438H44.0626" stroke="white" stroke-width="1.875" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M15.9375 19.8438L17.5 21.4063L22.1875 16.7188" stroke="white" stroke-width="1.875" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M15.9375 30.7813L17.5 32.3438L22.1875 27.6563" stroke="white" stroke-width="1.875" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M15.9375 41.7188L17.5 43.2813L22.1875 38.5938" stroke="white" stroke-width="1.875" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </SvgIcon>
    ),
    color: '#5656E6',
    id: 'total_applicants',
    title: "Candidates",
    value: 0,
  },
  {
    icon: (
      <SvgIcon>
        <svg width="120" height="120" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="60" height="60" rx="30" fill="#FD8535" />
          <path d="M28.4375 41.7188H44.0626" stroke="white" stroke-width="1.875" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M28.4375 30.7813H44.0626" stroke="white" stroke-width="1.875" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M28.4375 19.8438H44.0626" stroke="white" stroke-width="1.875" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M15.9375 19.8438L17.5 21.4063L22.1875 16.7188" stroke="white" stroke-width="1.875" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M15.9375 30.7813L17.5 32.3438L22.1875 27.6563" stroke="white" stroke-width="1.875" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M15.9375 41.7188L17.5 43.2813L22.1875 38.5938" stroke="white" stroke-width="1.875" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </SvgIcon>
    ),
    color: '#FD8535',
    id: 'interviews',
    title: "Upcoming Interviews",
    value: 0, // Will be updated with fetched data
  },
];

const ToolbarStyled = styled(Stack)(({ theme }) => ({
  width: "100%",
  maxWidth: '1440px',
  color: theme.palette.text.secondary,
  display: "flex",
  justifyContent: "space-between",
  [theme.breakpoints.down('sm')]: {
    marginBottom: theme.spacing(1.5),
    marginTop: '15px',
    alignItems: 'flex-start'
  },
  [theme.breakpoints.up('sm')]: {
    marginBottom: theme.spacing(3),
    marginTop: '40px',
    alignItems: 'center'
  }
}));

const Greeting = styled(Typography)(({ theme }) => ({
  color: theme.palette.grey[100],
  fontWeight: theme.typography.fontWeightBold,
  [theme.breakpoints.down('sm')]: {
    fontSize: '18px',
  },
  [theme.breakpoints.up('sm')]: {
    fontSize: '20px',
  },
  lineHeight: '24px',
  letterSpacing: '0.15px',
}));

const PrimaryButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  borderRadius: "8px",
  display: 'flex',
  alignItems: 'center',
  gap: '5px',
  padding: '10px 20px',
  fontSize: theme.typography.pxToRem(16),
  color: theme.palette.secondary.light,
  fontWeight: theme.typography.fontWeightMedium,
  height: '52px',
  transition: 'all 0.2s ease-in-out',
  [theme.breakpoints.down('sm')]: {
    borderRadius: '50%',
    padding: '0',
    alignItems: 'center',
    justifyContent: 'center',
    width: '52px',
    height: '52px',
    minWidth: '52px',
  },
  '&:hover': {
    backgroundColor: '#6666E6',
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 12px rgba(68, 68, 226, 0.15)',
  },
}));

const StyledRadioGroup = styled(RadioGroup)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  gap: '10px', // Adjusted gap between radio buttons
  padding: '16px 60px 16px 16px',
}));

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    width: '100%',
    maxWidth: { xs: '520px', md: '666px' },
    height: '666px',
    flexShrink: 0,
    borderRadius: '8px',
    background: '#FFF',
    padding: '32px'
  },
}));

const StyledFormControlLabel = styled(FormControlLabel)(({ theme }) => ({
  display: 'flex',
  height: '48px',
  alignItems: 'center',
  gap: '8px',
  borderRadius: '6px',
  border: '0.5px solid #D7DAE0',
  background: '#F3F4F7',
  padding: '16px',
  minWidth: '145px',
  '& span': {
    padding: '0px',
  },
}));

const StyledRadio = styled(Radio)(({ theme }) => ({
  '& .MuiSvgIcon-root': {
    opacity: 0.68,
    width: '16px',
    height: '16px',
    aspectRatio: '1 / 1',
    borderColor: 'rgba(17, 17, 17, 0.84)'
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  display: 'flex',
  width: '456px',
  padding: '16px 24px',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '6px',
  borderRadius: '8px',
  background: '#4444E2',
  color: '#FFF',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    background: '#6666E6',
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 12px rgba(68, 68, 226, 0.15)',
  },
}));

interface StatCardProps {
  card: {
    icon: React.ReactNode;
    color: string;
    id: string;
    title: string;
    value: number;
  };
  index: number;
  length: number;
}

const StatCard = ({ card, index, length }: StatCardProps) => {
  return (
    // <Grid item xs={2} sx={{ flex: 1 }}>
      <DashboardCard
        customStyle={{
          flex:1,
          borderRadius: '10px',
          // borderRadius: index === 0 ? '10px 0 0 10px' : (index === length - 1 ? '0 10px 10px 0' : '0px'), 
          // borderRight: index < length - 1 ? '1px solid rgba(17,17,17,0.12)' : 'none', 
          padding: { xs: '15px', md: '30px' },
          transition: 'all 0.3s ease-in-out',
          cursor: 'pointer',
          backgroundColor: `${card.color}20`,
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
            backgroundColor: `${card.color}20`,
            '& .stat-value': {
              color: card.color
            },
            '& .stat-title': {
              color: card.color
            },
            '& svg rect': {
              fill: 'white',
              transition: 'all 0.3s ease-in-out',
              stroke: card.color,
              strokeWidth: '1.5'
            },
            '& svg path': {
              stroke: card.color,
              transition: 'stroke 0.3s ease-in-out'
            }
          },
          '& svg rect': {
            transition: 'all 0.3s ease-in-out',
            stroke: 'transparent',
            strokeWidth: '1.5'
          },
          '& svg path': {
            transition: 'stroke 0.3s ease-in-out'
          }
        }}
      >
        <Stack>
          {card.icon}
          <Typography
            className="stat-value"
            variant="h3"
            fontSize={'34px'}
            color='rgba(17,17,17,0.92)'
            marginTop={'20px'}
            marginBottom={'10px'}
            fontWeight="700"
            sx={{ transition: 'color 0.3s ease-in-out' }}
          >
            {card.value?.toLocaleString()}
          </Typography>
          <Typography
            className="stat-title"
            variant="subtitle2"
            fontSize="16px"
            color="rgba(17,17,17,0.62)"
            sx={{ transition: 'color 0.3s ease-in-out' }}
          >
            {card.title}
          </Typography>
        </Stack>
      </DashboardCard>
    // </Grid>
  );
};

interface ProfileData {
  id: number;
  name: string;
  email: string;
  role: string;
  personal: {
    first_name: string;
    last_name: string;
  };
  company: {
    name: string;
    logo: string;
    website: string;
  };
}

interface NotificationData {
  id: string | number;
  text: string;
  timestamp: string;
  read: boolean;
  type: string;
}

interface Template {
  id: string | number;
  name: string;
  title: string;
}

interface TemplatesResponse {
  templates: Record<string, { title: string }>;
}

const Dashboard = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [jobPostings, setJobPostings] = useState([]);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'close'>('all');
  const [isTabLoading, setIsTabLoading] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    id: 0,
    name: '',
    email: '',
    role: '',
    personal: {
      first_name: '',
      last_name: '',
    },
    company: {
      name: '',
      logo: '',
      website: '',
    }
  });
  const [formData, setFormData] = useState({
    title: '',
    level: 'junior',
    job_type: 'fulltime',
    work_model: 'onsite',
    location: '',
  });
  const [statistics, setStatistics] = useState(statCards);
  const [calendlyEvents, setCalendlyEvents] = useState<CalendlyEvent[]>([]);
  const [calendlyLoading, setCalendlyLoading] = useState(true);
  const [calendlyError, setCalendlyError] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [notificationsLoading, setNotificationsLoading] = useState(true);
  const [notificationsError, setNotificationsError] = useState<string | null>(null);
  const [emailTemplates, setEmailTemplates] = useState<Template[]>([]);
  const [emailTemplatesLoading, setEmailTemplatesLoading] = useState(true);
  const [emailTemplatesError, setEmailTemplatesError] = useState<string | null>(null);

  // Add a state to track if all data is loaded
  const [isAllDataLoaded, setIsAllDataLoaded] = useState(false);

  useEffect(() => {
    // Get profile data from localStorage
    const userProfile = localStorage.getItem('userProfile');
    if (userProfile) {
      const profile = JSON.parse(userProfile);

      // Map localStorage data to our state structure
      setProfileData({
        id: profile.id || 0,
        name: profile.name || '',
        email: profile.email || '',
        role: profile.role || '',
        personal: {
          first_name: profile.personalInfo.first_name || '',
          last_name: profile.personalInfo.last_name || '',
        },
        company: {
          name: profile.companyInfo.company_name || '',
          logo: profile.companyInfo.company_logo || '',
          website: profile.companyInfo.company_website || '',
        }
      });
    }
    setLoading(false);
  }, []);

  // Add an effect to check if all data is loaded
  useEffect(() => {
    const allDataLoaded = !calendlyLoading && 
                         !notificationsLoading && 
                         !isTabLoading && 
                         !emailTemplatesLoading &&
                         calendlyEvents.length > 0;

    if (allDataLoaded) {
      setIsAllDataLoaded(true);
      setShowSkeleton(false);
    }
  }, [calendlyLoading, notificationsLoading, isTabLoading, emailTemplatesLoading, calendlyEvents]);

  useEffect(() => {
    const fetchJobPostings = async () => {
      setIsTabLoading(true);
      const token = localStorage.getItem('jwt');
      let url = 'https://app.elevatehr.ai/wp-json/elevatehr/v1/jobs';
      if (statusFilter !== 'all') {
        url += `?status=${statusFilter}`;
      }

      try {
        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          cache: 'no-store'
        });
        const data = await response.json();
        setJobPostings(data);
      } catch (error) {
        console.error('Error fetching job postings:', error);
      } finally {
        setIsTabLoading(false);
      }
    };

    fetchJobPostings();
  }, [statusFilter]);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const token = localStorage.getItem('jwt');
        const response = await fetch('https://app.elevatehr.ai/wp-json/elevatehr/v1/statistics', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          cache: 'no-store'
        });
        const data = await response.json();
        const updatedStats = statistics.map((card) => ({
          ...card,
          value: data[card.id]
        }));
        setStatistics(updatedStats);
      } catch (error) {
        console.error('Error fetching statistics:', error);
      }
    };

    fetchStatistics();
  }, []);

  useEffect(() => {
    const fetchCalendlyEvents = async () => {
      try {
        setCalendlyLoading(true);
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

        // Then fetch events using the user's URI
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
        setCalendlyEvents(eventsData.collection || []);
      } catch (error) {
        console.error('Error fetching Calendly events:', error);
        setCalendlyError('Failed to fetch events. Please try again later.');
      } finally {
        setCalendlyLoading(false);
      }
    };

    fetchCalendlyEvents();
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('jwt');
        const response = await fetch('https://app.elevatehr.ai/wp-json/elevatehr/v1/notifications', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch notifications');
        }

        const data = await response.json();
        setNotifications(data);
      } catch (err) {
        setNotificationsError(err instanceof Error ? err.message : 'Failed to fetch notifications');
      } finally {
        setNotificationsLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  useEffect(() => {
    const fetchEmailTemplates = async () => {
      try {
        const token = localStorage.getItem('jwt');
        const response = await fetch('https://app.elevatehr.ai/wp-json/elevatehr/v1/email-templates', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        const data: TemplatesResponse = await response.json();
        if (data?.templates) {
          const formattedTemplates = Object.entries(data.templates).map(([key, value]) => ({
            id: value.title.toLowerCase().replace(/\s+/g, '-'),
            name: value.title,
            title: value.title
          }));
          setEmailTemplates(formattedTemplates);
        }
      } catch (error) {
        console.error('Error fetching email templates:', error);
        setEmailTemplatesError('Failed to fetch email templates');
      } finally {
        setEmailTemplatesLoading(false);
      }
    };

    fetchEmailTemplates();
  }, []);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const router = useRouter();
  const handleSubmit = () => {
    setIsSubmitting(true);
    const token = localStorage.getItem('jwt');
    fetch('https://app.elevatehr.ai/wp-json/elevatehr/v1/jobs', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      cache: 'no-store',
      body: JSON.stringify(formData)
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.id) {
          router.push(`/dashboard/create-job-posting/${data.id}`);
          setIsSubmitting(false);
        } else {
          console.error('Job ID not found in response:', data);
          setIsSubmitting(false);
        }
      })
      .catch((error) => {
        setIsSubmitting(false);
        console.error('Error creating job posting:', error);
      });
  };
  if (showSkeleton || !isAllDataLoaded) {
    return <DashboardSkeleton />;
  }
  return (
    <PageContainer title="Dashboard" description="this is Dashboard">
      {/* <ToolbarStyled direction='row' alignItems='center' justifyContent='space-between'>
        <Stack 
          spacing={2} 
          sx={{
            [theme.breakpoints.up('sm')]: {
              mb: 3,
              mt: 3
            },
            [theme.breakpoints.down('sm')]: {
              mb: 2,
              mt: 1
            }
          }}
        >
          <Greeting variant='body1' fontWeight='semibold'>Hello Recruiter,</Greeting>
          <Typography 
            variant='body2' 
            fontWeight='semibold' 
            fontSize='16px' 
            color={'rgba(17,17,17,0.62)'}
            sx={{
              [theme.breakpoints.up('sm')]: {
                mt: '16px !important'
              },
              [theme.breakpoints.down('sm')]: {
                mt: '8px !important'
              }
            }}
          >
            Welcome to your Dashboard
          </Typography>
        </Stack>
        <PrimaryButton onClick={handleOpen}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 5V19M5 12H19"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <Typography fontWeight={'medium'} sx={{ display: { xs: 'none', sm: 'block' } }}>
            Create new Position
          </Typography>
        </PrimaryButton>
      </ToolbarStyled> */}
      <Paper
        elevation={0}
        sx={{
          my: 4,
          borderRadius: '10px',
          overflow: 'hidden',
          maxWidth: '1440px',
        }}
      >
        {/* Header Background */}
        <Box
          sx={{
            height: '120px',
            bgcolor: 'primary.main',
            position: 'relative',
            backgroundImage: 'url("/images/backgrounds/banner-bg.svg")',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundSize: 'cover',
          }}
        />

        {/* Profile Info Section */}
        <Box sx={{
          px: 4,
          pb: 3,
          pt: 3,
          position: 'relative',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
        }}>
          {/* Logo and Company Info */}
          <Box sx={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 3,
            width: '100%',
            height: '50px',
          }}>
            {/* Logo */}
            <Avatar
              src={profileData.company.logo || '/images/logos/logo.svg'}
              alt={profileData.company.name}
              sx={{
                width: 130,
                height: 130,
                border: '4px solid white',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                position: 'relative',
                top: -80,
                bgcolor: 'white',
                padding: 1.5,
                '& img': {
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }
              }}
            />

            {/* Company Name and Website */}
            <Box sx={{ pb: 0, mt: -1 }}>
              <Typography variant="h4" fontWeight={600} sx={{ color: 'rgba(17, 17, 17, 0.92)', fontSize: '28px' }}>
                {profileData.company.name || 'ElevateHR'}
              </Typography>

              <Typography
                component="a"
                href={profileData.company.website ?
                  (profileData.company.website.startsWith('http') ? profileData.company.website : `https://${profileData.company.website}`) :
                  '#'}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  color: 'rgba(17, 17, 17, 0.6)',
                  textDecoration: 'none',
                  fontSize: '16px',
                  fontWeight: 500,
                  mt: 0.5,
                  '&:hover': {
                    color: theme.palette.primary.main,
                    textDecoration: 'underline',
                  }
                }}
              >
                {profileData.company.website || 'www.elevatehr.ai'}
                <Box component="span" sx={{ display: 'inline-block', ml: 0.5, transform: 'translateY(1px)' }}>
                  <svg width="14" height="14" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 10.5H1.5V2H5.25V0.75H0.75C0.335786 0.75 0 1.08579 0 1.5V11.25C0 11.6642 0.335786 12 0.75 12H10.75C11.1642 12 11.5 11.6642 11.5 11.25V6.75H10V10.5ZM6.75 0.75V2H9.4425L3.2175 8.2275L4.2725 9.2825L10.5 3.0575V5.75H11.75V0.75H6.75Z" fill="currentColor" />
                  </svg>
                </Box>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Paper>

      <Box>
        <Grid spacing={3} sx={{ width: '100%', }}>
          <Grid container xs={12} spacing={3} padding={0} sx={{ margin: 0, marginBottom: 3, alignItems: 'stretch' }}>
            <Grid item xs={8} sx={{
              margin: 0,
              overflowX: 'scroll',
              height: '300px',
              '&::-webkit-scrollbar': {
                display: 'none'
              },
              flexDirection: 'column',
              msOverflowStyle: 'none',
              scrollbarWidth: 'none',
              backgroundColor: 'white',
              borderRadius: '10px',
              padding: '20px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
            }}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 600,
                  color: "rgba(17, 17, 17, 0.92)",
                  fontSize: 24,
                  lineHeight: "24px",
                  letterSpacing: "0.36px",
                  mb: 2,
                }}
              >
                Your Stats
              </Typography>
              <Stack direction={'row'} spacing={3} flexWrap={'nowrap'} sx={{ padding: 0, margin: 0 }}>
                {statistics.map((card, index) => {
                  if (card.id === 'interviews') {
                    return <StatCard key={index} card={{ ...card, value: calendlyEvents.length }} index={index} length={statistics.length} />
                  }
                  return <StatCard key={index} card={card} index={index} length={statistics.length} />
                })}
              </Stack>
            </Grid>
            <Grid item xs={4} paddingTop={0} sx={{ paddingTop: "0 !important" }}>
              <Notifications 
                notifications={notifications}
                loading={false}
                error={notificationsError}
              />
            </Grid>
          </Grid>
          <Grid container item xs={12} spacing={3} justifyContent={'space-between'} height={'600px'}>
            <Grid item xs={12} lg={8} maxHeight={'100%'} sx={{ height: '600px', overflow: 'hidden' }}>
              <JobPostings
                jobPostings={jobPostings}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                isLoading={false}
              />
            </Grid>
            <Grid container item spacing={2.5} xs={12} lg={4} height={'612px'} direction={{ xs: 'column', md: 'row' }}>
              <Grid item xs={12} md={6} lg={12} flex={1} height={'50%'}>
                <Calendar
                  customStyle={{ height: '100%' }}
                  events={calendlyEvents}
                  loading={false}
                  error={calendlyError}
                />
              </Grid>
              <Grid item xs={12} md={6} lg={12} flex={1} height={'50%'}>
                <EmailTemplates 
                  customStyle={{ height: '100%' }}
                  templates={emailTemplates}
                  loading={false}
                  error={emailTemplatesError}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
      <StyledDialog open={open} onClose={handleClose}>
        <DialogTitle sx={{ padding: 0 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h6" fontWeight={600} color="rgba(17, 17, 17, 0.92)" fontSize={'20px'}>
              Create Job Posting
            </Typography>
            <IconButton size="small" sx={{ bgcolor: "#eaeaea", borderRadius: "20px", width: 24, height: 24 }} onClick={handleClose}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ padding: 0 }}>
          <Stack spacing={4}>
            <Stack spacing={1}>
              <Typography variant="body1" fontWeight={600} color="rgba(17, 17, 17, 0.84)">
                Job title
              </Typography>
              <TextField
                fullWidth
                placeholder="Add job title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                sx={{ bgcolor: "#f2f4f6", "& .MuiOutlinedInput-root": { borderColor: "#d7dadf", borderWidth: "0.5px" } }}
              />
            </Stack>
            <Stack spacing={1}>
              <Typography variant="body1" fontWeight={600} color="rgba(17, 17, 17, 0.84)">
                Level
              </Typography>
              <FormControl>
                <RadioGroup row value={formData.level} onChange={handleChange} name="level" sx={{ gap: '10px' }}>
                  {["Junior", "Mid", "Senior"].map((option) => (
                    <FormControlLabel
                      key={option}
                      value={option.toLowerCase()}
                      control={<Radio sx={{ color: "rgba(17, 17, 17, 0.68)", "&.Mui-checked": { color: "rgba(17, 17, 17, 0.84)" } }} />}
                      label={option}
                      sx={{ m: 0, width: 145, height: 48, bgcolor: "#f2f4f6", borderRadius: 1, border: "0.5px solid #d7dadf", "& .MuiFormControlLabel-label": { color: "rgba(17, 17, 17, 0.84)", fontWeight: 400 } }}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </Stack>
            <Stack spacing={1}>
              <Typography variant="body1" fontWeight={600} color="rgba(17, 17, 17, 0.84)">
                Job type
              </Typography>
              <FormControl>
                <RadioGroup row value={formData.job_type} onChange={handleChange} name="job_type" sx={{ gap: '10px' }}>
                  {["Full-time", "Contract"].map((option) => (
                    <FormControlLabel
                      key={option}
                      value={option.toLowerCase().replace('-', '')}
                      control={<Radio sx={{ color: "rgba(17, 17, 17, 0.68)", "&.Mui-checked": { color: "rgba(17, 17, 17, 0.84)" } }} />}
                      label={option}
                      sx={{ m: 0, width: 145, height: 48, bgcolor: "#f2f4f6", borderRadius: 1, border: "0.5px solid #d7dadf", "& .MuiFormControlLabel-label": { color: "rgba(17, 17, 17, 0.84)", fontWeight: 400 } }}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </Stack>
            <Stack spacing={1}>
              <Typography variant="body1" fontWeight={600} color="rgba(17, 17, 17, 0.84)">
                Office presence
              </Typography>
              <FormControl>
                <RadioGroup row value={formData.work_model} onChange={handleChange} name="work_model" sx={{ gap: '10px' }}>
                  {["On-site", "Remote", "Hybrid"].map((option) => (
                    <FormControlLabel
                      key={option}
                      value={option.toLowerCase().replace('-', '')}
                      control={<Radio sx={{ color: "rgba(17, 17, 17, 0.68)", "&.Mui-checked": { color: "rgba(17, 17, 17, 0.84)" } }} />}
                      label={option}
                      sx={{ m: 0, width: 145, height: 48, bgcolor: "#f2f4f6", borderRadius: 1, border: "0.5px solid #d7dadf", "& .MuiFormControlLabel-label": { color: "rgba(17, 17, 17, 0.84)", fontWeight: 400 } }}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </Stack>
            <Stack spacing={1}>
              <Typography variant="body1" fontWeight={600} color="rgba(17, 17, 17, 0.84)">
                Location
              </Typography>
              <TextField
                fullWidth
                placeholder="Add location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                sx={{ bgcolor: "#f2f4f6", "& .MuiOutlinedInput-root": { borderColor: "#d7dadf", borderWidth: "0.5px" } }}
              />
            </Stack>
            <Button
              variant="contained"
              fullWidth
              sx={{
                color: "secondary.light",
                mt: 2,
                py: 2,
                bgcolor: "primary.main",
                borderRadius: 2,
                textTransform: "none",
                "&:hover": {
                  bgcolor: "primary.main",
                },
              }}
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Create Job'}
            </Button>
          </Stack>
        </DialogContent>
      </StyledDialog>
    </PageContainer>
  );
};

export default Dashboard;

interface CustomInputProps {
  label: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
}

const CustomInput = ({ label, value, onChange, name }: CustomInputProps) => {
  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    width: '456px',
    height: '48px',
    padding: '16px 354px 16px 16px',
    borderRadius: '6px',
    border: '0.5px solid #D7DAE0',
    background: '#F3F4F7',
    display: 'flex',
    alignItems: 'center',
  }));

  const StyledFormControl = styled(FormControl)(({ theme }) => ({
    width: '456px',
  }));

  const StyledInputLabel = styled(InputLabel)(({ theme }) => ({
    color: 'rgba(17, 17, 17, 0.84)',
    position: 'relative',
    fontSize: '16px',
    fontStyle: 'normal',
    fontWeight: 600,
    lineHeight: '16px',
    marginBottom: '8px', // Space between label and input
    transform: 'translate(0, -50)', // Ensure the label stays in place
    display: 'block',
  }));

  return (
    <StyledFormControl variant="standard">
      <StyledInputLabel shrink htmlFor={name}>
        {label}
      </StyledInputLabel>
      <StyledInputBase
        id={name}
        value={value}
        onChange={onChange}
        name={name}
      />
    </StyledFormControl>
  );
};

const LevelRadioGroup = ({ value, onChange }: { value: string; onChange: (event: React.ChangeEvent<HTMLInputElement>) => void }) => {
  return (
    <FormControl component="fieldset">
      <Typography variant="subtitle1" marginBottom={1}>Level</Typography>
      <StyledRadioGroup row value={value} onChange={onChange} name="level">
        <StyledFormControlLabel value="junior" control={<StyledRadio />} label="Junior" />
        <StyledFormControlLabel value="mid-level" control={<StyledRadio />} label="Mid-Level" />
        <StyledFormControlLabel value="senior" control={<StyledRadio />} label="Senior" />
      </StyledRadioGroup>
    </FormControl>
  );
};
