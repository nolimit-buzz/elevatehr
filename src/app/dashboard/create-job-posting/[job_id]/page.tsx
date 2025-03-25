'use client';
import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Grid,
  styled,
  Chip,
  Stack,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  InputAdornment,
  Skeleton,
  Autocomplete,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
} from '@mui/material';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Divider from '@mui/material/Divider';
import RefreshIcon from '@mui/icons-material/Refresh';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../../../global.css';
import { BorderStyle } from '@mui/icons-material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import axios from 'axios';
import { useParams } from 'next/navigation';
import { generateInput, generateSkillsForRole } from '../../../../utils/openai';
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useTheme } from '@mui/material/styles';
import CreatableSelect from 'react-select/creatable';
import { ActionMeta, MultiValue, GroupBase } from 'react-select';

const Banner = styled(Box)(({ theme }) => ({
  width: '100%',
  background: '#4444E2',
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

const PageContainer = styled(Box)(({ theme }) => ({
  padding: '0',
  backgroundColor: '#F1F4F9',
  minHeight: '100vh',
}));

const FormContainer = styled(Box)(({ theme }) => ({
  backgroundColor: '#fff',
  borderRadius: '8px',
  width: '100%',
  maxWidth: '1063px',
  margin: 'auto',
}));

const StyledStepper = styled(Stepper)(({ theme }) => ({
  padding: '28px 24px',
  '& .MuiStepConnector-line': {
    border: '0.5px dashed rgba(17, 17, 17, 0.68)'
  },
  '& .Mui-completed svg': {
    color: 'rgba(29, 175, 97, 1)'
  }
}));

const StyledStepLabel = styled(StepLabel)(({ theme }) => ({
  '& .MuiStepLabel-label': {
    color: 'rgba(17, 17, 17, 0.68)',
    fontSize: '16px',
    fontWeight: '400',
    lineHeight: '100%',
    letterSpacing: '0.16px',
  },
  '& .Mui-active': {
    fontWeight: '400',
    color: 'rgba(17, 17, 17, 1)'
  }
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '8px',
  backgroundColor: '#032B44',
  padding: '16px 44px',
  color: 'rgba(205, 247, 235, 0.92)',
  fontSize: '16px',
  fontWeight: 500,
  lineHeight: '100%',
  letterSpacing: '0.16px',
}));

const StyledOutlineButton = styled(Button)(({ theme }) => ({
  borderRadius: '8px',
  color: '#032B44',
  padding: '16px 44px',
  fontSize: '16px',
  fontWeight: 500,
  lineHeight: '100%',
  letterSpacing: '0.16px',
}));

const StyledAutocomplete = styled(Autocomplete<string, true, false, true>)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    border: '0.8px solid rgba(17, 17, 17, 0.14)',
    '& fieldset': {
      border: 'none'
    }
  },
  '& .MuiChip-root': {
    backgroundColor: '#4444E2',
    color: '#fff',
    borderRadius: '16px',
    margin: '2px',
    '& .MuiChip-deleteIcon': {
      color: '#fff',
      '&:hover': {
        color: '#fff'
      }
    }
  },
  '& .MuiAutocomplete-listbox': {
    maxHeight: '200px',
  }
});

const StyledSelect = styled(CreatableSelect<SkillOption, true, GroupBase<SkillOption>>)({
  '.select__control': {
    borderRadius: '8px',
    border: '0.8px solid rgba(17, 17, 17, 0.14)',
    minHeight: '56px',
    boxShadow: 'none',
    '&:hover': {
      borderColor: 'rgba(17, 17, 17, 0.24)',
    },
    '&--is-focused': {
      borderColor: '#4444E2',
      boxShadow: 'none',
    }
  },
  '.select__multi-value': {
    backgroundColor: '#4444E2',
    borderRadius: '16px',
    margin: '2px',
    padding: '2px 8px',
    color: '#fff',
    '.select__multi-value__label': {
      color: '#fff',
    },
    '.select__multi-value__remove': {
      color: '#fff',
      '&:hover': {
        backgroundColor: 'transparent',
        color: '#fff',
      }
    }
  },
  '.select__menu': {
    zIndex: 2,
    '.select__group-heading': {
      color: 'rgba(17, 17, 17, 0.7)',
      fontSize: '14px',
      fontWeight: 500,
      padding: '8px 12px',
    },
    '.select__option': {
      '&--is-selected': {
        backgroundColor: 'rgba(68, 68, 226, 0.08)',
        color: '#111',
      },
      '&--is-focused': {
        backgroundColor: 'rgba(68, 68, 226, 0.04)',
      }
    }
  },
  '.select__placeholder': {
    color: 'rgba(17, 17, 17, 0.5)',
  }
});

interface SkillOption {
  value: string;
  label: string;
}

interface TextEditorProps {
  label: string;
  description: string;
  value: string;
  onChange: (value: string) => void;
  onRegenerate?: () => void;
}

interface FieldProps {
  label: string;
  description: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  multiline?: boolean;
  sx?: any;
  error?: string;
  placeholder?: string;
}

interface FormBuilderFieldProps {
  field: {
    key: string;
    label: string;
    type: string;
    value?: string;
    options?: string[];
  };
  index: number;
  handleChange: (index: number, key: string, value: string, optionIndex?: number | null) => void;
  handleDelete: (index: number, optionIndex?: number | null) => void;
  handleTypeChange: (index: number, type: string) => void;
  isRequired: boolean;
}

interface Assessment {
  id: string;
  title: string;
  description: string;
  // Add other assessment properties as needed
}

interface AssessmentStepProps {
  assessments: Assessment[];
  selectedAssessment: Assessment | null;
  handleAssessmentChange: (assessment: Assessment | null) => void;
}

interface FormData {
  title: string;
  location: string;
  work_model: string;
  job_type: string;
  description: string;
  responsibilities: string;
  expectations: string[];
  salary_min: string;
  salary_max: string;
  salary_error: string;
  level?: string;
  skills: {
    technical: string[];
    soft: string[];
  };
  about_role?: string;
  [key: string]: any; // Allow for dynamic fields
}

interface CustomField {
  key: string;
  type: string;
  label: string;
  description: string;
  value: string;
  options: string[];
}

interface FormField {
  key: string;
  type: string;
  label: string;
  value?: string;
  options?: string[];
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

const TextEditor: React.FC<TextEditorProps> = ({ label, description, value = '', onChange, onRegenerate }) => {
  const theme = useTheme();
  return (
    <>
      <Stack direction="row" spacing={3} alignItems="flex-start" width={'100%'} padding="28px 24px">
        <Stack spacing={1} minWidth={'280px'}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="subtitle1" sx={{
              color: theme.palette.grey[100],
              fontSize: '20px',
              fontStyle: 'normal',
              fontWeight: 600,
              lineHeight: '100%',
              letterSpacing: '0.1px',
            }}>{label}</Typography>
            <IconButton size="small" onClick={onRegenerate}>
              <RefreshIcon />
            </IconButton>
          </Stack>
          <Typography sx={{
            color: theme.palette.grey[100],
            fontSize: '16px',
            fontStyle: 'normal',
            fontWeight: 400,
            lineHeight: '100%',
            letterSpacing: '0.16px',
          }} variant="body2" color="textSecondary">
            {description}
          </Typography>
        </Stack>
        <ReactQuill
          value={value}
          onChange={onChange}
          style={{
            flex: 2, borderRadius: '8px',
            border: '0.8px solid rgba(17, 17, 17, 0.14)', marginLeft: 0
          }}
        />
      </Stack>
      <Divider />
    </>
  );
};

const Field: React.FC<FieldProps> = ({ 
  label, 
  description, 
  value, 
  onChange, 
  multiline = false, 
  sx = {}, 
  error = '', 
  placeholder = '' 
}) => {
  const theme = useTheme();
  return (
    <>
      <Stack direction="row" spacing={3} alignItems="flex-start" padding="28px 24px">
        <Stack spacing={1} minWidth={'280px'}>
          <Typography variant="subtitle1" sx={{
            color: theme.palette.grey[100],
            fontSize: '20px',
            fontStyle: 'normal',
            fontWeight: 600,
            lineHeight: '100%',
            letterSpacing: '0.1px',
          }}>{label}</Typography>
          <Typography sx={{
            color: theme.palette.grey[100],
            fontSize: '16px',
            fontStyle: 'normal',
            fontWeight: 400,
            lineHeight: '100%',
            letterSpacing: '0.16px',
          }} variant="body2" color="textSecondary">
            {description}
          </Typography>
        </Stack>
        <TextField
          fullWidth
          value={value}
          onChange={onChange}
          variant="outlined"
          multiline={multiline}
          rows={multiline ? 4 : 1}
          style={{ marginLeft: 0, fontWeight: 700 }}
          sx={sx}
          error={!!error}
          placeholder={placeholder}
        />
      </Stack>
    </>
  );
};

const FormBuilderField: React.FC<FormBuilderFieldProps> = ({ 
  field, 
  index, 
  handleChange, 
  handleDelete, 
  handleTypeChange, 
  isRequired 
}) => {
  const theme = useTheme();

  return (
    <Stack alignItems="flex-start" width={'100%'} sx={{ padding: '20px 22px', border: '1px solid rgba(17, 17, 17, 0.14)', borderRadius: '8px' }}>
      <Stack direction='row' spacing={1} width={'100%'}>
        <Stack direction="row" alignItems="center" justifyContent={'space-between'} width={'100%'}>
          <TextField
            placeholder="Type Question"
            value={field.label}
            onChange={(e) => handleChange(index, 'label', e.target.value)}
            variant="outlined"
            disabled={isRequired}
            sx={{
              width: '100%',
              '& .MuiInputBase-root': {
                '& input': {
                  fontSize: '16px !important',
                  color: theme.palette.grey[100],
                  fontWeight: 500,
                  lineHeight: '100%',
                  letterSpacing: '0.16px',
                  border: 'none',
                  '&::placeholder': {
                    color: theme.palette.grey[100],
                  }
                },
                '& fieldset': {
                  border: 'none',
                }
              }
            }}
          />
          {!isRequired && (
            <Stack direction={'row'} gap={2} alignItems={'center'}>
              <FormControl variant="outlined" style={{ minWidth: 150 }}>
                <Select
                  value={field.type}
                  onChange={(e) => handleTypeChange(index, e.target.value)}
                  sx={{
                    '& .MuiSelect-select': {
                      padding: '5px 8px',
                      paddingRight: '10px',
                      borderRadius: '5px',
                      backgroundColor: '#F4F4F6',
                      color: 'rgba(17, 17, 17, 0.84)',
                      fontSize: '14px',
                      fontWeight: 500,
                      letterSpacing: '0.14px',
                      '& div': {
                        paddingRight: 0,
                      },
                      '& fieldset': {
                        border: 'none',
                      }
                    }
                  }}
                >
                  <MenuItem value="text">Open Question</MenuItem>
                  <MenuItem value="select">Multi Choice</MenuItem>
                  <MenuItem value="file">Attachment</MenuItem>
                </Select>
              </FormControl>
              <svg onClick={() => handleDelete(index)} cursor={'pointer'} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.5 4.98332C14.725 4.70832 11.9333 4.56665 9.15 4.56665C7.5 4.56665 5.85 4.64998 4.2 4.81665L2.5 4.98332" stroke="#111111" stroke-opacity="0.84" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M7.08301 4.14175L7.26634 3.05008C7.39967 2.25841 7.49967 1.66675 8.90801 1.66675H11.0913C12.4997 1.66675 12.608 2.29175 12.733 3.05841L12.9163 4.14175" stroke="#111111" stroke-opacity="0.84" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M15.7087 7.6167L15.167 16.0084C15.0753 17.3167 15.0003 18.3334 12.6753 18.3334H7.32533C5.00033 18.3334 4.92533 17.3167 4.83366 16.0084L4.29199 7.6167" stroke="#111111" stroke-opacity="0.84" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M8.6084 13.75H11.3834" stroke="#111111" stroke-opacity="0.84" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M7.91699 10.4167H12.0837" stroke="#111111" stroke-opacity="0.84" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </Stack>
          )}
        </Stack>
      </Stack>
      {field.type === 'text' && (
        <TextField
          fullWidth
          value={field.value}
          onChange={(e) => handleChange(index, 'value', e.target.value)}
          variant="outlined"
          InputProps={{
            readOnly: isRequired,
            autoFocus: true,
          }}
          placeholder="Response field"
          sx={{
            flex: 1,
            '& .MuiInputBase-root': {
              width: '100%',
              backgroundColor: '#F4F4F6',
              borderRadius: '6px',
              border: "0.5px solid rgba(17, 17, 17, 0.08)",
              '& input': {
                width: '100%',
                borderRadius: '5px',
                backgroundColor: '#F4F4F6',
                color: theme.palette.grey[100],
                '&::placeholder': {
                  color: theme.palette.grey[100],
                }
              },
              '& fieldset': {
                width: '100%',
                border: 'none',
              }
            }
          }}
        />
      )}
      {field.type === 'select' && field.options && field.options.map((option: string, idx: number) => (
        <Stack direction="row" alignItems="center" gap={1} key={idx}>
          <TextField
            value={option}
            onChange={(e) => handleChange(index, 'options', e.target.value, idx)}
            variant="outlined"
            placeholder={`Enter option ${idx + 1}`}
            disabled={isRequired}
            sx={{
              width: '100%',
              '& .MuiInputBase-root': {
                width: '100%',
                flex: 1,
                backgroundColor: '#F4F4F6',
                borderRadius: '6px',
                border: "0.5px solid rgba(17, 17, 17, 0.08)",
                '& input': {
                  width: '100%',
                  color: theme.palette.grey[100],
                  '&::placeholder': {
                    color: theme.palette.grey[100],
                  }
                },
                '& fieldset': {
                  width: '100%',
                  border: 'none',
                }
              }
            }}
          />
          {!isRequired && (
            <IconButton size="small" onClick={() => handleDelete(index, idx)}>
              <svg cursor={'pointer'} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.5 4.98332C14.725 4.70832 11.9333 4.56665 9.15 4.56665C7.5 4.56665 5.85 4.64998 4.2 4.81665L2.5 4.98332" stroke="#111111" stroke-opacity="0.84" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M7.08301 4.14175L7.26634 3.05008C7.39967 2.25841 7.49967 1.66675 8.90801 1.66675H11.0913C12.4997 1.66675 12.608 2.29175 12.733 3.05841L12.9163 4.14175" stroke="#111111" stroke-opacity="0.84" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M15.7087 7.6167L15.167 16.0084C15.0753 17.3167 15.0003 18.3334 12.6753 18.3334H7.32533C5.00033 18.3334 4.92533 17.3167 4.83366 16.0084L4.29199 7.6167" stroke="#111111" stroke-opacity="0.84" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M8.6084 13.75H11.3834" stroke="#111111" stroke-opacity="0.84" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M7.91699 10.4167H12.0837" stroke="#111111" stroke-opacity="0.84" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </IconButton>
          )}
        </Stack>
      ))}
      {field.type === 'file' && (
        <TextField
          fullWidth
          value={field.value}
          onChange={(e) => handleChange(index, 'value', e.target.value)}
          variant="outlined"
          placeholder="Attach file"
          InputProps={{
            readOnly: isRequired,
            autoFocus: true,
            startAdornment: (
              <InputAdornment position="start">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10.2754 10.1249L8.21706 12.1833C7.07539 13.3249 7.07539 15.1666 8.21706 16.3083C9.35872 17.4499 11.2004 17.4499 12.3421 16.3083L15.5837 13.0666C17.8587 10.7916 17.8587 7.0916 15.5837 4.8166C13.3087 2.5416 9.60872 2.5416 7.33372 4.8166L3.80039 8.34994C1.85039 10.2999 1.85039 13.4666 3.80039 15.4249" stroke="#111111" stroke-opacity="0.92" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiInputBase-root': {
              backgroundColor: '#F4F4F6',
              borderRadius: '6px',
              border: "0.5px solid rgba(17, 17, 17, 0.08)",
              '& input': {
                color: theme.palette.grey[100],
                '&::placeholder': {
                  color: theme.palette.grey[100],
                }
              },
              '& fieldset': {
                border: 'none',
              }
            }
          }}
        />
      )}
    </Stack>
  );
};

const AssessmentStep: React.FC<AssessmentStepProps> = ({ 
  assessments, 
  selectedAssessment, 
  handleAssessmentChange 
}) => {
  return (
    <Stack direction="row" spacing={3} alignItems="flex-start" marginBottom="20px" width={'100%'}>
      <Stack spacing={1} minWidth={'280px'}>
        <Typography variant="subtitle1">Add Assessment</Typography>
        <Typography variant="body2" color="textSecondary">
          Assessment for this role
        </Typography>
      </Stack>
      <FormControl fullWidth>
        <InputLabel>Select Assessment</InputLabel>
        <Select
          value={selectedAssessment?.id || ''}
          onChange={(e) => {
            const selected = assessments.find(a => a.id === e.target.value);
            handleAssessmentChange(selected || null);
          }}
          label="Select Assessment"
        >
          {assessments.map((assessment) => (
            <MenuItem key={assessment.id} value={assessment.id}>
              {assessment.title}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Stack>
  );
};

const AboutTheJob = () => {
  const params = useParams();
  const jobId = params['job_id'];
  const theme = useTheme()
  const steps = ['About the Job', 'Application Form', 'Assessment'];

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    location: '',
    work_model: '',
    job_type: '',
    description: '',
    responsibilities: '',
    expectations: [],
    salary_min: '',
    salary_max: '',
    salary_error: '',
    skills: {
      technical: [],
      soft: [],
    },
  });

  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [jobUrl, setJobUrl] = useState("");
  const [technicalSkills, setTechnicalSkills] = useState<string[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [customSkills, setCustomSkills] = useState<string[]>([]);
  const assessments: Assessment[] = [
    { id: 'Assessment 1', title: 'Assessment 1', description: 'Description for Assessment 1' },
    { id: 'Assessment 2', title: 'Assessment 2', description: 'Description for Assessment 2' },
    { id: 'Assessment 3', title: 'Assessment 3', description: 'Description for Assessment 3' }
  ];

  // Fetch job details on component mount
  useEffect(() => {
    const fetchJobDetails = async () => {
      if (!jobId) {
        setError('No job ID provided' as any);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const token = localStorage.getItem('jwt');

        const response = await axios.get(`https://app.elevatehr.ai/wp-json/elevatehr/v1/jobs/${jobId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        const jobData = response.data;
        if (!jobData.description.length) {
          const aiSuggestions = await generateInput({ jobTitle: jobData.title, jobLevel: jobData.level, field: '' });
          const expectations = aiSuggestions.expectations;
          if (expectations[0] === '') expectations.shift();

          // Generate skills based on the job title and description
          const generatedSkills = await generateSkillsForRole(jobData.title, aiSuggestions.aboutTheRole);
          
          // Take only the first 6 technical skills
          const initialSelectedSkills = generatedSkills.technical.slice(0, 6);
          setSkills([...generatedSkills.technical,...generatedSkills.soft]);
          setCustomSkills([]);

          setFormData({
            ...jobData,
            expectations: expectations || [],
            about_role: aiSuggestions.aboutTheRole || '',
            responsibilities: aiSuggestions.jobResponsibilities || '',
            description: aiSuggestions.aboutTheRole || '',
            salary_min: jobData.salary_min || '',
            salary_max: jobData.salary_max || '',
            skills: initialSelectedSkills
          });
          setCustomFields(jobData.application_form.custom_fields || []);
          setFormFields(jobData.application_form.required_fields || []);
          setLoading(false);
          return;
        }

        // For existing job data
        const skills = await generateSkillsForRole(jobData.title, jobData.description);
        const existingExpectations = jobData.expectations.split('|||') || [];

        setCustomFields(jobData.application_form.custom_fields || []);
        setFormData({
          ...jobData,
          expectations: existingExpectations,
          salary_min: jobData.salary_min || '',
          salary_max: jobData.salary_max || '',
          skills: skills
        });
        setFormFields(jobData.application_form.required_fields || []);

        setLoading(false);
      } catch (err) {
        console.error('Error fetching job details:', err);
        setError('Failed to fetch job details. Please try again later.' as any);
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [jobId]);

  const handleChange = (field: string, value: string) => {
    setFormData(prevData => ({
      ...prevData,
      [field]: value
    }));
  };

  type RegenerateField = 'aboutTheRole' | 'jobResponsibilities' | 'expectations';

  const handleRegenerate = (field: RegenerateField) => async () => {
    try {
      const aiSuggestions = await generateInput({ 
        jobTitle: formData.title, 
        jobLevel: formData.level || '', 
        field: field 
      });

      if (field === 'expectations') {
        setFormData(prevData => ({
          ...prevData,
          expectations: aiSuggestions.expectations
        }));
      } else {
        setFormData(prevData => ({
          ...prevData,
          [field === 'aboutTheRole' ? 'about_role' : 'responsibilities']: aiSuggestions[field] || prevData[field]
        }));
      }
    } catch (err) {
      console.error(`Error regenerating ${field}:`, err);
    }
  };

  const addExpectation = () => {
    setFormData((prevData) => ({
      ...prevData,
      expectations: [...prevData.expectations, 'New Expectation'],
    }));
  };

  const addField = (type = 'text') => {
    setCustomFields([
      ...customFields,
      {
        key: `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type,
        label: '',
        description: '',
        value: '',
        options: type === 'select' ? ['', ''] : []
      }
    ]);
  };

  const handleFieldChange = (index: number, key: string, value: string, optionIndex: number | null = null) => {
    setCustomFields((prevFields) =>
      prevFields.map((field, idx) => {
        if (idx === index) {
          if (key === 'options' && optionIndex !== null) {
            return {
              ...field,
              options: field.options.map((opt, i) => (i === optionIndex ? value : opt)),
            };
          } else if (key === 'addOption') {
            return {
              ...field,
              options: [...field.options, ''],
            };
          } else {
            return { ...field, [key]: value };
          }
        }
        return field;
      })
    );
  };

  const handleTypeChange = (index: number, type: string) => {
    setCustomFields((prevFields) =>
      prevFields.map((field, idx) => {
        if (idx === index) {
          const updatedField = { ...field, type };
          if (type === 'select' && (!updatedField.options || !updatedField.options.length)) {
            updatedField.options = ['', ''];
          } else if (type !== 'select') {
            updatedField.options = [];
          }
          return updatedField;
        }
        return field;
      })
    );
  };

  const handleDeleteField = (index: number, optionIndex: number | null = null) => {
    setCustomFields((prevFields) =>
      prevFields.map((field, idx) => {
        if (idx === index) {
          if (optionIndex !== null) {
            return {
              ...field,
              options: field.options.filter((_, optIdx) => optIdx !== optionIndex),
            };
          }
          return null; // This will be filtered out below
        }
        return field;
      }).filter((field): field is CustomField => field !== null)
    );
  };

  const handleAssessmentChange = (assessment: Assessment | null) => {
    setSelectedAssessment(assessment);
  };

  const validateSalaryRange = (value: string) => {
    const salaryRegex = /^\d+(?:-\d+)?$/;
    return salaryRegex.test(value);
  };

  const handleSalaryChange = (value: string) => {
    // Remove any non-numeric characters except dash
    const cleanValue = value.replace(/[^\d-]/g, '');
    
    // Only allow one dash
    if (cleanValue.split('-').length > 2) {
      return;
    }

    // Split the value into min and max
    const [min, max] = cleanValue.split('-');

    // Update the form data with both min and max values
    setFormData(prev => ({
      ...prev,
      salary_min: min || '',
      salary_max: max || '',
      salary_error: ''
    }));
  };

  const formatSalaryDisplay = (value: string) => {
    if (!value) return '';
    
    const parts = value.split('-');
    if (parts.length === 1) {
      // Single number
      const num = parseInt(parts[0]);
      return isNaN(num) ? value : num.toLocaleString();
    } else {
      // Range
      const min = parseInt(parts[0]);
      const max = parseInt(parts[1]);
      if (isNaN(min) || isNaN(max)) {
        return value;
      }
      return `${min.toLocaleString()}-${max.toLocaleString()}`;
    }
  };

  const handleSkillsChange = (type: 'technical' | 'soft' | 'custom', newValue: string[]) => {
    switch (type) {
      case 'technical':
        setTechnicalSkills(newValue);
        break;
      case 'soft':
        setSkills(newValue);
        break;
      case 'custom':
        setCustomSkills(newValue);
        break;
    }

    // Update formData skills
    setFormData(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        [type]: newValue
      }
    }));
  };

  const handleDone = async () => {
    // Collate all the data
    const collatedData = {
      ...formData,
      custom_fields: customFields.map(field => ({
        key: field.key,
        type: field.type,
        label: field.label,
        description: field.description,
        value: field.value,
        options: field.options
      })),
      selectedAssessment: selectedAssessment?.id,
      expectations: formData.expectations.join('|||'),
      salary_min: parseInt(formData.salary_min.replace(/,/g, '')) || 0,
      salary_max: parseInt(formData.salary_max.replace(/,/g, '')) || 0
    };

    console.log("Updating job post...", collatedData);

    if (!jobId) {
      alert("Error: Job ID is missing!");
      return;
    }

    try {
      const token = localStorage.getItem("jwt");
      const response = await axios.put(
        `https://app.elevatehr.ai/wp-json/elevatehr/v1/jobs/${jobId}`,
        {
          ...collatedData,
          job_type: "fulltime",
          availability: "week",
          experience_years: "5 years",
          qualifications: 'Senior',
          current_role: "jnr dev",
          work_preference: "remote",
          start_date: "immediately",
          address: "34 Ellasan",
          github_profile: "https://www.linkedin.com"
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        }
      );

      // Construct the job URL
      const jobUrl = `http://localhost:3000/dashboard/job-openings/${jobId}`;
      setJobUrl(jobUrl);
      setShowDialog(true);

      console.log("Success:", response.data);
    } catch (error) {
      const apiError = error as ApiError;
      console.error(
        "Error updating job post:", 
        apiError.response?.data || apiError.message || "Unknown error"
      );
      alert(
        `Failed to update job post: ${apiError.response?.data?.message || apiError.message || "Unknown error"}`
      );
    }
  };

  // Copy to clipboard function
  const copyToClipboard = () => {
    navigator.clipboard.writeText(jobUrl).then(() => {
      alert("URL copied to clipboard!");
    });
  };

  // Redirect function
  const handleCloseDialog = () => {
    setShowDialog(false);
    window.location.href = "http://localhost:3000/dashboard";
  };

  const renderStepContent = () => {
    if (loading) {
      return (
        <Stack spacing={2} padding="20px">
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="rectangular" height={150} />
          <Skeleton variant="text" width="40%" />
          <Skeleton variant="rectangular" height={100} />
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="rectangular" height={150} />
          <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
            <Skeleton variant="circular" width={40} height={40} />
            <Skeleton variant="circular" width={40} height={40} />
            <Skeleton variant="circular" width={40} height={40} />
          </Stack>
        </Stack>
      );
    }

    if (error) {
      return <Typography align="center" color="error" padding="20px">{error}</Typography>;
    }

    switch (currentStep) {
      case 1:
        return (
          <>
            <Field
              label="Job Title"
              description="A descriptive job title."
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              sx={{
                '& .MuiInputBase-root': {
                  '& input': {
                    fontSize: '24px !important',
                    color: 'rgba(17, 17, 17, 0.92)',
                    fontWeight: 600,
                    lineHeight: '100%',
                    letterSpacing: '0.12px',
                  },
                  '& fieldset': {
                    borderRadius: '8px',
                    border: '0.8px solid rgba(17, 17, 17, 0.14) !important',
                  }
                },
              }}
            />
            <Divider />

            <TextEditor
              label="About the Role"
              description="More information on the role."
              value={formData.about_role}
              onChange={(value) => handleChange('about_role', value)}
              onRegenerate={handleRegenerate('aboutTheRole')}
            />
            <TextEditor
              label="Job Responsibilities"
              description="What you will do in this role."
              value={formData.responsibilities}
              onChange={(value) => handleChange('responsibilities', value)}
              onRegenerate={handleRegenerate('jobResponsibilities')}
            />
            <Stack spacing={1} marginBottom="10px" direction="row" padding="28px 24px">
              <Stack spacing={1} minWidth={'280px'}>
                <Typography variant="subtitle1" sx={{
                  color: 'rgba(17, 17, 17, 0.92)',
                  fontSize: '20px',
                  fontStyle: 'normal',
                  fontWeight: 600,
                  lineHeight: '100%',
                  letterSpacing: '0.1px',
                }}>Expectation</Typography>
                <Typography sx={{
                  color: 'rgba(17, 17, 17, 0.68)',
                  fontSize: '16px',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  lineHeight: '100%',
                  letterSpacing: '0.16px',
                }} variant="body2" color="textSecondary">
                  What you&rsquo;re bringing to this role.
                </Typography>
                <IconButton size="small" onClick={handleRegenerate('expectations')}>
                  <RefreshIcon />
                </IconButton>
              </Stack>
              <Stack gap={'12px'} width={'100%'}>
                {formData.expectations.map((expectation, index) => (
                  <TextField
                    key={index}
                    fullWidth
                    value={expectation}
                    onChange={(e) => {
                      const newExpectations = [...formData.expectations];
                      newExpectations[index] = e.target.value;
                      setFormData((prevData) => ({
                        ...prevData,
                        expectations: newExpectations,
                      }));
                    }}
                    variant="outlined"
                    sx={{
                      '& .MuiInputBase-root': {
                        '& fieldset': {
                          borderRadius: '8px',
                          border: '0.8px solid rgba(17, 17, 17, 0.14) !important',
                        }
                      },
                    }}
                  />
                ))}
                <Button
                  startIcon={<AddIcon />}
                  onClick={addExpectation}
                  style={{ marginTop: '10px' }}
                >
                  Add Expectation
                </Button>
              </Stack>
            </Stack>
            <Divider />
            <Field
              label="Salary Range"
              description="Add numeration"
              value={formatSalaryDisplay(`${formData.salary_min}-${formData.salary_max}`)}
              onChange={(e) => handleSalaryChange(e.target.value)}
              error={formData.salary_error}
              placeholder="50,000-100,000"
              sx={{
                '& .MuiInputBase-root': {
                  '& fieldset': {
                    borderRadius: '8px',
                    border: '0.8px solid rgba(17, 17, 17, 0.14) !important',
                  }
                },
              }}
            />
            <Divider />
            <Stack direction="row" spacing={3} alignItems="flex-start" padding="28px 24px">
              <Stack spacing={1} minWidth={'280px'}>
                <Typography variant="subtitle1" sx={{
                  color: 'rgba(17, 17, 17, 0.92)',
                  fontSize: '20px',
                  fontStyle: 'normal',
                  fontWeight: 600,
                  lineHeight: '100%',
                  letterSpacing: '0.1px',
                }}>Skills Required</Typography>
                <Typography sx={{
                  color: 'rgba(17, 17, 17, 0.68)',
                  fontSize: '16px',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  lineHeight: '100%',
                  letterSpacing: '0.16px',
                }} variant="body2" color="textSecondary">
                  Select or add required skills for this role
                </Typography>
              </Stack>
              <Box sx={{ width: '100%' }}>
                <StyledSelect
                  isMulti
                  value={formData.skills.map(skill => ({ value: skill, label: skill }))}
                  onChange={(newValue: MultiValue<SkillOption>) => {
                    const selectedSkills = newValue ? newValue.map((option: SkillOption) => option.value) : [];
                    handleSkillsChange('technical', selectedSkills);
                  }}
                  options={skills.map(skill => ({
                        value: skill,
                        label: skill
                      }))}
                  placeholder="Select or type to add new skills"
                  noOptionsMessage={({ inputValue }: { inputValue: string }) => inputValue ? "Press enter to add this skill" : "No skills available"}
                  formatCreateLabel={(inputValue: string) => `Add "${inputValue}" as a new skill`}
                  onCreateOption={(inputValue: string) => {
                    const newSkill = inputValue.trim();
                    if (newSkill) {
                      const updatedSkills = [...formData.skills.technical, newSkill];
                      handleSkillsChange('technical', updatedSkills);
                      setTechnicalSkills(prev => [...prev, newSkill]);
                    }
                  }}
                  classNamePrefix="select"
                  maxMenuHeight={300}
                />
              </Box>
            </Stack>
            <Divider />
          </>
        );
      case 2:
        return (
          <Stack padding="28px" gap={'12px'}>
            {/* Display required fields */}
            {formFields.map((field: FormField, index) => (
              <FormBuilderField
                key={`required-${index}`}
                field={field.type === 'email' || field.type === 'url' ? { ...field, type: 'text' } : field}
                index={index}
                handleChange={handleFieldChange}
                handleDelete={handleDeleteField}
                handleTypeChange={handleTypeChange}
                isRequired={true}
              />
            ))}
            
            {/* Display custom fields */}
            {customFields.map((field, index) => (
              <FormBuilderField
                key={field.key}
                field={field.type === 'email' || field.type === 'url' ? { ...field, type: 'text' } : field}
                index={index}
                handleChange={handleFieldChange}
                handleDelete={handleDeleteField}
                handleTypeChange={handleTypeChange}
                isRequired={false}
              />
            ))}

            <StyledOutlineButton
              variant="outlined"
              color="primary"
              onClick={() => addField()}
              style={{ alignSelf: 'flex-start', marginTop: '20px', marginRight: '10px' }}
            >
              Add Question
            </StyledOutlineButton>
          </Stack>
        );
      case 3:
        return (
          <AssessmentStep
            assessments={assessments}
            selectedAssessment={selectedAssessment}
            handleAssessmentChange={handleAssessmentChange}
          />
        );
      default:
        return <Typography>Unknown Step</Typography>;
    }
  };

  return (
    <PageContainer>
      <Banner sx={{
        width: "100%",
        backgroundColor: theme.palette.primary.main,
        backgroundImage: "url(/images/backgrounds/banner-bg.svg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }} height={'204px'} display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'}>
        {loading ? (
          <Stack spacing={2} alignItems="center">
            <Skeleton variant="text" width="120%"  height={40}  />
            <Stack direction="row" spacing={2} justifyContent="center">
              <Skeleton variant="rounded" width={100} height={30} />
              <Skeleton variant="rounded" width={100} height={30} />
              <Skeleton variant="rounded" width={100} height={30} />
            </Stack>
          </Stack>
        ) : (
          <>
            <Typography variant="h4" sx={{
              color: "rgba(255, 255, 255, 0.92)",
              textAlign: "center",
              fontSize: "40px",
              fontWeight: "600",
              lineHeight: "100%"
            }}>{formData.title}</Typography>
            <Stack mt={2} direction={'row'} alignItems={'center'} justifyContent={'center'} gap={'8px'}>
              <Pill label={formData.location} />
              <Pill label={formData.work_model} />
              <Pill label={formData.job_type} />
            </Stack>
          </>
        )}
      </Banner>
      <FormContainer>
        <StyledStepper activeStep={currentStep - 1}>
          {steps.map((label, index) => (
            <Step key={label}>
              <StyledStepLabel>{label}</StyledStepLabel>
            </Step>
          ))}
        </StyledStepper>
        <Divider />

        {renderStepContent()}
        <Stack direction="row" gap={3} alignItems="flex-start" marginBottom="20px" width={'100%'} justifyContent={'flex-end'} padding={'28px 43px'}>
          {currentStep === 3 ? (
            <Stack direction={'row'} gap={3}>
              <StyledOutlineButton
                variant="outlined"
                color="primary"
                onClick={() => setCurrentStep((prev) => Math.max(prev - 1, 1))}
                style={{ alignSelf: 'flex-end', marginTop: '20px', marginRight: '10px' }}
              >
                Back
              </StyledOutlineButton>
              <StyledButton
                variant="contained"
                color="primary"
                onClick={handleDone}
                style={{ alignSelf: 'flex-end', marginTop: '20px' }}
              >
                Done
              </StyledButton>
            </Stack>
          ) : (
            <>
              {currentStep > 1 && (
                <StyledOutlineButton
                  variant="outlined"
                  onClick={() => setCurrentStep((prev) => Math.max(prev - 1, 1))}
                  style={{ alignSelf: 'flex-end', marginTop: '20px', marginRight: '10px' }}
                >
                  Back
                </StyledOutlineButton>
              )}
              <StyledButton
                variant="contained"
                onClick={() => setCurrentStep((prev) => Math.min(prev + 1, 3))}
                style={{ alignSelf: 'flex-end', marginTop: '20px' }}
              >
                Next
              </StyledButton>
            </>
          )}
        </Stack>
        <Dialog open={showDialog} onClose={handleCloseDialog}>
          <DialogTitle>Job Post Updated Successfully!</DialogTitle>
          <DialogContent>
            <Typography variant="body1">Your job post has been successfully updated. You can share the job link below:</Typography>
            <TextField
              fullWidth
              margin="dense"
              value={jobUrl}
              InputProps={{
                readOnly: true,
                endAdornment: (
                  <IconButton onClick={copyToClipboard} edge="end">
                    <ContentCopyIcon />
                  </IconButton>
                )
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} variant="contained" color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </FormContainer>
    </PageContainer>
  );
};

export default AboutTheJob;
