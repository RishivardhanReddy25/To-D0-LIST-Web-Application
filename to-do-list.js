let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let deletedTasks = JSON.parse(localStorage.getItem("deletedTasks")) || [];

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    localStorage.setItem("deletedTasks", JSON.stringify(deletedTasks));
}

function toggleInstructions() {
    const box = document.getElementById("instructionBox");
    box.style.display = box.style.display === "none" ? "block" : "none";
}

function addTask() {
    const input = document.getElementById("taskInput");
    const text = input.value.trim();

    if (text === "") {
        alert("Enter a task!");
        return;
    }

    tasks.push({ text, completed: false });
    saveTasks();
    displayTasks();

    const msg = document.getElementById("message");
    msg.innerHTML = `✔ Task "<strong>${text}</strong>" added successfully!`;
    msg.style.display = "block";
    msg.style.color = "green";

    setTimeout(() => {
        msg.style.display = "none";
    }, 2000);

    input.value = "";
}

function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    displayTasks();
}

function editTask(index) {
    const updated = prompt("Edit task:", tasks[index].text);
    if (updated && updated.trim() !== "") {
        tasks[index].text = updated.trim();
        saveTasks();
        displayTasks();
    }
}

function deleteTask(index) {
    const taskToDelete = tasks[index];
    deletedTasks.push(taskToDelete); 
    tasks.splice(index, 1); 
    
    saveTasks();
    displayTasks();

    const msg = document.getElementById("message");
    msg.innerHTML = `🗑 Task moved to Bin!`;
    msg.style.display = "block";
    msg.style.color = "#dc3545"; 

    setTimeout(() => {
        msg.style.display = "none";
    }, 2000);
}

function restoreTask(index) {
    const taskToRestore = deletedTasks[index];
    tasks.push(taskToRestore);
    deletedTasks.splice(index, 1);
    
    saveTasks();
    displayTasks('bin'); 

    const msg = document.getElementById("message");
    msg.innerHTML = `♻ Task Restored!`;
    msg.style.display = "block";
    msg.style.color = "green";

    setTimeout(() => {
        msg.style.display = "none";
    }, 2000);
}

function deletePermanently(index) {
    if(confirm("Are you sure you want to delete this permanently?")) {
        deletedTasks.splice(index, 1);
        saveTasks();
        displayTasks('bin'); 
    }
}

function displayTasks(filter = "all") {
    const list = document.getElementById("taskList");
    list.innerHTML = "";

    let currentList = tasks;
    let isBin = false;

    if (filter === "completed") currentList = tasks.filter(t => t.completed);
    if (filter === "active") currentList = tasks.filter(t => !t.completed);
    if (filter === "bin") {
        currentList = deletedTasks;
        isBin = true;
    }

    if (isBin && currentList.length === 0) {
        list.innerHTML = `<li class="list-group-item text-center text-muted">Bin is empty</li>`;
        return;
    }

    currentList.forEach((task, index) => {
        const li = document.createElement("li");
        li.className = isBin ? "task list-group-item bin-task" : "task list-group-item";
        let originalIndex = tasks.indexOf(task); 

        if (isBin) {
            li.innerHTML = `
                <div>
                    <span class="text-decoration-line-through text-secondary">${task.text}</span>
                </div>
                <div>
                    <button class="btn btn-success btn-sm me-2" onclick="restoreTask(${index})">♻ Restore</button>
                    <button class="btn btn-danger btn-sm" onclick="deletePermanently(${index})">✕ Delete</button>
                </div>
            `;
        } else {
            li.innerHTML = `
                <div>
                    <input type="checkbox" class="form-check-input me-2"
                        ${task.completed ? "checked" : ""}
                        onclick="toggleTask(${originalIndex})">
                    <span class="${task.completed ? 'completed' : ''}">${task.text}</span>
                </div>
                <div>
                    <button class="btn btn-info btn-sm me-2" onclick="editTask(${originalIndex})">✏</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteTask(${originalIndex})">🗑</button>
                </div>
            `;
        }
        list.appendChild(li);
    });
}

function showTasks(type) {
    displayTasks(type);
}

displayTasks();