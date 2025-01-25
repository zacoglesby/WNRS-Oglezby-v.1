// Fetch Google Sheets data
const SHEET_ID = '1FE3h7OaeX7eZtTEE5-8uQe3yFNaKtHsN-itlOUUa5FA';
const API_KEY = 'AIzaSyC8tdrYfi3zAu6A5cLrUd3xNUG4jxTdcn0';
const selectDeck = document.getElementById('deckSelect');

// Load deck options from Google Sheets
async function loadDecks() {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/A1:A?key=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.values) {
        data.values.forEach(row => {
            let option = document.createElement('option');
            option.value = row[0];
            option.textContent = row[0];
            selectDeck.appendChild(option);
        });
    }
}

loadDecks();

// Handle player input fields
document.getElementById('playerCount').addEventListener('input', function () {
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

// Game mode selection
let selectedMode = '';

document.getElementById('traditionalMode').addEventListener('click', () => {
    selectedMode = 'Traditional Mode';
    alert('You selected Traditional Mode');
});

document.getElementById('randomizedMode').addEventListener('click', () => {
    selectedMode = 'Randomized Mode';
    alert('You selected Randomized Mode');
});

// Start Game button logic
document.getElementById('startGameBtn').addEventListener('click', function () {
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

// Popup buttons
document.getElementById('confirmStart').addEventListener('click', function () {
    window.location.href = "gameplay.html";
});

document.getElementById('cancelStart').addEventListener('click', function () {
    document.getElementById('confirmationPopup').classList.add('hidden');
});

// Start button on landing page
document.getElementById("startButton").addEventListener("click", function() {
    window.location.href = "main.html";  // Redirect to main page
});
