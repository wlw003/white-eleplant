/**
 * Function that generates player order list
 * @param {string} gameCode
 */
function generatePlayerOrderList(gameCode){
  // Get players randomly generated order from database
  db.ref("game/"+gameCode).child("order").once("value", (snapshot) => {
    // For each player...
    snapshot.forEach((childSnapshot) => {
      // Get player name and their done status
      var playerName = childSnapshot.child("name").val();
      var done = childSnapshot.child("done").val();

      // Get list element
      var list = document.getElementById("playerOrder");

      // If the player already took their turn...
      if (done){
        // Add their name to the player order list lighter
        addItemToList(list, playerName, {
          fontWeight: "lighter"
        });
      } else {
        // Add their name to the player order list bolder
        addItemToList(list, playerName, {
          fontWeight: "bolder"
        });
      }
    });
  });
}

/**
 * Function that gets current player
 * @param {string} gameCode
 * @param {function} callBack function
 */
function getCurrentPlayer(gameCode, callBack){
  // Get players randomly generated order from database
  db.ref("game/"+gameCode).child("order").once("value", (snapshot) => {
    // For each player...
    snapshot.forEach((childSnapshot) => {
      // Get player name and their done status
      var playerName = childSnapshot.child("name").val();
      var done = childSnapshot.child("done").val();

      // If the player didn't take their turn yet
      if (!done) {
        // Callback the player as the current player
        callBack(playerName);

        // Break out of forEach iteration
        return true;
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
          var ribbonColor = childSnapshot.child("ribbonColor").val();
          var boxColor = childSnapshot.child("boxColor").val();

          img.src = "./images/" + boxColor + " box " + ribbonColor + " ribbon.png";
          img.alt = boxColor + " gift box with " + ribbonColor + " ribbon";

          img.addEventListener("click", (event) =>{
            //window.alert("testing " + event.target.id);
            let currentPlayerName = document.getElementById("currName").textContent;

            getPlayerName((playerName) => {
              if (currentPlayerName === playerName) {
                selectGift(event.target.id);
              } else {
                // Get the modal
                var modal = document.getElementById("myModal");

                db.ref("game/"+c+"/gift/"+event.target.id).once("value", (snapshot) => {
                  // If the gift has been opened...
                  if (snapshot.child("openStatus").val() === true) {
                    let giftDescription = document.getElementById("giftDescription");

                    // Display gift description
                    giftDescription.textContent = snapshot.child("description").val();

                    // Change gift descriptions style
                    giftDescription.style.fontWeight = "bold";

                    // Create link tag element
                    let a = document.createElement('a');

                    // Define link tag attributes
                    a.textContent = snapshot.child("link").val();
                    a.title = snapshot.child("link").val();
                    a.href = snapshot.child("link").val();
                    a.rel = "noopener noreferrer";
                    a.target = "_blank";

                    // Change link's style
                    a.style.textDecoration = "underline";
                    a.style.color = "blue";

                    // Append link to giftURL element in DOM
                    document.getElementById("giftURL").appendChild(a);

                    // Open the display modal
                    modal.style.display = "block";
                  } else {
                    alert("You can't look at unopened gifts...");
                  }
                });
              }
            })
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
        window.location.href = "./endgame.html"+location.search.substring();
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
        window.location.href = "./endgame.html"+location.search.substring();
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
        window.location.href = "./endgame.html"+location.search.substring();
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
        window.location.href = "./endgame.html"+location.search.substring();
      } else if(string == "First person is stealing"){
        
        ref.once("value", (snapshot) => {
          var fpc = snapshot.hasChild("firstPersonEvent");
          console.log("stealing gift");
          if(fpc){
            console.log("firstpersonevent happened");
            window.location.href = "./endgame.html"+location.search.substring();
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
getCurrentPlayer(code, (playerName) => {
  var node = document.getElementById("currName");
  node.textContent = playerName;
});
generatePlayerOrderList(code);
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

// Get the <button> element that closes the modal
var closeModal = document.getElementById("closeModal");

// When the user clicks on <span> (x), close the modal
closeModal.onclick = function() {
  var modal = document.getElementById("myModal");

  // Close the modal
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  var modal = document.getElementById("myModal");

  if (event.target === modal) {
    // Close the modal
    modal.style.display = "none";
  }
}