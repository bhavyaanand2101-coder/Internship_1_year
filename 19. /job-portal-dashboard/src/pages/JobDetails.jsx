import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { JobContext } from "../context/JobContext";
import { toast } from "react-hot-toast";
import { 
    IoArrowBack, 
    IoBookmark, 
    IoBookmarkOutline, 
    IoShareSocialOutline, 
    IoLocationOutline, 
    IoCashOutline, 
    IoBriefcaseOutline,
    IoCheckmarkCircleOutline,
    IoTimeOutline 
} from "react-icons/io5";

function JobDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { jobs, isJobSaved, toggleSaveJob, viewJob, recentlyViewed } = useContext(JobContext);

    const [job, setJob] = useState(null);
    const [applyModalOpen, setApplyModalOpen] = useState(false);
    const [applied, setApplied] = useState(false);

    // Find job details and track view history
    useEffect(() => {
        const foundJob = jobs.find((j) => j.id === parseInt(id));
        if (foundJob) {
            setJob(foundJob);
            viewJob(foundJob.id);
            // Reset applied state for new job views
            setApplied(false);
        }
    }, [id, jobs]);

    if (!job) {
        return (
            <div className="container" style={{ padding: "80px 20px", textAlign: "center" }}>
                <h2>Loading job specifications...</h2>
            </div>
        );
    }

    const saved = isJobSaved(job.id);

    const handleSaveClick = () => {
        toggleSaveJob(job.id);
        if (saved) {
            toast.error("Removed from bookmarks");
        } else {
            toast.success("Job bookmarked successfully!");
        }
    };

    const handleShareClick = () => {
        const link = window.location.href;
        navigator.clipboard.writeText(link)
            .then(() => {
                toast.success("Share link copied to clipboard!");
            })
            .catch(() => {
                toast.error("Failed to copy link.");
            });
    };

    const handleApplySubmit = () => {
        setApplied(true);
        toast.success(`Application sent to ${job.company}!`);
    };

    return (
        <div className="container job-details-page animate-fade-in">
            {/* Back Button */}
            <div className="back-link" onClick={() => navigate("/jobs")}>
                <IoArrowBack /> Back to Jobs Listing
            </div>

            <div className="details-wrapper">
                {/* Main details */}
                <article className="details-main">
                    
                    {/* Header info */}
                    <div className="details-header">
                        <img 
                            src={job.logo || "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=100&h=100&fit=crop&q=80"} 
                            alt={`${job.company} Logo`}
                            className="details-logo"
                        />
                        <div className="details-title" style={{ flex: 1 }}>
                            <h2>{job.title}</h2>
                            <p style={{ fontSize: "16px", color: "var(--primary)", fontWeight: "600", margin: 0 }}>
                                {job.company}
                            </p>
                            
                            <div className="details-meta-row">
                                <span className="details-meta-item">
                                    <IoLocationOutline /> {job.location}
                                </span>
                                <span className="details-meta-item">
                                    <IoCashOutline /> {job.salary}
                                </span>
                                <span className="details-meta-item">
                                    <IoBriefcaseOutline /> {job.employmentType}
                                </span>
                                <span className="details-meta-item">
                                    <IoTimeOutline /> Posted {job.postedAt}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="details-actions">
                        {applied ? (
                            <button className="apply-btn" style={{ backgroundColor: "#10b981", cursor: "default" }} disabled>
                                <IoCheckmarkCircleOutline style={{ verticalAlign: "middle", marginRight: "4px", fontSize: "18px" }} />
                                Applied
                            </button>
                        ) : (
                            <button onClick={() => setApplyModalOpen(true)} className="apply-btn">
                                Apply Now
                            </button>
                        )}

                        <button 
                            onClick={handleSaveClick} 
                            className={`action-outline-btn ${saved ? "saved" : ""}`}
                            title={saved ? "Remove Job Bookmark" : "Save Job Listing"}
                        >
                            {saved ? <IoBookmark /> : <IoBookmarkOutline />}
                        </button>

                        <button 
                            onClick={handleShareClick} 
                            className="action-outline-btn"
                            title="Copy Listing URL"
                        >
                            <IoShareSocialOutline />
                        </button>
                    </div>

                    {/* Specifications Body */}
                    <div className="details-body" style={{ marginTop: "40px" }}>
                        <div className="details-section">
                            <h3>Job Description</h3>
                            <div dangerouslySetInnerHTML={{ __html: job.description }} style={{ fontSize: "14.5px", lineHeight: "1.6", color: "var(--text-main)" }} />
                        </div>

                        <div className="details-section">
                            <h3>Key Requirements</h3>
                            <ul className="details-list">
                                {job.requirements.map((req, idx) => (
                                    <li key={idx}>{req}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="details-section">
                            <h3>Responsibilities</h3>
                            <ul className="details-list">
                                {job.responsibilities.map((resp, idx) => (
                                    <li key={idx}>{resp}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="details-section">
                            <h3>Benefits & Perks</h3>
                            <ul className="details-list">
                                {job.benefits.map((ben, idx) => (
                                    <li key={idx}>{ben}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="details-section">
                            <h3>Required Skills</h3>
                            <div className="skills-tags" style={{ marginTop: "12px" }}>
                                {job.skills.map((skill, idx) => (
                                    <span key={idx} className="skill-badge" style={{ fontSize: "12px", padding: "5px 10px" }}>
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                </article>

                {/* Right column sidebar */}
                <div className="details-sidebar">
                    <div className="sidebar-panel">
                        <h3>Recently Viewed</h3>
                        <div className="viewed-list">
                            {recentlyViewed.filter(rv => rv.id !== job.id).slice(0, 4).map((rvJob) => (
                                <div 
                                    key={rvJob.id} 
                                    className="viewed-item"
                                    onClick={() => navigate(`/jobs/${rvJob.id}`)}
                                >
                                    <img 
                                        src={rvJob.logo} 
                                        alt={rvJob.company} 
                                        className="viewed-logo"
                                    />
                                    <div className="viewed-info">
                                        <h4>{rvJob.title}</h4>
                                        <p>{rvJob.company} • {rvJob.location}</p>
                                    </div>
                                </div>
                            ))}
                            {recentlyViewed.filter(rv => rv.id !== job.id).length === 0 && (
                                <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: 0, fontStyle: "italic" }}>
                                    No other listings viewed yet.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Apply Confirmation Modal Overlay */}
            {applyModalOpen && (
                <div className="modal-overlay" onClick={() => setApplyModalOpen(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <IoCheckmarkCircleOutline className="modal-success-icon" />
                        <h3>Submit Application?</h3>
                        <p>
                            You are applying as a <strong>{job.title}</strong> at <strong>{job.company}</strong>. Your profile details and CV will be shared with the recruiter.
                        </p>
                        
                        <div style={{ display: "flex", gap: "12px" }}>
                            <button 
                                onClick={() => setApplyModalOpen(false)}
                                className="page-btn"
                                style={{ flex: 1, height: "44px" }}
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={() => {
                                    handleApplySubmit();
                                    setApplyModalOpen(false);
                                }}
                                className="apply-btn"
                                style={{ flex: 1 }}
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default JobDetails;
