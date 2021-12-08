
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
      var gifter = childSnapshot.child("name").val();

      // create a li element with text in the following format:
      // [gifter] will give their [gift] to [gift owner]
      // [gift] should be a link
      var item = document.createElement("li");
      var a = document.createElement("a");
      a.appendChild(document.createTextNode("present"))
      a.title = giftDes;
      a.href = link;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      
      var txt1 = gifter + " will give their ";
      var txt2 = " to " + owner;
      
      // append child
      item.appendChild(document.createTextNode(txt1));
      item.appendChild(a);
      item.appendChild(document.createTextNode(txt2));

      list.appendChild(item);
    });
  });
});