/**
 * Function to go the next page. Players are given 3 seconds to read the order
 * page before they are automatically redirects to the next page. 
 */
function goToNextPage(){
  var timeleft = "";
  var countdown = document.getElementById("countdown");

  // make the countdown timer starts at 3 seconds
  countdown.appendChild(document.createTextNode(timeleft));
  timeleft = 3;
  countdown.innerText = timeleft;

  // countdown timer
  var pageTimer = setInterval(function(){
    countdown.innerText = timeleft;
    timeleft--;
    if(timeleft <= 0) {
      clearInterval(pageTimer);
      window.location.href = "./choosingGift.html"+location.search.substring();
    }
  }, timeleft*1000);
  
}

window.addEventListener("load", (event) => {
  var gameCode = getGameCode();

  // create game play history
  getPlayerName((playerName) =>{
    var newKey = db.ref().child("game/"+gameCode+"/history").push().key;
    var updates = {};
    updates["game/"+gameCode+"/history"+"/"+newKey] = playerName + " is ready!";
    db.ref().update(updates);
  })

  //make player order list
  var ref = db.ref("game/"+gameCode).child("players");
  var list = document.getElementById("playerOrder");
  ref.orderByChild("order").once("value", (snapshot) => {
    snapshot.forEach((childSnapshot) => {
      var name = childSnapshot.key;
      addPlayerToList(name, list);
      goToNextPage();
    });
  });
});