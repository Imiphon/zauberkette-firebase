function noChanges() {
  disableCardClicks();
  btnGroup2();
}

function newCardOrder() {
  for (let i = 0; i < playerCards.length; i++) {
    let newCard = playerCards[i];
    newCard.stackNr = i;
  }
  for (let j = 0; j < observerCards.length; j++) {
    let newCard = observerCards[j];
    newCard.stackNr = j;
  }
  renderStack("playerCard", "playerStackID");
  renderStack("observerCard", "observerStackID");
}

function stackOpacity1(stack, cardString) { //Kay -- Wieso der Name?
  for (let i = 0; i < stack.length; i++) {
    let card = document.getElementById(cardString + `${i}`);
    card.style.opacity = 1;
  }
  if (usedSpecials.length != 0 && cardString === 'playerCard') {
    usedSpecials.forEach(card => {
      let usedSpecial = stack.find(acc => acc.stackNr === card.stackNr);
      let element = document.getElementById(cardString + `${usedSpecial.stackNr}`);
      element.style.opacity = 0.5;
      element.style.pointerEvents = 'none';
    });
  }
}

function toggleCardOpacity(index) {
  if (index != undefined) {
    let clickedCard = document.getElementById(`playerCard${index}`);
    clickedCard.style.opacity = (clickedCard.style.opacity == 1) ? 0.5 : 1;
  } else return;
}

async function setCardCombi() {
  stackOpacity1(playerCards, 'playerCard');
  cardCombi = [];
  newCardOrder();
  btnGroup3();
  enablePlayerCards();
  while (cardCombi.length < 3 && clickAccount < 5) {
    await clickCardsforCombi();
    setTimeout(() => {
      showInfo(infoSetCombi());
    }, 2000);
  }
  if (cardCombi.length === 3) {
    disableCardClicks();
    separateNr();
    clickAccount = 0;
  }
  if (clickAccount === 5) {
    showInfo(infoNothinToChange());
    startRound();
    clickAccount = 0;
  }
}

async function clickCardsforCombi() {
  await waitForIndex();
  let currentCard = playerCards[clickedCardID];
  let currentCardNr = currentCard.nr;
  if (cardCombi.includes(currentCard)) {
    showInfo(infoNoSameCards());
    return;
  }
  if (currentCardNr > 12) {
    showInfo(infoNoSpecials());
    playSound('failed', 'buzzer-short', 0.4);
    clickAccount++;
    return;
  }
  if (currentCardNr <= 12) {
    toggleCardOpacity(clickedCardID);
    cardCombi.push(currentCard);
    clickAccount++;
    return;
  }
}

async function waitForIndex() {
  clickedCardID = -1;
  while (clickedCardID === -1) {
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
}

function separateNr() {
  choosenCards = [];
  for (let i = 0; i < cardCombi.length; i++) {
    let number = cardCombi[i]["nr"];
    choosenCards.push(number);
  }
  checkForJoker();
}

function checkForJoker() {
  if (choosenCards.filter((nr) => nr === 0).length === 3) {
    threeJoker();
  }
  else if (choosenCards.filter((nr) => nr === 0).length === 2) {
    twoJoker();
  }
  else if (choosenCards.filter((nr) => nr === 0).length === 1) {
    oneJoker();
  } else {
    //just normal tones
    checkRightCombi();
  }
}

/**
 * Finds prime of Accord and send it to setAcc
 * info for setAcc(prime, isNew, isObserver, isDouble);
 */
function checkRightCombi() {
  let lowestTone = Math.min(...choosenCards);
  let isDouble = playerAccords.some(acc => acc.nr === lowestTone);
  if (choosenCards.includes(lowestTone + 4) && choosenCards.includes(lowestTone + 7)) {
    let prime = lowestTone; // lowestTone + gr.Terz + Quinte (Grundstellung)
    setAcc(prime, true, false, isDouble);
  }
  else if (choosenCards.includes(lowestTone + 5) && choosenCards.includes(lowestTone + 9)) {
    let prime = lowestTone + 5; // lowestTone + Quarte + gr.Terz (Quintstellung)
    setAcc(prime, true, false, isDouble);
  }
  else if (choosenCards.includes(lowestTone + 3) && choosenCards.includes(lowestTone + 8)) {
    let prime = lowestTone + 8;  // lowestTone + gr.Terz + kl.Sexte (Terzstellung)
    setAcc(prime, true, false, isDouble);
  } else {
    playSound('failed', 'backMag', 0.5);
    showWithTimeout(infoNoCombi, 3000);
  }
}

/*----------------- JOKER OPTIONS ---------------*/

function oneJoker() {
  //return numbers without 0 from global [choosenCards]
  let filteredArray = choosenCards.filter((num) => num !== 0);
  let lowTone = Math.min(...filteredArray);
  if (choosenCards.includes(lowTone + 4) || choosenCards.includes(lowTone + 7)) {
    prime = lowTone;
    let isDouble = playerAccords.some(acc => acc.nr === prime);
    setAcc(prime, true, false, isDouble);
  }
  // Terzstellung (third position)
  else if (choosenCards.includes(lowTone + 3) || choosenCards.includes(lowTone + 8)) {
    if (choosenCards.includes(lowTone + 3)) { //fifth on top
      prime = lowTone - 4;
    } if (lowTone < 5) {
      prime = lowTone + 8; // octave on top
    }
    let isDouble = playerAccords.some(acc => acc.nr === prime);
    setAcc(prime, true, false, isDouble);
  }
  // fifth position
  else if (choosenCards.includes(lowTone + 5) || choosenCards.includes(lowTone + 9)) {
    prime = lowTone + 5;
    let isDouble = playerAccords.some(acc => acc.nr === prime);
    setAcc(prime, true, false, isDouble);
  } else {
    showInfo(infoNoCombi());
    setTimeout(() => {
      setCardCombi()
    }, 2000);
  }
}


function twoJoker() {
  let thisNr = choosenCards.find((nr) => nr !== 0); //the only real tone
  let nrToThird;
  let nrToFifth;
  let nrToPrime = allMaj.find((chord) => chord['nr'] === thisNr);

  if (thisNr) {
    if (thisNr > 4) {
      nrToThird = allMaj.find((chord) => chord['nr'] === thisNr - 4);
    } else {
      nrToThird = allMaj.find((chord) => chord['nr'] === thisNr + 8);
    }

    if (thisNr <= 7) {
      nrToFifth = allMaj.find((chord) => chord['nr'] === thisNr + 5);
    } else {
      nrToFifth = allMaj.find((chord) => chord['nr'] === thisNr - 7);
    }
    accOffer = [];
    accOffer.push(nrToPrime, nrToThird, nrToFifth);
    choiceAcc();
  }
}

/**
 * shows possible accords 
 */
function choiceAcc() {
  openCardPopup()
  let popup = document.querySelector('.popup');
  for (let i = 0; i < accOffer.length; i++) {
    let card = accOffer[i];
    let isDouble = playerAccords.some(acc => acc.nr === card.nr);
    let cardInStack = allMaj.find(acc => acc.nr === card.nr);
    let isEmptyAmount = cardInStack.amount === 0;
    //popup.innerHTML += `<img class="pop-card" src="${card['src']}" onclick="setAcc(${card.nr}, true, false, ${isDouble}); closePopup();">`;
    let cardHTML = `
    <img class="pop-card" src="${card['src']}" 
    onclick="${isEmptyAmount ? 'showWithTimeout(infoAccEmpty, 3000)' : `setAcc(${card.nr}, true, false, ${isDouble}); closePopup();`}" 
    style="opacity: ${isEmptyAmount ? 0.3 : 1};">`;
    popup.innerHTML += cardHTML;
  }

}

function threeJoker() {
  openCardPopup()
  let popup = document.querySelector('.popup');
  popup.classList.add('allCards');
  for (let i = 0; i < allMaj.length; i++) {
    let card = allMaj[i];
    let isDouble = playerAccords.some(acc => acc.nr === card.nr);
    let isEmptyAmount = card.amount === 0;
    if (isEmptyAmount) {
      card.style.opacity = 0.3;
      popup.innerHTML += `<img class="pop-card" src="${card['src']}" onclick="showWithTimeout(infoAccEmpty, 3000)">`;
    } else {
      popup.innerHTML += `<img class="pop-card" src="${card['src']}" onclick="setAcc(${card.nr}, true, false, ${isDouble}); closePopup();">`;
    }
  }
}

/*---------------- SPECIAL-CARD FUNCTIONS -----------------*/

/**
 * let currentSpecial be the clicked element
 * @param {string} mySpecial 
 */
function separateSpecial(mySpecial) {
  for (let i = 0; i < playerCards.length; i++) {
    let cardTitle = playerCards[i].title;
    if (cardTitle === mySpecial) {
      currentSpecial = docID(`playerCard${i}`);
      if (usedSpecials.includes(currentSpecial)) {
        continue;
      } else {
        currentSpecial.stackNr = i;
        currentSpecial.style.opacity = 0.5;
        currentSpecial.style.pointerEvents = 'none';
        usedSpecials.push(currentSpecial);
        break;
      }
    }
  }
}

/**
 * is changing choosen player- with observer-card
 * @returns if not both cards are clicked
 */
function changeMellotCards() {
  if (specialInProgress && mellotArray.length != 2) {
    return;
  }
  let card1Index = playerCards.indexOf(mellotArray[0]);
  let card2Index = observerCards.indexOf(mellotArray[1]);
  let temp = playerCards[card1Index];
  playerCards[card1Index] = observerCards[card2Index];
  observerCards[card2Index] = temp;
  document.getElementById(`playerCard${card1Index}`).src = playerCards[card1Index].src;
  document.getElementById(`observerCard${card2Index}`).src = observerCards[card2Index].src;
}
