import Add from "@mui/icons-material/Add";
import ArrowForward from "@mui/icons-material/ArrowForward";
import Description from "@mui/icons-material/Description";
import DashboardCard from "../shared/DashboardCard";
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import React from "react";
import { useTheme } from "@mui/material/styles";

interface Template {
  id: string | number;
  name: string;
}

interface EmailTemplatesProps {
  customStyle?: React.CSSProperties;
}

const emailTemplates: Template[] = [
  { id: 1, name: "Rejection Email" },
  { id: 2, name: "Interview Email" },
  { id: 3, name: "Acceptance Email" },
  { id: 4, name: "Assessment Email" },
];

const EmailTemplates: React.FC<EmailTemplatesProps> = ({ customStyle }) => {
  const theme = useTheme();
  
  const handleTemplateClick = (template: Template) => {
    // Add your template click handling logic here
    console.log('Template clicked:', template);
    // For example:
    // setSelectedTemplate(template);
    // or navigate to template detail page
    // or show template in modal
  };

  return (
    <DashboardCard customStyle={{ padding: '0px', ...customStyle }}>
      <Box>
        <Box
          sx={{
            p: 2.5,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: 600,
              color: "rgba(17, 17, 17, 0.92)",
              letterSpacing: "0.36px",
              lineHeight: "24px",
            }}
          >
            Email templates
          </Typography>

          <Button
            variant="outlined"
            startIcon={<Add />}
            size="small"
            sx={{
              borderColor: theme.palette.secondary.main,
              color:  theme.palette.secondary.main,
              textTransform: "none",
              fontWeight: 500,
              fontSize: "14px",
              padding: "4px 10px 4px 6px",
              borderRadius: "6px",
            }}
          >
            Add new
          </Button>
        </Box>

        <List sx={{ px: 2 }}>
          {emailTemplates.map((template) => (
            <ListItem key={template.id} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                onClick={() => handleTemplateClick(template)}
                sx={{
                  bgcolor: theme.palette.secondary.light,
                  borderRadius: "6px",
                  height: "56px",
                  "&:hover": {
                    bgcolor: theme.palette.secondary.light,
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 44 }}>
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      bgcolor: "#D6EBE4",
                      borderRadius: "40px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M17.5 5.83341V14.1667C17.5 16.6667 16.25 18.3334 13.3333 18.3334H6.66667C3.75 18.3334 2.5 16.6667 2.5 14.1667V5.83341C2.5 3.33341 3.75 1.66675 6.66667 1.66675H13.3333C16.25 1.66675 17.5 3.33341 17.5 5.83341Z" stroke={theme.palette.grey[300]} stroke-width="1.25" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                      <path d="M12.0833 3.75V5.41667C12.0833 6.33333 12.8333 7.08333 13.7499 7.08333H15.4166" stroke={theme.palette.grey[300]} stroke-width="1.25" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                      <path d="M6.66675 10.8333H10.0001" stroke={theme.palette.grey[300]} stroke-width="1.25" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                      <path d="M6.66675 14.1667H13.3334" stroke={theme.palette.grey[300]} stroke-width="1.25" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </Box>
                </ListItemIcon>
                <ListItemText
                  primary={template.name}
                  primaryTypographyProps={{
                    sx: {
                      color: theme.palette.grey[300],
                      fontSize: "16px",
                      fontWeight: 400,
                      letterSpacing: "0.16px",
                      lineHeight: "16px",
                    },
                  }}
                />
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M5.83325 10H14.1666" stroke="#224F3E" stroke-opacity="0.68" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M10.8333 6.66675L14.1666 10.0001L10.8333 13.3334" stroke="#224F3E" stroke-opacity="0.68" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </DashboardCard>
  );
};

export default EmailTemplates;
