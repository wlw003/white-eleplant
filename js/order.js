// Set the configuration for your app
// TODO: Replace with your project's config object
var config = {
  apiKey: "AIzaSyBjoRL9kjfr_kDvf9xbLvT6SaNjX2Up_pU",
  authDomain: "white-elephant-9ca35.firebaseapp.com",
  projectId: "white-elephant-9ca35",
  storageBucket: "white-elephant-9ca35.appspot.com",
  messagingSenderId: "493805772908",
  appId: "1:493805772908:web:54fde79dca20911dc73849",
  measurementId: "G-4W9CHXR9CN"
};
firebase.initializeApp(config);

// Get a reference to the database service
var db = firebase.database();

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
  var timeleft = 3;
  var countdown = document.getElementById("countdown");
  countdown.appendChild(document.createTextNode(timeleft));
  var pageTimer = setInterval(function(){
    timeleft--;
    countdown.textContent = timeleft;
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