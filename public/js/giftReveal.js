/**
 * Function to create a hyperlink with the gift information. The gift 
 * description will be the clickable text that leds to the gift URL.
 * @param {string} gameCode current game code
 * @param {string} giftID current gift ID
 */
function createLink(gameCode, giftID){
  db.ref("game/"+gameCode+"/gift/"+giftID).once("value").then((snapshot) => {
    // get gift description
    var giftDes = snapshot.child("description").val();
    // get gift URL
    var link = snapshot.child("link").val();
    var item = document.getElementById("giftDes");
    // create a hyperlink with given info
    var a = document.createElement("a");
    a.appendChild(document.createTextNode(giftDes));
    a.title = giftDes;
    a.href = link;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    item.appendChild(a);
  });
}

window.addEventListener("load", (event) => {
  var gameCode = getGameCode();

  var ref = db.ref("game/"+gameCode);
  
  // get the most recently played player's gift info
  ref.child("history").limitToLast(1).once("value").then((snapshot) => {
    //console.log("inside on");
    snapshot.forEach((childSnapshot) => {

      // get player's name for the banner
      var currPlayer = childSnapshot.child("currPlayer").val();
      //console.log("currPlayer: "+currPlayer);
      var name = document.getElementById("currName");
      name.appendChild(document.createTextNode(currPlayer));

      // get gift description for the main content body
      var id = childSnapshot.child("gift").val();
      //console.log("id "+ id);
      createLink(gameCode, id);
    });
  });
  
  // button to go to the next page
  let rs = document.getElementById("gotIt");
  rs.addEventListener("click", (event) => {
    window.location.href = "./choosingGift.html"+location.search.substring();  
  });
});

