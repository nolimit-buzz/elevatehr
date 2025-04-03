"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  Stack,
  styled,
  Button,
  Skeleton,
  Chip,
  Container,
  IconButton,
  Paper,
  TextField,
  FormControl,
  Select,
  MenuItem,
  Tooltip,
  Menu,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Grid,
} from "@mui/material";
import DashboardCard from "@/app/dashboard/components/shared/DashboardCard";
import zIndex from "@mui/material/styles/zIndex";
import { useRouter } from "next/navigation";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from '@mui/material/styles';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import ShareIcon from '@mui/icons-material/Share';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';
import LinearProgress from '@mui/material/LinearProgress';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import ShareRoundedIcon from '@mui/icons-material/ShareRounded';
import BlockRoundedIcon from '@mui/icons-material/BlockRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';

interface JobPosting {
  id: string;
  title: string;
  job_type: string;
  work_model: string;
  location: string;
  stage_counts: {
    new: number;
    skill_assessment: number;
    interviews: number;
    acceptance: number;
    rejection: number;
  };
  status: string;
}

interface JobPostingsProps {
  statusFilter: "all" | "active" | "close";
  setStatusFilter: (value: "all" | "active" | "close") => void;
  jobPostings: JobPosting[];
  customStyle?: React.CSSProperties;
  isLoading?: boolean;
}

interface FilterState {
  jobTitle: string;
  location: string;
  workModel: string;
  jobType: string;
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  borderBottom: "1px solid rgba(17,17,17,0.082)",
  // '&:last-child': {
  //   border: 0,
  // },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  cursor: "pointer",
  transition: "background-color 0.2s ease-in-out",
  "td, th": {
    borderBottom: "1px solid rgba(17,17,17,0.082)",
  },
  "&:not(thead tr):hover": {
    backgroundColor: theme.palette.secondary.light,
  },
  "& .MuiTouchRipple-root": {
    display: "none",
  },
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
  color: "rgba(17, 17, 17, 0.92)",
  fontSize: " 18px",
  fontWeight: 600,
  lineHeight: "100%",
  letterSpacing: "0.27px",
  marginBottom: "16px",
}));

const StyledSubtitleTypography = styled(Typography)(({ theme }) => ({
  fontSize: "13px",
  borderRadius: "28px",
  background: theme.palette.secondary.light,
  padding: "8px 12px",
  width: "max-content",
  textAlign: "center",
  color: theme.palette.primary.main,
  fontWeight: 400,
  transition: "all 0.2s ease-in-out",
  ".MuiTableRow-root:hover &": {
    background: theme.palette.secondary.dark,
    fontWeight: 500,
  },
}));

const StyledTableHeaderCell = styled(TableCell)(({ theme }) => ({
  color: "rgba(17, 17, 17, 0.62)",
  fontSize: "14px",
  fontStyle: "normal",
  fontWeight: 400,
  lineHeight: "100%", // 14px
  letterSpacing: "0.14px",
  leadingTrim: "both",
  textEdge: "cap",
}));

const StyledTabs = styled(Tabs)(({ theme }) => ({
  display: "inline-flex",
  padding: "6px",
  flexDirection: "row",
  alignItems: "center",
  gap: "10px",
  borderRadius: "8px",
  background: theme.palette.secondary.light,
  minHeight: "28px",
  width: "100%",

  "& .Mui-selected": {
    color: "white !important",
    fontWeight: 500,
    fontSize: "14px",
  },
  "& .MuiTabs-indicator": {
    display: "block",
    height: "100%",
    width: "100%",
    background: theme.palette.secondary.main,
    color: "white",
    zIndex: 0,
    borderRadius: "4px",
  },
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  display: "flex",
  padding: "9px 12px",
  justifyContent: "center",
  alignItems: "center",
  gap: "10px",
  position: "relative",
  zIndex: 1,
  flex: 1,
  minHeight: "28px",
  color: theme.palette.grey[100],
  transition: "color 0.2s ease-in-out",
  "&:hover": {
    color: theme.palette.primary.main,
  },
  "&.Mui-selected": {
    color: "white !important",
  },
}));

const StyledTableHeaderRow = styled(TableRow)(({ theme }) => ({
  th: {
    borderBottom: "1px solid rgba(17,17,17,0.082)",
  },
}));

const StyledTableBodyRow = styled(TableRow)(({ theme }) => ({
  display: "table-row",
  width: "100%",
  cursor: "pointer",
  transition: "background-color 0.2s ease-in-out",
  td: {
    borderBottom: "1px solid rgba(17,17,17,0.082)",
  },
  "&:hover": {
    backgroundColor: theme.palette.secondary.light,
  },
}));

const ShareModal = React.memo(({ open, onClose, jobTitle, jobId }: { open: boolean; onClose: () => void; jobTitle: string; jobId: string }) => {
  const theme = useTheme();
  const jobUrl = useMemo(() => `${process.env.NEXT_PUBLIC_HOST}/job-openings/${jobId}`, [jobId]);
  const shareText = useMemo(() => `Check out this job opportunity: ${jobTitle}`, [jobTitle]);

  const handleShare = (platform: string) => {
    let shareUrl = '';
    switch (platform) {
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(jobUrl)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(jobUrl)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${jobUrl}`)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(jobUrl);
        break;
    }
    if (shareUrl) {
      window.open(shareUrl, '_blank');
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      TransitionProps={{ timeout: 0 }}
    >
      <DialogTitle sx={{ 
        fontSize: '20px',
        fontWeight: 600,
        color: 'rgba(17, 17, 17, 0.92)',
        pb: 1
      }}>
        Share Job Posting
      </DialogTitle>
      <DialogContent>
        <List>
          <ListItem 
            button 
            onClick={() => handleShare('linkedin')}
            sx={{
              borderRadius: '8px',
              mb: 1,
              '&:hover': {
                backgroundColor: 'rgba(68, 68, 226, 0.04)',
              }
            }}
          >
            <ListItemIcon>
              <LinkedInIcon sx={{ color: '#0077B5' }} />
            </ListItemIcon>
            <ListItemText 
              primary="Share on LinkedIn"
              primaryTypographyProps={{
                color: 'rgba(17, 17, 17, 0.92)',
                fontSize: '16px',
                fontWeight: 500
              }}
            />
          </ListItem>
          <ListItem 
            button 
            onClick={() => handleShare('twitter')}
            sx={{
              borderRadius: '8px',
              mb: 1,
              '&:hover': {
                backgroundColor: 'rgba(68, 68, 226, 0.04)',
              }
            }}
          >
            <ListItemIcon>
              <TwitterIcon sx={{ color: '#1DA1F2' }} />
            </ListItemIcon>
            <ListItemText 
              primary="Share on Twitter"
              primaryTypographyProps={{
                color: 'rgba(17, 17, 17, 0.92)',
                fontSize: '16px',
                fontWeight: 500
              }}
            />
          </ListItem>
          <ListItem 
            button 
            onClick={() => handleShare('whatsapp')}
            sx={{
              borderRadius: '8px',
              mb: 1,
              '&:hover': {
                backgroundColor: 'rgba(68, 68, 226, 0.04)',
              }
            }}
          >
            <ListItemIcon>
              <WhatsAppIcon sx={{ color: '#25D366' }} />
            </ListItemIcon>
            <ListItemText 
              primary="Share on WhatsApp"
              primaryTypographyProps={{
                color: 'rgba(17, 17, 17, 0.92)',
                fontSize: '16px',
                fontWeight: 500
              }}
            />
          </ListItem>
          <Divider sx={{ my: 1 }} />
          <ListItem 
            button 
            onClick={() => handleShare('copy')}
            sx={{
              borderRadius: '8px',
              '&:hover': {
                backgroundColor: 'rgba(68, 68, 226, 0.04)',
              }
            }}
          >
            <ListItemIcon>
              <ContentCopyIcon sx={{ color: theme.palette.primary.main }} />
            </ListItemIcon>
            <ListItemText 
              primary="Copy Link"
              primaryTypographyProps={{
                color: 'rgba(17, 17, 17, 0.92)',
                fontSize: '16px',
                fontWeight: 500
              }}
            />
          </ListItem>
        </List>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button 
          onClick={onClose}
          sx={{
            color: 'rgba(17, 17, 17, 0.72)',
            textTransform: 'none',
            fontSize: '14px',
            fontWeight: 400,
            '&:hover': {
              backgroundColor: 'rgba(68, 68, 226, 0.04)',
              color: theme.palette.primary.main,
            }
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
});

ShareModal.displayName = 'ShareModal';

const JobPostings = () => {
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([]);
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "close">("active");
  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    jobTitle: '',
    location: '',
    workModel: '',
    jobType: '',
  });
  const [tempFilters, setTempFilters] = useState<FilterState>({
    jobTitle: '',
    location: '',
    workModel: '',
    jobType: '',
  });
  const [tempStatusFilter, setTempStatusFilter] = useState<"all" | "active" | "close">("active");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  useEffect(() => {
    const fetchJobPostings = async () => {
      setIsLoading(true);
      const token = localStorage.getItem("jwt");
      let url = "https://app.elevatehr.ai/wp-json/elevatehr/v1/jobs";
      if (statusFilter !== "all") {
        url += `?status=${statusFilter}`;
      }
      try {
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          cache: "no-store",
        });
        const data = await response.json();
        setJobPostings(data);
      } catch (error) {
        console.error("Error fetching job postings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobPostings();
  }, [statusFilter]);

  const handleStatusChange = (
    _event: React.SyntheticEvent,
    newValue: "all" | "active" | "close"
  ) => {
    setTempStatusFilter(newValue);
  };

  const handleFilterChange = (filterName: keyof FilterState, value: string) => {
    setTempFilters(prev => ({
      ...prev,
      [filterName]: value,
    }));
  };

  const clearFilters = () => {
    setTempFilters({
      jobTitle: '',
      location: '',
      workModel: '',
      jobType: '',
    });
    setTempStatusFilter("active");
  };

  const applyFilters = () => {
    setFilters(tempFilters);
    setStatusFilter(tempStatusFilter);
  };

  const hasActiveFilters = () => {
    return (
      tempStatusFilter !== "active" ||
      tempFilters.jobTitle !== "" ||
      tempFilters.location !== "" ||
      tempFilters.workModel !== "" ||
      tempFilters.jobType !== ""
    );
  };

  const filteredJobPostings = jobPostings.filter(job => {
    if (filters.jobTitle && !job.title.toLowerCase().includes(filters.jobTitle.toLowerCase())) {
      return false;
    }
    if (filters.location && !job.location.toLowerCase().includes(filters.location.toLowerCase())) {
      return false;
    }
    if (filters.workModel && job.work_model !== filters.workModel) {
      return false;
    }
    if (filters.jobType && job.job_type !== filters.jobType) {
      return false;
    }

    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      return (
        job.title.toLowerCase().includes(searchLower) ||
        job.location.toLowerCase().includes(searchLower) ||
        job.job_type.toLowerCase().includes(searchLower) ||
        job.work_model.toLowerCase().includes(searchLower)
      );
    }

    return true;
  });

  const copyToClipboard = (jobId: string) => {
    const link = `${process.env.NEXT_PUBLIC_HOST}/job-openings/${jobId}`;
    navigator.clipboard.writeText(link).then(() => {
      // You could add a toast notification here if desired
    });
  };

  const handleQuickActionsClick = (event: React.MouseEvent<HTMLElement>, job: JobPosting) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedJob(job);
  };

  const handleQuickActionsClose = () => {
    setAnchorEl(null);
    setSelectedJob(null);
  };

  const handleShareClick = () => {
    handleQuickActionsClose();
    setShareModalOpen(true);
  };

  const handleViewSubmissions = () => {
    if (selectedJob) {
      router.push(`/dashboard/job-posting/${selectedJob.id}/submissions`);
    }
    handleQuickActionsClose();
  };

  const handleEdit = () => {
    if (selectedJob) {
      router.push(`/dashboard/create-job-posting/${selectedJob.id}`);
    }
    handleQuickActionsClose();
  };

  const handleToggleStatus = async () => {
    if (!selectedJob) return;
    
    try {
      const token = localStorage.getItem("jwt");
      const newStatus = selectedJob.status === "active" ? "close" : "active";
      
      await fetch(`https://app.elevatehr.ai/wp-json/elevatehr/v1/jobs/${selectedJob.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      // Refresh the job listings
      const response = await fetch("https://app.elevatehr.ai/wp-json/elevatehr/v1/jobs", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });
      const data = await response.json();
      setJobPostings(data);
    } catch (error) {
      console.error("Error updating job status:", error);
    }
    
    handleQuickActionsClose();
  };

  const renderTableContent = () => {
    if (isLoading) {
      return (
        <>
          {[1, 2, 3, 4, 5].map((index) => (
            <StyledTableBodyRow key={index}>
              <StyledTableCell>
                <Stack>
                  <Skeleton variant="text" width={200} height={24} />
                  <Stack direction="row" gap={1} sx={{ mt: 2 }}>
                    <Skeleton
                      variant="rectangular"
                      width={80}
                      height={28}
                      sx={{ borderRadius: "28px" }}
                    />
                    <Skeleton
                      variant="rectangular"
                      width={80}
                      height={28}
                      sx={{ borderRadius: "28px" }}
                    />
                    <Skeleton
                      variant="rectangular"
                      width={80}
                      height={28}
                      sx={{ borderRadius: "28px" }}
                    />
                  </Stack>
                </Stack>
              </StyledTableCell>
              <StyledTableCell>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Skeleton variant="text" width={40} height={24} />
                </Box>
              </StyledTableCell>
              <StyledTableCell>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Skeleton variant="text" width={40} height={24} />
                </Box>
              </StyledTableCell>
              <StyledTableCell>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Skeleton variant="text" width={40} height={24} />
                </Box>
              </StyledTableCell>
              <StyledTableCell>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Skeleton variant="text" width={40} height={24} />
                </Box>
              </StyledTableCell>
              <StyledTableCell>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Skeleton variant="text" width={40} height={24} />
                </Box>
              </StyledTableCell>
              <StyledTableCell>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Skeleton variant="text" width={40} height={24} />
                </Box>
              </StyledTableCell>
            </StyledTableBodyRow>
          ))}
        </>
      );
    }

    return filteredJobPostings?.map((job) => (
      <StyledTableBodyRow
        key={job.id}
      >
        <StyledTableCell>
          <Stack>
            <Stack direction="row" alignItems="center" gap={1}>
              <StyledTypography textTransform={"capitalize"}>
                {job.title}
              </StyledTypography>
              <Tooltip 
                title="Click to copy application page link" 
                arrow
                placement="top"
                componentsProps={{
                  tooltip: {
                    sx: {
                      bgcolor: theme.palette.primary.main,
                      color: theme.palette.secondary.light,
                      border: `1px solid ${theme.palette.primary.main}`,
                      borderRadius: '12px',
                      '& .MuiTooltip-arrow': {
                        color: theme.palette.primary.main,
                      }
                    }
                  }
                }}
              >
                <IconButton 
                  size="small" 
                  onClick={(e) => {
                    e.stopPropagation();
                    copyToClipboard(job.id);
                  }}
                  sx={{
                    color: 'rgba(17, 17, 17, 0.48)',
                    padding: '3px',
                    marginTop: '-10px',
                    marginLeft: '-2px',
                    '&:hover': {
                      backgroundColor: 'rgba(68, 68, 226, 0.04)',
                      color: theme.palette.primary.main,
                    }
                  }}
                >
                  <ContentCopyRoundedIcon sx={{ fontSize: '16px' }} />
                </IconButton>
              </Tooltip>
            </Stack>
            <Stack direction="row" gap={2}>
              <Stack 
                direction="row" 
                alignItems="center" 
                spacing={1}
                sx={{
                  backgroundColor: '#FCEBE3',
                  padding: '6px 12px',
                  borderRadius: '20px',
                }}
              >
                <Typography sx={{ 
                  fontSize: '14px',
                  color: '#724A3B',
                  fontWeight: 400
                }}>
                  {job.job_type}
                </Typography>
              </Stack>
              <Stack 
                direction="row" 
                alignItems="center" 
                spacing={1}
                sx={{
                  backgroundColor: '#D7EEF4',
                  padding: '6px 12px',
                  borderRadius: '20px',
                }}
              >
                <Typography sx={{ 
                  fontSize: '14px',
                  color: '#2B656E',
                  fontWeight: 400
                }}>
                  {job.location}
                </Typography>
              </Stack>
              <Stack 
                direction="row" 
                alignItems="center" 
                spacing={1}
                sx={{
                  backgroundColor: '#F9E8F3',
                  padding: '6px 12px',
                  borderRadius: '20px',
                }}
              >
                <Typography sx={{ 
                  fontSize: '14px',
                  color: '#76325F',
                  fontWeight: 400
                }}>
                  {job.work_model}
                </Typography>
              </Stack>
            </Stack>
          </Stack>
        </StyledTableCell>
        <StyledTableCell>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box>
              <Typography
                color="rgba(17, 17, 17, 0.84)"
                fontWeight={500}
                fontSize={"16px"}
              >
                {job.stage_counts.new}
              </Typography>
            </Box>
          </Box>
        </StyledTableCell>
        <StyledTableCell>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box>
              <Typography
                color="rgba(17, 17, 17, 0.84)"
                fontWeight={500}
                fontSize={"16px"}
              >
                {job.stage_counts.skill_assessment}
              </Typography>
            </Box>
          </Box>
        </StyledTableCell>
        <StyledTableCell>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box>
              <Typography
                color="rgba(17, 17, 17, 0.84)"
                fontWeight={500}
                fontSize={"16px"}
              >
                {job.stage_counts.interviews}
              </Typography>
            </Box>
          </Box>
        </StyledTableCell>
        <StyledTableCell>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box>
              <Typography
                color="rgba(17, 17, 17, 0.84)"
                fontWeight={500}
                fontSize={"16px"}
              >
                {job.stage_counts.acceptance}
              </Typography>
            </Box>
          </Box>
        </StyledTableCell>
        <StyledTableCell>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box>
              <Typography
                color="rgba(17, 17, 17, 0.84)"
                fontWeight={500}
                fontSize={"16px"}
              >
                {job.stage_counts.rejection}
              </Typography>
            </Box>
          </Box>
        </StyledTableCell>
        <StyledTableCell>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Button
              variant="outlined"
              size="small"
              onClick={(e) => handleQuickActionsClick(e, job)}
              endIcon={<KeyboardArrowDownIcon />}
              sx={{
                color: 'rgba(17, 17, 17, 0.72)',
                borderColor: 'rgba(17, 17, 17, 0.12)',
                textTransform: 'none',
                fontSize: '14px',
                padding: '4px 12px',
                '&:hover': {
                  borderColor: theme.palette.primary.main,
                  color: theme.palette.primary.main,
                  backgroundColor: 'rgba(68, 68, 226, 0.04)',
                }
              }}
            >
              Quick Actions
            </Button>
          </Box>
        </StyledTableCell>
      </StyledTableBodyRow>
    ));
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
            }}>
              Job Listings
            </Typography>
          </Box>
        </Box>

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
                  Job Title
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Search by Job Title"
                  value={tempFilters.jobTitle}
                  onChange={(e) => handleFilterChange("jobTitle", e.target.value)}
                  sx={{
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
                  Location
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Search by Location"
                  value={tempFilters.location}
                  onChange={(e) => handleFilterChange("location", e.target.value)}
                  sx={{
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
                  Work Model
                </Typography>
                <FormControl fullWidth>
                  <Select
                    value={tempFilters.workModel}
                    onChange={(e) => handleFilterChange("workModel", e.target.value)}
                    displayEmpty
                    sx={{
                      backgroundColor: '#fff',
                      borderRadius: '12px',
                      border: '1px solid rgba(17, 17, 17, 0.08)',
                      '& .MuiSelect-select': {
                        padding: '16px',
                        color: 'rgba(17, 17, 17, 0.84)',
                      },
                      '& fieldset': {
                        border: 'none',
                      },
                      '&:hover fieldset': {
                        border: 'none',
                      },
                      '&.Mui-focused fieldset': {
                        border: 'none',
                      }
                    }}
                  >
                    <MenuItem value="">All Work Models</MenuItem>
                    <MenuItem value="Remote">Remote</MenuItem>
                    <MenuItem value="Hybrid">Hybrid</MenuItem>
                    <MenuItem value="On-site">On-site</MenuItem>
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
                  Job Type
                </Typography>
                <FormControl fullWidth>
                  <Select
                    value={tempFilters.jobType}
                    onChange={(e) => handleFilterChange("jobType", e.target.value)}
                    displayEmpty
                    sx={{
                      backgroundColor: '#fff',
                      borderRadius: '12px',
                      border: '1px solid rgba(17, 17, 17, 0.08)',
                      '& .MuiSelect-select': {
                        padding: '16px',
                        color: 'rgba(17, 17, 17, 0.84)',
                      },
                      '& fieldset': {
                        border: 'none',
                      },
                      '&:hover fieldset': {
                        border: 'none',
                      },
                      '&.Mui-focused fieldset': {
                        border: 'none',
                      }
                    }}
                  >
                    <MenuItem value="">All Job Types</MenuItem>
                    <MenuItem value="Full-time">Full-time</MenuItem>
                    <MenuItem value="Part-time">Part-time</MenuItem>
                    <MenuItem value="Contract">Contract</MenuItem>
                    <MenuItem value="Internship">Internship</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <Box sx={{ mt: 4 }}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={applyFilters}
                  disabled={!hasActiveFilters()}
                  sx={{
                    backgroundColor: theme.palette.primary.main,
                    color: '#fff',
                    padding: '12px',
                    borderRadius: '12px',
                    textTransform: 'none',
                    fontSize: '16px',
                    fontWeight: 500,
                    '&:hover': {
                      backgroundColor: theme.palette.primary.dark,
                    },
                    '&.Mui-disabled': {
                      backgroundColor: 'rgba(17, 17, 17, 0.12)',
                      color: 'rgba(17, 17, 17, 0.38)',
                    }
                  }}
                >
                  Apply Filters
                </Button>
              </Box>
            </Paper>
          </Box>

          <Box sx={{ flexGrow: 1 }}>
    <DashboardCard customStyle={{ padding: "0px" }}>
      <Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px",
          }}
        >
          <Stack direction={"row"} alignItems={"center"} gap={1}>
            <Typography
              variant="h2"
              fontWeight={"semibold"}
              fontSize={"24px"}
              color={"rgba(17,17,17,0.92)"}
              letterSpacing={"0.12px"}
            >
              Job Listings
            </Typography>
            <Typography
              variant="h2"
              fontWeight={"semibold"}
              fontSize={"24px"}
              color={"rgba(17,17,17,0.52)"}
              letterSpacing={"0.12px"}
            >
                      {`(${filteredJobPostings.length})`}
            </Typography>
          </Stack>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <FormControl sx={{ minWidth: 150 }}>
                      <Select
                        value={tempStatusFilter}
                        onChange={(e) => handleStatusChange(e as any, e.target.value as "all" | "active" | "close")}
                        displayEmpty
                        sx={{
                          backgroundColor: '#fff',
                          borderRadius: '12px',
                          border: '1px solid rgba(17, 17, 17, 0.08)',
                          height: '40px',
                          '& .MuiSelect-select': {
                            padding: '0 16px',
                            color: 'rgba(17, 17, 17, 0.84)',
                          },
                          '& fieldset': {
                            border: 'none',
                          },
                          '&:hover fieldset': {
                            border: 'none',
                          },
                          '&.Mui-focused fieldset': {
                            border: 'none',
                          }
                        }}
                      >
                        <MenuItem value="all">All Status</MenuItem>
                        <MenuItem value="active">Active</MenuItem>
                        <MenuItem value="close">Closed</MenuItem>
                      </Select>
                    </FormControl>
                    <TextField
                      placeholder="Search jobs..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      sx={{
                        width: '300px',
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
                          padding: '12px 16px',
                          color: 'rgba(17, 17, 17, 0.84)',
                          '&::placeholder': {
                            color: 'rgba(17, 17, 17, 0.48)',
                          }
                        }
                      }}
                    />
                    <Box sx={{ 
                      display: 'flex',
                      bgcolor: 'rgba(17, 17, 17, 0.04)',
                      borderRadius: '12px',
                      p: 0.5,
                      minHeight: '40px',
                      transition: 'all 0.3s ease-in-out'
                    }}>
                      <Tabs
                        value={viewMode}
                        onChange={(_, newValue) => setViewMode(newValue)}
                        sx={{
                          minHeight: '40px',
                          '& .MuiTabs-indicator': {
                            display: 'none',
                          },
                          '& .MuiTab-root': {
                            minHeight: '40px',
                            minWidth: '40px',
                            padding: '8px',
                            color: 'rgba(17, 17, 17, 0.48)',
                            transition: 'all 0.3s ease-in-out',
                            '&.Mui-selected': {
                              color: theme.palette.primary.main,
                              backgroundColor: '#fff',
                              borderRadius: '8px',
                              boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
                              transform: 'scale(1.05)',
                            },
                            '&:hover': {
                              color: theme.palette.primary.main,
                              transform: 'scale(1.05)',
                            }
                          }
                        }}
                      >
                        <Tab 
                          value="list" 
                          icon={<ViewListIcon />}
                          aria-label="list view"
                        />
                        <Tab 
                          value="grid" 
                          icon={<ViewModuleIcon />}
                          aria-label="grid view"
                        />
                      </Tabs>
                    </Box>
                  </Stack>
        </Box>
        <Box sx={{ overflow: "auto" }}>
                  {viewMode === 'list' ? (
          <Box sx={{ width: "100%", display: "table", tableLayout: "fixed" }}>
            <Table>
              <TableHead>
                <StyledTableHeaderRow>
                  <StyledTableHeaderCell>Role</StyledTableHeaderCell>
                  <StyledTableHeaderCell>Applicants</StyledTableHeaderCell>
                  <StyledTableHeaderCell>Assessment</StyledTableHeaderCell>
                  <StyledTableHeaderCell>Interviews</StyledTableHeaderCell>
                  <StyledTableHeaderCell>Accepted</StyledTableHeaderCell>
                  <StyledTableHeaderCell>Rejected</StyledTableHeaderCell>
                            <StyledTableHeaderCell>Actions</StyledTableHeaderCell>
                </StyledTableHeaderRow>
              </TableHead>
              <TableBody>{renderTableContent()}</TableBody>
            </Table>
          </Box>
                  ) : (
                    <Box sx={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                      gap: 2,
                      p: 2
                    }}>
                      {filteredJobPostings.map((job) => (
                        <Paper 
                          key={job.id}
                          elevation={0}
                          sx={{ 
                            p: 2,
                            borderRadius: 2,
                            border: '1px solid rgba(17, 17, 17, 0.08)',
                            '&:hover': {
                              borderColor: theme.palette.primary.main,
                              backgroundColor: 'rgba(68, 68, 226, 0.04)',
                            }
                          }}
                        >
                          <Stack spacing={2}>
                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                              <Chip 
                                label={job.status === 'active' ? 'Open' : 'Closed'} 
                                size="small"
                                sx={{
                                  backgroundColor: job.status === 'active' ? 'rgba(68, 226, 139, 0.12)' : 'rgba(17, 17, 17, 0.12)',
                                  color: job.status === 'active' ? '#1B8B4A' : 'rgba(17, 17, 17, 0.72)',
                                  fontWeight: 500,
                                  borderRadius: '16px',
                                }}
                              />
                              <IconButton
                                size="small"
                                onClick={(e) => handleQuickActionsClick(e, job)}
                                sx={{
                                  color: 'rgba(17, 17, 17, 0.48)',
                                  padding: '6px',
                                  '&:hover': {
                                    backgroundColor: 'rgba(68, 68, 226, 0.04)',
                                    color: theme.palette.primary.main,
                                  }
                                }}
                              >
                                <MoreVertRoundedIcon sx={{ fontSize: '20px' }} />
                              </IconButton>
                            </Stack>
                            
                            <Box>
                              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
                                <Typography variant="h6" sx={{ 
                                  fontWeight: 600,
                                  fontSize: '18px',
                                  color: 'rgba(17, 17, 17, 0.92)'
                                }}>
                                  {job.title}
                                </Typography>
                                <Tooltip 
                                  title="Click to copy application page link" 
                                  arrow
                                  placement="top"
                                  componentsProps={{
                                    tooltip: {
                                      sx: {
                                        bgcolor: theme.palette.primary.main,
                                        color: theme.palette.secondary.light,
                                        border: `1px solid ${theme.palette.primary.main}`,
                                        borderRadius: '12px',
                                        '& .MuiTooltip-arrow': {
                                          color: theme.palette.primary.main,
                                        }
                                      }
                                    }
                                  }}
                                >
                                  <IconButton 
                                    size="small" 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      copyToClipboard(job.id);
                                    }}
                                    sx={{
                                      color: 'rgba(17, 17, 17, 0.48)',
                                      padding: '2px',
                                      '&:hover': {
                                        backgroundColor: 'rgba(68, 68, 226, 0.04)',
                                        color: theme.palette.primary.main,
                                      }
                                    }}
                                  >
                                    <ContentCopyRoundedIcon sx={{ fontSize: '16px' }} />
                                  </IconButton>
                                </Tooltip>
                              </Stack>

                              <Stack spacing={1} sx={{ mb: 2 }}>
                                <Stack direction="row" alignItems="center" spacing={1}>
                                  <Typography sx={{ 
                                    fontSize: '14px',
                                    color: 'rgba(17, 17, 17, 0.72)'
                                  }}>
                                    {job.job_type}
                                  </Typography>
                                </Stack>
                                <Stack direction="row" alignItems="center" spacing={1}>
                                  <LocationOnIcon sx={{ fontSize: '16px', color: 'rgba(17, 17, 17, 0.48)' }} />
                                  <Typography sx={{ 
                                    fontSize: '14px',
                                    color: 'rgba(17, 17, 17, 0.72)'
                                  }}>
                                    {job.location}
                                  </Typography>
                                </Stack>
                                <Stack direction="row" alignItems="center" spacing={1}>
                                  <Typography sx={{ 
                                    fontSize: '14px',
                                    color: 'rgba(17, 17, 17, 0.72)'
                                  }}>
                                    {job.work_model}
                                  </Typography>
                                </Stack>
                              </Stack>
                            </Box>

                            <Box sx={{ 
                              p: 2, 
                              bgcolor: 'rgba(17, 17, 17, 0.04)', 
                              borderRadius: 2
                            }}>
                              <Grid container spacing={2}>
                                <Grid item xs={6}>
                                  <Box>
                                    <Typography variant="body2" sx={{ 
                                      color: 'rgba(17, 17, 17, 0.72)',
                                      fontSize: '13px',
                                      mb: 0.5
                                    }}>
                                      Applied
                                    </Typography>
                                    <Typography sx={{ 
                                      fontSize: '24px',
                                      fontWeight: 600,
                                      color: 'rgba(17, 17, 17, 0.92)'
                                    }}>
                                      {job.stage_counts.new}
                                    </Typography>
                                  </Box>
                                </Grid>
                                <Grid item xs={6}>
                                  <Box>
                                    <Typography variant="body2" sx={{ 
                                      color: 'rgba(17, 17, 17, 0.72)',
                                      fontSize: '13px',
                                      mb: 0.5
                                    }}>
                                      Assessment
                                    </Typography>
                                    <Typography sx={{ 
                                      fontSize: '24px',
                                      fontWeight: 600,
                                      color: 'rgba(17, 17, 17, 0.92)'
                                    }}>
                                      {job.stage_counts.skill_assessment}
                                    </Typography>
                                  </Box>
                                </Grid>
                                <Grid item xs={6}>
                                  <Box>
                                    <Typography variant="body2" sx={{ 
                                      color: 'rgba(17, 17, 17, 0.72)',
                                      fontSize: '13px',
                                      mb: 0.5
                                    }}>
                                      Interviewed
                                    </Typography>
                                    <Typography sx={{ 
                                      fontSize: '24px',
                                      fontWeight: 600,
                                      color: 'rgba(17, 17, 17, 0.92)'
                                    }}>
                                      {job.stage_counts.interviews}
                                    </Typography>
                                  </Box>
                                </Grid>
                                <Grid item xs={6}>
                                  <Box>
                                    <Typography variant="body2" sx={{ 
                                      color: 'rgba(17, 17, 17, 0.72)',
                                      fontSize: '13px',
                                      mb: 0.5
                                    }}>
                                      Accepted
                                    </Typography>
                                    <Typography sx={{ 
                                      fontSize: '24px',
                                      fontWeight: 600,
                                      color: 'rgba(17, 17, 17, 0.92)'
                                    }}>
                                      {job.stage_counts.acceptance}
                                    </Typography>
                                  </Box>
                                </Grid>
                              </Grid>
                            </Box>
                          </Stack>
                        </Paper>
                      ))}
                    </Box>
                  )}
        </Box>
      </Box>
    </DashboardCard>
          </Box>
        </Stack>
      </Container>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleQuickActionsClose}
        onClick={(e) => e.stopPropagation()}
        PaperProps={{
          sx: {
            mt: 1,
            borderRadius: '12px',
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
            minWidth: '200px',
          }
        }}
      >
        <MenuItem 
          onClick={handleViewSubmissions}
          sx={{
            py: 1.5,
            px: 2,
            '&:hover': {
              backgroundColor: 'rgba(68, 68, 226, 0.04)',
            }
          }}
        >
          <VisibilityRoundedIcon sx={{ 
            mr: 1.5, 
            color: 'rgba(17, 17, 17, 0.48)',
            fontSize: '20px'
          }} />
          <Typography sx={{ color: 'rgba(17, 17, 17, 0.92)', fontSize: '14px' }}>
            View Submissions
          </Typography>
        </MenuItem>
        <MenuItem 
          onClick={handleEdit}
          sx={{
            py: 1.5,
            px: 2,
            '&:hover': {
              backgroundColor: 'rgba(68, 68, 226, 0.04)',
            }
          }}
        >
          <EditRoundedIcon sx={{ 
            mr: 1.5, 
            color: 'rgba(17, 17, 17, 0.48)',
            fontSize: '20px'
          }} />
          <Typography sx={{ color: 'rgba(17, 17, 17, 0.92)', fontSize: '14px' }}>
            Edit
          </Typography>
        </MenuItem>
        <MenuItem 
          onClick={handleToggleStatus}
          sx={{
            py: 1.5,
            px: 2,
            '&:hover': {
              backgroundColor: 'rgba(68, 68, 226, 0.04)',
            }
          }}
        >
          {selectedJob?.status === "active" ? (
            <>
              <BlockRoundedIcon sx={{ 
                mr: 1.5, 
                color: 'rgba(17, 17, 17, 0.48)',
                fontSize: '20px'
              }} />
              <Typography sx={{ color: 'rgba(17, 17, 17, 0.92)', fontSize: '14px' }}>
                Close Job
              </Typography>
            </>
          ) : (
            <>
              <CheckCircleRoundedIcon sx={{ 
                mr: 1.5, 
                color: 'rgba(17, 17, 17, 0.48)',
                fontSize: '20px'
              }} />
              <Typography sx={{ color: 'rgba(17, 17, 17, 0.92)', fontSize: '14px' }}>
                Reopen Job
              </Typography>
            </>
          )}
        </MenuItem>
        <MenuItem 
          onClick={handleShareClick}
          sx={{
            py: 1.5,
            px: 2,
            '&:hover': {
              backgroundColor: 'rgba(68, 68, 226, 0.04)',
            }
          }}
        >
          <ShareRoundedIcon sx={{ 
            mr: 1.5, 
            color: 'rgba(17, 17, 17, 0.48)',
            fontSize: '20px'
          }} />
          <Typography sx={{ color: 'rgba(17, 17, 17, 0.92)', fontSize: '14px' }}>
            Share
          </Typography>
        </MenuItem>
      </Menu>

      {selectedJob && (
        <ShareModal
          open={shareModalOpen}
          onClose={() => setShareModalOpen(false)}
          jobTitle={selectedJob.title}
          jobId={selectedJob.id}
        />
      )}
    </Box>
  );
};

export default JobPostings;
