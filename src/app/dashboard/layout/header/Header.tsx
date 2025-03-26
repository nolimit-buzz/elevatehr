import React from "react";
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
  Avatar
} from "@mui/material";
import PropTypes from "prop-types";
import Image from 'next/image'
import { usePathname } from 'next/navigation'
// components
import Profile from "./Profile"
import { IconBellRinging, IconMenu } from "@tabler/icons-react";
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
    maxWidth:'1536px',
    margin:'auto',
    // [theme.breakpoints.up("lg")]: {
    //   padding: "0 80px",
    // },
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
    color: 'rgba(17, 17, 17, 0.72)',
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

  const links = [{ href: "/dashboard", title: "Dashboard" }, { href: "/dashboard/applications", title: "Applications" }, { href: "/notifications", title: "Notifications" }];
  return (
    <AppBarStyled position="sticky" color="default">

      <ToolbarStyled direction='row' alignItems='center' justifyContent='space-between'>
        <Box           sx={{cursor:'pointer'}}
onClick={() => router.push('/dashboard')}>        <Image
          src="/images/logos/logo.svg"
          alt="elevatehr"
          width={120}
          height={56}
        />
        </Box>
        <Stack direction='row' width='max-content' gap={4}>
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
          <Box
            sx={{
              display: {
                xs: "none",
                sm: "block",
              },
            }}
          >
            <ProfileButtonStyled onClick={() => router.push('/dashboard/profile')}>
            <Avatar
                src="/images/profile/user-1.jpg"
                alt="image"
                sx={{
                  width: 28,
                  height: 28,
                }}
              />
              <Typography>Alimosho J.</Typography>

            </ProfileButtonStyled>
          </Box>

        </Stack>
      </ToolbarStyled>
    </AppBarStyled>
  );
};

Header.propTypes = {
  sx: PropTypes.object,
};

export default Header;
