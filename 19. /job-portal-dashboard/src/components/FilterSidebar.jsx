import { useContext } from "react";
import { JobContext } from "../context/JobContext";
import { IoFilter, IoRefreshOutline } from "react-icons/io5";

function FilterSidebar() {
    const { filters, setFilters, clearFilters, setCurrentPage } = useContext(JobContext);

    // Job types options
    const jobTypeOptions = ["Full Time", "Part Time", "Internship", "Contract"];
    // Experience options
    const experienceOptions = ["Entry", "Mid", "Senior", "Lead"];

    const handleJobTypeChange = (type) => {
        setFilters((prev) => {
            const types = prev.jobTypes.includes(type)
                ? prev.jobTypes.filter((t) => t !== type)
                : [...prev.jobTypes, type];
            return { ...prev, jobTypes: types };
        });
        setCurrentPage(1);
    };

    const handleExperienceChange = (exp) => {
        setFilters((prev) => {
            const exps = prev.experience.includes(exp)
                ? prev.experience.filter((e) => e !== exp)
                : [...prev.experience, exp];
            return { ...prev, experience: exps };
        });
        setCurrentPage(1);
    };

    const handleRemoteChange = (e) => {
        setFilters((prev) => ({ ...prev, remoteOnly: e.target.checked }));
        setCurrentPage(1);
    };

    const handleCategoryChange = (e) => {
        setFilters((prev) => ({ ...prev, category: e.target.value }));
        setCurrentPage(1);
    };

    const handleCompanyChange = (e) => {
        setFilters((prev) => ({ ...prev, company: e.target.value }));
        setCurrentPage(1);
    };

    return (
        <aside className="filter-sidebar">
            <div className="filter-header">
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <IoFilter />
                    <h3>Filters</h3>
                </div>
                <button onClick={clearFilters} className="clear-btn" title="Clear all filters">
                    <IoRefreshOutline style={{ fontSize: "14px", verticalAlign: "middle", marginRight: "2px" }} />
                    Reset
                </button>
            </div>

            {/* Remote Switcher */}
            <div className="filter-group" style={{ borderBottom: "1px solid var(--border-color)", paddingBottom: "16px" }}>
                <label className="checkbox-label" style={{ fontWeight: "600", color: "var(--text-main)", marginBottom: 0 }}>
                    <input 
                        type="checkbox" 
                        checked={filters.remoteOnly}
                        onChange={handleRemoteChange}
                    />
                    Remote Positions Only
                </label>
            </div>

            {/* Job Types */}
            <div className="filter-group">
                <h4>Job Type</h4>
                {jobTypeOptions.map((type) => (
                    <label key={type} className="checkbox-label">
                        <input 
                            type="checkbox"
                            checked={filters.jobTypes.includes(type)}
                            onChange={() => handleJobTypeChange(type)}
                        />
                        {type}
                    </label>
                ))}
            </div>

            {/* Experience Level */}
            <div className="filter-group">
                <h4>Experience Level</h4>
                {experienceOptions.map((exp) => (
                    <label key={exp} className="checkbox-label">
                        <input 
                            type="checkbox"
                            checked={filters.experience.includes(exp)}
                            onChange={() => handleExperienceChange(exp)}
                        />
                        {exp} Level
                    </label>
                ))}
            </div>

            {/* Category Filter dropdown */}
            <div className="filter-group">
                <h4>Sector Category</h4>
                <select 
                    value={filters.category}
                    onChange={handleCategoryChange}
                    style={{
                        width: "100%",
                        padding: "8px 12px",
                        borderRadius: "8px",
                        border: "1px solid var(--border-color)",
                        backgroundColor: "var(--bg-color)",
                        color: "var(--text-main)",
                        outline: "none",
                        fontSize: "13.5px"
                    }}
                >
                    <option value="">All Sectors</option>
                    <option value="Software Development">Software Development</option>
                    <option value="UI/UX">UI/UX Design</option>
                    <option value="Data Science">Data Science</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Finance">Finance</option>
                    <option value="Human Resources">Human Resources</option>
                </select>
            </div>

            {/* Company Filter dropdown */}
            <div className="filter-group">
                <h4>Featured Employers</h4>
                <select 
                    value={filters.company}
                    onChange={handleCompanyChange}
                    style={{
                        width: "100%",
                        padding: "8px 12px",
                        borderRadius: "8px",
                        border: "1px solid var(--border-color)",
                        backgroundColor: "var(--bg-color)",
                        color: "var(--text-main)",
                        outline: "none",
                        fontSize: "13.5px"
                    }}
                >
                    <option value="">All Companies</option>
                    <option value="Google">Google</option>
                    <option value="Microsoft">Microsoft</option>
                    <option value="Amazon">Amazon</option>
                    <option value="Netflix">Netflix</option>
                    <option value="Adobe">Adobe</option>
                    <option value="Meta">Meta</option>
                </select>
            </div>
        </aside>
    );
}

export default FilterSidebar;
