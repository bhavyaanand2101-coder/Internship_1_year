import { useContext } from "react";
import { JobContext } from "../context/JobContext";
import JobCard from "./JobCard";
import Loader from "./Loader";
import EmptyState from "./EmptyState";

function JobList() {
    const { filteredJobs, loading, currentPage } = useContext(JobContext);

    const ITEMS_PER_PAGE = 10;
    
    // Pagination slicing
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedJobs = filteredJobs.slice(startIndex, endIndex);

    if (loading) {
        return <Loader />;
    }

    if (filteredJobs.length === 0) {
        return <EmptyState />;
    }

    return (
        <div className="job-list animate-fade-in">
            {paginatedJobs.map((job) => (
                <JobCard key={job.id} job={job} />
            ))}
        </div>
    );
}

export default JobList;
