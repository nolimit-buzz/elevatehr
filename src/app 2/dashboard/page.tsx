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
    id: 'new',
    title: "Applicants",
    value: 0, // Will be updated with fetched data
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
    id: 'skill_assessment',
    title: "Skill Assessment",
    value: 0, // Will be updated with fetched data
  },
  // {
  //   icon: (
  //     <SvgIcon>
  //       <svg width="120" height="120" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
  //         <rect width="60" height="60" rx="30" fill="#FD8535" />
  //         <path d="M30.8281 43.1563H20.9533C16.0158 43.1563 14.375 39.875 14.375 36.5781V23.4219C14.375 18.4844 16.0158 16.8438 20.9533 16.8438H30.8281C35.7656 16.8438 37.4062 18.4844 37.4062 23.4219V36.5781C37.4062 41.5156 35.75 43.1563 30.8281 43.1563Z" stroke="white" stroke-width="1.875" stroke-linecap="round" stroke-linejoin="round" />
  //         <path d="M41.75 37.9688L37.4062 34.9219V25.0625L41.75 22.0156C43.875 20.5313 45.625 21.4375 45.625 24.0469V35.9531C45.625 38.5625 43.875 39.4688 41.75 37.9688Z" stroke="white" stroke-width="1.875" stroke-linecap="round" stroke-linejoin="round" />
  //         <path d="M29.2188 28.4375C30.5125 27.9063 31.5625 27.3881 31.5625 25.0938C31.5625 22.6875 30.5125 21.25 29.2188 21.25C27.925 21.25 26.875 22.6875 26.875 25.0938C26.875 27.3881 27.925 27.9063 29.2188 28.4375Z" stroke="white" stroke-width="1.875" stroke-linecap="round" stroke-linejoin="round" />
  //       </svg>
  //     </SvgIcon>
  //   ),
  //   color: '#FD8535',
  //   id: 'interviews',
  //   title: "Interviews",
  //   value: 0, // Will be updated with fetched data
  // },
  // {
  //   icon: (
  //     <SvgIcon>
  //       <svg width="120" height="120" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
  //         <rect width="60" height="60" rx="30" fill="#D834DE" />
  //         <path d="M25.7031 25.3906C28.4844 26.4063 31.5156 26.4063 34.2969 25.3906" stroke="white" stroke-width="1.875" stroke-linecap="round" stroke-linejoin="round" />
  //         <path d="M37.5312 14.375H22.4688C19.1406 14.375 17.4375 17.0938 17.4375 20.4062V42.4219C17.4375 45.2344 18.4531 46.4219 20.9219 45.0625L28.5469 40.8281C29.3594 40.375 30.6406 40.375 31.4688 40.8281L39.0938 45.0625C41.5625 46.4219 42.7031 45.2344 42.7031 42.4219V20.4062C42.7031 17.0938 41 14.375 37.5312 14.375Z" stroke="white" stroke-width="1.875" stroke-linecap="round" stroke-linejoin="round" />
  //       </svg>
  //     </SvgIcon>
  //   ),
  //   color: '#D834DE',
  //   id: 'archived',
  //   title: "Archived",
  //   value: 0, // Will be updated with fetched data
  // },
  {
    icon: (
      <SvgIcon>
        <svg width="120" height="120" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="60" height="60" rx="30" fill="#35B0FD" />
          <path d="M33.8123 41.0156L36.1874 43.3906L40.9373 38.6406" stroke="white" stroke-width="1.875" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M30.25 28.2344C30.0938 28.2188 29.9062 28.2188 29.7344 28.2344C26.0156 28.1094 23.0625 25.125 23.0625 21.3125C23.0625 17.4844 26.0156 14.375 30 14.375C33.8125 14.375 36.9375 17.4844 36.9375 21.3125C36.9375 25.125 33.9531 28.1094 30.25 28.2344Z" stroke="white" stroke-width="1.875" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M30 45.3281C27.1406 45.3281 24.3125 44.6094 22.1562 43.1719C20.2656 42.0156 20.2656 40.75 22.1719 38.25L30 30.25C30.0156 30.125 31.5938 30.125 32.5938 30.25L39.0938 35.9531C43.5781 40.4375 45.625 41.5156 45.625 38.6719V20.4062C45.625 17.1094 43.5781 14.375 39.0938 14.375H20.9219C16.4375 14.375 14.375 17.1094 14.375 21.3125C14.375 25.125 16.4375 28.1094 20.9219 28.2344Z" stroke="white" stroke-width="1.875" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </SvgIcon>
    ),
    color: '#35B0FD',
    id: 'acceptance',
    title: "Acceptance",
    value: 0, // Will be updated with fetched data
  },
  {
    icon: (
      <SvgIcon>
        <svg width="120" height="120" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="60" height="60" rx="30" fill="#FDBD0D" />
          <path d="M40.0156 39.5156L35.6094 43.9219" stroke="white" stroke-width="1.875" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M40.0156 43.9219L35.6094 39.5156" stroke="white" stroke-width="1.875" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M30.25 28.2344C30.125 28.2188 29.9062 28.2188 29.7344 28.2344C26.0156 28.1094 23.0625 25.125 23.0625 21.3125C23.0625 17.4844 26.0156 14.375 30 14.375C33.8125 14.375 36.9375 17.4844 36.9375 21.3125C36.9375 25.125 33.9688 28.1094 30.25 28.2344Z" stroke="white" stroke-width="1.875" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M30 45.3281C27.1406 45.3281 24.3125 44.6094 22.1562 43.1719C20.2656 42.0156 20.2656 40.75 22.1719 38.25L30 30.25C30.0156 30.125 31.5938 30.125 32.5938 30.25L37.5938 35.9531C43.5781 40.4375 45.625 41.5156 45.625 38.6719V20.4062C45.625 17.1094 43.5781 14.375 39.0938 14.375H20.9219C16.4375 14.375 14.375 17.1094 14.375 21.3125C14.375 25.125 16.4375 28.1094 20.9219 28.2344Z" stroke="white" stroke-width="1.875" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </SvgIcon>
    ),
    color: '#FDBD0D',
    id: 'rejection',
    title: "Rejected",
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
    <Grid item xs={2} minWidth={{ xs: '170px', md: '220px' }} sx={{ flex: 1 }}>
      <DashboardCard
        customStyle={{
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
    </Grid>
  );
};

const Dashboard = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [jobPostings, setJobPostings] = useState([]);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'close'>('all');
  const [isTabLoading, setIsTabLoading] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    personal: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      jobTitle: '',
    },
    company: {
      name: '',
      logo: '',
      size: '',
      about: '',
      bookingLink: '',
      website: '',
    }
  });
  useEffect(() => {
    // Get profile data from localStorage
    const userProfile = localStorage.getItem('userProfile');
    if (userProfile) {
      const profile = JSON.parse(userProfile);

      // Map localStorage data to our state structure
      setProfileData({
        personal: {
          firstName: profile.personalInfo.first_name || '',
          lastName: profile.personalInfo.last_name || '',
          email: profile.personalInfo.email || '',
          phone: profile.personalInfo.phone_number || '',
          jobTitle: profile.companyInfo.job_title || '',
        },
        company: {
          name: profile.companyInfo.company_name || '',
          logo: profile.companyInfo.company_logo || '',
          size: profile.companyInfo.number_of_employees || '0',
          about: profile.companyInfo.about_company || '',
          bookingLink: profile.companyInfo.booking_link || '',
          website: profile.companyInfo.company_website || '',
        }
      });
    }
    setLoading(false);
  }, []);
  const [formData, setFormData] = useState({
    title: '',
    level: 'junior',
    job_type: 'fulltime',
    work_model: 'onsite',
    location: '',
  });
  const [statistics, setStatistics] = useState(statCards);
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
        setLoading(false);
        setIsTabLoading(false);
        setTimeout(() => {
          setShowSkeleton(false);
        }, 2000);
      }
    };

    fetchJobPostings();
  }, [statusFilter]);

  useEffect(() => {
    const fetchStatistics = async () => {
      setLoading(true);
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
          value: data.by_stage[card.id]
        }));
        setStatistics(updatedStats);
      } catch (error) {
        console.error('Error fetching statistics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
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
  if (showSkeleton) {
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
          <Grid container item xs={12} marginBottom={3} sx={{
            overflowX: 'scroll',
            // width: '100%',
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
            <Stack direction={'row'} flexWrap={'nowrap'} gap={3} >
              {statistics.map((card, index) => (
                <StatCard key={index} card={card} index={index} length={statistics.length} />
              ))}
            </Stack>
          </Grid>
          <Grid container item xs={12} spacing={3} justifyContent={'space-between'} minHeight={'600px'} maxHeight={'700px'}>
            <Grid item xs={12} lg={8} maxHeight={'100%'} overflow={'scroll'}>
              {loading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <Skeleton key={index} variant="rectangular" width="100%" height={150} sx={{ mb: 2, borderRadius: 2 }} />
                ))
              ) : (
                <JobPostings
                  customStyle={{ height: '100%', overflow: 'scroll' }}
                  jobPostings={jobPostings}
                  statusFilter={statusFilter}
                  setStatusFilter={setStatusFilter}
                  isLoading={isTabLoading}
                />
              )}
            </Grid>
            <Grid container item spacing={'12px'} xs={12} lg={4} minHeight={'600px'} maxHeight={'700px'} direction={{ xs: 'column', md: 'row' }}>
              <Grid item xs={12} md={6} lg={12} flex={1} maxHeight={'50%'} overflow={'scroll'}>

                <Calendar customStyle={{ height: '100%', overflow: 'scroll' }} />
              </Grid>
              <Grid item xs={12} md={6} lg={12} flex={1} maxHeight={'50%'} overflow={'scroll'}>
                <EmailTemplates customStyle={{ height: '100%', overflow: 'scroll' }} />
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
