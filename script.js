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
        return; // Stop further execution for index.html
    }

    /** ============================
     *  MAIN.HTML - GAME SETUP PAGE
     *  ============================ */
    const selectDeck = document.getElementById('deckSelect');
    if (selectDeck) {
        async function loadDecks() {
            const SHEET_ID = '1FE3h7OaeX7eZtTEE5-8uQe3yFNaKtHsN-itlOUUa5FA';
            const API_KEY = 'AIzaSyC8tdrYfi3zAu6A5cLrUd3xNUG4jxTdcn0';
            const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}?fields=sheets(properties(title))&key=${API_KEY}`;

            try {
                const response = await fetch(url);
                const data = await response.json();

                if (data.sheets) {
                    console.log("Decks retrieved:", data.sheets);
                    selectDeck.innerHTML = `<option value="" disabled selected>Select a deck</option>`; // Reset options
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

    /** ============================
     *  DYNAMIC PLAYER INPUT FIELDS
     *  ============================ */
    const playerCountInput = document.getElementById('playerCount');
    const playerInputsContainer = document.getElementById('playerInputs');

    if (playerCountInput && playerInputsContainer) {
        playerCountInput.addEventListener('input', function () {
            const playerCount = parseInt(this.value);
            playerInputsContainer.innerHTML = ''; // Clear previous inputs

            if (playerCount >= 2 && playerCount <= 6) {
                for (let i = 1; i <= playerCount; i++) {
                    let input = document.createElement('input');
                    input.type = 'text';
                    input.placeholder = `Player ${i} Name`;
                    input.classList.add('player-name-input'); // Add class for styling
                    playerInputsContainer.appendChild(input);
                }
            }
        });
    }

    /** ============================
     *  GAME MODE SELECTION
     *  ============================ */
    let selectedMode = '';
    
    document.getElementById('traditionalMode')?.addEventListener('click', () => {
        selectedMode = 'Traditional Mode';
        alert('You selected Traditional Mode');
    });

    document.getElementById('randomizedMode')?.addEventListener('click', () => {
        selectedMode = 'Randomized Mode';
        alert('You selected Randomized Mode');
    });

    /** ============================
     *  START GAME BUTTON LOGIC
     *  ============================ */
    const startGameBtn = document.getElementById('startGameBtn');
    if (startGameBtn) {
        startGameBtn.addEventListener('click', function () {
            const deckChoice = selectDeck.value;
            const playerInputs = document.querySelectorAll('.player-name-input');
            let playerNames = [];

            playerInputs.forEach(input => {
                if (input.value.trim() !== '') {
                    playerNames.push(input.value.trim());
                }
            });

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

    document.getElementById('cancelStart')?.addEventListener('click', function () {
        document.getElementById('confirmationPopup').classList.add('hidden');
    });
});
