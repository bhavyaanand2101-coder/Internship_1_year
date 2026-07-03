import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { uploadProfilePhoto } from "../services/chatService";
import { toast } from "react-hot-toast";
import { 
    MdArrowBack, 
    MdCameraAlt, 
    MdPerson, 
    MdEmail, 
    MdLogout, 
    MdSave 
} from "react-icons/md";

function Profile() {
    const { user, userData, updateProfileData, logout } = useAuth();
    const navigate = useNavigate();

    const [displayName, setDisplayName] = useState(userData?.displayName || user?.displayName || "");
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(userData?.photoURL || user?.photoURL || "");
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (selected) {
            if (!selected.type.startsWith("image/")) {
                return toast.error("Please select an image file only.");
            }
            setFile(selected);
            setPreviewUrl(URL.createObjectURL(selected));
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        if (!displayName.trim()) {
            return toast.error("Display name is required.");
        }

        try {
            setLoading(true);
            let photoURL = userData?.photoURL || user?.photoURL;

            if (file) {
                photoURL = await uploadProfilePhoto(user.uid, file);
            }

            await updateProfileData(displayName.trim(), photoURL);
            toast.success("Profile updated successfully!");
            setFile(null);
        } catch (err) {
            toast.error("Failed to update profile: " + err.message);
        } finally {
            setLoading(false);
        }
    };

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
                    maxWidth: "440px",
                    padding: "36px 30px",
                    borderRadius: "16px",
                    boxShadow: "0 8px 32px var(--color-shadow)",
                    color: "var(--color-text)",
                    border: "1px solid var(--color-border)",
                    transition: "all 0.3s ease",
                }}
            >
                {/* Back button and title */}
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "30px" }}>
                    <button
                        onClick={() => navigate("/chat")}
                        style={{
                            background: "none",
                            border: "none",
                            color: "var(--color-text-muted)",
                            fontSize: "22px",
                            cursor: "pointer",
                            padding: "4px",
                            display: "flex",
                            alignItems: "center",
                        }}
                        title="Back to Chat"
                    >
                        <MdArrowBack />
                    </button>
                    <h2 style={{ fontSize: "22px", fontWeight: "700", color: "var(--color-accent)", margin: 0 }}>
                        Profile Settings
                    </h2>
                </div>

                <form onSubmit={handleUpdate}>
                    {/* Large Photo Preview and Uploader */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "26px" }}>
                        <div style={{ position: "relative" }}>
                            <img
                                src={previewUrl || "https://api.dicebear.com/7.x/adventurer/svg?seed=placeholder"}
                                alt="Avatar Preview"
                                style={{
                                    width: "110px",
                                    height: "110px",
                                    borderRadius: "50%",
                                    objectFit: "cover",
                                    border: "3.5px solid var(--color-accent)",
                                    backgroundColor: "var(--bg-panel)",
                                }}
                            />
                            <label
                                style={{
                                    position: "absolute",
                                    bottom: "4px",
                                    right: "4px",
                                    backgroundColor: "var(--color-accent)",
                                    color: "white",
                                    width: "32px",
                                    height: "32px",
                                    borderRadius: "50%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    cursor: "pointer",
                                    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                                }}
                                title="Change Photo"
                            >
                                <MdCameraAlt style={{ fontSize: "16px" }} />
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    style={{ display: "none" }}
                                />
                            </label>
                        </div>
                    </div>

                    {/* Display Name Input */}
                    <div style={{ marginBottom: "18px" }}>
                        <label 
                            style={{ 
                                fontSize: "12.5px", 
                                color: "var(--color-accent)", 
                                fontWeight: "600", 
                                display: "block", 
                                marginBottom: "6px" 
                            }}
                        >
                            Display Name
                        </label>
                        <div style={{ position: "relative" }}>
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
                                required
                            />
                        </div>
                    </div>

                    {/* Email Read-only Info */}
                    <div style={{ marginBottom: "26px" }}>
                        <label 
                            style={{ 
                                fontSize: "12.5px", 
                                color: "var(--color-text-muted)", 
                                fontWeight: "600", 
                                display: "block", 
                                marginBottom: "6px" 
                            }}
                        >
                            Email Address (Read Only)
                        </label>
                        <div style={{ position: "relative" }}>
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
                                value={user?.email || ""}
                                disabled
                                className="custom-input"
                                style={{
                                    width: "100%",
                                    padding: "12px 16px 12px 42px",
                                    boxSizing: "border-box",
                                    fontSize: "14px",
                                    height: "46px",
                                    backgroundColor: "var(--bg-sidebar-search)",
                                    color: "var(--color-text-muted)",
                                    cursor: "not-allowed",
                                    border: "1px solid var(--color-border)",
                                }}
                            />
                        </div>
                    </div>

                    {/* Actions Row */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
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
                                gap: "8px",
                                boxShadow: "0 4px 12px rgba(0, 168, 132, 0.25)",
                            }}
                        >
                            <MdSave style={{ fontSize: "18px" }} />
                            {loading ? "Saving Changes..." : "Save Changes"}
                        </button>

                        <button
                            type="button"
                            onClick={handleLogout}
                            style={{
                                width: "100%",
                                height: "46px",
                                background: "transparent",
                                color: "#ef4444",
                                border: "1px solid #ef4444",
                                borderRadius: "8px",
                                fontWeight: "600",
                                fontSize: "15px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "8px",
                                transition: "all 0.2s ease",
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.06)";
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.backgroundColor = "transparent";
                            }}
                        >
                            <MdLogout style={{ fontSize: "18px" }} />
                            Logout Session
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Profile;