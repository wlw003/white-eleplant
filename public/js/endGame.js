/**
 * Function that redirects to the game summary page after 3 seconds
 */
function goToNextPage(){
  var timeleft = 3;
  var pageTimer = setInterval(function(){
    timeleft--;
    if(timeleft <= 0) {
      clearInterval(pageTimer);
      window.location.href = "./summary.html"+location.search.substring();
    }
  }, timeleft*1000);
}

window.addEventListener("load", (event) => {
  var gameCode = getGameCode();
  var ref = db.ref("game/"+gameCode).child("gift");
  ref.once("value", (snapshot) =>{  

    var list = document.getElementById("giftSummary");
    snapshot.forEach((childSnapshot) =>{

      // get gift info
      var owner = childSnapshot.child("owner").val();
      var giftDes = childSnapshot.child("description").val();
      var link = childSnapshot.child("link").val();

      // create a li element with text in the following format:
      // [player] has received [gift]
      // [gift] should be a link
      var item = document.createElement("li");
      var txt = owner + " has received ";
      item.appendChild(document.createTextNode(txt));
      var a = document.createElement("a");
      a.appendChild(document.createTextNode(giftDes))
      a.title = giftDes;
      a.href = link;
      a.target = "_blank";
      a.rel = "noopener noreferrer";

      // append childs
      item.appendChild(a);
      list.appendChild(item);
    });
  });

  goToNextPage();
});