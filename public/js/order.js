/**
 * Function to go the next page. Players are given 3 seconds to read the order
 * page before they are automatically redirected to the next page. 
 */
function goToNextPage(){
  var countdown = document.getElementById("countdown");

  // Count down for three seconds
  var pageTimer = setInterval(() => {
    // Decrement count
    countdown.innerText = Number(countdown.innerText) - 1;

    // Redirect to the next page when the countdown timer reaches 0 seconds
    if (Number(countdown.innerText) < 1) {
      window.location.href = "./choosingGift.html"+location.search.substring();
    }
  }, 1000);
}

window.addEventListener("load", (event) => {
  var gameCode = getGameCode();

  // Create game play history
  getPlayerName((playerName) => {
    var newKey = db.ref().child("game/"+gameCode+"/history").push().key;
    var updates = {};

    updates["game/"+gameCode+"/history"+"/"+newKey] = playerName + " is ready!";

    db.ref().update(updates);
  });

  var list = document.getElementById("playerOrder");

  db.ref("game/"+gameCode).child("players").orderByChild("order").once("value", (snapshot) => {
    // Create player order list
    snapshot.forEach((childSnapshot) => {
      var name = childSnapshot.key;

      addPlayerToList(name, list);
    });

    // Go to the next page after 3 seconds
    goToNextPage();
  });
});