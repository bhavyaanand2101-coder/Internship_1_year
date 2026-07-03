import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../hooks/useAuth";
import { setTypingStatus } from "../../services/chatService";
import { toast } from "react-hot-toast";
import EmojiPicker from "emoji-picker-react";
import { 
    MdSentimentSatisfiedAlt, 
    MdAttachFile, 
    MdMic, 
    MdSend, 
    MdDelete, 
    MdCancel 
} from "react-icons/md";

function ChatInput({ onSendMessage, onAttachFile, partnerUid }) {
    const { user } = useAuth();
    const [text, setText] = useState("");
    const [showEmojis, setShowEmojis] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    // Voice recording states
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const timerIntervalRef = useRef(null);

    const inputRef = useRef(null);
    const emojiContainerRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    // Close emoji picker on clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (emojiContainerRef.current && !emojiContainerRef.current.contains(e.target)) {
                setShowEmojis(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Typing activity timer
    const handleChange = (e) => {
        const val = e.target.value;
        setText(val);

        if (!user?.uid || !partnerUid) return;

        setTypingStatus(user.uid, partnerUid, true);

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = setTimeout(() => {
            setTypingStatus(user.uid, partnerUid, false);
        }, 2000);
    };

    // Submit send message (text + image attachment if loaded in parent)
    const handleSubmit = (e) => {
        if (e) e.preventDefault();
        
        // Block empty sends
        if (!text.trim()) return;

        onSendMessage(text.trim());
        setText("");
        setShowEmojis(false);
        inputRef.current?.focus();

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }
        setTypingStatus(user.uid, partnerUid, false);
    };

    const handleEmojiClick = (emojiData) => {
        setText((prev) => prev + emojiData.emoji);
        inputRef.current?.focus();
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith("image/")) {
                return toast.error("Only image uploads are supported.");
            }
            onAttachFile(file);
            toast.success("Image attached!");
        }
    };

    // Voice Recording Actions
    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            audioChunksRef.current = [];
            
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;

            mediaRecorder.ondataavailable = (event) => {
                if (event.data && event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = async () => {
                // Discard recording if stream was terminated manually (canceling)
                if (audioChunksRef.current.length === 0) return;
                
                const audioBlob = new Blob(audioChunksRef.current, { type: "audio/mp3" });
                
                // Stop all hardware tracks to free microphone resources
                stream.getTracks().forEach((track) => track.stop());
                
                // Send voice message
                onSendMessage("", audioBlob);
                toast.success("Voice message sent!");
            };

            mediaRecorder.start();
            setIsRecording(true);
            setRecordingTime(0);

            // Start duration timer
            timerIntervalRef.current = setInterval(() => {
                setRecordingTime((prev) => prev + 1);
            }, 1000);

            // Notify typing status
            setTypingStatus(user.uid, partnerUid, true);
        } catch (err) {
            toast.error("Microphone permission denied or device not found.");
            console.error(err);
        }
    };

    const stopAndSendRecording = () => {
        if (!mediaRecorderRef.current || mediaRecorderRef.current.state !== "recording") return;
        
        clearInterval(timerIntervalRef.current);
        mediaRecorderRef.current.stop();
        setIsRecording(false);
        setTypingStatus(user.uid, partnerUid, false);
    };

    const cancelRecording = () => {
        if (!mediaRecorderRef.current) return;
        
        clearInterval(timerIntervalRef.current);
        
        // Empty chunks so onstop ignores file uploads
        audioChunksRef.current = [];
        
        mediaRecorderRef.current.stop();
        setIsRecording(false);
        setTypingStatus(user.uid, partnerUid, false);
        toast("Recording discarded");
    };

    // Drag and Drop files
    useEffect(() => {
        const handleDragOver = (e) => {
            e.preventDefault();
            setIsDragging(true);
        };

        const handleDragLeave = (e) => {
            e.preventDefault();
            setIsDragging(false);
        };

        const handleDrop = (e) => {
            e.preventDefault();
            setIsDragging(false);
            const file = e.dataTransfer?.files?.[0];
            if (file && file.type.startsWith("image/")) {
                onAttachFile(file);
                toast.success("Image dropped successfully!");
            } else if (file) {
                toast.error("Only image drop attachments are supported.");
            }
        };

        window.addEventListener("dragover", handleDragOver);
        window.addEventListener("dragleave", handleDragLeave);
        window.addEventListener("drop", handleDrop);

        return () => {
            window.removeEventListener("dragover", handleDragOver);
            window.removeEventListener("dragleave", handleDragLeave);
            window.removeEventListener("drop", handleDrop);
        };
    }, [onAttachFile]);

    const formatRecordingTimer = (totalSecs) => {
        const mins = Math.floor(totalSecs / 60);
        const secs = totalSecs % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    return (
        <div
            style={{
                padding: "8px 16px",
                borderTop: "1px solid var(--color-border)",
                backgroundColor: "var(--bg-chat-input)",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                zIndex: 15,
            }}
        >
            {/* Drag drop area overlay */}
            {isDragging && (
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        backgroundColor: "rgba(0,168,132,0.06)",
                        border: "2.5px dashed var(--color-accent)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        color: "var(--color-accent-dark)",
                        fontWeight: "600",
                        zIndex: 100,
                        pointerEvents: "none",
                        fontSize: "14px",
                    }}
                >
                    Drop image here to attach
                </div>
            )}

            {/* Emoji picker popover container */}
            {showEmojis && (
                <div
                    ref={emojiContainerRef}
                    className="animate-fade-in"
                    style={{
                        position: "absolute",
                        bottom: "60px",
                        left: "12px",
                        zIndex: 200,
                        boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                        borderRadius: "10px",
                        overflow: "hidden",
                    }}
                >
                    <EmojiPicker 
                        onEmojiClick={handleEmojiClick}
                        theme={document.documentElement.classList.contains("dark") ? "dark" : "light"}
                        width={330}
                        height={400}
                    />
                </div>
            )}

            {/* Conditional input panels */}
            {!isRecording ? (
                <form
                    onSubmit={handleSubmit}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        width: "100%",
                    }}
                >
                    {/* Emoji Trigger */}
                    <button
                        type="button"
                        onClick={() => setShowEmojis(!showEmojis)}
                        style={{
                            background: "none",
                            border: "none",
                            fontSize: "24px",
                            cursor: "pointer",
                            padding: "4px",
                            color: "var(--color-text-muted)",
                            display: "flex",
                            alignItems: "center",
                        }}
                        title="Emojis"
                    >
                        <MdSentimentSatisfiedAlt />
                    </button>

                    {/* Image Attachment Trigger */}
                    <label
                        style={{
                            fontSize: "24px",
                            cursor: "pointer",
                            padding: "4px",
                            color: "var(--color-text-muted)",
                            display: "flex",
                            alignItems: "center",
                        }}
                        title="Attach Image"
                    >
                        <MdAttachFile style={{ transform: "rotate(45deg)" }} />
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileSelect}
                            style={{ display: "none" }}
                        />
                    </label>

                    {/* Chat Text Input Field */}
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Type a message"
                        value={text}
                        onChange={handleChange}
                        className="custom-input"
                        style={{
                            flex: 1,
                            padding: "10px 18px",
                            fontSize: "14.5px",
                            height: "40px",
                            boxSizing: "border-box",
                        }}
                    />

                    {/* Dynamic Action Button: Send Text vs. Record Mic */}
                    {text.trim() ? (
                        <button
                            type="submit"
                            style={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "50%",
                                backgroundColor: "var(--color-accent)",
                                color: "white",
                                border: "none",
                                cursor: "pointer",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                flexShrink: 0,
                                boxShadow: "0 2px 4px rgba(0, 168, 132, 0.25)",
                            }}
                            title="Send"
                        >
                            <MdSend style={{ fontSize: "18px", marginLeft: "2px" }} />
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={startRecording}
                            style={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "50%",
                                backgroundColor: "var(--bg-sidebar-search)",
                                color: "var(--color-text-muted)",
                                border: "none",
                                cursor: "pointer",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                flexShrink: 0,
                                transition: "all 0.2s ease",
                            }}
                            title="Record Voice Note"
                        >
                            <MdMic style={{ fontSize: "20px" }} />
                        </button>
                    )}
                </form>
            ) : (
                /* Voice message active recording toolbar panel */
                <div
                    className="animate-fade-in"
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "100%",
                        height: "40px",
                        gap: "16px",
                    }}
                >
                    {/* Discard / Delete Recording button */}
                    <button
                        type="button"
                        onClick={cancelRecording}
                        style={{
                            background: "none",
                            border: "none",
                            color: "#ef4444",
                            fontSize: "22px",
                            cursor: "pointer",
                            padding: "4px",
                            display: "flex",
                            alignItems: "center",
                        }}
                        title="Cancel Recording"
                    >
                        <MdDelete />
                    </button>

                    {/* Timer and Wave panel */}
                    <div 
                        style={{ 
                            flex: 1, 
                            display: "flex", 
                            alignItems: "center", 
                            justifyContent: "center", 
                            gap: "8px",
                            color: "var(--color-text)",
                            fontSize: "14px",
                            fontWeight: "500",
                        }}
                    >
                        {/* Pulse indicator */}
                        <div 
                            style={{ 
                                width: "8px", 
                                height: "8px", 
                                borderRadius: "50%", 
                                backgroundColor: "#ef4444",
                                animation: "pulse 1s infinite",
                            }}
                        ></div>
                        <span>Recording voice note... {formatRecordingTimer(recordingTime)}</span>
                    </div>

                    {/* Send Recording button */}
                    <button
                        type="button"
                        onClick={stopAndSendRecording}
                        style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            backgroundColor: "var(--color-accent)",
                            color: "white",
                            border: "none",
                            cursor: "pointer",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            flexShrink: 0,
                            boxShadow: "0 2px 4px rgba(0, 168, 132, 0.25)",
                        }}
                        title="Send Voice Note"
                    >
                        <MdSend style={{ fontSize: "18px", marginLeft: "2px" }} />
                    </button>
                </div>
            )}
        </div>
    );
}

export default ChatInput;