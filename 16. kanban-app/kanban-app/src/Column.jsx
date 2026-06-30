import React, { useState, useEffect, useRef } from 'react'
import TaskCard from './TaskCard.jsx'

/**
 * Column Component
 * Represents a single vertical Kanban column (e.g., "To Do", "In Progress").
 * Handles drag-over highlighting, task card mapping, and task creation interfaces.
 * 
 * @param {object} props
 * @param {object} props.column - The column data containing id, title, and taskIds array.
 * @param {object[]} props.tasks - Array of task objects currently in this column.
 * @param {string|null} props.draggingTaskId - ID of the task currently being dragged across the board.
 * @param {function} props.onAddTask - Callback to add a task card.
 * @param {function} props.onDeleteTask - Callback to delete a task card.
 * @param {function} props.onEditTask - Callback to update a task title.
 * @param {function} props.onDeleteColumn - Callback to delete this column.
 * @param {function} props.onDragStart - Callback when card dragging begins.
 * @param {function} props.onDragEnd - Callback when card dragging ends.
 * @param {function} props.onDrop - Callback to handle drops (within or between columns).
 * @param {boolean} props.isDragOver - Flag indicating if a card is currently dragged over this column.
 * @param {function} props.setDragOverColumn - Callback to update the dragOverColumn ID state.
 */
export default function Column({
    column,
    tasks,
    draggingTaskId,
    onAddTask,
    onDeleteTask,
    onEditTask,
    onDeleteColumn,
    onDragStart,
    onDragEnd,
    onDrop,
    isDragOver,
    setDragOverColumn,
}) {
    // Draft title for the "Add Card" input/textarea form
    const [draft, setDraft] = useState('')
    // Toggle to display the task composition card input
    const [adding, setAdding] = useState(false)

    // Tracks drag enter/leave operations within nested DOM children
    // to prevent flickering of the column's drag-over styling.
    const dragCounter = useRef(0)

    // Sync dragCounter back to 0 if the global drag-over state is cleared
    // (e.g., when the drag is completed or cancelled).
    useEffect(() => {
        if (!isDragOver) {
            dragCounter.current = 0
        }
    }, [isDragOver])

    /**
     * Increments the drag counter and highlights the column on enter.
     */
    function handleDragEnter(e) {
        e.preventDefault()
        dragCounter.current++
        setDragOverColumn(column.id)
    }

    /**
     * Decrements the drag counter and clears the column highlight when leaving the column hierarchy.
     */
    function handleDragLeave(e) {
        e.preventDefault()
        dragCounter.current--
        if (dragCounter.current === 0) {
            setDragOverColumn(null)
        }
    }

    /**
     * Submits the new task composition card.
     */
    function submit(e) {
        e.preventDefault()
        onAddTask(column.id, draft)
        setDraft('')
        setAdding(false)
    }

    return (
        <section
            className={`column ${isDragOver ? 'column--drag-over' : ''}`}
            onDragOver={(e) => {
                e.preventDefault() // Required to allow drop operations
            }}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={(e) => {
                e.preventDefault()
                dragCounter.current = 0
                onDrop(column.id, null) // Drop at the end of the column
            }}
        >
            <div className="column-head">
                <h2>{column.title}</h2>
                <span className="count-pill">{tasks.length}</span>
                <button className="icon-btn" title="Delete column" onClick={() => onDeleteColumn(column.id)}>
                    ×
                </button>
            </div>

            <div className="task-list">
                {tasks.map((task, index) => (
                    <TaskCard
                        key={task.id}
                        task={task}
                        columnId={column.id}
                        index={index}
                        isDragging={draggingTaskId === task.id}
                        onDelete={() => onDeleteTask(column.id, task.id)}
                        onEdit={(title) => onEditTask(task.id, title)}
                        onDragStart={() => onDragStart(task.id, column.id)}
                        onDragEnd={onDragEnd}
                        onDropBefore={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            onDrop(column.id, index)
                        }}
                    />
                ))}

                {tasks.length === 0 && !isDragOver && (
                    <p className="empty-hint">Drop a card here, or add one below.</p>
                )}
            </div>

            {adding ? (
                <form className="add-task-form" onSubmit={submit}>
                    <textarea
                        autoFocus
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        placeholder="Describe the task…"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) submit(e)
                            if (e.key === 'Escape') setAdding(false)
                        }}
                    />
                    <div className="add-task-actions">
                        <button type="submit">Add card</button>
                        <button type="button" className="ghost" onClick={() => setAdding(false)}>
                            Cancel
                        </button>
                    </div>
                </form>
            ) : (
                <button className="add-task-trigger" onClick={() => setAdding(true)}>
                    + Add a card
                </button>
            )}
        </section>
    )
}

