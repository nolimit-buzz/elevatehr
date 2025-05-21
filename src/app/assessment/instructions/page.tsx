"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Box,
  Container,
  Typography,
  IconButton,
  Paper,
  CircularProgress,
  Alert,
  Chip,
  Button,
  Stack,
  TextField,
  Grid,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useTheme } from "@mui/material/styles";
import { Banner } from '@/components/Banner';

export default function AssessmentInstructionsPage() {
  const theme = useTheme();
  const router = useRouter();
  const searchParams = useSearchParams();
  const jobId = searchParams.get('job_id');
  const assessmentId = searchParams.get('assessment_id');
  const applicationId = searchParams.get('application_id');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [assessment, setAssessment] = useState<any>(null);
  const [submissionUrl, setSubmissionUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

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
          if (data.assessments[0].options) {
            setSelectedOption('1');
          }
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

  const handleBack = () => {
    router.push(`/assessment?job_id=${jobId}&assessment_id=${assessmentId}&application_id=${applicationId}`);
  };

  const handleSubmit = () => {
    setSubmitting(true);
    const submissionData = {
      application_id: parseInt(applicationId || '0'),
      job_id: parseInt(jobId || '0'),
      assessment_id: parseInt(assessmentId || '0'),
      assessment_submission_link: submissionUrl,
      select_assessment_option: parseInt(selectedOption)
    };

    fetch('https://app.elevatehr.ai/wp-json/elevatehr/v1/applications/submit-technical-assessment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(submissionData)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to submit assessment');
      }
      setSnackbarMessage('Assessment submitted successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    })
    .catch(error => {
      setSnackbarMessage(error.message || 'An error occurred while submitting the assessment.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    })
    .finally(() => {
      setSubmitting(false);
    });
  };

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
      <Container sx={{ maxWidth: "1200px !important", mt: 8, p: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            sx={{
              color: 'grey.600',
              pl: 2,
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.04)',
              },
            }}
          >
            Back to Assessment
          </Button>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={7}>
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
                {assessment?.level} {assessment?.title} Technical Assessment Instructions
              </Typography>
              
              {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                  <CircularProgress />
                </Box>
              )}

              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
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
                        color: "rgba(17, 17, 17, 0.84)",
                        bgcolor: '#f6f6f6',
                        p: 3,
                        borderRadius: 2,
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
                      <div dangerouslySetInnerHTML={{ __html: assessment.content }} />
                    </Box>
                  </Box>
                </Stack>
              )}
            </Box>
          </Grid>

          <Grid item xs={12} md={5}>
            <Box sx={{ 
              bgcolor: '#fff', 
              borderRadius: 2, 
              p: 4,
              border: "1px solid #E0E0E0",
              position: 'sticky',
              top: 24,
              maxWidth: 'calc(100% - 20px)',
              ml: 'auto',
              mr: 'auto'
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
                    {assessment?.options && (
                      <FormControl fullWidth>
                        <Typography sx={{ mb: 1, color: 'rgba(17, 17, 17, 0.84)', fontWeight: 600 }}>
                          Select Assessment Option
                        </Typography>
                        <Select
                          value={selectedOption}
                          onChange={(e) => setSelectedOption(e.target.value)}
                          displayEmpty
                          renderValue={(value) => value ? `Option ${value}` : 'Select an option'}
                          sx={{ 
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '10px',
                              '& fieldset': {
                                borderRadius: '10px',
                              },
                            },
                            '& .MuiSelect-select': {
                              color: selectedOption ? 'rgba(17, 17, 17, 0.84)' : 'rgba(17, 17, 17, 0.48)',
                              borderRadius: '10px',
                            },
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderRadius: '10px',
                            }
                          }}
                        >
                          {Array.from({ length: assessment.options }, (_, i) => (
                            <MenuItem key={i + 1} value={String(i + 1)}>
                              Option {i + 1}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
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
                    <Button
                      variant="contained"
                      onClick={handleSubmit}
                      disabled={submitting || !submissionUrl.trim() || (assessment?.options && !selectedOption)}
                      sx={{
                        width: '100%',
                        height: 56,
                        bgcolor: 'primary.main',
                        color: 'white',
                        '&:hover': {
                          bgcolor: 'primary.dark',
                        },
                      }}
                    >
                      {submitting ? <CircularProgress size={24} color="inherit" /> : 'Submit'}
                    </Button>
                  </Stack>
                </Box>
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
} 