import React, { createContext, useState, useEffect } from "react";
import { fetchJobs } from "../services/api";
import useLocalStorage from "../hooks/useLocalStorage";

export const JobContext = createContext();

export function JobProvider({ children }) {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Search terms
    const [searchText, setSearchText] = useState("");
    const [searchLocation, setSearchLocation] = useState("");

    // Bookmarked saved jobs (Using custom Local Storage hook)
    const [savedJobIds, setSavedJobIds] = useLocalStorage("saved-jobs", []);
    // Recently viewed jobs
    const [recentlyViewedIds, setRecentlyViewedIds] = useLocalStorage("recent-viewed", []);

    // Active filters
    const [filters, setFilters] = useState({
        jobTypes: [],     // 'Full Time', 'Part Time', 'Internship', 'Contract'
        experience: [],   // 'Entry', 'Mid', 'Senior', 'Lead'
        category: "",     // 'Software Development', 'UI/UX', etc.
        company: "",      // Selected Featured Company
        remoteOnly: false,
    });

    // Sorting state
    const [sortOption, setSortOption] = useState("Newest");
    // Pagination indicator
    const [currentPage, setCurrentPage] = useState(1);
    
    // Theme context indicator
    const [darkTheme, setDarkTheme] = useLocalStorage("dark-theme", false);

    // Initial fetch of jobs
    useEffect(() => {
        const loadJobs = async () => {
            setLoading(true);
            const data = await fetchJobs();
            setJobs(data);
            setLoading(false);
        };
        loadJobs();
    }, []);

    // Sync HTML class on theme toggles
    useEffect(() => {
        if (darkTheme) {
            document.documentElement.classList.add("dark-mode");
        } else {
            document.documentElement.classList.remove("dark-mode");
        }
    }, [darkTheme]);

    // Add or remove job bookmarks
    const toggleSaveJob = (id) => {
        setSavedJobIds((prev) => {
            if (prev.includes(id)) {
                return prev.filter((item) => item !== id);
            }
            return [...prev, id];
        });
    };

    const isJobSaved = (id) => savedJobIds.includes(id);

    // Track recently viewed jobs
    const viewJob = (id) => {
        setSavedJobIds((prev) => {
            // Keep unique entries, max 5, newest first
            const filtered = recentlyViewedIds.filter((item) => item !== id);
            setRecentlyViewedIds([id, ...filtered].slice(0, 5));
            return prev;
        });
    };

    // Reset filters
    const clearFilters = () => {
        setFilters({
            jobTypes: [],
            experience: [],
            category: "",
            company: "",
            remoteOnly: false,
        });
        setSearchText("");
        setSearchLocation("");
        setCurrentPage(1);
    };

    // Filter and sort computation
    const getFilteredJobs = () => {
        let list = [...jobs];

        // 1. Search text filter (title, company, skills)
        if (searchText.trim()) {
            const query = searchText.toLowerCase();
            list = list.filter(
                (job) =>
                    job.title.toLowerCase().includes(query) ||
                    job.company.toLowerCase().includes(query) ||
                    job.skills.some((s) => s.toLowerCase().includes(query))
            );
        }

        // 2. Search location filter
        if (searchLocation.trim()) {
            const loc = searchLocation.toLowerCase();
            list = list.filter((job) => job.location.toLowerCase().includes(loc));
        }

        // 3. Job Type filters
        if (filters.jobTypes.length > 0) {
            list = list.filter((job) => filters.jobTypes.includes(job.employmentType));
        }

        // 4. Experience filters
        if (filters.experience.length > 0) {
            list = list.filter((job) =>
                filters.experience.some((exp) => {
                    const jobExp = job.experience.toLowerCase();
                    if (exp === "Entry") return jobExp.includes("0") || jobExp.includes("1") || jobExp.includes("intern");
                    if (exp === "Mid") return jobExp.includes("2") || jobExp.includes("3") || jobExp.includes("4");
                    if (exp === "Senior") return jobExp.includes("5") || jobExp.includes("senior");
                    if (exp === "Lead") return jobExp.includes("lead") || jobExp.includes("staff") || jobExp.includes("6") || jobExp.includes("7");
                    return false;
                })
            );
        }

        // 5. Category filter
        if (filters.category) {
            list = list.filter((job) => job.category === filters.category);
        }

        // 6. Company filter
        if (filters.company) {
            list = list.filter((job) => job.company === filters.company);
        }

        // 7. Remote filter
        if (filters.remoteOnly) {
            list = list.filter((job) => job.remote === true);
        }

        // 8. Sorting
        return list.sort((a, b) => {
            if (sortOption === "Newest") {
                const getDays = (p) => {
                    const str = p.toLowerCase();
                    if (str.includes("now") || str.includes("today")) return 0;
                    if (str.includes("yesterday")) return 1;
                    const matches = str.match(/\d+/);
                    if (!matches) return 30;
                    const num = parseInt(matches[0]);
                    if (str.includes("week")) return num * 7;
                    if (str.includes("month")) return num * 30;
                    return num;
                };
                return getDays(a.postedAt) - getDays(b.postedAt);
            }
            
            if (sortOption === "Salary") {
                const getVal = (s) => {
                    const matches = s.replace(/,/g, "").match(/\d+/g);
                    if (!matches) return 0;
                    const num = Math.max(...matches.map((v) => parseInt(v)));
                    if (s.toLowerCase().includes("hour")) return num * 2000;
                    return num;
                };
                return getVal(b.salary) - getVal(a.salary);
            }

            if (sortOption === "Company") {
                return a.company.localeCompare(b.company);
            }

            if (sortOption === "Experience") {
                const getVal = (exp) => {
                    const match = exp.match(/\d+/);
                    return match ? parseInt(match[0]) : 0;
                };
                return getVal(b.experience) - getVal(a.experience);
            }

            return 0;
        });
    };

    const filteredJobs = getFilteredJobs();
    
    // Get saved jobs complete objects mapping
    const savedJobs = jobs.filter((job) => savedJobIds.includes(job.id));
    // Get recently viewed jobs objects mapping
    const recentlyViewed = jobs
        .filter((job) => recentlyViewedIds.includes(job.id))
        .sort((a, b) => recentlyViewedIds.indexOf(a.id) - recentlyViewedIds.indexOf(b.id));

    const value = {
        jobs,
        filteredJobs,
        savedJobs,
        recentlyViewed,
        loading,
        searchText,
        setSearchText,
        searchLocation,
        setSearchLocation,
        filters,
        setFilters,
        sortOption,
        setSortOption,
        currentPage,
        setCurrentPage,
        toggleSaveJob,
        isJobSaved,
        viewJob,
        clearFilters,
        darkTheme,
        setDarkTheme: (theme) => setDarkTheme(theme),
    };

    return <JobContext.Provider value={value}>{children}</JobContext.Provider>;
}
