/**
 * Function that generates player order list
 * @param {object} snapshot of "game/"+gameCode in database
 */
 function generatePlayerOrderList(snapshot) {
  // For each player...
  snapshot.child("order").forEach((childSnapshot) => {
    // Get player name and their done status
    var playerName = childSnapshot.child("name").val();
    var done = childSnapshot.child("done").val();

    // Get list element
    var list = document.getElementById("playerOrder");

    // If the player already took their turn...
    if (done) {
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
}

/**
 * Function that gets current player
 * @param {object} snapshot of "game/"+gameCode in database
 */
function setCurrentPlayer(snapshot) {
  // For each player...
  snapshot.child("order").forEach((childSnapshot) => {
    // Get player name and their done status
    var playerName = childSnapshot.child("name").val();
    var done = childSnapshot.child("done").val();

    // If the player didn't take their turn yet
    if (!done) {
      // Set current player
      var node = document.getElementById("currName");
      node.textContent = playerName;

      // Break out of forEach iteration
      return true;
    }
  });
}

/**
 * Function that allows players to select gifts
 * @param {object} snapshot of "game/"+gameCode in database
 * @param {string} giftID
 */
function selectGift(snapshot, gameCode, giftID) {
  // Get database reference to game
  var ref = db.ref("game/"+gameCode);

  // Get current player and their order number
  var currentPlayer = document.getElementById("currName").innerText;
  var order = snapshot.child("players/"+currentPlayer+"/order").val();

  // Get gift open status, current player's order number
  var openStatus = snapshot.child("gift/"+giftID+"/openStatus").val();

  // Initialize an object to update the database
  var update = {};

  // Generate a new key
  var newKey = ref.child("history").push().key;

  // If the gift was opened before...
  if (openStatus) {
    // Get previous gift owner
    var prevOwner = snapshot.child("gift/"+giftID+"/prevOwner").val();

    // Prevent back and forth steals
    if (prevOwner === currentPlayer) {
      alert("You cannot steal your gift back this round");

      return;
    }

    // Get gift's current owner and their order number
    var currentOwner = snapshot.child("gift/"+giftID+"/owner").val();

    if (currentOwner !== "") {
      var currentOwnerOrder = snapshot.child("players/"+currentOwner+"/order").val();
      
      
      // Get gift's number of steals left
      var numStealLeft = snapshot.child("gift/"+giftID+"/numStealLeft").val();

      // Change the previous owner's done status to false
      // Set gift's current owner to prevOwner
      // Decrease gift's steal counter
      update["order/"+currentOwnerOrder+"/done"] = false;
      update["gift/"+giftID+"/prevOwner"] = currentOwner;
      update["gift/"+giftID+"/numStealLeft"] = numStealLeft - 1;
    }
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

  // Allow player to steal back gift next round
  snapshot.child("gift").forEach((childSnapshot) => {
    var prevOwner = childSnapshot.child("prevOwner").val();
    var giftID = childSnapshot.key;

    if (prevOwner === currentPlayer) {
      update["gift/"+giftID+"/prevOwner"] = "";
    }
  });

  ref.update(update);
}

/**
 * Function to handle clicking gift icon event
 * @param {element} img HTML img element of gift icon
 */
function handleGiftClick(img){
  // Handle gift click event
  img.addEventListener("click", (event) => {
    let currentPlayer = document.getElementById("currName").textContent;

    getPlayerName((playerName) => {
      // If the player is the current player
      if (currentPlayer === playerName) {
        let roomSubmit = document.getElementById("roomSubmit");

        // If gift previously selected...
        if (roomSubmit.value !== "") {
          // Unhighlight gift
          document.getElementById(roomSubmit.value).style.border = "none";
        }

        // If selected gift is re-selected
        if (roomSubmit.value === event.target.id) {
          // Clear selection
          roomSubmit.value = "";
        } else {
          // Remember selection
          roomSubmit.value = event.target.id;

          // Highlight gift
          Object.assign(event.target.style, {
            border: "10px solid #ACE6F9",
            boxSizing: "border-box"
          });

          viewGiftInfo(event);
        }
      } else {
        viewGiftInfo(event);
      }
    })
  });
}

/**
 * Function to view gift
 * @param {object} event 
 */
function viewGiftInfo(event){
  // handle button click event
  var btn = document.getElementById("viewGift");
  btn.addEventListener("click", () => {
    displayModal(event);
  });
}

/**
 * Function to display modal
 * @param {object} event gift click event
 */
function displayModal(event) {
  // Get gift information modal
  var modal = document.getElementById("myModal");

  //get game code
  var gameCode = getGameCode();

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

/**
 * Function to add gifts and its information to the webpage.
 * Each gift is a child to the giftContainer and is the parent of 
 * giftOwner, giftIcon, and numSteal.
 * @param {object} snapshot of "game/"+gameCode in database
 */
function addGiftsToContainer(snapshot) {
  var container = document.getElementById("giftContainer");
  
  snapshot.child("gift").forEach((childSnapshot) => {
    // create div element called gift
    var gift = document.createElement("div");
    gift.className = "gift";

    // create text element for gift's owner
    var giftOwner = document.createElement("p");
    giftOwner.className = "giftOwner";

    // get gift's owner info
    // check if the gift was opened before
    if(childSnapshot.child("openStatus").val() === true) {
      giftOwner.textContent = childSnapshot.child("owner").val();
    }
    gift.appendChild(giftOwner);


    // create img element for gift icon
    var giftIcon = document.createElement("img");
    
    // Get gift's number of steals left
    var numStealLeft = childSnapshot.child("numStealLeft").val();

    // If a gift has steals left...
    if (numStealLeft > 0 || giftOwner.textContent === "") {
      // Get gift ribbon anf box color
      var ribbonColor = childSnapshot.child("ribbonColor").val();
      var boxColor = childSnapshot.child("boxColor").val();

      // Set gift image and description
      giftIcon.src = "./images/" + boxColor + " box " + ribbonColor + " ribbon.png";
      giftIcon.alt = boxColor + " gift box with " + ribbonColor + " ribbon";
      handleGiftClick(giftIcon);
    } else {
      // Set gift image source and description to unavailable
      giftIcon.src = "./images/unavailable present.png";
      giftIcon.alt = "unavailable present";
    }

    // Set gift image's ID and class
    giftIcon.id = childSnapshot.key;
    giftIcon.className = "responsive_gift "+ childSnapshot.key;
    gift.appendChild(giftIcon);

    //add "This is yours"! badge
    let gameCode = getGameCode();
    getPlayerName((playerName) =>{
      // get player's gift code
      getPlayerGiftCode(gameCode, playerName, (giftCode) =>{
        // compare player's giftCode with current gift key
        if(giftCode == childSnapshot.key){
          var badge = document.createElement("img");
          badge.src = "./images/Present badge.png";
          badge.alt = "This is your present!";
          badge.className = "your_gift";
          gift.appendChild(badge);
        }
      });
      
    });

    // create text element for number of steals
    var numSteal = document.createElement("p");
    numSteal.className = "numStealLeft";

    // get gift's number of steals 
    var numStealLeft = childSnapshot.child("numStealLeft").val();
    // If the gift was opened before...
    if (childSnapshot.child("openStatus").val() === true) {
      if (numStealLeft > 1) {
        numSteal.textContent = numStealLeft + " steals left!";
      } else if (numStealLeft === 1) {
        numSteal.textContent = "1 steal left!";
      } else {
        numSteal.textContent = "No steals left!";
      }
    }
    gift.appendChild(numSteal);
    container.appendChild(gift);
  });
}


/**
 * Function handles endgame events
 * @param {object} snapshot of "game/"+gameCode in database
 */
 function lastMove(snapshot) {
  var doneCounter = 0;

  // For each player in the player order list...
  snapshot.child("order").forEach((childSnapshot) => {
    // If player is done playing...
    if (childSnapshot.child("done").val() === true) {
      doneCounter++;
    }
  });

  // If every player is done playing...
  if (snapshot.child("order").numChildren() === doneCounter) {
    // If first person event...
    if (snapshot.hasChild("firstPersonEvent") === false) {
      var stealCounter = 0;
  
      // For every gift in the game
      snapshot.child("gift").forEach((childSnapshot) => {
        var numSteal = childSnapshot.child("numStealLeft").val();
  
        // If gift has no steals left...
        if (numSteal < 1) {
          stealCounter++;
        }
      });
  
      // If no gifts have steals left...
      if (snapshot.child("gift").numChildren() == stealCounter) {
        window.location.href = "./endgame.html"+location.search.substring();
      } else {
        var gameCode = getGameCode();
        var ref = db.ref("game/"+gameCode);
        
        var players = snapshot.child("order").val();
        
        firstPlayer = players[Object.keys(players)[0]];
        firstPlayerOrder = Object.keys(players)[0];

        var update = {};
        update["order/"+firstPlayerOrder+"/done"] = false;
        update["firstPersonEvent"] = "In progress";

        ref.update(update);
      }
    } else {
      window.location.href = "./endgame.html"+location.search.substring();
    }
  }
}

// Invoke functions and generate webpage
getPlayerName((playerName) => {
  let gameCode = getGameCode();

  // Generate webpage
  db.ref("game/"+gameCode).once("value", (snapshot) => {
    // Set current player
    setCurrentPlayer(snapshot);
    generatePlayerOrderList(snapshot);
    addGiftsToContainer(snapshot);

    getPlayerName((playerName) => {
      var currentPlayer = document.getElementById("currName").textContent;

      if (currentPlayer === playerName) {
        // Get roomSubmit element
        let roomSubmit = document.getElementById("roomSubmit");
        roomSubmit.style.visibility = "visible";

        if (snapshot.child("firstPersonEvent").val() === "In progress") {
          const banner = document.querySelector("#banner > h1").childNodes[1];
          banner.textContent = " went first, so they have a chance to steal!";

          let cta = document.getElementById("CTA");

          let keepPresent = document.createElement("button");
          keepPresent.textContent = "Keep present";

          cta.appendChild(keepPresent);

          // Handle roomSubmit click event
          roomSubmit.addEventListener("click", (event) => {
            if (event.target.value === "") {
              alert("Please select a gift");
            } else {
              let gameCode = getGameCode();
              var ref = db.ref("game/"+gameCode);

              var gifts = snapshot.child("gift").val();
              let currentPlayerGiftId;

              for (var giftId in gifts) {
                if (gifts[giftId].owner === currentPlayer) {
                  currentPlayerGiftId = giftId;

                  break;
                }
              }

              let update = {};

              update["gift/"+currentPlayerGiftId+"/owner"] = "";
              update["firstPersonEvent"] = "Done";

              ref.update(update).then(() => {
                // Submit player's gift selection to database
                selectGift(snapshot, gameCode, event.target.value);
              });
            }
          });

          // Handle keepPresent click event
          keepPresent.addEventListener("click", (event) => {
            // update game done status to true
            let update = {};
            update["status/done"] = true;

            db.ref("game/"+gameCode).update(update).then(() =>{
              window.location.href = "./endgame.html"+location.search.substring();
            });
            
          });
        } else {
          // Handle roomSubmit click event
          roomSubmit.addEventListener("click", (event) => {
            if (event.target.value === "") {
              alert("Please select a gift");
            } else {
              let gameCode = getGameCode();
      
              // Submit player's gift selection to database
              selectGift(snapshot, gameCode, event.target.value);
            }
          });
        }
      } else {
        if (snapshot.child("firstPersonEvent").val() === "In progress") {
          const banner = document.querySelector("#banner > h1").childNodes[1];
          banner.textContent = " went first, so they have a chance to steal!";
        }
      }
      
      // Handle endgame
      lastMove(snapshot);
    });
  });

  // non current players page redirects
  db.ref("game/"+gameCode+"/status").on("child_changed", (snapshot)  => {
    if(snapshot.child("done")){
      window.location.href = "./endgame.html"+location.search.substring();
    }
  });

  db.ref("game/"+gameCode+"/order").on("child_changed", function() {
    window.location.href = "./giftreveal.html"+location.search.substring();
  });
});

// Get the <button> element that closes the modal
var closeModal = document.getElementById("closeModal");

// Handle closeModal element click event
closeModal.onclick = function() {
  let giftUrl = document.getElementById("giftURL");

  // Close modal
  document.getElementById("myModal").style.display = "none";
  
  giftUrl.removeChild(
    giftUrl.childNodes[0]
  );
}

// Handle window click event
window.onclick = function(event) {
  let giftUrl = document.getElementById("giftURL");
  var modal = document.getElementById("myModal");

  if (event.target === modal) {
    // Close modal
    modal.style.display = "none";

    giftUrl.removeChild(
      giftUrl.childNodes[0]
    );
  }
}