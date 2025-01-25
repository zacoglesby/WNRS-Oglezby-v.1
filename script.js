const sheetId = '1FE3h7OaeX7eZtTEE5-8uQe3yFNaKtHsN-itlOUUa5FA';
const sheetName = 'WNRS';  // Your sheet name
const apiKey = 'AIzaSyC8tdrYfi3zAu6A5cLrUd3xNUG4jxTdcn0';

async function fetchDecks() {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}!A:C?key=${apiKey}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        const rows = data.values.slice(1); // Skip header row

        let deckMap = {};
        rows.forEach(row => {
            const [deckName, cardLevel, question] = row;
            if (!deckMap[deckName]) {
                deckMap[deckName] = { "1": [], "2": [], "3": [] };
            }
            deckMap[deckName][cardLevel].push(question);
        });

        return deckMap;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

async function startGame() {
    document.getElementById('intro').style.display = 'none';
    document.getElementById('game-container').style.display = 'block';

    const decks = await fetchDecks();
    const deckSelect = document.getElementById('deck-select');
    deckSelect.innerHTML = '';

    for (let deck in decks) {
        let option = document.createElement('option');
        option.value = deck;
        option.textContent = deck;
        deckSelect.appendChild(option);
    }
}

// Global Variables
let currentDeck = {};
let turnIndex = 0;
let players = [];

async function displayCard(deck, level = null, random = false) {
    const decks = await fetchDecks();
    currentDeck = decks[deck];
    let questions = [];

    if (level) {
        questions = currentDeck[level];
    } else {
        for (let lvl in currentDeck) {
            questions = questions.concat(currentDeck[lvl]);
        }
    }

    let question = questions[random ? Math.floor(Math.random() * questions.length) : 0];
    document.getElementById('card-level').textContent = `Level ${level || 'Random'}`;
    document.getElementById('card-question').textContent = question;
}

function setupPlayers() {
    const playerCount = document.getElementById('player-count').value;
    let playerContainer = document.getElementById('player-names');
    playerContainer.innerHTML = '';
    players = [];

    for (let i = 0; i < playerCount; i++) {
        let input = document.createElement('input');
        input.type = 'text';
        input.placeholder = `Player ${i + 1}`;
        input.onchange = () => players[i] = input.value;
        playerContainer.appendChild(input);
    }
}

function nextTurn() {
    if (players.length === 0) {
        alert('Please enter player names.');
        return;
    }
    turnIndex = (turnIndex + 1) % players.length;
    document.getElementById('turn-order').textContent = `Current turn: ${players[turnIndex]}`;
    displayCard(document.getElementById('deck-select').value);
}

function confirmEndGame() {
    document.getElementById('end-game-popup').style.display = 'block';
}

function endGame() {
    alert('Game Over');
    location.reload();
}

function cancelEndGame() {
    document.getElementById('end-game-popup').style.display = 'none';
}

// Game Modes
function playTraditional() {
    const selectedDeck = document.getElementById('deck-select').value;
    displayCard(selectedDeck, "1");
}

function playRandom() {
    const selectedDeck = document.getElementById('deck-select').value;
    displayCard(selectedDeck, null, true);
}

function playCustom() {
    alert("In Custom Mode, players will choose the next card manually.");
    nextTurn();
}

