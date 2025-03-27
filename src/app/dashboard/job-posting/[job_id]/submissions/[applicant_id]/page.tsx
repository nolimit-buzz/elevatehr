'use client'
import { useState, useEffect, Fragment } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';

// Icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocationIcon from '@mui/icons-material/LocationOnOutlined';
import SmsIcon from '@mui/icons-material/EmailOutlined';
import ClockIcon from '@mui/icons-material/AccessTimeOutlined';
import MoneyIcon from '@mui/icons-material/MonetizationOnOutlined';
import CheckIcon from '@mui/icons-material/Check';
import ArrowUpRightIcon from '@mui/icons-material/OpenInNew';
import CloseIcon from '@mui/icons-material/Close';
import UserSearchIcon from '@mui/icons-material/PersonSearchOutlined';
import BriefcaseIcon from '@mui/icons-material/WorkOutline';
import { Document, Page, pdfjs } from 'react-pdf';
import mammoth from 'mammoth';
import axios from 'axios';

// Set up the PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

// Define TypeScript interfaces for the API response
interface PersonalInfo {
  firstname: string;
  lastname: string;
  email: string;
  location: string;
}

interface ProfessionalInfo {
  experience: string;
  salary_range: string;
  start_date: string;
  skills: string;
  summary: string;
  portfolio_url?: string;
  experience_list: Array<{
    company: string;
    location: string;
    title: string;
    start_date: string;
    end_date?: string;
    responsibilities: string;
  }>;
}

interface EducationInfo {
  school: string;
  location: string;
  degree: string;
  graduation_date: string;
  details?: string;
}

interface Certification {
  name: string;
  issuer: string;
}

interface ApplicationInfo {
  cover_letter: string;
}

interface CVAnalysis {
  match_score: number;
  skills_match: string[];
  missing_skills: string[];
  experience_years: number;
  education_level: string;
  recommendations: string;
}

interface Applicant {
  id: number;
  personal_info: PersonalInfo;
  professional_info: ProfessionalInfo;
  education_info: EducationInfo[];
  certifications: Certification[];
  application_info: ApplicationInfo;
  attachments?: {
    cv?: {
      url: string;
      parsed_content?: string;
    };
  };
  cv_analysis?: CVAnalysis;
  custom_fields?: {
    [key: string]: {
      value: string;
    };
  };
}

interface ApplicantListItem {
  id: number;
  personal_info: PersonalInfo;
  professional_info: {
    experience: string;
    salary_range: string;
    start_date: string;
  };
}

interface CVContent {
  type: 'pdf' | 'html' | 'text';
  data: string | ArrayBuffer;
}

export const dynamic = 'force-dynamic';

export default function ApplicantDetails() {
  const router = useRouter();
  const params = useParams();
  const [applicant, setApplicant] = useState<Applicant | null>(null);
  const [applicants, setApplicants] = useState<ApplicantListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cvContent, setCvContent] = useState<CVContent | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [cvAnalysis, setCvAnalysis] = useState<CVAnalysis | null>(null);

  const fetchAndParseCV = async (cvUrl: string) => {
    try {
      const fileExtension = cvUrl.split('.').pop()?.toLowerCase() || '';
      const response = await axios.get(cvUrl, {
        responseType: 'arraybuffer'
      });

      if (fileExtension === 'pdf') {
        setCvContent({ type: 'pdf', data: response.data });
      } else if (fileExtension === 'docx') {
        const arrayBuffer = response.data;
        const result = await mammoth.convertToHtml({ arrayBuffer });
        setCvContent({ type: 'html', data: result.value });
      } else if (fileExtension === 'txt' || fileExtension === 'md') {
        const text = new TextDecoder().decode(response.data);
        setCvContent({ type: 'text', data: text });
      } else {
        setError(`Unsupported file format: ${fileExtension}`);
      }
    } catch (error: unknown) {
      console.error('Error fetching or parsing CV:', error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Failed to load CV');
      }
    }
  };

  const fetchApplicantDetails = async (applicantId: string | number) => {
    setDetailsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('jwt');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await fetch(
        `https://app.elevatehr.ai/wp-json/elevatehr/v1/applications/${applicantId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          cache: 'no-store'
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch applicant details: ${response.statusText}`);
      }

      const data = await response.json();
      
    
      console.log(data);
      setApplicant({
        ...data,
      });
    } catch (error) {
      console.error('Error fetching applicant details:', error);
      setError(error instanceof Error ? error.message : 'An error occurred while fetching applicant details');
    } finally {
      setDetailsLoading(false);
    }
  };

  // Fetch initial applicant details if URL has applicant_id
  useEffect(() => {
    if (params.applicant_id && typeof params.applicant_id === 'string') {
      fetchApplicantDetails(params.applicant_id);
    }
  }, [params.applicant_id]);

  // Fetch all applicants
  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const token = localStorage.getItem('jwt');
        if (!token) {
          throw new Error('Authentication token not found');
        }

        if (typeof params.job_id !== 'string') {
          throw new Error('Invalid job ID');
        }

        const response = await fetch(
          `https://app.elevatehr.ai/wp-json/elevatehr/v1/jobs/${params.job_id}/applications`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            cache: 'no-store'
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch applicants: ${response.statusText}`);
        }

        const data = await response.json();
        const currentApplicant = data.applications.find((app: Applicant) => app.id === applicant?.id);
        setApplicants(data.applications || []);
        setCvAnalysis(currentApplicant?.cv_analysis || null);
      } catch (error: unknown) {
        console.error('Error fetching applicants:', error);
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('Failed to fetch applicants');
        }
      } finally {
        setLoading(false);
      }
    };

    if (params.job_id) {
      fetchApplicants();
    }
  }, [params.job_id, applicant]);

  const handleBack = () => {
    router.back();
  };

  const handleReject = async () => {
    try {
      const token = localStorage.getItem('jwt');
      if (!token) throw new Error('Authentication token not found');

      const response = await fetch(
        `https://app.elevatehr.ai/wp-json/elevatehr/v1/applications/${applicant?.id}/reject`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          cache: 'no-store'
        }
      );

      if (!response.ok) {
        throw new Error('Failed to reject applicant');
      }

      // Update the applicants list to remove the rejected applicant
      setApplicants(prevApplicants => prevApplicants.filter(a => a.id !== applicant?.id));
      // Clear the current applicant
      setApplicant(null);
    } catch (error) {
      console.error('Error rejecting applicant:', error);
      setError(error instanceof Error ? error.message : 'Failed to reject applicant');
    }
  };

  const handleMoveToAssessment = async () => {
    try {
      const token = localStorage.getItem('jwt');
      if (!token) throw new Error('Authentication token not found');

      const response = await fetch(
        `https://app.elevatehr.ai/wp-json/elevatehr/v1/applications/${applicant?.id}/move-stage`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          cache: 'no-store',
          body: JSON.stringify({
            stage: 'skill_assessment'
          })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to move applicant to assessment');
      }

      // Update the applicants list to remove the moved applicant
      setApplicants(prevApplicants => prevApplicants.filter(a => a.id !== applicant?.id));
      // Clear the current applicant
      setApplicant(null);
    } catch (error) {
      console.error('Error moving applicant to assessment:', error);
      setError(error instanceof Error ? error.message : 'Failed to move applicant to assessment');
    }
  };

  if (loading) {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button onClick={handleBack} startIcon={<ArrowBackIcon />}>
          Go Back
        </Button>
      </Container>
    );
  }

  if (!applicant) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="warning">
          No applicant data found
        </Alert>
        <Button onClick={handleBack} startIcon={<ArrowBackIcon />} sx={{ mt: 2 }}>
          Go Back
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Back button */}
      <IconButton
        onClick={handleBack}
        sx={{ mb: 3 }}
      >
        <ArrowBackIcon />
      </IconButton>
      
      <Box sx={{ 
        display: 'flex', 
        gap: 3,
        minHeight: "100vh",
      }}>
        {/* Sidebar */}
        <Box sx={{
          width: 320,
          position: 'sticky',
          top: '32px',
          height: 'fit-content',
          alignSelf: 'flex-start',
        }}>
          <Paper
            elevation={0}
            sx={{
              width: 320,
              height: '70vh',
              borderRadius: 2,
              bgcolor: '#fff',
              overflow: 'auto'
            }}
          >
            <List sx={{ p: 0 }}>
              {applicants.map((item) => (
                <ListItem
                  key={item.id}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    p: 2,
                    cursor: 'pointer',
                    borderBottom: '0.8px solid rgba(17, 17, 17, 0.08)',
                    bgcolor: item.id === applicant?.id ? 'rgba(68, 68, 226, 0.04)' : 'transparent',
                    border: item.id === applicant?.id ? '1px solid' : 'none',
                    borderColor: item.id === applicant?.id ? 'secondary.main' : 'transparent',
                    borderLeft: item.id === applicant?.id ? '5px solid' : 'none',
                    borderLeftColor: item.id === applicant?.id ? 'secondary.main' : 'transparent',
                    '&:hover': {
                      bgcolor: 'rgba(0, 0, 0, 0.02)'
                    },
                    opacity: item.id === applicant?.id ? 1 : 0.68
                  }}
                  onClick={() => {
                    fetchApplicantDetails(item.id);
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 600,
                      fontSize: '18px',
                      color: item.id === applicant?.id ? 'secondary.main' : 'text.grey[100]',
                      mb: 1
                    }}
                  >
                    {item.personal_info.firstname} {item.personal_info.lastname}
                  </Typography>

                  <Stack spacing={1} width="100%">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <ClockIcon sx={{ fontSize: 20, color: 'text.grey[100]' }} />
                      <Typography variant="body2" color="text.grey[100]">
                        {item.professional_info.start_date}
                      </Typography>
                      <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center' }}>
                        <UserSearchIcon sx={{ fontSize: 20, color: 'text.grey[100]' }} />
                        <Typography variant="body2" color="text.grey[100]" sx={{ ml: 0.5 }}>
                          Open to trial
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <BriefcaseIcon sx={{ fontSize: 20, color: 'text.grey[100]' }} />
                      <Typography variant="body2" color="text.grey[100]">
                        {item.professional_info.experience}
                      </Typography>
                      <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center' }}>
                        <MoneyIcon sx={{ fontSize: 20, color: 'text.grey[100]' }} />
                        <Typography variant="body2" color="text.grey[100]" sx={{ ml: 0.5 }}>
                          {item.professional_info.salary_range}
                        </Typography>
                      </Box>
                    </Box>
                  </Stack>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Box>

        {/* Main Content - Applicant Details */}
        <Paper elevation={0} sx={{ flex: 1, p: 4, borderRadius: 2 }}>
          <Paper elevation={0} sx={{ p: 2, borderRadius: 2 }}>
            {detailsLoading ? (
              <Box>
                {/* Header Skeleton */}
                <Box sx={{ mb: 4 }}>
                  <Stack direction="row" gap={'16px'} sx={{ mb: 2 }}>
                    <Box sx={{ width: '200px', height: '32px', bgcolor: 'rgba(0, 0, 0, 0.03)', borderRadius: 1 }} />
                    <Stack direction="row" gap={'28px'}>
                      <Box sx={{ width: '150px', height: '24px', bgcolor: 'rgba(0, 0, 0, 0.03)', borderRadius: 1 }} />
                      <Box sx={{ width: '200px', height: '24px', bgcolor: 'rgba(0, 0, 0, 0.03)', borderRadius: 1 }} />
                    </Stack>
                  </Stack>

                  {/* Skills Skeleton */}
                  <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
                    {[1, 2, 3, 4].map((i) => (
                      <Box key={i} sx={{ width: '80px', height: '24px', bgcolor: 'rgba(0, 0, 0, 0.03)', borderRadius: '16px' }} />
                    ))}
                  </Stack>

                  {/* Key Info Skeleton */}
                  <Stack direction="row" spacing={3}>
                    {[1, 2, 3, 4].map((i) => (
                      <Box key={i} sx={{ width: '120px', height: '24px', bgcolor: 'rgba(0, 0, 0, 0.03)', borderRadius: 1 }} />
                    ))}
                  </Stack>
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Why hire section Skeleton */}
                <Box sx={{ mb: 4 }}>
                  <Box sx={{ width: '200px', height: '24px', bgcolor: 'rgba(0, 0, 0, 0.03)', borderRadius: 1, mb: 2 }} />
                  <Box sx={{ width: '100%', height: '100px', bgcolor: 'rgba(0, 0, 0, 0.03)', borderRadius: 1 }} />
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Resume section Skeleton */}
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                    <Box sx={{ width: '100px', height: '24px', bgcolor: 'rgba(0, 0, 0, 0.03)', borderRadius: 1 }} />
                    <Box sx={{ width: '120px', height: '36px', bgcolor: 'rgba(0, 0, 0, 0.03)', borderRadius: 2 }} />
                  </Box>
                  <Box sx={{ height: '800px', bgcolor: 'rgba(0, 0, 0, 0.03)', borderRadius: 2 }} />
                </Box>

                {/* Action Buttons Skeleton */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
                  <Box sx={{ width: '100px', height: '36px', bgcolor: 'rgba(0, 0, 0, 0.03)', borderRadius: 2 }} />
                  <Box sx={{ width: '160px', height: '36px', bgcolor: 'rgba(0, 0, 0, 0.03)', borderRadius: 2 }} />
                </Box>
              </Box>
            ) : !applicant ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8 }}>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                  Select an applicant to view details
                </Typography>
              </Box>
            ) : (
              <Fragment>
                {/* Header Section */}
                <Box sx={{ mb: 4 }}>
                  <Stack direction="row" gap={'16px'} sx={{ mb: 2 }}>
                    <Typography variant="h4" sx={{ fontWeight: 600, color: 'rgba(17, 17, 17, 0.92)' }}>
                      {applicant?.personal_info?.firstname} {applicant?.personal_info?.lastname}
                    </Typography>
                    <Stack direction="row" gap={'28px'}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: "8px" }}>
                        <LocationIcon sx={{ fontSize: 20, color: 'text.grey[100]' }} />
                        <Typography color="text.grey[100]">
                          {applicant?.personal_info?.location}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <SmsIcon sx={{ fontSize: 20, color: 'text.grey[100]' }} />
                        <Typography color="text.grey[100]">
                          {applicant?.personal_info?.email}
                        </Typography>
                      </Box>
                      {cvAnalysis?.match_score && (
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 1,
                          bgcolor: cvAnalysis?.match_score >= 70 ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)',
                          px: 2,
                          py: 1,
                          borderRadius: 2
                        }}>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: cvAnalysis?.match_score >= 70 ? 'success.main' : 'error.main',
                              fontWeight: 600
                            }}
                          >
                              {cvAnalysis?.match_score}% Match
                          </Typography>
                        </Box>
                      )}
                    </Stack>
                  </Stack>

                  {/* Skills */}
                  <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
                    {applicant?.professional_info?.skills?.split(',').map((skill: string, index: number) => (
                      <Chip
                        key={index}
                        label={skill.trim()}
                        sx={{
                          bgcolor: 'rgba(68, 68, 226, 0.08)',
                          color: 'primary.main',
                          borderRadius: '16px',
                        }}
                      />
                    ))}
                  </Stack>

                  {/* Key Info */}
                  <Stack direction="row" spacing={3}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <ClockIcon />
                      <Typography>{applicant?.professional_info?.experience}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <MoneyIcon />
                      <Typography>{applicant?.professional_info?.salary_range}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <ClockIcon />
                      <Typography>{applicant?.professional_info?.start_date}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CheckIcon />
                      <Typography>Open to trial</Typography>
                    </Box>
                  </Stack>
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Custom Fields Section */}
                {applicant?.custom_fields && Object.entries(applicant.custom_fields).map(([key, field]) => (
                  <Box key={key} sx={{ mb: 4 }}>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                      Additional Information
                    </Typography>
                    <Typography color="text.grey[100]" sx={{ whiteSpace: 'pre-line' }}>
                      {field.value}
                    </Typography>
                  </Box>
                ))}

                <Divider sx={{ my: 3 }} />

                {/* CV Analysis Section */}
                {cvAnalysis && (
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                      CV Analysis
                    </Typography>
                    <Stack spacing={2}>
                      {/* <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                          Experience & Education
                        </Typography>
                        <Stack direction="row" spacing={3}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <WorkOutlineIcon />
                            <Typography>{applicant.cv_analysis.experience_years} years experience</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <PersonOutlineIcon />
                            <Typography>{applicant.cv_analysis.education_level}</Typography>
                          </Box>the 
                        </Stack>
                      </Box> */}

                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                          Skills Analysis
                        </Typography>
                        <Stack spacing={1}>
                          {cvAnalysis.missing_skills.length > 0 && (
                            <Box>
                              <Typography variant="body2" color="error.main" sx={{ mb: 1 }}>
                                Missing Required Skills:
                              </Typography>
                              <Stack direction="row" spacing={1}>
                                {cvAnalysis.missing_skills.map((skill, index) => (
                                  <Chip
                                    key={index}
                                    label={skill}
                                    sx={{
                                      bgcolor: 'rgba(244, 67, 54, 0.1)',
                                      color: 'error.main',
                                      borderRadius: '16px',
                                    }}
                                  />
                                ))}
                              </Stack>
                            </Box>
                          )}
                        </Stack>
                      </Box>

                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                          Recommendations
                        </Typography>
                        <Typography color="text.grey[100]" sx={{ whiteSpace: 'pre-line' }}>
                          {cvAnalysis.recommendations}
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                )}

                <Divider sx={{ my: 3 }} />

                {/* Resume section */}
                <Box>
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 3
                  }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        color: 'rgba(17, 17, 17, 0.92)'
                      }}
                    >
                      Resume
                    </Typography>

                    {applicant?.attachments?.cv && (
                      <Button
                        variant="outlined"
                        startIcon={<ArrowUpRightIcon />}
                        component="a"
                        href={applicant.attachments.cv.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          borderRadius: 2,
                          textTransform: 'none',
                          px: 3,
                          py: 1.5,
                          textDecoration: 'none'
                        }}
                      >
                        Download CV
                      </Button>
                    )}
                  </Box>

                  {/* CV Preview */}
                  {applicant?.attachments?.cv ? (
                    <Box
                      sx={{
                        mb: 4,
                        p: 3,
                        bgcolor: 'rgba(17, 17, 17, 0.04)',
                        borderRadius: 2,
                        height: '800px',
                        overflow: 'hidden'
                      }}
                    >
                      <iframe
                        allowFullScreen
                        unselectable='on'
                        src={applicant.attachments.cv.url}
                        style={{
                          width: '100%',
                          height: '100%',
                          border: 'none'
                        }}
                        title="CV Preview"
                      />
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        mb: 4,
                        p: 3,
                        bgcolor: 'rgba(17, 17, 17, 0.04)',
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Typography color="text.grey[100]">
                        No CV available
                      </Typography>
                    </Box>
                  )}
                </Box>

                {/* Action Buttons */}
                <Box sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: 2,
                  mt: 4,
                  position: 'sticky',
                  bottom: 0,
                  bgcolor: 'background.paper',
                  py: 2
                }}>
                  <Button
                    variant="outlined"
                    onClick={handleReject}
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      px: 3,
                      py: 1.5,
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        backgroundColor: 'rgba(68, 68, 226, 0.08)',
                        transform: 'translateY(-1px)',
                        boxShadow: '0 4px 12px rgba(68, 68, 226, 0.1)',
                      }
                    }}
                  >
                    Reject
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleMoveToAssessment}
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      px: 3,
                      py: 1.5,
                      bgcolor: 'primary.main',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        bgcolor: '#6666E6',
                        transform: 'translateY(-1px)',
                        boxShadow: '0 4px 12px rgba(68, 68, 226, 0.15)',
                      }
                    }}
                  >
                    Move to Assessment
                  </Button>
                </Box>
              </Fragment>
            )}
          </Paper>
        </Paper>
      </Box>
    </Container>
  );
}