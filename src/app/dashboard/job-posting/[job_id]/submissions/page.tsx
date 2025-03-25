"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Box,
  Container,
  Typography,
  IconButton,
  Tabs,
  Tab,
  Paper,
  Checkbox,
  Button,
  Chip,
  MenuItem,
  Select,
  FormControl,
  TextField,
  Radio,
  RadioGroup,
  Menu,
  FormControlLabel,
  CircularProgress,
  Divider,
  ListItem,
  List,
  ListItemText,
  Stack,
  Card,
  Skeleton,
  Snackbar,
  Alert,
} from "@mui/material";
import Link from "next/link";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ClockIcon from "@mui/icons-material/AccessTime";
import FlashIcon from "@mui/icons-material/BoltSharp";
import LocationIcon from "@mui/icons-material/LocationOnOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import WorkIcon from "@mui/icons-material/Work";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import EditIcon from "@mui/icons-material/Edit";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import PlaceIcon from "@mui/icons-material/Place";
import BoltIcon from "@mui/icons-material/Bolt";
import CloseIcon from "@mui/icons-material/Close";
import { Edit, WorkOutline } from "@mui/icons-material";
import CandidateListSection from "@/app/dashboard/components/dashboard/CandidatesListSection";
import { useTheme } from "@mui/material/styles";
import { PHASE_OPTIONS } from "@/app/constants/phaseOptions";
import { styled } from "@mui/material/styles";
import CreatableSelect from 'react-select/creatable';
import { getSkillsForRole, Skill } from '@/utils/skills';
import AssignmentIcon from "@mui/icons-material/Assignment";
import GroupIcon from "@mui/icons-material/Group";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RestoreIcon from "@mui/icons-material/Restore";
import CheckIcon from "@mui/icons-material/Check";

// Types
interface JobDetails {
  title: string;
  about_role: string;
  job_type: string;
  work_model: string;
  location: string;
  responsibilities?: string;
  expectations?: string;
  stage_counts: {
    new: number;
    skill_assessment: number;
    interviews: number;
    acceptance: number;
    archived: number;
  };
  requirements?: string[];
  experience_years?: string;
}

interface FilterState {
  yearsOfExperience: string;
  salaryMin: string;
  salaryMax: string;
  requiredSkills: string[];
  availability: string;
  trial: string;
}

interface Candidate {
  id: number;
  personal_info: {
    firstname: string;
    lastname: string;
  };
  professional_info: {
    experience: string;
    salary_range: string;
    start_date: string;
    skills?: string;
  };
}

interface CandidateResponse {
  applications: Candidate[];
}

interface SkillColor {
  bg: string;
  color: string;
}

interface SkillColors {
  [key: string]: SkillColor;
}

// Add StageType type definition
type StageType = 'new' | 'skill_assessment' | 'interviews' | 'acceptance' | 'archived';

// Add QuickActionOption type definition
interface QuickActionOption {
  label: string;
  icon: React.ComponentType;
  action: string;
}

// Add QuickActions type definition
interface QuickActions {
  [key: string]: QuickActionOption[];
}

// Define PhaseOption interface
interface PhaseOption {
  label: string;
  icon: React.ComponentType;
  action: string;
}

const StyledSelect = styled(Select)({
  '& .MuiSelect-select': {
    backgroundColor: '#fff',
    borderRadius: '12px',
    border: '1px solid rgba(17, 17, 17, 0.08)',
    padding: '16px',
    color: 'rgba(17, 17, 17, 0.84)',
    '&:focus': {
      backgroundColor: '#fff',
    }
  }
});

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#fff',
    borderRadius: '12px',
    border: '1px solid rgba(17, 17, 17, 0.08)',
    '& fieldset': {
      border: 'none',
    },
    '&:hover fieldset': {
      border: 'none',
    },
    '&.Mui-focused fieldset': {
      border: 'none',
    }
  },
  '& .MuiInputBase-input': {
    padding: '16px',
    color: 'rgba(17, 17, 17, 0.84)',
    '&::placeholder': {
      color: 'rgba(17, 17, 17, 0.48)',
    }
  }
});

const StyledRadio = styled(Radio)({
  color: 'rgba(17, 17, 17, 0.6)',
  '&.Mui-checked': {
    color: '#4444E2',
  }
});

// Update TabPanel component
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      sx={{ p: 3 }}
      {...other}
    >
      {value === index && children}
    </Box>
  );
};

export default function Home() {
  const theme = useTheme();
  const [primaryTabValue, setPrimaryTabValue] = useState(0);
  const [subTabValue, setSubTabValue] = useState(0);
  const [filterMenuAnchor, setFilterMenuAnchor] = useState<HTMLElement | null>(null);
  const [quickActionsAnchor, setQuickActionsAnchor] = useState<HTMLElement | null>(null);
  const [availableSkills, setAvailableSkills] = useState<Skill[]>([]);
  const [stageTotals, setStageTotals] = useState({
    new: 0,
    skill_assessment: 0,
    interviews: 0,
    acceptance: 0,
    archived: 0
  });
  const [filters, setFilters] = useState<FilterState>({
    yearsOfExperience: '',
    salaryMin: '',
    salaryMax: '',
    requiredSkills: [],
    availability: '',
    trial: '',
  });
  const [filteredCandidates, setFilteredCandidates] = useState<CandidateResponse>({ applications: [] });
  const [jobDetails, setJobDetails] = useState<JobDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [candidates, setCandidates] = useState<CandidateResponse>({ applications: [] });
  const [selectedEntries, setSelectedEntries] = useState<number[]>([]);
  const [isMovingStage, setIsMovingStage] = useState(false);
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success'
  });
  const [isOpen, setIsOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationSeverity, setNotificationSeverity] = useState<'success' | 'error'>('success');

  const router = useRouter();
  const params = useParams();

  const getJobId = useCallback((): string => {
    return params['job_id'] as string;
  }, [params]);

  useEffect(() => {
    const fetchJobDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("jwt");
        const jobId = getJobId();
        const response = await fetch(
          `https://app.elevatehr.ai/wp-json/elevatehr/v1/jobs/${jobId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            cache: 'no-store'
          },
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch job details: ${response.status}`);
        }

        const data = await response.json();
        console.log('Job details received:', data);
        setJobDetails(data);
        setLoading(false);
        // Set stage totals from job details
        if (data.stage_counts) {
          setStageTotals(data.stage_counts);
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('Failed to fetch job details');
        }
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [getJobId]);

  useEffect(() => {
    const fetchCandidates = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("jwt");
        const jobId = getJobId();
        const stage = subTabValue === 0 ? "new" : getStageValue(subTabValue);
        const response = await fetch(
          `https://app.elevatehr.ai/wp-json/elevatehr/v1/jobs/${jobId}/applications?stage=${stage}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            cache: 'no-store'
          },
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch candidates: ${response.status}`);
        }

        const data = await response.json();
        setCandidates(data);
        setFilteredCandidates(data);
        setLoading(false);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('Failed to fetch candidates');
        }
        setLoading(false);
      }
    };

    if (primaryTabValue === 0) {
      fetchCandidates();
    }
  }, [getJobId, primaryTabValue, subTabValue]);

  useEffect(() => {
    console.log('Job details received:', jobDetails);
    const loadSkills = async () => {

      if (jobDetails) {
        const skills = await getSkillsForRole(jobDetails.title, jobDetails.about_role);
        setAvailableSkills(skills);
      }
    };

    if (jobDetails) {
      loadSkills();
    }
  }, [getJobId, jobDetails]);

  const getStageValue = (tabValue: number): StageType => {
    switch (tabValue) {
      case 1:
        return 'skill_assessment';
      case 2:
        return 'interviews';
      case 3:
        return 'acceptance';
      case 4:
        return 'archived';
      default:
        return 'new';
    }
  };

  const handleFilterChange = (filterName: keyof FilterState, value: string | string[]) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value,
    }));
  };

  const applyFilters = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("jwt");
      const jobId = getJobId();
      const stage = subTabValue === 0 ? "new" : getStageValue(subTabValue);

      // Build query parameters from filters
      const queryParams = new URLSearchParams();
      if (filters.yearsOfExperience) {
        const [minYears, maxYears] = filters.yearsOfExperience.split("-").map(num => parseInt(num));
        queryParams.append("min_experience", minYears.toString());
        if (maxYears) {
          queryParams.append("max_experience", maxYears.toString());
        }
      }
      if (filters.salaryMin) queryParams.append("min_salary", filters.salaryMin);
      if (filters.salaryMax) queryParams.append("max_salary", filters.salaryMax);
      if (filters.requiredSkills.length > 0) {
        queryParams.append("skills", filters.requiredSkills.join(','));
      }
      if (filters.availability) queryParams.append("availability", filters.availability);
      if (filters.trial) queryParams.append("trial", filters.trial);
      queryParams.append("stage", stage);

      const response = await fetch(
        `https://app.elevatehr.ai/wp-json/elevatehr/v1/jobs/${jobId}/applications?${queryParams.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          cache: 'no-store'
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch filtered candidates: ${response.status}`);
      }

      const data = await response.json();
      setFilteredCandidates(data);
      setCandidates(data); // Update the base candidates list as well
    } catch (error: unknown) {
      console.error("Error applying filters:", error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred while applying filters');
      }
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setFilters({
      yearsOfExperience: "",
      salaryMin: "",
      salaryMax: "",
      requiredSkills: [],
      availability: "",
      trial: "",
    });
    setFilteredCandidates({ applications: [] });
  };

  const handlePrimaryTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setPrimaryTabValue(newValue);
  };

  const handleSubTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setSelectedEntries([]);
    setSubTabValue(newValue);
  };

  const handleFilterMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setFilterMenuAnchor(event.currentTarget);
  };

  const handleFilterMenuClose = () => {
    setFilterMenuAnchor(null);
  };

  const handleQuickActionsOpen = (event: React.MouseEvent<HTMLElement>) => {
    setQuickActionsAnchor(event.currentTarget);
  };

  const handleQuickActionsClose = () => {
    setQuickActionsAnchor(null);
  };

  const getSkillChipColor = (skill: string): SkillColor => {
    const colors: SkillColors = {
      Communication: { bg: "#FBE9E7", color: "#D84315" },
      "Data analysis": { bg: "#E1F5FE", color: "#0288D1" },
      "Strategic Thinking": { bg: "#F3E5F5", color: "#7B1FA2" },
      Empathy: { bg: "#E8EAF6", color: "#3949AB" },
      Prioritization: { bg: "#E8F5E9", color: "#388E3C" },
      Research: { bg: "#FFEBEE", color: "#C62828" },
    };

    return colors[skill] || { bg: "#E0E0E0", color: "#616161" };
  };

  const renderJobDescription = () => {
    if (loading) {
      return (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "400px",
          }}
        >
          <CircularProgress />
        </Box>
      );
    }

    if (error) {
      return (
        <Box sx={{ p: 3, textAlign: "center" }}>
          <Typography color="error" variant="h6">
            Error loading job details
          </Typography>
          <Typography color="textSecondary">{error}</Typography>
          <Button
            variant="contained"
            sx={{ mt: 2 }}
            onClick={() => {
              setError(null);
              setPrimaryTabValue(1);
            }}
          >
            Retry
          </Button>
        </Box>
      );
    }

    const jobData = jobDetails;

    return (
      <Stack direction={"row"} gap={4}>
        <Card
          sx={{
            width: 308,
            height: 345,
            borderRadius: 2,
            overflow: "hidden",
            p: 3,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography
            variant="h5"
            fontWeight={600}
            color="rgba(17, 17, 17, 0.92)"
            mb={2}
            sx={{
              color: "rgba(17, 17, 17, 0.92)",
              textTransform: "capitalize", // Equivalent to leading-trim: both and text-edge: cap
              fontSize: "24px",
              fontStyle: "normal",
              fontWeight: 600,
              lineHeight: 1, // Equivalent to 100%
              letterSpacing: "0.12px",
            }}
          >
            {jobData?.title}
          </Typography>

          <Stack spacing={2} mb={3}>
            <Chip
              icon={<ClockIcon />}
              label={jobData?.job_type}
              sx={{
                bgcolor: "#edeef1",
                color: "rgba(17, 17, 17, 0.84)",
                borderRadius: "28px",
                height: 36,
                width: "fit-content",
                "& .MuiChip-label": {
                  fontSize: 14,
                  fontWeight: 400,
                },
              }}
            />
            <Chip
              icon={<LocationIcon />}
              label={jobData?.work_model}
              sx={{
                bgcolor: "#edeef1",
                color: "rgba(17, 17, 17, 0.84)",
                borderRadius: "28px",
                height: 36,
                width: "fit-content",
                "& .MuiChip-label": {
                  fontSize: 14,
                  fontWeight: 400,
                },
              }}
            />
            <Chip
              icon={<LocationIcon />}
              label={jobData?.location?.split(" ")?.join(", ")}
              sx={{
                bgcolor: "#edeef1",
                color: "rgba(17, 17, 17, 0.84)",
                borderRadius: "28px",
                height: 36,
                width: "fit-content",
                "& .MuiChip-label": {
                  fontSize: 14,
                  fontWeight: 400,
                },
              }}
            />
          </Stack>

          <Divider sx={{ width: "100%", my: 2 }} />

          <Stack spacing={2.5} mt={1}>
            <Box display="flex" alignItems="center" gap={1}>
              <FlashIcon sx={{ color: "#00C853", width: 20, height: 20 }} />
              <Typography
                fontWeight={500}
                color="rgba(17, 17, 17, 0.84)"
                fontSize={16}
              >
                {jobData?.experience_years} of Experience
              </Typography>
            </Box>
            {jobData?.requirements?.map((requirement, index) => (
              <Box key={index} display="flex" alignItems="center" gap={1}>
                <FlashIcon sx={{ color: "#00C853", width: 20, height: 20 }} />
                <Typography
                  fontWeight={500}
                  color="rgba(17, 17, 17, 0.84)"
                  fontSize={16}
                >
                  {requirement}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Card>
        <Paper
          elevation={0}
          sx={{
            width: 956,
            height: 902,
            borderRadius: 2,
            position: "relative",
            overflow: "hidden",
            p: 4,
          }}
        >
          {/* Icon */}
          <Box
            sx={{
              width: 108,
              height: 108,
              bgcolor: "#e6f9f1",
              borderRadius: "80px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              border: "0.8px solid rgba(67, 67, 225, 0.12)",
              mb: 4,
            }}
          >
            <WorkOutline sx={{ width: 48, height: 48 }} />
          </Box>

          {/* Edit Button */}
          <Link href={`/dashboard/create-job-posting/${getJobId()}`}>
            <Button
              variant="contained"
              startIcon={<Edit />}
              sx={{
                position: "absolute",
                top: 32,
                right: 32,
                bgcolor: "#f4f4f6",
                color: "rgba(17, 17, 17, 0.84)",
                textTransform: "none",
                borderRadius: 2,
                border: "0.5px solid rgba(17, 17, 17, 0.08)",
                py: 1.25,
                px: 2.5,
                "&:hover": {
                  bgcolor: "#e8e8ea",
                },
              }}
            >
              Edit
            </Button>
          </Link>

          {/* About the Role Section */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: "rgba(17, 17, 17, 0.92)",
                fontSize: 20,
                mb: 1.5,
                letterSpacing: "0.1px",
                lineHeight: "20px",
              }}
            >
              About the Role
            </Typography>
            <Typography
              component="div"
              variant="body1"
              dangerouslySetInnerHTML={{ __html: jobDetails?.about_role || '' }}
              sx={{
                color: 'rgba(17, 17, 17, 0.84)',
                maxWidth: 800,
                letterSpacing: '0.15px',
                lineHeight: '1.5',
              }}
            />
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Job Responsibilities Section */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: "rgba(17, 17, 17, 0.92)",
                fontSize: 20,
                mb: 1.5,
                letterSpacing: "0.1px",
                lineHeight: "20px",
              }}
            >
              Job Responsibilities
            </Typography>
            <Box
              component="div"
              dangerouslySetInnerHTML={{ __html: jobData?.responsibilities || '' }}
              sx={{
                "& ul": {
                  marginBlockStart: 0,
                  paddingInlineStart: "20px !important",
                  "& li": {
                    display: "list-item",
                    listStyleType: "disc",
                    p: 0,
                    pb: 0.5,
                    color: "rgba(17, 17, 17, 0.84)",
                    letterSpacing: "0.16px",
                    lineHeight: "24px",
                  },
                },
              }}
            />
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Expectations Section */}
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: "rgba(17, 17, 17, 0.92)",
                fontSize: 20,
                mb: 1.5,
                letterSpacing: "0.1px",
                lineHeight: "20px",
              }}
            >
              Expectations of the Role
            </Typography>
            <List sx={{ maxWidth: 660, pl: 2 }}>
              {jobData?.expectations?.split("|||")?.map((expectation, index) => (
                <ListItem
                  key={index}
                  sx={{
                    display: "list-item",
                    listStyleType: "disc",
                    p: 0,
                    pb: 0.5,
                  }}
                >
                  <ListItemText
                    primary={expectation}
                    primaryTypographyProps={{
                      variant: "body1",
                      sx: {
                        color: "rgba(17, 17, 17, 0.84)",
                        letterSpacing: "0.16px",
                        lineHeight: "24px",
                      },
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        </Paper>
      </Stack>
    );
  };

  const handleSelectCandidate = (id: number) => {
    setSelectedEntries((prev) => {
      if (prev.includes(id)) {
        return prev.filter((entryId) => entryId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleUpdateStages = async ({ stage, entries = [] }: { stage: StageType; entries?: number[] }) => {
    setIsMovingStage(true);
    try {
      const jwt = localStorage.getItem("jwt");
      if (!jwt) throw new Error('Authentication token not found');

      const entriesToUpdate = entries.length ? entries : selectedEntries;
      const jobId = getJobId();

      console.log('Updating application stage:', stage, entriesToUpdate, jwt);
      const response = await fetch(
        `https://app.elevatehr.ai/wp-json/elevatehr/v1/applications/move-stage`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwt}`,
          },
          cache: 'no-store',
          body: JSON.stringify({
            stage,
            entries: entriesToUpdate,
          }),
        }
      );
      console.log('Response:', response);

      if (!response.ok) {
        throw new Error('Failed to update stages');
      }

      // Refetch job details to update stage counts
      const jobDetailsResponse = await fetch(
        `https://app.elevatehr.ai/wp-json/elevatehr/v1/jobs/${jobId}`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
            "Content-Type": "application/json",
          },
          cache: 'no-store'
        }
      );

      if (!jobDetailsResponse.ok) {
        throw new Error('Failed to fetch updated job details');
      }

      const jobDetailsData = await jobDetailsResponse.json();
      if (jobDetailsData.stage_counts) {
        setStageTotals(jobDetailsData.stage_counts);
      }

      // Refetch candidates for the current stage
      const currentStage = getStageValue(subTabValue);
      const candidatesResponse = await fetch(
        `https://app.elevatehr.ai/wp-json/elevatehr/v1/jobs/${jobId}/applications?stage=${currentStage}`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
          cache: 'no-store',
        }
      );

      if (!candidatesResponse.ok) {
        throw new Error('Failed to fetch updated candidates');
      }

      const candidatesData = await candidatesResponse.json();
      setCandidates(candidatesData);
      setFilteredCandidates(candidatesData);
      setSelectedEntries([]);
      
      // Show success notification
      setNotification({
        open: true,
        message: `Successfully moved ${entriesToUpdate.length} candidate${entriesToUpdate.length > 1 ? 's' : ''} to ${stage.replace('_', ' ')}`,
        severity: 'success'
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
        setNotification({
          open: true,
          message: error.message,
          severity: 'error'
        });
      } else {
        setError('An unexpected error occurred while updating stages');
        setNotification({
          open: true,
          message: 'An unexpected error occurred while updating stages',
          severity: 'error'
        });
      }
    } finally {
      setIsMovingStage(false);
    }
  };

  const handleCloseNotification = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setIsOpen(false);
  };

  const handleNotification = (message: string, severity: 'success' | 'error') => {
    setNotificationMessage(message);
    setNotificationSeverity(severity);
    setIsOpen(true);
  };

  const hasActiveFilters = () => {
    return (
      filters.yearsOfExperience !== "" ||
      filters.salaryMin !== "" ||
      filters.salaryMax !== "" ||
      filters.requiredSkills.length > 0 ||
      filters.availability !== "" ||
      filters.trial !== ""
    );
  };

  const handleError = (error: unknown) => {
    if (error instanceof Error) {
      setError(error.message);
    } else {
      setError('An unexpected error occurred');
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        bgcolor: "#F5F7FA",
      }}
    >
      <Container maxWidth="xl" sx={{ flexGrow: 1, py: 3 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton sx={{ mr: 1 }} aria-label="back">
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h5" component="h1" fontWeight="bold" sx={{
              color: theme.palette.grey[100],
              fontSize: "24px",
              fontWeight: 600,
              lineHeight: "100%", 
              letterSpacing: "0.12px"
            }}  >
              {jobDetails?.title}
            </Typography>
          </Box>
          <Button
            variant="contained"
            sx={{
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.secondary.light,
              borderRadius: 2,
              textTransform: "none",
              "&:hover": {
                bgcolor: "primary.main",
              },
            }}
          >
            Close responses for this job
          </Button>
        </Box>

        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
          <Tabs
            value={primaryTabValue}
            onChange={(_event: React.SyntheticEvent, newValue: number) => setPrimaryTabValue(newValue)}
            aria-label="primary tabs"
            sx={{
              minHeight: 'auto',
              '& .MuiTabs-indicator': {
                backgroundColor: '#4444E2',
              },
            }}
          >
            <Tab
              label="Applications"
              sx={{
                textTransform: "none",
                fontWeight: primaryTabValue === 0 ? "bold" : "normal",
                color:
                  primaryTabValue === 0
                    ? theme.palette.secondary.main
                    : theme.palette.grey[100],
              }}
            />
            <Tab
              label="Job description"
              sx={{
                textTransform: "none",
                fontWeight: primaryTabValue === 1 ? "bold" : "normal",
                color:
                  primaryTabValue === 1
                    ? theme.palette.secondary.main
                    : theme.palette.grey[100],
              }}
            />
          </Tabs>
        </Box>

        {primaryTabValue === 0 ? (
          <Stack direction="row" gap={3}>
            <Box sx={{ width: 300, flexShrink: 0 }}>
              <Paper elevation={0} sx={{ p: 3, mb: 2, borderRadius: 2 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 3
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontSize: '20px',
                      fontWeight: 600,
                      color: 'rgba(17, 17, 17, 0.92)'
                    }}
                  >
                    Filters:
                  </Typography>
                  <Button
                    startIcon={<CloseIcon />}
                    sx={{
                      color: 'rgba(17, 17, 17, 0.72)',
                      textTransform: 'none',
                      fontSize: '14px',
                      fontWeight: 400
                    }}
                    onClick={clearFilters}
                  >
                    Clear filter
                  </Button>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography
                    sx={{
                      mb: 1.5,
                      fontSize: '16px',
                      fontWeight: 500,
                      color: 'rgba(17, 17, 17, 0.92)'
                    }}
                  >
                    Years of experience
                  </Typography>
                  <FormControl fullWidth>
                    <Select
                      value={filters.yearsOfExperience}
                      displayEmpty
                      renderValue={(selected) => selected || "Select years"}
                      sx={{
                        backgroundColor: '#fff',
                        borderRadius: '12px',
                        border: '1px solid rgba(17, 17, 17, 0.08)',
                        '& .MuiSelect-select': {
                          padding: '16px',
                          color: filters.yearsOfExperience ? 'rgba(17, 17, 17, 0.84)' : 'rgba(17, 17, 17, 0.48)'
                        }
                      }}
                      onChange={(e) => handleFilterChange("yearsOfExperience", e.target.value)}
                    >
                      <MenuItem value="">All years</MenuItem>
                      <MenuItem value="1-3">1-3 years</MenuItem>
                      <MenuItem value="4-6">4-6 years</MenuItem>
                      <MenuItem value="7+">7+ years</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography
                    sx={{
                      mb: 1.5,
                      fontSize: '16px',
                      fontWeight: 500,
                      color: 'rgba(17, 17, 17, 0.92)'
                    }}
                  >
                    Salary expectation:
                  </Typography>
                  <Stack spacing={1.5}>
                    <StyledTextField
                      placeholder="Min: 000000"
                      fullWidth
                      value={filters.salaryMin}
                      onChange={(e) => handleFilterChange("salaryMin", e.target.value)}
                      type="number"
                    />
                    <StyledTextField
                      placeholder="Max: 000000"
                      fullWidth
                      value={filters.salaryMax}
                      onChange={(e) => handleFilterChange("salaryMax", e.target.value)}
                      type="number"
                    />
                  </Stack>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography
                    sx={{
                      mb: 1.5,
                      fontSize: '16px',
                      fontWeight: 500,
                      color: 'rgba(17, 17, 17, 0.92)'
                    }}
                  >
                    Required skills
                  </Typography>
                  <CreatableSelect
                    isMulti
                    options={availableSkills}
                    value={filters.requiredSkills.map(skill => ({ value: skill, label: skill }))}
                    onChange={(selectedOptions: any) => {
                      const selectedSkills = selectedOptions ? selectedOptions.map((option: any) => option.value) : [];
                      handleFilterChange("requiredSkills", selectedSkills);
                    }}
                    onCreateOption={(inputValue: string) => {
                      const newSkill = { value: inputValue, label: inputValue };
                      handleFilterChange("requiredSkills", [...filters.requiredSkills, inputValue]);
                    }}
                    placeholder="Select or create skills"
                    formatCreateLabel={(inputValue: string) => `Create "${inputValue}"`}
                    styles={{
                      control: (base: any) => ({
                        ...base,
                        backgroundColor: '#fff',
                        borderRadius: '12px',
                        border: '1px solid rgba(17, 17, 17, 0.08)',
                        minHeight: '52px',
                        boxShadow: 'none',
                        '&:hover': {
                          borderColor: 'rgba(17, 17, 17, 0.08)'
                        }
                      }),
                      menu: (base: any) => ({
                        ...base,
                        zIndex: 2
                      }),
                      option: (base: any, state: any) => ({
                        ...base,
                        backgroundColor: state.isFocused ? '#F8F9FB' : 'white',
                        color: 'rgba(17, 17, 17, 0.84)',
                        cursor: 'pointer',
                        padding: '12px 16px'
                      }),
                      multiValue: (base: any) => ({
                        ...base,
                        backgroundColor: '#E8EAFD',
                        borderRadius: '4px',
                        padding: '2px 6px',
                        margin: '2px',
                      }),
                      multiValueLabel: (base: any) => ({
                        ...base,
                        color: '#4444E2',
                        fontSize: '14px'
                      }),
                      multiValueRemove: (base: any) => ({
                        ...base,
                        color: '#4444E2',
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: '#D8DAFD',
                          color: '#4444E2'
                        }
                      }),
                      placeholder: (base: any) => ({
                        ...base,
                        color: 'rgba(17, 17, 17, 0.48)'
                      })
                    }}
                  />
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography
                    sx={{
                      mb: 1.5,
                      fontSize: '16px',
                      fontWeight: 500,
                      color: 'rgba(17, 17, 17, 0.92)'
                    }}
                  >
                    Availability:
                  </Typography>
                  <RadioGroup
                    value={filters.availability}
                    onChange={(e) => handleFilterChange("availability", e.target.value)}
                  >
                    <FormControlLabel
                      value="immediately"
                      control={<StyledRadio />}
                      label="Immediately"
                      sx={{
                        '& .MuiTypography-root': {
                          fontSize: '16px',
                          color: 'rgba(17, 17, 17, 0.84)'
                        }
                      }}
                    />
                    <FormControlLabel
                      value="in-a-week"
                      control={<StyledRadio />}
                      label="In a week"
                      sx={{
                        '& .MuiTypography-root': {
                          fontSize: '16px',
                          color: 'rgba(17, 17, 17, 0.84)'
                        }
                      }}
                    />
                    <FormControlLabel
                      value="in-a-month"
                      control={<StyledRadio />}
                      label="In a month"
                      sx={{
                        '& .MuiTypography-root': {
                          fontSize: '16px',
                          color: 'rgba(17, 17, 17, 0.84)'
                        }
                      }}
                    />
                    <FormControlLabel
                      value="in-two-months"
                      control={<StyledRadio />}
                      label="In two months"
                      sx={{
                        '& .MuiTypography-root': {
                          fontSize: '16px',
                          color: 'rgba(17, 17, 17, 0.84)'
                        }
                      }}
                    />
                  </RadioGroup>
                </Box>

                <Button
                  variant="contained"
                  fullWidth
                  disabled={!hasActiveFilters()}
                  sx={{
                    bgcolor: theme.palette.primary.main,
                    color: theme.palette.secondary.light,
                    textTransform: 'none',
                    borderRadius: '12px',
                    padding: '16px',
                    fontSize: '16px',
                    fontWeight: 500,
                    '&:hover': {
                      bgcolor: theme.palette.primary.main,
                    },
                    '&.Mui-disabled': {
                      backgroundColor: 'rgba(0, 0, 0, 0.12)',
                      color: 'rgba(0, 0, 0, 0.26)'
                    }
                  }}
                  onClick={applyFilters}
                >
                  Apply Filter
                </Button>
              </Paper>
            </Box>
            <Box sx={{ flexGrow: 1 }}>
              {/* Your existing tabs */}
              <Box
                sx={{
                  borderBottom: 1,
                  borderColor: "divider",
                  mb: 3,
                  backgroundColor: "#ffffff !important",
                  borderRadius: "10px",
                  paddingX: "20px",
                }}
              >
                <Tabs
                  value={subTabValue}
                  onChange={handleSubTabChange}
                  indicatorColor="secondary"
                  variant="scrollable"
                  scrollButtons="auto"
                  aria-label="submission tabs"
                  sx={{ width: "100%", alignItems: "center" }}
                >
                  <Tab
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <span>Application Review</span>
                        <Chip 
                          label={stageTotals.new} 
                          size="small" 
                          sx={{ 
                            bgcolor: theme.palette.secondary.main,
                            color: 'white',
                            height: '20px',
                            '& .MuiChip-label': {
                              px: 1,
                              fontSize: '12px',
                              fontWeight: 500
                            }
                          }}
                        />
                      </Box>
                    }
                    sx={{
                      textTransform: "none",
                      color:
                        subTabValue === 0
                          ? theme.palette.grey[100]
                          : theme.palette.grey[200],
                      flex: 1,
                    }}
                  />
                  <Tab
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <span>Skill assessment</span>
                        <Chip 
                          label={stageTotals.skill_assessment} 
                          size="small" 
                          sx={{ 
                            bgcolor: theme.palette.secondary.main,
                            color: 'white',
                            height: '20px',
                            '& .MuiChip-label': {
                              px: 1,
                              fontSize: '12px',
                              fontWeight: 500
                            }
                          }}
                        />
                      </Box>
                    }
                    sx={{
                      textTransform: "none",
                      color:
                        subTabValue === 1
                          ? theme.palette.grey[100]
                          : theme.palette.grey[200],
                      flex: 1,
                    }}
                  />
                  <Tab
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <span>Interviews</span>
                        <Chip 
                          label={stageTotals.interviews} 
                          size="small" 
                          sx={{ 
                            bgcolor: theme.palette.secondary.main,
                            color: 'white',
                            height: '20px',
                            '& .MuiChip-label': {
                              px: 1,
                              fontSize: '12px',
                              fontWeight: 500
                            }
                          }}
                        />
                      </Box>
                    }
                    sx={{
                      textTransform: "none",
                      color:
                        subTabValue === 2
                          ? theme.palette.grey[100]
                          : theme.palette.grey[200],
                      flex: 1,
                    }}
                  />
                  <Tab
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <span>Acceptance</span>
                        <Chip 
                          label={stageTotals.acceptance} 
                          size="small" 
                          sx={{ 
                            bgcolor: theme.palette.secondary.main,
                            color: 'white',
                            height: '20px',
                            '& .MuiChip-label': {
                              px: 1,
                              fontSize: '12px',
                              fontWeight: 500
                            }
                          }}
                        />
                      </Box>
                    }
                    sx={{
                      textTransform: "none",
                      color:
                        subTabValue === 3
                          ? theme.palette.grey[100]
                          : theme.palette.grey[200],
                      flex: 1,
                    }}
                  />
                  <Tab
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <span>Archived</span>
                        <Chip 
                          label={stageTotals.archived} 
                          size="small" 
                          sx={{ 
                            bgcolor: theme.palette.secondary.main,
                            color: 'white',
                            height: '20px',
                            '& .MuiChip-label': {
                              px: 1,
                              fontSize: '12px',
                              fontWeight: 500
                            }
                          }}
                        />
                      </Box>
                    }
                    sx={{
                      textTransform: "none",
                      color:
                        subTabValue === 4
                          ? theme.palette.grey[100]
                          : theme.palette.grey[200],
                      flex: 1,
                    }}
                  />
                </Tabs>
              </Box>
              <Paper
                elevation={0}
                sx={{
                  width: "100%",
                  //  maxWidth: 956,
                  bgcolor: "background.paper",
                  borderRadius: 2,
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                {/* Actions bar inside Paper, before candidates list */}
                {selectedEntries?.length > 0 &&
                  subTabValue !== 3 && ( // Hide for acceptance phase
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        p: 2,
                        borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Typography
                          variant="body1"
                          color={theme.palette.grey[100]}
                        >
                          {selectedEntries?.length} candidates selected
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => setSelectedEntries([])}
                          sx={{ ml: 1 }}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </Box>

                      <Box sx={{ display: "flex", gap: 2 }}>
                        {PHASE_OPTIONS[getStageValue(subTabValue)]?.map(
                          (option) => (
                            <Button
                              key={option.action}
                              variant="outlined"
                              startIcon={isMovingStage ? <CircularProgress size={20} /> : <option.icon />}
                              onClick={() => handleUpdateStages({ stage: option.action as StageType })}
                              disabled={isMovingStage}
                              sx={{
                                color: 'rgba(17, 17, 17, 0.84)',
                                borderColor: 'rgba(17, 17, 17, 0.12)',
                                '&:hover': {
                                  borderColor: 'rgba(17, 17, 17, 0.24)',
                                },
                                '&.Mui-disabled': {
                                  backgroundColor: 'rgba(0, 0, 0, 0.12)',
                                  color: 'rgba(0, 0, 0, 0.26)'
                                }
                              }}
                            >
                              {isMovingStage ? 'Moving...' : option.label}
                            </Button>
                          ),
                        )}
                      </Box>
                    </Box>
                  )}

                {/* Candidates list */}
                {loading
                  ? Array.from({ length: 5 }).map((_, index) => (
                    <Skeleton
                      key={index}
                      variant="rectangular"
                      width="100%"
                      height={150}
                      sx={{ 
                        mb: 2, 
                        borderRadius: 2,
                        bgcolor: 'rgba(0, 0, 0, 0.04)' // Lighter grey color
                      }}
                    />
                  ))
                  : filteredCandidates?.applications?.map((candidate) => (
                    <Box
                      key={candidate.id}
                      sx={{
                        borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
                        "&:last-child": {
                          borderBottom: "none",
                        },
                      }}
                    >
                      <CandidateListSection
                        candidate={candidate}
                        isSelected={selectedEntries?.includes(candidate.id)}
                        onSelectCandidate={handleSelectCandidate}
                        onUpdateStages={(stage: string, entries: number[]) => handleUpdateStages({ stage: stage as StageType, entries })}
                        disableSelection={subTabValue === 3}
                        currentStage={getStageValue(subTabValue)}
                        selectedEntries={selectedEntries}
                        onNotification={handleNotification}
                      />
                    </Box>
                  ))}
              </Paper>
            </Box>
          </Stack>
        ) : (
          renderJobDescription()
        )}
      </Container>

      {/* Add Snackbar for notifications */}
      <Snackbar
        open={isOpen}
        autoHideDuration={4000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{
          zIndex: 9999,
        }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notificationSeverity}
          icon={notificationSeverity === 'success' ? <CheckIcon /> : undefined}
          sx={{ 
            minWidth: '300px',
            backgroundColor: 'primary.main',
            color: 'secondary.light',
            borderRadius: '100px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            '& .MuiAlert-icon': {
              color: '#fff',
              marginRight: '8px',
              padding: 0,
            },
            '& .MuiAlert-message': {
              padding: '6px 0',
              fontSize: '15px',
              textAlign: 'center',
              flex: 'unset',
            },
            '& .MuiAlert-action': {
              padding: '0 8px 0 0',
              marginRight: 0,
              '& .MuiButtonBase-root': {
                color: '#fff',
                padding: 1,
              },
            },
          }}
        >
          {notificationMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
