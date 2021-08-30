// Handle submission
var handleSubmit = () => {
  // Get playerName element
  var playerName = document.getElementById("playerName").value;

  // Get errorMessage element
  var errorMessage = document.getElementById("errorMessage");

  // If player name is valid...
  if (errorMessage.value == false) {
    // Create new game
    createNewGame(playerName);
  } else {
    window.alert("Invalid Name! Please enter a valid name.");
  }
}

// Get playerName element
const playerName = document.getElementById("playerName");

// Handle playerName element input event
playerName.addEventListener("input", (event) => {
  // Prevent default error messages from popping up
  event.preventDefault();

  // Get counter element
  var counter = document.getElementById("counter");

  // Update counter
  updateCounter(playerName.value.length, counter);

  // Get errorMessage element
  var errorMessage = document.getElementById("errorMessage");

  // Validate player name
  validatePlayerName(playerName, errorMessage);
});

// Handle playerName element enter input event
playerName.addEventListener("keydown", (event) => {
  if (event.key == "Enter") {
    // Prevent default error messages from popping up
    event.preventDefault();

    handleSubmit();
  }
});

// Get roomSubmit element
var roomSubmit = document.getElementById("roomSubmit");

// Handle roomSubmit element click event
roomSubmit.addEventListener("click", handleSubmit);