"use client";
import React, { useEffect, useState, useMemo } from 'react';
import { Box, Typography, Button, Stack, TextField, MenuItem, Select, Chip, Radio, RadioGroup, FormControlLabel, FormControl, IconButton, Dialog, DialogContent, Snackbar, Alert } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useRouter, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

const skillOptions = ['Agile methodologies', 'React', 'Communication', 'Leadership', 'Testing'];
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

export default function CreateAssessmentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams?.get('type');
  const [showTypeModal, setShowTypeModal] = React.useState(type === 'online_assessment_1' || type === 'online_assessment_2');
  const [typeModalSelection, setTypeModalSelection] = React.useState<string | null>(null);
  const [open, setOpen] = React.useState(true);
  const [jobTitle, setJobTitle] = React.useState('');
  const [level, setLevel] = React.useState('');
  const [skills, setSkills] = React.useState<string[]>(['Agile methodologies']);
  const [numberOfOpenTextQuestions, setNumberOfOpenTextQuestions] = React.useState('');
  const [numberOfMultiChoiceQuestions, setNumberOfMultiChoiceQuestions] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);
  const [questions, setQuestions] = React.useState<any[]>([]);
  const [showFormBuilder, setShowFormBuilder] = React.useState(false);
  const [saveLoading, setSaveLoading] = React.useState(false);
  const [saveError, setSaveError] = React.useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = React.useState(false);
  const [assessmentDescription, setAssessmentDescription] = React.useState('');
  const [editorValue, setEditorValue] = React.useState('');
  const [showTechModal, setShowTechModal] = useState(type === 'technical_assessment');
  const [value, setValue] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'font': [] }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'direction': 'rtl' }],
      [{ 'align': [] }],
      ['link', 'image', 'video', 'formula'],
      ['clean']
    ]
  }), []);

  const handleDeleteSkill = (skillToDelete: string) => {
    setSkills((skills) => skills.filter((skill) => skill !== skillToDelete));
  };

  const handleCreateAssessment = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      let token = null;
      if (typeof window !== 'undefined') {
        token = localStorage.getItem('jwt');
      }
      if (!token) throw new Error('Authentication token not found');
      const response = await fetch('https://app.elevatehr.ai/wp-json/elevatehr/v1/generate-quiz-questions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          job_title: jobTitle,
          level,
          skills: skills.join(','),
          open_text_questions: numberOfOpenTextQuestions,
          multi_choice_questions: numberOfMultiChoiceQuestions,
        }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to generate assessment');
      }
      const data = await response.json();
      if (data.status === 'success' && data.response?.questions) {
        setQuestions(data.response.questions);
        setShowFormBuilder(true);
        setOpen(false); // Close modal
      } else {
        throw new Error('Invalid response from server');
      }
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAssessment = async () => {
    setSaveLoading(true);
    setSaveError(null);
    setSaveSuccess(false);
    try {
      let token = null;
      if (typeof window !== 'undefined') {
        token = localStorage.getItem('jwt');
      }
      if (!token) throw new Error('Authentication token not found');
      const body = {
        assessment_level: level,
        assessment_type: 'online_assessment_1',
        assessment_skills: skills.join(', '),
        assessment_title: jobTitle,
        assessment_description: assessmentDescription,
        questions: questions.map(q => ({
          question: q.question,
          type: q.type,
          options: q.type === 'multi-choice' ? q.options : [],
        })),
      };
      const response = await fetch('https://app.elevatehr.ai/wp-json/elevatehr/v1/save-quiz-questions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to save assessment');
      }
      setSaveSuccess(true);
    } catch (err: any) {
      setSaveError(err.message || 'An error occurred');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleSaveTechnicalAssessment = async () => {
    try {
      let token = null;
      if (typeof window !== 'undefined') {
        token = localStorage.getItem('jwt');
      }
      if (!token) throw new Error('Authentication token not found');
      const description = `${jobTitle} (${level}) assessment covering the following skills: ${skills.join(', ')}.`;
      const body = {
        assessment_level: level,
        assessment_type: 'technical_assessment',
        assessment_skills: skills.join(', '),
        assessment_title: jobTitle,
        assessment_description: description,
        technical_assessment_content: value,
      };
      const response = await fetch('https://app.elevatehr.ai/wp-json/elevatehr/v1/save-quiz-questions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to save assessment');
      }
      setSnackbarMessage('Assessment saved successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (err: any) {
      setSnackbarMessage(err.message || 'An error occurred while saving the assessment.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  useEffect(() => {
    if (!open && !showFormBuilder) {
      router.push('/dashboard/assessments');
    }
  }, [open, showFormBuilder, router]);

  // Helper for updating a question
  const handleQuestionChange = (idx: number, field: string, value: any) => {
    setQuestions(prev => prev.map((q, i) => i === idx ? { ...q, [field]: value } : q));
  };

  // Change type and reset options if needed
  const handleTypeChange = (idx: number, newType: string) => {
    setQuestions(prev => prev.map((q, i) =>
      i === idx
        ? {
            ...q,
            type: newType,
            options: newType === 'multi-choice' ? (q.options && q.options.length ? q.options : ['']) : []
          }
        : q
    ));
  };

  // Edit multi-choice option
  const handleOptionChange = (qIdx: number, optIdx: number, value: string) => {
    setQuestions(prev => prev.map((q, i) =>
      i === qIdx
        ? { ...q, options: q.options.map((opt: string, j: number) => j === optIdx ? value : opt) }
        : q
    ));
  };

  // Add option to multi-choice
  const handleAddOption = (qIdx: number) => {
    setQuestions(prev => prev.map((q, i) =>
      i === qIdx ? { ...q, options: [...q.options, ''] } : q
    ));
  };

  // Remove option from multi-choice
  const handleRemoveOption = (qIdx: number, optIdx: number) => {
    setQuestions(prev => prev.map((q, i) =>
      i === qIdx ? { ...q, options: q.options.filter((_: string, j: number) => j !== optIdx) } : q
    ));
  };

  // Delete question
  const handleDeleteQuestion = (idx: number) => {
    setQuestions(prev => prev.filter((_, i) => i !== idx));
  };

  // Add new question
  const handleAddQuestion = () => {
    setQuestions(prev => [
      ...prev,
      { question: '', type: 'open-text', options: [] }
    ]);
  };

  if (type === 'technical_assessment') {
    if (showTechModal) {
      return (
        <Dialog open={showTechModal} onClose={() => { setShowTechModal(false); router.push('/dashboard/assessments'); }} maxWidth="md" PaperProps={{ sx: { borderRadius: '20px', p: 0 } }}>
          <DialogContent sx={{ p: { xs: 3, md: 5 }, position: 'relative', bgcolor: '#fff', minWidth: { xs: 320, md: 700 } }}>
            <IconButton onClick={() => { setShowTechModal(false); router.push('/dashboard/assessments'); }} sx={{ position: 'absolute', top: 24, right: 24, zIndex: 1 }}>
              <CloseIcon sx={{ fontSize: 28, color: 'rgba(17, 17, 17, 0.32)' }} />
            </IconButton>
            <Typography sx={{ fontWeight: 700, fontSize: 32, color: 'rgba(17, 17, 17, 0.92)', mb: 2.5 }}>
              Create Assessment
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography sx={{ fontWeight: 600, fontSize: 18, color: 'rgba(17, 17, 17, 0.92)', mb: 1 }}>
                Who is this assessment for?
              </Typography>
              <TextField
                fullWidth
                placeholder="Add job title"
                value={jobTitle}
                onChange={e => setJobTitle(e.target.value)}
                sx={{
                  bgcolor: '#F4F5F7',
                  borderRadius: '10px',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '10px',
                    fontSize: 18,
                    bgcolor: '#F4F5F7',
                  },
                  mb: 3,
                }}
                InputProps={{
                  style: { fontWeight: 400, color: 'rgba(17, 17, 17, 0.68)' }
                }}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography sx={{ fontWeight: 600, fontSize: 18, color: 'rgba(17, 17, 17, 0.92)', mb: 1 }}>
                Level
              </Typography>
              <RadioGroup row value={level} onChange={e => setLevel(e.target.value)}>
                {['Junior', 'Mid-level', 'Senior'].map(lvl => (
                  <FormControlLabel
                    key={lvl}
                    value={lvl}
                    control={<Radio sx={{ display: 'none' }} />}
                    label={
                      <Box sx={{
                        px: 4,
                        py: 2,
                        borderRadius: '12px',
                        border: level === lvl ? '2px solid #4444E2' : '1.5px solid #E4E7EC',
                        bgcolor: '#F4F5F7',
                        color: 'rgba(17, 17, 17, 0.84)',
                        fontWeight: 500,
                        fontSize: 18,
                        cursor: 'pointer',
                        transition: 'border 0.2s',
                      }}>{lvl}</Box>
                    }
                    sx={{ mr: 2, ml: 0 }}
                  />
                ))}
              </RadioGroup>
            </Box>
            <Box sx={{ mb: 2.5 }}>
              <Typography sx={{ fontWeight: 600, fontSize: 18, color: 'rgba(17, 17, 17, 0.92)', mb: 1 }}>
                What skills will you like to test them on?
              </Typography>
              <FormControl fullWidth>
                <Select
                  displayEmpty
                  value={''}
                  onChange={e => {
                    const value = e.target.value;
                    if (value && !skills.includes(value)) {
                      setSkills([...skills, value]);
                    }
                  }}
                  renderValue={() => 'Select skill'}
                  sx={{
                    bgcolor: '#F4F5F7',
                    borderRadius: '10px',
                    fontSize: 16,
                    mb: 2,
                    '& .MuiSelect-select': {
                      color: 'rgba(17, 17, 17, 0.48)',
                    },
                  }}
                >
                  <MenuItem disabled value="">
                    Select skill
                  </MenuItem>
                  {skillOptions.filter(opt => !skills.includes(opt)).map(opt => (
                    <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {skills.map(skill => (
                  <Chip
                    key={skill}
                    label={skill}
                    onDelete={() => handleDeleteSkill(skill)}
                    sx={{
                      bgcolor: '#F4F5F7',
                      color: 'rgba(17, 17, 17, 0.84)',
                      fontWeight: 500,
                      fontSize: 15,
                      borderRadius: '8px',
                    }}
                  />
                ))}
              </Box>
            </Box>
            <Button
              fullWidth
              variant="contained"
              sx={{
                bgcolor: '#4444E2',
                color: '#fff',
                fontWeight: 600,
                fontSize: 20,
                borderRadius: '12px',
                py: 1.2,
                textTransform: 'none',
                boxShadow: 'none',
                mt: 2,
                '&:hover': {
                  bgcolor: '#5656E6',
                },
              }}
              onClick={() => setShowTechModal(false)}
              disabled={!jobTitle || !level || skills.length === 0}
            >
              Continue
            </Button>
          </DialogContent>
        </Dialog>
      );
    }
    return (
      <>
        <Box
          sx={{
            width: '100%',
            maxWidth: 800,
            mx: 'auto',
            mt: '32px',
            mb: '40px',
            borderRadius: '20px',
            background: '#4444E2 url(/images/backgrounds/banner-bg.svg) no-repeat right center',
            backgroundSize: 'cover',
            p: '32px 40px',
            display: 'flex',
            alignItems: 'center',
            minHeight: 72,
          }}
        >
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: 16 }}>
            <path d="M20 8L12 16L20 24" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: 28, ml: 1 }}>
            Create Technical Assessment
          </Typography>
        </Box>
        <div style={{ maxWidth: 800, margin: '0 auto', position: 'relative' }}>
          <style>{`
            .ql-toolbar {
              top: -64px !important;
              margin-top: 0 !important;
              padding-top: 0 !important;
              width: 100% !important;
              box-sizing: border-box;
              position: relative;
              border-bottom: 1px solid #e0e0e0 !important;
              height: max-content !important;
              min-height: unset !important;
            }
            .ql-container {
              min-height: 80vh !important;
              border-top: 1px solid #ccc !important;
              margin-top: 96px !important;
            }
          `}</style>
          <ReactQuill value={value} onChange={setValue} modules={modules} />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button
              size="small"
              variant="contained"
              sx={{ fontWeight: 600, fontSize: 15, borderRadius: '8px', bgcolor: '#4444E2', '&:hover': { bgcolor: '#5656E6' } }}
              onClick={handleSaveTechnicalAssessment}
            >
              Save Assessment
            </Button>
          </Box>
        </div>
      </>
    );
  }

  return (
    <>
      {/* New Assessment Type Modal */}
      {showTypeModal && (
        <Dialog open={showTypeModal} onClose={() => { setShowTypeModal(false); router.push('/dashboard/assessments'); }} maxWidth="md" PaperProps={{ sx: { borderRadius: '20px', p: 0 } }}>
          <DialogContent sx={{ p: { xs: 3, md: 5 }, position: 'relative', bgcolor: '#fff', minWidth: { xs: 320, md: 700 } }}>
            <IconButton onClick={() => { setShowTypeModal(false); router.push('/dashboard/assessments'); }} sx={{ position: 'absolute', top: 24, right: 24, zIndex: 1 }}>
              <CloseIcon sx={{ fontSize: 28, color: 'rgba(17, 17, 17, 0.32)' }} />
            </IconButton>
            <Typography sx={{ fontWeight: 700, fontSize: 32, color: 'rgba(17, 17, 17, 0.92)', mb: 2.5 }}>
              Create Assessment
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography sx={{ fontWeight: 600, fontSize: 18, color: 'rgba(17, 17, 17, 0.92)', mb: 1 }}>
                Who is this assessment for?
              </Typography>
              <TextField
                fullWidth
                placeholder="Add job title"
                value={jobTitle}
                onChange={e => setJobTitle(e.target.value)}
                sx={{
                  bgcolor: '#F4F5F7',
                  borderRadius: '10px',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '10px',
                    fontSize: 18,
                    bgcolor: '#F4F5F7',
                  },
                  mb: 3,
                }}
                InputProps={{
                  style: { fontWeight: 400, color: 'rgba(17, 17, 17, 0.68)' }
                }}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography sx={{ fontWeight: 600, fontSize: 18, color: 'rgba(17, 17, 17, 0.92)', mb: 1 }}>
                Level
              </Typography>
              <RadioGroup row value={level} onChange={e => setLevel(e.target.value)}>
                {['Junior', 'Mid-level', 'Senior'].map(lvl => (
                  <FormControlLabel
                    key={lvl}
                    value={lvl}
                    control={<Radio sx={{ display: 'none' }} />}
                    label={
                      <Box sx={{
                        px: 4,
                        py: 2,
                        borderRadius: '12px',
                        border: level === lvl ? '2px solid #4444E2' : '1.5px solid #E4E7EC',
                        bgcolor: '#F4F5F7',
                        color: 'rgba(17, 17, 17, 0.84)',
                        fontWeight: 500,
                        fontSize: 18,
                        cursor: 'pointer',
                        transition: 'border 0.2s',
                      }}>{lvl}</Box>
                    }
                    sx={{ mr: 2, ml: 0 }}
                  />
                ))}
              </RadioGroup>
            </Box>
            <Box sx={{ mb: 2.5 }}>
              <Typography sx={{ fontWeight: 600, fontSize: 18, color: 'rgba(17, 17, 17, 0.92)', mb: 1 }}>
                What skills will you like to test them on?
              </Typography>
              <FormControl fullWidth>
                <Select
                  displayEmpty
                  value={''}
                  onChange={e => {
                    const value = e.target.value;
                    if (value && !skills.includes(value)) {
                      setSkills([...skills, value]);
                    }
                  }}
                  renderValue={() => 'Select skill'}
                  sx={{
                    bgcolor: '#F4F5F7',
                    borderRadius: '10px',
                    fontSize: 16,
                    mb: 2,
                    '& .MuiSelect-select': {
                      color: 'rgba(17, 17, 17, 0.48)',
                    },
                  }}
                >
                  <MenuItem disabled value="">
                    Select skill
                  </MenuItem>
                  {skillOptions.filter(opt => !skills.includes(opt)).map(opt => (
                    <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {skills.map(skill => (
                  <Chip
                    key={skill}
                    label={skill}
                    onDelete={() => handleDeleteSkill(skill)}
                    sx={{
                      bgcolor: '#F4F5F7',
                      color: 'rgba(17, 17, 17, 0.84)',
                      fontWeight: 500,
                      fontSize: 15,
                      borderRadius: '8px',
                    }}
                  />
                ))}
              </Box>
            </Box>
            {/* Only show these fields if not technical_assessment */}
            {type !== 'technical_assessment' && (
              <>
                <Box sx={{ mb: 2 }}>
                  <Typography sx={{ fontWeight: 600, fontSize: 18, color: 'rgba(17, 17, 17, 0.92)', mb: 1 }}>
                    Number of open text questions
                  </Typography>
                  <TextField
                    fullWidth
                    type="number"
                    placeholder="Enter number"
                    value={numberOfOpenTextQuestions}
                    onChange={e => setNumberOfOpenTextQuestions(e.target.value)}
                    sx={{
                      bgcolor: '#F4F5F7',
                      borderRadius: '10px',
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '10px',
                        fontSize: 16,
                        bgcolor: '#F4F5F7',
                        py: 1.2,
                      },
                    }}
                    InputProps={{
                      style: { fontWeight: 400, color: 'rgba(17, 17, 17, 0.68)' }
                    }}
                  />
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography sx={{ fontWeight: 600, fontSize: 18, color: 'rgba(17, 17, 17, 0.92)', mb: 1 }}>
                    Number of multi-choice questions
                  </Typography>
                  <TextField
                    fullWidth
                    type="number"
                    placeholder="Enter number"
                    value={numberOfMultiChoiceQuestions}
                    onChange={e => setNumberOfMultiChoiceQuestions(e.target.value)}
                    sx={{
                      bgcolor: '#F4F5F7',
                      borderRadius: '10px',
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '10px',
                        fontSize: 16,
                        bgcolor: '#F4F5F7',
                        py: 1.2,
                      },
                    }}
                    InputProps={{
                      style: { fontWeight: 400, color: 'rgba(17, 17, 17, 0.68)' }
                    }}
                  />
                </Box>
              </>
            )}
            {error && (
              <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>
            )}
            {success && (
              <Typography color="success.main" sx={{ mb: 2 }}>Assessment generated successfully!</Typography>
            )}
            <Button
              fullWidth
              variant="contained"
              sx={{
                bgcolor: '#4444E2',
                color: '#fff',
                fontWeight: 600,
                fontSize: 20,
                borderRadius: '12px',
                py: 1.2,
                textTransform: 'none',
                boxShadow: 'none',
                mt: 2,
                '&:hover': {
                  bgcolor: '#5656E6',
                },
              }}
              onClick={handleCreateAssessment}
              disabled={loading}
            >
              {loading ? 'Generating...' : 'Create Assessment'}
            </Button>
          </DialogContent>
        </Dialog>
      )}
      {!showFormBuilder && !showTypeModal && (
        <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" PaperProps={{ sx: { borderRadius: '20px', p: 0 } }}>
          <DialogContent sx={{
            p: { xs: 1.5, md: 3 },
            position: 'relative',
            bgcolor: '#fff',
            minWidth: { xs: 320, md: 500 },
            maxHeight: '80vh',
            overflowY: 'auto',
            '&::-webkit-scrollbar': {
              width: '5px',
              background: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#E4E7EC',
              borderRadius: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: 'transparent',
            },
            scrollbarWidth: '2px',
            scrollbarColor: '#E4E7EC transparent',
          }}>
            <IconButton onClick={() => setOpen(false)} sx={{ position: 'absolute', top: 24, right: 24, zIndex: 1 }}>
              <CloseIcon sx={{ fontSize: 28, color: 'rgba(17, 17, 17, 0.32)' }} />
            </IconButton>
            <Typography sx={{ fontWeight: 700, fontSize: 32, color: 'rgba(17, 17, 17, 0.92)', mb: 2.5 }}>
              Create Assessment
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography sx={{ fontWeight: 600, fontSize: 18, color: 'rgba(17, 17, 17, 0.92)', mb: 1 }}>
                Who is this assessment for?
              </Typography>
              <TextField
                fullWidth
                placeholder="Add job title"
                value={jobTitle}
                onChange={e => setJobTitle(e.target.value)}
                sx={{
                  bgcolor: '#F4F5F7',
                  borderRadius: '10px',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '10px',
                    fontSize: 18,
                    bgcolor: '#F4F5F7',
                  },
                  mb: 3,
                }}
                InputProps={{
                  style: { fontWeight: 400, color: 'rgba(17, 17, 17, 0.68)' }
                }}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography sx={{ fontWeight: 600, fontSize: 18, color: 'rgba(17, 17, 17, 0.92)', mb: 1 }}>
                Level
              </Typography>
              <RadioGroup row value={level} onChange={e => setLevel(e.target.value)}>
                {['Junior', 'Mid-level', 'Senior'].map(lvl => (
                  <FormControlLabel
                    key={lvl}
                    value={lvl}
                    control={<Radio sx={{ display: 'none' }} />}
                    label={
                      <Box sx={{
                        px: 4,
                        py: 2,
                        borderRadius: '12px',
                        border: level === lvl ? '2px solid #4444E2' : '1.5px solid #E4E7EC',
                        bgcolor: '#F4F5F7',
                        color: 'rgba(17, 17, 17, 0.84)',
                        fontWeight: 500,
                        fontSize: 18,
                        cursor: 'pointer',
                        transition: 'border 0.2s',
                      }}>{lvl}</Box>
                    }
                    sx={{ mr: 2, ml: 0 }}
                  />
                ))}
              </RadioGroup>
            </Box>
            <Box sx={{ mb: 2.5 }}>
              <Typography sx={{ fontWeight: 600, fontSize: 18, color: 'rgba(17, 17, 17, 0.92)', mb: 1 }}>
                What skills will you like to test them on?
              </Typography>
              <FormControl fullWidth>
                <Select
                  displayEmpty
                  value={''}
                  onChange={e => {
                    const value = e.target.value;
                    if (value && !skills.includes(value)) {
                      setSkills([...skills, value]);
                    }
                  }}
                  renderValue={() => 'Select skill'}
                  sx={{
                    bgcolor: '#F4F5F7',
                    borderRadius: '10px',
                    fontSize: 16,
                    mb: 2,
                    '& .MuiSelect-select': {
                      color: 'rgba(17, 17, 17, 0.48)',
                    },
                  }}
                >
                  <MenuItem disabled value="">
                    Select skill
                  </MenuItem>
                  {skillOptions.filter(opt => !skills.includes(opt)).map(opt => (
                    <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {skills.map(skill => (
                  <Chip
                    key={skill}
                    label={skill}
                    onDelete={() => handleDeleteSkill(skill)}
                    sx={{
                      bgcolor: '#F4F5F7',
                      color: 'rgba(17, 17, 17, 0.84)',
                      fontWeight: 500,
                      fontSize: 15,
                      borderRadius: '8px',
                    }}
                  />
                ))}
              </Box>
            </Box>
            {/* Number of open text questions */}
            <Box sx={{ mb: 2 }}>
              <Typography sx={{ fontWeight: 600, fontSize: 18, color: 'rgba(17, 17, 17, 0.92)', mb: 1 }}>
                Number of open text questions
              </Typography>
              <TextField
                fullWidth
                type="number"
                placeholder="Enter number"
                value={numberOfOpenTextQuestions}
                onChange={e => setNumberOfOpenTextQuestions(e.target.value)}
                sx={{
                  bgcolor: '#F4F5F7',
                  borderRadius: '10px',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '10px',
                    fontSize: 16,
                    bgcolor: '#F4F5F7',
                    py: 1.2,
                  },
                }}
                InputProps={{
                  style: { fontWeight: 400, color: 'rgba(17, 17, 17, 0.68)' }
                }}
              />
            </Box>
            {/* Number of multi-choice questions */}
            <Box sx={{ mb: 2 }}>
              <Typography sx={{ fontWeight: 600, fontSize: 18, color: 'rgba(17, 17, 17, 0.92)', mb: 1 }}>
                Number of multi-choice questions
              </Typography>
              <TextField
                fullWidth
                type="number"
                placeholder="Enter number"
                value={numberOfMultiChoiceQuestions}
                onChange={e => setNumberOfMultiChoiceQuestions(e.target.value)}
                sx={{
                  bgcolor: '#F4F5F7',
                  borderRadius: '10px',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '10px',
                    fontSize: 16,
                    bgcolor: '#F4F5F7',
                    py: 1.2,
                  },
                }}
                InputProps={{
                  style: { fontWeight: 400, color: 'rgba(17, 17, 17, 0.68)' }
                }}
              />
            </Box>
            {error && (
              <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>
            )}
            {success && (
              <Typography color="success.main" sx={{ mb: 2 }}>Assessment generated successfully!</Typography>
            )}
            <Button
              fullWidth
              variant="contained"
              sx={{
                bgcolor: '#4444E2',
                color: '#fff',
                fontWeight: 600,
                fontSize: 20,
                borderRadius: '12px',
                py: 1.2,
                textTransform: 'none',
                boxShadow: 'none',
                mt: 2,
                '&:hover': {
                  bgcolor: '#5656E6',
                },
              }}
              onClick={handleCreateAssessment}
              disabled={loading}
            >
              {loading ? 'Generating...' : 'Create Assessment'}
            </Button>
          </DialogContent>
        </Dialog>
      )}
      {showFormBuilder && (
        <Box sx={{ maxWidth: 900, mx: 'auto', mt: 4, mb: 4 }}>
          {/* Header Section */}
          <Box sx={{ bgcolor: '#fff', borderRadius: '16px', p: { xs: 2, md: 4 }, mb: 3, boxShadow: '0 2px 8px 0 rgba(68,68,226,0.04)' }}>
            <Stack direction="row" alignItems="center" spacing={2} mb={2}>
              <Chip label={level} sx={{ bgcolor: '#F9E0FA', color: 'rgba(79, 27, 85, 0.84)', fontWeight: 600, fontSize: 16, borderRadius: '20px', height: 32 }} />
              <Typography variant="h5" sx={{ fontWeight: 700, color: 'rgba(17, 17, 17, 0.92)' }}>
                {jobTitle || 'Assessment Title'}
              </Typography>
            </Stack>
            <TextField
              fullWidth
              multiline
              minRows={2}
              maxRows={4}
              value={assessmentDescription}
              onChange={e => setAssessmentDescription(e.target.value)}
              placeholder="Enter assessment description"
              sx={{ mb: 2, bgcolor: '#F6F7FB', borderRadius: '8px' }}
            />
          </Box>
          {/* Questions Section */}
          <Box sx={{ bgcolor: '#fff', borderRadius: '16px', p: { xs: 2, md: 4 }, mb: 3 }}>
            {questions.map((q, idx) => (
              <Box key={idx} sx={{ mb: 2, border: '1px solid #EEEFF2', borderRadius: '12px', p: 2, position: 'relative' }}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="flex-start" justifyContent="space-between">
                  <Box sx={{ flex: 1 }}>
                    <TextField
                      fullWidth
                      value={q.question}
                      onChange={e => handleQuestionChange(idx, 'question', e.target.value)}
                      placeholder="Enter question text"
                      sx={{ mb: 1, fontWeight: 500, fontSize: 16, color: 'rgba(17, 17, 17, 0.92)' }}
                    />
                    {q.type === 'open-text' ? (
                      <TextField fullWidth disabled placeholder="Response field" sx={{ bgcolor: '#F6F7FB', borderRadius: '8px' }} />
                    ) : (
                      <Box>
                        {q.options && q.options.map((opt: string, i: number) => (
                          <Box key={i} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <TextField
                              value={opt}
                              onChange={e => handleOptionChange(idx, i, e.target.value)}
                              placeholder={`Option ${i + 1}`}
                              size="small"
                              sx={{ mr: 1, bgcolor: '#F6F7FB', borderRadius: '8px', flex: 1 }}
                            />
                            <IconButton size="small" onClick={() => handleRemoveOption(idx, i)} disabled={q.options.length <= 1}>
                              <CloseIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        ))}
                        <Button size="small" variant="text" onClick={() => handleAddOption(idx)} sx={{ color: '#4444E2', fontWeight: 600, ml: 0.5 }}>
                          + Add Option
                        </Button>
                      </Box>
                    )}
                  </Box>
                  <Box sx={{ minWidth: 180, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
                    <Select value={q.type} size="small" onChange={e => handleTypeChange(idx, e.target.value)} sx={{ minWidth: 120, mb: 1 }}>
                      <MenuItem value="open-text">Open question</MenuItem>
                      <MenuItem value="multi-choice">Multi choice</MenuItem>
                    </Select>
                    <IconButton size="small" onClick={() => handleDeleteQuestion(idx)}>
                      <CloseIcon />
                    </IconButton>
                  </Box>
                </Stack>
              </Box>
            ))}
            <Button variant="outlined" sx={{ mt: 2, borderRadius: '8px', fontWeight: 600, color: '#4444E2' }} onClick={handleAddQuestion}>
              + Add Question
            </Button>
          </Box>
          {saveError && <Typography color="error" sx={{ mb: 2 }}>{saveError}</Typography>}
          {saveSuccess && <Typography color="success.main" sx={{ mb: 2 }}>Assessment saved successfully!</Typography>}
          <Button
            variant="contained"
            sx={{ borderRadius: '8px', fontWeight: 600, px: 4, py: 1.5, bgcolor: '#4444E2', '&:hover': { bgcolor: '#5656E6' } }}
            onClick={handleSaveAssessment}
            disabled={saveLoading}
          >
            {saveLoading ? 'Saving...' : 'Create Assessment'}
          </Button>
        </Box>
      )}
      <Snackbar open={snackbarOpen} autoHideDuration={4000} onClose={() => setSnackbarOpen(false)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
} 