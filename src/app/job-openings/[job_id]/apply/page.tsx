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
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<FormData | null>(null);
  const [fileInputs, setFileInputs] = useState<{ [key: string]: File | null }>({});
  const delta = currentStep - previousStep;

  const handleFileChange = (fieldKey: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileInputs(prev => ({ ...prev, [fieldKey]: file }));
    }
  };

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const token = localStorage.getItem('jwt');
        const response = await axios.get(
          `https://app.elevatehr.ai/wp-json/elevatehr/v1/jobs/${params.job_id}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        console.log('Job data response:', response.data);
        setFormData(response.data.application_form);
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
    const output = await form.trigger(field, {
      shouldFocus: true,
    });
    if (!output) return;
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

  async function submitForm(values: Inputs) {
    if (currentStep === allFields.length - 1) {
      try {
        const formData = new FormData();
        
        // Add all form values
        Object.entries(values).forEach(([key, value]) => {
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

        const token = localStorage.getItem('jwt');
        const response = await fetch(
          `https://app.elevatehr.ai/wp-json/elevatehr/v1/jobs/${params.job_id}/applications`,
          {
            method: "POST",
            headers: {
              'Authorization': `Bearer ${token}`,
            },
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
      } catch (error) {
        console.error("Error submitting application:", error);
        toast.error("Error submitting the application. Please try again later.");
      }
    } else {
      next();
    }
  }

  if (isSubmitted) {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <div className="space-y-8 w-full">
          <img
            src="/assets/thankyou.gif"
            alt="Completed"
            className="w-1/2 w-50 mx-auto rounded-lg"
          />
          <div className="text-center">
            <h1 className="text-3xl font-bold">
              Thank you for submitting the form
            </h1>
            <p className="text-lg text-gray-600">
              We will get back to you soon.
            </p>
          </div>
        </div>
      </div>
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
          <form onSubmit={form.handleSubmit(submitForm)}>
            <motion.div
              style={{height:"max-content", width:"800px", maxWidth:"600px"}}
              key={currentStep}
              className="w-full mx-auto px-"
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
                          // backgroundColor: 'rgba(255, 255, 255, 0.1 )',
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
                          {currentField.options?.map((option) => (
                            <MenuItem key={option} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </Select>
                      ) : currentField.type === 'radio' ? (
                        <RadioGroup
                          {...field}
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
                        />
                      ) : currentField.type === 'url' ? (
                        <StyledTextField
                          {...field}
                          type="url"
                          placeholder={currentField.placeholder || "Enter URL..."}
                          error={!!error}
                          helperText={error?.message}
                          autoFocus
                        />
                      ) : (
                        <StyledTextField
                          {...field}
                          placeholder={currentField.placeholder || "Type your answer here..."}
                          error={!!error}
                          helperText={error?.message}
                          autoFocus
                        />
                      )}
                      {/* {error && (
                        <StyledFormHelperText>{error.message}</StyledFormHelperText>
                      )} */}
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
                    type="submit"
                    variant="contained"
                    disabled={form.formState.isSubmitting}
                    sx={{
                      bgcolor: 'secondary.light',
                      color: 'primary.main',
                      fontWeight: 600,
                      '&:hover': {
                        bgcolor: 'primary.dark',
                      }
                    }}
                  >
                    {form.formState.isSubmitting ? (
                      <>
                        <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                        Please wait
                      </>
                    ) : (
                      "Submit"
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
