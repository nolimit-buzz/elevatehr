import React, { useState } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  styled,
  Stack,
  IconButton,
  Badge,
  Button,
  Typography,
  Grid,
  Link,
  Avatar,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  BottomNavigation,
  BottomNavigationAction,
  Paper
} from "@mui/material";
import PropTypes from "prop-types";
import Image from 'next/image'
import { usePathname } from 'next/navigation'
// components
import Profile from "./Profile"
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import WorkHistoryRoundedIcon from '@mui/icons-material/WorkHistoryRounded';
import { useRouter } from "next/navigation";

interface ItemType {
  toggleMobileSidebar: (event: React.MouseEvent<HTMLElement>) => void;
}

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();

  const AppBarStyled = styled(AppBar)(({ theme }) => ({
    boxShadow: "none",
    background: theme.palette.background.paper,
    justifyContent: "center",
    backdropFilter: "blur(4px)",
    [theme.breakpoints.up("lg")]: {
      minHeight: "70px",
    },
  }));

  const ToolbarStyled = styled(Stack)(({ theme }) => ({
    width: "100%",
    color: theme.palette.text.secondary,
    display: "flex",
    justifyContent: "space-between",
    padding: "0 20px",
    maxWidth:'1440px',
    margin:'auto',
  }));
  
  const ProfileButtonStyled = styled(Button)(({ theme }) => ({
    width: "100%",
    backgroundColor: 'rgba(11, 18, 213, 0.12)',
    color: theme.palette.grey[600],
    borderRadius: "50px",
    border: `1px solid rgba(11, 18, 213, 0.40)`,
    display: "flex",
    gap: '10px',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      backgroundColor: 'rgba(11, 18, 213, 0.18)',
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 12px rgba(11, 18, 213, 0.1)',
    }
  }));

  const LinkStyled = styled(Link)(({ theme }) => ({
    color: 'rgba(17, 17, 17, 0.42)',
    fontWeight: theme.typography.fontWeightMedium,
    textDecoration: "none",
    transition: 'color 0.2s ease-in-out',
    '&:hover': {
      color: `rgba(11, 18, 213, 0.5)`,
    },
    '&.active': {
      color: theme.palette.primary.main,
    }
  }));

  const BottomNav = styled(Paper)(({ theme }) => ({
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: theme.zIndex.appBar,
    display: 'block',
    [theme.breakpoints.up('sm')]: {
      display: 'none'
    },
    '& .MuiBottomNavigation-root': {
      backgroundColor: theme.palette.background.paper,
    },
    '& .MuiBottomNavigationAction-root': {
      color: 'rgba(17, 17, 17, 0.42)',
      '& .MuiBottomNavigationAction-label': {
        fontSize: '0.75rem',
        opacity: 0.7
      },
      '&.Mui-selected': {
        color: theme.palette.primary.main,
        '& .MuiBottomNavigationAction-label': {
          opacity: 1
        }
      }
    }
  }));

  const links = [
    { href: "/dashboard", title: "Dashboard", icon: <DashboardRoundedIcon /> },
    { href: "/dashboard/applications", title: "Applications", icon: <DescriptionRoundedIcon /> },
    { href: "/dashboard/job-listings", title: "Job Listings", icon: <WorkHistoryRoundedIcon /> }
  ];
  
  return (
    <>
      <AppBarStyled position="sticky" color="default">
        <ToolbarStyled direction='row' alignItems='center' justifyContent='space-between'>
          <Box sx={{cursor:'pointer'}} onClick={() => router.push('/dashboard')}>
            <Image
              src="/images/logos/logo.svg"
              alt="elevatehr"
              width={120}
              height={56}
            />
          </Box>
          
          <Stack direction='row' width='max-content' gap={4} sx={{ display: { xs: 'none', sm: 'flex' } }}>
            {links.map((link) => (
              <LinkStyled 
                key={link.title} 
                href={link.href}
                className={pathname === link.href ? 'active' : ''}
              >
                {link.title}
              </LinkStyled>
            ))}
          </Stack>

          <Stack spacing={1} direction="row" alignItems="center">
            <Box sx={{ display: { xs: "none", sm: "block" } }}>
              <ProfileButtonStyled onClick={() => router.push('/dashboard/profile')}>
                <Avatar
                  src="/images/profile/user-1.jpg"
                  alt="image"
                  sx={{
                    width: 28,
                    height: 28,
                  }}
                />
                <Typography>
                  {(() => {
                    try {
                      const userProfileStr =localStorage.getItem('userProfile');
                      if(userProfileStr){
                        const userProfile = JSON.parse(userProfileStr);
                      const personalInfo = userProfile.personalInfo;

                      const firstName = personalInfo.first_name;
                      const lastName = personalInfo.last_name;
                      return `${firstName} ${lastName.charAt(0)}.`;
                      }
                    } catch (error) {
                      return 'User';
                    }
                  })()}
                </Typography>
              </ProfileButtonStyled>
            </Box>

            <Avatar
              src="/images/profile/user-1.jpg"
              alt="image"
              sx={{
                width: 32,
                height: 32,
                display: { xs: 'block', sm: 'none' },
                cursor: 'pointer'
              }}
              onClick={() => router.push('/dashboard/profile')}
            />
          </Stack>
        </ToolbarStyled>
      </AppBarStyled>

      <BottomNav elevation={3}>
        <BottomNavigation
          showLabels
          value={pathname}
          onChange={(event, newValue) => {
            router.push(newValue);
          }}
        >
          {links.map((link) => (
            <BottomNavigationAction
              key={link.title}
              label={link.title}
              value={link.href}
              icon={link.icon}
            />
          ))}
        </BottomNavigation>
      </BottomNav>
    </>
  );
};

Header.propTypes = {
  sx: PropTypes.object,
};

export default Header;
