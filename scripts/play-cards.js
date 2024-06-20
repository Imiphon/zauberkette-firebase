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

//Finds prime of Accord and send it to setAcc
function checkRightCombi() {
  let x = Math.min(...choosenCards);
  // x + gr.Terz + Quinte (Grundstellung)
  if (choosenCards.includes(x + 4) && choosenCards.includes(x + 7)) {
    console.log("Grundstellung");
    let prime = x;
    setAcc(prime, true);
  }
  // x + Quarte + gr.Terz (Quintstellung)
  else if (choosenCards.includes(x + 5) && choosenCards.includes(x + 9)) {
    console.log("Quintstellung");
    let prime = x + 5;
    setAcc(prime, true);
  }
  // x + gr.Terz + kl.Sexte (Terzstellung)
  else if (choosenCards.includes(x + 3) && choosenCards.includes(x + 8)) {
    console.log("Terzstellung");
    let prime = x + 8;
    setAcc(prime, true);
  } else {
    playSound('failed', 'backMag', 0.5);
    debugger
    showInfo(infoNoCombi());
    setTimeout(() => {
      setCardCombi()
    }, 2000);
  }
}

/*----------------- JOKER OPTIONS ---------------*/

function oneJoker() {
  //return numbers without 0 from global [choosenCards]
  let filteredArray = choosenCards.filter((num) => num !== 0);
  let x = Math.min(...filteredArray);
  // initial(commonChord)
  if (choosenCards.includes(x + 4) || choosenCards.includes(x + 7)) {
    let prime = x;
    setAcc(prime, true);
  }
  // Terzstellung (third position)
  else if (choosenCards.includes(x + 3) || choosenCards.includes(x + 8)) {
    if (choosenCards.includes(x + 3)) { //fifth on top
      prime = x - 4;
    } if (x < 5) {
      prime = x + 8; // octave on top
    }
    setAcc(prime, true);
  }
  // fifth position
  else if (choosenCards.includes(x + 5) || choosenCards.includes(x + 9)) {
    prime = x + 5;
    setAcc(prime, true);
  } else {
    showInfo(infoNoCombi());
    setTimeout(() => {
      setCardCombi()
    }, 2000);
  }
}

//funktioniert! Muss aber noch Hinweis ins Popup "Wähle einen Akkord aus."
function twoJoker() {
  let thisNr = choosenCards.find((nr) => nr !== 0);
  //this Nr is going to be the third of the chord
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

function choiceAcc() {
  openCardPopup()
  let popup = document.querySelector('.popup');
  for (let i = 0; i < accOffer.length; i++) {
    let card = accOffer[i];
    popup.innerHTML += `<img class="pop-card" src="${card['src']}" onclick="setAcc(${card.nr}, true); closePopup();">`;
  }
}

function threeJoker() {
  openCardPopup()
  let popup = document.querySelector('.popup');
  popup.classList.add('allCards');
  for (let i = 0; i < allMaj.length; i++) {
    let card = allMaj[i];
    popup.innerHTML += `<img class="all-pop-card" src="${card['src']}" onclick="setAcc(${card.nr}, true); closePopup();">`;
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
