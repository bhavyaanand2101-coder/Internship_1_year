import { useContext } from "react";
import { JobContext } from "../context/JobContext";
import JobCard from "../components/JobCard";
import { IoBookmarkOutline } from "react-icons/io5";
import { Link } from "react-router-dom";

function SavedJobs() {
    const { savedJobs } = useContext(JobContext);

    return (
        <div className="container animate-fade-in" style={{ padding: "40px 20px 80px 20px" }}>
            <div className="section-header" style={{ marginBottom: "30px" }}>
                <div>
                    <h2>Bookmarked Careers</h2>
                    <p>Keep track of positions you have saved for later review</p>
                </div>
            </div>

            {/* List and empty states */}
            {savedJobs.length === 0 ? (
                <div className="empty-state animate-fade-in" style={{ margin: "40px auto" }}>
                    <IoBookmarkOutline className="empty-icon" />
                    <h3>No Saved Jobs</h3>
                    <p>
                        Explore our active career positions and bookmark listings you're interested in to review them here.
                    </p>
                    <Link to="/jobs">
                        <button className="reset-search-btn">
                            Browse Opportunities
                        </button>
                    </Link>
                </div>
            ) : (
                <div className="job-list">
                    {savedJobs.map((job) => (
                        <JobCard key={job.id} job={job} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default SavedJobs;
