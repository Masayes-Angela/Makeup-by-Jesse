"use client";

import "../../globals.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../styles/signup.module.css";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { BsCheckCircleFill } from "react-icons/bs";
import Link from "next/link";
import { useRegisterUserMutation } from "@/rtk/authApi";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/rtk/authSlice";

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    contact_number: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();
  const [registerUser] = useRegisterUserMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const validatePassword = (password) => {
    const minLength = 8;
    const hasNumber = /\d/.test(password);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return password.length >= minLength && (hasNumber || hasSymbol);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (
      !formData.full_name ||
      !formData.email ||
      !formData.contact_number ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Please fill in all required fields.");
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    if (!validatePassword(formData.password)) {
      setError("Password must be at least 8 characters long and include a number or symbol.");
      setIsLoading(false);
      return;
    }

    try {
      const { confirmPassword, ...userData } = formData;
      const result = await registerUser(userData).unwrap();

      // Save to Redux auth state (will auto-persist)
      dispatch(setCredentials({
        token: result.token,
        user: result.user,
      }));

      setFormData({
        full_name: "",
        email: "",
        contact_number: "",
        password: "",
        confirmPassword: "",
      });

      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
        router.push("/"); // or redirect somewhere else
      }, 2000);
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.data?.error || err.error || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className={styles.outerWrapper}>
        <div className={styles.container}>
          <div className={styles.left}></div>
          <div className={styles.right}>
            <h2 className={styles.welcome}>Create Account</h2>
            <p className={styles.subtextTop}>Sign up to continue</p>

            <div className={styles.formWrapper}>
              <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.inputGroup}>
                  <label htmlFor="full_name" className={styles.label}>Full Name</label>
                  <input
                    id="full_name"
                    name="full_name"
                    type="text"
                    placeholder="Full Name"
                    value={formData.full_name}
                    onChange={handleChange}
                    className={styles.input}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="email" className={styles.label}>Email Address</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    className={styles.input}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="contact_number" className={styles.label}>Contact Number</label>
                  <input
                    id="contact_number"
                    name="contact_number"
                    type="tel"
                    placeholder="Contact Number"
                    value={formData.contact_number}
                    onChange={handleChange}
                    className={styles.input}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="password" className={styles.label}>Password</label>
                  <div className={styles.passwordWrapper}>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleChange}
                      className={styles.input}
                    />
                    <span className={styles.icon} onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                    </span>
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="confirmPassword" className={styles.label}>Confirm Password</label>
                  <div className={styles.passwordWrapper}>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm Password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={styles.input}
                    />
                    <span className={styles.icon} onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                      {showConfirmPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                    </span>
                  </div>
                </div>

                {error ? (
                  <p className={styles.error}>{error}</p>
                ) : (
                  <p className={styles.passwordNote}>
                    Password must be at least 8 characters long and include a number or symbol.
                  </p>
                )}

                <button
                  type="submit"
                  className={`${styles.signupBtn} ${isLoading ? styles.loading : ""}`}
                  disabled={isLoading}
                >
                  <span className={styles.btnContent}>
                    Sign Up
                    {isLoading && <span className={styles.spinner}></span>}
                  </span>
                </button>

                <p className={styles.login}>
                  Already have an account? <Link href="/auth/login"><span>Log In</span></Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalBox}>
            <button className={styles.closeBtn} onClick={() => setShowModal(false)}>✕</button>
            <div className={styles.iconWrapper}>
              <BsCheckCircleFill className={styles.checkIcon} />
            </div>
            <h3>Success!</h3>
            <p>Account created successfully.</p>
          </div>
        </div>
      )}
    </>
  );
}