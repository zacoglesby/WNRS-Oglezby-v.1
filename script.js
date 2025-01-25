const sheetId = '1FE3h7OaeX7eZtTEE5-8uQe3yFNaKtHsN-itlOUUa5FA';
const sheetName = 'WNRS'; // Change this if sheet names represent individual decks
const apiKey = 'AIzaSyC8tdrYfi3zAu6A5cLrUd3xNUG4jxTdcn0';

// Global Variables
let decks = {};
let currentDeck = {};
let currentMode = '';
let players = [];
let turnIndex = 0;

async function fetchDecks() {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}!A:C?key=${apiKey}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        const rows = data.values.slice(1);

        rows.forEach(row => {
            const [cardLevel, question] = row;
            if (!decks[cardLevel]) {
                decks[cardLevel] = [];
            }
            decks[cardLevel].push(question);
        });

        return decks;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

async function startGame() {
    document.getElementById('intro').style.display = 'none';
    document.getElementById('game-container').style.display = 'block';

    await fetchDecks();
    const deckSelect = document.getElementById('deck-select');
    Object.keys(decks).forEach(deck => {
        const option = document.createElement('option');
        option.value = deck;
        option.textContent = `Deck ${deck}`;
        deckSelect.appendChild(option);
    });
}

function setupPlayers() {
    const playerCount = document.getElementById('player-count').value;
    const playerContainer = document.getElementById('player-names');
    playerContainer.innerHTML = '';
    players = [];

    for (let i = 0; i < playerCount; i++) {
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = `Player ${i + 1}`;
        input.onchange = () => players[i] = input.value;
        playerContainer.appendChild(input);
    }
}

function confirmGameStart() {
    if (!players.length || !players.every(name => name.trim())) {
        alert('Please enter all player names.');
        return;
    }
    const selectedDeck = document.getElementById('deck-select').value;
    currentMode = document.querySelector('button.active')?.id || 'Traditional Mode';
    alert(`Starting game with Deck: ${selectedDeck}, Mode: ${currentMode}`);
    displayCard(selectedDeck, "1");
}

async function displayCard(deck, level = null, random = false) {
    const questions = level ? decks[level] : Object.values(decks).flat();
    const question = random
        ? questions[Math.floor(Math.random() * questions.length)]
        : questions.shift();

    document.getElementById('card-level').textContent = `Level ${level || 'Random'}`;
    document.getElementById('card-question').textContent = question || 'No questions left in this deck.';
}

function nextTurn() {
    turnIndex = (turnIndex + 1) % players.length;
    document.getElementById('turn-order').textContent = `It's ${players[turnIndex]}'s turn!`;
}

function confirmEndGame() {
    document.getElementById('end-game-popup').style.display = 'block';
}

function endGame() {
    alert('Thank you for playing!');
    location.reload();
}

function cancelEndGame() {
    document.getElementById('end-game-popup').style.display = 'none';
}

function playTraditional() {
    currentMode = 'Traditional';
    displayCard(document.getElementById('deck-select').value, "1");
}

function playRandom() {
    currentMode = 'Random';
    displayCard(document.getElementById('deck-select').value, null, true);
}


