const availableHeight = calculateAvailableHeight(); //used in calculateAvailableHeight() and changeView()

function docID(id) {
  return document.getElementById(id);
}

/*------------------------------- TABLE FUNCTIONS ---------------------------*/

//called in renderStack()
function generateCardHTML(card, i, player) {
  let img_id = player === "playerCard" ? `playerCard${i}` : `observerCard${i}`;
  let optAccsPart =
    player === "playerCard" ? `optAccsPlayer` : `optAccsObserver`;

  return /*html*/ `
    <div class="pl-card-frame">
      <img class="card" id="${img_id}" 
      stackNr="${card.stackNr}"  
      src="${card.src}"
      ><!--onclick="getCardInfo(${i}); playSound('tone', '${card.title}', 0.3)"-->
      <div class="brass-plate no-btn small-font " >
        <div id="${optAccsPart}${i}" class="opt-acc-text"></div>
      </div>
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
    return accNumbers;
  }
}

// Helper Function to Append Translated Text
function appendTranslatedText(key, text, parentElement) {
  const span = document.createElement("span");
  span.setAttribute("data-key", key);
  span.innerHTML = text;
  parentElement.appendChild(span);
  parentElement.appendChild(document.createElement("br"));
}

// Function to Render Single Accord
function renderSingleAccord(optAcc, parentElement) {
  const keyMap = {
    0: "gnom",
    13: "mellot",
    14: "goblin",
    15: "wizzard",
  };

  const key = keyMap[optAcc];
  if (key && texts[key] && texts[key][language]) {
    const text = texts[key][language];
    appendTranslatedText(key, text, parentElement);
  } else {
    console.warn(`No translation found for optAcc ${optAcc}`);
  }
}

// Function to Get Musical Term Key Based on Index
function getMusicalTermKey(index) {
  const termKeys = ["prime", "terz", "quint"];
  return termKeys[index] || "";
}

/**
 * Function to Render Accord List with Musical Terms
 *  @param {number[]} optAccArray – List of accordNr
 *  @param {HTMLElement} parentElement – Container, for all
 */
function renderAccordList(optAccArray, parentElement) {
  parentElement.innerHTML = "";
  optAccArray.forEach((accNr, index) => {
    const currAcc = allMaj.find((acc) => acc.nr === accNr);
    if (currAcc) {
      // Get the musical term key
      const termKey = getMusicalTermKey(index);
      // Get the translated musical term e.g."Prime in "
      const term =
        texts[termKey] && texts[termKey][language]
          ? texts[termKey][language]
          : "";
      // Get the translated title
      const titleKey = currAcc.title;
      const translatedTitle =
        texts[titleKey] && texts[titleKey][language]
          ? texts[titleKey][language]
          : titleKey;
      // Combine term and title
      const combinedText = term + translatedTitle; //e.g. "prime in C"

      // color of allTonesOriginal  (nr = currAcc.nr)
      const toneData = allTonesOriginal.find((t) => t.nr === currAcc.nr);
      const textColor = toneColors[currAcc.nr] || "#000"; // Fallback auf Schwarz

      //  add div to parentElement
      const div = document.createElement("div");
      div.textContent = combinedText;
      div.style.color = textColor;
      div.classList.add("opt-accord-item");
      parentElement.appendChild(div);
    }
  });
}

/**
 *  Main Function to Render Optional Accords
 * Shows for which accords each tone is useful (as prime, terz, and quint)
 * @param {array|number} optAcc - opt.accordNr (3) or 1 specialCardNr
 * @param {number} stackNr is nr of current acc
 * @param {string} optAccsPart isPlayer or Observer
 */
function renderOptAccords(optAcc, stackNr, optAccsPart) {
  const optAccs = document.getElementById(`${optAccsPart}${stackNr}`);
  if (!optAccs) {
    console.warn(`Element with id "${optAccsPart}${stackNr}" not found.`);
    return;
  }

  optAccs.innerHTML = "";

  if ([0, 13, 14, 15].includes(optAcc)) {
    // Render single accord
    renderSingleAccord(optAcc, optAccs);
  } else if (Array.isArray(optAcc)) {
    // Render list of accords with musical terms
    renderAccordList(optAcc, optAccs);
  } else {
    console.warn(`Unhandled optAcc value: ${optAcc}`);
  }
}

//called in buildStack()
function renderStack(player, part) {
  let currCardStack = docID(part);
  if (currCardStack) {
    currCardStack.innerHTML = "";
    let cards = player === "playerCard" ? playerCards : observerCards;

    for (let i = 0; i < cards.length; i++) {
      let card = cards[i];
      card.stackNr = i;

      currCardStack.innerHTML += generateCardHTML(card, i, player);

      let optAccNr = findOptAccords(card.nr);
      let optAccsPart =
        player === "playerCard" ? `optAccsPlayer` : `optAccsObserver`;
      renderOptAccords(optAccNr, card.stackNr, optAccsPart);
    }
    stackOpacity1(cards, player);
  }
}

function buildStack(Cards) {
  let targetArray = Cards === "playerCards" ? playerCards : observerCards;
  targetArray.length = 0;
  for (let i = 0; i < 5; i++) {
    let newCard = randomStack();
    targetArray.push(newCard);
  }

  //For testing cards and accords
  testStack();

  Cards === "playerCards"
    ? renderStack("playerCard", "playerStackID")
    : renderStack("observerCard", "observerStackID");
  setCardHelper();
}

//generate brass-circle to open showInfo()
function setCardHelper() {
  let cardHelpers = document.querySelectorAll(".name-frame");
  cardHelpers[1].innerHTML += `
      <div class="card-info-frame brass-gear3 no-btn " alt="Info"></div>
    `;
}

function positionAccCards() {
  const accCards = document.querySelectorAll(".accCard");
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
    array.forEach((accord) => {
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
    playerCircle.innerHTML = "";
    obsCircle.innerHTML = "";
    playerCircle.innerHTML = `<div class="bgr-circle"></div>`;
    obsCircle.innerHTML = `<div class="bgr-circle"></div>`;
    for (let j = 1; j < 13; j++) {
      playerCircle.innerHTML += `
          <img class="accCard" id="playerCircle(${i})Acc(${j})" 
          onclick="chooseAccord(${i}, ${j}, 'player')">
          `;
      obsCircle.innerHTML += `
          <img class="accCard" id="obsCircle(${i})Acc(${j})" 
          onclick="chooseAccord(${i}, ${j}, 'observer')">   
          `;
    }
  }
  positionAccCards();
  renderAccords(false); //isPlayerCircle
  renderAccords(true); //isObserver
}

/**
 * update of static texts like btns or header-tags
 */
function updateStaticTexts() {
  const elements = document.querySelectorAll("[data-key]");
  elements.forEach((element) => {
    const key = element.getAttribute("data-key");

    if (staticTexts[key] && staticTexts[key][language]) {
      element.textContent = staticTexts[key][language];
    }
  });
}

/**
 * Update the index to the next language, wrapping around if necessary
 * Update the displayed texts to the new language
 */
function toggleLang() {
  currentLangIndex = (currentLangIndex + 1) % languages.length;
  language = languages[currentLangIndex];
  if (currentInfoFunction) {
    showInfo(currentInfoFunction);
  }
  //const header = document.querySelector('header');
  //header.innerHTML = renderHeaderHTML();
  let langFlag = document.getElementById("langImg");
  if (langFlag) langFlag.src = `assets/images/btn/${language}.svg`;
  updateStaticTexts();
  //just to update optAcc-texts
  renderStack("playerCard", "playerStackID");
  renderStack("observerCard", "observerStackID");
  localStorage.setItem("currentLangIndex", currentLangIndex);
}

document.addEventListener("DOMContentLoaded", () => {
  const savedIndex = localStorage.getItem("currentLangIndex");
  if (savedIndex !== null) {
    currentLangIndex = savedIndex - 1;
  } else {
    currentLangIndex = 0;
  }
  toggleLang();
});

/**
 * @returns difference between viewport and doc.height
 */
function calculateAvailableHeight() {
  const viewportHeight = window.innerHeight;
  const documentHeight = document.documentElement.clientHeight;
  const toolbarHeight = viewportHeight - documentHeight;
  const availableHeight = viewportHeight - toolbarHeight;
  return availableHeight;
}

function renderNames() {
  let player1 = document.getElementById("playNameID");
  let player2 = document.getElementById("obsNameID");
  let playerName = localStorage.getItem("player1Name");
  let obsName = localStorage.getItem("player2Name");

  player1.innerHTML = playerName;
  player2.innerHTML = obsName;
}

function setupGame(isSkip, isStartRound) {
  isLandingpage = false;
  renderNames();
  const header = document.querySelector("header");
  header.innerHTML = renderHeaderHTML();
  currentInfoFunction = infoStart;
  showInfo(currentInfoFunction);
  if (isSkip) originalStack();
  buildStack("playerCards"); // Render player stack
  buildStack("observerCards");
  renderCircles();
  chainHelper();
  currentCardID = -1;
  startRound(isStartRound);
  updateStaticTexts();
  if (isStartRound) deck = [];
}

//called for landingpage
function renderIndex() {
  isLandingpage = true;
  let mainContent = docID("startSideContent");
  if (mainContent) {
    mainContent.innerHTML = infoStartSite();
    updateStaticTexts(); // Update texts after rendering
  }

  const header = document.querySelector("header");
  header.innerHTML = renderHeaderHTML();
}

//second player (if exist) gets ID from firebase
function getGameIdFromUrl() {
  const urlParts = window.location.pathname.split("/");
  return urlParts[urlParts.length - 1];
}

//called in buildStack()
function testStack() {
  playerCards = [
    {
      nr: 1,
      stackNr: -1,
      title: "C",
      amount: 3,
      src: "assets/images/tones/toneC.png",
    },
    {
      nr: 5,
      stackNr: -1,
      title: "E",
      amount: 3,
      src: "assets/images/tones/toneE.png",
    },
    //{ nr: 8, stackNr: -1, title: 'G', amount: 3, src: 'assets/images/tones/toneG.png' },
    {
      nr: 0,
      stackNr: -1,
      title: "gnom",
      amount: 1,
      src: "assets/images/specials/joker.jpg",
    },
    //{ nr: 0, stackNr: -1, title: 'gnom', amount: 1, src: 'assets/images/specials/joker.jpg' },
    //{ nr: 0, stackNr: -1, title: 'gnom', amount: 1, src: 'assets/images/specials/joker.jpg' },
    //{ nr: 13, stackNr: -1, title: 'mellot', amount: 1, inUse: false, src: 'assets/images/specials/mellot.jpg' },
    //{ nr: 5, stackNr: -1, title: 'E', amount: 3, src: 'assets/images/tones/toneE.png' },
    {
      nr: 13,
      stackNr: -1,
      title: "mellot",
      amount: 1,
      inUse: false,
      src: "assets/images/specials/mellot.jpg",
    },
    {
      nr: 14,
      stackNr: -1,
      title: "goblin",
      amount: 1,
      inUse: false,
      src: "assets/images/specials/goblin.jpg",
    },
    // { nr: 14, stackNr: -1, title: 'goblin', amount: 1, inUse: false, src: 'assets/images/specials/goblin.jpg' },
    // { nr: 15, stackNr: -1, title: 'wizzard', amount: 1, inUse: false, src: 'assets/images/specials/wizzard.jpg' }
  ];
  console.log("testCards activated");
  playerAccords = [
    {
      nr: 1,
      circleNr: 1,
      title: "C",
      amount: 1,
      src: "assets/images/accords/accC.jpg",
    },
    //{ nr: 2, circleNr: 8, title: 'Db', amount: 2, src: 'assets/images/accords/accDb.jpg' },
    //{ nr: 3, circleNr: 3, title: 'D', amount: 2, src: 'assets/images/accords/accD.jpg' },
    //{ nr: 4, circleNr: 10, title: 'Eb', amount: 2, src: 'assets/images/accords/accEb.jpg' },
    //{ nr: 5, circleNr: 5, title: 'E', amount: 2, src: 'assets/images/accords/accE.jpg' },
    {
      nr: 6,
      circleNr: 12,
      title: "F",
      amount: 1,
      src: "assets/images/accords/accF.jpg",
    },
    {
      nr: 7,
      circleNr: 7,
      title: "Gb",
      amount: 1,
      src: "assets/images/accords/accGb.jpg",
    },
    //{ nr: 8, circleNr: 2, title: 'G', amount: 1, src: 'assets/images/accords/accG.jpg' },
    //{ nr: 9, circleNr: 9, title: 'Ab', amount: 2, src: 'assets/images/accords/accAb.jpg' },
    //{ nr: 10, circleNr: 4, title: 'A', amount: 2, src: 'assets/images/accords/accA.jpg' },
    //{ nr: 11, circleNr: 11, title: 'Bb', amount: 2, src: 'assets/images/accords/accBb.jpg' },
    //{ nr: 12, circleNr: 6, title: 'B', amount: 2, src: 'assets/images/accords/accB.jpg' },
  ];
}
