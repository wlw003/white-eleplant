function chooseBoxColor(color) {
	// To-do
};

function chooseRibbonColor(color) {
	// To-do
};

document.querySelectorAll('.box').forEach((box) => {
  box.addEventListener('click', event => {
    chooseBoxColor(box.value);
  });
});

document.querySelectorAll('.ribbon').forEach((ribbon) => {
  ribbon.addEventListener('click', event => {
    chooseRibbonColor(ribbon.value);
  });
});