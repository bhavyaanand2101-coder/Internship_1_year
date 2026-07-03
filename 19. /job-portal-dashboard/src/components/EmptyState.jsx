import { useContext } from "react";
import { JobContext } from "../context/JobContext";
import { IoSearchOutline } from "react-icons/io5";

function EmptyState() {
    const { clearFilters } = useContext(JobContext);

    return (
        <div className="empty-state animate-fade-in">
            <IoSearchOutline className="empty-icon" />
            <h3>No Jobs Found</h3>
            <p>
                We couldn't find any positions matching your search parameters. Try adjusting your keywords, locations, or resetting filters.
            </p>
            <button onClick={clearFilters} className="reset-search-btn">
                Reset All Filters
            </button>
        </div>
    );
}

export default EmptyState;
