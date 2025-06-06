"use client";

import "../../globals.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../styles/login.module.css";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { BsCheckCircleFill } from "react-icons/bs";
import { TbArrowAutofitLeft } from "react-icons/tb";
import Link from "next/link";
import { useLoginUserMutation } from "@/rtk/authApi";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/rtk/authSlice";

const mockAdminUsers = [{ email: "admin@example.com", password: "Admin123", role: "admin" }];

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();
  const [loginUser] = useLoginUserMutation();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!email || !password) {
      setError("Please fill in all required fields.");
      setIsLoading(false);
      return;
    }

    try {
      const adminFound = mockAdminUsers.find((user) => user.email === email && user.password === password);

      if (adminFound) {
        localStorage.setItem("adminToken", "mock-admin-token");
        localStorage.setItem("userRole", "admin");
        localStorage.setItem("userEmail", email);

        setShowModal(true);
        setEmail("");
        setPassword("");

        setTimeout(() => {
          router.push("/admin");
        }, 1600);

        setIsLoading(false);
        return;
      }

      const result = await loginUser({ email, password }).unwrap();

      console.log("✅ LOGIN SUCCESSFUL RESULT:", result);

      dispatch(setCredentials({
        token: result.token,
        user: result.user,
      }));

      console.log("✅ setCredentials dispatched!");


      // ✅ Dispatch to global Redux state
      dispatch(setCredentials({
        token: result.token,
        user: result.user,
      }));

      // ✅ Save to localStorage for token-based requests and reload persistence
      localStorage.setItem("token", result.token); // ✅ this is the fix
      localStorage.setItem("userRole", result.user.role);
      localStorage.setItem("userId", result.user.id.toString());
      localStorage.setItem("userName", result.user.full_name);
      localStorage.setItem("userEmail", result.user.email);
      if (result.user.avatar_url) {
        localStorage.setItem("userProfileImage", result.user.avatar_url);
      }

      setShowModal(true);
      setEmail("");
      setPassword("");

      setTimeout(() => {
        setShowModal(false);
        router.push(result.user.role === "admin" ? "/admin" : "/");
      }, 1500);
    } catch (err) {
      console.error("Login error:", err);
      if (err.status === 401) {
        setError("Invalid email or password. Please try again.");
      } else if (err.status === 500) {
        setError("Server error. Please try again later.");
      } else {
        setError(err.data?.error || err.error || "Login failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const togglePassword = () => setShowPassword(!showPassword);
  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    setError("");
  };

  return (
    <>
      <div className={styles.outerWrapper}>
        <div className={styles.container}>
          <div className={styles.left}>
            <h2 className={styles.welcome}>Hello!</h2>
            <p className={styles.subtext}>Log In to your Account</p>

            <div className={styles.formWrapper}>
              <form className={styles.form} onSubmit={handleLogin}>
                <div className={styles.inputGroup}>
                  <div className={styles.labelRow}>
                    <label htmlFor="email" className={styles.label}>Email</label>
                    {error && <span className={styles.inlineError}>{error}</span>}
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="Email"
                    value={email}
                    onChange={handleInputChange(setEmail)}
                    className={styles.input}
                    disabled={isLoading}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <div className={styles.labelRow}>
                    <label htmlFor="password" className={styles.label}>Password</label>
                  </div>
                  <div className={styles.passwordWrapper}>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="Password"
                      value={password}
                      onChange={handleInputChange(setPassword)}
                      className={styles.input}
                      disabled={isLoading}
                    />
                    <span className={styles.icon} onClick={togglePassword}>
                      {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                    </span>
                  </div>
                  <p className={styles.forgotPassword}>
                    <Link href="/auth/forgot-password">Forgot Password?</Link>
                  </p>
                </div>

                <button
                  type="submit"
                  className={`${styles.loginBtn} ${isLoading ? styles.loading : ""}`}
                  disabled={isLoading}
                >
                  <span className={styles.btnContent}>
                    Log In
                    {isLoading && <span className={styles.spinner}></span>}
                  </span>
                </button>

                <p className={styles.signup}>
                  Don&apos;t have an Account? <Link href="/auth/signup"><span>Sign Up</span></Link>
                </p>

                <p className={styles.backLink}>
                  <Link href="/">
                    <TbArrowAutofitLeft className={styles.arrowIcon} />
                    Back to Home
                  </Link>
                </p>
              </form>
            </div>
          </div>
          <div className={styles.right}></div>
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
            <p>Login successful.</p>
          </div>
        </div>
      )}
    </>
  );
}