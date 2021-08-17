/**
 * Function that updates the page when a new player joins
 */
function updateDisplay(isHost) {
  // Get gameCode
  var gameCode = getGameCode();

  // Get roomCode element and display roomCode
  let roomCode = document.getElementById("roomCode");
  roomCode.innerText = "Room Code: " + gameCode;

  // Retrieve a snapshot of all existing players in the current game
  db.ref("game/"+gameCode).child("players").on("value", (snapshot) => {
    // Get playerList element
    var list = document.getElementById("playerList");

    // Clear playerList
    while (list.firstChild) {
      list.removeChild(list.lastChild);
    }

    // Update playerList
    snapshot.forEach((player) => {
      // Add player to playerList
      addPlayerToList(player.key, list);
    });

    // If the player is the host and there is more than one player in the game...
    if (isHost && snapshot.numChildren() > 1) {
      // Add button to allow host to start the game
      hostEvent(gameCode);
    }
  });
};

window.addEventListener("load", (event) => {
  // Get the game code
  var gameCode = getGameCode();

  getPlayerName((playerName) => {
    getPlayerHostingStatus(gameCode, playerName, (hostingStatus) => {
      if (!hostingStatus) {
        // Redirect players to the next page when the host starts the game
        nonHostEvent(gameCode);
      }

      // Update display based on hosting status
      updateDisplay(hostingStatus);
    });
  });
});

/**
 * Function that adds a button for the host to start the game
 * @param {string} gameCode
 */
function hostEvent(gameCode) {
  // Create button to start the game
  var button = document.createElement("button");
  button.appendChild(document.createTextNode("Start Wrapping!"));

  // Get CTA
  var section = document.getElementById("CTA");

  // Remove wait message
  while (section.firstChild) {
    section.removeChild(section.firstChild);
  }

  // Append start button to CTA
  section.appendChild(button);

  // Handle button click event
  button.addEventListener("click", (event) => {
    // Update gameStarted status in database and redirect to the next page
    db.ref("game/"+gameCode).child("status").update({
      start: true
    }).then(() => {
      window.location.href = "./PrepareGift1.html"+location.search.substring();
    });
  });
};

/**
 * Function that redirects non-hosts to the next page when the game starts
 * @param {string} gameCode
 */
function nonHostEvent(gameCode) {
  // Check if the host started the game
  db.ref("game/"+gameCode).child("status/start").on("value", (snapshot) =>{
    // If the host started the game, redirect to the next page
    if (snapshot.val()){
      window.location.href = "./PrepareGift1.html"+location.search.substring();
    }
  });
}