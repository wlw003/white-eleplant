function addPlayerToList(pn){
  var list = document.getElementById("playerList");
  var items = list.getElementsByTagName("li");
  console.log(pn);
  for( var i = 0;i < items.length; ++i ){
    if(items[i].innerText == pn){
      return;
    }
  }
  var item = document.createElement("li");
  item.appendChild(document.createTextNode(pn));
  list.appendChild(item);
};


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

  var rc = document.getElementById("roomCode");
  var rctxt = "Room Code: " + code;
  var rctn = document.createTextNode(rctxt)
  rc.appendChild(rctn); 


  var ref = db.ref("game/"+code).child("players");
  console.log(ref.toString());
  ref.on("value", (snapshot) => {
    //console.log("inside on");
    //var players = snapshot.val();
    //console.log(players);
    snapshot.forEach((childSnapshot) => {
      var key = childSnapshot.key;
      //var value = childSnapshot.val();
      //console.log(key);
      //console.log(value.name);
      addPlayerToList(key);
    });
  });
  
  let rs = document.getElementById("startWrap");
  rs.addEventListener("click", (event) => {
    var ref = db.ref("game/"+code).child("players");
    ref.on("value", (snapshot) => {
      if(snapshot.numChildren() > 1){
        window.location.href = "./PrepareGift1.html"+location.search.substring();  
      }
    });
  });
});

