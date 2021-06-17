// check name's validity
const input = document.getElementById("playerName");
input.addEventListener("input", (event) => {
  if(input.validity.typeMismatch){
    input.setCustomValidity("Name cannot start with a space or contain any emojis.");
  } else{
    input.setCustomValidity("");
  }
});

//name character remining counter
var maxLength = 12;
input.addEventListener('keyup', countCharacters, false);

function countCharacters(e){
  var textEntered, countRemaining, counter;
  textEntered = document.getElementById("playerName").value;
  counter = (12-(textEntered.length));
  countRemaining = document.getElementById("charas");
  countRemaining.textContent = counter;
}


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