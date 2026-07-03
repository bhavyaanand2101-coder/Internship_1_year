import { useState, useEffect } from "react";

/**
 * Custom hook to sync state with localStorage.
 * 
 * @param {string} key - Local storage key
 * @param {any} initialValue - Default value if key is empty
 */
export default function useLocalStorage(key, initialValue) {
    const [value, setValue] = useState(() => {
        try {
            const jsonValue = localStorage.getItem(key);
            if (jsonValue !== null) return JSON.parse(jsonValue);
        } catch (e) {
            console.error("Error reading localStorage key:", key, e);
        }
        
        if (typeof initialValue === "function") {
            return initialValue();
        }
        return initialValue;
    });

    useEffect(() => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.error("Error setting localStorage key:", key, e);
        }
    }, [key, value]);

    return [value, setValue];
}
