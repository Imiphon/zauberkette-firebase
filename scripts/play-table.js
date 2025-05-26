function setCardInfo() {
  let cardInfoFrames = document.querySelectorAll(".card-info-frame");
  cardInfoFrames.forEach(function (cardInfoFrame) {
    let info = document.getElementById("infoTextID");
    let savedText = info.innerHTML;
    cardInfoFrame.addEventListener("mouseenter", function () {
      currentInfoFunction = optAccInfoText;
      showInfo(currentInfoFunction);
    });

    cardInfoFrame.addEventListener("mouseleave", function () {
      let info = document.getElementById("infoTextID");
      info.innerHTML = savedText; //set back original text
    });
  });
}

/**
 * infoMellotText()
 * @param {string} special id-name of special container
 */
function setSpecialInfo(special) {
  let info = document.getElementById("infoTextID");
  let specialInfo = document.getElementById(special);
  let savedText = info.innerHTML;
  let funcName = special + "Text";

  specialInfo.addEventListener("mouseenter", function () {
    if (typeof window[funcName] === "function") {
      currentInfoFunction = window[funcName];
      showInfo(currentInfoFunction);
      //showInfo(window[funcName]());
    } else {
      console.error(`Funktion ${funcName} ist nicht definiert.`);
    }
  });

  specialInfo.addEventListener("mouseleave", function () {
    let info = document.getElementById("infoTextID");
    info.innerHTML = savedText;
  });
}

/**
 * add new random card into the playerCards and
 * old card is getting amount++ in allTones[]
 * give back new card after 1500
 */
async function changeCard(stackID) {
  const id = typeof stackID === "number" ? stackID : currentCardID;
  const oldCardNr = playerCards[id].nr;
  const newCard = randomStack(oldCardNr);
  let allTonesUpdate = allTones.find((card) => card.nr === oldCardNr);
  const cardElement = docID(`playerCard${id}`);

  let curOp = (cardElement.style.opacity = 0.5);
  setCardOpacity(id, curOp);
  await new Promise((resolve) => setTimeout(resolve, 1500));
  curOp = cardElement.style.opacity = 1;
  setCardOpacity(id, curOp);
  if (allTonesUpdate) {
    allTonesUpdate.amount++;
  }
  playerCards[id] = newCard;
  cardElement.src = newCard.src;
  renderStack("playerCard", "playerStackID");
  disableCardClicks();
  setCardHelper();
  setCardInfo();
  if (newCard.nr === oldCardNr) {
    await showWithTimeout(changeSameCard, 3000);
  }
  btnGroup2();
}

function randomStack(oldCardNr) {
  // nur Typen, die noch >0 haben
  const available = allTones.filter((c) => c.amount > 0);
  if (!available.length) return null;
  // optional alter Typ rausfiltern
  const choices =
    available.length > 1
      ? available.filter((c) => c.nr !== oldCardNr)
      : available;
  const pick = choices[Math.floor(Math.random() * choices.length)];
  pick.amount--;
  return { ...pick, amount: 1 };
}

let deck = allTones.slice(); // initial alle Karten-Objekte
let discard = [];

function shuffle(a) {
  /* Fisher-Yates */
}

function drawCard() {
  if (!deck.length) {
    deck = discard.splice(0);
    shuffle(deck);
  }
  const c = deck.pop();
  discard.push(c);
  return c;
}
function changeWinnerCards() {
  const stackIDs = cardCombi.map((c) => c.stackNr);
  stackIDs.forEach(fadeToSpell);

  noBtns();
  currentInfoFunction = infoWinMagic;
  showInfo(currentInfoFunction);

  setTimeout(() => {
    // Inline-async IIFE, to use await
    (async () => {
      for (const id of stackIDs) {
        await changeCard(id);
        cardCombi.find((c) => c.stackNr === id).stackNr = -1;
      }
      finishRound();
    })();
  }, 2000);
}

function fadeToSpell(cardID) {
  const cardElement = document.getElementById(`playerCard${cardID}`);
  if (!cardElement) {
    console.error(`Kein Element mit ID 'playerCard${cardID}' gefunden.`);
    return;
  }

  // 1) definiere und setze Deine Opacity
  const newOpacity = 0.5;
  cardElement.style.opacity = newOpacity;

  // 2) pushe das in Firestore
  setCardOpacity(cardID, newOpacity);

  // 3) zaubere das Overlay
  const spellImage = document.createElement("img");
  spellImage.src = "assets/images/specials/spell.png";
  spellImage.classList.add("spell-overlay");
  const parentElement = cardElement.parentElement;
  if (window.getComputedStyle(parentElement).position === "static") {
    parentElement.style.position = "relative";
  }
  parentElement.appendChild(spellImage);
}


/*------------------------------- CLICK CARD STUFF -------------------------------*/

function stepBack() {
  if (specialInProgress) {
    let special = usedSpecials.pop();
    special.card.style.opacity = 1;
    specialInProgress = false;
    mellotArray = [];
    tryWizzardStrike = false;
    tryGoblinStrike = false;
  }
  if (cardClickHandler) {
    document.removeEventListener("click", cardClickHandler);
    cardClickHandler = null;
  }
  if (isAwaitChangeCard) {
    btnGroup1();
  } else {
    btnGroup2();
  }
  stackOpacity1(playerCards, "playerCard");
  setBackArrays();
  setBackBooleans();
  playSound("failed", "backMag", 0.5);
  disableCardClicks();
  uploadGameData(); 
}

function enablePlayerCards() {
  const styledCards = document.querySelectorAll("#playerStackID .card");
  styledCards.forEach((card) => {
    card.style.pointerEvents = "auto"; //still neccassary?
    card.classList.add("active");
  });
}

function enableObserverCards() {
  const styledCards = document.querySelectorAll("#observerStackID .card");
  styledCards.forEach((card) => {
    card.style.pointerEvents = "auto"; //still neccassary?
    card.classList.add("active");
  });
}

function disableCardClicks() {
  const styledCards = document.querySelectorAll(".card");
  styledCards.forEach((card) => {
    card.style.pointerEvents = "none"; //still neccassary?
    card.classList.remove("active");
    card.removeEventListener("click", getCardInfo); //still neccassary?
  });
}

//Index of current clicked card
function getCardInfo(i) {
  currentCardID = i; // Set glob arr
}

function enableObserverAccordClicks() {
  const styledCards = document.querySelectorAll(
    "#obsCircle1 .accCard, #obsCircle2 .accCard"
  );
  styledCards.forEach((accordCard) => {
    accordCard.style.pointerEvents = "auto";
  });
}

function enablePlayerAccordClicks() {
  const styledCards = document.querySelectorAll(
    "#playerCircle1 .accCard, #playerCircle2 .accCard"
  );
  styledCards.forEach((accordCard) => {
    accordCard.style.pointerEvents = "auto";
  });
}

function disableAccClicks() {
  const styledCards = document.querySelectorAll(".accCard");
  styledCards.forEach((card) => {
    card.style.pointerEvents = "none";
    card.removeEventListener("click", getCardInfo);
  });
}

async function awaitChangeCard() {
  isAwaitChangeCard = true;
  enablePlayerCards(); // getCardInfo activ
  currentInfoFunction = infoChange;
  showInfo(currentInfoFunction);
  btnGroup3();
  currentCardID = await waitForCardClick();
  await changeCard();
  title = playerCards[currentCardID]["title"];
  playSound("tone", title, 0.3);
  currentCardID = -1;
  isAwaitChangeCard = false;
  uploadGameData();
}

let isWaitingForCardClick = false;
let waitForCardClickResolve;

function waitForCardClick() {
  isWaitingForCardClick = true;
  return new Promise((resolve) => {
    waitForCardClickResolve = resolve;
  });
}

//Parameters with ()
function showInfo(infoContent) {
  let info = docID("infoTextID");
  if (!info) {
    console.log("found not the info div");
    return;
  }
  info.innerHTML = "";
  if (typeof infoContent === "function") {
    infoContent = infoContent();
  }
  info.innerHTML += infoContent;
  // Set the animation directly via JavaScript
  info.style.animation = "none";
  info.offsetHeight; // Trigger reflow
  info.style.animation = null; // Reset die Animation
  info.style.animation = "yellowNameFade 4s forwards";
}

/**
 * takes function references so parameters without ()
 * @param {*} func
 * @param {*} timeout
 * @param {*} optFunc
 * @returns
 */
function showWithTimeout(func, timeout, optFunc) {
  currentInfoFunction = func;
  showInfo(currentInfoFunction);
  //showInfo(func());
  return new Promise((resolve) => {
    setTimeout(() => {
      if (optFunc) {
        currentInfoFunction = optFunc;
        showInfo(currentInfoFunction);
        //showInfo(optFunc());
      }
      resolve();
    }, timeout);
  });
}

/**
 * Vergleicht neue
 */
function youWin(part, length) {
  let idName = part === "player" ? "playNameID" : "obsNameID";
  let element = document.getElementById(idName);
  if (element) {
    let name = element.textContent;
    currentInfoFunction = playerWin;
    showInfo(currentInfoFunction(name, length));
    //showInfo(playerWin(name, length));
    isWinner = true;
    //alert(name + ' gewinnt mit einer Kettenzahl von: ' + length);
  } else {
    console.error('Element with ID "' + idName + '" not found.');
  }
}
