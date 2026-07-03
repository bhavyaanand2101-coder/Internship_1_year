import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { MdEmail, MdLock, MdArrowBack } from "react-icons/md";

function Login() {
    const navigate = useNavigate();
    const { login, loginWithGoogle, resetPassword } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    // Forgot Password State
    const [forgotMode, setForgotMode] = useState(false);
    const [resetEmail, setResetEmail] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        if (!email || !password) {
            return setError("Please fill all fields.");
        }

        try {
            setLoading(true);
            await login(email, password);
            toast.success("Successfully logged in!");
            navigate("/chat");
        } catch (err) {
            let errorMsg = err.message;
            if (err.code === "auth/invalid-credential" || err.code === "auth/wrong-password" || err.code === "auth/user-not-found") {
                errorMsg = "Invalid email or password.";
            }
            setError(errorMsg);
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setError("");
        setMessage("");
        try {
            setLoading(true);
            await loginWithGoogle();
            toast.success("Successfully logged in with Google!");
            navigate("/chat");
        } catch (err) {
            setError(err.message);
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        if (!resetEmail) {
            return setError("Please enter your email.");
        }

        try {
            setLoading(true);
            await resetPassword(resetEmail);
            setMessage("Password reset email sent! Check your inbox.");
            toast.success("Reset email sent! Please check your inbox.");
        } catch (err) {
            setError(err.message);
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "calc(100vh - 60px)",
                padding: "20px",
                backgroundColor: "var(--bg-app)",
                transition: "background-color 0.3s ease",
            }}
        >
            <div
                className="glass-panel animate-fade-in"
                style={{
                    width: "100%",
                    maxWidth: "420px",
                    padding: "36px 30px",
                    borderRadius: "16px",
                    boxShadow: "0 8px 32px var(--color-shadow)",
                    color: "var(--color-text)",
                    border: "1px solid var(--color-border)",
                    transition: "all 0.3s ease",
                }}
            >
                {!forgotMode ? (
                    <>
                        <div style={{ textAlign: "center", marginBottom: "30px" }}>
                            <h2 style={{ fontSize: "28px", fontWeight: "700", color: "var(--color-accent)", margin: "0 0 8px 0" }}>
                                Welcome Back
                            </h2>
                            <p style={{ fontSize: "14px", color: "var(--color-text-muted)", margin: 0 }}>
                                Sign in to continue to WaveChat
                            </p>
                        </div>

                        <form onSubmit={handleLogin}>
                            {/* Email Input */}
                            <div style={{ marginBottom: "18px", position: "relative" }}>
                                <MdEmail
                                    style={{
                                        position: "absolute",
                                        left: "14px",
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        color: "var(--color-text-muted)",
                                        fontSize: "18px",
                                    }}
                                />
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="custom-input"
                                    style={{
                                        width: "100%",
                                        padding: "12px 16px 12px 42px",
                                        boxSizing: "border-box",
                                        fontSize: "14px",
                                        height: "46px",
                                    }}
                                    required
                                />
                            </div>

                            {/* Password Input */}
                            <div style={{ marginBottom: "12px", position: "relative" }}>
                                <MdLock
                                    style={{
                                        position: "absolute",
                                        left: "14px",
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        color: "var(--color-text-muted)",
                                        fontSize: "18px",
                                    }}
                                />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="custom-input"
                                    style={{
                                        width: "100%",
                                        padding: "12px 16px 12px 42px",
                                        boxSizing: "border-box",
                                        fontSize: "14px",
                                        height: "46px",
                                    }}
                                    required
                                />
                            </div>

                            {/* Forgot password trigger */}
                            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "20px" }}>
                                <span
                                    onClick={() => {
                                        setForgotMode(true);
                                        setError("");
                                        setMessage("");
                                    }}
                                    style={{
                                        color: "var(--color-accent)",
                                        cursor: "pointer",
                                        fontSize: "13px",
                                        fontWeight: "600",
                                    }}
                                >
                                    Forgot Password?
                                </span>
                            </div>

                            {error && (
                                <p style={{ color: "#ef4444", margin: "0 0 16px 0", fontSize: "13px", textAlign: "center", fontWeight: "500" }}>
                                    {error}
                                </p>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                style={{
                                    width: "100%",
                                    height: "46px",
                                    background: "var(--color-accent)",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "8px",
                                    fontWeight: "600",
                                    fontSize: "15px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    boxShadow: "0 4px 12px rgba(0, 168, 132, 0.2)",
                                    marginBottom: "15px",
                                }}
                            >
                                {loading ? "Logging in..." : "Log In"}
                            </button>
                        </form>

                        {/* Divider */}
                        <div style={{ display: "flex", alignItems: "center", margin: "20px 0" }}>
                            <div style={{ flex: 1, height: "1px", backgroundColor: "var(--color-border)" }}></div>
                            <span style={{ padding: "0 10px", fontSize: "12px", color: "var(--color-text-muted)" }}>OR</span>
                            <div style={{ flex: 1, height: "1px", backgroundColor: "var(--color-border)" }}></div>
                        </div>

                        {/* Google Button */}
                        <button
                            onClick={handleGoogleLogin}
                            disabled={loading}
                            style={{
                                width: "100%",
                                height: "46px",
                                background: "var(--bg-panel)",
                                color: "var(--color-text)",
                                border: "1px solid var(--color-border)",
                                borderRadius: "8px",
                                fontWeight: "600",
                                fontSize: "14px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "10px",
                                boxShadow: "0 2px 4px var(--color-shadow)",
                                marginBottom: "25px",
                            }}
                        >
                            <FcGoogle style={{ fontSize: "20px" }} />
                            Continue with Google
                        </button>

                        <p style={{ margin: 0, textAlign: "center", fontSize: "14px", color: "var(--color-text-muted)" }}>
                            Don't have an account?{" "}
                            <Link to="/register" style={{ color: "var(--color-accent)", fontWeight: "600", textDecoration: "none" }}>
                                Register
                            </Link>
                        </p>
                    </>
                ) : (
                    <>
                        <div style={{ textAlign: "center", marginBottom: "30px" }}>
                            <h2 style={{ fontSize: "26px", fontWeight: "700", color: "var(--color-accent)", margin: "0 0 8px 0" }}>
                                Reset Password
                            </h2>
                            <p style={{ fontSize: "14px", color: "var(--color-text-muted)", margin: 0 }}>
                                Enter your email to receive a password reset link
                            </p>
                        </div>

                        <form onSubmit={handleForgotPassword}>
                            <div style={{ marginBottom: "20px", position: "relative" }}>
                                <MdEmail
                                    style={{
                                        position: "absolute",
                                        left: "14px",
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        color: "var(--color-text-muted)",
                                        fontSize: "18px",
                                    }}
                                />
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={resetEmail}
                                    onChange={(e) => setResetEmail(e.target.value)}
                                    className="custom-input"
                                    style={{
                                        width: "100%",
                                        padding: "12px 16px 12px 42px",
                                        boxSizing: "border-box",
                                        fontSize: "14px",
                                        height: "46px",
                                    }}
                                    required
                                />
                            </div>

                            {error && (
                                <p style={{ color: "#ef4444", marginBottom: "15px", fontSize: "13px", textAlign: "center" }}>
                                    {error}
                                </p>
                            )}
                            {message && (
                                <p style={{ color: "#10b981", marginBottom: "15px", fontSize: "13px", textAlign: "center", fontWeight: "500" }}>
                                    {message}
                                </p>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                style={{
                                    width: "100%",
                                    height: "46px",
                                    background: "var(--color-accent)",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "8px",
                                    fontWeight: "600",
                                    fontSize: "15px",
                                    boxShadow: "0 4px 12px rgba(0, 168, 132, 0.2)",
                                    marginBottom: "15px",
                                }}
                            >
                                {loading ? "Sending..." : "Send Reset Email"}
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setForgotMode(false);
                                    setError("");
                                    setMessage("");
                                }}
                                style={{
                                    width: "100%",
                                    height: "46px",
                                    background: "transparent",
                                    color: "var(--color-text-muted)",
                                    border: "1px solid var(--color-border)",
                                    borderRadius: "8px",
                                    fontWeight: "600",
                                    fontSize: "14px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "8px",
                                }}
                            >
                                <MdArrowBack />
                                Back to Login
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}

export default Login;