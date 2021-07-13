function chooseBoxColor(color) {
	var gameCode = getGameCode();

	getPlayerName((playerName) => {
		// Update user's box color
		db.ref("game/" + gameCode).child("players/" + playerName).set({
			boxColor: color
	  });
	});
};

function chooseRibbonColor(color) {
	var gameCode = getGameCode();

	getPlayerName((playerName) => {
		// Update user's ribbon color
		db.ref("game/" + gameCode).child("players/" + playerName).set({
			ribbonColor: color
		});
	});
};

// Handle all box class elements click event
document.querySelectorAll('.box').forEach((box) => {
  box.addEventListener('click', event => {
    chooseBoxColor(box.value);
  });
});

// Handle all ribbon class elements click event
document.querySelectorAll('.ribbon').forEach((ribbon) => {
  ribbon.addEventListener('click', event => {
    chooseRibbonColor(ribbon.value);
  });
});