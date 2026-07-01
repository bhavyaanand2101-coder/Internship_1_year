import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { uploadProfilePhoto } from "../services/chatService";

function Profile() {
    const { user, userData, updateProfileData, logout } = useAuth();
    const navigate = useNavigate();

    const [displayName, setDisplayName] = useState(userData?.displayName || user?.displayName || "");
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(userData?.photoURL || user?.photoURL || "");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (selected) {
            if (!selected.type.startsWith("image/")) {
                return setError("Select an image file only.");
            }
            setFile(selected);
            setPreviewUrl(URL.createObjectURL(selected));
            setError("");
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setSuccess("");
        setError("");

        if (!displayName.trim()) {
            return setError("Display name is required.");
        }

        try {
            setLoading(true);
            let photoURL = userData?.photoURL || user?.photoURL;

            if (file) {
                photoURL = await uploadProfilePhoto(user.uid, file);
            }

            await updateProfileData(displayName.trim(), photoURL);
            setSuccess("Profile updated successfully!");
            setFile(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/login");
        } catch (err) {
            setError("Logout failed.");
        }
    };

    return (
        <div
            style={{
                maxWidth: "400px",
                margin: "50px auto",
                padding: "30px",
                border: "1px solid var(--wa-border)",
                borderRadius: "10px",
                backgroundColor: "#fff",
                color: "var(--wa-text)",
                boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
            }}
        >
            <h2 style={{ textAlign: "center", color: "var(--wa-green-dark)", margin: "0 0 20px 0" }}>Profile Settings</h2>

            <form onSubmit={handleUpdate} style={{ marginTop: "20px" }}>
                {/* Avatar Preview */}
                <div style={{ textAlign: "center", marginBottom: "20px" }}>
                    <img
                        src={previewUrl || "https://api.dicebear.com/7.x/adventurer/svg?seed=placeholder"}
                        alt="Avatar"
                        style={{
                            width: "100px",
                            height: "100px",
                            borderRadius: "50%",
                            objectFit: "cover",
                            border: "3px solid var(--wa-green)",
                            marginBottom: "10px",
                        }}
                    />
                    <div>
                        <label
                            style={{
                                color: "var(--wa-green)",
                                cursor: "pointer",
                                fontSize: "14px",
                                textDecoration: "none",
                                fontWeight: "600",
                            }}
                        >
                            Change Photo
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
                <div style={{ marginBottom: "15px" }}>
                    <label style={{ fontSize: "13px", color: "var(--wa-text-muted)", display: "block", marginBottom: "4px" }}>
                        Display Name
                    </label>
                    <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        style={{
                            width: "100%",
                            padding: "10px",
                            border: "1px solid var(--wa-border)",
                            borderRadius: "4px",
                            boxSizing: "border-box",
                            outline: "none",
                            fontSize: "14px",
                        }}
                        required
                    />
                </div>

                {/* Email Read-only */}
                <div style={{ marginBottom: "20px" }}>
                    <label style={{ fontSize: "13px", color: "var(--wa-text-muted)", display: "block", marginBottom: "4px" }}>
                        Email (Read Only)
                    </label>
                    <input
                        type="email"
                        value={user?.email || ""}
                        disabled
                        style={{
                            width: "100%",
                            padding: "10px",
                            border: "1px solid var(--wa-border)",
                            borderRadius: "4px",
                            backgroundColor: "var(--wa-search-bg)",
                            cursor: "not-allowed",
                            boxSizing: "border-box",
                            color: "var(--wa-text-muted)",
                            fontSize: "14px",
                        }}
                    />
                </div>

                {error && <p style={{ color: "red", fontSize: "14px", margin: "10px 0" }}>{error}</p>}
                {success && <p style={{ color: "green", fontSize: "14px", margin: "10px 0" }}>{success}</p>}

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        width: "100%",
                        padding: "12px",
                        background: "var(--wa-green)",
                        color: "#fff",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        fontWeight: "600",
                        fontSize: "15px",
                    }}
                >
                    {loading ? "Saving..." : "Save Changes"}
                </button>
            </form>

            <button
                onClick={handleLogout}
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
                Logout
            </button>
        </div>
    );
}

export default Profile;