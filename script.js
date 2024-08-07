const RANDOM_PARAGRAPH_API_URL = "https://api.quotable.io/random?minLength=100&maxLength=300";
const quoteDisplayElement = document.getElementById('quoteDisplay');
const quoteInputElement = document.getElementById('quoteInput');
const timerElement = document.getElementById('timer');
const resultElement = document.getElementById('result');

quoteInputElement.addEventListener('input', () => {
    const arrayQuote = quoteDisplayElement.querySelectorAll('span');
    const arrayValue = quoteInputElement.value.split('');
    
    let correct = true;
    arrayQuote.forEach((characterSpan, index) => {
        const character = arrayValue[index];
        if (character == null) {
            characterSpan.classList.remove('correct');
            characterSpan.classList.remove('incorrect');
            correct = false;
        } else if (character === characterSpan.innerText) {
            characterSpan.classList.add('correct');
            characterSpan.classList.remove('incorrect');
        } else {
            characterSpan.classList.remove('correct');
            characterSpan.classList.add('incorrect');
            correct = false;
        }
    });

    if (correct) {
        const elapsedTime = getTimerTime();
        const wpm = calculateWPM(quoteInputElement.value, elapsedTime);
        showResults(wpm);
    }
});

quoteInputElement.addEventListener('focus', () => {
    startTimer();
});

function getRandomParagraph() {
    return fetch(RANDOM_PARAGRAPH_API_URL)
        .then(response => response.json())
        .then(data => data.content);
}

async function renderNewQuote() {
    try {
        const paragraph = await getRandomParagraph();
        console.log("Fetched paragraph:", paragraph);  // Debug log
        quoteDisplayElement.innerHTML = '';
        paragraph.split('').forEach(character => {
            const characterSpan = document.createElement('span');
            characterSpan.innerText = character;
            quoteDisplayElement.appendChild(characterSpan);
        });
        quoteInputElement.value = null;
        resetTimer();  // Ensure the timer is reset
        quoteInputElement.blur();  // Remove focus from the textbox
    } catch (error) {
        console.error("Error fetching the paragraph:", error);
        quoteDisplayElement.innerText = "Failed to fetch the paragraph. Please try again.";
    }
}

let timerInterval;
let startTime = null;

function startTimer() {
    if (startTime === null) {
        startTime = new Date();
        timerInterval = setInterval(() => {
            timerElement.innerText = getTimerTime();
        }, 1000);
    }
}

function resetTimer() {
    clearInterval(timerInterval);
    timerElement.innerText = 0;
    startTime = null;
}

function getTimerTime() {
    return Math.floor((new Date() - startTime) / 1000);
}

function calculateWPM(inputValue, elapsedTime) {
    const words = inputValue.split(' ').length;
    const timeInMinutes = elapsedTime / 60;
    return Math.round(words / timeInMinutes);
}

function showResults(wpm) {
    resultElement.innerHTML = `WPM: ${wpm}`;
    resetTimer();
    setTimeout(renderNewQuote, 1000); 
}

renderNewQuote();
