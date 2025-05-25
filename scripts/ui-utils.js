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

function toggleUI() {
  if (!gameRef) {
    return;
  }
  //take parent
  const infoFrame = document.querySelector(".info-frame.brass-long.no-btn");
  if (!infoFrame) return;
  // take kids
  const chainFrame = infoFrame.querySelector(".chain-frame");
  const infoText = infoFrame.querySelector(".info-text");
  const sandClock = infoFrame.querySelector(".sand-clock");

  const btnGroup = document.querySelector(".btn-group");

  if (isActiveUI) {
    if (chainFrame) chainFrame.style.display = "";
    if (infoText) infoText.style.display = "flex";
    if (sandClock) sandClock.style.display = "none";
    if (btnGroup) btnGroup.style.display = "";
  } else {
    if (chainFrame) chainFrame.style.display = "";
    if (infoText) infoText.style.display = "none";
    if (sandClock) sandClock.style.display = "";
    if (btnGroup) btnGroup.style.display = "none";
  }
}

/**
 * Apply opacity and interaction styles to a card stack.
 *
 * For the player’s stack (cardString === "playerCard"), it reads
 * the latest opacities from currentCardStyles (synced via Firebase)
 * and disables any used special cards.
 *
 * For the observer’s stack, all cards remain fully visible.
 *
 * @param {Array} stack              – the array of cards in this stack
 * @param {string} cardString        – element ID prefix ("playerCard" or "observerCard")
 */
function stackOpacity1(stack, cardString) {
  // 1. Loop through every position in the stack
  stack.forEach((card, i) => {
    const el = document.getElementById(`${cardString}${i}`);
    if (!el) return;

    if (cardString === "playerCard") {
      // Player view: apply stored opacity (default to 1)
      const entry = currentCardStyles.find((s) => s.stackNr === i);
      el.style.opacity = entry?.opacity ?? 1;
    } else {
      // Observer view: always full opacity
      el.style.opacity = 1;
    }
  });

  // 2. If this is the player’s stack, disable pointer events on used special cards
  if (cardString === "playerCard" && usedSpecials.length > 0) {
    usedSpecials.forEach(({ index: specialIndex }) => {
      const specialEl = document.getElementById(`${cardString}${specialIndex}`);
      if (specialEl) {
        specialEl.style.pointerEvents = "none";
      }
    });
  }
}

function setCardOpacity(stackNr, opacity) {
  if (!gameRef) return;
  // set Opacity in DOM
  const el = document.getElementById(`playerCard${stackNr}`);
  if (el) el.style.opacity = opacity;
  // State-Array update
  currentCardStyles = currentCardStyles
    .filter((s) => s.stackNr !== stackNr)
    .concat({ stackNr, opacity });
  uploadGameData();
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

document.addEventListener("click", globalCardClickHandler);

function globalCardClickHandler(event) {
  // Check if we're currently waiting for a card click
  if (!isWaitingForCardClick) return;

  let cardElement = event.target.closest(".card");
  if (!cardElement) return; // Click was not on a card

  const cardIndex = cardElement.getAttribute("stackNr");
  const idx = Number(cardIndex);
  if (Number.isNaN(idx)) return;

  if (!cardElement.classList.contains("active")) return;
  // Resolve the promise
  isWaitingForCardClick = false;
  waitForCardClickResolve(idx);

  getCardInfo(idx);
  playSound("tone", playerCards[idx].title, 0.3);
}

/***************************** TEST STACK  ******************************/

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
