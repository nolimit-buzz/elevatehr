'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import {
  Container,
  Box,
  Stack,
  Typography,
  CircularProgress,
  TextField,
  Button,
  styled,
  Chip,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Autocomplete,
  Dialog,
  DialogContent,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { getSkillsForRole, addCustomSkill, Skill } from '@/utils/skills';
import Image from 'next/image';
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

console.log(GOOGLE_MAPS_API_KEY);
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
  '&:hover': {
    backgroundColor: '#3333B3',
  }
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiFormLabel-root': {
    position: 'relative',
    transform: 'none',
    color: 'rgba(17, 17, 17, 0.92)',
    fontWeight: 500,
    fontSize: '16px',
    marginBottom: '8px',
    '&.Mui-focused': {
      color: 'rgba(17, 17, 17, 0.92)',
    },
  },
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#F8F9FB',
    borderRadius: '8px',
    '& fieldset': {
      borderColor: 'transparent',
    },
    '&:hover fieldset': {
      borderColor: 'transparent',
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
    },
  },
  '& .MuiInputBase-input': {
    padding: '16px',
  },
}));

const StyledFormLabel = styled(FormLabel)({
  color: 'rgba(17, 17, 17, 0.92)',
  fontWeight: 500,
  fontSize: '16px',
  marginBottom: '8px',
  '&.Mui-focused': {
    color: 'rgba(17, 17, 17, 0.92)',
  },
});

const StyledFormControlLabel = styled(FormControlLabel)({
  backgroundColor: '#F8F9FB',
  borderRadius: '8px',
  margin: '4px 0',
  width: '100%',
  padding: '12px 16px',
  '& .MuiRadio-root': {
    color: 'rgba(17, 17, 17, 0.6)',
  },
  '& .MuiTypography-root': {
    color: 'rgba(17, 17, 17, 0.84)',
    fontSize: '16px',
  },
});

const FileUploadButton = styled(Button)({
  backgroundColor: '#F8F9FB',
  color: 'rgba(17, 17, 17, 0.84)',
  padding: '16px',
  borderRadius: '8px',
  justifyContent: 'flex-start',
  textTransform: 'none',
  '&:hover': {
    backgroundColor: '#F0F1F3',
  },
});

interface JobData {
  title: string;
  location: string;
  work_model: string;
  job_type: string;
  description: string;
  responsibilities: string;
  expectations: string;
  benefits: string;
  application_form: {
    required_fields: Array<{
      key: string;
      label: string;
      type: string;
      required: boolean;
    }>;
    custom_fields: Array<{
      key: string;
      label: string;
      type: string;
      required: boolean;
      options?: string[];
    }>;
  };
}

interface FormData {
  name: string;
  email: string;
  experience: string;
  cv?: File;
  portfolio?: string;
  availability: string;
  trial: string;
  skills?: string[];
}

// Add this right after imports

const getFieldPlaceholder = (field: { key: string; type: string; label: string }) => {
  // For predefined fields
  switch (field.key) {
    case 'name':
      return 'Enter your full name';
    // case 'email':
    //   return 'example@email.com';
    case 'phone':
      return '+234 XXX XXX XXXX';
    case 'location':
      return 'Select your location';
    case 'portfolio':
    case 'github':
    case 'linkedin':
      return 'https://';
    case 'cv':
      return 'Upload your CV (PDF, DOC, DOCX)';
    default:
      // For custom fields
      if (field.type === 'url') {
        return 'https://';
      // } else if (field.type === 'email') {
      //   return 'example@email.com';
      } else if (field.type === 'file') {
        return 'Upload file';
      }
      return `Enter your ${field.label.toLowerCase()}`;
  }
};

const ApplicationForm = () => {
  const theme = useTheme();
  const router = useRouter();
  const { job_id } = useParams();
  const [jobData, setJobData] = useState<JobData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    experience: '',
    portfolio: '',
    availability: '',
    trial: '',
    skills: []
  });
  const [locationInputError, setLocationInputError] = useState('');
  const [availableSkills, setAvailableSkills] = useState<Skill[]>([]);
  const [customSkillInput, setCustomSkillInput] = useState('');

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
        const response = await axios.get<JobData>(
          `https://app.elevatehr.ai/wp-json/elevatehr/v1/jobs/${job_id}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
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

  useEffect(() => {
    const loadSkills = async () => {
      if (jobData) {
        const skills = await getSkillsForRole(jobData.title, jobData.description);
        setAvailableSkills(skills);
      }
    };
    loadSkills();
  }, [jobData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'file' ? files?.[0] : value,
    }));
  };

  const handleSkillsChange = (selectedOptions: any) => {
    const skills = selectedOptions.map((option: any) => option.value);
    setFormData(prev => ({
      ...prev,
      skills
    }));
  };

  const handleCreateSkill = (inputValue: string) => {
    if (inputValue.trim()) {
      addCustomSkill(inputValue.trim());
      setAvailableSkills(prev => [...prev, { 
        value: inputValue.trim(), 
        label: inputValue.trim(),
        isCustom: true 
      }]);
      setFormData(prev => ({
        ...prev,
        skills: [...(prev.skills || []), inputValue.trim()]
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formDataObj = new FormData();

    // Append all text fields
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== 'cv' && value) {
        formDataObj.append(key, value.toString());
      }
    });

    // Append the CV file if it exists
    if (formData.cv) {
      formDataObj.append('cv', formData.cv);
    }
    formDataObj.append("job_type", "fulltime");
        formDataObj.append("work_model", "remote");
        formDataObj.append("availability", "week");
        formDataObj.append("experience", "5 years");
        formDataObj.append("current_role", "jnr dev");
        formDataObj.append("work_preference", "remote");
        formDataObj.append("salary_range", "100-200");
        formDataObj.append("start_date", "immediately");
        formDataObj.append("address", "34 Ellasan");
        formDataObj.append("github_profile", "https://wwww.linked.com");

    try {
      const token = localStorage.getItem('jwt');
      await axios.post(
        `https://app.elevatehr.ai/wp-json/elevatehr/v1/jobs/${job_id}/applications`,
        formDataObj,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      setShowSuccessDialog(true);
      setFormSubmitted(true);
    } catch (error) {
      alert('Failed to submit application. Please try again.');
    }
  };

  const renderField = (field: JobData['application_form']['required_fields'][0] | JobData['application_form']['custom_fields'][0]) => {
    // Special handling for location field
    if (field.key === 'location') {
      if (!GOOGLE_MAPS_API_KEY) {
        return (
          <Box key={field.key}>
            <Typography 
              component="label" 
              sx={{ 
                display: 'block',
                color: 'rgba(17, 17, 17, 0.92)',
                fontWeight: 500,
                fontSize: '16px',
                marginBottom: '8px'
              }}
            >
              {field.label}
            </Typography>
            <StyledTextField
              fullWidth
              placeholder={getFieldPlaceholder(field)}
              name={field.key}
              type="text"
              onChange={handleChange}
              required={field.required}
              InputLabelProps={{ shrink: true }}
              variant="outlined"
              error={!!locationInputError}
              helperText={locationInputError}
            />
          </Box>
        );
      }

      return (
        <Box key={field.key}>
          <Typography 
            component="label" 
            sx={{ 
              display: 'block',
              color: 'rgba(17, 17, 17, 0.92)',
              fontWeight: 500,
              fontSize: '16px',
              marginBottom: '8px'
            }}
          >
            {field.label}
          </Typography>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <GooglePlacesAutocomplete
              apiKey={GOOGLE_MAPS_API_KEY}
              selectProps={{
                placeholder: getFieldPlaceholder(field),
                onChange: (value: any) => {
                  const e = {
                    target: {
                      name: field.key,
                      value: value?.label || ''
                    }
                  } as React.ChangeEvent<HTMLInputElement>;
                  handleChange(e);
                  setLocationInputError('');
                },
                styles: {
                  control: (provided) => ({
                    ...provided,
                    backgroundColor: '#F8F9FB',
                    borderRadius: '8px',
                    border: 'none',
                    boxShadow: 'none',
                    minHeight: '52px',
                    '&:hover': {
                      border: 'none'
                    }
                  }),
                  input: (provided) => ({
                    ...provided,
                    padding: '8px',
                    color: 'rgba(17, 17, 17, 0.84)'
                  }),
                  option: (provided, state) => ({
                    ...provided,
                    backgroundColor: state.isFocused ? '#F8F9FB' : 'white',
                    color: 'rgba(17, 17, 17, 0.84)',
                    cursor: 'pointer',
                    padding: '12px 16px'
                  }),
                  menu: (provided) => ({
                    ...provided,
                    zIndex: 2
                  })
                }
              }}
            />
          </div>
          {locationInputError && (
            <Typography color="error" sx={{ mt: 1, fontSize: '0.75rem' }}>
              {locationInputError}
            </Typography>
          )}
        </Box>
      );
    }

    // Special handling for skills field
    if (field.label.toLowerCase().includes('skills')) {
      return (
        <Box key={field.key}>
          <Typography 
            component="label" 
            sx={{ 
              display: 'block',
              color: 'rgba(17, 17, 17, 0.92)',
              fontWeight: 500,
              fontSize: '16px',
              marginBottom: '8px'
            }}
          >
            {field.label}
          </Typography>
          <CreatableSelect
            isMulti
            name={field.key}
            options={availableSkills}
            className="basic-multi-select"
            classNamePrefix="select"
            placeholder="Select or search skills..."
            value={formData.skills?.map(skill => ({ value: skill, label: skill }))}
            onChange={handleSkillsChange}
            formatCreateLabel={(inputValue) => `Add "${inputValue}"`}
            onCreateOption={handleCreateSkill}
            styles={{
              control: (provided) => ({
                ...provided,
                backgroundColor: '#F8F9FB',
                borderRadius: '8px',
                border: 'none',
                boxShadow: 'none',
                minHeight: '52px',
                '&:hover': {
                  border: 'none'
                }
              }),
              menu: (provided) => ({
                ...provided,
                zIndex: 2
              }),
              option: (provided, state) => ({
                ...provided,
                backgroundColor: state.isFocused ? '#F8F9FB' : 'white',
                color: 'rgba(17, 17, 17, 0.84)',
                cursor: 'pointer',
                padding: '12px 16px',
                '&:hover': {
                  backgroundColor: '#F8F9FB'
                }
              }),
              multiValue: (provided) => ({
                ...provided,
                backgroundColor: '#E8EAFD',
                color: '#4444E2',
                borderRadius: '4px',
                padding: '4px 8px',
                margin: '4px',
                fontSize: '14px'
              }),
              multiValueRemove: (provided) => ({
                ...provided,
                color: '#4444E2',
                ':hover': {
                  backgroundColor: '#D8DAFD'
                }
              })
            }}
          />
        </Box>
      );
    }

    switch (field.type) {
      case 'text':
      case 'email':
      case 'url':
        return (
          <Box key={field.key}>
            <Typography 
              component="label" 
              sx={{ 
                display: 'block',
                color: 'rgba(17, 17, 17, 0.92)',
                fontWeight: 500,
                fontSize: '16px',
                marginBottom: '8px'
              }}
            >
              {field.label}
            </Typography>
            <StyledTextField
              fullWidth
              placeholder={getFieldPlaceholder(field)}
              name={field.key}
              type={field.type}
              onChange={handleChange}
              required={field.required}
              InputLabelProps={{ shrink: true }}
              variant="outlined"
            />
          </Box>
        );
      
      case 'file':
        return (
          <Box key={field.key}>
            <StyledFormLabel sx={{ display: 'block', mb: 1 }}>{field.label}</StyledFormLabel>
            <input
              type="file"
              accept={field.key === 'cv' ? '.pdf,.doc,.docx' : undefined}
              style={{ display: 'none' }}
              id={`${field.key}-upload`}
              onChange={handleChange}
              name={field.key}
              required={field.required}
            />
            <label htmlFor={`${field.key}-upload`}>
              <Button
                variant="outlined"
                fullWidth
                component="span"
                startIcon={<AttachFileIcon />}
                sx={{
                  backgroundColor: '#F8F9FB',
                  color: 'rgba(17, 17, 17, 0.84)',
                  padding: '16px',
                  borderRadius: '8px',
                  justifyContent: 'flex-start',
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: '#F0F1F3',
                  }
                }}
              >
                {getFieldPlaceholder(field)}
              </Button>
            </label>
          </Box>
        );

      case 'select':
        if ('options' in field && field.options) {
          return (
            <FormControl key={field.key}>
              <StyledFormLabel>{field.label}</StyledFormLabel>
              <RadioGroup name={field.key} onChange={handleChange}>
                {field.options.map((option: string) => (
                  <StyledFormControlLabel 
                    key={option} 
                    value={option} 
                    control={<Radio />} 
                    label={option} 
                  />
                ))}
              </RadioGroup>
            </FormControl>
          );
        }
        return null;

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Container sx={{ textAlign: 'center', mt: 4 }}>
        <CircularProgress />
        <Typography variant="h6">Loading application form...</Typography>
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
          backgroundColor: theme.palette.primary.main,
          backgroundImage: "url(/images/backgrounds/banner-bg.svg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          height: '204px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center'
        }}
      >
        <Typography variant="h4" sx={{ 
          color: "rgba(255, 255, 255, 0.92)", 
          fontSize: "40px", 
          fontWeight: "600",
          marginBottom: '16px',
          width: '100%',
          textAlign: 'center'
        }}>
          {jobData?.title}
        </Typography>
        <Stack 
          direction={'row'} 
          alignItems={'center'} 
          gap={'8px'}
          justifyContent={'center'}
          width={'100%'}
        >
          <Pill label={jobData?.location} />
          <Pill label={jobData?.work_model} />
          <Pill label={jobData?.job_type} />
        </Stack>
      </Banner>

      <Container sx={{ py: 4, maxWidth: '800px !important' }}>
        {!formSubmitted && (
          <Box sx={{ 
            backgroundColor: '#fff', 
            borderRadius: '8px',
            padding: '40px',
            marginBottom: '24px'
          }}>
            <Typography variant="h4" sx={{ 
              marginBottom: '32px',
              color: 'rgba(17, 17, 17, 0.92)',
              fontWeight: 600
            }}>
              Apply for {jobData?.title}
            </Typography>

            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                {jobData?.application_form.required_fields.map(field => renderField(field))}
                {jobData?.application_form.custom_fields.map(field => renderField(field))}
                
                <StyledButton
                  type="submit"
                  variant="contained"
                  fullWidth
                >
                  Apply for this Job
                </StyledButton>
              </Stack>
            </form>
          </Box>
        )}

        <Dialog 
          open={showSuccessDialog} 
          maxWidth="sm" 
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: '12px',
              padding: '24px',
              textAlign: 'center'
            }
          }}
        >
          <DialogContent>
            <Box sx={{ mb: 3 }}>
              <Image
                src="/images/success-icon.svg"
                alt="Success"
                width={80}
                height={80}
              />
            </Box>
            <Typography variant="h4" sx={{ 
              mb: 2,
              color: 'rgba(17, 17, 17, 0.92)',
              fontWeight: 600
            }}>
              Your application was submitted successfully
            </Typography>
            <Typography sx={{ 
              mb: 4,
              color: 'rgba(17, 17, 17, 0.72)',
              fontSize: '16px'
            }}>
              We have received your application and we will be in touch with you regarding the next steps in the hiring process
            </Typography>
            <StyledButton
              onClick={() => router.push('/dashboard')}
              variant="contained"
              fullWidth
            >
              Got it!
            </StyledButton>
          </DialogContent>
        </Dialog>
      </Container>
    </Box>
  );
};

export default ApplicationForm; 