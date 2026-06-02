import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router";

const Register = () => {
  const { handleRegister } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    contact: "",
    password: "",
    isSeller: false,
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await handleRegister(formData);
      navigate("/");
    } catch (error) {
      console.error("Register failed", error);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#0a0a0a]">
      {/* Image Side */}
      <div
        className="hidden lg:flex w-full relative bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 flex flex-col justify-end p-16 text-[#e5e2e1] w-full">
          <h2
            className="text-5xl font-bold mb-4 text-[#F5C518]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Join the Elite
          </h2>
          <p className="text-lg text-gray-300 max-w-md font-light leading-relaxed">
            Create an account to gain exclusive access to the latest collections
            and personalized styling.
          </p>
        </div>
      </div>

      {/* Form Side */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h1
              className="text-[#F5C518] text-4xl mb-3"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              SNITCH
            </h1>
            <p className="text-[#a1a1aa] text-sm">Create your account</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col space-y-5">
            <div>
              <input
                type="text"
                name="fullname"
                placeholder="Full Name"
                value={formData.fullname}
                onChange={handleChange}
                className="w-full bg-[#1a1a1a] text-[#e5e2e1] px-4 py-3 rounded-lg border border-transparent focus:border-[#F5C518] focus:outline-none transition-colors"
                required
              />
            </div>

            <div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-[#1a1a1a] text-[#e5e2e1] px-4 py-3 rounded-lg border border-transparent focus:border-[#F5C518] focus:outline-none transition-colors"
                required
              />
            </div>

            <div>
              <input
                type="tel"
                name="contact"
                placeholder="Contact"
                value={formData.contact}
                onChange={handleChange}
                className="w-full bg-[#1a1a1a] text-[#e5e2e1] px-4 py-3 rounded-lg border border-transparent focus:border-[#F5C518] focus:outline-none transition-colors"
                required
              />
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-[#1a1a1a] text-[#e5e2e1] px-4 py-3 rounded-lg border border-transparent focus:border-[#F5C518] focus:outline-none transition-colors pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a1a1aa] hover:text-[#e5e2e1]"
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                )}
              </button>
            </div>

            <div className="flex items-center mt-2">
              <input
                type="checkbox"
                id="isSeller"
                name="isSeller"
                checked={formData.isSeller}
                onChange={handleChange}
                className="golden-checkbox"
              />
              <label
                htmlFor="isSeller"
                className="ml-3 text-[#e5e2e1] text-sm tracking-wide"
              >
                Sell on Snitch?
              </label>
            </div>

            <a href="/api/auth/google" className="text-white">
              Continue with google
            </a>

            <button
              type="submit"
              className="w-full bg-[#F5C518] text-[#0a0a0a] font-semibold py-3.5 rounded-lg mt-6 hover:bg-[#d4a810] transition-colors"
            >
              Create Account
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-[#a1a1aa] text-sm">
              Already have an account?{" "}
              <a href="/login" className="text-[#F5C518] hover:underline">
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
