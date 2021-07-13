// Set the configuration for your app
const config = {
  apiKey: "AIzaSyBjoRL9kjfr_kDvf9xbLvT6SaNjX2Up_pU",
  authDomain: "white-elephant-9ca35.firebaseapp.com",
  projectId: "white-elephant-9ca35",
  storageBucket: "white-elephant-9ca35.appspot.com",
  messagingSenderId: "493805772908",
  appId: "1:493805772908:web:54fde79dca20911dc73849",
  measurementId: "G-4W9CHXR9CN"
};

firebase.initializeApp(config);

// Get a reference to the database service
const db = firebase.database();

/**
 * Function that counts player's name's remaining characters
 * @param {int} playerNameLength 
 * @param {element} element containing counter 
 */
function updateCounter(playerNameLength, counter){
  var maxLength = 12;

  counter.textContent = maxLength-playerNameLength;
};

/** 
 * Function that validate player's name
 * @param {element} playerName element containing player's name
 * @param {element} errorMessage element containing error message  
*/
function validatePlayerName(playerName, errorMessage) {
  // Define regular expression: No starting and trailing spaces or empty playerName
  var regex = /^(?! )[\u0020-\u007E]+(?<! )$/;

  // This should be separated into a different function
  // If the playerName is valid, remove the error messsage
  if(regex.test(playerName.value)){
    errorMessage.value = false;
    errorMessage.textContent = "";

  // Else, print out the appropriate errorMessage
  } else {
    errorMessage.value = true;

    if (playerName.value.length > 0) {
      if (playerName.value[0] === " " || playerName.value[playerName.value.length-1] === " ") {
        errorMessage.textContent = "Invalid name: Please no spaces at the start or the end";
      } else {
        errorMessage.textContent = "Invalid name";
      }
    } else {
      errorMessage.textContent = "Please enter a name";
    }
  }
};

/**
 * Function that create a new player for the game
 * @param {string} gameCode 
 * @param {string} playerName 
 * @param {function} callBack asynchronous call back function 
 */
function createNewPlayer(gameCode, playerName, callBack){
  var gameRef = db.ref("game/" + gameCode);
  gameRef.child("order").once("value", (snapshot) => {
    var playerID;
    
    // generate unique player ID/Order
    do{
      playerID = Math.floor(Math.random()*10000);
    } while(snapshot.child(playerID).exists());

    // add new player
    gameRef.child("players/" + playerName).set({
      name: playerName,
      order: playerID
    }).then(() => {
      // add player to order list
      gameRef.child("order/"+ playerID).set({
        name: playerName,
        done: false
      }).then(callBack(playerID));

    });
  });
  

};

/**
 * Function that creates a unique game code
 * @param {function} callBack asynchronous call back function
 */
function createUniqueGameCode(callBack){
  // Retrieve a snapshot of all existing games in the database
  db.ref("game/").once("value", (snapshot) => {
    var gameCode;

    // Generate unique game code
    do {
      gameCode = Math.floor(10000*Math.random());
    } while(snapshot.child(gameCode).exists());

    // Return game code
    callBack(gameCode);
  });
};

/**
 * Function that creates a new game
 * @param {string} playerName 
 */
function createNewGame(playerName){
  // Generate unique game code, then...
  createUniqueGameCode((gameCode) => {
    // Modify URL
    createNewPlayer(gameCode, playerName, (playerID) =>{
      window.location.href = "./WaitingRoom.html"+"?playerName="+playerID+"&game="+gameCode;
    });
    
  });
};
