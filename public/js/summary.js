window.addEventListener("load", (event) => {
  var gameCode = getGameCode();

  var ref = db.ref("game/"+gameCode).child("gift");
  ref.once("value", (snapshot) =>{  

    var list = document.getElementById("giftSummary");
    snapshot.forEach((childSnapshot) =>{
      
      // get players' info
      var owner = childSnapshot.child("owner").val();
      var gifter = childSnapshot.child("name").val();

      // create li element
      var item = document.createElement("li");
      var txt = gifter + " will give their gift to " + owner;
      item.appendChild(document.createTextNode(txt));
      list.appendChild(item);
    });
  });
});