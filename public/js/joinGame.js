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
  // Get gameCode element
  var gameCode = document.getElementById("gameCode").value;

  // Get playerName element
  var playerName = document.getElementById("playerName").value;
  
  // Get errorMessage element
  var errorMessage = document.getElementById("errorMessage");
  
  // If player name is valid...
  if (errorMessage.value == false) {
    // Retrieve a snapshot of all existing games in the database
    db.ref("game").ref.once("value", (snapshot) => {
      // If the game code exists...
      if(gameCode !== "" && snapshot.child(gameCode).exists()){
        // Retrieve a snapshot of all existing players in the database
        db.ref("game").child(gameCode+"/players").once("value", (childSnapshot) =>{
          // If a player with the same name already exists...
          if(childSnapshot.child(playerName).exists()){
            window.alert("This name is already taken! Please choose another name.");
          } else{
            createNewPlayer(gameCode, playerName, false, (playerID) =>{
              // Modify URL
              document.location.search = "?playerName="+playerName+"&game="+gameCode;
              window.location.href = "./WaitingRoom.html"+"?playerName="+playerID+"&game="+gameCode;
            });
          }
        });
      } else{
        window.alert("Invaild Code! Please enter a vaild game code.")
      }
    });
  } else {
    window.alert("Invalid Name! Please enter a valid name.");
  }
});