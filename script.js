const defaultGridSize = 10;
const defaultMaxSelections = 10;
let gridSize = defaultGridSize;
let maxSelections = defaultMaxSelections;
let selections = 0;
let tokensWon = 0;
let correctGuesses = 0;
let winProbability = 0.15; // Set default probability to 15%
const developerPassphrase = "dev"; // Change passphrase to "dev"

// Elements
const kenoGrid = document.getElementById('kenoGrid');
const tokensLabel = document.getElementById('tokensWon');
const resetBtn = document.getElementById('resetBtn');
const modal = document.getElementById('developerModal');
const developerPassphraseModal = document.getElementById('developerPassphraseModal');
const passphraseInput = document.getElementById('passphraseInput');
const submitPassphraseBtn = document.getElementById('submitPassphrase');
const closeModalBtns = document.querySelectorAll('.close');
const probabilityInput = document.getElementById('probabilityInput');
const gridSizeInput = document.getElementById('gridSizeInput');
const maxSelectionsInput = document.getElementById('maxSelectionsInput');
const applySettingsBtn = document.getElementById('applySettings');
const popup = document.getElementById('popup');
const finalMessage = document.getElementById('finalMessage');

// Generate the Keno grid
function createGrid() {
    kenoGrid.innerHTML = ''; // Clear previous grid
    const itemSize = 50; // Size of each grid item
    kenoGrid.style.gridTemplateColumns = `repeat(${gridSize}, ${itemSize}px)`; // Update grid columns based on grid size
    for (let i = 0; i < gridSize * gridSize; i++) {
        const gridItem = document.createElement('div');
        gridItem.classList.add('grid-item');
        gridItem.addEventListener('click', () => checkGuess(gridItem));
        kenoGrid.appendChild(gridItem);
    }
}

// Check if the guess is correct based on probability
function checkGuess(gridItem) {
    if (selections >= maxSelections) {
        resetGame(); // If the game is over, reset the game
        return; // Exit the function
    }

    selections++;
    if (Math.random() < winProbability) { // Adjust probability check
        gridItem.style.backgroundColor = 'green';
        gridItem.textContent = '✔';
        correctGuesses++;
    } else {
        gridItem.style.backgroundColor = 'red';
        gridItem.textContent = '✘';
    }
    gridItem.classList.add('disabled');

    if (selections === maxSelections) {
        showFinalPopup();
    } else {
        updateTokensWon();
    }
}

// Update the tokens won
function updateTokensWon() {
    tokensWon = correctGuesses;
    tokensLabel.textContent = `Tokens Won: ${tokensWon}`;
}

// Show final popup after max selections
function showFinalPopup() {
    finalMessage.textContent = `You won ${tokensWon} tokens!`;
    popup.style.display = 'block';
}

// Close the winning popup
document.getElementById('closePopupWinning').addEventListener('click', function() {
    popup.style.display = "none"; // Hide the winning popup
});

// Reset the game
function resetGame() {
    tokensWon = 0;
    correctGuesses = 0;
    selections = 0;
    tokensLabel.textContent = "Tokens Won: 0";
    popup.style.display = "none"; // Hide popup
    createGrid(); // Recreate the grid
}

// Open the developer passphrase modal
function openDeveloperMode() {
    developerPassphraseModal.style.display = "block";
    passphraseInput.value = ''; // Clear passphrase input
    passphraseInput.focus(); // Focus on the passphrase input
}

// Handle closing of the developer modal and probability modal
closeModalBtns.forEach(btn => {
    btn.onclick = () => {
        developerPassphraseModal.style.display = "none"; // Hide passphrase modal
        modal.style.display = "none"; // Hide probability modal if it's open
    };
});

// Handle passphrase submission
submitPassphraseBtn.onclick = () => {
    if (passphraseInput.value === developerPassphrase) {
        openProbabilityModal(); // Open the probability modal on correct passphrase
    } else {
        alert("Incorrect passphrase!");
    }
};

// Open the probability modal
function openProbabilityModal() {
    developerPassphraseModal.style.display = "none"; // Close passphrase modal
    modal.style.display = "block";
    probabilityInput.value = winProbability * 100; // Set the current probability value in percentage
    gridSizeInput.value = gridSize; // Set the current grid size
    maxSelectionsInput.value = maxSelections; // Set the current max selections
    probabilityInput.focus(); // Focus on the probability input
}

// Apply the new win probability, grid size, and max selections
function applySettings() {
    const newProb = parseFloat(probabilityInput.value);
    const newGridSize = parseInt(gridSizeInput.value);
    const newMaxSelections = parseInt(maxSelectionsInput.value);

    if (newProb >= 0 && newProb <= 100) {
        winProbability = newProb / 100; // Adjusting to a fraction for calculations
    } else {
        alert("Please enter a valid probability between 0 and 100");
    }

    if (newGridSize >= 1 && newGridSize <= 20) {
        gridSize = newGridSize;
        createGrid(); // Recreate grid with new size
    } else {
        alert("Please enter a valid grid size between 1 and 20");
    }

    if (newMaxSelections >= 1 && newMaxSelections <= 20) {
        maxSelections = newMaxSelections;
    } else {
        alert("Please enter a valid max selections between 1 and 20");
    }

    modal.style.display = "none"; // Close the modal
}

// Keyboard shortcuts and input handling
document.addEventListener('keydown', (event) => {
    if (event.ctrlKey && event.key === 'd') {
        openDeveloperMode(); // Open developer mode
    }
    if (event.key === 'Enter') {
        if (developerPassphraseModal.style.display === "block") {
            submitPassphraseBtn.click(); // Trigger passphrase submission
        } else if (modal.style.display === "block") {
            applySettings(); // Apply new settings
        }
    }
    if (event.key === 'Escape') {
        if (popup.style.display === "block") {
            popup.style.display = "none"; // Hide winning popup
        } else if (developerPassphraseModal.style.display === "block") {
            developerPassphraseModal.style.display = "none"; // Hide passphrase modal
        } else if (modal.style.display === "block") {
            modal.style.display = "none"; // Hide probability modal
        }
    }
});

// Reset button click
resetBtn.addEventListener('click', resetGame);
applySettingsBtn.addEventListener('click', applySettings);

// Initialize the grid on page load
createGrid();
