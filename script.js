document.addEventListener('DOMContentLoaded', function () {
    const SHEET_ID = '1FE3h7OaeX7eZtTEE5-8uQe3yFNaKtHsN-itlOUUa5FA';
    const API_KEY = 'AIzaSyC8tdrYfi3zAu6A5cLrUd3xNUG4jxTdcn0';

    const urlParams = new URLSearchParams(window.location.search);
    const selectedDeck = urlParams.get('deck');
    const gameMode = urlParams.get('mode');
    const players = JSON.parse(decodeURIComponent(urlParams.get('players') || '[]'));

    if (selectedDeck && gameMode && players.length > 0) {
        document.getElementById('gameTitle').textContent = `We Are Not Really Strangers (${selectedDeck}) - (${gameMode})`;
        let currentTurnIndex = 0;
        let questions = [];

        function updateTurnOrder() {
            const turnOrderList = document.getElementById('turnOrderList');
            turnOrderList.innerHTML = '';
            players.forEach((player, index) => {
                const listItem = document.createElement('li');
                if (index === currentTurnIndex % players.length) {
                    listItem.innerHTML = `→ <strong>${player} (Your Turn)</strong>`;
                } else {
                    listItem.textContent = player;
                }
                turnOrderList.appendChild(listItem);
            });
        }

        async function loadQuestions() {
            const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${selectedDeck}?key=${API_KEY}`;
            try {
                const response = await fetch(url);
                const data = await response.json();
                if (data.values && data.values.length > 1) {
                    questions = data.values.slice(1).map(row => row[1]);
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
                document.getElementById('cardLevel').textContent = `Level ${Math.floor(Math.random() * 3) + 1}`;
                document.getElementById('cardQuestion').textContent = questions[currentTurnIndex % questions.length];
                currentTurnIndex++;
                updateTurnOrder();
            } else {
                document.getElementById('cardQuestion').textContent = "No questions available.";
            }
        }

        document.getElementById('nextTurnBtn').addEventListener('click', showNextQuestion);
        document.getElementById('endGameBtn').addEventListener('click', () => document.getElementById('endGamePopup').classList.remove('hidden'));
        document.getElementById('confirmEndGame').addEventListener('click', () => window.location.href = "index.html");
        document.getElementById('cancelEndGame').addEventListener('click', () => document.getElementById('endGamePopup').classList.add('hidden'));

        loadQuestions();
        updateTurnOrder();
    }
});


