// Array containing your structured quiz questionnaire data
const quizData = [
    {
        question: "What name does my Queen call me?",
        options: ["Rizz", "ritzzzz", "ro", "ritik"],
        correct: 1 // Matches index item "ritzzzz"
    },
    {
        question: "What do I call my Queen?",
        options: ["Cutie", "Beautiful", "Queen", "Sunshine"],
        correct: "any" // Flag marking it as an opinion trick question
    },
    {
        question: "What game does my Queen like to play?",
        options: ["Fortnite", "Minecraft", "Bgmi", "Call of Duty"],
        correct: 2 // Matches index item "Bgmi"
    },
    {
        question: "What words do I love to hear my Queen say to me?",
        options: ["thik ba", "Great", "Nice", "LoL"],
        correct: 0 // Matches index item "thik ba"
    },
    {
        question: "What is my Queen's name?",
        options: ["Eira Noir", "Someone", "NIKY ji", "Don't know"],
        correct: 2 // Matches index item "Eira Noir"
    },
    {
        question: "Is my Queen a pet lover?",
        options: ["Yes", "No"],
        correct: 0 // Matches index item "Yes"
    },
    {
        question: "Lastly, how much do I love my Queen?",
        options: ["very much", "Very Very much", "Infinity", "Little bit... Just Kidding" ],
        correct: "any" // Matches index item "Infinity"
    }
];

// Operational tracker state variables
let currentQuestionIndex = 0;
let score = 0;
let selectedOptionIndex = null;

// Catching required HTML nodes from DOM
const questionText = document.getElementById("question-text");
const optionsContainer = document.getElementById("options-container");
const nextButton = document.getElementById("next-btn");
const currentNumberSpan = document.getElementById("current-number");
const progressFill = document.getElementById("progress-fill");
const gameBox = document.getElementById("game-box");
const resultsBox = document.getElementById("results-box");
const finalScoreSpan = document.getElementById("final-score");
const feedbackText = document.getElementById("feedback-text");
const restartButton = document.getElementById("restart-btn");
const videoContainer = document.getElementById("video-container");

// Clears layout tracking elements and prints the next question card details
function loadQuestion() {
    selectedOptionIndex = null;
    nextButton.disabled = true;
    nextButton.innerText = "Select an Answer";
    
    const currentData = quizData[currentQuestionIndex];
    
    // UI Layout Updates
    currentNumberSpan.innerText = currentQuestionIndex + 1;
    questionText.innerText = currentData.question;
    
    // Updates horizontal status progress indicator strip width
    const progressPercent = ((currentQuestionIndex + 1) / quizData.length) * 100;
    progressFill.style.width = `${progressPercent}%`;
    
    // Empty out options generated on previous turn
    optionsContainer.innerHTML = "";
    
    // Create new element selection item list
    currentData.options.forEach((option, index) => {
        const button = document.createElement("button");
        button.classList.add("option-btn");
        button.innerText = option;
        
        // Captures user event directly from listeners to route coordinates accurately
        button.addEventListener("click", (event) => selectOption(index, button, event));
        optionsContainer.appendChild(button);
    });
}

// Manages highlighting state adjustments when users make option selections
function selectOption(index, clickedButton, event) {
    selectedOptionIndex = index;
    
    // Clear old active selection styles
    const allButtons = optionsContainer.querySelectorAll(".option-btn");
    allButtons.forEach(btn => btn.classList.remove("selected"));
    
    // Set clicked item active
    clickedButton.classList.add("selected");
    
    // Enable game progression navigation button
    nextButton.disabled = false;
    nextButton.innerText = currentQuestionIndex === quizData.length - 1 ? "Finish Game 🏁" : "Next Question ➡️";

    // --- INTERACTIVE TRICK POPUP TRIGGER ENGINE ---
    const currentData = quizData[currentQuestionIndex];
    if (currentData.correct === "any") {
        // 1. Create the popup element container dynamically
        const popup = document.createElement("div");
        popup.classList.add("trick-popup");
        popup.innerText = "Trick Question! Every answer is right! ❤️";
        
        // 2. Map coordinates safely accommodating both mobile tap touches and standard mouse actions
        const clientX = event.clientX || (event.touches && event.touches[0].clientX);
        const clientY = event.clientY || (event.touches && event.touches[0].clientY);

        popup.style.left = `${clientX}px`;
        popup.style.top = `${clientY}px`;
        
        // 3. Mount item into current document active view
        document.body.appendChild(popup);
        
        // 4. Automatically sweep element away once css animation finishes running
        setTimeout(() => {
            popup.remove();
        }, 2000);
    }
}

// Logic flow evaluation execution triggers on key action clicks
nextButton.addEventListener("click", () => {
    const currentCorrectAnswer = quizData[currentQuestionIndex].correct;

    // Checks condition logic allowing "any" tags or perfect number matches to add score tallies
    if (currentCorrectAnswer === "any" || selectedOptionIndex === currentCorrectAnswer) {
        score++;
    }
    
    currentQuestionIndex++;
    
    // Determine whether to swap layouts or load incoming context cards
    if (currentQuestionIndex < quizData.length) {
        loadQuestion();
    } else {
        showResults();
    }
});

// Structural layout block swapping display controls upon conclusion
function showResults() {
    gameBox.classList.add("hidden");
    resultsBox.classList.remove("hidden");
    finalScoreSpan.innerText = `${score} out of ${quizData.length}`;
    
    // --- CONDITION EVALUATION FOR SHOWING THE GIF ---
    if (score >= 4) {
        feedbackText.innerText = "Yesss, U are my Queen 👑✨❤️";
        
        // Open the container tracking viewport visibility switch frame tags
        videoContainer.classList.remove("hidden");
    } else {
        // If score is low, guarantee elements stay safely locked hidden away out of sight
        videoContainer.classList.add("hidden");
        feedbackText.innerText = "You scored less...🌹";
    }
}

// Reset functions reverting data arrays back to clean standard initial state values
restartButton.addEventListener("click", () => {
    currentQuestionIndex = 0;
    score = 0;
    
    // Hide the GIF container safely on reset without throwing video playback errors
    videoContainer.classList.add("hidden");
    
    resultsBox.classList.add("hidden");
    gameBox.classList.remove("hidden");
    loadQuestion();
});

// Run bootstrap initialization script commands
loadQuestion();