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

// Get a reference to the database 
var db = firebase.database();

function checkValidPasscode(c){
  var ref = db.ref("game");

  ref.once("value").then(function(snapshot){
    var hasCode = snapshot.child(c).exists();
    console.log(hasCode);
    return hasCode;
  });
  //return false;
};

function checkValidPlayerName(n, c){
  var ref = db.ref("game/"+c).child("players");
  ref.on("value", (snapshot) => {
    var hasName = snapshot.child(n).exists();
    console.log("player: " + hasName);
    return hasName;
  });
};

function checkValid(n, c){
  var ref = db.ref("game");
  
  ref.once("value").then(function(snapshot){
    var code = snapshot.child(c);
    var hasCode = code.exists();
    console.log(hasCode);
    if(hasCode){
      var name = db.ref("game/"+c+"/players").get(n);
      console.log(name);
    }
  });
};
let rs = document.getElementById("roomSubmit");
rs.addEventListener("click", (event) => {
  //check if the code is valid
  let code = document.getElementById("gameCode").value;
  let name = document.getElementById("playerName").value;
  if(checkValidPasscode(code)){
    if(!checkValidPlayerName(name)){
      let paramsString = "?playerName=" + name + "&game=" + code;
      document.location.search = paramsString;
      window.location.href = "./WaitingRoom.html"+paramsString;
    }

  } 
    let paramsString = "?playerName=" + name + "&game=" + code;
    document.location.search = paramsString;
    //console.log(paramsString);
    window.location.href = "./WaitingRoom.html"+paramsString;  

});