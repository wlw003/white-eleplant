// Get playerName element
const playerName = document.getElementById("playerName");

//  Handle playerName element input event
playerName.addEventListener("input", (event) => {
  // Get counter element
  var counter = document.getElementById("counter");

  // Update counter
  updateCounter(playerName.value.length, counter);

  // Get errorMessage element
  var errorMessage = document.getElementById("errorMessage");

  // Validate player name
  validatePlayerName(playerName, errorMessage);
});

// Get roomSubmit element
let roomSubmit = document.getElementById("roomSubmit");

// Handle roomSubmit element click event
roomSubmit.addEventListener("click", (event) => {
  // Get playerName element
  let playerName = document.getElementById("playerName").value;

  // Create new game
  createNewGame(playerName);
});