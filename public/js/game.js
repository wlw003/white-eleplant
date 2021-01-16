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

function addOrderList(c){
  var ref = db.ref("game/"+c).child("order");
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

function getCurrentPlayer(c){
  var ref = db.ref("game/"+c).child("order");
  ref.once("value", (snapshot) => {
    var curr = false;
    snapshot.forEach((childSnapshot) => {
      var key = childSnapshot.child("name").val();
      var d = childSnapshot.child("done").val();
      var currPlayer = "";
      if(!d && !curr){
        var n = document.getElementById("currName");
        n.appendChild(document.createTextNode(key));
        curr = true;
        currPlayer = key;
      }
    });
  });
}

function selectGift(id){
  let {code, name} = getUserData();
  //console.log(id);
  var ref = db.ref("game/"+code);
  var cp = document.getElementById("currName").innerText;
  //console.log(cp);
  var update = {};
  ref.once("value", (snapshot) =>{
    //check if the gift is open or not
    var openStatus = snapshot.child("gift/"+id+"/openStatus").val();
    //console.log("openStatus: "+ openStatus);
    if(openStatus){
      //change the previous owner's openStatus to false
      var prevOwner = snapshot.child("gift/"+id+"/owner").val();
      //console.log(prevOwner);
      var prevOwnerOrder = snapshot.child("players/"+prevOwner+"/order").val();
      update["order/"+prevOwnerOrder+"/done"] = false;
      update["gift/"+id+"/prevOwner"] = prevOwner;
      //console.log(prevOwnerOrder);
      //decrease steal counter
      var currSteal = snapshot.child("gift/"+id+"/numStealLeft").val();
      update["gift/"+id+"/numStealLeft"] = currSteal - 1;
    } else {
      //change openstatus to true
      update["gift/"+id+"/openStatus"] = true;      
    }
    //change done status for current player to true
    var order = snapshot.child("players/"+cp+"/order").val();
    update["order/"+order+"/done"] = true;
    //change owner
    update["gift/"+id+"/owner"] = cp;
    update["order/"+order+"/done"] = true;
    var newKey = ref.child("history").push().key;
    update["history/"+newKey] = {currPlayer: cp, gift: id};
    //console.log(update);
    ref.update(update);
  });
}

function addGiftIconToTable(c){
  var table = document.getElementById("giftTable");
  var tr = document.createElement("tr");
  var ref = db.ref("game/"+c).child("gift");
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
          img.addEventListener("click", (event) =>{
            //window.alert("testing " + event.target.id);
            selectGift(event.target.id);
          }); 
        }
      img.id = childSnapshot.key;
      img.className = "responsive_gift "+ childSnapshot.key;
      item.appendChild(img);
      tr.appendChild(item);
    });
  });
  table.appendChild(tr);
}

function addGiftStealNumToTable(c){
  var table = document.getElementById("giftTable");
  var tr = document.createElement("tr");
  var ref = db.ref("game/"+c).child("gift");
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
      item.className = childSnapshot.key;
      tr.appendChild(item);
    });
  });
  table.appendChild(tr);
}

function addGiftOwnerToTable(c){
  var table = document.getElementById("giftTable");
  var tr = document.createElement("tr");
  var ref = db.ref("game/"+c).child("gift");
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
      item.className = childSnapshot.key;
      tr.appendChild(item);
    });
  });
  table.appendChild(tr);
}

function addOwnGiftToTable(c, pn){
  var table = document.getElementById("giftTable");
  var tr = document.createElement("tr");
  var ref = db.ref("game/"+c).child("gift");
  ref.once("value", (snapshot) => {
    snapshot.forEach((childSnapshot) => {
      var key = childSnapshot.child("name").val();
      var item = document.createElement("td");
      if(key == pn){
        item.appendChild(document.createTextNode("This is from you!"));
      } else {
        item.appendChild(document.createTextNode(""));
      }
      item.className = childSnapshot.key;
      tr.appendChild(item);
    });
  });
  table.appendChild(tr);
}

function addGiftInfoToTable(c){
  var table = document.getElementById("giftTable");
  var tr = document.createElement("tr");
  var ref = db.ref("game/"+c).child("gift");
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
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        item.appendChild(a);
      } else {
        item.appendChild(document.createTextNode(""));
      }
      item.className = childSnapshot.key;
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
  console.log("code is "+ code + " & name is "+ name);
  return {code, name};
}

function lastMove(c){
  var ref = db.ref("game/"+c);
  var doneCounter = 0;

  ref.once("value").then(function(snapshot){
    var fpe = snapshot.hasChild("firstPersonEvent");
    if(fpe){
      //first person event has happened already
      console.log("firstPersonEvent");
      //want to check if everyone has choosen a gift already
      snapshot.child("order").forEach((childSnapshot) => {
        var open = childSnapshot.child("done").val();
        if(open){
          doneCounter++;
        }
      })
      if(snapshot.child("order").numChildren() == doneCounter){
        console.log("sdfsd");
        window.location.href = "./endGame.html"+location.search.substring();
      }
      //case when all gift are stolen
      var stealCounter = 0;
      snapshot.child("gift").forEach((childSnapshot) =>{
        var numSteal = childSnapshot.child("numStealLeft").val();
        if(numSteal <= 0){
          stealCounter++;
        }
      });
      if(snapshot.child("gift").numChildren() == stealCounter){
        window.location.href = "./endGame.html"+location.search.substring();
      }
    } else{
      //first person even has not happened
      //want to check if everyone has choosen a gift already
      snapshot.child("order").forEach((childSnapshot) => {
        var open = childSnapshot.child("done").val();
        if(open){
          doneCounter++;
        }
      })
      if(snapshot.child("order").numChildren() == doneCounter){
        console.log("sdfsd");
        //window.location.href = "./firstperson.html"+location.search.substring();
        window.location.href = "./endGame.html"+location.search.substring();
      }
    }
  });

/*   //all gift are choosen & first person event has not happened yet
  ref.child("order").once("value", (snapshot) => {
    snapshot.forEach((childSnapshot) => {
      var open = childSnapshot.child("done").val();
      if(open){
        doneCounter++;
      }
    });
    if(snapshot.numChildren() == doneCounter){
      ref.child("firstPersonEvent").set(true);
      console.log("sdfsd");
      window.location.href = "./firstperson.html"+location.search.substring();
    }
  });

  ref.child("history").once("value", (childSnapshot) =>{
    childSnapshot.forEach((childChildSnapshot) => {
      var string = childChildSnapshot.val();
     // console.log(string);
      if(string == "End Game"){
        //console.log("ending game");
        window.location.href = "./endGame.html"+location.search.substring();
      } else if(string == "First person is stealing"){
        
        ref.once("value", (snapshot) => {
          var fpc = snapshot.hasChild("firstPersonEvent");
          console.log("stealing gift");
          if(fpc){
            console.log("firstpersonevent happened");
            window.location.href = "./endGame.html"+location.search.substring();
          } else{
            console.log("firstpersonevent didn't happened");
            window.location.href = "./firstperson.html"+location.search.substring();
          }
        });
      }
    });  
  }); */


}

let ud = getUserData();
let code = ud.code;
let pname = ud.name;
//console.log("code is "+ code + " & pname is "+ pname);
getCurrentPlayer(code);
addOrderList(code);
addGiftIconToTable(code);
addOwnGiftToTable(code, pname);
addGiftOwnerToTable(code);
addGiftInfoToTable(code);
addGiftStealNumToTable(code);
lastMove(code);

/* window.addEventListener("DOMContentLoaded", (event) => {
  console.log(document.getElementById("currName"));
  document.querySelectorAll(".responsive_gift").forEach(function (icon){
    icon.addEventListener("click", (event) =>{
      window.alert("testing " + event.target.id);
      selectGift(event.target.id);
    });
  });
  //console.log(document.getElementById("currName").innerHTML);
  //db.ref("game/"+code+"/order").on("child_changed", location.reload());
}); */

/* img.addEventListener("click", (event) =>{
  window.alert("testing " + event.target.id);
  selectGift(event.target.id);
}); */


//make gift icon clickable only for current player
var currPlayer = document.getElementById("currName");
const observer = new MutationObserver(function(){
  //console.log('callback that runs when observer is triggered');
  //console.log(currPlayer.innerText);
  //console.log("pname: "+pname);
  if(currPlayer.innerText == pname){
    console.log("same");
    //console.log(document.querySelectorAll(".responsive_gift"));
/*     .forEach(function (icon){
      icon.addEventListener("click", (event) =>{
        window.alert("testing " + event.target.id);
        selectGift(event.target.id);
      });
    }); */
  }
});
observer.observe(currPlayer, {subtree: true, childList: true});
db.ref("game/"+code+"/order").on("child_changed", function(){
  window.location.href = "./giftreveal.html"+location.search.substring();
});