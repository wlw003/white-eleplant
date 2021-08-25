/**
 * Function that creates a hyperlink using gift information. The gift 
 * description will be used as clickable text, leading to the gift URL.
 * @param {string} gameCode current game code
 * @param {string} giftID current gift ID
 */
function createLink(gameCode, giftID) {
  db.ref("game/"+gameCode+"/gift/"+giftID).once("value").then((snapshot) => {
    // Create link tag element
    var a = document.createElement('a');

    // Define link tag attributes
    a.textContent = snapshot.child("description").val();
    a.title = snapshot.child("description").val();
    a.href = snapshot.child("link").val();
    a.rel = "noopener noreferrer";
    a.target = "_blank";

    // Append link tag element to giftDes element in DOM
    document.getElementById("giftDes").appendChild(a);
  });
}

window.addEventListener("load", (event) => {
  var gameCode = getGameCode();
  
  // Get the most current player's gift information
  db.ref("game/"+gameCode).child("history").limitToLast(1).once("value").then((snapshot) => {
    snapshot.forEach((childSnapshot) => {
      // Get currName element
      var name = document.getElementById("currName");

      // Display current player's name as present chooser
      name.textContent = childSnapshot.child("currPlayer").val();

      // Display hyperlinked gift description in main content
      createLink(gameCode, childSnapshot.child("gift").val());
    });
  });
});

// Get GotIt element
let rs = document.getElementById("gotIt");

// Handle gotIt element click event
rs.addEventListener("click", (event) => {
  window.location.href = "./choosingGift.html"+location.search.substring();
});