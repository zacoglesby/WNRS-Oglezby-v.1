const sheetId = '1FE3h7OaeX7eZtTEE5-8uQe3yFNaKtHsN-itlOUUa5FA/edit?gid=0#gid=0';
const apiKey = 'AIzaSyC8tdrYfi3zAu6A5cLrUd3xNUG4jxTdcn0';

async function fetchDecks() {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Card Decks?key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    const rows = data.values.slice(1);

    let deckMap = {};
    rows.forEach(row => {
        const [deckName, cardLevel, question] = row;
        if (!deckMap[deckName]) {
            deckMap[deckName] = { "1": [], "2": [], "3": [] };
        }
        deckMap[deckName][cardLevel].push(question);
    });
    return deckMap;
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

function playTraditional() {
    const selectedDeck = document.getElementById('deck-select').value;
    displayCard(selectedDeck, "1");
}

function playRandom() {
    const selectedDeck = document.getElementById('deck-select').value;
    displayCard(selectedDeck, null, true);
}

async function displayCard(deck, level = null, random = false) {
    const decks = await fetchDecks();
    let questions = [];

    if (level) {
        questions = decks[deck][level];
    } else {
        for (let lvl in decks[deck]) {
            questions = questions.concat(decks[deck][lvl]);
        }
    }

    let question = questions[random ? Math.floor(Math.random() * questions.length) : 0];
    document.getElementById('card-output').textContent = question;
}