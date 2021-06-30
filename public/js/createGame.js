// Get playerName element
const playerName = document.getElementById("playerName");

// Handle playerName element input event
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
var roomSubmit = document.getElementById("roomSubmit");

// Handle roomSubmit element click event
roomSubmit.addEventListener("click", (event) => {
  // Get playerName element
  var playerName = document.getElementById("playerName").value;

  // Get errorMessage element
  var errorMessage = document.getElementById("errorMessage");

  // If player name is valid...
  if (errorMessage.textContent == "") {
    // Create new game
    createNewGame(playerName);
  } else {
    window.alert("Invalid Name! Please enter a vaild name.");
  }
});