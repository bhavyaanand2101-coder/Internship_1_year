import { useState, useEffect } from "react";
import { 
    MdMic, 
    MdMicOff, 
    MdVideocam, 
    MdVideocamOff, 
    MdCallEnd 
} from "react-icons/md";

function CallingModal({ partner, isVideo, onClose }) {
    const [status, setStatus] = useState("Ringing...");
    const [seconds, setSeconds] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const [cameraOff, setCameraOff] = useState(false);

    // 1. Simulate call connection after 3.5 seconds
    useEffect(() => {
        const connectionTimeout = setTimeout(() => {
            setStatus("Connected");
        }, 3500);

        return () => clearTimeout(connectionTimeout);
    }, []);

    // 2. Track call timer once connected
    useEffect(() => {
        if (status !== "Connected") return;

        const interval = setInterval(() => {
            setSeconds((prev) => prev + 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [status]);

    // Formats call duration timer
    const formatDuration = (totalSecs) => {
        const mins = Math.floor(totalSecs / 60);
        const secs = totalSecs % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    return (
        <div className="calling-overlay animate-fade-in">
            {/* Call Info details */}
            <div style={{ textAlign: "center", marginTop: "30px" }}>
                <h4 style={{ fontSize: "14px", textTransform: "uppercase", letterSpacing: "1.5px", opacity: 0.6, marginBottom: "8px" }}>
                    {isVideo ? "WaveChat Video Call" : "WaveChat Voice Call"}
                </h4>
                <h2 style={{ fontSize: "28px", fontWeight: "600", marginBottom: "8px" }}>{partner.displayName}</h2>
                <p style={{ fontSize: "16px", color: "#1fa855", fontWeight: "500" }}>
                    {status === "Connected" ? formatDuration(seconds) : status}
                </p>
            </div>

            {/* Pulsing Avatar container */}
            <div className="calling-avatar-ring">
                {isVideo && !cameraOff ? (
                    <div 
                        style={{ 
                            width: "180px", 
                            height: "180px", 
                            borderRadius: "16px", 
                            backgroundColor: "#202c33", 
                            display: "flex", 
                            alignItems: "center", 
                            justifyContent: "center",
                            boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
                            border: "2.5px solid var(--color-accent)",
                            overflow: "hidden",
                            zIndex: 10,
                        }}
                    >
                        {/* Simulates Camera Feed with Avatar */}
                        <img 
                            src={partner.photoURL || "https://api.dicebear.com/7.x/adventurer/svg?seed=placeholder"} 
                            alt="Video feed avatar" 
                            style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                        />
                    </div>
                ) : (
                    <img
                        src={partner.photoURL || "https://api.dicebear.com/7.x/adventurer/svg?seed=placeholder"}
                        alt="Contact Avatar"
                        className="calling-avatar"
                    />
                )}
            </div>

            {/* In-Call Controls bar */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "24px",
                    backgroundColor: "rgba(32, 44, 51, 0.9)",
                    padding: "16px 32px",
                    borderRadius: "40px",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                    border: "1px solid rgba(255, 255, 255, 0.05)",
                    backdropFilter: "blur(8px)",
                }}
            >
                {/* Mute Mic toggle */}
                <button
                    onClick={() => setIsMuted(!isMuted)}
                    style={{
                        background: isMuted ? "#ef4444" : "rgba(255, 255, 255, 0.15)",
                        border: "none",
                        color: "white",
                        width: "48px",
                        height: "48px",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "22px",
                    }}
                    title={isMuted ? "Unmute Microphone" : "Mute Microphone"}
                >
                    {isMuted ? <MdMicOff /> : <MdMic />}
                </button>

                {/* End Call red button */}
                <button
                    onClick={onClose}
                    style={{
                        background: "#ef4444",
                        border: "none",
                        color: "white",
                        width: "60px",
                        height: "60px",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "30px",
                        boxShadow: "0 4px 16px rgba(239, 68, 68, 0.35)",
                    }}
                    title="End Call"
                >
                    <MdCallEnd />
                </button>

                {/* Camera Toggle (Video Calls only) */}
                <button
                    onClick={() => setCameraOff(!cameraOff)}
                    disabled={!isVideo}
                    style={{
                        background: cameraOff ? "#ef4444" : "rgba(255, 255, 255, 0.15)",
                        border: "none",
                        color: "white",
                        width: "48px",
                        height: "48px",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "22px",
                        opacity: isVideo ? 1 : 0.4,
                        cursor: isVideo ? "pointer" : "not-allowed",
                    }}
                    title={cameraOff ? "Turn Camera On" : "Turn Camera Off"}
                >
                    {cameraOff ? <MdVideocamOff /> : <MdVideocam />}
                </button>
            </div>
        </div>
    );
}

export default CallingModal;
