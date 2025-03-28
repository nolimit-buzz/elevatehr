import React, { useState, useEffect } from 'react';
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
} from "@mui/material";
import DashboardCard from "@/app/dashboard/components/shared/DashboardCard";
import zIndex from '@mui/material/styles/zIndex';
import { useRouter } from 'next/navigation';

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
}

interface JobPostingsProps {
  statusFilter: 'all' | 'active' | 'close';
  setStatusFilter: (value: 'all' | 'active' | 'close') => void;
  jobPostings: JobPosting[];
  customStyle?: React.CSSProperties;
  isLoading?: boolean;
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  borderBottom: '1px solid rgba(17,17,17,0.082)',
  // '&:last-child': {
  //   border: 0,
  // },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  cursor: 'pointer',
  transition: 'background-color 0.2s ease-in-out',
  'td, th': {
    borderBottom: '1px solid rgba(17,17,17,0.082)',
  },
  '&:not(thead tr):hover': {
    backgroundColor: theme.palette.secondary.light,
  },
  '& .MuiTouchRipple-root': {
    display: 'none',
  },
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
  color: 'rgba(17, 17, 17, 0.92)',
  fontSize: ' 18px',
  fontWeight: 600,
  lineHeight: '100%',
  letterSpacing: '0.27px',
  marginBottom: '16px',
}));

const StyledSubtitleTypography = styled(Typography)(({ theme }) => ({
  fontSize: '13px',
  borderRadius: '28px',
  padding: '8px 12px',
  width: 'max-content',
  textAlign: 'center',
  fontWeight: 400,
  transition: 'all 0.2s ease-in-out',
  '&:nth-of-type(1)': {
    backgroundColor: '#FCEBE3',
    color: '#724A3B',
  },
  '&:nth-of-type(2)': {
    backgroundColor: '#F9E8F3',
    color: '#76325F',
  },
  '&:nth-of-type(3)': {
    backgroundColor: '#D7EEF4',
    color: '#2B656E',
  },
  '.MuiTableRow-root:hover &': {
    fontWeight: 500
  }
}));

const StyledTableHeaderCell = styled(TableCell)(({ theme }) => ({
  color: 'rgba(17, 17, 17, 0.62)',
  fontSize: '14px',
  fontStyle: 'normal',
  fontWeight: 400,
  lineHeight: '100%', // 14px
  letterSpacing: '0.14px',
  leadingTrim: 'both',
  textEdge: 'cap',
}));

const StyledTabs = styled(Tabs)(({ theme }) => ({
  display: 'inline-flex',
  padding: '6px',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '10px',
  borderRadius: '8px',
  background: theme.palette.secondary.light,
  minHeight: '28px',

  '& .Mui-selected': {
    color: 'white !important',
    fontWeight: 500,
    fontSize: '14px',
  },
  '& .MuiTabs-indicator': {
    display: 'block',
    height: '100%',
    width: '100%',
    background: theme.palette.secondary.main,
    color: 'white',
    zIndex: 0,
    borderRadius: '4px',

  }
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  display: 'flex',
  padding: '9px 12px',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '10px',
  position: 'relative',
  zIndex: 1,
  width: '80px',
  minWidth: 'max-content',
  minHeight: '28px',
  color: theme.palette.grey[100],
  transition: 'color 0.2s ease-in-out',
  '&:hover': {
    color: theme.palette.primary.main,
  },
  '&.Mui-selected': {
    color: 'white !important',
  }
}));

const StyledTableHeaderRow = styled(TableRow)(({ theme }) => ({
  'th': {
    borderBottom: '1px solid rgba(17,17,17,0.082)',
  }
}));

const StyledTableBodyRow = styled(TableRow)(({ theme }) => ({
  display: 'table-row',
  width: '100%',
  cursor: 'pointer',
  transition: 'background-color 0.2s ease-in-out',
  'td': {
    borderBottom: '1px solid rgba(17,17,17,0.082)',
  },
  '&:hover': {
    backgroundColor: theme.palette.secondary.light,
  },
}));

const JobPostings = ({ statusFilter, setStatusFilter, jobPostings, customStyle = {}, isLoading = false }: JobPostingsProps) => {
  const router = useRouter()
  
  const handleStatusChange = (_event: React.SyntheticEvent, newValue: 'all' | 'active' | 'close') => {
    setStatusFilter(newValue);
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
                  <Stack direction='row' gap={1} sx={{ mt: 2 }}>
                    <Skeleton variant="rectangular" width={80} height={28} sx={{ borderRadius: '28px' }} />
                    <Skeleton variant="rectangular" width={80} height={28} sx={{ borderRadius: '28px' }} />
                    <Skeleton variant="rectangular" width={80} height={28} sx={{ borderRadius: '28px' }} />
                  </Stack>
                </Stack>
              </StyledTableCell>
              <StyledTableCell>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: 'center' }}>
                  <Skeleton variant="text" width={40} height={24} />
                </Box>
              </StyledTableCell>
              <StyledTableCell>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: 'center' }}>
                  <Skeleton variant="text" width={40} height={24} />
                </Box>
              </StyledTableCell>
              <StyledTableCell>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: 'center' }}>
                  <Skeleton variant="text" width={40} height={24} />
                </Box>
              </StyledTableCell>
              <StyledTableCell>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: 'center' }}>
                  <Skeleton variant="text" width={40} height={24} />
                </Box>
              </StyledTableCell>
              <StyledTableCell>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: 'center' }}>
                  <Skeleton variant="text" width={40} height={24} />
                </Box>
              </StyledTableCell>
            </StyledTableBodyRow>
          ))}
        </>
      );
    }

    return jobPostings?.map((job) => (
      <StyledTableBodyRow 
        key={job.id} 
        onClick={() => router.push(`/dashboard/job-posting/${job.id}/submissions`)}
      >
        <StyledTableCell>
          <Stack>
            <StyledTypography textTransform={'capitalize'}>
              {job.title}
            </StyledTypography>
            <Stack direction='row' gap={1}>
              <StyledSubtitleTypography>
                {job.job_type}
              </StyledSubtitleTypography>
              <StyledSubtitleTypography>
                {job.work_model}
              </StyledSubtitleTypography>
              <StyledSubtitleTypography>
                {job.location}
              </StyledSubtitleTypography>
            </Stack>
          </Stack>
        </StyledTableCell>
        <StyledTableCell>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: 'center' }}>
            <Box>
              <Typography color="rgba(17, 17, 17, 0.84)" fontWeight={500} fontSize={'16px'}>
                {job.stage_counts.new}
              </Typography>
            </Box>
          </Box>
        </StyledTableCell>
        <StyledTableCell>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: 'center' }}>
            <Box>
              <Typography color="rgba(17, 17, 17, 0.84)" fontWeight={500} fontSize={'16px'}>
                {job.stage_counts.skill_assessment}
              </Typography>
            </Box>
          </Box>
        </StyledTableCell>
        <StyledTableCell>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: 'center' }}>
            <Box>
              <Typography color="rgba(17, 17, 17, 0.84)" fontWeight={500} fontSize={'16px'}>
                {job.stage_counts.interviews}
              </Typography>
            </Box>
          </Box>
        </StyledTableCell>
        <StyledTableCell>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: 'center' }}>
            <Box>
              <Typography color="rgba(17, 17, 17, 0.84)" fontWeight={500} fontSize={'16px'}>
                {job.stage_counts.acceptance}
              </Typography>
            </Box>
          </Box>
        </StyledTableCell>
        <StyledTableCell>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: 'center' }}>
            <Box>
              <Typography color="rgba(17, 17, 17, 0.84)" fontWeight={500} fontSize={'16px'}>
                {job.stage_counts.rejection}
              </Typography>
            </Box>
          </Box>
        </StyledTableCell>
      </StyledTableBodyRow>
    ));
  };

  return (
    <DashboardCard customStyle={{ padding: '0px', ...customStyle }}>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px' }}>
          <Stack direction={'row'} alignItems={'center'} gap={1}>
            <Typography variant="h2" fontWeight={'semibold'} fontSize={'24px'} color={'rgba(17,17,17,0.92)'} letterSpacing={'0.12px'}>
              Job Listings
            </Typography>
            <Typography variant="h2" fontWeight={'semibold'} fontSize={'24px'} color={'rgba(17,17,17,0.52)'} letterSpacing={'0.12px'}>
              {`(${jobPostings.length})`}
            </Typography>
          </Stack>
          <StyledTabs value={statusFilter} onChange={handleStatusChange} aria-label="job status tabs">
            <StyledTab label="All" value="all" />
            <StyledTab label="Active" value="active" />
            <StyledTab label="Closed" value="close" />
          </StyledTabs>
        </Box>
        <Box sx={{ overflow: "auto" }}>
          <Box sx={{ width: "100%", display: "table", tableLayout: "fixed" }}>
            <Table>
              <TableHead>
                <StyledTableHeaderRow>
                  <StyledTableHeaderCell>
                    Role
                  </StyledTableHeaderCell>
                  <StyledTableHeaderCell>
                    Applicants
                  </StyledTableHeaderCell>
                  <StyledTableHeaderCell>
                    Assessment
                  </StyledTableHeaderCell>
                  <StyledTableHeaderCell>
                    Interviews
                  </StyledTableHeaderCell>
                  <StyledTableHeaderCell>
                    Accepted
                  </StyledTableHeaderCell>
                  <StyledTableHeaderCell>
                    Rejected
                  </StyledTableHeaderCell>
                </StyledTableHeaderRow>
              </TableHead>
              <TableBody>
                {renderTableContent()}
              </TableBody>
            </Table>
          </Box>
        </Box>
      </Box>
    </DashboardCard>
  );
};

export default JobPostings;
