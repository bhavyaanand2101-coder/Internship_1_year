/**
 * Generates a RFC4122 version 4 compliant UUID.
 * Uses native crypto.randomUUID() if available (requires secure contexts: localhost, HTTPS).
 * Falls back to a Math.random()-based implementation for non-secure contexts.
 * 
 * @returns {string} A randomly generated UUID.
 */
export function generateUUID() {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID();
    }
    // Fallback for non-secure contexts (e.g., local network IP access)
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
