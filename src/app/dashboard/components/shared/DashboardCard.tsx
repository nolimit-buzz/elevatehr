import React from "react";
import { Card, CardContent, Typography, Stack, Box } from "@mui/material";
import { SxProps } from "@mui/system";

interface DashboardCardProps {
  title?: string;
  subtitle?: string;
  action?: JSX.Element | any;
  footer?: JSX.Element;
  cardheading?: string | JSX.Element;
  headtitle?: string | JSX.Element;
  headsubtitle?: string | JSX.Element;
  children?: React.ReactNode;
  middlecontent?: string | JSX.Element;
  customStyle?: React.CSSProperties;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ 
  title,
  subtitle,
  action,
  footer,
  cardheading,
  headtitle,
  headsubtitle,
  children,
  middlecontent,
  customStyle 
}) => {
  return (
    <div style={customStyle}>
      {title && (
        <Typography variant="h6" component="h2" gutterBottom>
          {title}
        </Typography>
      )}
      {children}
      {footer}
    </div>
  );
};

export default DashboardCard;
