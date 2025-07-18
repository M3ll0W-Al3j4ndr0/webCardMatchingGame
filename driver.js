const cardFaces = ['😅', '👍', '🐵', '🙀', '💪', '💅', '👖', '🦊', '🐰'];
const scoreHTML = document.querySelector(".score"),
	gameOverPanel = document.querySelector(".gameOverPanel"),
	mainMenu = document.querySelector(".mainMenu"),
	gameMenuElements = document.querySelector(".gameMenuElements"),
	scoreBoard = document.querySelector(".scoreBoard"),
	gameBoard = document.querySelector(".gameBoard");
const WIN = true,
	LOSE = false;
const Mode = Object.freeze({
	EASY: 0,
	NORMAL: 1,
	HARD: 2
});
let cards = [];
let firstCard, 
	secondCard;
let lockBoard = false;
let score = 0,
	lives = 6;
let currentMode = Mode.NORMAL;
let cardElements;

function changeMode(newMode){
	currentMode = newMode;
	restart();
}

function restart() {
	score = 0;
	lives = 6;
	scoreHTML.textContent = score;
	gameBoard.innerHTML = "";
	gameOverPanel.style.display = "none";
	mainMenu.style.display = "none";
	gameMenuElements.style.display = "initial";
	scoreBoard.style.display = "flex";

	resetBoard();
	createDeck();
	setBoardSize();
	shuffleCards();
	drawLiveCounter();
	createCards();
	flipAllCards();
	unflipAllCards();
}

function resetBoard() {
	firstCard = null;
	secondCard = null;
	lockBoard = false;
}

function createDeck(){
	if(currentMode == Mode.EASY){
		cards = cardFaces.slice(0, 6);
		cards = cards.concat(cards);
	}
	else if(currentMode == Mode.NORMAL){
		cards = cardFaces.slice(0, 8);
		cards = cards.concat(cards);
	}
	else{
		cards = cardFaces.concat(cardFaces);
	}
}

function setBoardSize(){
	gameBoard.style.gridTemplateColumns = currentMode == Mode.HARD? 
		"repeat(6, auto)":
		"repeat(4, auto)";
}

//using the Fisher-Yates shuffle algorithm to shuffle the cards
function shuffleCards() {
	  let currentIndex = cards.length,
		    randomIndex,
		    temporaryValue;
	  while (currentIndex !== 0) {
		    randomIndex = Math.floor(Math.random() * currentIndex);
		    currentIndex -= 1;
		    temporaryValue = cards[currentIndex];
		    cards[currentIndex] = cards[randomIndex];
		    cards[randomIndex] = temporaryValue;
	  }
}

function drawLiveCounter(){
	let hearts = "";
	for(let i = 0; i < lives; i++){
		hearts += '❤️';
	}
	document.querySelector(".lives").textContent = hearts;
}

function createCards() {
	for (let card of cards) {
		const cardElement = document.createElement("div");
		cardElement.classList.add("card");
		cardElement.setAttribute("data-name", card);
		cardElement.innerHTML = `
			<div class="front"> 
				<p class="cardPicture">${card}</p>
			</div>
			<div class="back"></div>`;
		cardElement.addEventListener("click", flipCard);
		gameBoard.appendChild(cardElement);
	  }
	cardElements = document.getElementsByClassName("card");
}

function flipAllCards(){
	for(let card of cardElements){
		card.classList.add("flipped");
	}
}

function unflipAllCards(){
	for(let card of cardElements){
		setTimeout(() => {
			card.classList.remove("flipped");
		}, 750);
	}
}


function flipCard() {
	if (lockBoard) {
		return;
	}
		
	if (this === firstCard) {
		return;
	}

	this.classList.add("flipped");

	if (!firstCard) {
		firstCard = this;
		return;
	}

	secondCard = this;
	lockBoard = true;

	checkForMatch();
}

function checkForMatch() {
	let isMatch = firstCard.dataset.name === secondCard.dataset.name;

	if(isMatch){
		score++;
		scoreHTML.textContent = score;
		disableCards();
		checkForWin();
		return;
	}
	else{
		updateLives();
	}

	unflipCards();
}

function disableCards() {
	firstCard.removeEventListener("click", flipCard);
	secondCard.removeEventListener("click", flipCard);

	resetBoard();
}

function checkForWin(){
	let isWinner = false;
	if(currentMode == Mode.EASY && score == 6){
		isWinner = true;
	}
	else if (currentMode == Mode.NORMAL && score == 8){
		isWinner = true;
	}
	else if(currentMode == Mode.HARD && score == 9){
		isWinner = true;
	}

	if(isWinner){
		showGameOverPanel(WIN);
	}
}

function showGameOverPanel(isWinner){
	gameOverPanel.style.display = "initial";
	disableAllCards();

	const panelText = document.getElementById("gameOverText");
	
	if(isWinner){
		panelText.innerHTML = "Congratulations! A winner is you!";
	}
	else{
		panelText.innerHTML = "Game Over";
	}
}

function disableAllCards(){
	for  (let card of cardElements){
		card.removeEventListener("click", flipCard);
	}
}

function updateLives(){
	lives--;
	drawLiveCounter();
	if(lives == 0){
		showGameOverPanel(LOSE);
	}

}

function unflipCards() {
	setTimeout(() => {
		firstCard.classList.remove("flipped");
		secondCard.classList.remove("flipped");
		resetBoard();
	}, 500);
}

function toMainMenu(){
	mainMenu.style.display = "initial";
	gameMenuElements.style.display = "none";
	gameOverPanel.style.display = "none";
	scoreBoard.style.display = "none";
	gameBoard.innerHTML = "";
}
