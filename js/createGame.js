// Set the configuration for your app
// TODO: Replace with your project's config object
var config = {
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
var db = firebase.database();

function checkValidPasscode(c){
  console.log("checking code");
  var ref = db.ref("game/");
  ref.once("value").then(function(snapshot){
    var hasCode = snapshot.child(c).exists();
    console.log(c+ " " + hasCode);
    return hasCode;
  });
  return false;
};

// This function generate a random 4-digits passcode
// need to add 0's in front if >= 3 digits in the html
function generatePasscode(){  
  let passcode = Math.floor(Math.random()*10000);
  
  //check if it is an unqiue passcode
  let x = checkValidPasscode(passcode);
  console.log(x);

  return passcode.toString();
};

function sendNewGame(code, name){;
/*   console.log("sending data to firebase");
  console.log(code);
  console.log(name); */
  
  //let newGame = db.ref().push(); //this is for unique links
  //console.log(newGame.key);
  let newGame = db.ref().child("game/" + code +"/players/" + name);
  newGame.set({
    giftDescription: "asdf",
    giftLink: "asdf",
    numSteal: 0,
    giftReceived: "asdf"
  })
  console.log("sended");
  return code;
};

// This function create a new game instance
function createGame(){

  //check if the generated passcode already exist or not
  let code = generatePasscode();

  //get hostname from the form
  let name = document.getElementById("playerName").value;
  let  gc = document.getElementById("gameCode");
  //console.log("before gc is " + gc.value + "!");
  //add game UID to Firebase

  var i = sendNewGame(code, name);
  //console.log("done");
  //console.log(code);
  //console.log(name);
  //console.log(url);   
  
  checkValidPasscode(i);

  //add game code to url
  
  gc.value = i;
  console.log(" after x is " + gc.value);
  return code;
};

let rs = document.getElementById("roomSubmit");
rs.addEventListener("click", (event) => {
  let x = createGame();
  let y = document.getElementById("playerName").value;
  let paramsString = "?playerName=" + y + "&game=" + x;
  //document.location.search = paramsString;
  //console.log(paramsString);
  window.location.href = "./WaitingRoom.html"+paramsString;
});