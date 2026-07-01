import { useState, useEffect } from "react";
import Sidebar from "../components/layout/Sidebar";
import ChatBox from "../components/chat/ChatBox";

function Chat() {
    const [activePartner, setActivePartner] = useState(null);
    const [mobileShowChat, setMobileShowChat] = useState(false);
    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const isMobile = width <= 768;

    const handleSelectPartner = (partner) => {
        setActivePartner(partner);
        setMobileShowChat(true);
    };

    const handleBackToSidebar = () => {
        setMobileShowChat(false);
    };

    return (
        <div style={{ display: "flex", height: "calc(100vh - 60px)", overflow: "hidden" }}>
            {/* Sidebar (shown if desktop OR on mobile when not chatting) */}
            {(!isMobile || !mobileShowChat) && (
                <Sidebar
                    activePartner={activePartner}
                    onSelectPartner={handleSelectPartner}
                />
            )}

            {/* Chat Box (shown if desktop OR on mobile when chatting) */}
            {(!isMobile || mobileShowChat) && (
                <ChatBox
                    activePartner={activePartner}
                    onBack={handleBackToSidebar}
                />
            )}
        </div>
    );
}

export default Chat;