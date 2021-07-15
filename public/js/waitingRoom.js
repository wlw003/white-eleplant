/**
 * Function that update the page when a new player joins
 */
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

/**
 * Function that adds player's name on a list
 * @param {string} playerName
 */
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

/**
 * Function for host player only. It adds a button for the host to click on
 * when the host is ready to start the game. 
 */
function hostEvent(){
  // create a button for the html
  var section = document.getElementById("CTA");
  var button = document.createElement("button");
  button.appendChild(document.createTextNode("Start Wrapping!"));
  section.appendChild(button);

  // make the button clickable
  button.addEventListener("click", (event) => {
    // Retrieve a snapshot of all existing players in the current game
    db.ref("game/"+gameCode).child("players").on("value", (snapshot) => {
      // If the game has more more than one participant, allow the game to proceed
      if(snapshot.numChildren() > 1) {

        // update game start status to true
        db.ref("game/"+gameCode).child("status").update({
          start: true
        }).then(()=>{
          // go to the next page
          window.location.href = "./PrepareGift1.html"+location.search.substring();
        });
      }
    });
  });
};

/**
 * Function for non-host players. It has a text message instead of a button and
 * gets automatically redirected to the next page when the host has started the
 * game.
 */
function nonHostEvent(){
  // creates the text message
  var section = document.getElementById("CTA");
  var h2 = document.createElement("h2");
  var text = document.createTextNode("Hang in tight, we are waiting for more people to join…");
  h2.appendChild(text);
  section.appendChild(h2);

  // check when the host has start the game
  db.ref("game/"+gameCode).child("status").on("value", (snapshot) =>{
    var startStatus = snapshot.child("start").val();

    // go to the next page if host has started the game
    if(startStatus){
      window.location.href = "./PrepareGift1.html"+location.search.substring();
    }
  });
}

// Get the game code
var gameCode = getGameCode();

// Check if the player is hosting
getPlayerName((playerName) =>{
  
  db.ref("game/"+gameCode+"/players/"+playerName).child("host").once("value", (snapshot) =>{
    hostingStatus = snapshot.val();

    if(hostingStatus){
      // Host player can click on the start button
      hostEvent();
    } else {
      // waiting for the host player to start the game
      nonHostEvent();
    }
  });
});


