"use client";
import React, { useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Typography, Button, Stack, Alert } from "@mui/material";
import Link from "next/link";
import CustomTextField from "@/app/dashboard/components/forms/theme-elements/CustomTextField";
import axios from "axios";

interface RegisterProps {
  title?: string;
  subtitle?: ReactNode;
  subtext?: ReactNode;
}

const Register: React.FC<RegisterProps> = ({ title, subtitle, subtext }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    companyName: "",
    numberOfEmployees: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    companyName: "",
    numberOfEmployees: "",
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Handle text input change
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  // Validate form fields
  const validateForm = () => {
    let valid = true;
    let newErrors = {
      name: "",
      email: "",
      password: "",
      companyName: "",
      numberOfEmployees: "",
    };
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name) {
      newErrors.name = "Name is required";
      valid = false;
    }

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

    if (!formData.companyName) {
      newErrors.companyName = "Company name is required";
      valid = false;
    }

    if (!formData.numberOfEmployees) {
      newErrors.numberOfEmployees = "Number of employees is required";
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
      // Split the name into first and last name
      const nameParts = formData.name.trim().split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ');

      const response = await axios.post("https://app.elevatehr.ai/wp-json/elevatehr/v1/register", {
        first_name: firstName,
        last_name: lastName,
        email: formData.email,
        password: formData.password,
        company_name: formData.companyName,
        number_of_employees: formData.numberOfEmployees,
        booking_link: "https://app.elevatehr.ai/booking",
      });

      console.log("Registration successful:", response.data);
      router.push("/authentication/login"); // Redirect to login after successful registration

    } catch (error) {
      setErrorMessage((error as any).response?.data?.message || "Registration failed. Please try again.");
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

      <Stack spacing={'12px'}>
        <CustomTextField
          label="Your Name"
          name="name"
          placeholder="Enter your name"
          value={formData.name}
          onChange={handleTextChange}
          error={!!errors.name}
          helperText={errors.name}
        />
        <CustomTextField
          label="Email"
          name="email"
          placeholder="Enter your email"
          type="email"
          value={formData.email}
          onChange={handleTextChange}
          error={!!errors.email}
          helperText={errors.email}
        />
        <CustomTextField
          label="Create Password"
          name="password"
          placeholder="Create your password"
          type="password"
          value={formData.password}
          onChange={handleTextChange}
          error={!!errors.password}
          helperText={errors.password}
        />
        <CustomTextField
          label="Company Name"
          name="companyName"
          placeholder="Enter your company name"
          value={formData.companyName}
          onChange={handleTextChange}
          error={!!errors.companyName}
          helperText={errors.companyName}
        />
        <CustomTextField
          label="Number of Employees"
          name="numberOfEmployees"
          placeholder="Enter number of employees"
          value={formData.numberOfEmployees}
          onChange={handleTextChange}
          error={!!errors.numberOfEmployees}
          helperText={errors.numberOfEmployees}
        />

        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

        <Button
          variant="contained"
          size="large"
          fullWidth
          type="submit"
          sx={{ borderRadius: "8px", background: "#4444E2", padding: "18px 24px", color: "secondary.light", bgcolor: "primary.main" }}
          disabled={loading}
        >
          {loading ? "Creating Account..." : "Create Account"}
        </Button>

        <Typography sx={{ color: "rgba(17, 17, 17, 0.68)", textAlign: "center", fontSize: "18px", fontWeight: 400, lineHeight: "120%", mt: 2 }}>
          Already have an account?{" "}
          <Typography component={Link} href="/authentication/login" sx={{ color: "primary.main", fontSize: "18px", fontWeight: 600, textDecoration: "underline" }}>
            Sign in
          </Typography>
        </Typography>
      </Stack>
    </form>
  );
};

export default Register;
