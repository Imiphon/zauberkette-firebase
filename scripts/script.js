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
  menu.classList.toggle('open'); // Toggle the 'open' class to show or hide the menu  
  menuToggle.classList.toggle('open'); // Optionally, toggle the class for hamburger to X transformation
}

// Close the menu if clicked outside
document.addEventListener('click', function (event) {
  const menu = document.getElementById('menu');
  const menuToggle = document.getElementById('menuToggle');

  if (!menuToggle.contains(event.target) && !menu.contains(event.target)) {
    menu.classList.remove('open');
    menuToggle.classList.remove('open');
  }
});

function skipToStart() {
  window.location.reload();
}

/* --------------- INDEX.HTML  ------------------------*/
async function renderIndex() { //Kay -- render the content
  await includeHTML(); // Kay -- render the header
  let mainContent = docID("mainContentID"); //Kay - docID?
  mainContent.innerHTML = infoStartSite(); //Kay -- render Main Content
}

/*------------------------------- TABLE FUNCTIONS ---------------------------*/

function updateGoal() {
  goalValue = document.getElementById('goalInput').value;
  let value = parseInt(input.value, 10);
  if (value < 2) {
    input.value = 2;
  } else if (value > 12) {
    input.value = 12;
  }
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

function calculateAvailableHeight() {
  const viewportHeight = window.innerHeight;
  const documentHeight = document.documentElement.clientHeight;

  // Höhe der Tableiste ermitteln (Differenz zwischen Viewport und Dokumenthöhe)
  const toolbarHeight = viewportHeight - documentHeight;

  // Verfügbare Höhe abzüglich der Tableiste
  const availableHeight = viewportHeight - toolbarHeight;

  return availableHeight;
}

const availableHeight = calculateAvailableHeight();

function changeView() {
  mirrorView = !mirrorView;
  let navigation = document.getElementById('headInfoID');
    const turnBtn = document.querySelector('.turn');
    const turnBackBtn = document.querySelector('.turn-back');
  if (mirrorView) {
    navigation.classList.add('sideInfo');
    turnBackBtn.style.display = 'block';
    turnBtn.style.display = 'none';
    if (!fullscreen) {
      document.querySelector('nav').style.width = `${availableHeight}px`;
    } else {
      document.querySelector('nav').style.width = `100%`;
    }
  }
  if (!mirrorView) {
    navigation.classList.remove('sideInfo');
    turnBtn.style.display = 'block';
    turnBackBtn.style.display = 'none';
    document.querySelector('nav').style.width = '100%';
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
        docID("changeClicks(4)").style.display = "block"; //Mellot
        docID("mellot-info").style.display = "block";
        docID("mellotBrass").style.display = "block";
      } else if (title === 'goblin') {
        docID("changeClicks(5)").style.display = "block"; //Goblin
        docID("goblin-info").style.display = "block";
        docID("goblinBrass").style.display = "block";
      } else if (title === 'wizzard') {
        docID("changeClicks(6)").style.display = "block"; //Wizzard
        docID("wizzard-info").style.display = "block ";
        docID("wizzardBrass").style.display = "block";
      }
    }
  }
}

function noBtns() { // Kay -- set btn-group buttons invisible
  let buttons = document.querySelectorAll('.btn-group .btn');
  buttons.forEach(function (button) {
    button.style.display = 'none';
  });
  let brassGears = document.querySelectorAll('.brass-gear1');
  brassGears.forEach(function (gear) {
    gear.style.display = 'none';
  });
}

/*-------------------- BUTTON FUNCTIONS -------------------*/

let fullscreen = false;

function toggleFullscreen() {
  const fullscreenEnterImg = document.querySelector('.fullscreen-enter');
  const fullscreenExitImg = document.querySelector('.fullscreen-exit');

  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
    fullscreenEnterImg.style.display = 'none';
    fullscreenExitImg.style.display = 'block';
    fullscreen = true;
    if (mirrorView) {
      let nav = document.querySelector('nav')
      nav.style.width = `100%`;
      nav.style.left = `0`;
    }
  } else {
    document.exitFullscreen();
    fullscreenEnterImg.style.display = 'block';
    fullscreenExitImg.style.display = 'none';
    fullscreen = false;
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
    toggleCardOpacity(currentCardID);
  }
  let firstClickedIndex = currentCardID;
  if (mellotArray.length === 0) {
    mellotArray.push(playerCards[currentCardID]);
  }
  showInfo(infoToTakeCard());
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