// 1. SELECT DOM ELEMENTS FOR INTERACTION
// The text entry element for creating new tasks
const input = document.getElementById('todoInput');
// The button element to trigger adding a task
const addBtn = document.getElementById('addBtn');
// The list container where all task items (li) will be displayed
const todoList = document.getElementById('todoList');

// 2. INITIALIZE STATE (READ existing tasks list from Local Storage or fallback to empty array)
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// 3. RENDER FUNCTION (The "R" in CRUD operations)
// Clears the list UI and recreates all task elements matching the current state array
function renderTasks() {
    // Clear list to avoid duplicates during re-render
    todoList.innerHTML = '';
    
    // Iterate through the tasks array to generate elements
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        // Construct the item markup: adds completed class for line-through and bind event handler functions
        li.innerHTML = `
            <span class="${task.completed ? 'completed' : ''}" onclick="toggleTask(${index})">
                ${task.text}
            </span>
            <button class="delete-btn" onclick="deleteTask(${index})">Delete</button>
        `;
        todoList.appendChild(li);
    });

    // Save current tasks to Local Storage every time we modify/render tasks list
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// 4. ADD TASK (The "C" in CRUD - Create)
// Extracts text, appends it to state array, resets input, and calls render
function addTask() {
    const text = input.value.trim(); // Trim whitespace from ends
    if (text !== '') {
        tasks.push({ text: text, completed: false }); // Add new task dictionary to array
        input.value = ''; // Reset input text area
        renderTasks(); // Refresh UI list
    }
}

// 5. TOGGLE COMPLETED (The "U" in CRUD - Update)
// Inverts the completed boolean state of a task at a given index
function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    renderTasks(); // Refresh UI list to display strike-through changes
}

// 6. DELETE TASK (The "D" in CRUD - Delete)
// Removes a task from the state array by its index using splice
function deleteTask(index) {
    tasks.splice(index, 1);
    renderTasks(); // Refresh UI list to reflect removal
}

// EVENT LISTENERS
// Listen to mouse click events on the "Add" button
addBtn.addEventListener('click', addTask);

// Listen to keyboard keypresses on the input field to allow pressing "Enter" as shortcut
input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});

// INITIAL RENDER on page load to draw tasks from local storage
renderTasks();