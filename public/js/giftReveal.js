window.addEventListener("load", (event) => {
  var sp = location.search.substring(1).split("&");
  var temp = sp[0].split("=");
  //console.log(temp);
  var temp2 = sp[1].split("=");
  //console.log(temp2);

  if(temp[0] == "playerName"){
    var code = temp2[1];
    var hostName = temp[1];
  }
  else {
    var code = temp[1];
    var hostName = temp2[1];
  }

  var ref = db.ref("game/"+code);
  console.log(ref.toString());
  ref.child("history").limitToLast(1).once("value").then((snapshot) => {
    //console.log("inside on");
    snapshot.forEach((childSnapshot) => {
      var currPlayer = childSnapshot.child("currPlayer").val();
      console.log("currPlayer: "+currPlayer);
      var name = document.getElementById("currName");
      name.appendChild(document.createTextNode(currPlayer));
      var id = childSnapshot.child("gift").val();
      console.log("id "+ id);
      ref.child("gift/"+id).once("value").then((snapshot2) => {
        var giftDes = snapshot2.child("description").val();
        //console.log(giftDes);
        var link = snapshot2.child("link").val();
        var item = document.getElementById("giftDes");
        var a = document.createElement("a");
        a.appendChild(document.createTextNode(giftDes))
        a.title = giftDes;
        a.href = link;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        item.appendChild(a);
      });
    });
  });
  
  let rs = document.getElementById("gotIt");
  rs.addEventListener("click", (event) => {
    window.location.href = "./choosingGift.html"+location.search.substring();  
  });
});

