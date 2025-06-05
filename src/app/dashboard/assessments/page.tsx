"use client";
import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Grid, Card, Stack, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useTheme } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import { useRouter } from 'next/navigation';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import Skeleton from '@mui/material/Skeleton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';

const ELEVATE_BASE_URL = 'https://app.elevatehr.ai/';

export interface Assessment {
  id: string;
  level: string;
  color?: string;
  textColor?: string;
  title: string;
  description: string;
  responses?: number;
  duration?: string;
}

export default function AssessmentsPage() {
  const theme = useTheme();
  const [openNewAssessment, setOpenNewAssessment] = React.useState(false);
  const [openCreateAssessment, setOpenCreateAssessment] = React.useState(false);
  const [jobTitle, setJobTitle] = React.useState('');
  const [level, setLevel] = React.useState('');
  const [skills, setSkills] = React.useState<string[]>(['Agile methodologies']);
  const [skillInput, setSkillInput] = React.useState('');
  const skillOptions = ['Agile methodologies', 'React', 'Communication', 'Leadership', 'Testing'];
  const [numberOfOpenTextQuestions, setNumberOfOpenTextQuestions] = React.useState('');
  const [numberOfMultiChoiceQuestions, setNumberOfMultiChoiceQuestions] = React.useState('');
  const router = useRouter();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectTypeOpen, setSelectTypeOpen] = useState(false);
  const [selectedType, setSelectedType] = useState('technical_assessment');

  const handleAddSkill = (event: any) => {
    const value = event.target.value;
    if (value && !skills.includes(value)) {
      setSkills([...skills, value]);
    }
    setSkillInput('');
  };

  const handleDeleteSkill = (skillToDelete: string) => {
    setSkills((skills) => skills.filter((skill) => skill !== skillToDelete));
  };

  useEffect(() => {
    const fetchAssessments = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('jwt');
        if (!token) throw new Error('Authentication token not found');
        const response = await fetch(`${ELEVATE_BASE_URL}wp-json/elevatehr/v1/quiz-assessments`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch assessments');
        }
        const data = await response.json();
        if (data.code === 'invalid_assessments') {
          setAssessments([]);
        } else {
          setAssessments(data.assessments || data);
        }
      } catch (err: any) {
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    fetchAssessments();
  }, []);

  return (
    <Box sx={{ bgcolor: '#F6F7FB', minHeight: '100vh', p: { xs: 1, md: 4 } }}>
      {/* Banner */}
      <Box
        sx={{
          backgroundColor: `#4444E2`,
          background: '#4444E2 url(/images/backgrounds/banner-bg.svg) no-repeat right center',
          backgroundSize: 'cover',
          borderRadius: '12px',
          p: { xs: 3, md: 4 },
          mb: 5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
        }}
      >
        <Typography variant="h5" sx={{ color: '#fff', fontWeight: 700, fontSize: { xs: 20, md: 24 } }}>
          Assessments
        </Typography>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: { xs: 2, md: 0 } }}>
          <TextField
            placeholder="Search"
            size="small"
            sx={{
              '& fieldset': {
                border:'none !important',
              },
              '& .MuiInputBase-input::placeholder': {
                color: 'rgba(255, 255, 255)',
                opacity: 0.84,
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'rgba(255, 255, 255, 0.84)' }} />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            sx={{
              bgcolor: '#fff',
              color: 'rgba(17, 17, 17, 0.92)',
              fontSize: '16px',
              fontStyle: 'normal',
              fontWeight: 500,
              lineHeight: '100%',
              letterSpacing: '0.16px',
              borderRadius: '8px',
              boxShadow: 'none',
              px: 3,
              py: 1.5,
              textTransform: 'none',
              '&:hover': {
                bgcolor: '#F4F4FF',
              },
            }}
            onClick={() => setSelectTypeOpen(true)}
          >
            + New Assessment
          </Button>
        </Stack>
      </Box>
      {/* No error message for failed to fetch assessments */}
      {loading ? (
        <Grid container spacing={3}>
          {Array.from({ length: 8 }).map((_, idx) => (
            <Grid item xs={12} sm={6} md={3} key={idx}>
              <Box sx={{ p: 3, borderRadius: '12px', bgcolor: '#fff', border: '1px solid #E4E7EC', minHeight: 220 }}>
                <Skeleton variant="rectangular" width="100%" height={32} sx={{ borderRadius: '20px', mb: 2 }} />
                <Skeleton variant="text" width="80%" height={32} sx={{ mb: 1 }} />
                <Skeleton variant="text" width="100%" height={20} sx={{ mb: 1 }} />
                <Skeleton variant="text" width="60%" height={16} sx={{ mb: 2 }} />
                <Skeleton variant="rectangular" width={100} height={24} sx={{ borderRadius: '20px', mt: 'auto' }} />
              </Box>
            </Grid>
          ))}
        </Grid>
      ) : assessments.length === 0 ? (
        <Box sx={{ textAlign: 'center', mt: 10, color: 'rgba(17, 17, 17, 0.48)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <AssignmentOutlinedIcon sx={{ fontSize: 64, color: '#D6D6F6', mb: 3 }} />
          <Typography sx={{ fontSize: 24, fontWeight: 500, color: 'rgba(17, 17, 17, 0.48)' }}>
            Your assessments will appear here
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {assessments.map((a, idx) => (
            <Grid item xs={12} sm={6} md={3} key={a.id || idx}>
              <Card
                sx={{
                  p: 3,
                  borderRadius: '12px',
                  boxShadow: 'none',
                  bgcolor: '#fff',
                  border: '1px solid #E4E7EC',
                  minHeight: 220,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 0.5,
                  transition: 'box-shadow 0.2s',
                }}
              >
                {/* Custom Badge */}
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    bgcolor: a.color,
                    borderRadius: '20px',
                    px: '12px',
                    py: '6px',
                    mb: 1.5,
                    height: 32,
                    minWidth: 0,
                    width: 'max-content',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', height: 20 }}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2.5 18.3333H17.5" stroke={a.level === 'Senior' ? 'rgba(79, 27, 85, 0.72)' : a.level === 'Junior' ? 'rgba(125, 88, 15, 0.72)' : a.level === 'Mid-level' ? 'rgba(36, 115, 127, 0.72)' : '#4F1B55'} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M4.66665 6.98315H3.33333C2.875 6.98315 2.5 7.35815 2.5 7.81649V14.9998C2.5 15.4582 2.875 15.8332 3.33333 15.8332H4.66665C5.12498 15.8332 5.49998 15.4582 5.49998 14.9998V7.81649C5.49998 7.35815 5.12498 6.98315 4.66665 6.98315Z" stroke={a.level === 'Senior' ? 'rgba(79, 27, 85, 0.72)' : a.level === 'Junior' ? 'rgba(125, 88, 15, 0.72)' : a.level === 'Mid-level' ? 'rgba(36, 115, 127, 0.72)' : '#4F1B55'} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M10.6666 4.32495H9.33333C8.875 4.32495 8.5 4.69995 8.5 5.15828V14.9999C8.5 15.4583 8.875 15.8333 9.33333 15.8333H10.6666C11.125 15.8333 11.5 15.4583 11.5 14.9999V5.15828C11.5 4.69995 11.125 4.32495 10.6666 4.32495Z" stroke={a.level === 'Senior' ? 'rgba(79, 27, 85, 0.72)' : a.level === 'Junior' ? 'rgba(125, 88, 15, 0.72)' : a.level === 'Mid-level' ? 'rgba(36, 115, 127, 0.72)' : '#4F1B55'} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M16.6666 1.66675H15.3333C14.875 1.66675 14.5 2.04175 14.5 2.50008V15.0001C14.5 15.4584 14.875 15.8334 15.3333 15.8334H16.6666C17.125 15.8334 17.5 15.4584 17.5 15.0001V2.50008C17.5 2.04175 17.125 1.66675 16.6666 1.66675Z" stroke={a.level === 'Senior' ? 'rgba(79, 27, 85, 0.72)' : a.level === 'Junior' ? 'rgba(125, 88, 15, 0.72)' : a.level === 'Mid-level' ? 'rgba(36, 115, 127, 0.72)' : '#4F1B55'} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Box>
                  <Typography sx={{ color: a.level === 'Junior' ? 'rgba(125, 88, 15, 0.84)' : a.level === 'Mid-level' ? 'rgba(36, 115, 127, 0.72)' : a.textColor, fontWeight: 600, fontSize: 16, ml: 0.5, mr: 0.5, lineHeight: 1 }}>
                    {a.level}
                  </Typography>
                </Box>
                <Typography 
                  variant="subtitle1" 
                  sx={{
                    fontWeight: 600,
                    fontSize: '20px',
                    fontStyle: 'normal',
                    color: 'rgba(17, 17, 17, 0.92)',
                    lineHeight: '120%', // 24px
                    letterSpacing: '0.1px',
                    mb: 0.5,
                    leadingTrim: 'both',
                    textEdge: 'cap',
                    maxWidth: '280px',
                  }}
                >
                  {a.title}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{
                    color: 'rgba(17, 17, 17, 0.84)',
                    fontSize: '14px',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    lineHeight: '138%',
                    letterSpacing: '0.14px',
                    mb: 1,
                  }}
                >
                  {a.description}
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{
                    color: 'rgba(17, 17, 17, 0.68)',
                    fontSize: '12px',
                    fontStyle: 'normal',
                    fontWeight: 600,
                    lineHeight: '100%', // 12px
                    letterSpacing: '0.12px',
                    mb: 1,
                    textTransform: 'uppercase',
                  }}
                >
                  {a.responses} RESPONSES
                </Typography>
                {/* Duration pill */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    bgcolor: '#EEEFF2',
                    borderRadius: '20px',
                    px: '16px',
                    py: '6px',
                    width: 'max-content',
                    gap: '8px',
                    mt: 'auto',
                    mb: 0.5,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', height: 20 }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M18.3337 10.0001C18.3337 14.6001 14.6003 18.3334 10.0003 18.3334C5.40033 18.3334 1.66699 14.6001 1.66699 10.0001C1.66699 5.40008 5.40033 1.66675 10.0003 1.66675C14.6003 1.66675 18.3337 5.40008 18.3337 10.0001Z" stroke="#111111" stroke-opacity="0.84" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M13.0914 12.65L10.5081 11.1083C10.0581 10.8416 9.69141 10.2 9.69141 9.67497V6.2583" stroke="#111111" stroke-opacity="0.84" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </Box>
                  <Typography sx={{
                    color: 'rgba(17, 17, 17, 0.84)',
                  //   fontFamily: 'Outfit',
                    fontSize: '14px',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    lineHeight: '100%', // 14px
                    letterSpacing: '0.14px',
                    leadingTrim: 'both',
                    textEdge: 'cap',
                  }}>
                    {a.duration}
                  </Typography>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      {/* New Assessment Modal */}
      <Dialog open={selectTypeOpen} onClose={() => setSelectTypeOpen(false)} maxWidth="xs" PaperProps={{ sx: { borderRadius: '20px', p: 0, bgcolor: '#fff' } }}>
        <DialogContent sx={{ p: { xs: 3, md: 4 }, position: 'relative', bgcolor: '#fff', minWidth: { xs: 320, md: 400 } }}>
          <Typography sx={{ fontWeight: 700, fontSize: 20, color: 'rgba(17, 17, 17, 0.92)', mb: 3, textAlign: 'left' }}>
            Select Assessment Type
          </Typography>
          <Select
            value={selectedType}
            onChange={e => setSelectedType(e.target.value)}
            fullWidth
            displayEmpty
            sx={{
              mb: 3,
              bgcolor: '#F6F7FB',
              borderRadius: '10px',
              fontWeight: 500,
              fontSize: 16,
              '& .MuiSelect-select': {
                color: 'rgba(17, 17, 17, 0.92)',
                fontWeight: 500,
                fontSize: 16,
                py: 2,
              },
            }}
          >
            <MenuItem value="technical_assessment" sx={{ fontWeight: 400, fontSize: 15 }}>Technical assessment</MenuItem>
            <MenuItem value="online_assessment_1" sx={{ fontWeight: 400, fontSize: 15 }}>Online assessment 1</MenuItem>
            <MenuItem value="online_assessment_2" sx={{ fontWeight: 400, fontSize: 15 }}>Online assessment 2</MenuItem>
          </Select>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
            <Button
              variant="outlined"
              onClick={() => setSelectTypeOpen(false)}
              color="inherit"
              sx={{ fontWeight: 500, fontSize: 16, borderRadius: '8px', px: 3, py: 1 }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                setSelectTypeOpen(false);
                router.push(`/dashboard/assessments/new?type=${selectedType}`);
              }}
              sx={{ fontWeight: 600, fontSize: 16, borderRadius: '8px', px: 3, py: 1, bgcolor: '#4444E2', '&:hover': { bgcolor: '#5656E6' } }}
            >
              Continue
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
} 