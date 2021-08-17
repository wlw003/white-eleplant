/**
 * Function that checks if all players finished entering gift information and 
 * are ready to go on to the page
 * @param {int} gameCode 
 */
 function everyoneReadyEvent(gameCode){
  db.ref("game/"+gameCode).once("value").then((snapshot) =>{

    // get number of players
    var playerNum = snapshot.child("players").numChildren();

    //get number of gifts
    var giftNum = snapshot.child("gift").numChildren();

    // go to the next page when the numbers of players and gift are equal
    if(playerNum == giftNum){
      window.location.href = "./order.html" + location.search.substring();
    }
  });
};

window.addEventListener("load", (event) => {

  var gameCode = getGameCode();
  db.ref("game/"+gameCode).child("players").on("value", (snapshot) =>{

    // get player list
    var list = document.getElementById("playerOrder");

      // Clear playerList
      while (list.firstChild) {
        list.removeChild(list.lastChild);
      }
  
      // Update playerList
      snapshot.forEach((player) => {
        // Add player to playerList
        var des = player.child("giftDescription").exists();
        if(des){
          addPlayerToList(player.key, list);
        }
      });
      everyoneReadyEvent(gameCode);
  });

});


