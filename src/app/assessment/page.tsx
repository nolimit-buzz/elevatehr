'use client'
import { Box, Typography, CircularProgress, Alert, Chip, TextField, Button, Snackbar, useTheme } from '@mui/material';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Banner } from '@/components/Banner';

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
      <>
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
        <Box sx={{ 
          maxWidth: 800, 
          mx: 'auto', 
          mt: 8, 
          p: 4,
          textAlign: 'center'
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
      </>
    );
  }

  return (
    <>
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
      <Box sx={{ maxWidth: 800, mx: 'auto', mt: 8, p: 4, bgcolor: '#fff', borderRadius: 2, boxShadow: 1 }}>
        <Typography variant="h4" fontWeight={700} mb={2}>Assessment</Typography>
        <Typography variant="body1" mb={1}><b>Job ID:</b> {jobId || 'N/A'}</Typography>
        <Typography variant="body1" mb={1}><b>Application ID:</b> {applicationId || 'N/A'}</Typography>
        <Typography variant="body1" mb={2}><b>Assessment ID:</b> {assessmentId || 'N/A'}</Typography>
        {loading && <CircularProgress />}
        
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

        {assessment && (
          <Box mt={3}>
            <Typography variant="h5" fontWeight={600} mb={1}>{assessment.title}</Typography>
            <Typography variant="subtitle1" color="grey.200" mb={2}>{assessment.description}</Typography>
            <Box mb={2}>
              <Chip label={assessment.level} sx={{ mr: 1, fontWeight: 500 }} />
              {assessment.skills && assessment.skills.split(',').map((skill: string, idx: number) => (
                <Chip key={idx} label={skill.trim()} sx={{ mr: 1, fontWeight: 500 }} />
              ))}
            </Box>
            <Box mb={2}>
              <Typography variant="subtitle2" color="grey.200" mb={1}>Assessment Content:</Typography>
              <Box sx={{ bgcolor: '#f6f6f6', p: 2, borderRadius: 2 }}>
                <div dangerouslySetInnerHTML={{ __html: assessment.content }} />
              </Box>
            </Box>

            {/* Submission Form */}
            <Box mt={4}>
              <Typography variant="h6" fontWeight={600} mb={2}>Submit Your Assessment</Typography>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
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
                  sx={{ flexGrow: 1 ,'&:placeholder': { color: 'secondary.main' },'& label': { color: 'grey.200' }}}
                />
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={submitting || !submissionUrl.trim()}
                  sx={{
                    borderRadius: 2,
                    fontSize: 16,
                    fontWeight: 600,
                    minWidth: 120,
                    height: 56,
                    bgcolor: '#4444E2',
                    '&:hover': {
                      bgcolor: '#3333D1',
                    },
                  }}
                >
                  {submitting ? <CircularProgress size={24} color="inherit" /> : 'Submit'}
                </Button>
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </>
  );
} 