
function setCardInfo() {
  let cardInfoFrames = document.querySelectorAll('.card-info-frame');
  cardInfoFrames.forEach(function (cardInfoFrame) {
    let info = document.getElementById('infoTextID');
    let savedText = info.innerHTML;
    cardInfoFrame.addEventListener('mouseenter', function () {
      showInfo(optAccInfoText());
    });

    cardInfoFrame.addEventListener('mouseleave', function () {
      let info = document.getElementById('infoTextID');
      info.innerHTML = savedText; //set back original text
    });
  });
}

/**
 * infoMellotText()
 * @param {string} special id-name of special container
 */
function setSpecialInfo(special) {
  let info = document.getElementById('infoTextID');
  let specialInfo = document.getElementById(special);
  let savedText = info.innerHTML;
  let funcName = special + 'Text'; 

  specialInfo.addEventListener('mouseenter', function () {
    if (typeof window[funcName] === 'function') {
      showInfo(window[funcName]()); 
    } else {
      console.error(`Funktion ${funcName} ist nicht definiert.`);
    }
  });

  specialInfo.addEventListener('mouseleave', function () {
    let info = document.getElementById('infoTextID');
    info.innerHTML = savedText;
  });
}

/**
 * add new random card into the playerCards and 
 * old card is getting amount++ in allTones[]
 */
async function changeCard() {
  let newCard = randomStack(); // get randomNewCard with amount:1 --Kay-- or height
  let oldNr = playerCards[currentCardID]['nr']; //  Selected card.nr
  let allTonesUpdate = allTones.find((card) => card.nr === oldNr); // Kay -- work it correct?
  if (allTonesUpdate) {
    allTonesUpdate.amount++;
  } 
  playerCards[currentCardID] = newCard; // Kay -- add card to player cards
  let cardElement = docID(`playerCard${currentCardID}`);
  cardElement.src = newCard.src; //all infos include
  renderStack("playerCard", "playerStackID"); //Kay --render the player Stack
  disableCardClicks(); //Kay --remove Pointer and Click-eventlistener of 
  setCardHelper();
  setCardInfo();
  if (newCard.nr === oldNr) {
    await showWithTimeout(changeSameCard, 3000);
  } 
    btnGroup2(); 
}

function randomStack() {
  let availableCards = allTones.filter(card => card.amount > 0);
  let randomIndex = Math.floor(Math.random() * availableCards.length);
  let randomCard = availableCards[randomIndex];

  do { //Kay -- nutzt man noch do 
    randomIndex = Math.floor(Math.random() * allTones.length);
    randomCard = allTones[randomIndex];

    if (randomCard.amount >= 1) {
      let newAmount = 1; // set amount for userCard to 1
      allTones[randomIndex].amount -= 1; // reduce  amount in allTones - 1
      return { ...randomCard, amount: newAmount };
    }   //repeat process 
  } while (randomCard === null || randomCard.amount === 0);
}

function changeWinnerCards() { // Kay -- cards combine to magic card. 
  for (i = 0; i < cardCombi.length; i++) {
    currentCardID = cardCombi[i].stackNr;
    changeCard();
    cardCombi[i].stackNr = -1;
  }
  noBtns(); //Kay reset all Button style
  showInfo(infoWinMagic());
  setTimeout(() => {
    finishRound();
  }, 7000);
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
  if (isAwaitChangeCard) {
    if (cardClickHandler) {
      document.removeEventListener('click', cardClickHandler);
      cardClickHandler = null;
    }
    btnGroup1();
  } else {
    btnGroup2();
  }
  stackOpacity1(playerCards, 'playerCard');
  setBackArrays();
  setBackBooleans();
  playSound('failed', 'backMag', 0.5);
  disableCardClicks();
}

function enablePlayerCards() {
  const styledCards = document.querySelectorAll('#playerStackID .card');
  styledCards.forEach((card) => {
    card.style.pointerEvents = 'auto';
  });
}

function enableObserverCards() {
  const styledCards = document.querySelectorAll('#observerStackID .card');
  styledCards.forEach((card) => {
    card.style.pointerEvents = 'auto';
  });
}

function disableCardClicks() {
  const styledCards = document.querySelectorAll('.card');
  styledCards.forEach((card) => {
    card.style.pointerEvents = 'none';
    card.removeEventListener('click', getCardInfo);
  });
}

function getCardInfo(i) {
  currentCardID = i; // Set glob arr
}

function enableObserverAccordClicks() {
  const styledCards = document.querySelectorAll('#obsCircle1 .accCard, #obsCircle2 .accCard');
  styledCards.forEach((accordCard) => {
    accordCard.style.pointerEvents = 'auto';
  });
}

function enablePlayerAccordClicks() {
  const styledCards = document.querySelectorAll('#playerCircle1 .accCard, #playerCircle2 .accCard');
  styledCards.forEach((accordCard) => {
    accordCard.style.pointerEvents = 'auto';
  });
}

function disableAccClicks() {
  const styledCards = document.querySelectorAll('.accCard');
  styledCards.forEach((card) => {
    card.style.pointerEvents = 'none';
    card.removeEventListener('click', getCardInfo);
  });
}

async function awaitChangeCard() {
  isAwaitChangeCard = true;
  enablePlayerCards(); // getCardInfo activ
  showInfo(infoChange());
  btnGroup3();
  currentCardID = await waitForCardClick();
  changeCard();
  currentCardID = -1;
  isAwaitChangeCard = false;
}

function waitForCardClick() {
  return new Promise((resolve, reject) => {
    cardClickHandler = function (event) {
      const cardIndex = event.target.getAttribute('stackNr');
      if (cardIndex === null) return; // Ignore other clicks
      currentCardID = parseInt(cardIndex, 10); // 10 stands for decimal count system
      document.removeEventListener('click', cardClickHandler);
      resolve(cardIndex);
    };
    document.addEventListener('click', cardClickHandler);
  });
}

//Parameters with ()
function showInfo(infoTemplate) {
  let info = docID("infoTextID");
  if (!info) {
    console.log('found not the info div');
    return;
  }
  info.innerHTML = '';
  info.innerHTML += infoTemplate;
  // Setzt die Animation direkt über JavaScript
  info.style.animation = 'none';
  info.offsetHeight; // Trigger reflow
  info.style.animation = null; // Reset die Animation
  info.style.animation = 'yellowNameFade 4s forwards';
}

/**
 * takes function references so parameters without () 
 * @param {*} func 
 * @param {*} timeout 
 * @param {*} optFunc 
 * @returns 
 */
function showWithTimeout(func, timeout, optFunc) {
  showInfo(func());
  return new Promise((resolve) => {
    setTimeout(() => {
      if (optFunc) {
        showInfo(optFunc());
      }
      resolve(); 
    }, timeout);
  });
}


/**
 * Vergleicht neue 
 */
function youWin(part, length) {
  alert(part + ' gewinnt mit einer Kettenzahl von: ' + length);
}
