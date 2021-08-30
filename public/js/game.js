/**
 * Function that generates player order list
 * @param {string} gameCode
 */
function generatePlayerOrderList(gameCode) {
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

/**
 * Function that allows players to select gifts
 * @param {string} giftID
 */
function selectGift(gameCode, giftID) {
  // Get current player and database reference to game
  var currentPlayer = document.getElementById("currName").innerText;
  var ref = db.ref("game/"+gameCode);

  // Initialize an object to update the database
  var update = {};

  // Get a snapshot of the game
  ref.once("value", (snapshot) =>{
    // Get gift open status and current player's order number
    var openStatus = snapshot.child("gift/"+giftID+"/openStatus").val();
    var order = snapshot.child("players/"+currentPlayer+"/order").val();

    // Generate a new key
    var newKey = ref.child("history").push().key;

    // If the gift was opened before...
    if(openStatus) {
      // Get gift's previous owner and their order number
      var prevOwner = snapshot.child("gift/"+giftID+"/owner").val();
      var prevOwnerOrder = snapshot.child("players/"+prevOwner+"/order").val();

      // Get gift's number of steals left
      var numStealLeft = snapshot.child("gift/"+giftID+"/numStealLeft").val();

      // Change the previous owner's done status to false
      // Set gift's previous owner to prevOwner
      // Decrease gift's steal counter
      update["order/"+prevOwnerOrder+"/done"] = false;
      update["gift/"+giftID+"/prevOwner"] = prevOwner;
      update["gift/"+giftID+"/numStealLeft"] = numStealLeft - 1;
    } else {
      // Change gift's open status to true
      update["gift/"+giftID+"/openStatus"] = true;
    }

    // Create new record of player's gift choice
    update["history/"+newKey] = {
      currPlayer: currentPlayer,
      gift: giftID
    };

    // Set gift's current owner to current player
    // Change done status of current player to true
    update["gift/"+giftID+"/owner"] = currentPlayer;
    update["order/"+order+"/done"] = true;

    ref.update(update);
  });
}

function addGiftIconToTable(gameCode){
  db.ref("game/"+gameCode).child("gift").once("value", (snapshot) => {
    // Get table element and create new table row element
    var table = document.getElementById("giftTable");
    var tr = document.createElement("tr");

    // For every gift in the game...
    snapshot.forEach((childSnapshot) => {
      // Create a new table item and img element
      var item = document.createElement("td");
      var img = document.createElement("img");

      // Get gift's number of steals left
      var numSteal = childSnapshot.child("numStealLeft").val();

      // If a gift has steals left...
      if (numSteal > 0) {
        // Get gift ribbon anf box color
        var ribbonColor = childSnapshot.child("ribbonColor").val();
        var boxColor = childSnapshot.child("boxColor").val();

        // Set gift image and description
        img.src = "./images/" + boxColor + " box " + ribbonColor + " ribbon.png";
        img.alt = boxColor + " gift box with " + ribbonColor + " ribbon";

        // Handle gift click event
        img.addEventListener("click", (event) =>{
          let currentPlayer = document.getElementById("currName").textContent;

          getPlayerName((playerName) => {
            // If the player is the current player
            if (currentPlayer === playerName) {
              // Allow them to select a gift
              selectGift(gameCode, event.target.id);
            } else {
              // Get gift information modal
              var modal = document.getElementById("myModal");

              // Get the clicked gift information from the database
              db.ref("game/"+gameCode+"/gift/"+event.target.id).once("value", (snapshot) => {
                // If the gift has been opened...
                if (snapshot.child("openStatus").val() === true) {
                  // Get gift description element
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
      } else {
        // Set gift image source and description to unavailable
        img.src = "./images/unavailable present.png";
        img.alt = "unavailable present";
      }

      // Set gift image's ID and class
      img.id = childSnapshot.key;
      img.className = "responsive_gift "+ childSnapshot.key;

      // Append img to item and item to table row
      item.appendChild(img);
      tr.appendChild(item);
    });

    // Append table row to table
    table.appendChild(tr);
  });
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