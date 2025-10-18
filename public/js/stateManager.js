const { load } = require("mime");
const { ta } = require("zod/v4/locales");

const defaultState = {
    tasks:[],
    points:0,
    reveille: { houseColor: 'maroon', bedStyle: 'classic', toys:[]}
};

function loadState() {
    const saved = localStorage.getItem('appState');
    return saved ? JSON.parse(saved) : defaultState;
}

function saveState(state) {
    localStorage.setItem('appState', JSON.stringify(state));
}

function updateState(updateFn) {
    const state = loadState();
    updateFn(state);
    saveState(state);
    renderUI();
}

function addTask(text) {
    updateState(state => {
        state.tasks.push({ text, completed: false });
    });
    renderUI();
}

function toggleTask(index) {
    updateState(state => {
        const task = state.tasks[index];
        task.done = !task.done;
        if (task.done) state.points += 10;
    });
    renderUI();
}

function addToy(toy) {
    updateState(state => {
        state.reveille.toys.push(toy);
        state.points -= 20;
    });
    renderUI();
}

function renderUI() {
    const state = loadState();

    const list = document.getElementById('taskList');
    if (list) {
        list.innerHTML = '';
        state.tasks.forEach((task, i) => {
            const li = document.createElement('li');
            li.textContent = task.text;
            li.className = task.completed ? 'completed' : '';
            li.onclick = () => toggleTask(i);
            list.appendChild(li);
        });
    }
    const pointsEl = document.getElementById('pointsDisplay');
    if (pointsEl) pointsEl.textContent = `Points: ${state.points}`;

    const house = document.getElementById('reveilleHouse');
    if (house) {
        house.style.backgroundColor = state.reveille.houseColor;
    }
}
