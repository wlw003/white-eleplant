// Get playerName element
const playerName = document.getElementById("playerName");

//  Handle playerName element input event
playerName.addEventListener("input", (event) => {
  //  Get counter element
  counter = document.getElementById("counter");

  //  Update counter
  updateCounter(playerName.value.length, counter);

  //  Get errorMessage element
  var errorMessage = document.getElementById("errorMessage");

  //  Validate player name
  validatePlayerName(playerName, errorMessage);
});

//  Get roomSubmit element
let roomSubmit = document.getElementById("roomSubmit");

//  Handle roomSubmit element click event
roomSubmit.addEventListener("click", (event) => {
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