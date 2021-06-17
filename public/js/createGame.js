// check name's validity
const input = document.getElementById("playerName");
input.addEventListener("input", (event) => {
  playerNameLength = input.value.legnth;
  counter = document.getElementById("charas");

  countCharactersRemaining(input.value.length, counter);

  var errorMessage = document.getElementById("errorMessage");

  validateName(input.value, errorMessage);
});

let rs = document.getElementById("roomSubmit");

rs.addEventListener("click", (event) => {
  let passcode = "";
  //console.log("first: " + passcode);

  var ref = db.ref("game/");
  ref.once("value", (snapshot) => {
    passcode = Math.floor(Math.random()*10000);
    //check if it is an unqiue passcode
    var hasCode = snapshot.child(passcode).exists();
    //console.log(passcode+ " " + hasCode);
    while(hasCode){
      //console.log("inside while - "+ passcode+ " " + hasCode);
      passcode = Math.floor(Math.random()*10000);
      hasCode = snapshot.child(passcode).exists();
      //console.log("new "+ passcode+ " " + hasCode);
    }
    //console.log("final " + passcode);

    //add user & game code to url
    let y = document.getElementById("playerName").value;
    let paramsString = "?playerName=" + y + "&game=" + passcode;
    //document.location.search = paramsString;
    //console.log(paramsString);
    window.location.href = "./WaitingRoom.html"+paramsString;

  });
  
});