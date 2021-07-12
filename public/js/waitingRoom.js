function updateDisplay() {
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
    // For every player participating in the current game...
    snapshot.forEach((player) => {
      // Add player to playerList
      addPlayerToList(player.key);
    });
  });
};

function getGameCode() {
  // Extract query string from URL
  let queryString = location.search.substring(1).split("&");

  // Get gameCode from query string
  let gameCodeQuery = queryString[1].split("=");

  // Return gameCode
  return gameCodeQuery[1];
}

function addPlayerToList(playerName){
  // Get playerList element
  var list = document.getElementById("playerList");

  // Append playerName to playerList
  var item = document.createElement("li");
  item.appendChild(document.createTextNode(playerName));
  list.appendChild(item);
};

window.addEventListener("load", (event) => {
  updateDisplay();
});

// Get startWrap element
var startWrap = document.getElementById("startWrap");

// Handle startWrap element click event
startWrap.addEventListener("click", (event) => {
  var gameCode = getGameCode();

  // Retrieve a snapshot of all existing players in the current game
  db.ref("game/"+gameCode).child("players").on("value", (snapshot) => {
    // If the game has more more than one participant, allow the game to proceed
    if(snapshot.numChildren() > 1) {
      window.location.href = "./PrepareGift1.html"+location.search.substring();
    }
  });
});