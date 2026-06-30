import { generateUUID } from './utils.js';

/**
 * Helper function to generate unique identifiers for columns and tasks.
 * Uses the safe UUID generator utility.
 * 
 * @returns {string} Unique identifier.
 */
function id() {
    return generateUUID();
}

// Generate unique task IDs for initial items
const t1 = id(), t2 = id(), t3 = id(), t4 = id(), t5 = id();

/**
 * Initial board state containing default columns and tasks.
 * 
 * Board Schema:
 * @property {Array<{id: string, title: string, taskIds: string[]}>} columns - List of columns in display order.
 * @property {Object.<string, {id: string, title: string, createdAt: number}>} tasks - Lookup map of all tasks by their ID.
 */
export const initialBoard = {
    columns: [
        { id: id(), title: 'To Do', taskIds: [t1, t2] },
        { id: id(), title: 'In Progress', taskIds: [t3] },
        { id: id(), title: 'Review', taskIds: [t4] },
        { id: id(), title: 'Done', taskIds: [t5] },
    ],
    tasks: {
        [t1]: { id: t1, title: 'Sketch the onboarding flow', createdAt: Date.now() },
        [t2]: { id: t2, title: 'Write copy for empty states', createdAt: Date.now() },
        [t3]: { id: t3, title: 'Build the drag-and-drop interactions', createdAt: Date.now() },
        [t4]: { id: t4, title: 'Get feedback on column colors', createdAt: Date.now() },
        [t5]: { id: t5, title: 'Set up the project repo', createdAt: Date.now() },
    },
};

