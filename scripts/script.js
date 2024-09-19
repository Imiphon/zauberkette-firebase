const availableHeight = calculateAvailableHeight(); //used in calculateAvailableHeight() and changeView()

function docID(id) {
  return document.getElementById(id);
}

/* --------------- INDEX.HTML  ------------------------*/
async function renderIndex() { //Kay -- render the content
  //await includeHTML(); // Kay -- render the header
  let mainContent = docID("mainContentID"); //Kay - docID?
  mainContent.innerHTML = infoStartSite(); //Kay -- render Main Content
}

/*------------------------------- TABLE FUNCTIONS ---------------------------*/

//called in buildStack()
function testModus() {
  playerCards = [
    { nr: 1, stackNr: -1, title: 'C', amount: 3, src: 'assets/images/tones/toneC.png' },
    { nr: 5, stackNr: -1, title: 'E', amount: 3, src: 'assets/images/tones/toneE.png' },
    { nr: 8, stackNr: -1, title: 'G', amount: 3, src: 'assets/images/tones/toneG.png' },
    //{ nr: 0, stackNr: -1, title: 'gnom', amount: 1, src: 'assets/images/specials/joker.jpg' },
    //{ nr: 0, stackNr: -1, title: 'gnom', amount: 1, src: 'assets/images/specials/joker.jpg' },
    //{ nr: 0, stackNr: -1, title: 'gnom', amount: 1, src: 'assets/images/specials/joker.jpg' },
    { nr: 13, stackNr: -1, title: 'mellot', amount: 1, inUse: false, src: 'assets/images/specials/mellot.jpg' },
    //{ nr: 13, stackNr: -1, title: 'mellot', amount: 1, inUse: false, src: 'assets/images/specials/mellot.jpg' },
    { nr: 14, stackNr: -1, title: 'goblin', amount: 1, inUse: false, src: 'assets/images/specials/goblin.jpg' },
    //{ nr: 15, stackNr: -1, title: 'wizzard', amount: 1, inUse: false, src: 'assets/images/specials/wizzard.jpg' }
  ];
  console.log('testCards activated');
}

//called in renderStack()
function generateCardHTML(card, i, player) {
  let img_id = player === "playerCard" ? `playerCard${i}` : `observerCard${i}`;
  let optAccsPart = player === "playerCard" ? `optAccsPlayer` : `optAccsObserver`;

  return `
    <div class="pl-card-frame">
      <img class="card" id="${img_id}" 
      stackNr="${card.stackNr}"  
      src="${card.src}"
      onclick="getCardInfo(${i}); playSound('tone', '${card.title}', 0.3)">
      <div class="brass-plate no-btn small-font" id="${optAccsPart}${i}"></div>
    </div>
  `;
}

/**
 * @param {*} cardNr 
 * @returns 3 options of Accords or name of specialcard for each tonCard in stack
 */
function findOptAccords(cardNr) {
  if (cardNr > 12 || cardNr === 0) return cardNr;
  else {
    let acc1 = cardNr;
    let acc2 = cardNr + 5;
    let acc3 = cardNr + 8;
    if (acc2 > 12) {
      acc2 -= 12;
    }
    if (acc3 > 12) {
      acc3 -= 12;
    }
    let accNumbers = [acc1, acc3, acc2];
    return (accNumbers);
  }
}

/**
 * shows for wich accords each tone is usefull (as prime, terz and quint)
 * @param {array} optAcc opt.accordNr (3) or 1 specialCardNr
 * @param {number} stackNr 
 */
function renderOptAccords(optAcc, stackNr, optAccsPart) {
  let optAccs = document.getElementById(`${optAccsPart}${stackNr}`);
  if (optAcc === 0) optAccs.innerHTML += 'Gnom';
  else if (optAcc === 13) optAccs.innerHTML += 'Mellot';
  else if (optAcc === 14) optAccs.innerHTML += 'Goblin';
  else if (optAcc === 15) optAccs.innerHTML += 'Wizzard';
  else {
    for (let i = 0; i < optAcc.length; i++) {
      let currAcc = allMaj.find(acc => acc.nr === optAcc[i]);
      if (i === 0) optAccs.innerHTML += 'Prime in ';
      else if (i === 1) optAccs.innerHTML += 'Terz in ';
      else if (i === 2) optAccs.innerHTML += 'Quint in ';
      optAccs.innerHTML += currAcc.title + '<br>';
    }
  }
}


//called in buildStack()
function renderStack(player, part) {
  let currCardStack = docID(part);
  currCardStack.innerHTML = '';
  let cards = player === "playerCard" ? playerCards : observerCards;

  for (let i = 0; i < cards.length; i++) {
    let card = cards[i];
    card.stackNr = i;

    currCardStack.innerHTML += generateCardHTML(card, i, player);

    let optAccNr = findOptAccords(card.nr);
    let optAccsPart = player === "playerCard" ? `optAccsPlayer` : `optAccsObserver`;
    renderOptAccords(optAccNr, card.stackNr, optAccsPart);
  }
  stackOpacity1(cards, player);
}

function buildStack(Cards) {
  let targetArray = (Cards === "playerCards") ? playerCards : observerCards;

  for (let i = 0; i < 5; i++) {
    let newCard = randomStack();
    targetArray.push(newCard);
  }
  //testModus();
  Cards === "playerCards" ? renderStack("playerCard", "playerStackID") : renderStack("observerCard", "observerStackID");
  setCardHelper();
}

function setCardHelper() {
  let obsStack = document.getElementById('observerStackID');
  let playStack = document.getElementById('playerStackID');
  obsStack.innerHTML += optAccInfo();
  playStack.innerHTML += optAccInfo();
}

function positionAccCards() {
  const accCards = document.querySelectorAll('.accCard');
  const radius = -60; // distance from center in px 

  accCards.forEach((card, index) => {
    const angle = (360 / 12) * (index + 1); // degree / count per circle
    const transform = `rotate(${angle}deg) translateY(${radius}px) rotate(${-angle}deg)`;
    card.style.transform = transform;
  });
}

function renderAccords(isObserver) {
  let array;
  if (isObserver) {
    array = observerAccords;
  } else {
    array = playerAccords;
  }
  if (array.length != 0) {
    array.forEach(accord => {
      //accNr,isNew,isObserver,isDouble
      setAcc(accord.nr, false, isObserver, false);
      if (accord.amount === 2) {
        setAcc(accord.nr, false, isObserver, true);
      }
    });
  }
}

function renderCircles() {
  for (let i = 1; i <= 2; i++) {
    let playerCircle = document.getElementById(`playerCircle${i}`);
    let obsCircle = document.getElementById(`obsCircle${i}`);
    playerCircle.innerHTML = '';
    obsCircle.innerHTML = '';
    for (let j = 1; j < 13; j++) {
      playerCircle.innerHTML += `
          <img class="accCard" id="playerCircle(${i})Acc(${j})" onclick="chooseAccord(${i}, ${j}, 'player')">
          `;
      obsCircle.innerHTML += `
          <img class="accCard" id="obsCircle(${i})Acc(${j})" onclick="chooseAccord(${i}, ${j}, 'observer')">   
          `;
    }
  }
  positionAccCards();
  renderAccords(false);//isPlayerCircle 
  renderAccords(true); //isObserver
}

function renderTable() {
  const header = document.querySelector('header');
  header.innerHTML = renderHeaderHTML();
  showInfo(infoStart());
  buildStack("playerCards"); // Kay -- render player stack with joined function
  buildStack("observerCards");
  renderCircles();
  chainHelper();
  currentCardID = -1;
  startRound();
}


function initialize() {
  renderTable();
  detectTouchDevice();
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

/**
 * to set the goal (length of winner chain)
 */
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
  switchTableStyle();
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

function switchTableStyle() {
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