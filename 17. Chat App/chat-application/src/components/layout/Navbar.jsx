import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "react-hot-toast";
import { IoChatbubbles } from "react-icons/io5";
import { MdPerson, MdLogout, MdHome, MdChat } from "react-icons/md";

function Navbar() {
    const { user, userData, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            toast.success("Logged out successfully.");
            navigate("/login");
        } catch (err) {
            toast.error("Logout failed.");
        }
    };

    return (
        <nav
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0 24px",
                height: "60px",
                backgroundColor: "var(--bg-sidebar-header)",
                borderBottom: "1px solid var(--color-border)",
                boxShadow: "0 2px 8px var(--color-shadow)",
                transition: "all var(--transition-speed)",
                zIndex: 100,
            }}
        >
            {/* Logo */}
            <Link
                to="/"
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    textDecoration: "none",
                    color: "var(--color-text)",
                }}
            >
                <div
                    style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "8px",
                        backgroundColor: "var(--color-accent)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <IoChatbubbles style={{ color: "white", fontSize: "18px" }} />
                </div>
                <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "700", letterSpacing: "-0.5px" }}>
                    WaveChat
                </h3>
            </Link>

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
                    style={{
                        color: "var(--color-text-muted)",
                        textDecoration: "none",
                        fontSize: "14px",
                        fontWeight: "500",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        transition: "color 0.2s ease",
                    }}
                    onMouseOver={(e) => e.currentTarget.style.color = "var(--color-text)"}
                    onMouseOut={(e) => e.currentTarget.style.color = "var(--color-text-muted)"}
                >
                    <MdHome style={{ fontSize: "18px" }} />
                    <span style={{ display: window.innerWidth <= 600 ? "none" : "inline" }}>Home</span>
                </Link>

                {user ? (
                    <>
                        <Link
                            to="/chat"
                            style={{
                                color: "var(--color-text-muted)",
                                textDecoration: "none",
                                fontSize: "14px",
                                fontWeight: "500",
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                                transition: "color 0.2s ease",
                            }}
                            onMouseOver={(e) => e.currentTarget.style.color = "var(--color-text)"}
                            onMouseOut={(e) => e.currentTarget.style.color = "var(--color-text-muted)"}
                        >
                            <MdChat style={{ fontSize: "18px" }} />
                            <span style={{ display: window.innerWidth <= 600 ? "none" : "inline" }}>Chat</span>
                        </Link>

                        <Link
                            to="/profile"
                            style={{
                                color: "var(--color-text-muted)",
                                textDecoration: "none",
                                fontSize: "14px",
                                fontWeight: "500",
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                                transition: "color 0.2s ease",
                            }}
                            onMouseOver={(e) => e.currentTarget.style.color = "var(--color-text)"}
                            onMouseOut={(e) => e.currentTarget.style.color = "var(--color-text-muted)"}
                        >
                            <img
                                src={userData?.photoURL || user.photoURL || "https://api.dicebear.com/7.x/adventurer/svg?seed=placeholder"}
                                alt="User Thumbnail"
                                style={{
                                    width: "24px",
                                    height: "24px",
                                    borderRadius: "50%",
                                    objectFit: "cover",
                                    border: "1.5px solid var(--color-accent)",
                                }}
                            />
                            <span style={{ display: window.innerWidth <= 600 ? "none" : "inline" }}>Profile</span>
                        </Link>

                        <button
                            onClick={handleLogout}
                            style={{
                                background: "none",
                                border: "none",
                                color: "var(--color-text-muted)",
                                cursor: "pointer",
                                fontSize: "14px",
                                fontWeight: "500",
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                                padding: 0,
                                fontFamily: "inherit",
                                transition: "color 0.2s ease",
                            }}
                            onMouseOver={(e) => e.currentTarget.style.color = "var(--color-text)"}
                            onMouseOut={(e) => e.currentTarget.style.color = "var(--color-text-muted)"}
                        >
                            <MdLogout style={{ fontSize: "18px" }} />
                            <span style={{ display: window.innerWidth <= 600 ? "none" : "inline" }}>Logout</span>
                        </button>
                    </>
                ) : (
                    <>
                        <Link
                            to="/login"
                            style={{
                                color: "var(--color-text-muted)",
                                textDecoration: "none",
                                fontSize: "14px",
                                fontWeight: "500",
                                transition: "color 0.2s ease",
                            }}
                            onMouseOver={(e) => e.currentTarget.style.color = "var(--color-text)"}
                            onMouseOut={(e) => e.currentTarget.style.color = "var(--color-text-muted)"}
                        >
                            Login
                        </Link>

                        <Link
                            to="/register"
                            style={{
                                backgroundColor: "var(--color-accent)",
                                color: "white",
                                textDecoration: "none",
                                fontSize: "13px",
                                fontWeight: "600",
                                padding: "6px 14px",
                                borderRadius: "6px",
                                boxShadow: "0 2px 4px rgba(0,168,132,0.2)",
                                transition: "transform 0.2s ease",
                            }}
                            onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.03)"}
                            onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
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