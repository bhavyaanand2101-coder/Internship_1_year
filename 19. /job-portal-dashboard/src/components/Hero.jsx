import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { JobContext } from "../context/JobContext";
import { IoSearch, IoLocationOutline } from "react-icons/io5";

function Hero() {
    const navigate = useNavigate();
    const { 
        searchText, 
        setSearchText, 
        searchLocation, 
        setSearchLocation,
        setCurrentPage 
    } = useContext(JobContext);

    const handleSearchClick = () => {
        setCurrentPage(1);
        navigate("/jobs");
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSearchClick();
        }
    };

    return (
        <section className="hero">
            <div className="container">
                <div className="hero-content">
                    <h1>Find Your Next Dream Job</h1>
                    <p>
                        Explore thousands of tech vacancies at Google, Meta, Microsoft, Stripe, and other leading companies worldwide.
                    </p>
                    
                    {/* Search Bar Wrapper */}
                    <div className="hero-search-wrapper">
                        {/* Title Keyword input */}
                        <div className="hero-search-field">
                            <IoSearch />
                            <input 
                                type="text" 
                                placeholder="Job title, skills or keyword..."
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                        </div>

                        {/* Location input */}
                        <div className="hero-search-field">
                            <IoLocationOutline />
                            <input 
                                type="text" 
                                placeholder="City, state or remote..."
                                value={searchLocation}
                                onChange={(e) => setSearchLocation(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                        </div>

                        {/* Search CTA */}
                        <button onClick={handleSearchClick} className="hero-search-btn">
                            Search Jobs
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Hero;