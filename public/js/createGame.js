// Get playerName node
const playerName = document.getElementById("playerName");

//  Handle playerName node input event
playerName.addEventListener("input", (event) => {
  // Get counter node
  counter = document.getElementById("counter");

  // Update counter
  updateCounter(playerName.value.length, counter);

  // Get errorMessage node
  var errorMessage = document.getElementById("errorMessage");

  // Validate player name
  validatePlayerName(playerName, errorMessage);
});

// Get roomSubmit node
let roomSubmit = document.getElementById("roomSubmit");

// Handle roomSubmit node click event
roomSubmit.addEventListener("click", (event) => {
  let passcode = "";
  //console.log("first: " + passcode);

  var ref = db.ref("game/");
  ref.once("value", (snapshot) => {
    passcode = Math.floor(Math.random()*10000);
    //check if it is an unqiue passcode
    var hasCode = snapshot.child(passcode).exists();
    //console.log(passcode+ " " + hasCode);
    while(hasCode){
      //console.log("inside while - "+ passcode+ " " + hasCode);
      passcode = Math.floor(Math.random()*10000);
      hasCode = snapshot.child(passcode).exists();
      //console.log("new "+ passcode+ " " + hasCode);
    }
    //console.log("final " + passcode);

    //add user & game code to url
    let y = document.getElementById("playerName").value;
    let paramsString = "?playerName=" + y + "&game=" + passcode;
    //document.location.search = paramsString;
    //console.log(paramsString);
    window.location.href = "./WaitingRoom.html"+paramsString;

  });
  
});