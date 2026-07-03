import { useContext } from "react";
import { JobContext } from "../context/JobContext";
import { IoSearch, IoLocationOutline, IoClose } from "react-icons/io5";

function SearchBar() {
    const { 
        searchText, 
        setSearchText, 
        searchLocation, 
        setSearchLocation,
        setCurrentPage 
    } = useContext(JobContext);

    const handleClearKeyword = () => {
        setSearchText("");
        setCurrentPage(1);
    };

    const handleClearLocation = () => {
        setSearchLocation("");
        setCurrentPage(1);
    };

    return (
        <div className="jobs-top-search">
            {/* Keyword Input */}
            <div className="jobs-search-input">
                <IoSearch style={{ fontSize: "18px" }} />
                <input 
                    type="text" 
                    placeholder="Search by job title, company or skills..."
                    value={searchText}
                    onChange={(e) => {
                        setSearchText(e.target.value);
                        setCurrentPage(1);
                    }}
                />
                {searchText && (
                    <button 
                        onClick={handleClearKeyword} 
                        style={{ background: "none", border: "none", cursor: "pointer", display: "flex", color: "var(--text-muted)" }}
                        title="Clear keyword search"
                    >
                        <IoClose size={18} />
                    </button>
                )}
            </div>

            {/* Location Input */}
            <div className="jobs-search-input">
                <IoLocationOutline style={{ fontSize: "18px" }} />
                <input 
                    type="text" 
                    placeholder="Search by city or country..."
                    value={searchLocation}
                    onChange={(e) => {
                        setSearchLocation(e.target.value);
                        setCurrentPage(1);
                    }}
                />
                {searchLocation && (
                    <button 
                        onClick={handleClearLocation} 
                        style={{ background: "none", border: "none", cursor: "pointer", display: "flex", color: "var(--text-muted)" }}
                        title="Clear location search"
                    >
                        <IoClose size={18} />
                    </button>
                )}
            </div>
        </div>
    );
}

export default SearchBar;
