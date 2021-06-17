function addPlayerToList(pn){
  var list = document.getElementById("playerOrder");
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

function addPlayerToOrder(c, n, o){
  db.ref("game/"+c+"/order/"+o).set({
    name: n,
    done: false
  });
}

function goToNextPage(){
  var timeleft = "";
  var countdown = document.getElementById("countdown");
  var txt = "Now you will be redirected to the next step.";
  countdown.appendChild(document.createTextNode(timeleft));
  timeleft = 3;
  countdown.innerText = timeleft;
  var pageTimer = setInterval(function(){
    countdown.innerText = timeleft;
    timeleft--;
    if(timeleft <= 0) {
      clearInterval(pageTimer);
      window.location.href = "./choosingGift.html"+location.search.substring();
    }
  }, timeleft*1000);
  
}

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

  //create game play history
  var newKey = db.ref().child("game/"+code+"/history").push().key;
  var updates = {};
  updates["game/"+code+"/history"+"/"+newKey] = name + " is ready!";
  db.ref().update(updates);

  //make player order list
  var ref = db.ref("game/"+code).child("players");
  console.log(ref.toString());
  ref.orderByChild("order").once("value", (snapshot) => {
    snapshot.forEach((childSnapshot) => {
      var key = childSnapshot.key;
      //console.log(key);
      //console.log(des);
      addPlayerToList(key);
      var orderNum = childSnapshot.child("order").val();
      addPlayerToOrder(code, key, orderNum);
      goToNextPage();
    });
  });
  
/*   let rs = document.getElementById("startWrap");
  rs.addEventListener("click", (event) => {
    window.location.href = "./PrepareGift1.html"+location.search.substring();  
  }); */
  //timer to go to the next page
  //window.setTimeout(goToNextPage,10000);

  // need to find a way to get all users to get to the next pge at same time
  
});