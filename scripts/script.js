async function initialize() {
  await renderTable();
  detectTouchDevice();
}

function docID(id) {
  return document.getElementById(id);
}

async function includeHTML() { //Kay -- template function for header  unnessassary better js template
  let includeElements = document.querySelectorAll("[w3-include-html]");

  for (let i = 0; i < includeElements.length; i++) {
    const element = includeElements[i];
    file = element.getAttribute("w3-include-html"); // "includes/header.html"
    let resp = await fetch(file);

    if (resp.ok) {
      element.innerHTML = await resp.text();      
    } else {
      element.innerHTML = "Page not found";
    }
  }  
}

function toggleMenu() {
  const menu = document.getElementById('menu');
  const menuToggle = document.getElementById('menuToggle');

  // Toggle the 'open' class to show or hide the menu
  menu.classList.toggle('open');

  // Optionally, toggle the class for hamburger to X transformation
  menuToggle.classList.toggle('open');
}

// Optional: Close the menu if clicked outside
document.addEventListener('click', function(event) {
  const menu = document.getElementById('menu');
  const menuToggle = document.getElementById('menuToggle');
  
  if (!menuToggle.contains(event.target) && !menu.contains(event.target)) {
    menu.classList.remove('open');
    menuToggle.classList.remove('open');
  }
});

/* --------------- INDEX.HTML  ------------------------*/
async function renderIndex() { //Kay -- render the content
  await includeHTML(); // Kay -- render the header
  let mainContent = docID("mainContentID"); //Kay - docID?
  mainContent.innerHTML = infoStartSite(); //Kay -- render Main Content
}

/*------------------------------- TABLE FUNCTIONS ---------------------------*/

function updateGoal() {
  goalValue = document.getElementById('goalInput').value;
}

function detectTouchDevice() {
  if ('ontouchstart' in window || navigator.maxTouchPoints) {
    // It is a touch device
    document.querySelectorAll('.hover-effect').forEach(function (element) {
      let hasHover = false;
      element.addEventListener('click', function (event) {
        if (!hasHover) {
          event.preventDefault();
          element.classList.add('hover');
          hasHover = true;
          setTimeout(function () {
            hasHover = false;
          }, 300); // Adjust the timeout as needed
        } else {
          element.classList.remove('hover');
          hasHover = false;
          // Trigger the original click event
          let originalClickEvent = new Event('click', {
            bubbles: true,
            cancelable: true
          });
          element.dispatchEvent(originalClickEvent);
        }
      });
    });
  }
}

function changeView() {
  mirrorView = !mirrorView;
  let container = document.getElementById('headInfoID');
  if (mirrorView) {
    container.classList.add('sideInfo');
  }
  if (!mirrorView) {
    container.classList.remove('sideInfo');
  }
  toggleRotation();
  switchtableStyle();
}

function toggleRotation() {
  const container = document.getElementById('observerPartID');
  if (isRotated) {
    container.classList.remove('rotated-180');
  } else {
    container.classList.add('rotated-180');
  }
  isRotated = !isRotated;
}

function switchtableStyle() {
  if (mirrorView) {
    let table = document.querySelector('.table-frame'); //with dot cause it's lookin for a selector
    table.classList.remove('table-frame'); //only class-name without dot
    table.classList.add('table-mirror-frame');
  } else {
    let table = document.querySelector('.table-mirror-frame');
    table.classList.remove('table-mirror-frame');
    table.classList.add('table-frame');
  }
}

function rotateWebsite() {
  let table = document.getElementsByClassName('table-mirror-frame')[0];
  let currentRotation = table.style.transform;
  if (currentRotation === "rotate(180deg)") {
    table.style.transform = "rotate(0deg)";
  } else {
    table.style.transform = "rotate(180deg)";
  }
  table.style.transformOrigin = "center";
}


/*-------------------- BUTTONS -------------------*/


function btnGroup1() { //Kay -- shows infotext start
  noBtns(); //Kay reset all Button style
  docID("changeClicks(1)").style.display = "inline";//change card --Kay-- docID!
  docID("changeClicks(2)").style.display = "inline";//nothing to change
  showInfo(infoStart()); //Kay --render text of starting round
}

function btnGroup2() { // Kay --shows infotext after card change
  noBtns(); //Kay reset all Button style
  docID("changeClicks(3)").style.display = "inline"; // check Combi
  docID("changeClicks(7)").style.display = "inline"; //next Round
  showInfo(infoPlayCards()); //Kay --render
  specialBtn(); //Kay render button if special card is in deck ( Mellot, Goblin, Wizzard)
}

function btnGroup3() {
  noBtns();
  document.getElementById("changeClicks(8)").style.display = "inline"; //step back
  document.getElementById("changeClicks(7)").style.display = "inline"; //next Round
}

/**
 * Shows special btn if 
 */
function specialBtn() { // Kay -- check if special Card in deck
  for (let i = 0; i < playerCards.length; i++) {
    let currentCard = docID(`playerCard${i}`);
    let title = playerCards[i]['title'];
    if (currentCard.style.opacity != 0.5) { //Kay - use docID 
      if (title === 'mellot') { //Kay -- maybe &&-short Version
        docID("changeClicks(4)").style.display = "inline"; //Mellot 
      } else if (title === 'goblin') {
        docID("changeClicks(5)").style.display = "inline"; //Goblin
      } else if (title === 'wizzard') {
        docID("changeClicks(6)").style.display = "inline"; //Wizzard
      }
    }
  }
}

function noBtns() { // Kay -- set btn-group buttons invisible
  let buttons = document.querySelectorAll('.btn-group button');
  buttons.forEach(function (button) {
    button.style.display = 'none';
  });
}

/*-------------------- BUTTON FUNCTIONS -------------------*/

function toggleFullscreen() {
  const fullscreenEnterImg = document.querySelector('.fullscreen-enter');
  const fullscreenExitImg = document.querySelector('.fullscreen-exit');
  
  if (!document.fullscreenElement) {
    // In den Vollbildmodus wechseln
    document.documentElement.requestFullscreen();
    fullscreenEnterImg.style.display = 'none';
    fullscreenExitImg.style.display = 'block';
  } else {
    // Vollbildmodus verlassen
    document.exitFullscreen();
    fullscreenEnterImg.style.display = 'block';
    fullscreenExitImg.style.display = 'none';
  }
}

async function useMellot() {
  playSound('tone', 'mellot', 0.5);
  disableCardClicks();
  specialInProgress = true;
  enablePlayerCards();
  separateSpecial('mellot');
  mellotArray = []; //to define the two cards for change  
  showInfo(infoToGiveCard());
  btnGroup3();
  await waitForCardClick();
  if (mellotArray.length === 0) {
    toggleCardOpacity(clickedCardID);
  }
  let firstClickedIndex = clickedCardID;
  if (mellotArray.length === 0) {
    mellotArray.push(playerCards[clickedCardID]);
  }
  showInfo(infoToTakeCard());
  enableObserverCards();
  await waitForCardClick();
  //in case of a 'step back' after first click and start useMellot() again function jumps to mellotArray.push(observerCards[clickedCardID]); otherwise.
  if (mellotArray.length === 1) {
    mellotArray.push(observerCards[clickedCardID]);
  } else if (mellotArray.length === 0) {
    mellotArray.push(playerCards[clickedCardID]);
    firstClickedIndex = clickedCardID;
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
  playSound('tone', 'goblin', 0.5);
  separateSpecial('goblin');
  disableAccClicks();
  enableObserverAccordClicks();
  showInfo(infoUseGoblin());
  btnGroup3();
  specialInProgress = true;
}

function useWizzard() {
  playSound('tone', 'wizzard', 0.5);
  if (observerAccords.length === 0) {
    showWithTimeout(wizzardRules, 6000, infoPlayCards);
    return;
  }
  tryWizzardStrike = true;
  separateSpecial('wizzard');
  disableAccClicks();
  enableObserverAccordClicks();
  showInfo(infoUseWizzard());
  btnGroup3();
  specialInProgress = true;
}

/*------------------------------- POPUPs  ------------*/
function openRulesPopup() { //Kay --create the Game rule Pop up -- is that a good style?
  let popup = document.createElement('div');
  popup.className = 'popup';
  popup.style.display = 'flex';
  body.style.overflow = 'auto';
  document.body.appendChild(popup);
  popup.innerHTML = gameRules();
}

function chainHelper() { //Kay --handle the cheat sheet for the accords. Z-Index higher!
  let chainHelper = document.querySelector('.chain-helper');
  chainHelper.addEventListener('click', function (event) {
    // Das Event stoppen, damit der document click-Handler nicht ausgelöst wird
    event.stopPropagation();
    this.classList.toggle('expanded');
  });
  // a click anywhere to remove listener
  document.addEventListener('click', function () {
    chainHelper.classList.remove('expanded');
  });
}

function openCardPopup() { //Kay -- create Pop-Up Element 
  let popup = document.createElement('div');
  popup.className = 'popup';
  popup.style.display = 'flex';
  document.body.appendChild(popup);
}

// for wizzard and goblin NOT IN USE BY NOW
function openCirclePopup() { // Kay -- create Pop up Element
  let popup = document.createElement('div');
  popup.className = 'circle-popup';
  popup.style.display = 'flex';
  document.body.appendChild(popup);
  circleBoard(popup);
}

function closeEvent() { // Kay -- close Popup element by click on the site
  document.addEventListener('DOMContentLoaded', function () {
    let popup = document.querySelector('.popup');
    if (popup) {
      popup.addEventListener('click', function () {
        popup.style.display = 'none';
      });
    }
  });
}

function closePopup() { //Kay -- remove Element
  let popup = document.querySelector('.popup');
  if (popup) {
    popup.remove();
    body.style.overflow = 'hidden';
  }
}

/* --------------- play on table ------------------------*/

async function renderTable() {
  await includeHTML();
  showInfo(infoStart());
  buildStack("playerCards"); // Kay -- render player stack with joined function
  buildStack("observerCards");
  renderCircles();
  chainHelper();
  clickedCardID = -1;
  await startRound(); 
  //HIER STARTROUND DAMIT ALS ERSTES DER AKTUELLE STAND AUF FIREBASE GEPOSTET WERDEN KANN
}

/**
 * add new random card into the playerCards and 
 * old card is getting amount++ in allTones[]
 */
function changeCard() {
  let newCard = randomStack(); // get randomNewCard with amount:1 --Kay-- or height
  let oldNr = playerCards[clickedCardID]['nr']; // Kay-- Selected card?
  let allTonesUpdate = allTones.find((card) => card.nr === oldNr); // Kay -- work it correct?
  if (allTonesUpdate) {
    allTonesUpdate.amount++;
  }
  playerCards[clickedCardID] = newCard; // Kay -- add card to player cards
  let cardElement = docID(`playerCard${clickedCardID}`);
  cardElement.src = newCard.src; //all infos include
  renderStack("playerCard", "playerStackID"); //Kay --render the player Stack
  disableCardClicks(); //Kay --remove Pointer and Click-eventlistener of 
  btnGroup2(); //Kay -- set Btns
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
    clickedCardID = cardCombi[i].stackNr;
    changeCard();
    cardCombi[i].stackNr = -1;
  }
  noBtns(); //Kay reset all Button style

  showWithTimeout(infoWinMagic, 2000, finishRound);
}

/*------------------------------- CLICK CARD STUFF -------------------------------*/

function stepBack() {
  if (specialInProgress) {
    usedSpecials.pop(); //last special will be removed
    specialInProgress = false;
    mellotArray = [];
    tryWizzardStrike = false;
    tryGoblinStrike = false;
  }
  stackOpacity1(playerCards, 'playerCard');
  setBackArrays();
  playSound('failed', 'backMag', 0.5);
  disableCardClicks();
  btnGroup2();
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

async function getCardInfo(i) { //Kay - why async?
  clickedCardID = i; // Setzt durch cardClick den Kartenindex
  //console.log("clickedCardID = " + clickedCardID)
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

function savePosition(accInCircle) {
  let originalTransform = window.getComputedStyle(accInCircle).transform;
  let originalZIndex = window.getComputedStyle(accInCircle).zIndex;
  accInCircle.dataset.originalTransform = originalTransform === 'none' ? '' : originalTransform;
  accInCircle.dataset.originalZIndex = originalZIndex === 'auto' ? '0' : originalZIndex;

  accInCircle.addEventListener('mouseenter', function () {
    this.style.transform = `${this.dataset.originalTransform} scale(15)`;
    this.style.zIndex = '10';
  });
  accInCircle.addEventListener('mouseleave', function () {
    this.style.transform = this.style.transform = this.dataset.originalTransform;
    this.style.zIndex = this.dataset.originalZIndex;
  });
}

async function awaitChangeCard() {
  enablePlayerCards(); // getCardInfo activ
  showInfo(infoChange());
  btnGroup3();
  // docID('changeClicks(1)').style.display = 'none';
  clickedCardID = await waitForCardClick();
  changeCard();
  clickedCardID = -1;
}

function waitForCardClick() {
  return new Promise((resolve, reject) => {
    const clickHandler = function (event) {
      const cardIndex = event.target.getAttribute('stackNr');
      if (cardIndex === null) return; // Ignore other clicks
      clickedCardID = parseInt(cardIndex, 10); // 10 stands for dezimal count system
      document.removeEventListener('click', clickHandler);
      resolve(cardIndex);
    };
    document.addEventListener('click', clickHandler);
  });
}

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

function showWithTimeout(func, timeout, optFunc) {
  showInfo(func());
  setTimeout(() => {
    if (optFunc) {
      showInfo(optFunc());
    } else {
      return;
    }
  }, timeout);
}

/**
 * Vergleicht neue 
 */
function youWin(part, length) {
  alert(part + ' gewinnt mit einer Kettenzahl von: ' + length);
}