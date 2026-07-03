import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { IoChatbubbles } from "react-icons/io5";

function Home() {
    const { user } = useAuth();

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "calc(100vh - 60px)",
                backgroundColor: "var(--bg-app)",
                padding: "20px",
                textAlign: "center",
                transition: "background-color 0.3s ease",
            }}
        >
            <div
                className="glass-panel animate-fade-in"
                style={{
                    maxWidth: "500px",
                    padding: "48px 40px",
                    borderRadius: "20px",
                    boxShadow: "0 12px 40px var(--color-shadow)",
                    border: "1px solid var(--color-border)",
                }}
            >
                <div
                    style={{
                        width: "80px",
                        height: "80px",
                        borderRadius: "50%",
                        backgroundColor: "rgba(0, 168, 132, 0.1)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        margin: "0 auto 24px auto",
                    }}
                >
                    <IoChatbubbles style={{ fontSize: "40px", color: "var(--color-accent)" }} />
                </div>

                <h1
                    style={{
                        fontSize: "36px",
                        fontWeight: "800",
                        color: "var(--color-text)",
                        margin: "0 0 12px 0",
                        letterSpacing: "-0.5px",
                        padding: 0,
                    }}
                >
                    WaveChat
                </h1>
                
                <p
                    style={{
                        fontSize: "16px",
                        color: "var(--color-text-muted)",
                        lineHeight: "1.6",
                        margin: "0 0 32px 0",
                    }}
                >
                    Experience fast, secure, and real-time communication. Connect with your friends, send images, share voice messages, and customize your experience with Light and Dark modes.
                </p>

                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px",
                        width: "100%",
                    }}
                >
                    {user ? (
                        <Link
                            to="/chat"
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                height: "48px",
                                backgroundColor: "var(--color-accent)",
                                color: "#fff",
                                borderRadius: "8px",
                                fontWeight: "600",
                                textDecoration: "none",
                                boxShadow: "0 4px 12px rgba(0, 168, 132, 0.25)",
                            }}
                        >
                            Open Web Workspace
                        </Link>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    height: "48px",
                                    backgroundColor: "var(--color-accent)",
                                    color: "#fff",
                                    borderRadius: "8px",
                                    fontWeight: "600",
                                    textDecoration: "none",
                                    boxShadow: "0 4px 12px rgba(0, 168, 132, 0.25)",
                                }}
                            >
                                Log In
                            </Link>
                            <Link
                                to="/register"
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    height: "48px",
                                    backgroundColor: "var(--bg-panel)",
                                    color: "var(--color-text)",
                                    borderRadius: "8px",
                                    fontWeight: "600",
                                    textDecoration: "none",
                                    border: "1px solid var(--color-border)",
                                    boxShadow: "0 2px 4px var(--color-shadow)",
                                }}
                            >
                                Create Account
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Home;