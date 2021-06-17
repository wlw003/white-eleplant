function addPlayerToList(pn){
  var list = document.getElementById("playerList");
  var items = list.getElementsByTagName("li");
  //var toAdd = false;
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

function addReadyPlayerToList(pn){
  var list = document.getElementById("playerList");
  var items = list.getElementsByTagName("li");
  //var toAdd = false;
  console.log(pn);
  for( var i = 0;i < items.length; ++i ){
    if(items[i].innerText.includes(pn)){
      return;
    }
  }
  var item = document.createElement("li");
  item.appendChild(document.createTextNode(pn + " (ready)"));
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
    var name = temp[1];
  }
  else {
    var code = temp[1];
    var name = temp2[1];
  }

  var ref = db.ref("game/"+code)
  var p = ref.child("players");
  console.log(ref.toString());
  p.on("value", (snapshot) => {
    //console.log("inside on");
    //var players = snapshot.val();
    //console.log(players);
    snapshot.forEach((childSnapshot) => {
      var key = childSnapshot.key;
      //var value = childSnapshot.val();
      var des = childSnapshot.child("giftDescription").exists();
      //var link = key.child("giftLink").exists();
      //console.log(key);
      //console.log(des);
      if(des){
        addPlayerToList(key);
      }

      ref.once("value").then(function(snapshot){
        var a = snapshot.child("players").numChildren();
        var b = snapshot.child("gift").numChildren();
        //console.log("p: " + a);
        //console.log("g: " + b);
        if(a == b){
          window.location.href = "./order.html"+location.search.substring();
        }
      });
    });
  });



  //check if gittNum == numPlayers, then go to order page
  
/*   let rs = document.getElementById("startWrap");
  rs.addEventListener("click", (event) => {
    window.location.href = "./PrepareGift1.html"+location.search.substring();  
  }); */
});

