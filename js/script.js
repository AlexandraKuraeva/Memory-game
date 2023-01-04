"use strict"

const modal = document.querySelector('.modal')
const modalOverlay = document.querySelector('.modal-overlay');
const restartBtn = document.querySelector(".restart");
const gameTable = document.querySelector(".game__table");
const cardsArr = []

if (!modal || !modalOverlay || !restartBtn || !gameTable) throw new Error('Необходимые для приложения элементы отсутвтуют')

// Логика  игры
let cardsChosenArr = [];// Выбранные карточки
let cardsChosenArrId = [];// Идентефикаторы выбранных карточек
let quantityOfCards = []; //Количество выбранных карточек
let cardsOpen = []; //Открытые зеленые карты

async function requestData() {
	const request = await fetch('../db.json')
	const data = await request.json()
	cardsArr.push(...data)
}

function game() {

	if (!gameTable || !gameTable || !restartBtn) return


	for (let i = 0; i < cardsArr.length; i++) {

		const imgCard = document.createElement('img');
		imgCard.setAttribute("id", String(i));
		imgCard.setAttribute("src", '../img/0.jpg');
		imgCard.setAttribute("class", "game__card");
		imgCard.addEventListener("click", flipCard);

		gameTable.appendChild(imgCard);
	}

	cardsArr.sort(() => { 				//randomizer
		return 0.5 - Math.random()
	});

	restartBtn.addEventListener("click", () => {
		location.reload();
	});

}

function checkForMatch() {
	const cards = document.querySelectorAll('img');

	const id1 = cardsChosenArrId[0];
	const id2 = cardsChosenArrId[1];

	//Найдено соответствие 
	if (cardsChosenArr[0] === cardsChosenArr[1] && id1 !== id2) {
		quantityOfCards = [];
		cards[id1].classList.add('open');
		cards[id2].classList.add('open');
		//Удалить с карточки событие click
		cards[id1].removeEventListener("click", flipCard);
		cards[id2].removeEventListener("click", flipCard);
		//Добавить элемент в массив открытых карт
		cardsOpen.push(cards[id1]);
		cardsOpen.push(cards[id2]);

		//если открыты все карты 
		if (cardsOpen.length === cardsArr.length) {
			showModal();
		}
	} else {
		//если карты не совпали
		quantityOfCards = [];
		cards[id1].setAttribute("src", "img/0.jpg");
		cards[id2].setAttribute("src", "img/0.jpg");
		cards[id1].classList.remove('flip');
		cards[id2].classList.remove('flip');

		cards[id1].addEventListener("click", flipCard);
		cards[id2].addEventListener("click", flipCard);

	}
	//Clear the arrays
	cardsChosenArr = [];
	cardsChosenArrId = [];
}


function flipCard() {
	quantityOfCards.push(this);
	if (quantityOfCards.length > 2) {
		return
	}

	let cardId = this.getAttribute("id");
	cardsChosenArr.push(cardsArr[cardId].imgName);
	cardsChosenArrId.push(cardId);

	//записать в src путь к картинке
	this.setAttribute("src", cardsArr[cardId].imgPath);

	if (cardsChosenArr.length === 2) {
		setTimeout(checkForMatch, 1000)
	}

	this.classList.add('flip');
	this.removeEventListener("click", flipCard);
}

function showModal() {
	if (!modal || !modalOverlay) return;
	modal.classList.add('show');
	modalOverlay.classList.add('show');
}

requestData()
	.then(game)

