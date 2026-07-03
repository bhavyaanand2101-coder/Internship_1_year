import { useContext } from "react";
import { JobContext } from "../context/JobContext";

function Pagination() {
    const { filteredJobs, currentPage, setCurrentPage } = useContext(JobContext);

    const ITEMS_PER_PAGE = 10;
    const totalPages = Math.ceil(filteredJobs.length / ITEMS_PER_PAGE);

    // Don't render navigation if there are no pages or only 1 page
    if (totalPages <= 1) return null;

    const handlePrev = () => {
        if (currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prev) => prev + 1);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    return (
        <div className="pagination">
            {/* Previous page trigger */}
            <button 
                onClick={handlePrev} 
                disabled={currentPage === 1}
                className="page-btn"
                aria-label="Previous Page"
            >
                Previous
            </button>

            {/* Current page indicator info */}
            <span className="page-info">
                Page <strong>{currentPage}</strong> of {totalPages}
            </span>

            {/* Next page trigger */}
            <button 
                onClick={handleNext} 
                disabled={currentPage === totalPages}
                className="page-btn"
                aria-label="Next Page"
            >
                Next
            </button>
        </div>
    );
}

export default Pagination;
