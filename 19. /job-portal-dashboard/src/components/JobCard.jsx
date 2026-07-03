import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { JobContext } from "../context/JobContext";
import { toast } from "react-hot-toast";
import { 
    IoBookmark, 
    IoBookmarkOutline, 
    IoLocationOutline, 
    IoCashOutline, 
    IoCalendarOutline,
    IoArrowForward 
} from "react-icons/io5";

function JobCard({ job }) {
    const navigate = useNavigate();
    const { isJobSaved, toggleSaveJob } = useContext(JobContext);

    const saved = isJobSaved(job.id);

    const handleSaveClick = (e) => {
        e.stopPropagation(); // Stop card click navigation trigger
        toggleSaveJob(job.id);
        if (saved) {
            toast.error(`Removed "${job.title}" from saved jobs`);
        } else {
            toast.success(`Saved "${job.title}" successfully!`);
        }
    };

    const handleCardClick = () => {
        navigate(`/jobs/${job.id}`);
    };

    return (
        <div className="job-card" onClick={handleCardClick}>
            
            {/* Header info */}
            <div className="job-card-header">
                <img 
                    src={job.logo || "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=100&h=100&fit=crop&q=80"} 
                    alt={`${job.company} Logo`}
                    className="company-logo"
                    onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=100&h=100&fit=crop&q=80";
                    }}
                />
                
                <div className="job-title-wrapper">
                    <h3>{job.title}</h3>
                    <p className="company-name">{job.company}</p>
                </div>

                <button 
                    onClick={handleSaveClick} 
                    className={`save-btn ${saved ? "saved" : ""}`}
                    title={saved ? "Remove Job Bookmark" : "Save Job Listing"}
                    aria-label={saved ? "Unsave job" : "Save job"}
                >
                    {saved ? <IoBookmark /> : <IoBookmarkOutline />}
                </button>
            </div>

            {/* Badges metadata grid */}
            <div className="job-tags">
                <span className="tag tag-location">
                    <IoLocationOutline /> {job.location}
                </span>
                <span className="tag tag-salary">
                    <IoCashOutline /> {job.salary}
                </span>
                <span className="tag tag-type">
                    {job.employmentType}
                </span>
                <span className="tag tag-exp">
                    {job.experience} exp
                </span>
                {job.remote && (
                    <span className="tag" style={{ backgroundColor: "rgba(37, 99, 235, 0.15)", color: "var(--primary)" }}>
                        Remote Friendly
                    </span>
                )}
            </div>

            {/* Skills previews */}
            <div className="skills-tags">
                {job.skills.slice(0, 4).map((skill, index) => (
                    <span key={index} className="skill-badge">
                        {skill}
                    </span>
                ))}
                {job.skills.length > 4 && (
                    <span className="skill-badge" style={{ fontStyle: "italic" }}>
                        +{job.skills.length - 4} more
                    </span>
                )}
            </div>

            {/* Footer indicators */}
            <div className="job-card-footer">
                <span className="posted-time">
                    <IoCalendarOutline style={{ verticalAlign: "middle", marginRight: "4px" }} />
                    Posted {job.postedAt}
                </span>
                <span className="details-link">
                    More Details <IoArrowForward />
                </span>
            </div>

        </div>
    );
}

export default JobCard;
