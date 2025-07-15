const gameBoard = document.querySelector(".gameBoard");
const cardFaces = ['😅', '👍', '🐵', '🙀', '💪', '💅', '👖', '🦊', '🐰'];
let cards = [];
let firstCard, 
	secondCard;
let lockBoard = false;
let score = 0,
	lives = 6;

const Mode = Object.freeze({
	EASY: 0,
	NORMAL: 1,
	HARD: 2
});

const WIN = true,
	LOSE = false;

let currentMode = Mode.NORMAL;
document.querySelector(".score").textContent = score;

function changeMode(newMode){
	currentMode = newMode;
	restart();
}
function drawLiveCounter(){
	let hearts = "";
	for(let i = 0; i < lives; i++){
		hearts += '❤️';
	}
	document.querySelector(".lives").textContent = hearts;
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
	let board = document.querySelector(".gameBoard");

	if(currentMode == Mode.HARD){
		board.style.gridTemplateColumns = "repeat(6, auto)";
	}
	else{
		board.style
		.gridTemplateColumns = "repeat(4, auto)";
	}
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

function flipAllCards(){
	let cardElements = document.getElementsByClassName("card");
	for(let card of cardElements){
		card.classList.add("flipped");
	}
}
function checkForMatch() {
	let isMatch = firstCard.dataset.name === secondCard.dataset.name;

	if(isMatch){
		score++;
		document.querySelector(".score").textContent = score;
		disableCards();
		checkForWin();
		return;
	}
	else{
		updateLives();
	}

	unflipCards();
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

function updateLives(){
	lives--;
	drawLiveCounter();
	if(lives == 0){
		showGameOverPanel(LOSE);
	}

}

function showGameOverPanel(isWinner){
	document.getElementsByClassName("gameOverPanel")[0]
	.style.display = "initial";
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
	const cardElements = document.getElementsByClassName("card");
	for  (let card of cardElements){
		card.removeEventListener("click", flipCard);
	}
}

function disableCards() {
	firstCard.removeEventListener("click", flipCard);
	secondCard.removeEventListener("click", flipCard);

	resetBoard();
}

function unflipCards() {
	setTimeout(() => {
		firstCard.classList.remove("flipped");
		secondCard.classList.remove("flipped");
		resetBoard();
	}, 500);
}

function unflipAllCards(){
	const cardElements = document.getElementsByClassName("card");
	for(let card of cardElements){
		setTimeout(() => {
			card.classList.remove("flipped");
		}, 500);
	}
}

function resetBoard() {
	firstCard = null;
	secondCard = null;
	lockBoard = false;
}

function restart() {
	resetBoard();
	createDeck();
	setBoardSize();
	shuffleCards();
	score = 0;
	lives = 6;
	document.querySelector(".score").textContent = score;
	drawLiveCounter();
	gameBoard.innerHTML = "";
	createCards();
	document.getElementsByClassName("gameOverPanel")[0]
	.style.display = "none";
	document.querySelector(".mainMenu").style.display = "none";
	document.querySelector(".gameMenuElements").style.display = "initial";
	flipAllCards();
	unflipAllCards();
}

function toMainMenu(){
	document.querySelector(".mainMenu").style.display = "initial";
	document.querySelector(".gameMenuElements").style.display = "none";
	document.querySelector(".gameOverPanel").style.display = "none";
	gameBoard.innerHTML = "";
}
