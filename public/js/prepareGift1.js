/**
 * Function that writes infomation about the gift to Firebase
 * @param {string} gameCode game code
 * @param {string} playerName player's name
 * @param {string} giftDes desciption of the gift
 * @param {string} giftLink gift URL
 * @param {*} callBack 
 */
function writeGiftInfo(gameCode, playerName, giftDes, giftLink, callBack){
  // Retrieve a snapshot of all existing gifts in the database
  db.ref("game/" + gameCode).child("gift").once("value", (snapshot) => {
    var giftCode;

    // Generate unique gift code
    do {
      giftCode = Math.floor(10000*Math.random());
    } while(snapshot.child(gameCode).exists());

    // Set gift information
    db.ref("game/" + gameCode + "/gift/" + giftCode).set({
      description: giftDes,
      link: giftLink,
      numStealLeft: 3,
      openStatus: false,
      owner:"",
      prevOwner:"",
      name: playerName,
    }, (error) => {
      if (error == null) {
        // Update player
        db.ref("game/" + gameCode).child("players/" + playerName).update({
          giftDescription: giftDes,
          giftLink: giftLink,
          giftCode: giftCode
        }, callBack);
      } else {
        callBack(error);
      }
    });
  });
}

// Get roomSubmit element
let roomSubmit = document.getElementById("roomSubmit");

// Handle roomSubmit element click event
roomSubmit.addEventListener("click", (event) => {
  var gameCode = getGameCode();

  getPlayerName((playerName) => {
    // Write gift information into database
    writeGiftInfo(gameCode, playerName, document.getElementById("giftDes").value, document.getElementById("giftLink").value, (error) => {
      // Check for set and update error
      if (error == null) {
        window.location.href = "./PrepareGift2.html"+location.search.substring();
      } else {
        window.alert(error);
      }
    });
  });
});