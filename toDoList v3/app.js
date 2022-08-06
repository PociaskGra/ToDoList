const taskContent = document.querySelector('.new-task');
const taskInput = document.querySelector('.new-task-submit');
const taskList = document.querySelector('.task-list');

const STORAGE_KEY = 'tasks';

const saveTasks = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};

const loadTasks = () => {
    const fromStorage = localStorage.getItem(STORAGE_KEY);
    const parsed = JSON.parse(fromStorage);
    tasks = parsed.map(({ id, name, createdAt }) => ({
        id,
        name,
        createdAt: new Date(createdAt),
    }));
    displayList();
};

let tasks = [];
let taskId = 0;
//tworzenie obiektu task
const addTask = () => {
    const date = new Date();
    if (taskContent.value.length === 0) {
        alert('Dodaj nowe zadanie');
        return;
    }
    const task = {
        id: taskId,
        name: taskContent.value,
        createdAt: date,
    };
    tasks.push(task);
    displayList();
    taskContent.value = '';
};

const sortBy = {
    id: undefined,
    name: undefined,
    createdAt: undefined,
};

const clearSorter = (exclude) => {
    Object.keys(sortBy).forEach((key) => {
        if (key === exclude) {
            return;
        }
        sortBy[key] = undefined;
    });
};

const setSorter = (sorterType) => {
    clearSorter(sorterType);
    sortBy[sorterType] = !sortBy[sorterType];
    functionSort();
};

const functionSort = () => {
    const sortKey = Object.keys(sortBy).find(
        (key) => sortBy[key] !== undefined
    );
    const sortDirection = sortBy[sortKey];

    tasks.sort((a, b) => {
        //sortDirection === true a = 2 b = 1
        if (a[sortKey] < b[sortKey]) {
            return sortDirection ? 1 : -1;
        }

        if (a[sortKey] > b[sortKey]) {
            return sortDirection ? -1 : 1;
        }

        return 0;
    });

    displayList();
};

const generateFirstRow = () => {
    const row = document.createElement('tr');
    const cellID = document.createElement('td');
    const cellName = document.createElement('td');
    const cellDate = document.createElement('td');
    const cellRemove = document.createElement('td');
    row.style = 'cursor: default;';
    cellID.innerHTML = 'ID';
    cellID.addEventListener('click', () => setSorter('id'));
    row.appendChild(cellID);
    cellName.innerHTML = 'Nazwa';
    cellName.addEventListener('click', () => setSorter('name'));
    row.appendChild(cellName);
    cellDate.innerHTML = 'Data';
    cellDate.addEventListener('click', () => setSorter('createdAt'));
    row.appendChild(cellDate);
    cellRemove.innerHTML = 'Usuń';
    cellRemove.style = 'min-width:50px;max-width:50px;';
    row.appendChild(cellRemove);
    taskList.appendChild(row);
};
//wyświetlanie elementów
const displayList = () => {
    taskList.innerHTML = '';
    generateFirstRow(tasks);
    tasks.forEach((task) => {
        taskList.appendChild(createTask(task));
    });
    saveTasks();
};
//Tworzenie elementu 'task' na stronie
const createTask = ({ name, createdAt, id }) => {
    const row = document.createElement('tr');
    row.className = 'task';
    const time =
        createdAt.getDate() +
        '-' +
        createdAt.getMonth() +
        '-' +
        createdAt.getFullYear() +
        `<br/>` +
        createdAt.getHours() +
        ':' +
        createdAt.getMinutes();
    taskId++;
    row.appendChild(createCell(id));
    row.appendChild(createCell(name));
    row.appendChild(createCell(time));
    row.appendChild(createButton(id));
    return row;
};
//Tworzenie elementów tablicy
const createCell = (text) => {
    const cell = document.createElement('td');
    cell.id = 'taskname wrap';
    cell.innerHTML = text;
    return cell;
};

const createButton = (taskId) => {
    const button = document.createElement('td');
    button.className = 'task-remove';
    button.innerHTML = 'x';
    button.addEventListener('click', () => removeTask(taskId));
    return button;
};

const removeTask = (id) => {
    const toDelete = tasks.find((task) => task.id === id);

    tasks.splice(tasks.indexOf(toDelete), 1);
    displayList();
};
//Event listenery
taskInput.addEventListener('click', addTask);

window.addEventListener('load', loadTasks());
