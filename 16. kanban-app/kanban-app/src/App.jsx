import React, { useState, useRef } from 'react'
import Column from './Column.jsx'
import { initialBoard } from './initialData.js'
import { generateUUID } from './utils.js'
import './index.css'

// ---- localStorage helpers -------------------------------------------------
const STORAGE_KEY = 'pegboard-state-v1'

/**
 * Loads the board state from localStorage.
 * Falls back to the initialBoard structure if storage is empty or fails.
 * 
 * @returns {object} The parsed board state.
 */
function loadBoard() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch (e) {
    console.warn('Could not read saved board, starting fresh.', e)
  }
  return initialBoard
}

export default function App() {
  // Main board state holding columns list and tasks lookup table
  const [board, setBoard] = useState(loadBoard)
  
  // dragInfo holds ref metadata about the active dragged task (no re-renders on change)
  const dragInfo = useRef(null) // { taskId, fromColumnId }
  
  // React states to track dragging UI elements and trigger visual updates
  const [draggingTaskId, setDraggingTaskId] = useState(null)
  const [dragOverColumn, setDragOverColumn] = useState(null)

  /**
   * Updates state and persists the board object to localStorage.
   * 
   * @param {object} next - The next board state.
   */
  function persist(next) {
    setBoard(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }

  // ---- Task CRUD -----------------------------------------------------------

  /**
   * Adds a new task card to a specific column.
   * 
   * @param {string} columnId - The ID of the column where the task is added.
   * @param {string} title - The description/title text of the task.
   */
  function addTask(columnId, title) {
    if (!title.trim()) return
    const newTask = {
      id: generateUUID(),
      title: title.trim(),
      createdAt: Date.now(),
    }
    const next = {
      ...board,
      columns: board.columns.map((col) =>
        col.id === columnId ? { ...col, taskIds: [...col.taskIds, newTask.id] } : col
      ),
      tasks: { ...board.tasks, [newTask.id]: newTask },
    }
    persist(next)
  }

  /**
   * Deletes a task card from state and removes its ID from the associated column list.
   * 
   * @param {string} columnId - The ID of the column containing the task.
   * @param {string} taskId - The ID of the task to be deleted.
   */
  function deleteTask(columnId, taskId) {
    const { [taskId]: _removed, ...remainingTasks } = board.tasks
    const next = {
      ...board,
      columns: board.columns.map((col) =>
        col.id === columnId
          ? { ...col, taskIds: col.taskIds.filter((id) => id !== taskId) }
          : col
      ),
      tasks: remainingTasks,
    }
    persist(next)
  }

  /**
   * Edits the title text of an existing task.
   * 
   * @param {string} taskId - The ID of the task to update.
   * @param {string} title - The new title text.
   */
  function editTask(taskId, title) {
    if (!title.trim()) return
    const next = {
      ...board,
      tasks: { ...board.tasks, [taskId]: { ...board.tasks[taskId], title: title.trim() } },
    }
    persist(next)
  }

  // ---- Column CRUD -----------------------------------------------------------

  /**
   * Adds a new empty column to the right side of the board.
   * 
   * @param {string} title - The title/name of the new column.
   */
  function addColumn(title) {
    if (!title.trim()) return
    const newColumn = { id: generateUUID(), title: title.trim(), taskIds: [] }
    persist({ ...board, columns: [...board.columns, newColumn] })
  }

  /**
   * Deletes a column and removes all tasks that were contained within it.
   * 
   * @param {string} columnId - The ID of the column to delete.
   */
  function deleteColumn(columnId) {
    const col = board.columns.find((c) => c.id === columnId)
    if (!col) return
    const remainingTasks = { ...board.tasks }
    col.taskIds.forEach((id) => delete remainingTasks[id])
    persist({
      ...board,
      columns: board.columns.filter((c) => c.id !== columnId),
      tasks: remainingTasks,
    })
  }

  // ---- Drag and drop ---------------------------------------------------------
  // Native HTML5 DnD: draggable + onDragStart on the card,
  // onDragOver/onDrop on the column drop-zone.

  /**
   * Initiates the drag operation on a task card.
   * Sets ref data and dragging state.
   * 
   * @param {string} taskId - ID of the dragged task.
   * @param {string} fromColumnId - ID of the source column.
   */
  function handleDragStart(taskId, fromColumnId) {
    dragInfo.current = { taskId, fromColumnId }
    setDraggingTaskId(taskId)
  }

  /**
   * Cleans up dragging state when drag ends.
   */
  function handleDragEnd() {
    dragInfo.current = null
    setDraggingTaskId(null)
    setDragOverColumn(null)
  }

  /**
   * Handles dropping a card either within the same column or across columns.
   * Resolves index shifting problems during reorders.
   * 
   * @param {string} toColumnId - The ID of the column where the card is dropped.
   * @param {number|null} dropIndex - The index before which the card is dropped (null if dropped at the end).
   */
  function handleDrop(toColumnId, dropIndex) {
    const info = dragInfo.current
    setDragOverColumn(null)
    if (!info) return
    const { taskId, fromColumnId } = info
    
    // Reordering within the same column
    if (fromColumnId === toColumnId) {
      const col = board.columns.find((c) => c.id === toColumnId)
      if (!col) return
      const ids = [...col.taskIds]
      const dragIndex = ids.indexOf(taskId)
      
      if (dragIndex !== -1) {
        // Remove item from its current position
        ids.splice(dragIndex, 1)
        // Calculate correct insert index: if dragging down (dragIndex < dropIndex),
        // removing the element shifted everything above it down, so adjust index by -1
        const insertAt = dropIndex === null ? ids.length : (dragIndex < dropIndex ? dropIndex - 1 : dropIndex)
        ids.splice(insertAt, 0, taskId)
        
        persist({
          ...board,
          columns: board.columns.map((c) => (c.id === toColumnId ? { ...c, taskIds: ids } : c)),
        })
      }
      return
    }

    // Moving across columns
    const next = {
      ...board,
      columns: board.columns.map((c) => {
        if (c.id === fromColumnId) {
          // Remove task from source column
          return { ...c, taskIds: c.taskIds.filter((id) => id !== taskId) }
        }
        if (c.id === toColumnId) {
          // Insert task in target column
          const ids = [...c.taskIds]
          const insertAt = dropIndex === null ? ids.length : dropIndex
          ids.splice(insertAt, 0, taskId)
          return { ...c, taskIds: ids }
        }
        return c
      }),
    }
    persist(next)
  }

  const [newColumnTitle, setNewColumnTitle] = useState('')

  return (
    <div className="board-shell">
      <header className="board-header">
        <div>
          <p className="eyebrow">Pegboard</p>
          <h1>Project Board</h1>
        </div>
        <form
          className="add-column-form"
          onSubmit={(e) => {
            e.preventDefault()
            addColumn(newColumnTitle)
            setNewColumnTitle('')
          }}
        >
          <input
            value={newColumnTitle}
            onChange={(e) => setNewColumnTitle(e.target.value)}
            placeholder="New column name"
          />
          <button type="submit">+ Column</button>
        </form>
      </header>

      <div className="board-columns">
        {board.columns.map((col) => (
          <Column
            key={col.id}
            column={col}
            // Defensively map taskIds to tasks, filtering out any orphans/undefined values
            tasks={col.taskIds.map((id) => board.tasks[id]).filter(Boolean)}
            draggingTaskId={draggingTaskId}
            onAddTask={addTask}
            onDeleteTask={deleteTask}
            onEditTask={editTask}
            onDeleteColumn={deleteColumn}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDrop={handleDrop}
            isDragOver={dragOverColumn === col.id}
            setDragOverColumn={setDragOverColumn}
          />
        ))}
      </div>
    </div>
  )
}

