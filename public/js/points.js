// Store points and log in memory for now
let totalPoints = 0;
let pointsLog = [];

// Function to add points
function addPoints(eventName, points) {
    const now = new Date();
    const entry = {
        date: now.toLocaleString(),
        event: eventName,
        points: points
    };
    pointsLog.push(entry);
    totalPoints += points;
    updateDisplay();
}

// Function to update the HTML display
function updateDisplay() {
    document.getElementById('totalPoints').textContent = totalPoints;

    const tbody = document.getElementById('pointsLog').querySelector('tbody');
    tbody.innerHTML = pointsLog.map(entry => `
        <tr>
            <td>${entry.date}</td>
            <td>${entry.event}</td>
            <td>${entry.points}</td>
        </tr>
    `).join('');
}

// Example: award points for timer completion
function completeTimer() {
    addPoints('Finished 25-minute Timer', 25);
}

// Example: award points for completing a task
function completeTask(taskName) {
    addPoints(`Completed Task: ${taskName}`, 40);
}

// Expose functions to global so timer.js or todo.js can call
window.completeTimer = completeTimer;
window.completeTask = completeTask;

// Initialize display
updateDisplay();
