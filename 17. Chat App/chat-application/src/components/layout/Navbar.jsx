import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/login");
        } catch (err) {
            console.error("Logout failed:", err);
        }
    };

    return (
        <nav
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "15px 30px",
                backgroundColor: "var(--wa-green)",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
        >
            {/* Logo */}
            <h2 style={{ color: "#fff", margin: 0, fontWeight: "600" }}>WhatsApp Chat</h2>

            {/* Navigation Links */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "20px",
                }}
            >
                <Link
                    to="/"
                    style={{ color: "#fff", textDecoration: "none", fontWeight: "500" }}
                >
                    Home
                </Link>

                {user ? (
                    <>
                        <Link
                            to="/chat"
                            style={{ color: "#fff", textDecoration: "none", fontWeight: "500" }}
                        >
                            Chat
                        </Link>

                        <Link
                            to="/profile"
                            style={{
                                color: "#fff",
                                textDecoration: "none",
                                fontWeight: "500",
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                            }}
                        >
                            {user.photoURL && (
                                <img
                                    src={user.photoURL}
                                    alt="Avatar"
                                    style={{
                                        width: "24px",
                                        height: "24px",
                                        borderRadius: "50%",
                                        objectFit: "cover",
                                        border: "1.5px solid #fff",
                                    }}
                                />
                            )}
                            <span>Profile</span>
                        </Link>

                        <button
                            onClick={handleLogout}
                            style={{
                                background: "none",
                                border: "none",
                                color: "#fff",
                                cursor: "pointer",
                                fontSize: "16px",
                                fontWeight: "500",
                                padding: 0,
                                fontFamily: "inherit",
                            }}
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link
                            to="/login"
                            style={{ color: "#fff", textDecoration: "none", fontWeight: "500" }}
                        >
                            Login
                        </Link>

                        <Link
                            to="/register"
                            style={{ color: "#fff", textDecoration: "none", fontWeight: "500" }}
                        >
                            Register
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;