/**
 * Function that redirects players to the next page after all players submit their gift's color
 * @param {int} gameCode 
 */
 function everyoneReadyEvent(gameCode){
  db.ref("game/"+gameCode).once("value").then((snapshot) =>{
    // Get number of players
    var playerNum = snapshot.child("players").numChildren();

    // Get number of ready gifts
    var giftNum = document.getElementById("playerOrder").children.length;

    // Go to the next page when the numbers of players and ready gifts are equal
    if (playerNum == giftNum) {
      window.location.href = "./order.html" + location.search.substring();
    }
  });
};

window.addEventListener("load", (event) => {
  var gameCode = getGameCode();

  db.ref("game/"+gameCode+"/gift").on("value", (snapshot) =>{
    // Get player list
    var list = document.getElementById("playerOrder");

      // Clear playerList
      while (list.firstChild) {
        list.removeChild(list.lastChild);
      }
  
      // Update playerList
      snapshot.forEach((gift) => {
        var boxColor = gift.child("boxColor").exists();
        var ribbonColor = gift.child("ribbonColor").exists();

        // Add ready players to playerList
        if(boxColor && ribbonColor){
          var playerName = gift.child("name").val();

          addPlayerToList(playerName, list);
        }
      });

      everyoneReadyEvent(gameCode);
  });
});