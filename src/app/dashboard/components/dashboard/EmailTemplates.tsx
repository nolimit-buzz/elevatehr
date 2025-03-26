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
  CircularProgress,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import { useRouter } from 'next/navigation';

interface Template {
  id: string | number;
  name: string;
  title: string;
}

interface EmailTemplatesProps {
  customStyle?: React.CSSProperties;
}

interface TemplatesResponse {
  templates: Record<string, { title: string }>;
}

const EmailTemplates: React.FC<EmailTemplatesProps> = ({ customStyle }) => {
  const theme = useTheme();
  const router = useRouter();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const token = localStorage.getItem('jwt');
        const response = await fetch('https://app.elevatehr.ai/wp-json/elevatehr/v1/email-templates', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        const data: TemplatesResponse = await response.json();
        if (data?.templates) {
          const formattedTemplates = Object.entries(data.templates).map(([key, value]) => ({
            id: value.title.toLowerCase().replace(/\s+/g, '-'),
            name: value.title,
            title: value.title
          }));
          setTemplates(formattedTemplates);
        }
      } catch (error) {
        console.error('Error fetching templates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);
  
  const handleTemplateClick = (template: Template) => {
    const templateType = template.id.toString().replace(/-/g, '_');
    router.push(`/dashboard/email-templates?type=${templateType}`);
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
        </Box>

        <List sx={{ px: 2 }}>
          {loading ? (
            <CircularProgress sx={{ m: 2 }} />
          ) : (
            templates.map((template) => (
              <ListItem key={template.id} disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  onClick={() => handleTemplateClick(template)}
                  sx={{
                    bgcolor: theme.palette.secondary.light,
                    borderRadius: "6px",
                    height: "56px",
                    transition: 'all 0.2s ease-in-out',
                    "&:hover": {
                      bgcolor: theme.palette.secondary.dark,
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                      '& .MuiListItemText-primary': {
                        color: theme.palette.primary.main,
                      },
                      '& .arrow-icon': {
                        transform: 'translateX(4px)',
                      },
                      '& .arrow-icon path': {
                        stroke: theme.palette.primary.main,
                        strokeOpacity: 1,
                      },
                      '& .MuiListItemIcon-root svg path:first-child': {
                        fill: theme.palette.primary.main,
                        stroke: theme.palette.primary.main,
                      },
                      '& .MuiListItemIcon-root svg path:not(:first-child)': {
                        stroke: 'white',
                      }
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 44 }}>
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        bgcolor: "secondary.dark",
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
                  <Box sx={{ 
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    '& svg': {
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                    }
                  }}>
                    <svg 
                      className="arrow-icon"
                      xmlns="http://www.w3.org/2000/svg" 
                      width="20" 
                      height="20" 
                      viewBox="0 0 20 20" 
                      fill="none"
                    >
                      <path d="M5.83325 10H14.1666" stroke="#224F3E" stroke-opacity="0.68" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
                      <path d="M10.8333 6.66675L14.1666 10.0001L10.8333 13.3334" stroke="#224F3E" stroke-opacity="0.68" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </Box>
                </ListItemButton>
              </ListItem>
            ))
          )}
        </List>
      </Box>
    </DashboardCard>
  );
};

export default EmailTemplates;
