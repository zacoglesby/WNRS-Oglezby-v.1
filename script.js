document.addEventListener('DOMContentLoaded', function () {
    // Ensure the button exists before adding the event listener
    const startButton = document.getElementById("startButton");

    if (startButton) {
        startButton.addEventListener("click", function() {
            window.location.href = "main.html";  // Redirect to main page
        });
    }

    // Google Sheets data fetch
    const SHEET_ID = '1FE3h7OaeX7eZtTEE5-8uQe3yFNaKtHsN-itlOUUa5FA';
    const API_KEY = 'AIzaSyC8tdrYfi3zAu6A5cLrUd3xNUG4jxTdcn0';
    const selectDeck = document.getElementById('deckSelect');

    if (selectDeck) {
        async function loadDecks() {
            try {
                const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}?fields=sheets(properties(title))&key=${API_KEY}`;
                const response = await fetch(url);
                
                if (!response.ok) {
                    throw new Error(`Failed to fetch deck list (Status: ${response.status})`);
                }

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
                    alert('No decks available. Please check the spreadsheet.');
                }
            } catch (error) {
                console.error('Error loading decks:', error);
                alert('Error loading decks. Please check your internet connection or API key.');
            }
        }
        loadDecks();
    }

    // Handle player input fields
    const playerCountInput = document.getElementById('playerCount');
    const playerInputsContainer = document.getElementById('playerInputs');

    if (playerCountInput && playerInputsContainer) {
        playerCountInput.addEventListener('input', function () {
            const playerCount = parseInt(this.value);
            playerInputsContainer.innerHTML = '';

            if (playerCount >= 2 && playerCount <= 6) {
                for (let i = 1; i <= playerCount; i++) {
                    let input = document.createElement('input');
                    input.type = 'text';
                    input.placeholder = `Player ${i} Name`;
                    input.required = true;
                    input.classList.add('player-name-input');
                    playerInputsContainer.appendChild(input);
                }
            }
        });
    }

    // Game mode selection logic
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
    const confirmationPopup = document.getElementById('confirmationPopup');
    const confirmDetails = document.getElementById('confirmDetails');

    if (startGameBtn && confirmationPopup && confirmDetails) {
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

            confirmationPopup.classList.remove('hidden');
            confirmDetails.innerHTML = `
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

    // Cancel confirmation popup
    const cancelStartBtn = document.getElementById('cancelStart');
    if (cancelStartBtn) {
        cancelStartBtn.addEventListener('click', function () {
            confirmationPopup.classList.add('hidden');
        });
    }
});

