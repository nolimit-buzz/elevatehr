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
                      Assessment Guidelines
                    </Typography>
                    <Box 
                      sx={{ 
                        color: "rgba(17, 17, 17, 0.84)",
                        '& h3': {
                          fontSize: '16px',
                          fontWeight: 600,
                          mb: 1,
                          mt: 2,
                          '&:first-of-type': {
                            mt: 0
                          }
                        },
                        '& p': {
                          fontSize: '15px',
                          lineHeight: 1.6,
                          mb: 1.5
                        },
                        '& ul': {
                          pl: 2,
                          mb: 1.5
                        },
                        '& li': {
                          fontSize: '15px',
                          lineHeight: 1.6,
                          mb: 1
                        }
                      }}
                    >
                      <Typography>
                        You are required to complete only one of the two options provided — Option A or Option B. Please choose the one that best aligns with your strengths.
                      </Typography>
                      <Typography>
                        Your final submission must be in one of the following formats:
                      </Typography>
                      <ul>
                        <li>PowerPoint (PPT or PDF)</li>
                        <li>Word Document (DOC or PDF)</li>
                      </ul>
                      <Typography>
                        Ensure that Page One of your document includes:
                      </Typography>
                      <ul>
                        <li>The title of the assessment</li>
                        <li>The option you selected (Option A or Option B)</li>
                        <li>Your full name and email address</li>
                      </ul>

                      <Typography variant="h3">📂 Submission Format</Typography>
                      <ul>
                        <li>Upload your completed work to Google Drive.</li>
                        <li>Set the document permissions to: "Anyone with the link can view."</li>
                        <li>Submit the shareable link via the designated field on the submission page.</li>
                      </ul>

                      <Typography variant="h3">⏱ Timing</Typography>
                      <Typography>
                        You are expected to spend a maximum of 3 hours on this assessment.
                        While the submission page will remain accessible beyond the 3-hour mark, your completion time will be reviewed as part of your overall performance.
                      </Typography>

                      <Typography variant="h3">⚠️ Important Notes</Typography>
                      <Typography>
                        Carefully read all instructions and requirements before you begin.
                        Evaluation will focus on:
                      </Typography>
                      <ul>
                        <li>Clarity of thought</li>
                        <li>Analytical reasoning</li>
                        <li>Presentation style</li>
                        <li>Practical problem-solving approach</li>
                      </ul>
                      <Typography>
                        Only one option should be submitted. Submitting both may result in disqualification.
                      </Typography>

                      <Typography variant="h3">📌 Final Checklist</Typography>
                      <Typography>Before you submit, make sure to:</Typography>
                      <ul>
                        <li>✅ Double-check your work</li>
                        <li>✅ Upload it to Google Drive</li>
                        <li>✅ Set sharing to "Anyone with the link can view"</li>
                        <li>✅ Submit your shareable link via the submission form</li>
                      </ul>
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
                  Assessment Instructions
                </Typography>

                <Typography 
                  sx={{ 
                    color: "rgba(17, 17, 17, 0.84)",
                    fontSize: "15px",
                    lineHeight: 1.5
                  }}
                >
                  Before starting your assessment, please carefully review all guidelines and requirements. This includes submission format, timing, and evaluation criteria. Click below to view the complete assessment guidelines.
                </Typography>

                <Box sx={{ mt: 2 }}>
                  <StyledButton
                    href={`/assessment/instructions?job_id=${jobId}&assessment_id=${assessmentId}&application_id=${applicationId}`}
                    sx={{
                      width: '100%',
                      height: 56,
                    }}
                  >
                    View Instructions
                  </StyledButton>
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