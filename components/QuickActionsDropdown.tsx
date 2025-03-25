import { useState } from 'react';
import { 
  IconButton, 
  Menu, 
  MenuItem, 
  ListItemIcon, 
  ListItemText 
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityIcon from '@mui/icons-material/Visibility';
import BlockIcon from '@mui/icons-material/Block';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ArchiveIcon from '@mui/icons-material/Archive';

interface QuickActionsProps {
  submissionId: number;
  onViewApplication?: () => void;
}

const QuickActionsDropdown = ({ submissionId, onViewApplication }: QuickActionsProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const updateApplicationStage = async (stage: string) => {
    try {
      const response = await fetch('https://app.elevatehr.ai/wp-json/elevatehr/v1/applications/move-stage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          stage,
          entries: [submissionId]
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update stage');
      }

      // Handle success (you might want to add a success notification or refresh data)
      handleClose();
    } catch (error) {
      console.error('Error updating stage:', error);
      // Handle error (you might want to show an error notification)
    }
  };

  return (
    <>
      <IconButton
        aria-label="quick actions"
        aria-controls={open ? 'quick-actions-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="quick-actions-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'quick-actions-button',
        }}
      >
        <MenuItem onClick={() => {
          onViewApplication?.();
          handleClose();
        }}>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View application</ListItemText>
        </MenuItem>
        
        <MenuItem onClick={() => updateApplicationStage('rejection')}>
          <ListItemIcon>
            <BlockIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Reject</ListItemText>
        </MenuItem>

        <MenuItem onClick={() => updateApplicationStage('skill_assessment')}>
          <ListItemIcon>
            <AssessmentIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Move to Assessment</ListItemText>
        </MenuItem>

        <MenuItem onClick={() => updateApplicationStage('archive')}>
          <ListItemIcon>
            <ArchiveIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Archive</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

export default QuickActionsDropdown; 