"use client";

import Link from "next/link";
import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authAPI } from "@/lib/auth";
import { useAuth } from "@/contexts/AuthContext";

export default function RegisterPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    tel: "",
    password: "",
    role: "member",
  });
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    tel: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/books");
    }
  }, [isAuthenticated, router]);

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case "name":
        if (value.trim().length < 2) {
          return "Name must be at least 2 characters long";
        }
        if (!/^[a-zA-Z\s]+$/.test(value)) {
          return "Name can only contain letters and spaces";
        }
        return "";

      case "email":
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return "Please enter a valid email address";
        }
        return "";

      case "tel":
        const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
        if (!phoneRegex.test(value)) {
          return "Phone number must be at least 10 digits";
        }
        return "";

      case "password":
        if (value.length < 6) {
          return "Password must be at least 6 characters long";
        }
        if (!/(?=.*[a-z])/.test(value)) {
          return "Password must contain at least one lowercase letter";
        }
        if (!/(?=.*[A-Z])/.test(value)) {
          return "Password must contain at least one uppercase letter";
        }
        if (!/(?=.*\d)/.test(value)) {
          return "Password must contain at least one number";
        }
        return "";

      default:
        return "";
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // Update form data
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Validate and update errors
    if (name !== "role") {
      const errorMessage = validateField(name, value);
      setErrors((prev) => ({
        ...prev,
        [name]: errorMessage,
      }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    // Validate all fields before submission
    const newErrors = {
      name: validateField("name", formData.name),
      email: validateField("email", formData.email),
      tel: validateField("tel", formData.tel),
      password: validateField("password", formData.password),
    };

    setErrors(newErrors);

    // Check if there are any validation errors
    const hasErrors = Object.values(newErrors).some((error) => error !== "");
    if (hasErrors) {
      setError("Please fix all validation errors before submitting");
      return;
    }

    setIsLoading(true);

    try {
      // Register user
      const response = await authAPI.register(
        formData.name,
        formData.email,
        formData.tel,
        formData.password,
        formData.role
      );

      // Use context login method (now async with cookies)
      await login(response.token, response.user);

      // Redirect to books page
      router.push("/books");
      router.refresh(); // Refresh to update server components
    } catch (err) {
      setError("Registration failed. Please try again.");
      console.error("Registration error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="text-center text-3xl font-bold text-blue-600">
            📚 LibManager
          </h1>
          <h2 className="mt-6 text-center text-2xl font-bold text-gray-900">
            Create your account
          </h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            {/* Name Input */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Full Name
              </label>
              <input
                id="name"
                type="text"
                name="name"
                required
                className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                  errors.name ? "border-red-500" : "border-gray-300"
                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                name="email"
                required
                className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Phone Number Input */}
            <div>
              <label
                htmlFor="tel"
                className="block text-sm font-medium text-gray-700"
              >
                Phone Number
              </label>
              <input
                id="tel"
                type="tel"
                name="tel"
                required
                className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                  errors.tel ? "border-red-500" : "border-gray-300"
                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                placeholder="+1 (555) 000-0000"
                value={formData.tel}
                onChange={handleChange}
              />
              {errors.tel && (
                <p className="mt-1 text-sm text-red-600">{errors.tel}</p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                name="password"
                required
                minLength={6}
                className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                placeholder="Password (min. 6 characters)"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Role Selector */}
            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-700"
              >
                Role
              </label>
              <select
                id="role"
                name="role"
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {isLoading ? "Registering..." : "Register"}
          </button>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Login here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
