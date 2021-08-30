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
 * Function that counts input text box's remaining characters
 * @param {int} inputLength current inout text length
 * @param {int} maxLength max characters that an input text box can have
 * @param {element} element containing counter 
 */
function updateCounter(inputLength, maxLength, counter){
  counter.textContent = maxLength-inputLength;
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
      errorMessage.textContent = "";
    }
  }
};

/**
 * Function that create a new player for the game
 * @param {string} gameCode 
 * @param {string} playerName 
 * @param {boolean} hostStatus indicts if the player is the host or not
 * @param {function} callBack asynchronous call back function 
 */
function createNewPlayer(gameCode, playerName, hostStatus, callBack){
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
      order: playerID,
      host: hostStatus 
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
    var gameRef = db.ref("game/" + gameCode);
    gameRef.child("status").set({
      start: false,
      firstPerson: false,
      done: false
    });
    // Modify URL
    createNewPlayer(gameCode, playerName, true, (playerID) =>{
      window.location.href = "./WaitingRoom.html"+"?playerName="+playerID+"&game="+gameCode;
    });
  });
};

/**
 * Function that extracts the gameCode from the URL
 */
function getGameCode() {
  // Extract query string from URL
  let queryString = location.search.substring(1).split("&");

  // Get gameCode from query string
  let gameCodeQuery = queryString[1].split("=");

  // Return gameCode
  return gameCodeQuery[1];
}

/**
 * Function that extracts the playerName from the URL
 * @param {function} callBack asynchronous call back function
 */
function getPlayerName(callBack) {
  // Extract query string from URL
  let queryString = location.search.substring(1).split("&");

  // Get gameCode from query string
  let gameCodeQuery = queryString[1].split("=");

  // Get playerID from query string
  let playerIDQuery = queryString[0].split("=");

  // Get playerName from the database
  db.ref("game/" + gameCodeQuery[1]).child("players").orderByChild("order").equalTo(Number(playerIDQuery[1])).once("value", (snapshot) => {
    snapshot.forEach((data) => {
      // Return playerName
      callBack(data.key);
    });
  });
}

/**
 * Function that returns player's hosting status
 * @param {function} callBack asynchronous call back function
 */
function getPlayerHostingStatus(gameCode, playerName, callBack) {
  db.ref("game/"+gameCode+"/players/"+playerName).child("host").once("value", (snapshot) => {
    callBack(snapshot.val());
  });
}

/**
 * Function that gets a player's gift code
 * @param {function} callBack asynchronous call back function
 */
function getPlayerGiftCode(gameCode, playerName, callBack) {
  // Get playerGiftCode from the database
  db.ref("game/" + gameCode).child("gift").orderByChild("name").equalTo(playerName).once("value", (snapshot) => {
    snapshot.forEach((data) => {
      // Return playerGiftCode
      callBack(data.key);
    });
  });
}

/**
 * Function that adds an item to a list
 * @param {element} list element
 * @param {string} item textContent
 * @param {object} item style
 */
 function addItemToList(list, textContent, style){
  // Create item element
  var item = document.createElement("li");

  // Set item text content
  item.textContent = textContent;

  // Define item style
  Object.assign(item.style, style);

  // Append item to list
  list.appendChild(item);
};