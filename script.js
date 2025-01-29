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
        return;
    }

    /** ============================
     *  MAIN.HTML - GAME SETUP PAGE
     *  ============================ */
    const selectDeck = document.getElementById('deckSelect');
    const playerCountInput = document.getElementById('playerCount');
    const playerInputsContainer = document.getElementById('playerInputs');
    let selectedMode = "";
    let playerNames = [];

    if (selectDeck) {
        console.log("Main page detected. Fetching decks...");

        async function loadDecks() {
            const SHEET_ID = '1FE3h7OaeX7eZtTEE5-8uQe3yFNaKtHsN-itlOUUa5FA';
            const API_KEY = 'AIzaSyC8tdrYfi3zAu6A5cLrUd3xNUG4jxTdcn0';
            const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}?fields=sheets(properties(title))&key=${API_KEY}`;

            try {
                const response = await fetch(url);
                const data = await response.json();
                console.log("Fetched deck data:", data);

                if (data.sheets) {
                    selectDeck.innerHTML = `<option value="" disabled selected>Select a deck</option>`;
                    data.sheets.forEach(sheet => {
                        let option = document.createElement('option');
                        option.value = sheet.properties.title;
                        option.textContent = sheet.properties.title;
                        selectDeck.appendChild(option);
                    });
                } else {
                    console.error("No decks found.");
                }
            } catch (error) {
                console.error("Error fetching decks:", error);
            }
        }
        loadDecks();
    }

    /** ============================
     *  HANDLE PLAYER INPUT FIELDS
     *  ============================ */
    if (playerCountInput) {
        playerCountInput.addEventListener('input', function () {
            const playerCount = parseInt(this.value);
            playerInputsContainer.innerHTML = "";

            if (playerCount >= 2 && playerCount <= 6) {
                playerNames = [];
                for (let i = 1; i <= playerCount; i++) {
                    let input = document.createElement('input');
                    input.type = "text";
                    input.placeholder = `Player ${i} Name`;
                    input.required = true;
                    input.addEventListener("input", function () {
                        playerNames[i - 1] = this.value.trim();
                    });
                    playerInputsContainer.appendChild(input);
                }
            }
        });
    }

    /** ============================
     *  GAME MODE SELECTION
     *  ============================ */
    document.getElementById('traditionalMode')?.addEventListener('click', () => {
        selectedMode = "Traditional Mode";
        alert("You selected Traditional Mode");
    });

    document.getElementById('randomizedMode')?.addEventListener('click', () => {
        selectedMode = "Randomized Mode";
        alert("You selected Randomized Mode");
    });

    /** ============================
     *  START GAME BUTTON FUNCTIONALITY
     *  ============================ */
    document.getElementById('startGameBtn')?.addEventListener('click', function () {
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

        document.getElementById('confirmStart')?.addEventListener('click', function () {
            const queryString = `gameplay.html?deck=${encodeURIComponent(deckChoice)}&mode=${encodeURIComponent(selectedMode)}&players=${encodeURIComponent(JSON.stringify(playerNames))}`;
            window.location.href = queryString;
        });
    });

    document.getElementById('cancelStart')?.addEventListener('click', function () {
        document.getElementById('confirmationPopup').classList.add('hidden');
    });
});

