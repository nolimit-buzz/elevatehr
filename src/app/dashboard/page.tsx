'use client';
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Paper,
  DialogActions,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Stack,
  Typography,
  styled,
  SvgIcon,
  Grid,
  Box,
  IconButton,
  InputBase,
  FormControl,
  InputLabel,
  CircularProgress,
  Skeleton
} from '@mui/material';
import DashboardSkeleton from './components/DashboardSkeleton';
import CloseIcon from "@mui/icons-material/Close";
import PageContainer from '@/app/dashboard/components/container/PageContainer';
import JobPostings from '@/app/dashboard/components/dashboard/JobPostings';
import theme from '@/utils/theme';
import DashboardCard from './components/shared/DashboardCard';
import Notifications from './components/dashboard/Notifications';
import EmailTemplates from './components/dashboard/EmailTemplates';
import { useRouter } from 'next/navigation';

const statCards = [
  {
    icon: (
      <SvgIcon>
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="32" height="32" rx="16" fill="#1CC47E" />
          <path d="M11.8335 11.8335L20.1668 20.1668" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M20.1667 13.5L20.1667 20.1667L13.5 20.1667" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </SvgIcon>
    ),
    id: 'new',
    title: "Applicants",
    value: 0, // Will be updated with fetched data
  },
  {
    icon: (
      <SvgIcon>
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="32" height="32" rx="16" fill="#5656E6" />
          <path d="M15.1667 22.25H23.5001" stroke="white" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M15.1667 16.4167H23.5001" stroke="white" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M15.1667 10.5833H23.5001" stroke="white" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M8.5 10.5834L9.33333 11.4167L11.8333 8.91675" stroke="white" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M8.5 16.4167L9.33333 17.25L11.8333 14.75" stroke="white" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M8.5 22.2499L9.33333 23.0833L11.8333 20.5833" stroke="white" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </SvgIcon>
    ),
    id: 'skill_assessment',
    title: "Skill Assessment",
    value: 0, // Will be updated with fetched data
  },
  {
    icon: (
      <SvgIcon>
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="32" height="32" rx="16" fill="#FD8535" />
          <path d="M16.4417 23.0167H11.1751C8.54175 23.0167 7.6667 21.2667 7.6667 19.5084V12.4917C7.6667 9.8584 8.54175 8.9834 11.1751 8.9834H16.4417C19.0751 8.9834 19.9501 9.8584 19.9501 12.4917V19.5084C19.9501 22.1417 19.0667 23.0167 16.4417 23.0167Z" stroke="white" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M22.2666 20.2499L19.95 18.6249V13.3665L22.2666 11.7415C23.4 10.9499 24.3333 11.4332 24.3333 12.8249V19.1749C24.3333 20.5665 23.4 21.0499 22.2666 20.2499Z" stroke="white" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M15.5833 15.1667C16.2736 15.1667 16.8333 14.6071 16.8333 13.9167C16.8333 13.2264 16.2736 12.6667 15.5833 12.6667C14.8929 12.6667 14.3333 13.2264 14.3333 13.9167C14.3333 14.6071 14.8929 15.1667 15.5833 15.1667Z" stroke="white" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </SvgIcon>
    ),
    id: 'interviews',
    title: "Interviews",
    value: 0, // Will be updated with fetched data
  },
  {
    icon: (
      <SvgIcon>
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="32" height="32" rx="16" fill="#D834DE" />
          <path d="M13.7083 13.5417C15.1916 14.0834 16.8083 14.0834 18.2916 13.5417" stroke="white" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M20.0166 7.66675H11.9833C10.2083 7.66675 8.7666 9.11675 8.7666 10.8834V22.6251C8.7666 24.1251 9.8416 24.7584 11.1583 24.0334L15.2249 21.7751C15.6583 21.5334 16.3583 21.5334 16.7833 21.7751L20.8499 24.0334C22.1666 24.7665 23.2416 24.1334 23.2416 22.6251V10.8834C23.2416 9.11675 21.7916 7.66675 20.0166 7.66675Z" stroke="white" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </SvgIcon>
    ),
    id: 'archived',
    title: "Archived",
    value: 0, // Will be updated with fetched data
  },
  {
    icon: (
      <SvgIcon>
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="32" height="32" rx="16" fill="#35B0FD" />
          <path d="M18.0332 21.8751L19.2999 23.1417L21.8332 20.6084" stroke="white" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M16.1334 15.0584C16.0501 15.0501 15.9501 15.0501 15.8584 15.0584C13.875 14.9917 12.3001 13.3667 12.3001 11.3667C12.3001 9.32508 13.9501 7.66675 15.9917 7.66675C18.0334 7.66675 19.7001 9.32508 19.7001 11.3667C19.7001 13.3667 18.1084 14.9917 16.1334 15.0584Z" stroke="white" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M15.9917 24.1751C14.475 24.1751 12.9667 23.7917 11.8167 23.0251C10.8083 22.6751 10.8083 21.5334 11.825 20.1834L15.9917 16.1334C16.0084 15.9917 16.85 15.9917 17.3834 16.1334L20.8499 19.1749C23.2417 21.5665 24.3333 22.1417 24.3333 20.6251V10.8834C24.3333 9.12508 23.2417 7.66675 20.8499 7.66675H11.1583C8.76667 7.66675 7.66667 9.12508 7.66667 11.3667C7.66667 13.3667 8.76667 14.9917 11.1583 15.0584Z" stroke="white" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </SvgIcon>
    ),
    id: 'acceptance',
    title: "Acceptance",
    value: 0, // Will be updated with fetched data
  },
  {
    icon: (
      <SvgIcon>
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="32" height="32" rx="16" fill="#FDBD0D" />
          <path d="M21.3417 21.0752L18.9917 23.4252" stroke="white" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M21.3417 23.4252L18.9917 21.0752" stroke="white" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M16.1334 15.0584C16.05 15.0501 15.95 15.0501 15.8584 15.0584C13.875 14.9917 12.3 13.3667 12.3 11.3667C12.3 9.32508 13.95 7.66675 16 7.66675C18.0417 7.66675 19.7 9.32508 19.7 11.3667C19.7 13.3667 18.1167 14.9917 16.1334 15.0584Z" stroke="white" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M16 24.1751C14.4833 24.1751 12.975 23.7917 11.825 23.0251C10.8167 22.6751 10.8167 21.5334 11.8334 20.1834L16 16.1334C16.0167 15.9917 16.85 15.9917 17.3834 16.1334L20.8499 19.1749C23.2417 21.5665 24.3333 22.1417 24.3333 20.6251V10.8834C24.3333 9.12508 23.2417 7.66675 20.8499 7.66675H11.1583C8.76667 7.66675 7.66667 9.12508 7.66667 11.3667C7.66667 13.3667 8.76667 14.9917 11.1583 15.0584Z" stroke="white" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </SvgIcon>
    ),
    id: 'rejection',
    title: "Rejected",
    value: 0, // Will be updated with fetched data
  },
];

const ToolbarStyled = styled(Stack)(({ theme }) => ({
  width: "100%",
  color: theme.palette.text.secondary,
  display: "flex",
  justifyContent: "space-between",
  marginBottom: theme.spacing(3),
  marginTop:'40px'
}));

const Greeting = styled(Typography)(({ theme }) => ({
  color: theme.palette.grey[100],
  fontFamily: theme.typography.fontFamily,
  fontWeight: theme.typography.fontWeightBold,
  fontSize: theme.typography.pxToRem(24),
}));

const PrimaryButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#032B44",
  borderRadius: "8px",
  display: 'flex',
  alignItems: 'center',
  gap: '5px',
  padding: '10px 20px',
  fontSize: theme.typography.pxToRem(16),
  color: "rgba(205, 247, 235, 0.92)",
  fontWeight: theme.typography.fontWeightMedium,
  height: '52px',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));

const StyledRadioGroup = styled(RadioGroup)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  gap: '10px', // Adjusted gap between radio buttons
  padding: '16px 60px 16px 16px',
}));

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    width: '520px',
    height: '666px',
    flexShrink: 0,
    borderRadius: '8px',
    background: '#FFF',
    padding: '32px'
  },
}));

const StyledFormControlLabel = styled(FormControlLabel)(({ theme }) => ({
  display: 'flex',
  height: '48px',
  alignItems: 'center',
  gap: '8px',
  borderRadius: '6px',
  border: '0.5px solid #D7DAE0',
  background: '#F3F4F7',
  padding: '16px',
  minWidth: '145px',
  '& span': {
    padding: '0px',
  },
}));

const StyledRadio = styled(Radio)(({ theme }) => ({
  '& .MuiSvgIcon-root': {
    opacity: 0.68,
    width: '16px',
    height: '16px',
    aspectRatio: '1 / 1',
    borderColor: 'rgba(17, 17, 17, 0.84)'
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  display: 'flex',
  width: '456px',
  padding: '16px 24px',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '6px',
  borderRadius: '8px',
  background: '#4444E2',
  color: '#FFF',
  '&:hover': {
    background: '#3333B3',
  },
}));

interface StatCardProps {
  card: {
    icon: React.ReactNode;
    id: string;
    title: string;
    value: number;
  };
  index: number;
  length: number;
}

const StatCard = ({ card, index, length }: StatCardProps) => (
  <Grid item xs={2}>
    <DashboardCard customStyle={{ borderRadius: index === 0 ? '10px 0 0 10px' : (index === length - 1 ? '0 10px 10px 0' : '0px'), borderRight: index < length - 1 ? '1px solid rgba(17,17,17,0.12)' : 'none', padding: '30px', }}>
      <Stack>
        {card.icon}
        <Typography variant="h3" fontSize={'34px'} color='rgba(17,17,17,0.92)' marginTop={'20px'} marginBottom={'10px'} fontWeight="700">
          {card.value?.toLocaleString()}
        </Typography>
        <Typography variant="subtitle2" fontSize="16px" color="rgba(17,17,17,0.62)">
          {card.title}
        </Typography>
      </Stack>
    </DashboardCard>
  </Grid>
);

const Dashboard = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true); // State to track loading
  const [jobPostings, setJobPostings] = useState([]);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'closed'>('all');

  const [formData, setFormData] = useState({
    title: '',
    level: 'junior',
    job_type: 'fulltime',
    work_model: 'onsite',
    location: '',
  });
  const [statistics, setStatistics] = useState(statCards);
  useEffect(() => {
    const fetchJobPostings = async () => {
      const token = localStorage.getItem('jwt');
      let url = 'https://app.elevatehr.ai/wp-json/elevatehr/v1/jobs';
      if (statusFilter !== 'all') {
        url += `?status=${statusFilter}`;
      }

      try {
        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          cache: 'no-store'
        });
        const data = await response.json();
        setJobPostings(data);
      } catch (error) {
        console.error('Error fetching job postings:', error);
      }
    };

    fetchJobPostings();
  }, [statusFilter]);
  
  useEffect(() => {
    setLoading(true)
    const token = localStorage.getItem('jwt');
    fetch('https://app.elevatehr.ai/wp-json/elevatehr/v1/statistics', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    })
      .then((response) => response.json())
      .then((data) => {
        const updatedStats = statistics.map((card, index) => ({
          ...card,
          value: data.by_stage[card.id]
        }));
        setStatistics(updatedStats);
        setLoading(false); // Set loading to false when data is fetched
      })
      .catch((error) => {
        console.error('Error fetching statistics:', error);
        setLoading(false); // Also set loading to false on error
      });
  }, []);



  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const router = useRouter();
  const handleSubmit = () => {
    setLoading(true);
    const token = localStorage.getItem('jwt');
    fetch('https://app.elevatehr.ai/wp-json/elevatehr/v1/jobs', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      cache: 'no-store',
      body: JSON.stringify(formData)
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.id) { // Assuming the response contains a job_id field
          router.push(`/dashboard/create-job-posting/${data.id}`);
          setLoading(false);
        } else {
          console.error('Job ID not found in response:', data);
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error('Error creating job posting:', error);
      });
  };
  if (loading) {
    return <DashboardSkeleton />;
  }
  return (
    <PageContainer title="Dashboard" description="this is Dashboard">
      <ToolbarStyled direction='row' alignItems='center' justifyContent='space-between'>
        <Stack spacing={'12px'}>
          <Greeting variant='body1' fontWeight='semibold'>Hello Recruiter,</Greeting>
          <Typography variant='body2' fontWeight='semibold' fontSize='16px' color={'rgba(17,17,17,0.62)'}>Welcome to your Dashboard</Typography>
        </Stack>
        <PrimaryButton onClick={handleOpen}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 10H15" stroke="rgba(205, 247, 235, 0.92)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M10 15L10 5" stroke="rgba(205, 247, 235, 0.92)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <Typography fontWeight={'medium'}>Create new Position</Typography>
        </PrimaryButton>
      </ToolbarStyled>
      <Box>
        <Grid container spacing={3}>
          <Grid container item xs={12} marginBottom={3}>
            {statistics.map((card, index) => (
              <StatCard key={index} card={card} index={index} length={statistics.length} />
            ))}
          </Grid>
          <Grid container item xs={12} spacing={3} justifyContent={'space-between'} minHeight={'500px'} maxHeight={'700px'}>
            <Grid item xs={12} lg={8} maxHeight={'100%'} overflow={'scroll'}>
              {loading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <Skeleton key={index} variant="rectangular" width="100%" height={150} sx={{ mb: 2, borderRadius: 2 }} />
                ))
              ) : (
                <JobPostings customStyle={{ height: '100%', overflow: 'scroll' }} jobPostings={jobPostings} statusFilter={statusFilter} setStatusFilter={setStatusFilter}/>
              )}
            </Grid>
            <Grid container item spacing={'12px'} xs={12} lg={4} minHeight={'500px'} maxHeight={'700px'}>
              <Grid item xs={12} sm={6} lg={12} flex={1} maxHeight={'50%'} overflow={'scroll'}>
                <Notifications customStyle={{ height: '100%', overflow: 'scroll' }} />
              </Grid>
              <Grid item xs={12} sm={6} lg={12} flex={1} maxHeight={'50%'} overflow={'scroll'}>
                <EmailTemplates customStyle={{ height: '100%', overflow: 'scroll' }} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
      <StyledDialog open={open} onClose={handleClose}>
        <DialogTitle sx={{ padding: 0 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h6" fontWeight={600} color="rgba(17, 17, 17, 0.92)" fontSize={'20px'}>
              Create Job Posting
            </Typography>
            <IconButton size="small" sx={{ bgcolor: "#eaeaea", borderRadius: "20px", width: 24, height: 24 }} onClick={handleClose}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ padding: 0 }}>
          <Stack spacing={4}>
            <Stack spacing={1}>
              <Typography variant="body1" fontWeight={600} color="rgba(17, 17, 17, 0.84)">
                Job title
              </Typography>
              <TextField
                fullWidth
                placeholder="Add job title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                sx={{ bgcolor: "#f2f4f6", "& .MuiOutlinedInput-root": { borderColor: "#d7dadf", borderWidth: "0.5px" } }}
              />
            </Stack>
            <Stack spacing={1}>
              <Typography variant="body1" fontWeight={600} color="rgba(17, 17, 17, 0.84)">
                Level
              </Typography>
              <FormControl>
                <RadioGroup row value={formData.level} onChange={handleChange} name="level" sx={{ gap: '10px' }}>
                  {["Junior", "Mid", "Senior"].map((option) => (
                    <FormControlLabel
                      key={option}
                      value={option.toLowerCase()}
                      control={<Radio sx={{ color: "rgba(17, 17, 17, 0.68)", "&.Mui-checked": { color: "rgba(17, 17, 17, 0.84)" } }} />}
                      label={option}
                      sx={{ m: 0, width: 145, height: 48, bgcolor: "#f2f4f6", borderRadius: 1, border: "0.5px solid #d7dadf", "& .MuiFormControlLabel-label": { color: "rgba(17, 17, 17, 0.84)", fontWeight: 400 } }}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </Stack>
            <Stack spacing={1}>
              <Typography variant="body1" fontWeight={600} color="rgba(17, 17, 17, 0.84)">
                Job type
              </Typography>
              <FormControl>
                <RadioGroup row value={formData.job_type} onChange={handleChange} name="job_type" sx={{ gap: '10px' }}>
                  {["Full-time", "Contract"].map((option) => (
                    <FormControlLabel
                      key={option}
                      value={option.toLowerCase().replace('-', '')}
                      control={<Radio sx={{ color: "rgba(17, 17, 17, 0.68)", "&.Mui-checked": { color: "rgba(17, 17, 17, 0.84)" } }} />}
                      label={option}
                      sx={{ m: 0, width: 145, height: 48, bgcolor: "#f2f4f6", borderRadius: 1, border: "0.5px solid #d7dadf", "& .MuiFormControlLabel-label": { color: "rgba(17, 17, 17, 0.84)", fontWeight: 400 } }}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </Stack>
            <Stack spacing={1}>
              <Typography variant="body1" fontWeight={600} color="rgba(17, 17, 17, 0.84)">
                Office presence
              </Typography>
              <FormControl>
                <RadioGroup row value={formData.work_model} onChange={handleChange} name="work_model" sx={{ gap: '10px' }}>
                  {["On-site", "Remote", "Hybrid"].map((option) => (
                    <FormControlLabel
                      key={option}
                      value={option.toLowerCase().replace('-', '')}
                      control={<Radio sx={{ color: "rgba(17, 17, 17, 0.68)", "&.Mui-checked": { color: "rgba(17, 17, 17, 0.84)" } }} />}
                      label={option}
                      sx={{ m: 0, width: 145, height: 48, bgcolor: "#f2f4f6", borderRadius: 1, border: "0.5px solid #d7dadf", "& .MuiFormControlLabel-label": { color: "rgba(17, 17, 17, 0.84)", fontWeight: 400 } }}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </Stack>
            <Stack spacing={1}>
              <Typography variant="body1" fontWeight={600} color="rgba(17, 17, 17, 0.84)">
                Location
              </Typography>
              <TextField
                fullWidth
                placeholder="Add location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                sx={{ bgcolor: "#f2f4f6", "& .MuiOutlinedInput-root": { borderColor: "#d7dadf", borderWidth: "0.5px" } }}
              />
            </Stack>
            <Button
              variant="contained"
              fullWidth
              sx={{
                color: "rgba(205, 247, 235, 0.92)",
                mt: 2,
                py: 2,
                bgcolor: "#032B44",
                borderRadius: 2,
                textTransform: "none",
                "&:hover": {
                  bgcolor: "#032B44",
                },
              }}
              onClick={handleSubmit}
              disabled={loading} // Disable button while loading
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Job'}
            </Button>
          </Stack>
        </DialogContent>
      </StyledDialog>
    </PageContainer>
  );
};

export default Dashboard;

interface CustomInputProps {
  label: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
}

const CustomInput = ({ label, value, onChange, name }: CustomInputProps) => {
  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    width: '456px',
    height: '48px',
    padding: '16px 354px 16px 16px',
    borderRadius: '6px',
    border: '0.5px solid #D7DAE0',
    background: '#F3F4F7',
    display: 'flex',
    alignItems: 'center',
  }));

  const StyledFormControl = styled(FormControl)(({ theme }) => ({
    width: '456px',
  }));

  const StyledInputLabel = styled(InputLabel)(({ theme }) => ({
    color: 'rgba(17, 17, 17, 0.84)',
    position: 'relative',
    fontSize: '16px',
    fontStyle: 'normal',
    fontWeight: 600,
    lineHeight: '16px',
    marginBottom: '8px', // Space between label and input
    transform: 'translate(0, -50)', // Ensure the label stays in place
    display: 'block',
  }));

  return (
    <StyledFormControl variant="standard">
      <StyledInputLabel shrink htmlFor={name}>
        {label}
      </StyledInputLabel>
      <StyledInputBase
        id={name}
        value={value}
        onChange={onChange}
        name={name}
      />
    </StyledFormControl>
  );
};

const LevelRadioGroup = ({ value, onChange }: { value: string; onChange: (event: React.ChangeEvent<HTMLInputElement>) => void }) => {
  return (
    <FormControl component="fieldset">
      <Typography variant="subtitle1" marginBottom={1}>Level</Typography>
      <StyledRadioGroup row value={value} onChange={onChange} name="level">
        <StyledFormControlLabel value="junior" control={<StyledRadio />} label="Junior" />
        <StyledFormControlLabel value="mid-level" control={<StyledRadio />} label="Mid-Level" />
        <StyledFormControlLabel value="senior" control={<StyledRadio />} label="Senior" />
      </StyledRadioGroup>
    </FormControl>
  );
};
