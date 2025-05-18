// import { AssessmentIcon, ArchiveIcon, CheckCircleOutlineIcon } from '@mui/icons-material';
import AssessmentIcon from '@mui/icons-material/AssessmentOutlined';
import ArchiveIcon from '@mui/icons-material/Archive';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

export const PHASE_OPTIONS = {
  new: [
    { label: 'Move to Assessment', icon: AssessmentIcon, action: 'skill_assessment' },
    { label: 'Archive', icon: ArchiveIcon , action: 'archived' }
  ],
  skill_assessment: [
    { label: 'Schedule Interview', icon: AssessmentIcon , action: 'interviews' },
    { label: 'Archive', icon: ArchiveIcon , action: 'archived' }
  ],
  archived: [
    { label: 'Move to Assessment', icon: AssessmentIcon, action: 'skill_assessment' },
    { label: 'Accept', icon: CheckCircleOutlineIcon , action: 'acceptance' }
  ],
  acceptance: [], // No options for acceptance phase
  interviews: [
    { label: 'Accept', icon: CheckCircleOutlineIcon , action: 'acceptance' },
    { label: 'Archive', icon: ArchiveIcon, action: 'archived' }
  ]
}; 