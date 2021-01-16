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

let rs = document.getElementById("roomSubmit");
rs.addEventListener("click", (event) => {
  //check if the code is valid
  let code = document.getElementById("gameCode").value;
  let name = document.getElementById("playerName").value;
  
  var ref = db.ref("game");
  ref.once("value", (snapshot) => {
    var c = snapshot.child(code);
    var hasCode = c.exists();
    //console.log(c.val());
    if(hasCode){
      console.log("inside hascode");
      ref.child(code+"/players").once("value", (childSnapshot) =>{
        var hasName = childSnapshot.child(name).exists();
        if(hasName){
          window.alert("This name is already taken! Please choose another name.");
        } else{
          let paramsString = "?playerName=" + name + "&game=" + code;
          document.location.search = paramsString;
          //console.log(paramsString);
          window.location.href = "./WaitingRoom.html"+paramsString;  
        }
      });
    } else{
      window.alert("Invaild Code! Please enter a vaild code.")
    }
  });
  
/*   let paramsString = "?playerName=" + name + "&game=" + code;
  document.location.search = paramsString;
  //console.log(paramsString);
  window.location.href = "./WaitingRoom.html"+paramsString;   */
});