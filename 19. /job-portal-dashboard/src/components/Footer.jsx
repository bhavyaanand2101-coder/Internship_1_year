import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { 
    IoLogoLinkedin, 
    IoLogoTwitter, 
    IoLogoGithub, 
    IoLogoFacebook,
    IoSend 
} from "react-icons/io5";

function Footer() {
    const [email, setEmail] = useState("");

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (!email.trim()) {
            return toast.error("Please enter a valid email address.");
        }
        toast.success(`Subscribed successfully with ${email}!`);
        setEmail("");
    };

    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-top">
                    {/* Brand Info */}
                    <div className="footer-brand">
                        <h2>CareerHub</h2>
                        <p>
                            Discover your next career move with personalized job recommendations, direct hiring paths, and verified company reviews.
                        </p>
                        <div className="footer-socials">
                            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="social-icon" aria-label="LinkedIn">
                                <IoLogoLinkedin />
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="social-icon" aria-label="Twitter">
                                <IoLogoTwitter />
                            </a>
                            <a href="https://github.com" target="_blank" rel="noreferrer" className="social-icon" aria-label="GitHub">
                                <IoLogoGithub />
                            </a>
                            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-icon" aria-label="Facebook">
                                <IoLogoFacebook />
                            </a>
                        </div>
                    </div>

                    {/* Quick links 1 */}
                    <div className="footer-links">
                        <h3>For Job Seekers</h3>
                        <ul>
                            <li><Link to="/jobs">Search Jobs</Link></li>
                            <li><Link to="/saved">Saved Listings</Link></li>
                            <li><a href="#categories">Popular Categories</a></li>
                            <li><a href="#companies">Featured Employers</a></li>
                        </ul>
                    </div>

                    {/* Quick links 2 */}
                    <div className="footer-links">
                        <h3>Resources</h3>
                        <ul>
                            <li><a href="#about">About Us</a></li>
                            <li><a href="#careers">Careers</a></li>
                            <li><a href="#contact">Contact Support</a></li>
                            <li><a href="#privacy">Privacy & Terms</a></li>
                        </ul>
                    </div>

                    {/* Newsletter Subscription */}
                    <div className="footer-newsletter">
                        <h3>Stay Updated</h3>
                        <p>Subscribe to our newsletter to receive the latest job listings and industry updates.</p>
                        <form onSubmit={handleSubscribe} className="newsletter-form">
                            <input 
                                type="email" 
                                placeholder="Your email address" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <button type="submit" className="newsletter-btn" aria-label="Subscribe">
                                <IoSend />
                            </button>
                        </form>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>© 2026 CareerHub Job Portal. Designed for developers and hiring partners. All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;