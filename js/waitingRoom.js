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
  var ref = db.ref("game");

  ref.once("value").then(function(snapshot){
    var hasCode = snapshot.child(c).exists();
    //console.log(hasCode);
    return hasCode;
  });
};


function writeNewPlayer(c, n){
  let orderNum = Math.floor(Math.random()*10000);
  db.ref().child("game/" + c +"/players/" + n).set({
    name: n,
    giftReceived: "",
    order: orderNum
  });
};

function addPlayerToList(pn){
  var list = document.getElementById("playerList");
  var items = list.getElementsByTagName("li");
  console.log(pn);
  for( var i = 0;i < items.length; ++i ){
    if(items[i].innerText == pn){
      return;
    }
  }
  var item = document.createElement("li");
  item.appendChild(document.createTextNode(pn));
  list.appendChild(item);
};


window.addEventListener("load", (event) => {
  var sp = location.search.substring(1).split("&");
  var temp = sp[0].split("=");
  //console.log(temp);
  var temp2 = sp[1].split("=");
  //console.log(temp2);

  if(temp[0] == "playerName"){
    var code = temp2[1];
    var hostName = temp[1];
  }
  else {
    var code = temp[1];
    var hostName = temp2[1];
  }

  var rc = document.getElementById("roomCode");
  var rctxt = "Room Code: " + code;//window.location.href;
  var rctn = document.createTextNode(rctxt)
  rc.appendChild(rctn); 
  writeNewPlayer(code, hostName);
  //add host to player list

  var ref = db.ref("game/"+code).child("players");
  console.log(ref.toString());
  ref.on("value", (snapshot) => {
    //console.log("inside on");
    //var players = snapshot.val();
    //console.log(players);
    snapshot.forEach((childSnapshot) => {
      var key = childSnapshot.key;
      //var value = childSnapshot.val();
      //console.log(key);
      //console.log(value.name);
      addPlayerToList(key);
    });
  });
  
  let rs = document.getElementById("startWrap");
  rs.addEventListener("click", (event) => {
    window.location.href = "./PrepareGift1.html"+location.search.substring();  
  });
});

