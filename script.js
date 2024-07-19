document.addEventListener('DOMContentLoaded', () => {
    const textSection = document.getElementById('text-to-type');
    const typedText = document.getElementById('typed-text');
    const submitButton = document.getElementById('submit');
    const restartButton = document.getElementById('restart');
    const resultStats = document.getElementById('result-stats');
    const textComparison = document.getElementById('text-comparison');
    let startTime, endTime, timerInterval, countdownInterval;
    let timeLeft = 15 * 60; // 15 minutes in seconds

    typedText.addEventListener('input', () => {
        if (!startTime) {
            startTime = new Date().getTime();
            startTimer();
            startCountdown();
        }
    });

    submitButton.addEventListener('click', calculateResults);
    restartButton.addEventListener('click', restartTest);

    function startTimer() {
        timerInterval = setInterval(() => {
            const currentTime = new Date().getTime();
            const totalTime = ((currentTime - startTime) / 1000).toFixed(2);
        }, 100);
    }

    function startCountdown() {
        countdownInterval = setInterval(() => {
            if (timeLeft <= 0) {
                clearInterval(countdownInterval);
                calculateResults();
            } else {
                timeLeft--;
                const minutes = Math.floor(timeLeft / 60);
                const seconds = timeLeft % 60;
                document.getElementById('timer').innerText = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            }
        }, 1000);
    }

    function stopTimer() {
        clearInterval(timerInterval);
    }

    function calculateResults() {
        if (!startTime) return; // Ensure timer has started
        endTime = new Date().getTime();
        stopTimer();
        clearInterval(countdownInterval);
        const totalTime = (endTime - startTime) / 1000;
        const typedWordsArray = typedText.value.trim().split(/\s+/);
        const originalWordsArray = textSection.innerText.trim().split(/\s+/);
        const correctWords = typedWordsArray.filter((word, index) => word === originalWordsArray[index]).length;
        const wrongWords = typedWordsArray.length - correctWords;
        const netSpeed = (correctWords / totalTime) * 60;
        const accuracy = (correctWords / typedWordsArray.length) * 100;

        resultStats.innerHTML = `
            <p>Time Taken: ${totalTime.toFixed(2)} seconds</p>
            <p>Typed Words: ${typedWordsArray.length}</p>
            <p>Correct Words: ${correctWords}</p>
            <p>Wrong Words: ${wrongWords}</p>
            <p>Net Speed: ${netSpeed.toFixed(2)} WPM</p>
            <p>Accuracy: ${accuracy.toFixed(2)} %</p>
        `;

        displayTextComparison(originalWordsArray, typedWordsArray);
        resultStats.style.display = 'block';
        textComparison.style.display = 'block';
    }

    function displayTextComparison(originalWordsArray, typedWordsArray) {
        const comparisonHTML = originalWordsArray.map((word, index) => {
            if (word === typedWordsArray[index]) {
                return `<span class="correct">${word}</span>`;
            } else {
                return `<span class="wrong">${word}</span>`;
            }
        }).join(' ');

        textComparison.innerHTML = comparisonHTML;
    }

    function restartTest() {
        typedText.value = '';
        resultStats.style.display = 'none';
        textComparison.style.display = 'none';
        document.getElementById('timer').innerText = '15:00';
        timeLeft = 15 * 60;
        startTime = null;
        clearInterval(timerInterval);
        clearInterval(countdownInterval);
    }
});
