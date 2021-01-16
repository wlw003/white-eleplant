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

function getUserData(){
  var sp = location.search.substring(1).split("&");
  var temp = sp[0].split("=");
  //console.log(temp);
  var temp2 = sp[1].split("=");
  //console.log(temp2);
  var code = "";
  var name = "";
  if(temp[0] == "playerName"){
    code = temp2[1];
    name = temp[1];
  }
  else {
    code = temp[1];
    name = temp2[1];
  }
  console.log("code is "+ code + " & name is "+ name);
  return {code, name};
}

let ud = getUserData();
let code = ud.code;
let pname = ud.name;
var stealBtn = document.getElementById("steal");
var keepBtn = document.getElementById("keep");

var ref = db.ref("game/"+code);
ref.child("order").limitToFirst(1).once("value", (snapshot) => {
  snapshot.forEach((childSnapshot)=>{
    var n = childSnapshot.child("name").val();
    var currName = document.getElementById("currName");
    currName.appendChild(document.createTextNode(n));
    console.log(n);
  });
});

function stealGift(c){
  //console.log("steal");
  var ref = db.ref("game/"+c);
  var cp = document.getElementById("currName").innerText;
  var updates = {};
  ref.once("value", (snapshot) =>{
    //change first person done status to false
    var order = snapshot.child("players/"+cp+"/order").val();
    updates["order/"+order+"/done"] = false;
    //update history
    var newKey = ref.child("history").push().key;
    updates["history/"+newKey] = "First person is stealing";
    ref.child("firstPersonEvent").set(true);
    ref.update(updates);
  });
  //go to choosing gift page
  //window.location.href = "./choosingGift.html"+location.search.substring();
}

function keepGift(c){
  console.log("keep");
  //update history to end game
  var ref = db.ref("game/"+c);
  var updates = {};
  var newKey = ref.child("history").push().key;
  updates["history/"+newKey] = "End Game";
  ref.update(updates);
  //go to end page
  //window.location.href = "./endgame.html"+location.search.substring();
}


//make gift icon clickable only for current player
var currPlayer = document.getElementById("currName");
const observer = new MutationObserver(function(){
  console.log('callback that runs when observer is triggered');
  console.log(currPlayer.innerText);
  if(currPlayer.innerText == pname){
    console.log("same");
    stealBtn.addEventListener("click", function(){
      stealGift(code);
    });
    keepBtn.addEventListener("click", function(){
      keepGift(code);
    });
  }
});
observer.observe(currPlayer, {subtree: true, childList: true});

//have everyone else go to the next page when first person acts
ref.child("history").limitToLast(1).on("value", (snapshot) =>{
  console.log(snapshot.val());
  snapshot.forEach((childSnapshot)=>{
    var string = childSnapshot.val();
    console.log(string)
    if(string == "First person is stealing"){
      console.log("stealing gift");
      window.location.href = "./choosingGift.html"+location.search.substring();
    } else if(string == "End Game"){
      console.log("ending game");
      window.location.href = "./endgame.html"+location.search.substring();
    }
  });
});