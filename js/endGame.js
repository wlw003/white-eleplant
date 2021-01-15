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

function goToNextPage(){
  var timeleft = 3;
  //var countdown = document.getElementById("countdown");
  //countdown.appendChild(document.createTextNode(timeleft));
  var pageTimer = setInterval(function(){
    timeleft--;
    //countdown.textContent = timeleft;
    if(timeleft <= 0) {
      clearInterval(pageTimer);
      window.location.href = "./summary.html"+location.search.substring();
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

  var ref = db.ref("game/"+code).child("gift");
  ref.once("value", (snapshot) =>{  
    //console.log(snapshot);  
    var list = document.getElementById("giftSummary");
    snapshot.forEach((childSnapshot) =>{
      var owner = childSnapshot.child("owner").val();
      //console.log(owner);
      var giftDes = childSnapshot.child("description").val();
      //var gifter = childSnapshot.child("name").val();
      var link = childSnapshot.child("link").val();

      var item = document.createElement("li");
      var txt = owner + "has received ";
      item.appendChild(document.createTextNode(txt));
      var a = document.createElement("a");
      a.appendChild(document.createTextNode(giftDes))
      a.title = giftDes;
      a.href = link;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      item.appendChild(a);
      list.appendChild(item);
    });
  });
  goToNextPage();
});