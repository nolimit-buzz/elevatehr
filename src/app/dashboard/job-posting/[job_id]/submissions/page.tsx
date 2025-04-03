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
  status: string;
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
  // borderWidth: '0.5px',
  // borderRadius: "40px",
  // border: "1px solid rgba(17, 17, 17, 0.84)",
  opacity: 0.68,
  '&.Mui-checked': {
    color: '#4444E2',
  },

});
const PrimaryButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  borderRadius: "8px",
  display: 'flex',
  alignItems: 'center',
  gap: '5px',
  padding: '10px 20px',
  fontSize: theme.typography.pxToRem(16),
  color: theme.palette.secondary.light,
  fontWeight: theme.typography.fontWeightMedium,
  height: '52px',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    backgroundColor: '#6666E6',
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 12px rgba(68, 68, 226, 0.15)',
  },
}));
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
            {jobData?.title || ''}
          </Typography>

          <Stack spacing={2} mb={3}>
            <Chip
              icon={<ClockIcon />}
              label={jobData?.job_type}
              sx={{
                bgcolor: '#FCEBE3',
                color: '#724A3B',
                borderRadius: '28px',
                height: 36,
                width: 'fit-content',
                '& .MuiChip-label': {
                  fontSize: 14,
                  fontWeight: 400,
                },
                '& .MuiChip-icon': {
                  color: '#724A3B',
                }
              }}
            />
            <Chip
              icon={<LocationIcon />}
              label={jobData?.work_model}
              sx={{
                bgcolor: '#F9E8F3',
                color: '#76325F',
                borderRadius: '28px',
                height: 36,
                width: 'fit-content',
                '& .MuiChip-label': {
                  fontSize: 14,
                  fontWeight: 400,
                },
                '& .MuiChip-icon': {
                  color: '#76325F',
                }
              }}
            />
            <Chip
              icon={<LocationIcon />}
              label={jobData?.location?.split(" ")?.join(", ")}
              sx={{
                bgcolor: '#D7EEF4',
                color: '#2B656E',
                borderRadius: '28px',
                height: 36,
                width: 'fit-content',
                '& .MuiChip-label': {
                  fontSize: 14,
                  fontWeight: 400,
                },
                '& .MuiChip-icon': {
                  color: '#2B656E',
                }
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

  const handleCloseResponses = async () => {
    try {
      const token = localStorage.getItem("jwt");
      if (!token) throw new Error('Authentication token not found');

      const jobId = getJobId();
      const newStatus = jobDetails?.status === 'close' ? 'active' : 'close';
      
      const response = await fetch(
        `https://app.elevatehr.ai/wp-json/elevatehr/v1/jobs/${jobId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...jobDetails,
            status: newStatus
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update job status');
      }

      // Show success notification
      setNotificationMessage(newStatus === 'close' ? 'Job posting closed successfully' : 'Job posting reopened successfully');
      setNotificationSeverity('success');
      setIsOpen(true);

      // Refetch job details and candidates if reopening
      if (newStatus === 'active') {
        // Refetch job details
        const jobDetailsResponse = await fetch(
          `https://app.elevatehr.ai/wp-json/elevatehr/v1/jobs/${jobId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            cache: 'no-store'
          }
        );

        if (!jobDetailsResponse.ok) {
          throw new Error('Failed to fetch updated job details');
        }

        const jobDetailsData = await jobDetailsResponse.json();
        setJobDetails(jobDetailsData);
        if (jobDetailsData.stage_counts) {
          setStageTotals(jobDetailsData.stage_counts);
        }

        // Refetch candidates for current stage
        const currentStage = getStageValue(subTabValue);
        const candidatesResponse = await fetch(
          `https://app.elevatehr.ai/wp-json/elevatehr/v1/jobs/${jobId}/applications?stage=${currentStage}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
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
      } else {
        // Redirect to dashboard if closing
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      }
    } catch (error) {
      if (error instanceof Error) {
        setNotificationMessage(error.message);
        setNotificationSeverity('error');
        setIsOpen(true);
      } else {
        setNotificationMessage('An unexpected error occurred while updating the job status');
        setNotificationSeverity('error');
        setIsOpen(true);
      }
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
            <IconButton sx={{ mr: 1 }} aria-label="back" onClick={() => router.push('/dashboard')}>
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
          <PrimaryButton
            variant="contained"
            onClick={handleCloseResponses}
          >
            {jobDetails?.status === 'close' ? 'Reopen Job Posting' : 'Close Responses for this Job'}
          </PrimaryButton>
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
              '& .MuiTab-root': {
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  color: theme.palette.secondary.main,
                }
              }
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
                      fontWeight: 400,
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        color: theme.palette.primary.main,
                        backgroundColor: 'rgba(68, 68, 226, 0.04)',
                      }
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
                        boxShadow: 'none',
                        backgroundColor: '#fff',
                        borderRadius: '12px',
                        // border: '1px solid rgba(17, 17, 17, 0.12)',
                        '& .MuiSelect-select': {
                          padding: '16px',
                          border: 'none',
                          boxShadow: 'none',
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
                      control={<StyledRadio icon={<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g opacity="0.68">
                          <rect x="0.5" y="0.5" width="19" height="19" rx="9.5" stroke="#111111" stroke-opacity="0.84" />
                        </g>
                      </svg>
                      } />}
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
                      control={<StyledRadio icon={<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g opacity="0.68">
                          <rect x="0.5" y="0.5" width="19" height="19" rx="9.5" stroke="#111111" stroke-opacity="0.84" />
                        </g>
                      </svg>
                      } />}
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
                      control={<StyledRadio icon={<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g opacity="0.68">
                          <rect x="0.5" y="0.5" width="19" height="19" rx="9.5" stroke="#111111" stroke-opacity="0.84" />
                        </g>
                      </svg>
                      } />}
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
                      control={<StyledRadio icon={<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g opacity="0.68">
                          <rect x="0.5" y="0.5" width="19" height="19" rx="9.5" stroke="#111111" stroke-opacity="0.84" />
                        </g>
                      </svg>
                      } />}
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

                <PrimaryButton
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
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      bgcolor: theme.palette.primary.main,
                      transform: "translateY(-1px)",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                    },
                    '&.Mui-disabled': {
                      backgroundColor: 'rgba(0, 0, 0, 0.12)',
                      color: 'rgba(0, 0, 0, 0.26)'
                    }
                  }}
                  onClick={applyFilters}
                >
                  Apply Filter
                </PrimaryButton>
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
                  sx={{ 
                    width: "100%", 
                    alignItems: "center",
                    '& .MuiTab-root': {
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        color: theme.palette.secondary.main,
                      }
                    }
                  }}
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
                  bgcolor: "background.paper",
                  borderRadius: 2,
                  overflow: "hidden",
                  position: "relative",
                  minHeight: "700px",
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
                    <Paper
                      key={index}
                      elevation={0}
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        p: 2,
                        borderBottom: "0.8px solid rgba(17, 17, 17, 0.08)",
                        mb: 2,
                        height: "120px",
                      }}
                    >
                      {/* Checkbox skeleton */}
                      <Box sx={{ p: 0 }}>
                        <Skeleton
                          variant="rectangular"
                          width={16}
                          height={16}
                          sx={{
                            borderRadius: 1,
                            bgcolor: 'rgba(17, 17, 17, 0.04)'
                          }}
                        />
                      </Box>

                      {/* Content skeleton */}
                      <Box sx={{ ml: "12px", width: "100%" }}>
                        {/* Name skeleton */}
                        <Skeleton
                          variant="text"
                          width={200}
                          height={24}
                          sx={{
                            mb: 1,
                            bgcolor: 'rgba(17, 17, 17, 0.04)'
                          }}
                        />

                        {/* Info row skeleton */}
                        <Box sx={{ display: "flex", gap: 3.5, mb: 2 }}>
                          <Skeleton
                            variant="text"
                            width={100}
                            height={20}
                            sx={{ bgcolor: 'rgba(17, 17, 17, 0.04)' }}
                          />
                          <Skeleton
                            variant="text"
                            width={100}
                            height={20}
                            sx={{ bgcolor: 'rgba(17, 17, 17, 0.04)' }}
                          />
                        </Box>

                        {/* Skills skeleton */}
                        <Box sx={{ display: "flex", gap: 1 }}>
                          {[1, 2, 3, 4].map((_, i) => (
                            <Skeleton
                              key={i}
                              variant="rectangular"
                              width={80}
                              height={24}
                              sx={{
                                borderRadius: "28px",
                                bgcolor: 'rgba(17, 17, 17, 0.04)'
                              }}
                            />
                          ))}
                        </Box>

                        {/* Quick actions button skeleton */}
                        <Skeleton
                          variant="rectangular"
                          width={120}
                          height={36}
                          sx={{
                            position: "absolute",
                            right: 16,
                            top: 16,
                            borderRadius: "8px",
                            bgcolor: 'rgba(17, 17, 17, 0.02)'
                          }}
                        />
                      </Box>
                    </Paper>
                  ))
                  : filteredCandidates?.applications?.length === 0 ? (
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '700px',
                        px: 2,
                      }}
                    >
                      {subTabValue === 0 && (
                        <svg width="64" height="64" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect width="32" height="32" rx="16" fill="#1CC47E" />
                          <path d="M11.8335 11.8335L20.1668 20.1668" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                          <path d="M20.1667 13.5L20.1667 20.1667L13.5 20.1667" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>

                      )}
                      {subTabValue === 1 && (
                        <svg width="64" height="64" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect width="32" height="32" rx="16" fill="#5656E6" />
                          <path d="M15.1667 22.25H23.5001" stroke="white" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
                          <path d="M15.1667 16.4167H23.5001" stroke="white" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
                          <path d="M15.1667 10.5833H23.5001" stroke="white" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
                          <path d="M8.5 10.5834L9.33333 11.4167L11.8333 8.91675" stroke="white" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
                          <path d="M8.5 16.4167L9.33333 17.25L11.8333 14.75" stroke="white" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
                          <path d="M8.5 22.2499L9.33333 23.0833L11.8333 20.5833" stroke="white" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>

                      )}
                      {subTabValue === 2 && (
                        <svg width="64" height="64" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect width="32" height="32" rx="16" fill="#FD8535" />
                          <path d="M16.4417 23.0167H11.1751C8.54175 23.0167 7.66675 21.2667 7.66675 19.5084V12.4917C7.66675 9.8584 8.54175 8.9834 11.1751 8.9834H16.4417C19.0751 8.9834 19.9501 9.8584 19.9501 12.4917V19.5084C19.9501 22.1417 19.0667 23.0167 16.4417 23.0167Z" stroke="white" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
                          <path d="M22.2666 20.2499L19.95 18.6249V13.3665L22.2666 11.7415C23.4 10.9499 24.3333 11.4332 24.3333 12.8249V19.1749C24.3333 20.5665 23.4 21.0499 22.2666 20.2499Z" stroke="white" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
                          <path d="M15.5833 15.1667C16.2736 15.1667 16.8333 14.6071 16.8333 13.9167C16.8333 13.2264 16.2736 12.6667 15.5833 12.6667C14.8929 12.6667 14.3333 13.2264 14.3333 13.9167C14.3333 14.6071 14.8929 15.1667 15.5833 15.1667Z" stroke="white" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>

                      )}
                      {subTabValue === 3 && (
                        <svg width="64" height="64" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect width="32" height="32" rx="16" fill="#D834DE" />
                          <path d="M13.7083 13.5417C15.1916 14.0834 16.8083 14.0834 18.2916 13.5417" stroke="white" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
                          <path d="M20.0166 7.66675H11.9833C10.2083 7.66675 8.7666 9.11675 8.7666 10.8834V22.6251C8.7666 24.1251 9.8416 24.7584 11.1583 24.0334L15.2249 21.7751C15.6583 21.5334 16.3583 21.5334 16.7833 21.7751L20.8499 24.0334C22.1666 24.7667 23.2416 24.1334 23.2416 22.6251V10.8834C23.2333 9.11675 21.7916 7.66675 20.0166 7.66675Z" stroke="white" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
                          <path d="M20.0166 7.66675H11.9833C10.2083 7.66675 8.7666 9.11675 8.7666 10.8834V22.6251C8.7666 24.1251 9.8416 24.7584 11.1583 24.0334L15.2249 21.7751C15.6583 21.5334 16.3583 21.5334 16.7833 21.7751L20.8499 24.0334C22.1666 24.7667 23.2416 24.1334 23.2416 22.6251V10.8834C23.2333 9.11675 21.7916 7.66675 20.0166 7.66675Z" stroke="white" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>



                      )}
                      {subTabValue === 4 && (
                        <svg width="64" height="64" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect width="32" height="32" rx="16" fill="#35B0FD" />
                          <path d="M18.0332 21.8751L19.2999 23.1417L21.8332 20.6084" stroke="white" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
                          <path d="M16.1334 15.0584C16.0501 15.0501 15.9501 15.0501 15.8584 15.0584C13.8751 14.9917 12.3001 13.3667 12.3001 11.3667C12.2917 9.32508 13.9501 7.66675 15.9917 7.66675C18.0334 7.66675 19.6917 9.32508 19.6917 11.3667C19.6917 13.3667 18.1084 14.9917 16.1334 15.0584Z" stroke="white" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
                          <path d="M15.9917 24.1751C14.475 24.1751 12.9667 23.7917 11.8167 23.0251C9.80003 21.6751 9.80003 19.4751 11.8167 18.1334C14.1084 16.6001 17.8667 16.6001 20.1584 18.1334" stroke="white" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>

                      )}
                      <Typography
                        sx={{
                          mt: 2,
                          color: 'rgba(17, 17, 17, 0.48)',
                          fontSize: '16px',
                          fontWeight: 400,
                          textAlign: 'center'
                        }}
                      >
                        {subTabValue === 0 ? 'No applications to review' : 
                         subTabValue === 1 ? 'No candidates in skill assessment' : 
                         subTabValue === 2 ? 'No interviews scheduled' : 
                         subTabValue === 3 ? 'No accepted candidates' : 
                         'No archived candidates'}
                      </Typography>
                    </Box>
                  ) : (
                    <Box sx={{ pt: 0, pb: 2 }}>
                      {filteredCandidates?.applications?.map((candidate) => (
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
                            disableSelection={subTabValue === 3 || filteredCandidates?.applications?.length === 1}
                        currentStage={getStageValue(subTabValue)}
                        selectedEntries={selectedEntries}
                        onNotification={handleNotification}
                      />
                    </Box>
                  ))}
                    </Box>
                  )}
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
