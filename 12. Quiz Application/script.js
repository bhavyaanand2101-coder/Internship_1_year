// Quiz Questions
const quizData = [
    {
        question: "What does HTML stand for?",
        options: [
            "Hyper Text Markup Language",
            "High Text Machine Language",
            "Hyper Tool Markup Language",
            "Home Text Markup Language"
        ],
        answer: "Hyper Text Markup Language"
    },
    {
        question: "Which language is used for styling web pages?",
        options: ["HTML", "CSS", "Python", "Java"],
        answer: "CSS"
    },
    {
        question: "Which JavaScript method is used to select an element by ID?",
        options: [
            "querySelector",
            "getElementById",
            "getElementsByClassName",
            "selectElement"
        ],
        answer: "getElementById"
    },
    {
        question: "Which company developed JavaScript?",
        options: ["Microsoft", "Google", "Netscape", "Apple"],
        answer: "Netscape"
    },
    {
        question: "Which symbol is used for comments in JavaScript?",
        options: ["<!-- -->", "//", "#", "**"],
        answer: "//"
    }
];

let currentQuestion = 0;
let score = 0;
let timeLeft = 15;
let timer;

const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const nextBtn = document.getElementById("next-btn");
const timerEl = document.getElementById("timer");
const resultEl = document.getElementById("result");

// Load Question
function loadQuestion() {

    clearInterval(timer);

    timeLeft = 15;
    timerEl.textContent = `Time Left: ${timeLeft}s`;

    timer = setInterval(() => {
        timeLeft--;
        timerEl.textContent = `Time Left: ${timeLeft}s`;

        if (timeLeft === 0) {
            clearInterval(timer);
            currentQuestion++;

            if (currentQuestion < quizData.length) {
                loadQuestion();
            } else {
                showResult();
            }
        }
    }, 1000);

    const currentQuiz = quizData[currentQuestion];

    questionEl.textContent = currentQuiz.question;
    optionsEl.innerHTML = "";

    currentQuiz.options.forEach(option => {
        const button = document.createElement("button");

        button.innerText = option;
        button.classList.add("option-btn");

        button.addEventListener("click", () => checkAnswer(button, option));

        optionsEl.appendChild(button);
    });
}

// Check Answer
function checkAnswer(button, selectedOption) {

    const correctAnswer = quizData[currentQuestion].answer;

    const allButtons = document.querySelectorAll(".option-btn");

    allButtons.forEach(btn => btn.disabled = true);

    if (selectedOption === correctAnswer) {
        button.classList.add("correct");
        score++;
    } else {
        button.classList.add("wrong");

        allButtons.forEach(btn => {
            if (btn.innerText === correctAnswer) {
                btn.classList.add("correct");
            }
        });
    }
}

// Next Question
nextBtn.addEventListener("click", () => {

    currentQuestion++;

    if (currentQuestion < quizData.length) {
        loadQuestion();
    } else {
        showResult();
    }
});

// Show Result
function showResult() {

    clearInterval(timer);

    document.getElementById("question-container").classList.add("hidden");
    nextBtn.classList.add("hidden");
    timerEl.classList.add("hidden");

    resultEl.classList.remove("hidden");

    resultEl.innerHTML = `
        <h2>Your Score: ${score}/${quizData.length}</h2>
        <br>
        <button onclick="location.reload()">Restart Quiz</button>
    `;
}

loadQuestion();