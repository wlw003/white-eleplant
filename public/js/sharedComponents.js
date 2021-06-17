// Set the configuration for your app
// TODO: Replace with your project's config object
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

//  Count player names remaining characters
function countCharactersRemaining(playerNameLength, counter){
  var maxLength = 12;

  counter.textContent = maxLength-playerNameLength;
};

//  Validate player names
function validateName(name, errorMessage) {
  var regex = /[\u0021-\u007E][\u0020-\u007E]*[\u0021-\u007E]$/;

  //  This should be separated into a different function
  if(regex.test(name)){
    errorMessage.textContent = "";
  } else {
    if (input.value.length > 0) {
      if (input.value[0] === " " || input.value[input.value.length-1] === " ") {
        errorMessage.textContent = "Invalid name: Please spaces at the start or the end";
      } else {
        errorMessage.textContent = "Invalid name";
      }
    } else {
      errorMessage.textContent = "Please enter a name";
    }
  }
};