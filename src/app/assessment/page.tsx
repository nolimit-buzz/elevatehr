'use client'
import { Box, Typography, CircularProgress, Alert, Chip, TextField, Button, Snackbar, useTheme, Container, Grid, Stack, styled } from '@mui/material';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Banner } from '@/components/Banner';

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: "8px",
  backgroundColor: theme.palette.primary.main,
  padding: "16px 44px",
  color: "#FFFFFF !important",
  fontSize: "16px",
  fontWeight: 500,
  lineHeight: "100%",
  letterSpacing: "0.16px",
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    backgroundColor: "#6666E6",
    transform: "translateY(-1px)",
    boxShadow: "0 4px 12px rgba(68, 68, 226, 0.15)",
  },
}));

export default function AssessmentPage() {
  const theme = useTheme();
  const searchParams = useSearchParams();
  const jobId = searchParams.get('job_id');
  const assessmentId = searchParams.get('assessment_id');
  const applicationId = searchParams.get('application_id');

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [assessment, setAssessment] = useState<any>(null);
  const [submissionUrl, setSubmissionUrl] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleCloseAlert = () => {
    setError(null);
    setSuccess(null);
  };

  useEffect(() => {
    // Check if already submitted
    const submissionKey = `assessment_submission_${jobId}_${assessmentId}_${applicationId}`;
    const hasSubmitted = localStorage.getItem(submissionKey);
    if (hasSubmitted) {
      setIsSubmitted(true);
    }
  }, [jobId, assessmentId, applicationId]);

  useEffect(() => {
    if (!jobId || !assessmentId) return;
    setLoading(true);
    setError(null);
    fetch(`https://app.elevatehr.ai/wp-json/elevatehr/v1/get-job-assessment-public?job_id=${jobId}&assessment_id=${assessmentId}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch assessment details');
        return res.json();
      })
      .then(data => {
        if (data.status === 'success' && Array.isArray(data.assessments) && data.assessments.length > 0) {
          setAssessment(data.assessments[0]);
        } else {
          setError('Assessment not found.');
        }
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'An error occurred');
        setLoading(false);
      });
  }, [jobId, assessmentId]);

  const handleSubmit = async () => {
    if (!submissionUrl.trim()) {
      setError('Please enter a submission URL');
      return;
    }

    if (!applicationId) {
      setError('Application ID is missing');
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('https://app.elevatehr.ai/wp-json/elevatehr/v1/applications/submit-technical-assessment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          application_id: parseInt(applicationId),
          job_id: parseInt(jobId || '0'),
          assessment_id: parseInt(assessmentId || '0'),
          assessment_submission_link: submissionUrl.trim()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to submit assessment');
      }

      const data = await response.json();
      if (data.status === 'success') {
        setSuccess('Assessment submitted successfully!');
        setSubmissionUrl('');
        setIsSubmitted(true);
        // Store submission in localStorage
        const submissionKey = `assessment_submission_${jobId}_${assessmentId}_${applicationId}`;
        localStorage.setItem(submissionKey, 'true');
      } else {
        throw new Error(data.message || 'Failed to submit assessment');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while submitting');
    } finally {
      setSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <Box sx={{ backgroundColor: "#fff", minHeight: "100vh" }}>
        <Banner
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: theme.palette.primary.main,
            backgroundImage: "url(/images/backgrounds/banner-bg-img.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            position: "relative",
          }}
          height={"304px"}
        />
        <Container sx={{ maxWidth: "1063px !important", mt: 8, p: 4 }}>
          <Box sx={{ 
            maxWidth: 800, 
            mx: 'auto', 
            textAlign: 'center',
            bgcolor: '#fff',
            borderRadius: 2,
            boxShadow: 1,
            p: 4
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 4 }}>
              <CheckCircleIcon sx={{ 
                fontSize: 48, 
                color: theme.palette.primary.main,
              }} />
              <Typography 
                variant="h4" 
                fontWeight={700}
                sx={{
                  background: 'linear-gradient(90deg, #4444E2 0%, #6B6BFF 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                Submission Received!
              </Typography>
            </Box>
            
            <Typography 
              variant="body1" 
              color="grey.600" 
              sx={{ 
                maxWidth: 600, 
                mx: 'auto',
                fontSize: '17px'
              }}
            >
              Thank you for submitting your assessment. We will review your submission and get back to you soon.
            </Typography>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: "#fff", minHeight: "100vh" }}>
      <Banner
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: theme.palette.primary.main,
          backgroundImage: "url(/images/backgrounds/banner-bg-img.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          position: "relative",
        }}
        height={"304px"}
      />
      <Container sx={{ maxWidth: "1063px !important", mt: 8, p: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Box sx={{ 
              bgcolor: '#fff', 
              borderRadius: 2, 
              p: 4
            }}>
              <Typography 
                variant="h5" 
                fontWeight={600} 
                mb={2}
                sx={{
                  color: "rgba(17, 17, 17, 0.92)",
                  fontSize: "24px",
                  textTransform: "capitalize",
                }}
              >
                {assessment?.level} {assessment?.title} Technical Assessment
              </Typography>
              
              {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                  <CircularProgress />
                </Box>
              )}

              {assessment && (
                <Stack spacing={4}>
                  <Box>
                    <Typography 
                      variant="subtitle1" 
                      color="grey.200" 
                      mb={2}
                    >
                      {assessment.description}
                    </Typography>
                    <Box mb={2} sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {assessment.skills && assessment.skills.split(',').map((skill: string, idx: number) => (
                        <Chip 
                          key={idx} 
                          label={skill.trim()} 
                          sx={{ 
                            fontWeight: 500,
                            bgcolor: '#F9E8F3',
                            color: '#76325F',
                          }} 
                        />
                      ))}
                    </Box>
                  </Box>

                  <Box>
                    <Typography 
                      variant="h5" 
                      fontWeight={600} 
                      mb={2}
                      sx={{
                        color: "rgba(17, 17, 17, 0.92)",
                      }}
                    >
                      Assessment Details
                    </Typography>
                    <Box 
                      sx={{ 
                        bgcolor: '#f6f6f6', 
                        p: 3, 
                        borderRadius: 2,
                        color: "rgba(17, 17, 17, 0.84)",
                      }}
                    >
                      <div dangerouslySetInnerHTML={{ __html: assessment.content }} />
                    </Box>
                  </Box>
                </Stack>
              )}
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box sx={{ 
              bgcolor: '#fff', 
              borderRadius: 2, 
              p: 4,
              border: "1px solid #E0E0E0",
            }}>
              <Stack spacing={3}>
                <Typography 
                  variant="h6" 
                  fontWeight={600}
                  sx={{
                    color: "rgba(17, 17, 17, 0.92)",
                    fontSize: "18px"
                  }}
                >
                  Submit Your Assessment
                </Typography>
                <Stack spacing={2}>
                  <Typography sx={{ color: "rgba(17, 17, 17, 0.84)" }}>
                    • Please ensure your submission is complete and follows all requirements
                  </Typography>
                  <Typography sx={{ color: "rgba(17, 17, 17, 0.84)" }}>
                    • Make sure your submission URL is accessible
                  </Typography>
                  <Typography sx={{ color: "rgba(17, 17, 17, 0.84)" }}>
                    • You can only submit once
                  </Typography>
                  {assessment?.review_time && (
                    <Typography sx={{ color: "rgba(17, 17, 17, 0.84)" }}>
                      • We will review your submission within {assessment.review_time}
                    </Typography>
                  )}
                </Stack>

                <Box sx={{ mt: 2 }}>
                  <Stack spacing={2}>
                    <TextField
                      fullWidth
                      label="Submission URL"
                      variant="outlined"
                      value={submissionUrl}
                      onChange={(e) => setSubmissionUrl(e.target.value)}
                      placeholder="Enter the URL where your assessment can be found"
                      error={!!error}
                      helperText={error}
                      disabled={submitting}
                      sx={{ 
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        },
                        '& label': { 
                          color: 'grey.200' 
                        }
                      }}
                    />
                    <StyledButton
                      onClick={handleSubmit}
                      disabled={submitting || !submissionUrl.trim()}
                      sx={{
                        width: '100%',
                        height: 56,
                      }}
                    >
                      {submitting ? <CircularProgress size={24} color="inherit" /> : 'Submit'}
                    </StyledButton>
                  </Stack>
                </Box>
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Success Alert */}
      <Snackbar 
        open={!!success} 
        autoHideDuration={6000} 
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity="success"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={handleCloseAlert}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ 
            width: '100%',
            bgcolor: 'primary.main',
            color: 'white',
            borderRadius: '24px',
            '& .MuiAlert-message': {
              fontSize: '1rem',
              fontWeight: 500,
              color: 'white'
            },
            '& .MuiAlert-icon': {
              color: 'white'
            }
          }}
        >
          {success}
        </Alert>
      </Snackbar>

      {/* Error Alert */}
      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity="error"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={handleCloseAlert}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ 
            width: '100%',
            bgcolor: 'primary.main',
            color: 'white',
            borderRadius: '24px',
            '& .MuiAlert-message': {
              fontSize: '1rem',
              fontWeight: 500,
              color: 'white'
            },
            '& .MuiAlert-icon': {
              color: 'white'
            }
          }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
} 