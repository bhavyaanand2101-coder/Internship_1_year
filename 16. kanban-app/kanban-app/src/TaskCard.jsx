import React, { useState, useRef, useEffect } from 'react'

/**
 * TaskCard Component
 * Represents an individual draggable task card in the Kanban board.
 * Supports inline editing, deletion, and dragging styles.
 * 
 * @param {object} props
 * @param {object} props.task - The task object containing id, title, and createdAt timestamp.
 * @param {number} props.index - The list index of the card within its column.
 * @param {boolean} props.isDragging - Flag indicating if this specific card is being dragged.
 * @param {function} props.onDelete - Callback to delete the card.
 * @param {function} props.onEdit - Callback to save edited title.
 * @param {function} props.onDragStart - Callback when drag starts.
 * @param {function} props.onDragEnd - Callback when drag ends.
 * @param {function} props.onDropBefore - Callback when another card is dropped on/before this card.
 */
export default function TaskCard({ 
    task, 
    index, 
    isDragging,
    onDelete, 
    onEdit, 
    onDragStart, 
    onDragEnd, 
    onDropBefore 
}) {
    // State to toggle between text rendering and inline editing input textarea
    const [editing, setEditing] = useState(false)
    // Draft title state during editing
    const [draft, setDraft] = useState(task.title)

    // Tracks if the user explicitly cancelled the editing process (e.g. via Escape key).
    // This blocks the textarea's blur event from automatically saving the draft contents.
    const isDiscarding = useRef(false)

    // Sync draft state with external updates to task title
    useEffect(() => {
        setDraft(task.title)
    }, [task.title])

    /**
     * Enters edit mode, resetting the discard flag.
     */
    function startEditing() {
        isDiscarding.current = false
        setDraft(task.title)
        setEditing(true)
    }

    /**
     * Saves changes and exits edit mode.
     */
    function save() {
        onEdit(draft)
        setEditing(false)
    }

    /**
     * Handles the blur event on the textarea.
     * Prevents saving if the editing process was cancelled via Escape.
     */
    function handleBlur() {
        if (isDiscarding.current) {
            isDiscarding.current = false
            return
        }
        save()
    }

    return (
        <div
            className={`task-card ${isDragging ? 'task-card--dragging' : ''}`}
            draggable={!editing}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onDragOver={(e) => e.preventDefault()} // Required to allow drop operations
            onDrop={onDropBefore}
            data-index={index}
        >
            {editing ? (
                <textarea
                    autoFocus
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onBlur={handleBlur}
                    onKeyDown={(e) => {
                        // Enter saves the card (unless holding Shift for multiline/newline)
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault()
                            save()
                        }
                        // Escape discards changes and cancels editing
                        if (e.key === 'Escape') {
                            isDiscarding.current = true
                            setDraft(task.title) // Reset title draft to original value
                            setEditing(false)
                        }
                    }}
                />
            ) : (
                <p onDoubleClick={startEditing}>{task.title}</p>
            )}

            <div className="task-card-actions">
                <button className="icon-btn" title="Edit" onClick={startEditing}>
                    ✎
                </button>
                <button className="icon-btn" title="Delete" onClick={onDelete}>
                    ×
                </button>
            </div>
        </div>
    )
}

