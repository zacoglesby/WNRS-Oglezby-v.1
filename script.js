document.addEventListener('DOMContentLoaded', function () {
    console.log("Script loaded successfully!");

    /** ============================
     *  INDEX.HTML - LANDING PAGE
     *  ============================ */
    const startButton = document.getElementById("startButton");
    
    if (startButton) {
        startButton.addEventListener("click", function () {
            console.log("Start button clicked!");
            window.location.href = "main.html";
        });
        return; // Stop execution for index.html
    }

    /** ============================
     *  MAIN.HTML - GAME SETUP PAGE
     *  ============================ */
    const gameTitle = document.getElementById('gameTitle');
    if (!gameTitle) return;

    console.log("Loading gameplay setup...");

    const urlParams = new URLSearchParams(window.location.search);
    const selectedDeck = urlParams.get('deck');
    const gameMode = urlParams.get('mode');
    const players = JSON.parse(decodeURIComponent(urlParams.get('players') || "[]"));

    gameTitle.textContent = `We Are Not Really Strangers (${selectedDeck}) - (${gameMode})`;

    let currentTurnIndex = 0;
    let shuffledPlayers = [...players].sort(() => Math.random() - 0.5);
    let questions = [];

    /** ============================
     *  UPDATE TURN DISPLAY
     *  ============================ */
    function updateCurrentTurn() {
        const currentPlayer = shuffledPlayers[currentTurnIndex % shuffledPlayers.length];
        const currentPlayerElement = document.getElementById('currentPlayer');

        if (currentPlayerElement) {
            currentPlayerElement.textContent = `Current Turn: ${currentPlayer}`;
            currentPlayerElement.style.textAlign = "center"; // Centering the text
            currentPlayerElement.style.fontSize = "1.5em";  // Make it stand out
            currentPlayerElement.style.fontWeight = "bold"; // Make it bold
        }
    }

    /** ============================
     *  FETCH QUESTIONS FROM GOOGLE SHEETS
     *  ============================ */
    async function loadQuestions() {
        const SHEET_ID = '1FE3h7OaeX7eZtTEE5-8uQe3yFNaKtHsN-itlOUUa5FA';
        const API_KEY = 'AIzaSyC8tdrYfi3zAu6A5cLrUd3xNUG4jxTdcn0';
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${selectedDeck}!A2:B?key=${API_KEY}`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data.values && data.values.length > 0) {
                questions = data.values.map(row => ({
                    level: row[0],
                    question: row[1]
                }));
                showNextQuestion();
            } else {
                document.getElementById('cardQuestion').textContent = "No questions found.";
            }
        } catch (error) {
            console.error("Error fetching questions:", error);
            document.getElementById('cardQuestion').textContent = "Failed to load questions.";
        }
    }

    /** ============================
     *  SHOW NEXT QUESTION (SEQUENTIAL)
     *  ============================ */
    function showNextQuestion() {
        if (questions.length > 0) {
            const currentQuestion = questions[currentTurnIndex % questions.length];
            document.getElementById('cardLevel').textContent = `Level ${currentQuestion.level}`;
            document.getElementById('cardQuestion').textContent = currentQuestion.question;
        } else {
            document.getElementById('cardQuestion').textContent = "No questions available.";
        }
    }

    /** ============================
     *  SHOW RANDOM QUESTION
     *  ============================ */
    function showRandomQuestion() {
        if (questions.length > 0) {
            const randomIndex = Math.floor(Math.random() * questions.length);
            const currentQuestion = questions[randomIndex];
            document.getElementById('cardLevel').textContent = `Level ${currentQuestion.level}`;
            document.getElementById('cardQuestion').textContent = currentQuestion.question;
        } else {
            document.getElementById('cardQuestion').textContent = "No questions available.";
        }
    }

    /** ============================
     *  BUTTON EVENT LISTENERS
     *  ============================ */
    document.getElementById('nextTurnBtn')?.addEventListener('click', function () {
        console.log("Next Turn clicked");
        currentTurnIndex++;
        updateCurrentTurn();
        showNextQuestion();
    });

    document.getElementById('randomQuestionBtn')?.addEventListener('click', function () {
        console.log("Randomize Question clicked");
        showRandomQuestion();
    });

    document.getElementById('endGameBtn')?.addEventListener('click', function () {
        console.log("End Game clicked");
        document.getElementById('endGamePopup').classList.remove('hidden');
    });

    document.getElementById('confirmEndGame')?.addEventListener('click', function () {
        console.log("Confirmed End Game");
        window.location.href = "index.html";
    });

    document.getElementById('cancelEndGame')?.addEventListener('click', function () {
        console.log("Cancelled End Game");
        document.getElementById('endGamePopup').classList.add('hidden');
    });

    /** ============================
     *  INITIALIZATION
     *  ============================ */
    updateCurrentTurn();
    loadQuestions();
});

