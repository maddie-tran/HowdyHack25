window.addEventListener('DOMContentLoaded', () => {
    const countdownEl = document.getElementById('countdown');
    const startBtn = document.getElementById('startBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const resetBtn = document.getElementById('resetBtn');
    const studyBtn = document.getElementById('studyBtn');
    const breakBtn = document.getElementById('breakBtn');

    const timers = { study: 25*60, break: 5*60 };
    let currentTimer = 'study';
    let time = timers[currentTimer];
    let interval = null;

    function updateCountdown() {
        const minutes = Math.floor(time / 60);
        let seconds = time % 60;
        seconds = seconds < 10 ? '0' + seconds : seconds;
        countdownEl.innerHTML = `${minutes}:${seconds}`;
        time--;

        if (time < 0) {
            clearInterval(interval);
            interval = null;
            toggleActiveButton(); // update button style
            switchTimer(currentTimer === 'study' ? 'break' : 'study');
            startTimer(); // auto start next timer
        }
    }

    function toggleActiveButton() {
        if (interval) {
            // Timer running → highlight start button
            startBtn.classList.add('active');
            pauseBtn.classList.remove('active');
        } else {
            // Timer paused → highlight pause button
            pauseBtn.classList.add('active');
            startBtn.classList.remove('active');
        }
    }

    function startTimer() {
        if (!interval) {
            interval = setInterval(updateCountdown, 1000);
            toggleActiveButton();
        }
    }

    function pauseTimer() {
        clearInterval(interval);
        interval = null;
        toggleActiveButton();
    }

    function resetTimer() {
        pauseTimer();
        time = timers[currentTimer];
        updateCountdown();
    }

    function switchTimer(timerName) {
        pauseTimer();
        currentTimer = timerName;
        time = timers[currentTimer];
        updateCountdown();
    }

    // Button events
    startBtn.addEventListener('click', startTimer);
    pauseBtn.addEventListener('click', pauseTimer);
    resetBtn.addEventListener('click', resetTimer);
    studyBtn.addEventListener('click', () => switchTimer('study'));
    breakBtn.addEventListener('click', () => switchTimer('break'));

    // Initialize
    updateCountdown();
    toggleActiveButton();
});
