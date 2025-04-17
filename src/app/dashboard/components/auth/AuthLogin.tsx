"use client";
import React, { useState } from "react";
import { Box, Stack, TextField, Button, CircularProgress, Alert, Typography, Link } from "@mui/material";
import CustomTextField from "@/app/dashboard/components/forms/theme-elements/CustomTextField";
import NextLink from "next/link";

interface AuthLoginProps {
  subtext?: React.ReactNode;
  subtitle?: React.ReactNode;
  onSuccess?: (response: any) => void;
}

export default function AuthLogin({ subtext, subtitle, onSuccess }: AuthLoginProps) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    let valid = true;
    let newErrors = {
      email: "",
      password: "",
    };
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
      valid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");

    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await fetch("https://app.elevatehr.ai/wp-json/elevatehr/v1/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      if (onSuccess) {
        onSuccess(data);
      }
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Stack spacing={3}>
        {errorMessage && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMessage}
          </Alert>
        )}
        
        <CustomTextField
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          value={formData.email}
          onChange={handleTextChange}
          error={!!errors.email}
          helperText={errors.email}
        />
        
        <CustomTextField
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
          value={formData.password}
          onChange={handleTextChange}
          error={!!errors.password}
          helperText={errors.password}
        />

        {subtitle && (
          <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>
            {subtitle}
          </Typography>
        )}
        
        {subtext && (
          <Typography variant="body1" sx={{ color: 'text.grey.100', mb: 2 }}>
            {subtext}
          </Typography>
        )}
        
        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={loading}
          sx={{ 
            mt: 3, 
            mb: 2,
            height: '48px',
            fontSize: '16px',
            fontWeight: 600,
            textTransform: 'none',
            bgcolor: 'secondary.main',
            '&:hover': {
              bgcolor: 'secondary.dark',
            }
          }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Sign In"}
        </Button>

        
      </Stack>
    </Box>
  );
} 