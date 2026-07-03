import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "react-hot-toast";
import { MdPerson, MdEmail, MdLock } from "react-icons/md";

function Register() {
    const navigate = useNavigate();
    const { register } = useAuth();

    const [displayName, setDisplayName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!email || !password) {
            return setError("Please fill all required fields.");
        }

        if (password.length < 6) {
            return setError("Password must be at least 6 characters.");
        }

        if (password !== confirmPassword) {
            return setError("Passwords do not match.");
        }

        try {
            setLoading(true);
            await register(email, password, displayName);
            toast.success("Account created successfully!");
            navigate("/chat");
        } catch (err) {
            let errorMsg = err.message;
            if (err.code === "auth/email-already-in-use") {
                errorMsg = "An account with this email already exists.";
            }
            setError(errorMsg);
            toast.error(errorMsg);
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
                <div style={{ textAlign: "center", marginBottom: "26px" }}>
                    <h2 style={{ fontSize: "28px", fontWeight: "700", color: "var(--color-accent)", margin: "0 0 8px 0" }}>
                        Create Account
                    </h2>
                    <p style={{ fontSize: "14px", color: "var(--color-text-muted)", margin: 0 }}>
                        Join WaveChat and start messaging in real time
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Display Name */}
                    <div style={{ marginBottom: "16px", position: "relative" }}>
                        <MdPerson
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
                            type="text"
                            placeholder="Display Name (Optional)"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            className="custom-input"
                            style={{
                                width: "100%",
                                padding: "12px 16px 12px 42px",
                                boxSizing: "border-box",
                                fontSize: "14px",
                                height: "46px",
                            }}
                        />
                    </div>

                    {/* Email */}
                    <div style={{ marginBottom: "16px", position: "relative" }}>
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

                    {/* Password */}
                    <div style={{ marginBottom: "16px", position: "relative" }}>
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
                            placeholder="Password (Min. 6 chars)"
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

                    {/* Confirm Password */}
                    <div style={{ marginBottom: "20px", position: "relative" }}>
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
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
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
                            marginBottom: "20px",
                        }}
                    >
                        {loading ? "Creating Account..." : "Register"}
                    </button>
                </form>

                <p style={{ margin: 0, textAlign: "center", fontSize: "14px", color: "var(--color-text-muted)" }}>
                    Already have an account?{" "}
                    <Link to="/login" style={{ color: "var(--color-accent)", fontWeight: "600", textDecoration: "none" }}>
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Register;