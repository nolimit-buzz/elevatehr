'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Paper,
  Button,
  Stack,
  IconButton,
  Avatar,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  CircularProgress,
  Snackbar,
  Alert,
  styled,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton as MuiIconButton,
  Tabs,
  Tab,
  Link,
  Chip
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ArrowBack from '@mui/icons-material/ArrowBack';
import CheckIcon from '@mui/icons-material/Check';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';
import { useRouter } from 'next/navigation';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventNoteIcon from '@mui/icons-material/EventNote';
import RefreshIcon from '@mui/icons-material/Refresh';

// Custom styled TextField component
const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#FFF',
    borderRadius: '8px',
    border: '0.8px solid rgba(17, 17, 17, 0.14)',
    transition: 'all 0.3s ease',
    '&.Mui-focused': {
      border: `0.8px solid ${theme.palette.primary.main}`,
      boxShadow: `0 0 0 1px ${theme.palette.primary.main}25`,
    },
    '& .MuiOutlinedInput-helperText': {
      color: 'rgba(17, 17, 17, 0.6)',
      fontSize: '15px',
      fontWeight: 400,
    }
  },
  '& .MuiOutlinedInput-input': {
    padding: '14px 16px',
    fontWeight: 400,
    fontSize: '16px',
    color: 'rgba(17, 17, 17, 0.92)',
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(17, 17, 17, 0.6)',
    fontSize: '15px',
    fontWeight: 400,
    transform: 'translate(16px, 15px) scale(1)',
    '&.Mui-focused, &.MuiFormLabel-filled': {
      transform: 'translate(16px, -9px) scale(0.75)',
      backgroundColor: '#FFF',
      padding: '0 8px',
    }
  },
  '& .MuiInputLabel-shrink': {
    transform: 'translate(16px, -9px) scale(0.75)',
    backgroundColor: '#FFF',
    padding: '0 8px',
  },
  '& fieldset': {
    border: 'none',
  }
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
  '&:hover': {
    backgroundColor: '#6666E6',
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 12px rgba(68, 68, 226, 0.15)',
  },
}));

interface ProfileData {
  personal: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    jobTitle: string;
  };
  company: {
    name: string;
    logo: string;
    size: string;
    about: string;
    bookingLink: string;
    website: string;
  };
}

// Define section type for navigation
type ProfileSection = 'personal' | 'company' | 'password' | 'applications' | 'integrations' | 'calendly';

interface ErrorState {
  email?: string;
  bookingLink?: string;
  website?: string;
  password?: string;
}

const ProfilePage = () => {
  const theme = useTheme();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<ProfileSection>('personal');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logoUploading, setLogoUploading] = useState(false);
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
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<ErrorState>({});
  const [integrations, setIntegrations] = useState({
    calendly: {
      connected: Boolean(process.env.NEXT_PUBLIC_CALENDLY_CLIENT_ID && process.env.NEXT_PUBLIC_CALENDLY_CLIENT_SECRET),
    },
    zoom: {
      connected: false,
      email: '',
    },
    googleCalendar: {
      connected: false,
    }
  });
  const [calendlyModalOpen, setCalendlyModalOpen] = useState(false);
  const [eventDetails, setEventDetails] = useState<{
    name: string;
    duration: number;
    description: string;
    schedulingUrl: string;
  } | null>(null);
  const [calendlyEvents, setCalendlyEvents] = useState<any[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(false);

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

  // Update localStorage when profile data changes
  useEffect(() => {
    if (profileData.personal.firstName || profileData.personal.lastName) {
      const userProfile = localStorage.getItem('userProfile');
      if (userProfile) {
        const profile = JSON.parse(userProfile);
        const updatedProfile = {
          ...profile,
          personalInfo: {
            ...profile.personalInfo,
            first_name: profileData.personal.firstName,
            last_name: profileData.personal.lastName,
            email: profileData.personal.email,
            phone_number: profileData.personal.phone,
          },
          companyInfo: {
            ...profile.companyInfo,
            job_title: profileData.personal.jobTitle,
            company_name: profileData.company.name,
            number_of_employees: profileData.company.size,
            about_company: profileData.company.about,
            booking_link: profileData.company.bookingLink,
            company_website: profileData.company.website,
          }
        };
        localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
      }
    }
  }, [profileData]);

  const handleSectionChange = (section: ProfileSection) => {
    setActiveSection(section);
  };

  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateUrl = (url: string, allowWithoutHttp = false): boolean => {
    if (!url) return true;
    
    if (allowWithoutHttp && !url.startsWith('http')) {
      // For website fields, we'll allow domains without http:// as we can add it later
      url = 'https://' + url;
    }
    
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleProfileChange = (section: 'personal' | 'company', field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    
    // Clear validation errors when the user types
    if (field === 'email') {
      setErrors(prev => ({ ...prev, email: undefined }));
    } else if (field === 'bookingLink') {
      setErrors(prev => ({ ...prev, bookingLink: undefined }));
    } else if (field === 'website') {
      setErrors(prev => ({ ...prev, website: undefined }));
    }
  };

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear password error when user types
    if (field === 'confirmPassword' || field === 'newPassword') {
      setErrors(prev => ({ ...prev, password: undefined }));
    }
  };

  // Validate form inputs
  const validateForm = (section: ProfileSection): boolean => {
    let isValid = true;
    const newErrors: ErrorState = {};
    
    if (section === 'personal') {
      if (!validateEmail(profileData.personal.email)) {
        newErrors.email = 'Please enter a valid email address';
        isValid = false;
      }
    }
    
    if (section === 'company') {
      if (profileData.company.bookingLink && !validateUrl(profileData.company.bookingLink)) {
        newErrors.bookingLink = 'Please enter a valid URL';
        isValid = false;
      }
      
      if (profileData.company.website && !validateUrl(profileData.company.website, true)) {
        newErrors.website = 'Please enter a valid URL';
        isValid = false;
      }
    }
    
    if (section === 'password') {
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        newErrors.password = 'Passwords do not match';
        isValid = false;
      }
      
      if (passwordData.newPassword && passwordData.newPassword.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
        isValid = false;
      }
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  // Save profile data
  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem('jwt');
      
      const formData = new FormData();
      formData.append('first_name', profileData.personal.firstName);
      formData.append('last_name', profileData.personal.lastName);
      formData.append('email', profileData.personal.email);
      formData.append('phone', profileData.personal.phone);
      formData.append('job_title', profileData.personal.jobTitle);
      formData.append('company_name', profileData.company.name);
      formData.append('number_of_employees', profileData.company.size);
      formData.append('company_about', profileData.company.about);
      formData.append('booking_link', profileData.company.bookingLink);
      formData.append('website', profileData.company.website);
      
      const response = await fetch('https://app.elevatehr.ai/wp-json/elevatehr/v1/company/profile', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      if (response.ok) {
        setNotification({
          open: true,
          message: String('Profile updated successfully'),
          severity: 'success'
        });
        
        // Update localStorage with the new data
        const userProfile = localStorage.getItem('userProfile');
        if (userProfile) {
          const profile = JSON.parse(userProfile);
          const updatedProfile = {
            ...profile,
            personalInfo: {
              ...profile.personalInfo,
              first_name: profileData.personal.firstName,
              last_name: profileData.personal.lastName,
              email: profileData.personal.email,
              phone_number: profileData.personal.phone,
            },
            companyInfo: {
              ...profile.companyInfo,
              job_title: profileData.personal.jobTitle,
              company_name: profileData.company.name,
              number_of_employees: profileData.company.size,
              about_company: profileData.company.about,
              booking_link: profileData.company.bookingLink,
              company_website: profileData.company.website,
            }
          };
          localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
        }
      } else {
        const errorData = await response.json();
        if (errorData.code === 'upload_error' && !errorData.message) {
          // Ignore upload error if not inside handleLogoUpload
          return;
        } 
        setNotification({
          open: true,
          message: 'Successfully updated profile',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setNotification({
        open: true,
        message: 'Error updating profile',
        severity: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!validateForm('password')) {
      return;
    }
    
    try {
      setSaving(true);
      const token = localStorage.getItem('jwt');
      
      const response = await fetch('https://app.elevatehr.ai/wp-json/elevatehr/v1/change-password', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(passwordData)
      });
      
      if (response.ok) {
        setNotification({
          open: true,
          message: 'Password changed successfully',
          severity: 'success',
        });
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      } else {
        const errorData = await response.json();
        setNotification({
          open: true,
          message: errorData.message || 'Failed to change password',
          severity: 'error',
        });
      }
    } catch (error) {
      console.error('Error changing password:', error);
      setNotification({
        open: true,
        message: 'Error changing password',
        severity: 'error',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    try {
      setLogoUploading(true);
      const token = localStorage.getItem('jwt');
      
      const formData = new FormData();
      formData.append('company_logo', file);
      
      const response = await fetch('https://app.elevatehr.ai/wp-json/elevatehr/v1/company/profile', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      if (response.ok) {
        const data = await response.json();
        setProfileData(prev => ({
          ...prev,
          company: {
            ...prev.company,
            logo: data.user.company_logo
          }
        }));
        
        // Update localStorage with the new data
        const userProfile = localStorage.getItem('userProfile');
        if (userProfile) {
          const profile = JSON.parse(userProfile);
          const updatedProfile = {
            ...profile,
            personalInfo: {
              ...profile.personalInfo,
              first_name: data.user.first_name,
              last_name: data.user.last_name,
              email: data.user.email,
              phone_number: data.user.phone_number,
            },
            companyInfo: {
              ...profile.companyInfo,
              company_name: data.user.company_name,
              number_of_employees: data.user.number_of_employees,
              booking_link: data.user.booking_link,
              company_logo: data.user.company_logo,
            }
          };
          localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
        }
        
        setNotification({
          open: true,
          message: 'Profile updated successfully',
          severity: 'success',
        });
      } else {
        const errorData = await response.json();
        setNotification({
          open: true,
          message: errorData.message ? JSON.stringify(errorData.message) : 'Failed to update profile',
          severity: 'error',
        });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setNotification({
        open: true,
        message: 'Error updating profile',
        severity: 'error',
      });
    } finally {
      setLogoUploading(false);
    }
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  const handleIntegrationConnect = async (integration: string) => {
    try {
      setSaving(true);
      const token = localStorage.getItem('jwt');
      
      // Here you would typically handle OAuth flow or API connection
      // For now, we'll just simulate a connection
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIntegrations(prev => ({
        ...prev,
        [integration]: {
          ...prev[integration as keyof typeof prev],
          connected: true
        }
      }));
      
      setNotification({
        open: true,
        message: `${integration.charAt(0).toUpperCase() + integration.slice(1)} connected successfully`,
        severity: 'success'
      });
    } catch (error) {
      console.error(`Error connecting ${integration}:`, error);
      setNotification({
        open: true,
        message: `Failed to connect ${integration}`,
        severity: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCalendlyConnect = () => {
    const width = 600;
    const height = 700;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
    
    window.open(
      `https://auth.calendly.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_CALENDLY_CLIENT_ID}&response_type=code&redirect_uri=http://localhost:3000/auth/calendly`,
      'Calendly OAuth',
      `width=${width},height=${height},left=${left},top=${top}`
    );

    // Listen for messages from the popup
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.data.type === 'CALENDLY_AUTH_SUCCESS') {
        setIntegrations(prev => ({
          ...prev,
          calendly: { ...prev.calendly, connected: true }
        }));
        setEventDetails(event.data.eventData);
        setNotification({
          open: true,
          message: 'Calendly event created successfully!',
          severity: 'success'
        });
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  };

  // Function to get Calendly access token
  const getCalendlyAccessToken = async () => {
    try {
      const response = await fetch('https://auth.calendly.com/oauth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: process.env.NEXT_PUBLIC_CALENDLY_CLIENT_ID || '',
          client_secret: process.env.NEXT_PUBLIC_CALENDLY_CLIENT_SECRET || '',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get access token');
      }

      const data = await response.json();
      return data.access_token;
    } catch (error) {
      console.error('Error getting Calendly access token:', error);
      throw error;
    }
  };

  // Function to fetch Calendly events
  const fetchCalendlyEvents = async () => {
    try {
      setLoadingEvents(true);
      const accessToken = await getCalendlyAccessToken();
      console.log('accessToken', accessToken);
      
      // First get the user profile
      const userResponse = await fetch('https://api.calendly.com/users/me', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
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
      const eventsResponse = await fetch(`https://api.calendly.com/scheduled_events?user=${userUuid}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
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
      setNotification({
        open: true,
        message: 'Failed to fetch Calendly events',
        severity: 'error',
      });
    } finally {
      setLoadingEvents(false);
    }
  };

  // Fetch events when Calendly tab is active
  useEffect(() => {
  console.log('activeSection', activeSection);
  console.log('integrations.calendly.connected', integrations);
    if (activeSection === 'calendly' && integrations.calendly.connected) {
    console.log('fetching calendly events');
      fetchCalendlyEvents();
    }
  }, [activeSection, integrations.calendly.connected]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: '1280px', mx: 'auto' }}>
      {/* Back Button */}
      <Box sx={{ mt: 2, mb: 2 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => router.push('/dashboard')}
          sx={{
            color: 'rgba(17, 17, 17, 0.7)',
            fontWeight: 500,
            fontSize: '15px',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
            }
          }}
        >
          Back to Dashboard
        </Button>
      </Box>

      {/* Profile Header */}
      <Paper 
        elevation={0}
        sx={{ 
          mt: 3,
          borderRadius: '10px',
          overflow: 'hidden',
        }}
      >
        {/* Header Background */}
        <Box 
          sx={{ 
            height: '120px',
            bgcolor: theme.palette.primary.main,
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
                    <path d="M10 10.5H1.5V2H5.25V0.75H0.75C0.335786 0.75 0 1.08579 0 1.5V11.25C0 11.6642 0.335786 12 0.75 12H10.75C11.1642 12 11.5 11.6642 11.5 11.25V6.75H10V10.5ZM6.75 0.75V2H9.4425L3.2175 8.2275L4.2725 9.2825L10.5 3.0575V5.75H11.75V0.75H6.75Z" fill="currentColor"/>
                  </svg>
                </Box>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Paper>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, mt: 3, gap: 3 }}>
        {/* Sidebar - Only visible on lg screens and up */}
        <Box sx={{ 
          display: { xs: 'none', lg: 'block' },
          width: '30%', 
          minWidth: '250px', 
          maxWidth: '300px' 
        }}>
          <Paper
            elevation={0}
            sx={{ 
              bgcolor: 'white',
              borderRadius: '10px',
              height: 'max-content',
              overflow: 'hidden'
            }}
          >
            <Typography 
              variant="h6" 
              sx={{ p: 2, borderBottom: '0.8px solid rgba(17, 17, 17, 0.08)', fontWeight: 500, fontSize: '18px' }}
            >
              Settings
            </Typography>
            <List>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => handleSectionChange('personal')}
                  selected={activeSection === 'personal'}
                  sx={{
                    p: "12px 16px",
                    bgcolor: '#FFF',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      bgcolor: theme.palette.secondary.light,
                    },
                    '&.Mui-selected': {
                      bgcolor: theme.palette.secondary.light,
                      borderLeft: `3px solid ${theme.palette.primary.main}`,
                      '&:hover': {
                        bgcolor: theme.palette.secondary.light,
                      }
                    }
                  }}
                >
                  <ListItemText 
                    primary="Personal Information" 
                    sx={{
                      '& .MuiListItemText-primary': {
                        color: activeSection === 'personal' ? theme.palette.primary.main : 'rgba(17, 17, 17, 0.84)',
                        fontWeight: activeSection === 'personal' ? 600 : 400,
                        fontSize: '16px',
                      }
                    }}
                  />
                </ListItemButton>
              </ListItem>
              
              <Divider />
              
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => handleSectionChange('company')}
                  selected={activeSection === 'company'}
                  sx={{
                    p: "12px 16px",
                    bgcolor: '#FFF',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      bgcolor: theme.palette.secondary.light,
                    },
                    '&.Mui-selected': {
                      bgcolor: theme.palette.secondary.light,
                      borderLeft: `3px solid ${theme.palette.primary.main}`,
                      '&:hover': {
                        bgcolor: theme.palette.secondary.light,
                      }
                    }
                  }}
                >
                  <ListItemText 
                    primary="Company Information"
                    sx={{
                      '& .MuiListItemText-primary': {
                        color: activeSection === 'company' ? theme.palette.primary.main : 'rgba(17, 17, 17, 0.84)',
                        fontWeight: activeSection === 'company' ? 600 : 400,
                        fontSize: '16px',
                      }
                    }}
                  />
                </ListItemButton>
              </ListItem>
              
              <Divider />
              
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => handleSectionChange('password')}
                  selected={activeSection === 'password'}
                  sx={{
                    p: "12px 16px",
                    bgcolor: '#FFF',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      bgcolor: theme.palette.secondary.light,
                    },
                    '&.Mui-selected': {
                      bgcolor: theme.palette.secondary.light,
                      borderLeft: `3px solid ${theme.palette.primary.main}`,
                      '&:hover': {
                        bgcolor: theme.palette.secondary.light,
                      }
                    }
                  }}
                >
                  <ListItemText 
                    primary="Password"
                    sx={{
                      '& .MuiListItemText-primary': {
                        color: activeSection === 'password' ? theme.palette.primary.main : 'rgba(17, 17, 17, 0.84)',
                        fontWeight: activeSection === 'password' ? 600 : 400,
                        fontSize: '16px',
                      }
                    }}
                  />
                </ListItemButton>
              </ListItem>
              
              <Divider />
              
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => handleSectionChange('integrations')}
                  selected={activeSection === 'integrations'}
                  sx={{
                    p: "12px 16px",
                    bgcolor: '#FFF',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      bgcolor: theme.palette.secondary.light,
                    },
                    '&.Mui-selected': {
                      bgcolor: theme.palette.secondary.light,
                      borderLeft: `3px solid ${theme.palette.primary.main}`,
                      '&:hover': {
                        bgcolor: theme.palette.secondary.light,
                      }
                    }
                  }}
                >
                  <ListItemText 
                    primary="Integrations"
                    sx={{
                      '& .MuiListItemText-primary': {
                        color: activeSection === 'integrations' ? theme.palette.primary.main : 'rgba(17, 17, 17, 0.84)',
                        fontWeight: activeSection === 'integrations' ? 600 : 400,
                        fontSize: '16px',
                      }
                    }}
                  />
                </ListItemButton>
              </ListItem>

              {process.env.NEXT_PUBLIC_CALENDLY_CLIENT_ID && process.env.NEXT_PUBLIC_CALENDLY_CLIENT_SECRET && (
                <>
                  <Divider />
                  <ListItem disablePadding>
                    <ListItemButton
                      onClick={() => handleSectionChange('calendly')}
                      selected={activeSection === 'calendly'}
                      sx={{
                        p: "12px 16px",
                        bgcolor: '#FFF',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                          bgcolor: theme.palette.secondary.light,
                        },
                        '&.Mui-selected': {
                          bgcolor: theme.palette.secondary.light,
                          borderLeft: `3px solid ${theme.palette.primary.main}`,
                          '&:hover': {
                            bgcolor: theme.palette.secondary.light,
                          }
                        }
                      }}
                    >
                      <ListItemText 
                        primary="Calendly"
                        sx={{
                          '& .MuiListItemText-primary': {
                            color: activeSection === 'calendly' ? theme.palette.primary.main : 'rgba(17, 17, 17, 0.84)',
                            fontWeight: activeSection === 'calendly' ? 600 : 400,
                            fontSize: '16px',
                          }
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                </>
              )}
            </List>
          </Paper>
        </Box>

        {/* Main Content */}
        <Box sx={{ flex: 1, width: { xs: '100%', lg: 'auto' } }}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: { xs: 2, md: 4 },
              borderRadius: '10px',
              overflow: 'hidden',
              height: 'max-content',
            }}
          >
            {/* Tabs - Only visible on screens smaller than lg */}
            <Box sx={{ display: { xs: 'block', lg: 'none' }, mb: 3 }}>
              <Tabs
                value={activeSection}
                onChange={(_, newValue) => handleSectionChange(newValue)}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  borderBottom: 1,
                  borderColor: 'divider',
                  '& .MuiTabs-indicator': {
                    backgroundColor: theme.palette.primary.main,
                    height: 3,
                  },
                  '& .MuiTab-root': {
                    textTransform: 'none',
                    fontSize: '16px',
                    fontWeight: 400,
                    color: 'rgba(17, 17, 17, 0.84)',
                    padding: '12px 16px',
                    minHeight: 'auto',
                    '&.Mui-selected': {
                      color: theme.palette.primary.main,
                      fontWeight: 600,
                    },
                    '&:hover': {
                      backgroundColor: theme.palette.secondary.light,
                    }
                  }
                }}
              >
                <Tab value="personal" label="Personal Information" />
                <Tab value="company" label="Company Information" />
                <Tab value="password" label="Password" />
                <Tab value="integrations" label="Integrations" />
                {process.env.NEXT_PUBLIC_CALENDLY_CLIENT_ID && process.env.NEXT_PUBLIC_CALENDLY_CLIENT_SECRET && (
                  <Tab value="calendly" label="Calendly" />
                )}
              </Tabs>
            </Box>

            {activeSection === 'personal' && (
              <>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ color: 'rgba(17, 17, 17, 0.92)', fontWeight: 500, mb: 1, fontSize: { xs: '18px', md: '20px' } }}>
                    Personal Information
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(17, 17, 17, 0.6)', fontSize: { xs: '14px', md: '15px' }, lineHeight: 1.6 }}>
                    Update your personal details and contact information.
                  </Typography>
                </Box>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <StyledTextField
                      label="First Name"
                      value={profileData.personal.firstName}
                      onChange={(e) => handleProfileChange('personal', 'firstName', e.target.value)}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <StyledTextField
                      label="Last Name"
                      value={profileData.personal.lastName}
                      onChange={(e) => handleProfileChange('personal', 'lastName', e.target.value)}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <StyledTextField
                      label="Email"
                      value={profileData.personal.email}
                      onChange={(e) => handleProfileChange('personal', 'email', e.target.value)}
                      fullWidth
                      error={!!errors.email}
                      helperText={errors.email}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <StyledTextField
                      label="Phone Number"
                      value={profileData.personal.phone}
                      onChange={(e) => handleProfileChange('personal', 'phone', e.target.value)}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <StyledTextField
                      label="Job Title"
                      value={profileData.personal.jobTitle}
                      onChange={(e) => handleProfileChange('personal', 'jobTitle', e.target.value)}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <PrimaryButton
                      variant="contained"
                      onClick={handleSaveProfile}
                      disabled={saving}
                      fullWidth={window.innerWidth < 600}
                    >
                      {saving ? <> <Typography variant="body2" sx={{ fontSize: '16px', fontWeight: 600, color: 'secondary.light' }}>Saving changes</Typography></> : 'Save Changes'}
                    </PrimaryButton>
                  </Grid>
                </Grid>
              </>
            )}

            {activeSection === 'company' && (
              <>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ color: 'rgba(17, 17, 17, 0.92)', fontWeight: 500, mb: 1, fontSize: { xs: '18px', md: '20px' } }}>
                    Company Information
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(17, 17, 17, 0.6)', fontSize: { xs: '14px', md: '15px' }, lineHeight: 1.6 }}>
                    Update your company details, logo, and company description.
                  </Typography>
                </Box>
                
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: { xs: 2, md: 3 }, 
                    mb: 4, 
                    bgcolor: '#F8F9FA', 
                    borderRadius: '8px',
                    border: '0.8px solid rgba(17, 17, 17, 0.08)'
                  }}
                >
                  <Typography variant="subtitle1" sx={{ color: 'rgba(17, 17, 17, 0.92)', fontWeight: 500, mb: 2, fontSize: { xs: '16px', md: '18px' } }}>
                    Company Logo
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'center', sm: 'flex-start' }, gap: 3 }}>
                    <Avatar
                      src={profileData.company.logo || '/images/logos/logo.svg'}
                      alt={profileData.company.name}
                      sx={{ 
                        width: { xs: 80, sm: 100 }, 
                        height: { xs: 80, sm: 100 }, 
                        border: '1px solid rgba(17, 17, 17, 0.08)',
                        '& img': {
                          objectFit: 'cover',
                          width: '100%',
                          height: '100%'
                        }
                      }}
                    />
                    <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                      <Typography variant="body2" sx={{ color: 'rgba(17, 17, 17, 0.6)', mb: 2, fontSize: { xs: '14px', md: '15px' } }}>
                        Upload a logo for your company. This will be displayed on job postings and communications.
                      </Typography>
                      <Button
                        component="label"
                        variant="outlined"
                        startIcon={logoUploading ? <CircularProgress size={20} /> : <CloudUploadIcon />}
                        sx={{ 
                          textTransform: 'none',
                          borderRadius: '8px',
                          width: { xs: '100%', sm: 'auto' }
                        }}
                        disabled={logoUploading}
                      >
                        {logoUploading ? 'Uploading...' : 'Upload Logo'}
                        <input
                          type="file"
                          hidden
                          accept="image/*"
                          onChange={handleLogoUpload}
                        />
                      </Button>
                    </Box>
                  </Box>
                </Paper>
                
                <Typography variant="subtitle1" sx={{ color: 'rgba(17, 17, 17, 0.92)', fontWeight: 500, mb: 2, fontSize: { xs: '16px', md: '18px' } }}>
                  Company Details
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <StyledTextField
                      label="Company Name"
                      value={profileData.company.name}
                      onChange={(e) => handleProfileChange('company', 'name', e.target.value)}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <StyledTextField
                      label="Company Size"
                      value={profileData.company.size}
                      onChange={(e) => handleProfileChange('company', 'size', e.target.value)}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <StyledTextField
                      label="Website"
                      value={profileData.company.website}
                      onChange={(e) => handleProfileChange('company', 'website', e.target.value)}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <StyledTextField
                      label="Booking Link"
                      value={profileData.company.bookingLink}
                      onChange={(e) => handleProfileChange('company', 'bookingLink', e.target.value)}
                      placeholder="https://calendly.com/yourcompany"
                      fullWidth
                      error={!!errors.bookingLink}
                      helperText={errors.bookingLink}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <StyledTextField
                      label="About Company"
                      value={profileData.company.about}
                      onChange={(e) => handleProfileChange('company', 'about', e.target.value)}
                      multiline
                      rows={4}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <PrimaryButton
                      variant="contained"
                      onClick={handleSaveProfile}
                      disabled={saving}
                      fullWidth={window.innerWidth < 600}
                    >
                      {saving ? <> <CircularProgress size={24} color="inherit" /> <Typography variant="body2" sx={{ fontSize: '16px', fontWeight: 600, color: 'secondary.light' }}>Saving</Typography></> : 'Save Changes'}
                    </PrimaryButton>
                  </Grid>
                </Grid>
              </>
            )}

            {activeSection === 'password' && (
              <>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ color: 'rgba(17, 17, 17, 0.92)', fontWeight: 500, mb: 1, fontSize: '20px' }}>
                    Change Password
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(17, 17, 17, 0.6)', fontSize: { xs: '14px', md: '15px' }, lineHeight: 1.6 }}>
                    Update your password to keep your account secure.
                  </Typography>
                </Box>
                
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <StyledTextField
                      label="Current Password"
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <StyledTextField
                      label="New Password"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                      fullWidth
                      error={!!errors.password}
                      helperText={errors.password ? errors.password : 'Minimum 8 characters recommended'}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <StyledTextField
                      label="Confirm New Password"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                      fullWidth
                      error={!!errors.password}
                    />
                  </Grid>
                  <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <PrimaryButton
                      variant="contained"
                      onClick={handleChangePassword}
                      disabled={saving}
                    >
                      {saving ? <> <Typography variant="body2" sx={{ fontSize: '16px', fontWeight: 600, color: 'secondary.light' }}>Saving</Typography>
                      <CircularProgress size={24} color="inherit" /></> : 'Change Password'}
                    </PrimaryButton>
                  </Grid>
                </Grid>
              </>
            )}

            {activeSection === 'integrations' && (
              <>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ color: 'rgba(17, 17, 17, 0.92)', fontWeight: 500, mb: 1, fontSize: '20px' }}>
                    Integrations
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(17, 17, 17, 0.6)', fontSize: { xs: '14px', md: '15px' }, lineHeight: 1.6 }}>
                    Connect your favorite tools and services to enhance your experience.
                  </Typography>
                </Box>

                <Grid container spacing={3}>
                  {/* Calendly Integration */}
                  <Grid item xs={12}>
                    <Paper 
                      elevation={0} 
                      sx={{ 
                        p: 3, 
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: '8px',
                        bgcolor: integrations.calendly.connected ? 'success.light' : 'background.paper'
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 0.5 }}>
                            Calendly
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'text.grey.100' }}>
                            Schedule interviews and meetings seamlessly
                          </Typography>
                        </Box>
                        <Button
                          variant={integrations.calendly.connected ? "outlined" : "contained"}
                          onClick={() => router.push('/dashboard/profile/calendly-setup')}
                          disabled={saving}
                        >
                          {integrations.calendly.connected ? 'Connected' : 'Setup'}
                        </Button>
                      </Box>
                      {!integrations.calendly.connected && (
                        <Box sx={{ mt: 2, p: 2, bgcolor: 'rgba(0, 0, 0, 0.02)', borderRadius: '8px' }}>
                          <Typography variant="body2" sx={{ color: 'text.grey.100', mb: 1 }}>
                            To connect Calendly, you'll need to:
                          </Typography>
                          <Box component="ol" sx={{ pl: 2, mb: 0 }}>
                            <Typography component="li" variant="body2" sx={{ color: 'text.grey.100', mb: 1 }}>
                              Create a Calendly developer account at{' '}
                              <Link href="https://developer.calendly.com/" target="_blank" rel="noopener noreferrer" sx={{ color: 'primary.main' }}>
                                developer.calendly.com
                              </Link>
                            </Typography>
                            <Typography component="li" variant="body2" sx={{ color: 'text.grey.100', mb: 1 }}>
                              Create an OAuth application and whitelist this domain:
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
                            <Typography component="li" variant="body2" sx={{ color: 'text.grey.100' }}>
                              Send your Client ID and Secret to{' '}
                              <Link href="mailto:info@nolimitbuzz.net" sx={{ color: 'primary.main' }}>
                                info@nolimitbuzz.net
                              </Link>
                            </Typography>
                          </Box>
                        </Box>
                      )}
                    </Paper>
                  </Grid>
                </Grid>
              </>
            )}

            {activeSection === 'calendly' && (
              <>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ color: 'rgba(17, 17, 17, 0.92)', fontWeight: 500, mb: 1, fontSize: '20px' }}>
                    Calendly Events
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(17, 17, 17, 0.6)', fontSize: { xs: '14px', md: '15px' }, lineHeight: 1.6 }}>
                    View and manage your scheduled events.
                  </Typography>
                </Box>

                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 3, 
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: '8px',
                    bgcolor: 'background.paper'
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                      Upcoming Events
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<RefreshIcon />}
                      onClick={fetchCalendlyEvents}
                      disabled={loadingEvents}
                    >
                      {loadingEvents ? 'Refreshing...' : 'Refresh'}
                    </Button>
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {loadingEvents ? (
                      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                        <CircularProgress />
                      </Box>
                    ) : calendlyEvents.length > 0 ? (
                      calendlyEvents.map((event) => (
                        <Paper 
                          key={event.uri}
                          elevation={0}
                          sx={{ 
                            p: 2,
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: '8px',
                            '&:hover': {
                              bgcolor: 'rgba(0, 0, 0, 0.02)',
                              transition: 'background-color 0.2s ease'
                            }
                          }}
                        >
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                            <Box>
                              <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 0.5 }}>
                                {event.name}
                              </Typography>
                              <Typography variant="body2" sx={{ color: 'text.grey.100' }}>
                                Guest: {event.invitees_counter.active}
                              </Typography>
                            </Box>
                            <Chip 
                              label="Upcoming" 
                              color="success" 
                              size="small"
                              sx={{ 
                                bgcolor: 'success.light',
                                color: 'success.dark',
                                fontWeight: 500
                              }}
                            />
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.grey.100' }}>
                            <AccessTimeIcon sx={{ fontSize: 16 }} />
                            <Typography variant="body2">
                              {new Date(event.start_time).toLocaleDateString()} • {new Date(event.start_time).toLocaleTimeString()} - {new Date(event.end_time).toLocaleTimeString()}
                            </Typography>
                          </Box>
                        </Paper>
                      ))
                    ) : (
                      <Box sx={{ 
                        p: 4, 
                        textAlign: 'center',
                        border: '1px dashed',
                        borderColor: 'divider',
                        borderRadius: '8px'
                      }}>
                        <EventNoteIcon sx={{ fontSize: 48, color: 'text.grey.100', mb: 2 }} />
                        <Typography variant="body1" sx={{ color: 'text.grey.100', mb: 1 }}>
                          No upcoming events scheduled
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.grey.100' }}>
                          Your scheduled events will appear here
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Paper>
              </>
            )}
          </Paper>
        </Box>
      </Box>

      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{
          zIndex: 9999,
        }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          icon={notification.severity === 'success' ? <CheckIcon /> : undefined}
          sx={{
            minWidth: '300px',
            backgroundColor: 'primary.main',
            color: 'secondary.light',
            borderRadius: '100px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            '& .MuiAlert-icon': {
              color: '#fff',
              marginRight: '8px',
              padding: 0,
            },
            '& .MuiAlert-message': {
              padding: '6px 0',
              fontSize: '16px',
              textAlign: 'center',
              flex: 'unset',
            },
            '& .MuiAlert-action': {
              padding: '0 8px 0 0',
              marginRight: 0,
              '& .MuiButtonBase-root': {
                color: '#fff',
                padding: 1,
              },
            },
          }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProfilePage;
