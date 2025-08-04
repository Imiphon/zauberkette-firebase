async function changeSpecials() {
  for (const special of usedSpecials) {
    const id = special.index;
    special.card.style.visibility = "visible";
    await changeCard(id);
  }

  usedSpecials = [];
  currentSpecial = null;
}

function animateTableFrame() {
  let tableFrame;
  if (!mirrorView) tableFrame = document.querySelector(".table-frame");
  else if (mirrorView)
    tableFrame = document.querySelector(".table-mirror-frame");
  tableFrame.style.animation = "none";
  requestAnimationFrame(() => {
    tableFrame.style.animation = "fadeOutIn 3s ease-in-out";
  });
}

function changeNames() {
  console.log("changeNames() starts");
  let obsName = document.getElementById("obsNameID");
  let playName = document.getElementById("playNameID");
  [obsName.innerHTML, playName.innerHTML] = [
    playName.innerHTML,
    obsName.innerHTML,
  ];
  if (gameID) {
    isLocalUpdate = true;
    gameRef
      .set(
        {
          playerName1: playerName1,
          playerName2: playerName2,
        },
        { merge: true }
      )
      .catch((err) => console.error("Firestore-Error:", err));
  }
}

//starts after first time startRound()
function swapParts() {
  console.log("swapParts() starts");

  let tempCards = playerCards;
  playerCards = observerCards;
  observerCards = tempCards;
  let tempAccords = playerAccords;
  playerAccords = observerAccords;
  observerAccords = tempAccords;
  renderStack("playerCard", "playerStackID");
  renderStack("observerCard", "observerStackID");
  renderCircles();
}

function setBackArrays(isStartRound) {
  currentCardID = -1;
  clickAccount = 0;
  cardCombi = [];
  choosenCards = [];
  accOffer = [];
  mellotArray = [];
  currentSpecial = null;
  specialInProgress = false;
  if (isStartRound) {
    usedSpecials = [];
  }

  choosenAcc = [];
  tryGoblinStrike = false;
  tryWizzardStrike = false;
  wizzardTakes = [];
  wizzardGives = [];
  flatNeighbor = [];
  sharpNeighbor = [];
  playerChains = [];
  observerChains = [];
  flatPlayerConnection = [];
  sharpPlayerConnection = [];
}

function setBackBooleans() {
  isChainCheck = false;
  isAwaitChangeCard = false;
}

function startRound(isStartRound) {
  let name = document.getElementById("playNameID");
  currentCardStyles = [];
  name.style.animation = "none";
  //a minimal delay to get sure for full animation
  requestAnimationFrame(() => {
    name.style.animation = "yellowNameFade 6s forwards";
  });
  btnGroup1();
  disableCardClicks();
  setBackArrays(isStartRound);
  setBackBooleans();
  setCardHelper();
  setCardInfo();
}

function checkForWin(part) {
  let currChainArr = part === "player" ? playerChains : observerChains;
  let winnerChain = currChainArr.find((chain) => chain.length >= goalValue);

  let winnerName = "";
  if (part === "player") {
    winnerName = document.getElementById("playNameID").textContent;
  }
  if (part === "observer") {
    winnerName = document.getElementById("obsNameID").textContent;
  }
  if (winnerChain) {
    youWin(part, winnerChain.length, winnerName);
  }
}

/**
 * Is checking for accord chains in accord(-Arrays) while finishRound()
 * @param {string} part is 'player'or 'observer'
 */
function checkForChain(part) {
  let currentAccArray = part === "player" ? playerAccords : observerAccords;

  const firstCircleAccs = [];
  const secondCircleAccs = [];

  currentAccArray.forEach((accord) => {
    if (accord) {
      const prevCircleNr = accord.circleNr - 1 === 0 ? 12 : accord.circleNr - 1;
      const nextCircleNr = accord.circleNr + 1 === 13 ? 1 : accord.circleNr + 1;

      const isPrev = currentAccArray.find((a) => a.circleNr === prevCircleNr);
      const isNext = currentAccArray.find((a) => a.circleNr === nextCircleNr);

      if (isNext && (!isPrev || currentAccArray.length === 12)) {
        firstCircleAccs.push(accord.circleNr);
      }
      if (
        isNext &&
        isNext.amount === 2 &&
        accord.amount === 2 &&
        isPrev &&
        isPrev.amount != 2
      ) {
        secondCircleAccs.push(accord.circleNr);
      }
    }
  });
  firstCircleAccs.forEach((circleNr) => {
    addToChainArray(circleNr, part);
  });
  secondCircleAccs.forEach((circleNr) => {
    addToChainArray(circleNr, part, true);
  });

  if (firstCircleAccs.length != 0) {
    checkForWin(part);
  }
}

/**
 * fill up playerChains or observerChains with accord-objects
 * @param {number} circleNr
 * @param {string} part
 * @param {boolean} secondCircle
 */
function addToChainArray(circleNr, part, secondCircle) {
  let currentChain = [];
  let currentAccords = part === "player" ? playerAccords : observerAccords;
  let currChainArray = part === "player" ? playerChains : observerChains;

  let currAcc = currentAccords.find((a) => a.circleNr === circleNr);
  currentChain.push(currAcc);
  let nextCircleNr = currAcc.circleNr + 1 === 13 ? 1 : currAcc.circleNr + 1;

  while (true) {
    let nextAcc = currentAccords.find((acc) => acc.circleNr === nextCircleNr);
    if (nextAcc && !secondCircle && currentChain.length < 12) {
      currentChain.push(nextAcc);
    } else if (nextAcc && secondCircle && currentChain.length < 12) {
      currentChain.push(nextAcc);
    } else {
      currChainArray.push(currentChain);
      break;
    }
    currAcc = nextAcc;
    nextCircleNr = nextAcc.circleNr + 1 === 13 ? 1 : nextAcc.circleNr + 1;
  }
}


async function finishWinnerRound() {
  console.log("finishWinnerRound starts");

  isFinishRound = true;
  playSound("success", "fanfare2", 0.3);
  setTimeout(() => {
    startRound();
  }, 10000);
  isWinner = false;
  swapParts();
  changeNames();  
  let isStartRound = true;
  startRound(isStartRound);
  console.log("finishWinnerRound ends");
}

async function finishNormalRound() {
  console.log("finishWinnerRound starts");
  swapParts();
  changeNames();
  if (gameRef) {
    isActiveUI = !isActiveUI;
    toggleUI();
  }
  let isStartRound = true;
  startRound(isStartRound);
  if (gameRef) uploadGameData(isFinishRound);
    console.log("finishNormalRound ends");
}

async function finishRound() {
  console.log("finishRound starts");
  isFinishRound = true;
  animateTableFrame();
  await new Promise((resolve) => setTimeout(resolve, 1500));
  if (specialInProgress) {
    usedSpecials.pop();
    specialInProgress = false;
  }
  if (usedSpecials.length !== 0) {
    await changeSpecials();
  }
  if (mirrorView) {
    rotateWebsite();
  }
  checkForChain("player");
  checkForChain("observer");
  if (isWinner) {
    await finishWinnerRound(); // darin kein upload
  } else {
    await finishNormalRound(); // darin Upload etc.
  }
  console.log("finishRound ends");
}

//to prevent double-click on finishRound-btn and skip other player
function handleFinishRoundClick() {
  if (!finishButton) {
    finishButton = true;
    finishRound();
  }
  setTimeout(() => {
    finishButton = false;
  }, 3000);
}