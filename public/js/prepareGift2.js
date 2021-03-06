function chooseBoxColor(color) {
	var gameCode = getGameCode();

	getPlayerName((playerName) => {
		// Update user's box color
		db.ref("game/" + gameCode).child("players/" + playerName).update({
			boxColor: color
	  });
	});
};

function chooseRibbonColor(color) {
	var gameCode = getGameCode();

	getPlayerName((playerName) => {
		// Update user's ribbon color
		db.ref("game/" + gameCode).child("players/" + playerName).update({
			ribbonColor: color
		});
	});
};

// Handle click event for all elements named "box"
document.getElementsByName("box").forEach((box) => {
  box.addEventListener('click', event => {
    chooseBoxColor(box.value);
  });
});

// Handle click events for all elements named "ribbon"
document.getElementsByName("ribbon").forEach((ribbon) => {
  ribbon.addEventListener('click', event => {
    chooseRibbonColor(ribbon.value);
  });
});

// Get roomSubmit element
var roomSubmit = document.getElementById("roomSubmit");

// Handle ready element click event
roomSubmit.addEventListener("click", (event) => {
	window.location.href = "./PrepareGift3.html"+location.search.substring();

	// var gameCode = getGameCode();

	// getPlayerName((playerName) => {
	// 	// Update user's ribbon color
	// 	db.ref("game/" + gameCode).child("players/" + playerName).on("value", (snapshot) => {
	// 		if (snapshot.val().boxColor === undefined || snapshot.val().ribbonColor === undefined) {
	// 			window.alert("Please choose a box and ribbon color");
	// 		} else {
	// 			window.location.href = "./PrepareGift3.html"+location.search.substring();
	// 		}
	// 	});
	// });
});