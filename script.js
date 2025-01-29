document.addEventListener('DOMContentLoaded', function () {
    /** ============================
     *  INDEX.HTML - LANDING PAGE
     *  ============================ */
    const startButton = document.getElementById("startButton");
    if (startButton) {
        startButton.addEventListener("click", function () {
            window.location.href = "main.html";  // Redirect to main page
        });
        return; // Stop further execution if on index.html
    }

    /** ============================
     *  MAIN.HTML - GAME SETUP PAGE
     *  ============================ */
    const selectDeck = document.getElementById('deckSelect');
    const playerCountInput = document.getElementById('playerCount');
    let selectedMode = '';
    let playerNames = [];

    if (selectDeck) {
        async function loadDecks() {
            try {
                const SHEET_ID = '1FE3h7OaeX7eZtTEE5-8uQe3yFNaKtHsN-itlOUUa5FA';
                const API_KEY = 'AIzaSyC8tdrYfi3zAu6A5cLrUd3xNUG4jxTdcn0';
                const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}?fields=sheets(properties(title))&key=${API_KEY}`;

                const response = await fetch(url);
                const data = await response.json();

                if (data.sheets) {
                    data.sheets.forEach(sheet => {
                        let option = document.createElement('option');
                        option.value = sheet.properties.title;
                        option.textContent = sheet.properties.title;
                        selectDeck.appendChild(option);
                    });
                } else {
                    console.error('No sheets found.');
                }
            } catch (error) {
                console.error('Error loading decks:', error);
            }
        }
        loadDecks();
    }

    if (playerCountInput) {
        playerCountInput.addEventListener('input', function () {
            let playerCount = parseInt(this.value);
            let playerInputs = document.getElementById('playerInputs');
            playerInputs.innerHTML = '';

            if (playerCount >= 2 && playerCount <= 6) {
                playerNames = [];
                for (let i = 1; i <= playerCount; i++) {
                    let input = document.createElement('input');
                    input.type = 'text';
                    input.placeholder = `Player ${i} Name`;
                    input.addEventListener('input', function () {
                        playerNames[i - 1] = this.value.trim();
                    });
                    playerInputs.appendChild(input);
                }
            }
        });
    }

    if (document.getElementById('traditionalMode')) {
        document.getElementById('traditionalMode').addEventListener('click', () => {
            selectedMode = 'Traditional Mode';
            alert('You selected Traditional Mode');
        });
    }

    if (document.getElementById('randomizedMode')) {
        document.getElementById('randomizedMode').addEventListener('click', () => {
            selectedMode = 'Randomized Mode';
            alert('You selected Randomized Mode');
        });
    }

    if (document.getElementById('startGameBtn')) {
        document.getElementById('startGameBtn').addEventListener('click', function () {
            const deckChoice = selectDeck.value;
            if (!deckChoice || playerNames.length === 0 || selectedMode === '') {
                alert('Please complete all selections!');
                return;
            }

            document.getElementById('confirmationPopup').classList.remove('hidden');
            document.getElementById('confirmDetails').innerHTML = `
                <strong>Deck:</strong> ${deckChoice} <br>
                <strong>Mode:</strong> ${selectedMode} <br>
                <strong>Players:</strong> ${playerNames.join(', ')}
            `;

            document.getElementById('confirmStart').addEventListener('click', function () {
                const queryString = `gameplay.html?deck=${encodeURIComponent(deckChoice)}&mode=${encodeURIComponent(selectedMode)}&players=${encodeURIComponent(JSON.stringify(playerNames))}`;
                window.location.href = queryString;
            });
        });
    }

    if (document.getElementById('cancelStart')) {
        document.getElementById('cancelStart').addEventListener('click', function () {
            document.getElementById('confirmationPopup').classList.add('hidden');
        });
    }

    /** ============================
     *  GAMEPLAY.HTML - GAME SCREEN
     *  ============================ */
    const gameTitle = document.getElementById('gameTitle');
    if (!gameTitle) {
        return; // Stop execution if not on gameplay.html
    }

    const urlParams = new URLSearchParams(window.location.search);
    const selectedDeck = urlParams.get('deck');
    const gameMode = urlParams.get('mode');
    const players = JSON.parse(decodeURIComponent(urlParams.get('players') || "[]"));

    gameTitle.textContent = `We Are Not Really Strangers (${selectedDeck}) - (${gameMode})`;

    let currentTurnIndex = 0;
    let shuffledPlayers = players.sort(() => Math.random() - 0.5);

    function updateCurrentTurn() {
        const currentPlayer = shuffledPlayers[currentTurnIndex % shuffledPlayers.length];
        document.getElementById('currentPlayer').textContent = `Current Turn: ${currentPlayer}`;
    }

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

    function showNextQuestion() {
        if (questions.length > 0) {
            const currentQuestion = questions[currentTurnIndex % questions.length];
            document.getElementById('cardLevel').textContent = `Level ${currentQuestion.level}`;
            document.getElementById('cardQuestion').textContent = currentQuestion.question;
        } else {
            document.getElementById('cardQuestion').textContent = "No questions available.";
        }
    }

    document.getElementById('nextTurnBtn')?.addEventListener('click', function () {
        currentTurnIndex++;
        updateCurrentTurn();
        showNextQuestion();
    });

    document.getElementById('endGameBtn')?.addEventListener('click', function () {
        document.getElementById('endGamePopup').classList.remove('hidden');
    });

    document.getElementById('confirmEndGame')?.addEventListener('click', function () {
        window.location.href = "index.html";
    });

    document.getElementById('cancelEndGame')?.addEventListener('click', function () {
        document.getElementById('endGamePopup').classList.add('hidden');
    });

    updateCurrentTurn();
    loadQuestions();
});

