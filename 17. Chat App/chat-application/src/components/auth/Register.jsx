import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

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
            navigate("/chat");
        } catch (err) {
            let errorMsg = err.message;
            if (err.code === "auth/email-already-in-use") {
                errorMsg = "An account with this email already exists.";
            }
            setError(errorMsg);
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
            <h2 style={{ textAlign: "center", color: "var(--wa-green-dark)" }}>Create Account</h2>

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Display Name (Optional)"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    style={{
                        width: "100%",
                        padding: "12px",
                        marginTop: "15px",
                        boxSizing: "border-box",
                        border: "1px solid var(--wa-border)",
                        borderRadius: "4px",
                        outline: "none",
                    }}
                />

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

                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        width: "100%",
                        padding: "12px",
                        marginTop: "20px",
                        background: "var(--wa-green)",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        fontWeight: "600",
                        fontSize: "15px",
                    }}
                >
                    {loading ? "Creating..." : "Register"}
                </button>
            </form>

            <p style={{ marginTop: "20px", textAlign: "center", fontSize: "14px" }}>
                Already have an account?{" "}
                <Link to="/login" style={{ color: "var(--wa-green)", fontWeight: "600", textDecoration: "none" }}>
                    Login
                </Link>
            </p>
        </div>
    );
}

export default Register;