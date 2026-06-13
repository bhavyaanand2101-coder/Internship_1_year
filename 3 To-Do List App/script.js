// 1. SELECT ELEMENTS
const input = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');

// 2. INITIALIZE STATE (READ from Local Storage)
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// 3. RENDER FUNCTION (The "R" in CRUD)
function renderTasks() {
    todoList.innerHTML = '';
    
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span class="${task.completed ? 'completed' : ''}" onclick="toggleTask(${index})">
                ${task.text}
            </span>
            <button class="delete-btn" onclick="deleteTask(${index})">Delete</button>
        `;
        todoList.appendChild(li);
    });

    // Save to Local Storage every time we render
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// 4. ADD TASK (The "C" in CRUD)
function addTask() {
    const text = input.value.trim();
    if (text !== '') {
        tasks.push({ text: text, completed: false });
        input.value = '';
        renderTasks();
    }
}

// 5. TOGGLE COMPLETED (The "U" in CRUD - Update)
function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    renderTasks();
}

// 6. DELETE TASK (The "D" in CRUD)
function deleteTask(index) {
    tasks.splice(index, 1);
    renderTasks();
}

// EVENT LISTENERS
addBtn.addEventListener('click', addTask);

// Allow pressing "Enter" to add task
input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});

// INITIAL RENDER
renderTasks();