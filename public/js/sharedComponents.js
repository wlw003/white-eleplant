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
 * @param {element} element containing player's name
 * @param {element} element containing error message  
*/
function validatePlayerName(playerName, errorMessage) {
  // Define regular expression: No starting and trailing spaces or empty playerName
  var regex = /^(?! )[\u0020-\u007E]+(?<! )$/;

  // This should be separated into a different function
  // If the playerName is valid, remove the error messsage
  if(regex.test(playerName.value)){
    errorMessage.textContent = "";

  // Else, print out the appropriate errorMessage
  } else {
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