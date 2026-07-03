import { useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { JobContext } from "../context/JobContext";
import Hero from "../components/Hero";
import JobCard from "../components/JobCard";
import { 
    IoCode, 
    IoColorPalette, 
    IoBarChart, 
    IoMegaphone, 
    IoCash, 
    IoPeople,
    IoArrowForward 
} from "react-icons/io5";

function Home() {
    const navigate = useNavigate();
    const { jobs, setFilters, setCurrentPage } = useContext(JobContext);

    // Categories config
    const categories = [
        { name: "Software Development", icon: <IoCode />, count: "250+ Jobs" },
        { name: "UI/UX", icon: <IoColorPalette />, count: "120+ Jobs" },
        { name: "Data Science", icon: <IoBarChart />, count: "90+ Jobs" },
        { name: "Marketing", icon: <IoMegaphone />, count: "180+ Jobs" },
        { name: "Finance", icon: <IoCash />, count: "140+ Jobs" },
        { name: "Human Resources", icon: <IoPeople />, count: "80+ Jobs" }
    ];

    // Featured Companies config
    const companies = [
        { name: "Google", logoLetter: "G", employees: "100k+ Employees" },
        { name: "Microsoft", logoLetter: "M", employees: "220k+ Employees" },
        { name: "Amazon", logoLetter: "A", employees: "1.5M+ Employees" },
        { name: "Netflix", logoLetter: "N", employees: "12k+ Employees" },
        { name: "Adobe", logoLetter: "A", employees: "26k+ Employees" },
        { name: "Meta", logoLetter: "M", employees: "80k+ Employees" }
    ];

    const handleCategoryClick = (catName) => {
        setFilters((prev) => ({ 
            ...prev, 
            category: catName,
            company: "" // Clear any competing company filter
        }));
        setCurrentPage(1);
        navigate("/jobs");
    };

    const handleCompanyClick = (compName) => {
        setFilters((prev) => ({ 
            ...prev, 
            company: compName,
            category: "" // Clear any competing category filter
        }));
        setCurrentPage(1);
        navigate("/jobs");
    };

    // Get latest 3 jobs for preview
    const latestJobs = jobs.slice(0, 3);

    return (
        <div className="animate-fade-in">
            {/* Hero search section */}
            <Hero />

            {/* Popular Categories Grid */}
            <section className="categories" id="categories">
                <div className="container">
                    <div className="section-header">
                        <div>
                            <h2>Popular Categories</h2>
                            <p>Explore opportunities categorized by sector fields</p>
                        </div>
                    </div>

                    <div className="category-grid">
                        {categories.map((cat, idx) => (
                            <div 
                                key={idx} 
                                className="category-card"
                                onClick={() => handleCategoryClick(cat.name)}
                            >
                                <span className="category-icon">{cat.icon}</span>
                                <h3>{cat.name}</h3>
                                <p>{cat.count}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Companies Grid */}
            <section className="companies" id="companies">
                <div className="container">
                    <div className="section-header">
                        <div>
                            <h2>Featured Companies</h2>
                            <p>Directly apply to engineering jobs at top tech corporations</p>
                        </div>
                    </div>

                    <div className="company-grid">
                        {companies.map((comp, idx) => (
                            <div 
                                key={idx} 
                                className="company-card"
                                onClick={() => handleCompanyClick(comp.name)}
                            >
                                <div className="company-logo-placeholder">{comp.logoLetter}</div>
                                <h3>{comp.name}</h3>
                                <p>{comp.employees}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Latest Jobs Preview Listing */}
            <section style={{ padding: "80px 0" }}>
                <div className="container">
                    <div className="section-header">
                        <div>
                            <h2>Latest Job Openings</h2>
                            <p>Recently posted career opportunities on our network</p>
                        </div>
                        <Link 
                            to="/jobs" 
                            style={{ 
                                color: "var(--primary)", 
                                fontSize: "14px", 
                                fontWeight: "600", 
                                display: "flex", 
                                alignItems: "center", 
                                gap: "6px" 
                            }}
                        >
                            View All Jobs <IoArrowForward />
                        </Link>
                    </div>

                    <div className="job-list">
                        {latestJobs.map((job) => (
                            <JobCard key={job.id} job={job} />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Home;