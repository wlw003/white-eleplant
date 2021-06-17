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

  var ref = db.ref("game/"+code).child("gift");
  ref.once("value", (snapshot) =>{  
    //console.log(snapshot);  
    var list = document.getElementById("giftSummary");
    snapshot.forEach((childSnapshot) =>{
      
      var owner = childSnapshot.child("owner").val();
      //console.log(owner);
      //var des = childSnapshot.child("description").val();
      var gifter = childSnapshot.child("name").val();
      //var link = childSnapshot.child("link").val();

      var item = document.createElement("li");
      var txt = gifter + " will give their gift to " + owner;
      item.appendChild(document.createTextNode(txt));
      list.appendChild(item);
    });
  });
});