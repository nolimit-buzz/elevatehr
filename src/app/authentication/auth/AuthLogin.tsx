"use client";
import React, { useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Box, Typography, Button, Stack, Alert } from "@mui/material";
import Link from "next/link";
import CustomTextField from "@/app/dashboard/components/forms/theme-elements/CustomTextField";
import axios from "axios";

interface AuthLoginProps {
  title?: string;
  subtitle?: ReactNode;
  subtext?: ReactNode;
}

const AuthLogin: React.FC<AuthLoginProps> = ({ title, subtitle, subtext }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      router.push("/dashboard"); // Redirect to dashboard if JWT exists
    }
  }, [router]);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  // Validate form fields
  const validateForm = () => {
    let valid = true;
    let newErrors = { email: "", password: "" };
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
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");

    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await axios.post("https://app.elevatehr.ai/wp-json/elevatehr/v1/login", {
        email: formData.email,
        password: formData.password,
      });

      const token = response.data.token;
      localStorage.setItem("jwt", token); // Save JWT in localStorage

      console.log("Login successful:", response.data);
      router.push("/dashboard"); // Redirect to dashboard after login

    } catch (error) {
      setErrorMessage((error as any).response?.data?.message || "Login failed. Please try again.");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      {title && (
        <Typography sx={{ color: "rgba(17, 17, 17, 0.92)", textAlign: "center", fontSize: "32px", fontWeight: 600, lineHeight: "120%", mb: 1 }}>
          {title}
        </Typography>
      )}

      {subtext && (
        <Typography sx={{ color: "rgba(17, 17, 17, 0.68)", textAlign: "center", fontSize: "18px", fontWeight: 400, lineHeight: "120%", mb: 2 }}>
          {subtext}
        </Typography>
      )}

      <Stack spacing={3}>
        <CustomTextField label="Email" name="email" placeholder="Enter your email" type="email" value={formData.email} onChange={handleChange} error={!!errors.email} helperText={errors.email} />
        <CustomTextField label="Password" name="password" placeholder="Enter your password" type="password" value={formData.password} onChange={handleChange} error={!!errors.password} helperText={errors.password} />

        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

        <Button  variant="contained" size="large" fullWidth type="submit" sx={{ borderRadius: "8px", background: "#4444E2", padding: "18px 24px",color:"rgba(205, 247, 235, 0.92)",bgcolor:"#032B44" }} disabled={loading}>
          {loading ? "Signing In..." : "Sign In"}
        </Button>

        <Typography sx={{ color: "rgba(17, 17, 17, 0.68)", textAlign: "center", fontSize: "18px", fontWeight: 400, lineHeight: "120%", mt: 2 }}>
          Don&apos;t have an account?{" "}
          <Typography component={Link} href="/authentication/register" sx={{ color: "#06C680", fontSize: "18px", fontWeight: 600, textDecoration: "underline" }}>
            Create an account
          </Typography>
        </Typography>

        <Typography component={Link} href="/" sx={{ color: "#06C680", mt: 2, textAlign: "center", fontSize: "18px", fontWeight: 600, textDecoration: "underline" }}>
          Forgot Password?
        </Typography>
      </Stack>
    </form>
  );
};

export default AuthLogin;
