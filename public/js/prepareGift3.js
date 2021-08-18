/**
 * Function that checks if all players finished entering gift information and 
 * are ready to go on to the page
 * @param {int} gameCode 
 */
 function everyoneReadyEvent(gameCode){
  db.ref("game/"+gameCode).once("value").then((snapshot) =>{

    // get number of players
    var playerNum = snapshot.child("players").numChildren();

    //get number of ready gift
    var list = document.getElementById("playerOrder");
    var giftNum = list.children.length;
    console.log("giftNum: " + giftNum);

    // go to the next page when the numbers of players and gift are equal
    if(playerNum == giftNum){
      window.location.href = "./order.html" + location.search.substring();
    }
  });
};

window.addEventListener("load", (event) => {

  var gameCode = getGameCode();
  db.ref("game/"+gameCode+"/gift").on("value", (snapshot) =>{

    // get player list
    var list = document.getElementById("playerOrder");

      // Clear playerList
      while (list.firstChild) {
        list.removeChild(list.lastChild);
      }
  
      // Update playerList
      snapshot.forEach((gift) => {
        // Add player to playerList
        var box = gift.child("boxColor").exists();
        var ribbon = gift.child("ribbonColor").exists();
        if(box && ribbon){
          var playerName = gift.child("name").val(); 
          addPlayerToList(playerName, list);
        }
      });
      everyoneReadyEvent(gameCode);
  });

});


