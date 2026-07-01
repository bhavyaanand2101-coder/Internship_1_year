import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

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
            navigate("/chat");
        } catch (err) {
            let errorMsg = err.message;
            if (err.code === "auth/invalid-credential" || err.code === "auth/wrong-password" || err.code === "auth/user-not-found") {
                errorMsg = "Invalid email or password.";
            }
            setError(errorMsg);
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
            navigate("/chat");
        } catch (err) {
            setError(err.message);
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
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                maxWidth: "400px",
                margin: "80px auto",
                padding: "30px",
                border: "1px solid var(--wa-border)",
                borderRadius: "10px",
                backgroundColor: "#fff",
                color: "var(--wa-text)",
                boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
            }}
        >
            {!forgotMode ? (
                <>
                    <h2 style={{ textAlign: "center", color: "var(--wa-green-dark)" }}>Login</h2>

                    <form onSubmit={handleLogin}>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{
                                width: "100%",
                                padding: "12px",
                                marginTop: "15px",
                                boxSizing: "border-box",
                                border: "1px solid var(--wa-border)",
                                borderRadius: "4px",
                                outline: "none",
                            }}
                            required
                        />

                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{
                                width: "100%",
                                padding: "12px",
                                marginTop: "15px",
                                boxSizing: "border-box",
                                border: "1px solid var(--wa-border)",
                                borderRadius: "4px",
                                outline: "none",
                            }}
                            required
                        />

                        <div style={{ marginTop: "10px", textAlign: "right" }}>
                            <span
                                onClick={() => {
                                    setForgotMode(true);
                                    setError("");
                                    setMessage("");
                                }}
                                style={{
                                    color: "var(--wa-green)",
                                    cursor: "pointer",
                                    fontSize: "14px",
                                    fontWeight: "500",
                                }}
                            >
                                Forgot Password?
                            </span>
                        </div>

                        {error && (
                            <p style={{ color: "red", marginTop: "10px", fontSize: "14px" }}>
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: "100%",
                                padding: "12px",
                                marginTop: "20px",
                                background: "var(--wa-green)",
                                color: "#fff",
                                border: "none",
                                borderRadius: "5px",
                                cursor: "pointer",
                                fontWeight: "600",
                                fontSize: "15px",
                            }}
                        >
                            {loading ? "Logging in..." : "Login"}
                        </button>
                    </form>

                    <button
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        style={{
                            width: "100%",
                            padding: "12px",
                            marginTop: "15px",
                            background: "#DB4437",
                            color: "#fff",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                            fontWeight: "600",
                            fontSize: "15px",
                        }}
                    >
                        Continue with Google
                    </button>

                    <p style={{ marginTop: "20px", textAlign: "center", fontSize: "14px" }}>
                        Don't have an account?{" "}
                        <Link to="/register" style={{ color: "var(--wa-green)", fontWeight: "600", textDecoration: "none" }}>
                            Register
                        </Link>
                    </p>
                </>
            ) : (
                <>
                    <h2 style={{ textAlign: "center", color: "var(--wa-green-dark)" }}>Reset Password</h2>

                    <form onSubmit={handleForgotPassword}>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={resetEmail}
                            onChange={(e) => setResetEmail(e.target.value)}
                            style={{
                                width: "100%",
                                padding: "12px",
                                marginTop: "15px",
                                boxSizing: "border-box",
                                border: "1px solid var(--wa-border)",
                                borderRadius: "4px",
                                outline: "none",
                            }}
                            required
                        />

                        {error && (
                            <p style={{ color: "red", marginTop: "10px", fontSize: "14px" }}>
                                {error}
                            </p>
                        )}
                        {message && (
                            <p style={{ color: "green", marginTop: "10px", fontSize: "14px" }}>
                                {message}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: "100%",
                                padding: "12px",
                                marginTop: "20px",
                                background: "var(--wa-green)",
                                color: "#fff",
                                border: "none",
                                borderRadius: "5px",
                                cursor: "pointer",
                                fontWeight: "600",
                                fontSize: "15px",
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
                                padding: "12px",
                                marginTop: "15px",
                                background: "#8596a0",
                                color: "#fff",
                                border: "none",
                                borderRadius: "5px",
                                cursor: "pointer",
                                fontWeight: "600",
                                fontSize: "15px",
                            }}
                        >
                            Back to Login
                        </button>
                    </form>
                </>
            )}
        </div>
    );
}

export default Login;