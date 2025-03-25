import React, { useMemo, useState } from 'react';
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
} from "@mui/material";
import { useRouter } from 'next/navigation';
import DashboardCard from "@/app/dashboard/components/shared/DashboardCard";
import zIndex from '@mui/material/styles/zIndex';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  borderBottom: '1px solid rgba(17,17,17,0.082)',
  // '&:last-child': {
  //   border: 0,
  // },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  cursor:'pointer',
  'td, th': {
    borderBottom: '1px solid rgba(17,17,17,0.082)',
  },
  // '&:last-child td, &:last-child th': {
  //   border: 0,
  // },
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
  background: '#EEEFF2',
  padding: '8px 12px',
  width: 'max-content',
  textAlign: 'center',
  color: 'rgba(17, 17, 17, 0.68)'
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
  width: 'max-content',
  minWidth: 'max-content',
  minHeight: '28px',
  color:theme.palette.grey[100]

}));

interface StageCount {
  new: number;
  skill_assessment: number;
  interviews: number;
  acceptance: number;
  archived: number;
  rejection: number;
}

interface JobPosting {
  id: number | string;
  title: string;
  status: string;
  location?: string;
  department?: string;
  applicants_count?: number;
  created_at?: string;
  job_type?: string;
  work_model?: string;
  stage_counts: StageCount;
}

interface JobPostingsProps {
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  jobPostings: JobPosting[];
  customStyle?: React.CSSProperties;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const JobPostings: React.FC<JobPostingsProps> = ({
  statusFilter,
  setStatusFilter,
  jobPostings,
  customStyle = {},
}) => {
  const router = useRouter();
  const [tabValue, setTabValue] = useState<number>(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number): void => {
    setTabValue(newValue);
  };

  const handleRowClick = (jobId: string | number): void => {
    router.push(`/dashboard/job-posting/${jobId}/submissions`);
  };

  const filteredJobPostings = useMemo(() => {
    return statusFilter === 'all'
      ? jobPostings
      : jobPostings.filter(job => job.status === statusFilter);
  }, [jobPostings, statusFilter]);

  return (
    <DashboardCard customStyle={{ padding: '0px', ...customStyle }}>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px' }}>
          <Stack direction={'row'} alignItems={'center'} gap={1}>
            <Typography variant="h2" fontWeight={'semibold'} fontSize={'24px'} color={'rgba(17,17,17,0.92)'} letterSpacing={'0.12px'}>
              Job Postings
            </Typography>
            <Typography variant="h2" fontWeight={'semibold'} fontSize={'24px'} color={'rgba(17,17,17,0.52)'} letterSpacing={'0.12px'}>
              {`(${jobPostings.length})`}
            </Typography>
          </Stack>
          <StyledTabs value={tabValue} onChange={handleTabChange} aria-label="job postings tabs">
            <StyledTab label="Active" value={0} />
            <StyledTab label="Archived" value={1} />
          </StyledTabs>
        </Box>
        <Box sx={{ overflow: "auto" }}>
          <Box sx={{ width: "100%", display: "table", tableLayout: "fixed" }}>
            <TabPanel value={tabValue} index={0}>
              <Table>
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Job Title</StyledTableCell>
                    <StyledTableCell>Location</StyledTableCell>
                    <StyledTableCell>Department</StyledTableCell>
                    <StyledTableCell>Applicants</StyledTableCell>
                    <StyledTableCell>Posted</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredJobPostings.map((job: JobPosting) => (
                    <StyledTableRow
                      key={job.id}
                      onClick={() => handleRowClick(job.id)}
                    >
                      <StyledTableCell>
                        <Stack>
                          <StyledTypography>
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
                      <StyledTableCell align="right">
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: 'center' }}>
                          <Box>
                            <Typography color="rgba(17, 17, 17, 0.84)" fontWeight={500} fontSize={'16px'}>
                              {job.stage_counts.acceptance}
                            </Typography>
                          </Box>
                        </Box>
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: 'center' }}>
                          <Box>
                            <Typography color="rgba(17, 17, 17, 0.84)" fontWeight={500} fontSize={'16px'}>
                              {job.stage_counts.rejection}
                            </Typography>
                          </Box>
                        </Box>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              {/* Archived jobs content */}
            </TabPanel>
          </Box>
        </Box>
      </Box>
    </DashboardCard>
  );
};

export default JobPostings;
