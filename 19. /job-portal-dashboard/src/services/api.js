import axios from "axios";
import localJobs from "../data/jobs.json";

// Axios instance configured for future server endpoints
const api = axios.create({
    baseURL: "/",
});

/**
 * Fetch all available jobs from the Express backend API.
 * Falls back to locally imported JSON on error.
 */
export const fetchJobs = async () => {
    try {
        const response = await api.get("/api/jobs");
        return response.data;
    } catch (error) {
        console.warn("Axios API fetch from /api/jobs failed, falling back to local JSON:", error);
        return localJobs;
    }
};

export default api;
