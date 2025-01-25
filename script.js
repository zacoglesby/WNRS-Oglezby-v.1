document.addEventListener('DOMContentLoaded', function () {
    // Constants
    const SHEET_ID = '1FE3h7OaeX7eZtTEE5-8uQe3yFNaKtHsN-itlOUUa5FA';
    const API_KEY = 'AIzaSyC8tdrYfi3zAu6A5cLrUd3xNUG4jxTdcn0';

    // Handle game setup
    const urlParams = new URLSearchParams(window.location.search);
    const selectedDeck = urlParams.get('deck');
    const gameMode = urlParams.get('mode');
    const players = JSON.parse(decodeURIComponent(urlParams.get('players') || '[]'));

    if (selectedDeck && gameMode && players.length > 0) {
        document.getElementById('gameTitle').textContent = `We Are Not Really Strangers (${selectedDeck}) - (${gameMode})`;
        const turnOrderList = document.getElementById('turnOrderList');

        function updateTurnOrder() {
            turnOrderList.innerHTML = '';
            players.forEach((player, index) => {
                const listItem = document.createElement('li');
                listItem.textContent = index === currentTurnIndex ? `→ ${player} (Your Turn)` : player;
                turnOrderList.appendChild(listItem);
            });
        }

        let currentTurnIndex = 0;
        updateTurnOrder();

        async function loadQuestions() {
            const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${selectedDeck}?key=${API_KEY}`;
            const response = await fetch(url);
            const data = await response.json();
            if (data.values) showNextQuestion(data.values.slice(1));
        }

        function showNextQuestion(questions) {
            const [level, question] = questions[currentTurnIndex % questions.length];
            document.getElementById('cardLevel').textContent = `Level ${level}`;
            document.getElementById('cardQuestion').textContent = question;
            currentTurnIndex++;
            updateTurnOrder();
        }

        document.getElementById('nextTurnBtn').addEventListener('click', loadQuestions);
        document.getElementById('endGameBtn').addEventListener('click', () => document.getElementById('endGamePopup').classList.remove('hidden'));
        document.getElementById('confirmEndGame').addEventListener('click', () => window.location.href = "index.html");
        document.getElementById('cancelEndGame').addEventListener('click', () => document.getElementById('endGamePopup').classList.add('hidden'));

        loadQuestions();
    }

    // Start button redirection
    const startButton = document.getElementById("startButton");
    if (startButton) {
        startButton.addEventListener("click", function () {
            window.location.href = "main.html";
        });
    }

    // Load deck options
    const selectDeck = document.getElementById('deckSelect');
    if (selectDeck) {
        async function loadDecks() {
            const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}?fields=sheets(properties(title))&key=${API_KEY}`;
            const response = await fetch(url);
            const data = await response.json();
            data.sheets?.forEach(sheet => {
                let option = document.createElement('option');
                option.value = option.textContent = sheet.properties.title;
                selectDeck.appendChild(option);
            });
        }
        loadDecks();
    }

    // Player input handling
    const playerCountInput = document.getElementById('playerCount');
    const playerInputsContainer = document.getElementById('playerInputs');
    if (playerCountInput && playerInputsContainer) {
        playerCountInput.addEventListener('input', function () {
            playerInputsContainer.innerHTML = '';
            for (let i = 1; i <= this.value; i++) {
                let input = document.createElement('input');
                input.type = 'text';
                input.placeholder = `Player ${i} Name`;
                input.required = true;
                playerInputsContainer.appendChild(input);
            }
        });
    }

    // Game mode selection
    let selectedMode = '';
    document.getElementById('traditionalMode')?.addEventListener('click', () => selectedMode = 'Traditional Mode');
    document.getElementById('randomizedMode')?.addEventListener('click', () => selectedMode = 'Randomized Mode');

    // Start game button logic
    document.getElementById('startGameBtn')?.addEventListener('click', function () {
        const deckChoice = selectDeck.value;
        const playerNames = [...document.querySelectorAll('#playerInputs input')].map(input => input.value.trim()).filter(Boolean);
        if (!deckChoice || playerNames.length === 0 || selectedMode === '') {
            alert('Please complete all selections!');
            return;
        }
        document.getElementById('confirmationPopup').classList.remove('hidden');
        document.getElementById('confirmDetails').innerHTML = `<strong>Deck:</strong> ${deckChoice} <br> <strong>Mode:</strong> ${selectedMode} <br> <strong>Players:</strong> ${playerNames.join(', ')}`;

        document.getElementById('confirmStart').addEventListener('click', () => {
            window.location.href = `gameplay.html?deck=${encodeURIComponent(deckChoice)}&mode=${encodeURIComponent(selectedMode)}&players=${encodeURIComponent(JSON.stringify(playerNames))}`;
        });
    });

    // Cancel confirmation popup
    document.getElementById('cancelStart')?.addEventListener('click', () => document.getElementById('confirmationPopup').classList.add('hidden'));
});


