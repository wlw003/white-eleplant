// Handle click event for all elements named "box"
document.getElementsByName("box").forEach((box) => {
  box.addEventListener('click', event => {
    document.getElementById("boxColor").value = box.value;
  });
});

// Handle click events for all elements named "ribbon"
document.getElementsByName("ribbon").forEach((ribbon) => {
  ribbon.addEventListener('click', event => {
    document.getElementById("ribbonColor").value = ribbon.value;
  });
});

/**
 * Write gift box and ribbon color information to Firebase
 * @param {string} boxColor - gift box color
 * @param {string} ribbonColor - gift ribbon color
 * @param {string} callBack - asynchronous call back function
 */
function setGiftColor(boxColor, ribbonColor, callBack) {
	var gameCode = getGameCode();

	getPlayerName((playerName) => {
		getPlayerGiftCode(gameCode, playerName, (giftCode) => {
			// Update user's box and ribbon color
			db.ref("game/" + gameCode).child("gift/" + giftCode).update({
				ribbonColor: ribbonColor,
				boxColor: boxColor
		  }).then(callBack);
		})
	});
}

// Get roomSubmit element
var roomSubmit = document.getElementById("roomSubmit");

// Handle ready element click event
roomSubmit.addEventListener("click", (event) => {
	var gameCode = getGameCode();

	getPlayerName((playerName) => {
		getPlayerGiftCode(gameCode, playerName, (giftCode) => {
			// Get box and ribbon color
			var ribbonColor = document.getElementById("ribbonColor").value;
			var boxColor = document.getElementById("boxColor").value;

			if (boxColor === undefined || ribbonColor === undefined) {
				window.alert("Please choose a box and ribbon color");
			} else {
				setGiftColor(boxColor, ribbonColor, () => {
					window.location.href = "./PrepareGift3.html"+location.search.substring();
				});
			}
		});
	});
});