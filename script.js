document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const selectedDeck = urlParams.get('deck');
    const gameMode = urlParams.get('mode');
    const players = JSON.parse(decodeURIComponent(urlParams.get('players')));

    document.getElementById('gameTitle').textContent = `We Are Not Really Strangers (${selectedDeck}) - (${gameMode})`;

    let currentTurnIndex = 0;
    let shuffledPlayers = [];

    function shufflePlayers(array) {
        return array.sort(() => Math.random() - 0.5);
    }

    function updateCurrentTurn() {
        const currentPlayer = shuffledPlayers[currentTurnIndex % shuffledPlayers.length];
        document.getElementById('currentPlayer').textContent = currentPlayer;
    }

    function initializeTurnOrder() {
        shuffledPlayers = shufflePlayers(players);
        updateCurrentTurn();
    }

    function nextTurn() {
        currentTurnIndex++;
        updateCurrentTurn();
        showNextQuestion();
    }

    async function loadQuestions() {
        const SHEET_ID = '1FE3h7OaeX7eZtTEE5-8uQe3yFNaKtHsN-itlOUUa5FA';
        const API_KEY = 'AIzaSyC8tdrYfi3zAu6A5cLrUd3xNUG4jxTdcn0';
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values:batchGet?ranges=${selectedDeck}!A2:B&key=${API_KEY}`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data.valueRanges && data.valueRanges[0].values.length > 0) {
                questions = data.valueRanges[0].values.map(row => ({
                    level: row[0],  
                    question: row[1]
                }));
                showNextQuestion();
            } else {
                document.getElementById('cardQuestion').textContent = "Error: No questions found.";
            }
        } catch (error) {
            console.error("Error fetching questions:", error);
            document.getElementById('cardQuestion').textContent = "Failed to load questions.";
        }
    }

    function showNextQuestion() {
        if (questions.length > 0) {
            const currentQuestion = questions[currentTurnIndex % questions.length];
            document.getElementById('cardLevel').textContent = `Level ${currentQuestion.level}`;
            document.getElementById('cardQuestion').textContent = currentQuestion.question;
        } else {
            document.getElementById('cardQuestion').textContent = "No questions available.";
        }
    }

    document.getElementById('nextTurnBtn').addEventListener('click', nextTurn);
    document.getElementById('endGameBtn').addEventListener('click', () => {
        document.getElementById('endGamePopup').classList.remove('hidden');
    });

    document.getElementById('confirmEndGame').addEventListener('click', () => {
        window.location.href = "index.html";
    });

    document.getElementById('cancelEndGame').addEventListener('click', () => {
        document.getElementById('endGamePopup').classList.add('hidden');
    });

    loadQuestions();
    initializeTurnOrder();
});
