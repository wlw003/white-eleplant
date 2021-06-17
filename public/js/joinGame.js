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