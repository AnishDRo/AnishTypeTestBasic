document.addEventListener('DOMContentLoaded', () => {
    const textSection = document.getElementById('text-section');
    const typedText = document.getElementById('typed-text');
    const submitButton = document.getElementById('submit-button');
    const restartButton = document.getElementById('restart-button');
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
            document.getElementById('time-elapsed').innerText = totalTime;
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

        // Normalize and split texts into words
        const normalizeText = text => text.toLowerCase().replace(/[^\w\s]|_/g, "").replace(/\s+/g, " ").trim().split(" ");
        const originalTextArray = normalizeText(textSection.innerText);
        const typedWordsArray = normalizeText(typedText.value);

        // Count correct and incorrect words
        let correctWords = 0;
        typedWordsArray.forEach((word, index) => {
            if (word === originalTextArray[index]) {
                correctWords++;
            }
        });

        const wrongWords = typedWordsArray.length - correctWords;
        const netSpeed = (correctWords / totalTime) * 60;
        const accuracy = (correctWords / typedWordsArray.length) * 100;

        // Store results in localStorage
        localStorage.setItem('typedText', typedText.value);
        localStorage.setItem('originalText', textSection.innerText);
        localStorage.setItem('timeTaken', totalTime.toFixed(2));
        localStorage.setItem('typedWords', typedWordsArray.length);
        localStorage.setItem('correctWords', correctWords);
        localStorage.setItem('wrongWords', wrongWords);
        localStorage.setItem('netSpeed', netSpeed.toFixed(2));
        localStorage.setItem('accuracy', accuracy.toFixed(2));

        displayResults(totalTime, typedWordsArray.length, correctWords, wrongWords, netSpeed, accuracy);
    }

    function displayResults(time, typedWords, correctWords, wrongWords, netSpeed, accuracy) {
        const resultStats = document.getElementById('result-stats');
        resultStats.style.display = 'block';
        resultStats.innerHTML = `
            <p>Time Taken: ${time} seconds</p>
            <p>Typed Words: ${typedWords}</p>
            <p>Correct Words: ${correctWords}</p>
            <p>Wrong Words: ${wrongWords}</p>
            <p>Net Speed: ${netSpeed} WPM</p>
            <p>Accuracy: ${accuracy} %</p>
        `;

        const textComparison = document.getElementById('text-comparison');
        const typedTextArray = localStorage.getItem('typedText').split(' ');
        const originalTextArray = localStorage.getItem('originalText').split(' ');

        const resultTextHTML = originalTextArray.map((word, index) => {
            const typedWord = typedTextArray[index] || '';
            return `<span class="${typedWord.toLowerCase() === word.toLowerCase() ? 'correct' : 'wrong'}">${typedWord}</span>`;
        }).join(' ');

        textComparison.innerHTML = resultTextHTML;
        textComparison.style.display = 'block';
    }

    function restartTest() {
        typedText.value = '';
        startTime = null;
        endTime = null;
        stopTimer();
        clearInterval(countdownInterval);
        timeLeft = 15 * 60; // Reset the countdown
        document.getElementById('timer').innerText = '15:00';
        document.getElementById('result-stats').style.display = 'none';
        document.getElementById('text-comparison').style.display = 'none';
    }

    fetch('paragraph.html')
    .then(response => response.text())
    .then(data => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(data, 'text/html');
        const paragraphContent = doc.getElementById('paragraph-content');
        if (paragraphContent) {
            textSection.innerHTML = paragraphContent.innerHTML;
        } else {
            console.error('Error: paragraph-content not found');
        }
    })
    .catch(error => console.error('Error fetching paragraph:', error));
});
