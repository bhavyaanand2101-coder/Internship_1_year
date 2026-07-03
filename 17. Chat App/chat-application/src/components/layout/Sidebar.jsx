import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { uploadProfilePhoto } from "../../services/chatService";
import { toast } from "react-hot-toast";
import UserList from "../chat/UserList";
import { 
    MdSearch as IconSearch, 
    MdFilterList as IconFilter, 
    MdArrowBack as IconBack, 
    MdCameraAlt as IconCamera, 
    MdEdit as IconEdit, 
    MdCheck as IconCheck, 
    MdLogout as IconLogout, 
    MdDarkMode as IconDark, 
    MdLightMode as IconLight,
    MdSettings as IconSettings
} from "react-icons/md";

function Sidebar({ activePartner, onSelectPartner }) {
    const { user, userData, updateProfileData, logout } = useAuth();
    const [searchQuery, setSearchQuery] = useState("");
    const [filter, setFilter] = useState("all"); // 'all', 'pinned', 'archived'
    
    // Profile Drawer State
    const [showDrawer, setShowDrawer] = useState(false);
    const [isEditingName, setIsEditingName] = useState(false);
    const [tempName, setTempName] = useState(userData?.displayName || user?.displayName || "");
    const [uploading, setUploading] = useState(false);
    
    // Theme toggle state
    const [isDark, setIsDark] = useState(document.documentElement.classList.contains("dark"));

    const handleThemeToggle = () => {
        const nextDark = !isDark;
        setIsDark(nextDark);
        if (nextDark) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
            toast.success("Theme set to Dark Mode");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
            toast.success("Theme set to Light Mode");
        }
    };

    const handlePhotoChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            return toast.error("Please upload image files only.");
        }

        try {
            setUploading(true);
            const downloadUrl = await uploadProfilePhoto(user.uid, file);
            await updateProfileData(tempName, downloadUrl);
            toast.success("Profile photo updated!");
        } catch (err) {
            toast.error("Failed to upload photo: " + err.message);
        } finally {
            setUploading(false);
        }
    };

    const handleSaveName = async () => {
        if (!tempName.trim()) {
            return toast.error("Display name cannot be empty.");
        }
        try {
            setUploading(true);
            await updateProfileData(tempName.trim(), userData?.photoURL || user?.photoURL);
            setIsEditingName(false);
            toast.success("Name updated successfully!");
        } catch (err) {
            toast.error("Failed to update name: " + err.message);
        } finally {
            setUploading(false);
        }
    };

    const handleLogoutClick = async () => {
        try {
            await logout();
            toast.success("Logged out successfully.");
        } catch (err) {
            toast.error("Logout failed.");
        }
    };

    return (
        <div
            style={{
                width: "100%",
                maxWidth: "380px",
                borderRight: "1px solid var(--color-border)",
                display: "flex",
                flexDirection: "column",
                height: "100%",
                backgroundColor: "var(--bg-sidebar)",
                color: "var(--color-text)",
                position: "relative",
                transition: "all var(--transition-speed)",
                zIndex: 10,
            }}
        >
            {/* 1. Header (User Info & Theme Toggle) */}
            <div
                style={{
                    height: "60px",
                    backgroundColor: "var(--bg-sidebar-header)",
                    padding: "10px 16px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    transition: "background-color var(--transition-speed)",
                    borderBottom: "1px solid var(--color-border)",
                }}
            >
                {/* User avatar triggers profile drawer */}
                <div 
                    onClick={() => {
                        setTempName(userData?.displayName || user?.displayName || "");
                        setShowDrawer(true);
                    }}
                    style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}
                    title="View Profile Settings"
                >
                    <img
                        src={userData?.photoURL || user?.photoURL || "https://api.dicebear.com/7.x/adventurer/svg?seed=placeholder"}
                        alt="Profile Avatar"
                        style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            objectFit: "cover",
                            border: "1.5px solid var(--color-border)",
                            backgroundColor: "var(--bg-panel)",
                            transition: "transform 0.2s ease",
                        }}
                        onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                        onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
                    />
                </div>

                {/* Right controls */}
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <button
                        onClick={handleThemeToggle}
                        style={{
                            background: "none",
                            border: "none",
                            padding: "6px",
                            borderRadius: "50%",
                            color: "var(--color-text-muted)",
                            fontSize: "20px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                        title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
                    >
                        {isDark ? <IconLight style={{ color: "#facc15" }} /> : <IconDark />}
                    </button>

                    <button
                        onClick={() => setShowDrawer(true)}
                        style={{
                            background: "none",
                            border: "none",
                            padding: "6px",
                            color: "var(--color-text-muted)",
                            fontSize: "20px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                        title="Profile Settings"
                    >
                        <IconSettings />
                    </button>

                    <button
                        onClick={handleLogoutClick}
                        style={{
                            background: "none",
                            border: "none",
                            padding: "6px",
                            color: "var(--color-text-muted)",
                            fontSize: "20px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                        title="Logout"
                    >
                        <IconLogout />
                    </button>
                </div>
            </div>

            {/* 2. Search & Filter Section */}
            <div
                style={{
                    padding: "8px 12px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    borderBottom: "1px solid var(--color-border)",
                }}
            >
                <div
                    style={{
                        flex: 1,
                        position: "relative",
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    <IconSearch
                        style={{
                            position: "absolute",
                            left: "12px",
                            color: "var(--color-text-muted)",
                            fontSize: "18px",
                            pointerEvents: "none",
                        }}
                    />
                    <input
                        type="text"
                        placeholder="Search or start new chat"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="custom-input"
                        style={{
                            width: "100%",
                            padding: "8px 12px 8px 40px",
                            fontSize: "14px",
                            height: "36px",
                        }}
                    />
                </div>
                
                <button
                    style={{
                        background: "none",
                        border: "none",
                        fontSize: "22px",
                        color: "var(--color-text-muted)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "4px",
                    }}
                    title="Filters"
                >
                    <IconFilter />
                </button>
            </div>

            {/* 3. Filter pills (All, Pinned, Archived) */}
            <div
                style={{
                    display: "flex",
                    gap: "8px",
                    padding: "8px 12px",
                    borderBottom: "1px solid var(--color-border)",
                }}
            >
                {["all", "pinned", "archived"].map((type) => (
                    <button
                        key={type}
                        onClick={() => setFilter(type)}
                        style={{
                            padding: "6px 14px",
                            fontSize: "12.5px",
                            fontWeight: "500",
                            border: "none",
                            borderRadius: "16px",
                            textTransform: "capitalize",
                            backgroundColor: filter === type ? "var(--bg-pill-active)" : "var(--bg-sidebar-search)",
                            color: filter === type ? "var(--color-pill-active)" : "var(--color-text-muted)",
                            boxShadow: filter === type ? "0 2px 4px var(--color-shadow)" : "none",
                            transition: "all 0.2s ease",
                        }}
                    >
                        {type}
                    </button>
                ))}
            </div>

            {/* 4. Chat Cards Scroll Panel */}
            <div style={{ flex: 1, overflowY: "auto", backgroundColor: "var(--bg-panel)" }}>
                <UserList
                    activePartner={activePartner}
                    onSelectPartner={onSelectPartner}
                    searchQuery={searchQuery}
                    filter={filter}
                />
            </div>

            {/* 5. Sliding Profile Drawer Overlay */}
            {showDrawer && (
                <div className="drawer-container animate-slide-in">
                    {/* Drawer Header */}
                    <div
                        style={{
                            height: "100px",
                            backgroundColor: "var(--color-accent)",
                            color: "white",
                            padding: "0 20px",
                            display: "flex",
                            alignItems: "flex-end",
                            paddingBottom: "15px",
                            gap: "20px",
                        }}
                    >
                        <button
                            onClick={() => setShowDrawer(false)}
                            style={{
                                background: "none",
                                border: "none",
                                color: "white",
                                fontSize: "22px",
                                padding: 0,
                                display: "flex",
                                alignItems: "center",
                                cursor: "pointer",
                            }}
                        >
                            <IconBack />
                        </button>
                        <h3 style={{ fontSize: "19px", fontWeight: "600", margin: 0 }}>Profile</h3>
                    </div>

                    {/* Drawer Body */}
                    <div style={{ flex: 1, overflowY: "auto", padding: "24px 20px", display: "flex", flexDirection: "column", gap: "24px" }}>
                        
                        {/* 1. Large Avatar and Photo Uploader */}
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
                            <div style={{ position: "relative", cursor: "pointer" }}>
                                <img
                                    src={userData?.photoURL || user?.photoURL || "https://api.dicebear.com/7.x/adventurer/svg?seed=placeholder"}
                                    alt="Large Profile Avatar"
                                    style={{
                                        width: "140px",
                                        height: "140px",
                                        borderRadius: "50%",
                                        objectFit: "cover",
                                        border: "3px solid var(--color-accent)",
                                        backgroundColor: "var(--bg-panel)",
                                        opacity: uploading ? 0.6 : 1,
                                    }}
                                />
                                <label
                                    style={{
                                        position: "absolute",
                                        bottom: "6px",
                                        right: "6px",
                                        backgroundColor: "var(--color-accent)",
                                        color: "white",
                                        width: "36px",
                                        height: "36px",
                                        borderRadius: "50%",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        cursor: "pointer",
                                        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                                    }}
                                    title="Upload Photo"
                                >
                                    <IconCamera style={{ fontSize: "18px" }} />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handlePhotoChange}
                                        style={{ display: "none" }}
                                        disabled={uploading}
                                    />
                                </label>
                            </div>
                        </div>

                        {/* 2. Display Name edit area */}
                        <div style={{ borderBottom: "1px solid var(--color-border)", paddingBottom: "12px" }}>
                            <span style={{ fontSize: "12px", color: "var(--color-accent)", fontWeight: "600" }}>Your Name</span>
                            {!isEditingName ? (
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px" }}>
                                    <span style={{ fontSize: "16px", fontWeight: "500" }}>
                                        {userData?.displayName || user?.displayName || "WaveChat User"}
                                    </span>
                                    <button
                                        onClick={() => setIsEditingName(true)}
                                        style={{ background: "none", border: "none", color: "var(--color-text-muted)", fontSize: "18px" }}
                                    >
                                        <IconEdit />
                                    </button>
                                </div>
                            ) : (
                                <div style={{ display: "flex", gap: "8px", alignItems: "center", marginTop: "8px" }}>
                                    <input
                                        type="text"
                                        value={tempName}
                                        onChange={(e) => setTempName(e.target.value)}
                                        className="custom-input"
                                        style={{ flex: 1, padding: "6px 10px", fontSize: "14px" }}
                                        autoFocus
                                    />
                                    <button
                                        onClick={handleSaveName}
                                        style={{ background: "none", border: "none", color: "var(--color-accent)", fontSize: "20px" }}
                                    >
                                        <IconCheck />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* 3. Account Details (Email Read Only) */}
                        <div style={{ borderBottom: "1px solid var(--color-border)", paddingBottom: "12px" }}>
                            <span style={{ fontSize: "12px", color: "var(--color-accent)", fontWeight: "600" }}>Registered Email</span>
                            <div style={{ fontSize: "15px", marginTop: "8px", color: "var(--color-text-muted)" }}>
                                {user?.email}
                            </div>
                        </div>

                        {/* 4. About Status Section */}
                        <div style={{ borderBottom: "1px solid var(--color-border)", paddingBottom: "12px" }}>
                            <span style={{ fontSize: "12px", color: "var(--color-accent)", fontWeight: "600" }}>About</span>
                            <div style={{ fontSize: "14px", marginTop: "8px", fontStyle: "italic", color: "var(--color-text-muted)" }}>
                                Available on WaveChat Clone!
                            </div>
                        </div>

                        {/* 5. Theme toggle inside settings */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "12px" }}>
                            <span style={{ fontSize: "14px", fontWeight: "500" }}>Dark Mode Preference</span>
                            <button
                                onClick={handleThemeToggle}
                                style={{
                                    background: "none",
                                    border: "none",
                                    padding: "6px 12px",
                                    borderRadius: "16px",
                                    backgroundColor: "var(--bg-sidebar-search)",
                                    color: "var(--color-text)",
                                    fontSize: "12px",
                                    fontWeight: "600",
                                }}
                            >
                                {isDark ? "Disable" : "Enable"}
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}

export default Sidebar;