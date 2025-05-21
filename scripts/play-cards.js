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

  setCardHelper();
  setCardInfo();
}

function stackOpacity1(stack, cardString) {
  stack.forEach((card, i) => {
    const el = document.getElementById(`${cardString}${i}`);
    if (!el) return;

    const entry = currentCardStyles.find((s) => s.stackNr === i);
    const opacity = entry?.opacity ?? 1;
    el.style.opacity = opacity;
  });

  if (usedSpecials.length && cardString === "playerCard") {
    usedSpecials.forEach(({ index: stackNr }) => {
      const el = document.getElementById(`${cardString}${stackNr}`);
      if (!el) return;
      const entry = currentCardStyles.find((s) => s.stackNr === stackNr);
      const opacity = entry?.opacity ?? 0.5;
      el.style.opacity = opacity;
      el.style.pointerEvents = "none";
    });
  }
}

function toggleCardOpacity(stackNr) {
  if (stackNr == null) return;

  // 1) Hole *nur* das lokale <img> aus #playerStackID
  const playerContainer = document.getElementById("playerStackID");
  const clickedCard = playerContainer.querySelector(
    `.card[stackNr="${stackNr}"]`
  );
  if (!clickedCard) return;

  // 2) Toggle die Opacity
  const curOp = clickedCard.style.opacity == 1 ? 0.5 : 1;
  clickedCard.style.opacity = curOp;

  // 3) Wenn Du die Opacity weiter in Firebase schreibst:
  setCardOpacity(stackNr, curOp);
}

async function clickCardsforCombi() {
  isWaitingForCardClick = true;
  currentCardID = await waitForCardClick();
  isWaitingForCardClick = false;
  let currentCard = playerCards[currentCardID];
  let currentCardNr = currentCard.nr;
  if (cardCombi.includes(currentCard)) {
    currentInfoFunction = infoNoSameCards;
    showInfo(currentInfoFunction);
    return;
  }
  if (currentCardNr > 12) {
    currentInfoFunction = infoNoSpecials;
    showInfo(currentInfoFunction);
    playSound("failed", "buzzer-short", 0.4);
    clickAccount++;
    return;
  }
  if (currentCardNr <= 12) {
    toggleCardOpacity(currentCardID);
    cardCombi.push(currentCard);
    clickAccount++;
    return;
  }
}

async function setCardCombi() {
  stackOpacity1(playerCards, "playerCard");
  cardCombi = [];
  newCardOrder();
  btnGroup3();
  enablePlayerCards();
  clickAccount = 0;
  showInfo(currentInfoFunction);
  while (cardCombi.length < 3 && clickAccount < 5) {
    currentInfoFunction = infoSetCombi;
    await clickCardsforCombi();
  }
  if (cardCombi.length === 3) {
    disableCardClicks();
    separateNr();
    clickAccount = 0;
  }
  if (clickAccount === 5) {
    currentInfoFunction = infoNothinToChange;
    showInfo(currentInfoFunction);
    startRound();
    clickAccount = 0;
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
  } else if (choosenCards.filter((nr) => nr === 0).length === 2) {
    twoJoker();
  } else if (choosenCards.filter((nr) => nr === 0).length === 1) {
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
  let isDouble;
  if (
    choosenCards.includes(lowestTone + 4) &&
    choosenCards.includes(lowestTone + 7)
  ) {
    let prime = lowestTone; // lowestTone + gr.Terz + Quinte (Grundstellung)
    isDouble = playerAccords.some((acc) => acc.nr === prime);
    setAcc(prime, true, false, isDouble);
  } else if (
    choosenCards.includes(lowestTone + 5) &&
    choosenCards.includes(lowestTone + 9)
  ) {
    let prime = lowestTone + 5; // lowestTone + Quarte + gr.Terz (Quintstellung)
    isDouble = playerAccords.some((acc) => acc.nr === prime);
    setAcc(prime, true, false, isDouble);
  } else if (
    choosenCards.includes(lowestTone + 3) &&
    choosenCards.includes(lowestTone + 8)
  ) {
    let prime = lowestTone + 8; // lowestTone + gr.Terz + kl.Sexte (Terzstellung)
    isDouble = playerAccords.some((acc) => acc.nr === prime);
    setAcc(prime, true, false, isDouble);
  } else {
    playSound("failed", "backMag", 0.5);
    showWithTimeout(infoNoCombi, 4000);
  }
}

/*----------------- JOKER OPTIONS ---------------*/

function oneJoker() {
  //return numbers without 0 from global [choosenCards]
  let filteredArray = choosenCards.filter((num) => num !== 0);
  let lowTone = Math.min(...filteredArray);
  if (
    choosenCards.includes(lowTone + 4) ||
    choosenCards.includes(lowTone + 7)
  ) {
    prime = lowTone;
    let isDouble = playerAccords.some((acc) => acc.nr === prime);
    setAcc(prime, true, false, isDouble);
  }
  // Terzstellung (third position)
  else if (
    choosenCards.includes(lowTone + 3) ||
    choosenCards.includes(lowTone + 8)
  ) {
    if (choosenCards.includes(lowTone + 3)) {
      //fifth on top
      prime = lowTone - 4;
    }
    if (lowTone < 5) {
      prime = lowTone + 8; // octave on top
    }
    let isDouble = playerAccords.some((acc) => acc.nr === prime);
    setAcc(prime, true, false, isDouble);
  }
  // fifth position
  else if (
    choosenCards.includes(lowTone + 5) ||
    choosenCards.includes(lowTone + 9)
  ) {
    prime = lowTone + 5;
    let isDouble = playerAccords.some((acc) => acc.nr === prime);
    setAcc(prime, true, false, isDouble);
  } else {
    currentInfoFunction = infoNoCombi;
    showInfo(currentInfoFunction);
    setTimeout(() => {
      setCardCombi();
    }, 4000);
  }
}

function twoJoker() {
  let thisNr = choosenCards.find((nr) => nr !== 0); //the only real tone
  let nrToThird;
  let nrToFifth;
  let nrToPrime = allMaj.find((chord) => chord["nr"] === thisNr);

  if (thisNr) {
    if (thisNr > 4) {
      nrToThird = allMaj.find((chord) => chord["nr"] === thisNr - 4);
    } else {
      nrToThird = allMaj.find((chord) => chord["nr"] === thisNr + 8);
    }

    if (thisNr <= 7) {
      nrToFifth = allMaj.find((chord) => chord["nr"] === thisNr + 5);
    } else {
      nrToFifth = allMaj.find((chord) => chord["nr"] === thisNr - 7);
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
  openCardPopup();
  let popup = document.querySelector(".popup");
  for (let i = 0; i < accOffer.length; i++) {
    let card = accOffer[i];
    let isDouble = playerAccords.some((acc) => acc.nr === card.nr);
    let cardInStack = allMaj.find((acc) => acc.nr === card.nr);
    let isEmptyAmount = cardInStack.amount === 0;
    //popup.innerHTML += `<img class="pop-card" src="${card['src']}" onclick="setAcc(${card.nr}, true, false, ${isDouble}); closePopup();">`;
    let cardHTML = `
    <img class="pop-card" src="${card["src"]}" 
    onclick="${
      isEmptyAmount
        ? "showWithTimeout(infoAccEmpty, 4000)"
        : `setAcc(${card.nr}, true, false, ${isDouble}); closePopup();`
    }" 
    style="opacity: ${isEmptyAmount ? 0.3 : 1};">`;
    popup.innerHTML += cardHTML;
  }
}

function showEmpty() {
  let text = document.getElementById("emptyAcc");
  text.style.display = "flex";
  setTimeout(() => {
    text.style.display = "none";
  }, 2000);
}

/**
 * sort all Accs in circle
 * sort in circleNr-direction
 */
function threeJoker() {
  openCardPopup();
  let popup = document.querySelector(".popup");
  popup.classList.add("allCards");
  let sortedMaj = allMaj.slice().sort((a, b) => a.circleNr - b.circleNr);

  sortedMaj.forEach((card, index) => {
    let angle = card.circleNr * 30 + 270;
    let isDouble = playerAccords.some((acc) => acc.nr === card.nr);
    let isEmptyAmount = card.amount === 0;
    if (isEmptyAmount) {
      popup.innerHTML += /*html*/ `
        <div class="flex-column card-item" style="transform: rotate(${angle}deg) translate(150px) rotate(-${angle}deg);">
          <img class="pop-circle-card" src="${card["src"]}" onclick="showWithTimeout(infoAccEmpty, 4000); playSound('failed', 'buzzer-short', 0.5); showEmpty()">          
        </div>
        <div style="position: absolute; z-index: 1000;">
        <span class="empty-acc" id="emptyAcc">empty</span>
        </div>`;
    } else {
      popup.innerHTML += /*html*/ `
        <div class="card-item" style="transform: rotate(${angle}deg) translate(150px) rotate(-${angle}deg);">
          <img class="pop-circle-card" src="${card["src"]}" onclick="setAcc(${card.nr}, true, false, ${isDouble}); closePopup();">
        </div>`;
    }
  });
}

/*---------------- SPECIAL-CARD FUNCTIONS -----------------*/

/**
 * let currentSpecial be the clicked element
 * set all usedSpecials.pointerEvents to none
 * @param {string} mySpecial
 */
function separateSpecial(mySpecial) {
  for (let i = 0; i < playerCards.length; i++) {
    let cardTitle = playerCards[i].title;
    if (cardTitle === mySpecial) {
      currentSpecial = docID(`playerCard${i}`);
      if (usedSpecials.some((special) => special.index === i)) {
        continue;
      } else {
        currentSpecial.stackNr = i;
        currentSpecial.style.opacity = 0.5;
        currentSpecial.style.pointerEvents = "none";
        usedSpecials.push({ card: currentSpecial, index: i });
        break;
      }
    }
  }
  usedSpecials.forEach((special) => {
    if (special.element) {
      special.element.style.pointerEvents = "none";
    }
  });
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
  document.getElementById(`playerCard${card1Index}`).src =
    playerCards[card1Index].src;
  document.getElementById(`observerCard${card2Index}`).src =
    observerCards[card2Index].src;
}

async function useMellot() {
  playSound("tone", "mellot", 0.5);
  disableCardClicks();
  specialInProgress = true;
  enablePlayerCards();
  separateSpecial("mellot");
  mellotArray = []; //to define the two cards for change
  currentInfoFunction = infoToGiveCard;
  showInfo(currentInfoFunction);
  btnGroup3();
  await waitForCardClick();
  if (mellotArray.length === 0) {
    toggleCardOpacity(currentCardID);
  }
  let firstClickedIndex = currentCardID;
  if (mellotArray.length === 0) {
    mellotArray.push(playerCards[currentCardID]);
  }
  currentInfoFunction = infoToTakeCard;
  showInfo(currentInfoFunction);
  enableObserverCards();
  await waitForCardClick();
  //in case of a 'step back' after first click and start useMellot() again function jumps to mellotArray.push(observerCards[currentCardID]); otherwise.
  if (mellotArray.length === 1) {
    mellotArray.push(observerCards[currentCardID]);
  } else if (mellotArray.length === 0) {
    mellotArray.push(playerCards[currentCardID]);
    firstClickedIndex = currentCardID;
  }
  toggleCardOpacity(firstClickedIndex);
  changeMellotCards();
  specialInProgress = false;
  newCardOrder();
  btnGroup2();
}

/**
 * onclick="chooseAccord(${i}, ${j}, 'player') = circle, circleNr, part
 */
function useGoblin() {
  if (observerAccords.length === 0) {
    showWithTimeout(goblinRules, 6000, infoPlayCards);
    return;
  }
  tryGoblinStrike = true;
  playSound("tone", "goblin", 0.5);
  separateSpecial("goblin");
  disableAccClicks();
  enableObserverAccordClicks();
  currentInfoFunction = infoUseGoblin;
  showInfo(currentInfoFunction);
  btnGroup3();
  specialInProgress = true;
}

function useWizzard() {
  playSound("tone", "wizzard", 0.5);
  if (observerAccords.length === 0 || playerAccords.length === 0) {
    showWithTimeout(wizzardRules, 6000, infoPlayCards);
    return;
  }
  tryWizzardStrike = true;
  separateSpecial("wizzard");
  disableAccClicks();
  enableObserverAccordClicks();
  currentInfoFunction = infoUseWizzard;
  showInfo(currentInfoFunction);
  btnGroup3();
  specialInProgress = true;
}
