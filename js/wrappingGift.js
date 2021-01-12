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

// Get a reference to the database 
var db = firebase.database();

function writeGiftInfo(name, code, giftDes, giftLink){
  var ref = db.ref("game/"+code+"/players").child(name);
  var updates ={};
  updates["/giftDescription"] = giftDes;
  updates["/giftLink"] = giftLink;
  console.log(updates);
  return ref.update(updates);
}

/* window.addEventListener("load", (event) => {
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
}); */

let rs = document.getElementById("roomSubmit");
rs.addEventListener("click", (event) => {
  //check if the code is valid
  let des = document.getElementById("giftDes").value;
  let link = document.getElementById("giftLink").value;

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

  let x = writeGiftInfo(name, code, des, link);
  console.log(x);

  var ref = db.ref("game/"+code+"/players/"+name);
  ref.on("value", function(snapshot){
    var code = snapshot.child("giftDescription");
    var hasCode = code.exists();
    console.log(hasCode);
    if(hasCode){
      window.location.href = "./PrepareGift3.html"+location.search.substring(); 
    }
  });
  //window.location.href = "./PrepareGift3.html"+location.search.substring();  

});