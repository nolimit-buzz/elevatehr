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
  ButtonBase,
  Button,
  TableContainer,
  TablePagination,
  Chip,
  IconButton,
} from "@mui/material";
import DashboardCard from "@/app/dashboard/components/shared/DashboardCard";
import zIndex from '@mui/material/styles/zIndex';
import { useRouter } from 'next/navigation';
import EditIcon from '@mui/icons-material/Edit';

interface JobPosting {
  id: number;
  title: string;
  job_type: string;
  work_model: string;
  location: string;
  level: string;
  status: 'active' | 'closed';
  stage_counts: {
    new: number;
    skill_assessment: number;
    interviews: number;
    acceptance: number;
    rejection: number;
  };
}

interface JobPostingsProps {
  customStyle?: React.CSSProperties;
  jobPostings: JobPosting[];
  statusFilter: 'all' | 'active' | 'closed';
  setStatusFilter: (status: 'all' | 'active' | 'closed') => void;
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
  background: theme.palette.secondary.light,
  padding: '8px 12px',
  width: 'max-content',
  textAlign: 'center',
  color: theme.palette.primary.main,
  fontWeight: 500,
  transition: 'background-color 0.2s ease-in-out',
  '.MuiTableRow-root:hover &': {
    background: theme.palette.secondary.dark
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

const StyledTableBodyRow = styled(ButtonBase)(({ theme }) => ({
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

const JobPostings = ({ customStyle, jobPostings, statusFilter, setStatusFilter }: JobPostingsProps) => {
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRowClick = (jobId: number) => {
    router.push(`/dashboard/create-job-posting/${jobId}`);
  };

  const filteredJobPostings = jobPostings.filter(job => {
    if (statusFilter === 'all') return true;
    return job.status === statusFilter;
  });

  return (
    <DashboardCard customStyle={customStyle}>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" fontWeight={600} color="rgba(17, 17, 17, 0.92)" fontSize={'20px'}>
            Job Postings
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {(['all', 'active', 'closed'] as const).map((status) => (
              <Button
                key={status}
                onClick={() => setStatusFilter(status)}
                sx={{
                  textTransform: 'capitalize',
                  color: statusFilter === status ? 'primary.main' : 'text.secondary',
                  fontWeight: statusFilter === status ? 600 : 400,
                  '&:hover': {
                    backgroundColor: 'transparent',
                  },
                }}
              >
                {status}
              </Button>
            ))}
          </Box>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Level</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredJobPostings
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((job) => (
                  <TableRow 
                    key={job.id}
                    hover
                    onClick={() => handleRowClick(job.id)}
                    sx={{ 
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: 'rgba(68, 68, 226, 0.04)',
                      },
                    }}
                  >
                    <TableCell>
                      <Typography variant="body2" fontWeight={500}>
                        {job.title}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {job.level}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {job.job_type}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {job.location}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={job.status}
                        color={job.status === 'active' ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton size="small" onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/dashboard/create-job-posting/${job.id}`);
                      }}>
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={filteredJobPostings.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
          sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}
        />
      </Box>
    </DashboardCard>
  );
};

export default JobPostings;
