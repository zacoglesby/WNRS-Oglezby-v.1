document.addEventListener('DOMContentLoaded', function () {
    // Ensure the button exists before adding the event listener
    const startButton = document.getElementById("startButton");

    if (startButton) {
        startButton.addEventListener("click", function() {
            window.location.href = "main.html";  // Redirect to main page
        });
    }

    // Fetch Google Sheets data
    const SHEET_ID = '1FE3h7OaeX7eZtTEE5-8uQe3yFNaKtHsN-itlOUUa5FA';
    const API_KEY = 'AIzaSyC8tdrYfi3zAu6A5cLrUd3xNUG4jxTdcn0';
    const selectDeck = document.getElementById('deckSelect');

    if (selectDeck) {
        async function loadDecks() {
            try {
                // Fetch metadata to get sheet names
                const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}?key=${API_KEY}`;
                const response = await fetch(url);
                const data = await response.json();

                if (data.sheets) {
                    data.sheets.forEach(sheet => {
                        let option = document.createElement('option');
                        option.value = sheet.properties.title;  // Use sheet title as value
                        option.textContent = sheet.properties.title;  // Display sheet name
                        selectDeck.appendChild(option);
                    });
                } else {
                    console.error('No sheets found in the spreadsheet.');
                }
            } catch (error) {
                console.error('Error loading decks:', error);
            }
        }
        loadDecks();
    }

    // Handle player input fields
    const playerCountInput = document.getElementById('playerCount');
    if (playerCountInput) {
        playerCountInput.addEventListener('input', function () {
            let playerCount = parseInt(this.value);
            let playerInputs = document.getElementById('playerInputs');
            playerInputs.innerHTML = '';

            if (playerCount >= 2 && playerCount <= 6) {
                for (let i = 1; i <= playerCount; i++) {
                    let input = document.createElement('input');
                    input.type = 'text';
                    input.placeholder = `Player ${i} Name`;
                    playerInputs.appendChild(input);
                }
            }
        });
    }

    // Game mode selection
    let selectedMode = '';

    const traditionalModeBtn = document.getElementById('traditionalMode');
    if (traditionalModeBtn) {
        traditionalModeBtn.addEventListener('click', () => {
            selectedMode = 'Traditional Mode';
            alert('You selected Traditional Mode');
        });
    }

    const randomizedModeBtn = document.getElementById('randomizedMode');
    if (randomizedModeBtn) {
        randomizedModeBtn.addEventListener('click', () => {
            selectedMode = 'Randomized Mode';
            alert('You selected Randomized Mode');
        });
    }

    // Start Game button logic
    const startGameBtn = document.getElementById('startGameBtn');
    if (startGameBtn) {
        startGameBtn.addEventListener('click', function () {
            const deckChoice = selectDeck.value;
            const playerInputs = document.querySelectorAll('#playerInputs input');
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
        });
    }

    // Popup buttons
    const confirmStartBtn = document.getElementById('confirmStart');
    if (confirmStartBtn) {
        confirmStartBtn.addEventListener('click', function () {
            window.location.href = "gameplay.html";
        });
    }

    const cancelStartBtn = document.getElementById('cancelStart');
    if (cancelStartBtn) {
        cancelStartBtn.addEventListener('click', function () {
            document.getElementById('confirmationPopup').classList.add('hidden');
        });
    }
});
