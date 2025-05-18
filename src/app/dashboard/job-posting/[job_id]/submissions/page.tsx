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
  Button,
  Chip,
  CircularProgress,
  Stack,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import CandidateListSection from "@/app/dashboard/components/dashboard/CandidatesListSection";
import { useTheme } from "@mui/material/styles";
import { PHASE_OPTIONS } from "@/app/constants/phaseOptions";
import { styled } from "@mui/material/styles";
import { getSkillsForRole, Skill } from "@/utils/skills";
import JobDescription from "@/app/dashboard/components/JobDescription";
import FilterSection from "@/app/dashboard/components/FilterSection";
import Notification from '@/app/dashboard/components/Notification';
import MobileCandidateGrid from '@/app/dashboard/components/MobileCandidateGrid';
import EmptyState from '@/app/dashboard/components/EmptyState';
import {
  JobDetails,
  FilterState,
  CandidateResponse,
  SkillColor,
  StageType,
  Assessment,
  PhaseOption,
} from '@/app/dashboard/types/candidate';
import MobileStageDropdown from '@/app/dashboard/components/MobileStageDropdown';
import CandidateSkeletonLoader from '@/app/dashboard/components/CandidateSkeletonLoader';
import AssessmentIcon from '@/app/dashboard/components/AssessmentIcon';

// Remove unused styled components
const PrimaryButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  borderRadius: "8px",
  display: "flex",
  alignItems: "center",
  gap: "5px",
  padding: "10px 20px",
  fontSize: theme.typography.pxToRem(16),
  color: theme.palette.secondary.light,
  fontWeight: theme.typography.fontWeightMedium,
  height: "52px",
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    backgroundColor: "#6666E6",
    transform: "translateY(-1px)",
    boxShadow: "0 4px 12px rgba(68, 68, 226, 0.15)",
  },
}));

export default function Home() {
  const theme = useTheme();
  const [primaryTabValue, setPrimaryTabValue] = useState(0);
  const [subTabValue, setSubTabValue] = useState(0);
  const [selectedAssessmentType, setSelectedAssessmentType] = useState(0);
  const [quickActionsAnchor, setQuickActionsAnchor] =
    useState<HTMLElement | null>(null);
  const [availableSkills, setAvailableSkills] = useState<Skill[]>([]);
  const [stageTotals, setStageTotals] = useState({
    new: 0,
    skill_assessment: 0,
    interviews: 0,
    acceptance: 0,
    archived: 0,
  });
  const [filters, setFilters] = useState<FilterState>({
    yearsOfExperience: "",
    salaryMin: "",
    salaryMax: "",
    requiredSkills: [],
    availability: "",
    trial: "",
  });
  const [filteredCandidates, setFilteredCandidates] =
    useState<CandidateResponse>({ applications: [] });
  const [jobDetails, setJobDetails] = useState<JobDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [candidates, setCandidates] = useState<CandidateResponse>({
    applications: [],
  });
  const [selectedEntries, setSelectedEntries] = useState<number[]>([]);
  const [isMovingStage, setIsMovingStage] = useState("");
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success'
  });
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loadingAssessments, setLoadingAssessments] = useState(false);
  const [filterMenuAnchor, setFilterMenuAnchor] = useState<HTMLElement | null>(
    null
  );
  const [dynamicPhaseOptions, setDynamicPhaseOptions] = useState<Record<StageType, PhaseOption[]>>(PHASE_OPTIONS);

  const router = useRouter();
  const params = useParams();

  const getJobId = useCallback((): string => {
    return params["job_id"] as string;
  }, [params]);

  useEffect(() => {
    const fetchJobDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("jwt");
        const jobId = getJobId();
        const response = await fetch(
          `https://app.elevatehr.ai/wp-json/elevatehr/v1/jobs/${jobId}?sort_by=match_score&sort_order=desc`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch job details: ${response.status}`);
        }

        const data = await response.json();
        console.log("Job details received:", data);
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
          setError("Failed to fetch job details");
        }
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [getJobId]);

  const fetchCandidates = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("jwt");
      const jobId = getJobId();
      const stage = subTabValue === 0 ? "new" : getStageValue(subTabValue);
      const url = new URL(`https://app.elevatehr.ai/wp-json/elevatehr/v1/jobs/${jobId}/applications`);
      url.searchParams.append('stage', stage);
      
      // Add logging for debugging
      console.log('Selected Assessment Type:', selectedAssessmentType);
      console.log('Assessments:', assessments);
      
      if (stage === 'skill_assessment' && selectedAssessmentType > 0) {
        // Subtract 1 because index 0 is "All" tab
        const assessmentType = assessments[selectedAssessmentType - 1]?.type;
        console.log('Assessment Type to be added:', assessmentType);
        if (assessmentType) {
          url.searchParams.append('assessment_type', assessmentType);
        }
      }

      console.log('Final URL:', url.toString());
      const response = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

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
        setError("Failed to fetch candidates");
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    if (primaryTabValue === 0) {
      fetchCandidates();
    }
  }, [getJobId, primaryTabValue, subTabValue, selectedAssessmentType]);

  useEffect(() => {
    console.log("Job details received:", jobDetails);
    const loadSkills = async () => {
      if (jobDetails) {
        const skills = await getSkillsForRole(
          jobDetails.title,
          jobDetails.about_role
        );
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
        return "skill_assessment";
      case 2:
        return "interviews";
      case 3:
        return "acceptance";
      case 4:
        return "archived";
      default:
        return "new";
    }
  };

  const handleFilterChange = (
    filterName: keyof FilterState,
    value: string | string[]
  ) => {
    setFilters((prev) => ({
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
        const [minYears, maxYears] = filters.yearsOfExperience
          .split("-")
          .map((num) => parseInt(num));
        if (minYears && !maxYears) {
        queryParams.append("min_experience", minYears.toString());
        }
        if (minYears && maxYears) {
          queryParams.append(
            "experience_range",
            minYears.toString() + "-" + maxYears.toString()
          );
        }
      }
      if (filters.salaryMin)
        queryParams.append("min_salary", filters.salaryMin);
      if (filters.salaryMax)
        queryParams.append("max_salary", filters.salaryMax);
      if (filters.requiredSkills.length > 0) {
        queryParams.append("skills", filters.requiredSkills.join(","));
      }
      if (filters.availability)
        queryParams.append("availability", filters.availability);
      if (filters.trial) queryParams.append("trial", filters.trial);
      queryParams.append("stage", stage);

      const response = await fetch(
        `https://app.elevatehr.ai/wp-json/elevatehr/v1/jobs/${jobId}/applications?${queryParams.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch filtered candidates: ${response.status}`
        );
      }

      const data = await response.json();
      setFilteredCandidates(data);
      setCandidates(data); // Update the base candidates list as well
    } catch (error: unknown) {
      console.error("Error applying filters:", error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred while applying filters");
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
    fetchCandidates();
  };

  const handlePrimaryTabChange = (
    _event: React.SyntheticEvent,
    newValue: number
  ) => {
    setPrimaryTabValue(newValue);
  };

  const handleSubTabChange = (
    _event: React.SyntheticEvent,
    newValue: number
  ) => {
    setSelectedEntries([]);
    setSubTabValue(newValue);
  };

  const handleQuickActionsOpen = (event: React.MouseEvent<HTMLElement>) => {
    setQuickActionsAnchor(event.currentTarget);
  };

  const handleQuickActionsClose = () => {
    setQuickActionsAnchor(null);
  };

  const getSkillChipColor = (skill: string): SkillColor => {
    const skillColors = [
      { bg: "rgba(114, 74, 59, 0.15)", color: "#724A3B" },
      { bg: "rgba(43, 101, 110, 0.15)", color: "#2B656E" },
      { bg: "rgba(118, 50, 95, 0.15)", color: "#76325F" },
      { bg: "rgba(59, 95, 158, 0.15)", color: "#3B5F9E" },
    ];

    // Use modulo to cycle through colors if there are more skills than colors
    const colorIndex =
      Math.abs(
        skill.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
      ) % skillColors.length;
    return skillColors[colorIndex];
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
  const handleCardClick = (
    candidateId: number,
    event: React.MouseEvent<HTMLElement>
  ) => {
    // Prevent redirection if clicking on checkbox or quick actions button
    if (
      (event.target as HTMLElement).closest(".checkbox-container") ||
      (event.target as HTMLElement).closest(".quick-actions-button")
    ) {
      return;
    }

    // Get the job_id from the URL
    const pathParts = window.location.pathname.split("/");
    const jobId = pathParts[pathParts.length - 2];

    // Navigate to the applicant details page
    router.push(`/dashboard/job-posting/${jobId}/submissions/${candidateId}`);
  };

  const handleUpdateStages = async ({
    stage,
    entries = [],
    assessmentType,
  }: {
    stage: StageType;
    entries?: number[];
    assessmentType?: string;
  }) => {
    setIsMovingStage(assessmentType ? `assessment_${assessmentType}` : stage);
    try {
      const jwt = localStorage.getItem("jwt");
      if (!jwt) throw new Error("Authentication token not found");

      const entriesToUpdate = entries.length ? entries : selectedEntries;
      const jobId = getJobId();

      console.log("Updating application stage:", stage, entriesToUpdate, jwt);
      const response = await fetch(
        `https://app.elevatehr.ai/wp-json/elevatehr/v1/applications/move-stage`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
          cache: "no-store",
          body: JSON.stringify({
            stage,
            entries: entriesToUpdate,
            assessment_type: assessmentType,
          }),
        }
      );
      console.log("Response:", response);

      if (!response.ok) {
        throw new Error("Failed to update stages");
      }

      // Refetch job details to update stage counts
      const jobDetailsResponse = await fetch(
        `https://app.elevatehr.ai/wp-json/elevatehr/v1/jobs/${jobId}`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
            "Content-Type": "application/json",
          },
          cache: "no-store",
        }
      );

      if (!jobDetailsResponse.ok) {
        throw new Error("Failed to fetch updated job details");
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
          cache: "no-store",
        }
      );

      if (!candidatesResponse.ok) {
        throw new Error("Failed to fetch updated candidates");
      }

      const candidatesData = await candidatesResponse.json();
      setCandidates(candidatesData);
      setFilteredCandidates(candidatesData);
      setSelectedEntries([]);

      // Show success notification
      setNotification({
        open: true,
        message: `Successfully moved ${entriesToUpdate.length} candidate${
          entriesToUpdate.length > 1 ? "s" : ""
        } to ${stage.replace("_", " ")}`,
        severity: "success",
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
        setNotification({
          open: true,
          message: error.message,
          severity: "error",
        });
      } else {
        setError("An unexpected error occurred while updating stages");
        setNotification({
          open: true,
          message: "An unexpected error occurred while updating stages",
          severity: "error",
        });
      }
    } finally {
      setIsMovingStage("");
    }
  };

  const handleCloseNotification = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setNotification(prev => ({ ...prev, open: false }));
  };

  const handleNotification = (message: string, severity: 'success' | 'error') => {
    setNotification({
      open: true,
      message,
      severity
    });
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
      setError("An unexpected error occurred");
    }
  };

  const handleCloseResponses = async () => {
    try {
      const token = localStorage.getItem("jwt");
      if (!token) throw new Error("Authentication token not found");

      const jobId = getJobId();
      const newStatus = jobDetails?.status === "close" ? "active" : "close";
      
      const response = await fetch(
        `https://app.elevatehr.ai/wp-json/elevatehr/v1/jobs/${jobId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...jobDetails,
            status: newStatus,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update job status");
      }

      // Show success notification
      setNotification({
        open: true,
        message: newStatus === "close"
          ? "Job posting closed successfully"
          : "Job posting reopened successfully",
        severity: "success"
      });

      // Refetch job details and candidates if reopening
      if (newStatus === "active") {
        // Refetch job details
        const jobDetailsResponse = await fetch(
          `https://app.elevatehr.ai/wp-json/elevatehr/v1/jobs/${jobId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            cache: "no-store",
          }
        );

        if (!jobDetailsResponse.ok) {
          throw new Error("Failed to fetch updated job details");
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
            cache: "no-store",
          }
        );

        if (!candidatesResponse.ok) {
          throw new Error("Failed to fetch updated candidates");
        }

        const candidatesData = await candidatesResponse.json();
        setCandidates(candidatesData);
        setFilteredCandidates(candidatesData);
      } else {
        // Redirect to dashboard if closing
        setTimeout(() => {
          router.push("/dashboard");
        }, 1500);
      }
    } catch (error) {
      if (error instanceof Error) {
        setNotification({
          open: true,
          message: error.message,
          severity: "error"
        });
      } else {
        setNotification({
          open: true,
          message: "An unexpected error occurred while updating the job status",
          severity: "error"
        });
      }
    }
  };

  const fetchAssessments = async () => {
    setLoadingAssessments(true);
    try {
      const token = localStorage.getItem("jwt");
      const jobId = getJobId();
      const response = await fetch(
        `https://app.elevatehr.ai/wp-json/elevatehr/v1/get-job-assessment?job_id=${jobId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch assessments");
      }

      const data = await response.json();
      console.log('Raw assessment data:', data);
      if (data.status === "success" && Array.isArray(data.assessments)) {
        setAssessments(data.assessments);
        console.log('Assessments set:', data.assessments);
        
        // Update dynamic phase options with assessment options
        const assessmentOptions = data.assessments.map((assessment: Assessment) => ({
          label: `Send ${assessment.type.split('_').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' ')}`,
          icon: AssessmentIcon,
          action: `assessment_${assessment.type}`,
          id: assessment.id
        }));

        console.log('Assessment Options:', assessmentOptions);
        console.log('Original PHASE_OPTIONS:', PHASE_OPTIONS);

        setDynamicPhaseOptions(prev => {
          const newOptions = {
            ...prev,
            skill_assessment: [
              ...PHASE_OPTIONS.skill_assessment,
              ...assessmentOptions
            ]
          };
          console.log('New Dynamic Phase Options:', newOptions);
          return newOptions;
        });
      } else {
        setAssessments([]);
        // Reset to original phase options if no assessments
        setDynamicPhaseOptions(PHASE_OPTIONS);
      }
    } catch (error) {
      console.error("Error fetching assessments:", error);
      setAssessments([]);
      // Reset to original phase options on error
      setDynamicPhaseOptions(PHASE_OPTIONS);
    } finally {
      setLoadingAssessments(false);
    }
  };

  useEffect(() => {
    if (subTabValue === 1) {
      fetchAssessments();
    }
  }, [subTabValue]);

  const handleFilterMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setFilterMenuAnchor(event.currentTarget);
  };

  const handleFilterMenuClose = () => {
    setFilterMenuAnchor(null);
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
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <IconButton
            sx={{
              mr: 1,
              padding: 0,
              // display: { xs: 'none', sm: 'flex' }
            }}
            aria-label="back"
            onClick={() => router.back()}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography
            variant="h5"
            sx={{
              fontSize: { xs: "15px", sm: "18px" },
              // fontWeight: 600,
              color: "grey.200",
              // mb: 1
            }}
          >
            Back
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              sx={{
                mr: 1,
                display: { xs: "none", sm: "flex" },
              }}
              aria-label="back"
              onClick={() => router.back()}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography
              variant="h5"
              sx={{
                fontSize: { xs: "18px", sm: "24px" },
              fontWeight: 600,
                color: "rgba(17, 17, 17, 0.84)",
                // mb: 1
              }}
            >
              {jobDetails?.title}
            </Typography>
          </Box>
          <PrimaryButton
            variant="contained"
            onClick={handleCloseResponses}
            sx={{
              height: { xs: "36px", sm: "52px" },
              "& .MuiButton-startIcon": {
                marginRight: { xs: "4px", sm: "8px" },
              },
            }}
          >
            <Box sx={{ display: { xs: "none", sm: "block" } }}>
              {jobDetails?.status === "close"
                ? "Reopen Job Posting"
                : "Close Responses for this Job"}
            </Box>
            <Box sx={{ display: { xs: "block", sm: "none" } }}>
              {jobDetails?.status === "close" ? "Reopen" : "Close Responses"}
            </Box>
          </PrimaryButton>
        </Box>

        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
          <Tabs
            value={primaryTabValue}
            onChange={(_event: React.SyntheticEvent, newValue: number) =>
              setPrimaryTabValue(newValue)
            }
            aria-label="primary tabs"
            sx={{
              minHeight: "auto",
              "& .MuiTabs-indicator": {
                backgroundColor: "#4444E2",
              },
              "& .MuiTab-root": {
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  color: theme.palette.secondary.main,
                },
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
            <Box sx={{ display: { xs: "none", lg: "block" }, width: 308 }}>
              <FilterSection
                filters={filters}
                availableSkills={availableSkills}
                onFilterChange={handleFilterChange}
                onClearFilters={clearFilters}
                onApplyFilters={applyFilters}
                hasActiveFilters={hasActiveFilters}
                sx={{ bgcolor: '#FFFFFF', borderRadius: 2, p: 2 }}
              />
            </Box>

            {/* Mobile Filter Dialog */}
            <FilterSection
              filters={filters}
              availableSkills={availableSkills}
              onFilterChange={handleFilterChange}
              onClearFilters={clearFilters}
              onApplyFilters={applyFilters}
              hasActiveFilters={hasActiveFilters}
              isMobile
              open={Boolean(filterMenuAnchor)}
              onClose={handleFilterMenuClose}
              sx={{ bgcolor: '#FFFFFF', p: 2 }}
            />
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
                {/* Tabs for large screens */}
                <Box sx={{ display: { xs: "none", lg: "block" } }}>
                <Tabs
                  value={subTabValue}
                    onChange={(
                      _event: React.SyntheticEvent,
                      newValue: number
                    ) => {
                      handleSubTabChange(_event, newValue);
                    }}
                  indicatorColor="secondary"
                  variant="scrollable"
                  scrollButtons="auto"
                  aria-label="submission tabs"
                  sx={{ 
                    width: "100%", 
                    alignItems: "center",
                      "& .MuiTab-root": {
                        transition: "all 0.2s ease-in-out",
                        "&:hover": {
                        color: theme.palette.secondary.main,
                        },
                      },
                  }}
                >
                  <Tab
                    label={
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                        <span>Application Review</span>
                        <Chip
                          label={stageTotals.new}
                          size="small"
                          sx={{
                            bgcolor: theme.palette.secondary.main,
                              color: "white",
                              height: "20px",
                              "& .MuiChip-label": {
                              px: 1,
                                fontSize: "12px",
                                fontWeight: 500,
                              },
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
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                        <span>Skill assessment</span>
                        <Chip
                          label={stageTotals.skill_assessment}
                          size="small"
                          sx={{
                            bgcolor: theme.palette.secondary.main,
                              color: "white",
                              height: "20px",
                              "& .MuiChip-label": {
                              px: 1,
                                fontSize: "12px",
                                fontWeight: 500,
                              },
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
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                        <span>Interviews</span>
                        <Chip
                          label={stageTotals.interviews}
                          size="small"
                          sx={{
                            bgcolor: theme.palette.secondary.main,
                              color: "white",
                              height: "20px",
                              "& .MuiChip-label": {
                              px: 1,
                                fontSize: "12px",
                                fontWeight: 500,
                              },
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
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                        <span>Acceptance</span>
                        <Chip
                          label={stageTotals.acceptance}
                          size="small"
                          sx={{
                            bgcolor: theme.palette.secondary.main,
                              color: "white",
                              height: "20px",
                              "& .MuiChip-label": {
                              px: 1,
                                fontSize: "12px",
                                fontWeight: 500,
                              },
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
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                        <span>Archived</span>
                        <Chip
                          label={stageTotals.archived}
                          size="small"
                          sx={{
                            bgcolor: theme.palette.secondary.main,
                              color: "white",
                              height: "20px",
                              "& .MuiChip-label": {
                              px: 1,
                                fontSize: "12px",
                                fontWeight: 500,
                              },
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

                {/* Mobile Dropdown */}
                <MobileStageDropdown
                  subTabValue={subTabValue}
                  stageTotals={stageTotals}
                  onTabChange={handleSubTabChange}
                  onFilterClick={handleFilterMenuOpen}
                />
              </Box>
              <Paper
                elevation={0}
                sx={{
                  width: "100%",
                  bgcolor: "transparent",
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
                        borderBottom: {
                          xs: "none",
                          lg: "1px solid rgba(0, 0, 0, 0.12)",
                        },
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
                        {(() => {
                          console.log('Current stage:', getStageValue(subTabValue));
                          console.log('Available options:', dynamicPhaseOptions[getStageValue(subTabValue)]);
                          return null;
                        })()}
                        {dynamicPhaseOptions[getStageValue(subTabValue)]?.map(
                          (option) => {
                            console.log('Rendering option:', option);
                            return (
                              <Button
                                key={option.action}
                                variant="outlined"
                                startIcon={
                                  isMovingStage === option.action ? (
                                    <CircularProgress size={20} />
                                  ) : (
                                    <option.icon />
                                  )
                                }
                                onClick={() => {
                                  console.log('Option clicked:', option);
                                  handleUpdateStages({
                                    stage: "skill_assessment",
                                    assessmentType: option.action.startsWith('assessment_') 
                                      ? option.action.replace('assessment_', '')
                                      : undefined
                                  });
                                }}
                                disabled={isMovingStage.length > 0}
                                sx={{
                                  color: "rgba(17, 17, 17, 0.84)",
                                  borderColor: "rgba(17, 17, 17, 0.12)",
                                  "&:hover": {
                                    borderColor: "rgba(17, 17, 17, 0.24)",
                                  },
                                  "&.Mui-disabled": {
                                    backgroundColor: "rgba(0, 0, 0, 0.12)",
                                    color: "rgba(0, 0, 0, 0.26)",
                                  },
                                }}
                              >
                                {isMovingStage === option.action ? "Moving..." : option.label}
                              </Button>
                            );
                          }
                        )}
                      </Box>
                    </Box>
                  )}

                {/* Assessment Tabs */}
                {subTabValue === 1 && (
                  <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                    {(() => {
                      console.log('Rendering assessment tabs with:', { selectedAssessmentType, assessments });
                      return null;
                    })()}
                    <Tabs
                      value={selectedAssessmentType}
                      onChange={(_, newValue) => {
                        console.log('Tab changed to:', newValue);
                        setSelectedAssessmentType(newValue);
                      }}
                      aria-label="skill assessment tabs"
                      sx={{
                        '& .MuiTabs-indicator': {
                          backgroundColor: theme.palette.secondary.main,
                        },
                      }}
                    >
                      <Tab
                        label="All"
                        sx={{
                          textTransform: 'none',
                          color: theme.palette.grey[100],
                          '&.Mui-selected': {
                            color: theme.palette.secondary.main,
                          },
                        }}
                      />
                      {assessments?.map((assessment, index) => (
                        <Tab
                          key={index}
                          label={assessment.type.split('_').map(word => 
                            word.charAt(0).toUpperCase() + word.slice(1)
                          ).join(' ')}
                          sx={{
                            textTransform: 'none',
                            color: theme.palette.grey[100],
                            '&.Mui-selected': {
                              color: theme.palette.secondary.main,
                            },
                          }}
                        />
                      ))}
                    </Tabs>
                  </Box>
                )}

                {/* Candidates list */}
                {loading ? (
                  <CandidateSkeletonLoader />
                ) : filteredCandidates?.applications?.length === 0 ? (
                  <EmptyState 
                    subTabValue={subTabValue} 
                    assessmentType={subTabValue === 1 ? assessments[selectedAssessmentType]?.type : undefined}
                  />
                ) : (
                  <>
                    {/* Desktop View */}
                    <Box
                      sx={{
                        pt: 0,
                        pb: 2,
                        display: { xs: "none", lg: "block" },
                      }}
                    >
                      {filteredCandidates?.applications?.map((candidate) => (
                    <Box
                      key={candidate.id}
                      sx={{
                            backgroundColor: "white",
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
                        onUpdateStages={(
                          stage: string,
                          entries: number[]
                        ) =>
                          handleUpdateStages({
                            stage: stage as StageType,
                            entries,
                          })
                        }
                        disableSelection={
                          subTabValue === 3 ||
                          filteredCandidates?.applications?.length === 1
                        }
                        currentStage={getStageValue(subTabValue)}
                        selectedEntries={selectedEntries}
                        onNotification={handleNotification}
                        phaseOptions={dynamicPhaseOptions}
                      />
                    </Box>
                  ))}
                      </Box>

                    {/* Mobile View - componentized */}
                    <MobileCandidateGrid
                      candidates={filteredCandidates?.applications || []}
                      selectedEntries={selectedEntries}
                      subTabValue={subTabValue}
                      isMovingStage={isMovingStage}
                      getStageValue={getStageValue}
                      handleSelectCandidate={handleSelectCandidate}
                      handleCardClick={handleCardClick}
                      handleUpdateStages={handleUpdateStages}
                      getSkillChipColor={getSkillChipColor}
                      theme={theme}
                    />
                    </>
                  )}
              </Paper>
            </Box>
          </Stack>
        ) : (
          <JobDescription
            jobDetails={jobDetails}
            loading={loading}
            error={error}
            getJobId={getJobId}
            setError={setError}
            setPrimaryTabValue={setPrimaryTabValue}
          />
        )}
      </Container>
      {/* Replace the old Snackbar with the new Notification component */}
      <Notification
        open={notification.open}
        message={notification.message}
        severity={notification.severity}
        onClose={handleCloseNotification}
      />
    </Box>
  );
}
