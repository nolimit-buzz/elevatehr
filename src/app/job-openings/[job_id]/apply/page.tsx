"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  FormLabel,
  FormHelperText,
  RadioGroup,
  FormControlLabel,
  Radio,
  Select,
  MenuItem,
  Stack,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grow,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Form, FormField } from "@/app/dashboard/components/ui/form";
import { formSchema, type Inputs } from "@/app/lib/schema";
import { useState, useEffect } from "react";
import { FORM_SUBMIT_URL } from "@/app/lib/constants";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";
import Progress from "@/app/dashboard/layout/progress";
import axios from "axios";
import { CheckCircle, Close } from "@mui/icons-material";
import { useRouter } from "next/navigation";

const StyledTextField = styled(TextField)(({ theme }) => ({
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
    fontSize: '16px',
    '&::placeholder': {
      fontSize: '16px',
      color: 'rgba(17, 17, 17, 0.48)',
    },
  },
}));

const StyledFormLabel = styled(FormLabel)(({ theme }) => ({
  fontSize: '28px',
  fontWeight: 500,
  color: theme.palette.secondary.light,
  display: 'block',
  marginBottom: '10px',
  '&.Mui-focused': {
    color: theme.palette.primary.main,
  },

  '& .MuiFormLabel-root': {
    marginBottom: '18px',
    display: 'block',
  },
}));

const StyledFormHelperText = styled(FormHelperText)(({ theme }) => ({
  fontSize: '14px',
  fontWeight: 500,
  color: theme.palette.error.main,
  marginTop: '4px',
}));

export default function Typeform({
  params,
}: {
  params: { job_id: string };
}) {
  interface FormField {
    key: string;
    label: string;
    type: string;
    required: boolean;
    options?: string[];
    placeholder?: string;
    description?: string;
    allowed_types?: string[];
  }

  interface FormData {
    required_fields: FormField[];
    custom_fields: FormField[];
  }

  const [previousStep, setPreviousStep] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<FormData | null>(null);
  const [fileInputs, setFileInputs] = useState<{ [key: string]: File | null }>({});
  const delta = currentStep - previousStep;
  const router = useRouter();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (fieldKey: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileInputs(prev => ({ ...prev, [fieldKey]: file }));
      form.setValue(fieldKey as keyof Inputs, file.name);
    }
  };

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await axios.get(
          `https://app.elevatehr.ai/wp-json/elevatehr/v1/active-jobs/${params.job_id}`,
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
        console.log('Job data response:', response.data);
        setFormData(response.data.jobs.application_form);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching job data:", error);
        toast.error("Failed to load job application form");
        setIsLoading(false);
      }
    };

    fetchFormData();
  }, [params.job_id]);

  const form = useForm<Inputs>({
    resolver: zodResolver(formSchema),
  });

  if (isLoading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        backgroundColor: 'primary.main'
      }}>
        <CircularProgress sx={{ color: 'white' }} />
      </Box>
    );
  }

  if (!formData) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        backgroundColor: 'primary.main'
      }}>
        <Typography color="white">No form data available</Typography>
      </Box>
    );
  }

  const allFields = [...formData.required_fields, ...formData.custom_fields];
  const currentField = allFields[currentStep];

  const next = async () => {
    const field = currentField.key as keyof Inputs;
    
    // First check if the field is required
    if (currentField.required) {
      const value = form.getValues(field);
      
      // For file fields, check if a file was uploaded
      if (currentField.type === 'file') {
        if (!fileInputs[field]) {
          form.setError(field, { type: 'required', message: 'This field is required' });
          return;
        }
      } else if (!value || (typeof value === 'string' && value.trim() === '')) {
        form.setError(field, { type: 'required', message: 'This field is required' });
        return;
      }
    }

    // Then validate against the schema
    const output = await form.trigger(field, {
      shouldFocus: true,
    });

    if (!output) {
      const error = form.formState.errors[field];
      if (error?.type === 'required') {
        form.setError(field, { type: 'required', message: 'This field is required' });
      }
      return;
    }

    if (currentStep < allFields.length - 1) {
      setPreviousStep(currentStep);
      setCurrentStep((step) => step + 1);
    }
  };

  const prev = () => {
    if (currentStep > 0) {
      setPreviousStep(currentStep);
      setCurrentStep((step) => step - 1);
    }
  };

  const submitForm = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    if (currentStep === allFields.length - 1) {
      try {
        const formData = new FormData();
        
        // Add all form values
        Object.entries(form.getValues()).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            formData.append(key, value);
          }
        });

        // Add files
        Object.entries(fileInputs).forEach(([key, file]) => {
          if (file) {
            formData.append(key, file);
          }
        });

        const response = await fetch(
          `https://app.elevatehr.ai/wp-json/elevatehr/v1/jobs/${params.job_id}/applications`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          toast.error(errorData.message || "Error submitting the form. Please try again.");
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        console.log("Application submitted successfully:", data);
        toast.success("Application submitted successfully");
        setIsSubmitted(true);
        setIsSubmitting(false);
        handleSuccess();
      } catch (error) {
        console.error("Error submitting application:", error);
        toast.error("Error submitting the application. Please try again later.");
        setIsSubmitting(false);
        handleError("Error submitting the application. Please try again later.");
      }
    } else {
      next();
    }
  };

  const handleSuccess = () => {
    setShowSuccessModal(true);
    // Close modal after 3 seconds
    setTimeout(() => {
      setShowSuccessModal(false);
      router.push(`/job-openings/${params.job_id}`);
    }, 3000);
  };

  const handleError = (message: string) => {
    setErrorMessage(message);
    setShowErrorModal(true);
  };

  if (isSubmitted) {
    return (
      <Dialog
        open={true}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px',
            padding: { xs: '16px', sm: '32px' },
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            background: 'linear-gradient(145deg, #ffffff, #f5f5f5)',
            position: 'relative',
            maxWidth: { xs: '90%', sm: '620px' },
            margin: { xs: '16px', sm: '32px' }
          }
        }}
      >
        <DialogContent sx={{ 
          textAlign: 'center', 
          pt: { xs: 2, sm: 4 },
          px: { xs: 2, sm: 4 }
        }}>
          <Box 
            sx={{ 
              mb: { xs: 2, sm: 3 },
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: { xs: '80px', sm: '120px' },
              width: { xs: '80px', sm: '120px' },
              mx: 'auto',
              borderRadius: '50%',
              backgroundColor: 'rgba(76, 175, 80, 0.08)',
              boxShadow: '0 4px 20px rgba(76, 175, 80, 0.1)'
            }}
          >
            <Grow in={true} timeout={1000} style={{ transformOrigin: 'center center' }}>
              <svg 
                width={40} 
                height={40} 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                style={{ transition: 'transform 0.3s ease-in-out' }}
              >
                <path 
                  d="M12 22.75C6.07 22.75 1.25 17.93 1.25 12C1.25 6.07 6.07 1.25 12 1.25C17.93 1.25 22.75 6.07 22.75 12C22.75 17.93 17.93 22.75 12 22.75ZM12 2.75C6.9 2.75 2.75 6.9 2.75 12C2.75 17.1 6.9 21.25 12 21.25C17.1 21.25 21.25 17.1 21.25 12C21.25 6.9 17.1 2.75 12 2.75Z" 
                  fill="#4CAF50"
                />
                <path 
                  d="M10.58 15.58C10.38 15.58 10.19 15.5 10.05 15.36L7.22 12.53C6.93 12.24 6.93 11.76 7.22 11.47C7.51 11.18 7.99 11.18 8.28 11.47L10.58 13.77L15.72 8.63001C16.01 8.34001 16.49 8.34001 16.78 8.63001C17.07 8.92001 17.07 9.40001 16.78 9.69001L11.11 15.36C10.97 15.5 10.78 15.58 10.58 15.58Z" 
                  fill="#4CAF50"
                />
              </svg>
            </Grow>
          </Box>
          <DialogTitle sx={{ 
            textAlign: 'center', 
            pb: { xs: 1, sm: 2 },
            px: 0
          }}>
            <Typography 
              variant="h5" 
              component="h1" 
              sx={{ 
                width: '100%',
                maxWidth: { xs: '280px', sm: '400px', md: '100%' },
                mx: 'auto',
                px: { xs: 2, sm: 4 },
                fontWeight: 600, 
                color: 'grey.100',
                fontSize: { xs: '1.25rem', sm: '1.75rem' },
                mb: 1,
                wordWrap: 'break-word',
                overflowWrap: 'break-word'
              }}
            >
              Thank you for your application!
            </Typography>
          </DialogTitle>
          <Typography 
            variant="body1" 
            color="grey.200" 
            sx={{ 
              mb: { xs: 1, sm: 2 },
              fontSize: { xs: '0.9rem', sm: '1.1rem' },
              lineHeight: 1.6,
              width: '100%',
              maxWidth: { xs: '280px', sm: '400px', md: '100%' },
              mx: 'auto',
              px: { xs: 2, sm: 4 },
              wordWrap: 'break-word',
              overflowWrap: 'break-word',
              whiteSpace: 'normal'
            }}
          >
            Your application is in! We&apos;ll review it and get back to you via email.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ 
          justifyContent: 'center', 
          pt: { xs: 1, sm: 2 }, 
          gap: 2,
          px: { xs: 2, sm: 4 }
        }}>
          <Button
            variant="outlined"
            onClick={() => router.push(`/job-openings/${params.job_id}`)}
            sx={{
              borderColor: 'primary.main',
              color: 'primary.main',
              fontWeight: 500,
              px: { xs: 2, sm: 4 },
              py: { xs: 1, sm: 1.5 },
              borderRadius: '8px',
              textTransform: 'none',
              fontSize: { xs: '0.9rem', sm: '1rem' },
              '&:hover': {
                borderColor: 'primary.dark',
                backgroundColor: 'rgba(25, 118, 210, 0.04)',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              },
              transition: 'all 0.2s ease-in-out'
            }}
          >
            Back to Job Details
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <>
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-10">
        <Progress currentStep={currentStep} totalSteps={allFields.length} />
      </div>
      {/* Form Container */}
      <Stack direction="row" justifyContent="center" alignItems="center" spacing={2} sx={{backgroundColor:"primary.main", height:"100vh", width:"100vw"}}>
        <Form {...form}>
          <form style={{ width: '100%', maxWidth: '540px', margin: '0 auto', padding: '20px' }}>
            <motion.div
              style={{height:"max-content", width:"100%"}}
              key={currentStep}
              className="w-full"
              initial={{ y: delta >= 0 ? "60%" : "-60%", opacity: 0 }}
              exit={{ y: delta >= 0 ? "-60%" : "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, ease: "easeInOut", delay: 0.1 }}
            >
              <FormField
                control={form.control}
                name={currentField.key as keyof Inputs}
                render={({ field, fieldState: { error } }) => (
                  <Box sx={{ mb: 4, height:"max-content", width:"100%" }}>
                    {currentStep > 0 && (
                      <Button
                        type="button"
                        variant="text"
                        onClick={prev}
                        sx={{ 
                          minWidth:"max-content",
                          width:"max-content",
                          px:0,
                          m:0,
                          mb: 2, 
                          fontWeight: 600,
                          color: 'secondary.light',
                          '&:hover': {
                            color: 'secondary.dark',
                          }
                        }}
                      >
                        Back
                      </Button>
                    )}
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Step {currentStep + 1} of {allFields.length}
                    </Typography>
                    <StyledFormLabel>
                      {currentField.label}
                      {currentField.required && (
                        <Typography component="span" color="error" sx={{ ml: 0.5,  fontWeight: 600 }}>
                          *
                        </Typography>
                      )}
                    </StyledFormLabel>
                    {currentField.description && (
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: '14px' }}>
                        {currentField.description}
                      </Typography>
                    )}
                    <FormControl fullWidth error={!!error} sx={{height:"max-content"}}>
                      {currentField.type === 'select' ? (
                        <Select
                          {...field}
                          displayEmpty
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              next();
                            }
                          }}
                          sx={{
                            backgroundColor: '#F8F9FB',
                            borderRadius: '8px',
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: 'transparent',
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: 'transparent',
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                              borderColor: 'primary.main',
                            },
                          }}
                        >
                          <MenuItem value="" disabled>
                            {currentField.placeholder || "Select an option..."}
                          </MenuItem>
                          {currentField.options && typeof currentField.options === 'object' && !Array.isArray(currentField.options) && 
                            Object.entries(currentField.options as Record<string, string>).map(([value, label]) => (
                              <MenuItem key={value} value={value}>
                                {label}
                            </MenuItem>
                          ))}
                        </Select>
                      ) : currentField.type === 'radio' ? (
                        <RadioGroup
                          {...field}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              next();
                            }
                          }}
                          sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}
                        >
                          {currentField.options?.map((option) => (
                            <FormControlLabel
                              key={option}
                              value={option}
                              control={<Radio />}
                              label={option}
                              sx={{
                                backgroundColor: '#F8F9FB',
                                borderRadius: '8px',
                                margin: '4px 0',
                                width: '100%',
                                padding: '12px 16px',
                                '& .MuiRadio-root': {
                                  color: 'rgba(17, 17, 17, 0.48)',
                                },
                                '& .MuiTypography-root': {
                                  color: 'rgba(17, 17, 17, 0.92)',
                                  fontSize: '16px',
                                  fontWeight: 500,
                                },
                              }}
                            />
                          ))}
                        </RadioGroup>
                      ) : currentField.type === 'file' ? (
                        <Box>
                          <input
                            type="file"
                            accept={currentField.allowed_types?.map(type => `.${type}`).join(',')}
                            onChange={(e) => handleFileChange(currentField.key, e)}
                            style={{ display: 'none' }}
                            id={`file-${currentField.key}`}
                          />
                          <label htmlFor={`file-${currentField.key}`}>
                            <Button
                              component="span"
                              variant="outlined"
                              sx={{
                                backgroundColor: '#F8F9FB',
                                borderRadius: '8px',
                                borderColor: 'transparent',
                                '&:hover': {
                                  borderColor: 'primary.main',
                                  backgroundColor: 'secondary.light',
                                },
                              }}
                            >
                              {fileInputs[currentField.key] ? fileInputs[currentField.key]?.name : 'Choose File'}
                            </Button>
                          </label>
                          {currentField.allowed_types && (
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                              Allowed types: {currentField.allowed_types.join(', ')}
                            </Typography>
                          )}
                        </Box>
                      ) : currentField.type === 'email' ? (
                        <StyledTextField
                          {...field}
                          type="email"
                          placeholder={currentField.placeholder || "Enter your email..."}
                          error={!!error}
                          helperText={error?.message}
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              next();
                            }
                          }}
                        />
                      ) : currentField.type === 'url' ? (
                        <StyledTextField
                          {...field}
                          type="url"
                          placeholder={currentField.placeholder || "Enter URL..."}
                          error={!!error}
                          helperText={error?.message}
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              next();
                            }
                          }}
                        />
                      ) : (
                        <StyledTextField
                          {...field}
                          placeholder={currentField.placeholder || "Type your answer here..."}
                          error={!!error}
                          helperText={error?.message}
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              next();
                            }
                          }}
                        />
                      )}
                    </FormControl>
                  </Box>
                )}
              />
              {/* Form Actions/Buttons */}
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 2,
                mt: 4
              }}>
                {currentStep < allFields.length - 1 ? (
                  <Button
                    type="button"
                    variant="contained"
                    onClick={next}
                    sx={{
                      bgcolor: 'secondary.light',
                      color: 'primary.main',
                      fontWeight: 600,
                      padding: '12px 34px',
                      '&:hover': {
                        bgcolor: 'primary.dark',
                      }
                    }}
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => submitForm(e)}
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting}
                    sx={{
                      bgcolor: "secondary.light",
                      color: "primary.main",
                      fontWeight: 600,
                      "&:hover": {
                        bgcolor: "primary.dark",
                      },
                    }}
                  >
                    {isSubmitting ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "Submit Application"
                    )}
                  </Button>
                )}
                <Typography variant="body2" color="text.secondary">
                  press <Typography component="span" sx={{ fontWeight: 600 }}>Enter ↵</Typography>
                </Typography>
              </Box>
            </motion.div>
          </form>
        </Form>
      </Stack>
    </>
  );
}
