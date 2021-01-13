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

function addPlayerToList(pn){
  var list = document.getElementById("playerOrder");
  var item = document.createElement("li");
  item.appendChild(document.createTextNode(pn));
  item.style.fontWeight = "bolder";
  list.appendChild(item);
};

function addDonePlayerToList(pn){
  var list = document.getElementById("playerOrder");
  var item = document.createElement("li");
  item.appendChild(document.createTextNode(pn));
  item.style.fontWeight = "lighter";
  list.appendChild(item);
};

function addOrderList(code){
  var ref = db.ref("game/"+code).child("order");
  ref.once("value", (snapshot) => {
    snapshot.forEach((childSnapshot) => {
      var key = childSnapshot.child("name").val();
      var d = childSnapshot.child("done").val();
      if(d){
        addDonePlayerToList(key);
      } else {
        addPlayerToList(key);
      }
    });
  });
}

function getCurrentPlayer(code){
  var ref = db.ref("game/"+code).child("order");
  var currPlayer = "";
  ref.once("value", (snapshot) => {
    var curr = false;
    snapshot.forEach((childSnapshot) => {
      var key = childSnapshot.child("name").val();
      var d = childSnapshot.child("done").val();
      if(!d && !curr){
        var n = document.getElementById("currName");
        n.appendChild(document.createTextNode(key));
        curr = true;
        currPlayer = key;
      }
    });
  });
  return currPlayer;
}

function selectGift(){
  let {code, name} = getUserData();
  var ref = db.ref("game/"+code).child("gift");
  ref.once("value", (snapshot) =>{
    //get selected gift info
  });
  var update = {};
  //update gift owner
  update["/owner"] = name;
  //update steal counter
  //update open status
  update["/openStatus"] = true;
}

function addGiftIconToTable(code){
  var table = document.getElementById("giftTable");
  var tr = document.createElement("tr");
  var ref = db.ref("game/"+code).child("gift");
  ref.once("value", (snapshot) => {
    snapshot.forEach((childSnapshot) => {
      var item = document.createElement("td");
      var img = document.createElement("img");
      var numSteal = childSnapshot.child("numStealLeft").val();
        if(numSteal <= 0){
          img.src = "./images/unavailable present.png";
          img.alt = "unavailable present";

        } else {
          img.src = "./images/blueboxredribbon.png";
          img.alt = "Blue gift box with red ribbon";
        }
      img.class="responsive_gift";
      item.appendChild(img);
      tr.appendChild(item);

      img.addEventListener("click", (event) =>{
        //window.alert("testing");

      });
    });
  });
  table.appendChild(tr);
}

function addGiftStealNumToTable(code){
  var table = document.getElementById("giftTable");
  var tr = document.createElement("tr");
  var ref = db.ref("game/"+code).child("gift");
  ref.once("value", (snapshot) => {
    snapshot.forEach((childSnapshot) => {
      var numSteal = childSnapshot.child("numStealLeft").val();
      var open = childSnapshot.child("openStatus").val();
      var strings = "";
      var item = document.createElement("td");
      if(open){
        if(numSteal <= 0){
          strings = "No steals left!";
        } else if(numSteal == 1){
          strings = "1 steal left!"; 
        } else {
          strings = numSteal + " steals left!";
        }
      }
      item.appendChild(document.createTextNode(strings));
      tr.appendChild(item);
    });
  });
  table.appendChild(tr);
}

function addGiftOwnerToTable(code){
  var table = document.getElementById("giftTable");
  var tr = document.createElement("tr");
  var ref = db.ref("game/"+code).child("gift");
  ref.once("value", (snapshot) => {
    snapshot.forEach((childSnapshot) => {
      var owner = childSnapshot.child("owner").val();
      var open = childSnapshot.child("openStatus").val();
      var item = document.createElement("td");
      var s = "";
      if(open){
        s = owner;
      }
      item.appendChild(document.createTextNode(s));
      tr.appendChild(item);
    });
  });
  table.appendChild(tr);
}

function addOwnGiftToTable(code, name){
  var table = document.getElementById("giftTable");
  var tr = document.createElement("tr");
  var ref = db.ref("game/"+code).child("gift");
  ref.once("value", (snapshot) => {
    snapshot.forEach((childSnapshot) => {
      var key = childSnapshot.key;
      var item = document.createElement("td");
      if(key == name){
        item.appendChild(document.createTextNode("This is from you!"));
      } else {
        item.appendChild(document.createTextNode(""));
      }
      tr.appendChild(item);
    });
  });
  table.appendChild(tr);
}

function addGiftInfoToTable(code){
  var table = document.getElementById("giftTable");
  var tr = document.createElement("tr");
  var ref = db.ref("game/"+code).child("gift");
  ref.once("value", (snapshot) => {
    snapshot.forEach((childSnapshot) => {
      var open = childSnapshot.child("openStatus").val();
      var des = childSnapshot.child("description").val();
      var link = childSnapshot.child("link").val();
      var item = document.createElement("td");
      if(open){
        var a = document.createElement("a");
        a.appendChild(document.createTextNode(des))
        a.title = des;
        a.href = link;
        item.appendChild(a);
      } else {
        item.appendChild(document.createTextNode(""));
      }
      tr.appendChild(item);
    });
  });
  table.appendChild(tr);
}

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
  return {code, name};
}

window.addEventListener("load", (event) => {
  let {code, name} = getUserData();

  getCurrentPlayer(code);
  addOrderList(code);
  addGiftIconToTable(code);
  addOwnGiftToTable(code, name);
  addGiftOwnerToTable(code);
  addGiftInfoToTable(code);
  addGiftStealNumToTable(code);
});

