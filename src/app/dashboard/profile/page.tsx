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
  InputAdornment
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ArrowBack from '@mui/icons-material/ArrowBack';
import CheckIcon from '@mui/icons-material/Check';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useRouter } from 'next/navigation';

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
type ProfileSection = 'personal' | 'company' | 'password';

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

  useEffect(() => {
    // Fetch profile data
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('jwt');
        const response = await fetch('https://app.elevatehr.ai/wp-json/elevatehr/v1/company/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          
          // Map API response to our state structure
          setProfileData({
            personal: {
              firstName: data.first_name || '',
              lastName: data.last_name || '',
              email: data.email || '',
              phone: data.phone || '',
              jobTitle: data.job_title || '',
            },
            company: {
              name: data.company_name || '',
              logo: data.company_logo || '',
              size: data.number_of_employees?.toString() || '0',
              about: data.company_about || '',
              bookingLink: data.booking_link || '',
              website: data.website || '',
            }
          });
        } else {
          throw new Error('Failed to fetch profile data');
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
        setNotification({
          open: true,
          message: 'Failed to load profile data',
          severity: 'error'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

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
  const handleSaveProfile = async (section: ProfileSection) => {
    setSaving(true);
    
    // Validate data before saving
    if (!validateForm(section)) {
      setSaving(false);
      return;
    }
    
    // Only send the profile update for personal and company sections
    // Password changes are handled by handleChangePassword
    if (section === 'password') {
      setSaving(false);
      return handleChangePassword();
    }
    
    try {
      const token = localStorage.getItem('jwt');
      
      // Prepare the payload according to the API's expected format
      const payload = {
        email: profileData.personal.email,
        first_name: profileData.personal.firstName,
        last_name: profileData.personal.lastName,
        company_name: profileData.company.name,
        booking_link: profileData.company.bookingLink,
        number_of_employees: parseInt(profileData.company.size) || 0,
      };
      
      // Send PUT request to update profile
      const response = await fetch('https://app.elevatehr.ai/wp-json/elevatehr/v1/company/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      if (response.ok) {
        // Show success notification
        setNotification({
          open: true,
          message: section === 'company' ? 
            'Company profile updated successfully' : 
            'Profile updated successfully',
          severity: 'success'
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      setNotification({
        open: true,
        message: error instanceof Error ? error.message : 'Failed to update profile',
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
      setSaving(true);
      const token = localStorage.getItem('jwt');
      
      const formData = new FormData();
      formData.append('logo', file);
      
      const response = await fetch('https://app.elevatehr.ai/wp-json/elevatehr/v1/upload-logo', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData
      });
      
      if (response.ok) {
        const data = await response.json();
        setProfileData(prev => ({
          ...prev,
          company: {
            ...prev.company,
            logo: data.logo
          }
        }));
        
        setNotification({
          open: true,
          message: 'Logo uploaded successfully',
          severity: 'success',
        });
      } else {
        setNotification({
          open: true,
          message: 'Failed to upload logo',
          severity: 'error',
        });
      }
    } catch (error) {
      console.error('Error uploading logo:', error);
      setNotification({
        open: true,
        message: 'Error uploading logo',
        severity: 'error',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

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
                  width: '95%',
                  height: '95%',
                  objectFit: 'contain',
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

      <Box sx={{ display: 'flex', mt: 3, gap: 3 }}>
        {/* Sidebar */}
        <Box sx={{ width: '30%', minWidth: '250px', maxWidth: '300px' }}>
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
            </List>
          </Paper>
        </Box>

        {/* Main Content */}
        <Box sx={{ flex: 1 }}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 4,
              borderRadius: '10px',
              overflow: 'hidden',
              height: 'max-content',
            }}
          >
            {activeSection === 'personal' && (
              <>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ color: 'rgba(17, 17, 17, 0.92)', fontWeight: 500, mb: 1, fontSize: '20px' }}>
                    Personal Information
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(17, 17, 17, 0.6)', fontSize: '15px' }}>
                    Update your personal details and contact information.
                  </Typography>
                </Box>
                
                <Grid container spacing={3}>
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
                      onClick={() => handleSaveProfile('personal')}
                      disabled={saving}
                    >
                      {saving ?<> <Typography variant="body2" sx={{ fontSize: '16px', fontWeight: 600, color: 'secondary.light' }}>Saving changes</Typography></>: 'Save Changes'}
                    </PrimaryButton>
                  </Grid>
                </Grid>
              </>
            )}

            {activeSection === 'company' && (
              <>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ color: 'rgba(17, 17, 17, 0.92)', fontWeight: 500, mb: 1, fontSize: '20px' }}>
                    Company Information
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(17, 17, 17, 0.6)', fontSize: '15px' }}>
                    Update your company details, logo, and company description.
                  </Typography>
                </Box>
                
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 3, 
                    mb: 4, 
                    bgcolor: '#F8F9FA', 
                    borderRadius: '8px',
                    border: '0.8px solid rgba(17, 17, 17, 0.08)'
                  }}
                >
                  <Typography variant="subtitle1" sx={{ color: 'rgba(17, 17, 17, 0.92)', fontWeight: 500, mb: 2, fontSize: '18px' }}>
                    Company Logo
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Avatar
                      src={profileData.company.logo || '/images/logos/logo.svg'}
                      alt={profileData.company.name}
                      sx={{ width: 100, height: 100, border: '1px solid rgba(17, 17, 17, 0.08)' }}
                    />
                    <Box>
                      <Typography variant="body2" sx={{ color: 'rgba(17, 17, 17, 0.6)', mb: 2, fontSize: '15px' }}>
                        Upload a logo for your company. This will be displayed on job postings and communications.
                      </Typography>
                      <Button
                        component="label"
                        variant="outlined"
                        startIcon={<CloudUploadIcon />}
                        sx={{ 
                          textTransform: 'none',
                          borderRadius: '8px'
                        }}
                      >
                        Upload Logo
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
                
                <Typography variant="subtitle1" sx={{ color: 'rgba(17, 17, 17, 0.92)', fontWeight: 500, mb: 2, fontSize: '18px' }}>
                  Company Details
                </Typography>
                
                <Grid container spacing={3}>
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
                      onClick={() => handleSaveProfile('company')}
                      disabled={saving}
                    >
                      {saving ?<><CircularProgress size={24} color="inherit" /> <Typography variant="body2" sx={{ fontSize: '16px', fontWeight: 600, color: 'secondary.light' }}>Saving</Typography></> : 'Save Changes'}
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
                  <Typography variant="body2" sx={{ color: 'rgba(17, 17, 17, 0.6)', fontSize: '15px' }}>
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
