import express from "express";
import cors from "cors";
import fs from "fs/promises";
import path from "path";
import axios from "axios";
import localJobs from "./src/data/jobs.json" assert { type: "json" };

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Path to the local jobs database (used as fallback)
const JOBS_FILE_PATH = path.join(process.cwd(), "src", "data", "jobs.json");

// Live API URL
const LIVE_API_URL = "https://www.arbeitnow.com/api/job-board-api?utm_source=chatgpt.com";

/**
 * Helper to map category tags based on title/tags keywords
 */
function mapCategory(tags, title) {
    const combined = [...(tags || []), title].map(x => x.toLowerCase()).join(" ");
    if (
        combined.includes("code") || 
        combined.includes("frontend") || 
        combined.includes("backend") || 
        combined.includes("developer") || 
        combined.includes("software") || 
        combined.includes("engineer") || 
        combined.includes("engineering") || 
        combined.includes("fullstack") || 
        combined.includes("full-stack") || 
        combined.includes("it ") ||
        combined.includes("web")
    ) {
        return "Software Development";
    }
    if (
        combined.includes("design") || 
        combined.includes("ui") || 
        combined.includes("ux") || 
        combined.includes("creative") || 
        combined.includes("illustrator") || 
        combined.includes("product designer") || 
        combined.includes("graphics")
    ) {
        return "UI/UX";
    }
    if (
        combined.includes("data") || 
        combined.includes("science") || 
        combined.includes("analytics") || 
        combined.includes("analyst") || 
        combined.includes("statistics") || 
        combined.includes("machine learning") || 
        combined.includes("ml") || 
        combined.includes("ai")
    ) {
        return "Data Science";
    }
    if (
        combined.includes("market") || 
        combined.includes("marketing") || 
        combined.includes("social media") || 
        combined.includes("seo") || 
        combined.includes("ads") || 
        combined.includes("sales") || 
        combined.includes("business")
    ) {
        return "Marketing";
    }
    if (
        combined.includes("finance") || 
        combined.includes("accounting") || 
        combined.includes("audit") || 
        combined.includes("tax") || 
        combined.includes("ledger") || 
        combined.includes("cpa") || 
        combined.includes("financial") || 
        combined.includes("payroll")
    ) {
        return "Finance";
    }
    if (
        combined.includes("hr") || 
        combined.includes("human resources") || 
        combined.includes("recruiter") || 
        combined.includes("sourcing") || 
        combined.includes("people")
    ) {
        return "Human Resources";
    }
    return "Software Development"; // Default fallback
}

/**
 * Generate a realistic salary string based on title keywords
 */
function mapSalary(title) {
    const lower = title.toLowerCase();
    if (lower.includes("senior") || lower.includes("lead") || lower.includes("staff") || lower.includes("principal")) {
        return "$135,000 - $185,000";
    }
    if (lower.includes("junior") || lower.includes("intern") || lower.includes("associate")) {
        return "$65,000 - $95,000";
    }
    return "$95,000 - $135,000";
}

/**
 * Generate experience parameters based on title keywords
 */
function mapExperience(title) {
    const lower = title.toLowerCase();
    if (lower.includes("senior") || lower.includes("lead") || lower.includes("staff") || lower.includes("principal")) {
        return "5+ years";
    }
    if (lower.includes("junior") || lower.includes("intern") || lower.includes("associate")) {
        return "0 - 2 years";
    }
    return "2 - 5 years";
}

/**
 * Map posted relative string from epoch timestamp
 */
function mapPostedTime(epochSeconds) {
    if (!epochSeconds) return "Just now";
    const postedMs = epochSeconds * 1000;
    const diffMs = Date.now() - postedMs;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    
    const weeks = Math.floor(diffDays / 7);
    return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
}

/**
 * Compile skills tag array from tags and title keywords
 */
function mapSkills(tags, title) {
    const list = [...(tags || [])];
    const lower = title.toLowerCase();
    if (lower.includes("frontend") || lower.includes("fullstack") || lower.includes("react")) {
        list.push("React", "JavaScript", "HTML5", "CSS3");
    }
    if (lower.includes("backend") || lower.includes("node")) {
        list.push("Node.js", "Express", "REST APIs", "SQL");
    }
    if (lower.includes("data") || lower.includes("python")) {
        list.push("Python", "SQL", "Pandas");
    }
    const clean = list.filter(item => item.length > 1 && item.length < 24 && !item.toLowerCase().includes("job"));
    return clean.length > 0 ? [...new Set(clean)] : ["Information Technology", "Analytical Thinking", "Communication"];
}

/**
 * Map API response items to local database scheme
 */
function transformApiJobs(apiJobs) {
    return apiJobs.map((job, idx) => {
        // Formulate logos using unsplash tech placeholder avatars
        const unsplashIds = [
            "1573804633927-bfcbcd909acd", // Google feel
            "1523474253046-8cd2748b5fd2", // Amazon feel
            "1611162617213-7d7a39e9b1d7", // Figma feel
            "1557683316-973673baf926", // Netflix feel
            "1614680376593-902f74fa0d41", // Spotify feel
            "1618401471353-b98aedd07871"  // GitHub feel
        ];
        const randomUnsplash = unsplashIds[idx % unsplashIds.length];
        const logoUrl = `https://images.unsplash.com/photo-${randomUnsplash}?w=100&h=100&fit=crop&q=80`;

        const employmentType = job.job_types && job.job_types.length > 0 
            ? job.job_types[0].split("/")[0].trim() 
            : "Full Time";

        const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

        return {
            id: idx + 1,
            title: job.title,
            company: job.company_name,
            location: job.location || "Remote",
            salary: mapSalary(job.title),
            experience: mapExperience(job.title),
            employmentType: capitalize(employmentType),
            skills: mapSkills(job.tags, job.title),
            description: job.description,
            requirements: [
                "Solid experience resolving technical issues inside software platforms.",
                "Familiarity working in dynamic, agile environment frameworks.",
                "Strong oral and written english communication values."
            ],
            responsibilities: [
                "Implement new modules in accordance with visual layouts guidelines.",
                "Conduct code optimization tests verifying speed results.",
                "Prepare specifications reports and runbooks entries."
            ],
            benefits: [
                "Competitive salaries structures with periodic check reviews.",
                "Remote friendly schedules or hybrid operations workspaces.",
                "Access to health options premiums and dental covers."
            ],
            logo: logoUrl,
            postedAt: mapPostedTime(job.created_at),
            category: mapCategory(job.tags, job.title),
            remote: job.remote || false
        };
    });
}

/**
 * Fetch jobs from the live Arbeitnow API.
 * Falls back to local database file on connection or parse issues.
 */
async function fetchJobsDatabase() {
    try {
        console.log(`🌐 Querying Arbeitnow API: ${LIVE_API_URL}`);
        const response = await axios.get(LIVE_API_URL, { timeout: 8000 });
        if (response.data && Array.isArray(response.data.data)) {
            console.log(`✅ Successfully fetched ${response.data.data.length} live jobs!`);
            return transformApiJobs(response.data.data);
        }
        console.warn("⚠️ API payload structure mismatched, using local JSON data.");
        return localJobs;
    } catch (error) {
        console.error("❌ Live API fetch failed. Fallback to local database.", error.message);
        return localJobs;
    }
}

/**
 * Health check route
 */
app.get("/api/health", (req, res) => {
    res.json({ status: "OK", server: "Express Job API", liveFeed: LIVE_API_URL, timestamp: new Date() });
});

/**
 * Route: GET /api/jobs
 * Retrieves all jobs (live + fallbacks)
 */
app.get("/api/jobs", async (req, res) => {
    try {
        const jobs = await fetchJobsDatabase();
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ error: "Failed to compile jobs database" });
    }
});

/**
 * Route: GET /api/jobs/:id
 * Retrieves details of a single job
 */
app.get("/api/jobs/:id", async (req, res) => {
    try {
        const jobs = await fetchJobsDatabase();
        const jobId = parseInt(req.params.id);
        const job = jobs.find((j) => j.id === jobId);
        
        if (!job) {
            return res.status(404).json({ error: `Job with ID ${jobId} not found` });
        }
        
        res.json(job);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve job details" });
    }
});

// Start listening on port 3001
app.listen(PORT, () => {
    console.log(`=========================================`);
    console.log(`🚀 CareerHub API Server running on port ${PORT}`);
    console.log(`👉 Health check: http://localhost:${PORT}/api/health`);
    console.log(`👉 All jobs:     http://localhost:${PORT}/api/jobs`);
    console.log(`=========================================`);
});
