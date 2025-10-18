window.addEventListener('DOMContentLoaded', () => {
    const countdownEl = document.getElementById('countdown');
    const startBtn = document.getElementById('startBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const resetBtn = document.getElementById('resetBtn');
    const studyBtn = document.getElementById('studyBtn');
    const breakBtn = document.getElementById('breakBtn');

    // Timer durations (seconds)
    const timers = {
        study: 25 * 60,
        break: 5 * 60
    };

    let currentTimer = 'study';
    let time = timers[currentTimer];
    let interval = null;

    // Update the countdown display
    function updateCountdown() {
        const minutes = Math.floor(time / 60);
        let seconds = time % 60;
        seconds = seconds < 10 ? '0' + seconds : seconds;
        countdownEl.innerHTML = `${minutes}:${seconds}`;
        time--;

        // Timer ends
        if (time < 0) {
            clearInterval(interval);
            interval = null;
            toggleActiveButton();
            // Switch automatically
            currentTimer = currentTimer === 'study' ? 'break' : 'study';
            time = timers[currentTimer];
            updateCountdown();
            startTimer();
        }
    }

    // Highlight Start/Pause buttons
    function toggleActiveButton() {
        if (interval) {
            startBtn.classList.add('active');
            pauseBtn.classList.remove('active');
        } else {
            pauseBtn.classList.add('active');
            startBtn.classList.remove('active');
        }
    }

    // Highlight active timer button (study/break)
    function toggleActiveTimerButton() {
        if (currentTimer === 'study') {
            studyBtn.classList.add('timer-active');
            breakBtn.classList.remove('timer-active');
        } else {
            breakBtn.classList.add('timer-active');
            studyBtn.classList.remove('timer-active');
        }
    }

    // Start timer
    function startTimer() {
        if (!interval) {
            interval = setInterval(updateCountdown, 1000);
            toggleActiveButton();
            toggleActiveTimerButton();
        }
    }

    // Pause timer
    function pauseTimer() {
        clearInterval(interval);
        interval = null;
        toggleActiveButton();
        toggleActiveTimerButton();
    }

    // Reset timer
    function resetTimer() {
        pauseTimer();
        time = timers[currentTimer];
        updateCountdown();
    }

    // Switch timers manually
    function switchTimer(timerName) {
        pauseTimer();
        currentTimer = timerName;
        time = timers[currentTimer];
        updateCountdown();
        toggleActiveTimerButton();
    }

    // Event listeners
    startBtn.addEventListener('click', startTimer);
    pauseBtn.addEventListener('click', pauseTimer);
    resetBtn.addEventListener('click', resetTimer);
    studyBtn.addEventListener('click', () => switchTimer('study'));
    breakBtn.addEventListener('click', () => switchTimer('break'));

    // Initialize display
    updateCountdown();
    toggleActiveButton();
    toggleActiveTimerButton();
});
