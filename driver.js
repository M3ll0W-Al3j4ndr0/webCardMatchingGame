const gameBoard = document.querySelector(".gameBoard");
const cardFaces = ['😅', '👍', '🐵', '🙀', '💪', '💅', '👖', '🦊', '🐰'];
let cards = [];
let firstCard, 
	secondCard;
let lockBoard = false;
let score = 0,
	lives = 6;

document.querySelector(".score").textContent = score;
//document.querySelector(".lives").textContent = lives;

function drawLiveCounter(){
	let hearts = "";
	for(let i = 0; i < lives; i++){
		hearts += '❤️';
	}
	document.querySelector(".lives").textContent = hearts;
}

function createDeck(){
	cards = cardFaces.concat(cardFaces);
	
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

function checkForMatch() {
	let isMatch = firstCard.dataset.name === secondCard.dataset.name;

	if(isMatch){
		score++;
		document.querySelector(".score").textContent = score;
		disableCards();
		return;
	}
	else{
		updateLives();
	}

	unflipCards();
}

function updateLives(){
	lives--;
	drawLiveCounter();
	if(lives == 0){
		document.getElementsByClassName("gameOverPanel")[0]
		.style.display = "initial";
		disableAllCards();
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

function resetBoard() {
	firstCard = null;
	secondCard = null;
	lockBoard = false;
}

function restart() {
	resetBoard();
	createDeck();
	shuffleCards();
	score = 0;
	lives = 6;
	document.querySelector(".score").textContent = score;
	//document.querySelector(".lives").textContent = lives;
	drawLiveCounter();
	gameBoard.innerHTML = "";
	createCards();
	document.getElementsByClassName("gameOverPanel")[0]
	.style.display = "none";
}
