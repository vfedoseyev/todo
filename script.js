window.onload = function () {
    loadTasksFromLocalStorage();

    const completeAllButton = document.getElementById('completeAllButton');
    completeAllButton.addEventListener('click', completeAllTasks);

    const filterAllButton = document.getElementById('filterAllButton');
    filterAllButton.addEventListener('click', function () {
        filterTasks('all');
        toggleActiveButton(filterAllButton);
    });

    const filterCompletedButton = document.getElementById('filterCompletedButton');
    filterCompletedButton.addEventListener('click', function () {
        filterTasks('completed');
        toggleActiveButton(filterCompletedButton);
    });

    const filterActiveButton = document.getElementById('filterActiveButton');
    filterActiveButton.addEventListener('click', function () {
        filterTasks('active');
        toggleActiveButton(filterActiveButton);
    });
};

function toggleActiveButton(button) {
    const filterButtons = document.querySelectorAll('.todo-footer button');
    filterButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
}


function completeAllTasks() {
    const checkboxes = document.querySelectorAll('.btn-done');

    checkboxes.forEach(checkbox => {
        checkbox.checked = true;
        const event = new Event('change');
        checkbox.dispatchEvent(event);
    });

    updateLocalStorage();
}

function loadTasksFromLocalStorage() {
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const taskList = document.getElementById('taskList');

    savedTasks.forEach(task => {
        const taskItem = createTaskElement(task.text, task.date, task.completed);
        taskList.appendChild(taskItem);

        const checkbox = taskItem.querySelector('.btn-done');
        checkbox.addEventListener('change', function () {
            handleCheckboxChange(taskItem, checkbox);
            updateLocalStorage();
        });

        const deleteButton = taskItem.querySelector('.delete-btn');
        deleteButton.addEventListener('click', function () {
            deleteTask(taskItem);
            updateLocalStorage();
        });
    });
}

function createTaskElement(text, date, completed) {
    const taskItem = document.createElement('li');
    taskItem.className = completed ? 'todo-item completed' : 'todo-item';
    taskItem.innerHTML = `
        <span>${text} - ${date}</span>
        <input type="checkbox" class="btn-done" ${completed ? 'checked' : ''}>
        <button class="delete-btn">Delete</button>
    `;

    const deleteButton = taskItem.querySelector('.delete-btn');
    deleteButton.addEventListener('click', function () {
        deleteTask(taskItem);
        updateLocalStorage();
    });

    return taskItem;
}

function handleCheckboxChange(taskItem, checkbox) {
    const span = taskItem.querySelector('span');
    span.classList.toggle('completed-text', checkbox.checked);
    taskItem.classList.toggle('completed', checkbox.checked);
}

function addTask() {
    const taskInput = document.getElementById('taskInput');
    const dateInput = document.getElementById('dateInput');
    const taskList = document.getElementById('taskList');
    const errorMessage = document.getElementById('errorMessage');

    const taskText = taskInput.value;
    const taskDate = dateInput.value;

    if (taskText && taskDate) {
        errorMessage.style.display = 'none';

        const taskItem = createTaskElement(taskText, taskDate, false);
        taskList.appendChild(taskItem);

        const checkbox = taskItem.querySelector('.btn-done');
        checkbox.addEventListener('change', function () {
            handleCheckboxChange(taskItem, checkbox);
            updateLocalStorage();
        });

        saveTaskLocally({
            text: taskText,
            date: taskDate,
            completed: false
        });

        taskInput.value = '';
        dateInput.value = '';
    } else {
        showErrorMessage('Введите текст задачи и дату задачи.');
    }
}

function deleteTask(taskItem) {
    taskItem.remove();
}

function showErrorMessage(message) {
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.innerText = message;
    errorMessage.style.display = 'block';
}

function filterTasks(filter) {
    const taskItems = document.querySelectorAll('.todo-item');

    taskItems.forEach(item => {
        const isCompleted = item.classList.contains('completed');

        switch (filter) {
            case 'all':
                item.classList.remove('hidden');
                break;
            case 'completed':
                isCompleted ? item.classList.remove('hidden') : item.classList.add('hidden');
                break;
            case 'active':
                isCompleted ? item.classList.add('hidden') : item.classList.remove('hidden');
                break;
        }
    });
}

function saveTaskLocally(task) {
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    savedTasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(savedTasks));
}

function updateLocalStorage() {
    const taskItems = document.querySelectorAll('.todo-item');
    const savedTasks = [];

    taskItems.forEach(item => {
        const isCompleted = item.classList.contains('completed');
        const taskText = item.querySelector('span').innerText.split(' - ')[0];
        const taskDate = item.querySelector('span').innerText.split(' - ')[1];

        savedTasks.push({
            text: taskText,
            date: taskDate,
            completed: isCompleted
        });
    });

    localStorage.setItem('tasks', JSON.stringify(savedTasks));
}
