import ArrowForwardOutlined from "@mui/icons-material/ArrowForwardOutlined";
import NotificationsOutlined from "@mui/icons-material/NotificationsOutlined";
import {
  Avatar,
  Box,
  Divider,
  List,
  ListItem,
  Paper,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React from "react";
import DashboardCard from "../shared/DashboardCard";

interface NotificationData {
  id?: string | number;
  text: string;
  timestamp?: string;
  read?: boolean;
  // Add other notification properties as needed
}

interface NotificationItemProps {
  text: string;
  // Add other props if needed
}

const notificationData: NotificationData[] = [
  {
    id: 1,
    text: "5 new assessments in 'Product Manager'",
  },
  {
    id: 2,
    text: "7 new applications in 'Financial Analyst'",
  },
  {
    id: 3,
    text: "6 new scheduled interviews in 'Customer R...'",
  },
  {
    id: 4,
    text: "40 new assessments in 'Graphic Designer'",
  },
  {
    id: 5,
    text: "17 new applications in 'Product Manager'",
  },
];

const NotificationItem: React.FC<NotificationItemProps> = ({ text }) => {
  const theme = useTheme()
  return <>
    <ListItem sx={{ height: 56, padding: 0 }}>
      <Box
        sx={{ display: "flex", alignItems: "center", width: "100%", px: 2.5 }}
      >
        <Avatar
          sx={{
            width: 32,
            height: 32,
            bgcolor: theme.palette.secondary.light,
            color: "#4343E1",
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10.0167 2.4248C7.25841 2.4248 5.01674 4.66647 5.01674 7.4248V9.83314C5.01674 10.3415 4.80007 11.1165 4.54174 11.5498L3.58341 13.1415C2.99174 14.1248 3.40007 15.2165 4.48341 15.5831C8.07507 16.7831 11.9501 16.7831 15.5417 15.5831C16.5501 15.2498 16.9917 14.0581 16.4417 13.1415L15.4834 11.5498C15.2334 11.1165 15.0167 10.3415 15.0167 9.83314V7.4248C15.0167 4.6748 12.7667 2.4248 10.0167 2.4248Z" stroke={theme.palette.grey[300]} stroke-width="1.25" stroke-miterlimit="10" stroke-linecap="round" />
            <path d="M11.5582 2.6667C11.2999 2.5917 11.0332 2.53337 10.7582 2.50003C9.95819 2.40003 9.19152 2.45837 8.47485 2.6667C8.71652 2.05003 9.31652 1.6167 10.0165 1.6167C10.7165 1.6167 11.3165 2.05003 11.5582 2.6667Z" stroke={theme.palette.grey[300]} stroke-width="1.25" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M12.5166 15.8833C12.5166 17.2583 11.3916 18.3833 10.0166 18.3833C9.33327 18.3833 8.69993 18.1 8.24993 17.65C7.79993 17.2 7.5166 16.5666 7.5166 15.8833" stroke={theme.palette.grey[300]} stroke-width="1.25" stroke-miterlimit="10" />
          </svg>        </Avatar>
        <Typography
          variant="body1"
          sx={{
            ml: 2,
            color: "rgba(17, 17, 17, 0.84)",
            fontSize: 16,
            lineHeight: "16px",
            letterSpacing: "0.16px",
          }}
        >
          {text}
        </Typography>
      </Box>
    </ListItem>
    <Divider sx={{ borderColor: "rgba(17, 17, 17, 0.08)" }} />
  </>
};

const Frame = ({ customStyle = {} }) => {
  const theme =useTheme()
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
            variant="h5"
            sx={{
              fontWeight: 600,
              color: "rgba(17, 17, 17, 0.92)",
              fontSize: 24,
              lineHeight: "24px",
              letterSpacing: "0.36px",
            }}
          >
            Notifications
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.secondary.main,
                fontSize: 14,
                lineHeight: "14px",
                letterSpacing: "0.14px",
                mr: 0.5,
              }}
            >
              See all
            </Typography>
            <ArrowForwardOutlined
              sx={{ color: "secondary.main", width: 20, height: 20 }}
            />
          </Box>
        </Box>

        <List disablePadding>
          {notificationData.map((notification) => (
            <NotificationItem key={notification.id} text={notification.text} />
          ))}
        </List>
      </Box>
    </DashboardCard>
  );
};

export default Frame;
