const taskForm = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");
const searchInput = document.getElementById("search");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let editTaskId = null;

// Save to LocalStorage
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Display Tasks
function displayTasks(filter = "") {
    taskList.innerHTML = "";

    tasks
        .filter(task => task.title.toLowerCase().includes(filter.toLowerCase()))
        .forEach(task => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${task.title}</td>
                <td>${task.description}</td>
                <td>${task.date}</td>
                <td class="${task.status === 'Completed' ? 'status-completed' : 'status-pending'}">
                    ${task.status}
                </td>
                <td>
                    <button onclick="toggleStatus(${task.id})">Toggle</button>
                    <button onclick="editTask(${task.id})">Edit</button>
                    <button onclick="deleteTask(${task.id})">Delete</button>
                </td>
            `;

            taskList.appendChild(row);
        });
}

// Add or Update Task
taskForm.addEventListener("submit", function(e) {
    e.preventDefault();

    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const date = document.getElementById("date").value;

    if (editTaskId) {
        tasks = tasks.map(task =>
            task.id === editTaskId
                ? { ...task, title, description, date }
                : task
        );
        editTaskId = null;
    } else {
        const newTask = {
            id: Date.now(),
            title,
            description,
            date,
            status: "Pending"
        };
        tasks.push(newTask);
    }

    saveTasks();
    displayTasks();
    taskForm.reset();
});

// Delete Task
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    displayTasks();
}

// Edit Task
function editTask(id) {
    const task = tasks.find(task => task.id === id);

    document.getElementById("title").value = task.title;
    document.getElementById("description").value = task.description;
    document.getElementById("date").value = task.date;

    editTaskId = id;
}

// Toggle Status
function toggleStatus(id) {
    tasks = tasks.map(task =>
        task.id === id
            ? { ...task, status: task.status === "Pending" ? "Completed" : "Pending" }
            : task
    );

    saveTasks();
    displayTasks();
}

// Search
searchInput.addEventListener("input", () => {
    displayTasks(searchInput.value);
});

// Initial Load
displayTasks();