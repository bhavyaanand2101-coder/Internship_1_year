import { useContext } from "react";
import { JobContext } from "../context/JobContext";
import FilterSidebar from "../components/FilterSidebar";
import SearchBar from "../components/SearchBar";
import JobList from "../components/JobList";
import Pagination from "../components/Pagination";

function Jobs() {
    const { 
        filteredJobs, 
        sortOption, 
        setSortOption,
        setCurrentPage 
    } = useContext(JobContext);

    const handleSortChange = (e) => {
        setSortOption(e.target.value);
        setCurrentPage(1);
    };

    return (
        <div className="container jobs-layout animate-fade-in">
            <div className="jobs-grid">
                
                {/* Left Filter Column */}
                <FilterSidebar />

                {/* Right Results Column */}
                <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
                    {/* Top Search bar */}
                    <SearchBar />

                    {/* Sorting & Metadata */}
                    <div className="results-meta">
                        <span className="results-count">
                            Showing <strong>{filteredJobs.length}</strong> available career slots
                        </span>

                        <div className="sort-dropdown">
                            <label htmlFor="sort-select">Sort by:</label>
                            <select 
                                id="sort-select"
                                value={sortOption}
                                onChange={handleSortChange}
                            >
                                <option value="Newest">Newest First</option>
                                <option value="Salary">Highest Salary</option>
                                <option value="Company">Company (A-Z)</option>
                                <option value="Experience">Experience level</option>
                            </select>
                        </div>
                    </div>

                    {/* Job cards stack */}
                    <JobList />

                    {/* Page indices selector */}
                    <Pagination />
                </div>

            </div>
        </div>
    );
}

export default Jobs;
