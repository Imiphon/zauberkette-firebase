/*------------------------------- SET OR ADD ACCORD(S) -------------------------------*/

/**
 * 
 * @param {number} prime 
 * @param {boolean} isNew Acc is coming from stack 
 * @param {boolean} isObserver is observer or undefined and then player
 * @param {boolean} isDouble is set by renderAccords() due to amount from player- or observer
 */
function setAcc(prime, isNew, isObserver, isDouble) {
  let accInStack = allMaj.find((acc) => acc.nr === prime);
  if (isNew && accInStack.amount <= 0) {
    console.log('accInStack is empty.');
    stepBack();
    return
  } else if (isNew && accInStack.amount > 0) {
    accInStack.amount--;
  }
  let circleNr = accInStack.circleNr;
  let accInCircle = getCardElement(circleNr, isObserver, isDouble);

  if (isNew) {
    updateNewCard(accInStack, accInCircle);
  } else {
    accInCircle.src = accInStack.src;
  }
  if (isDouble) {
    accInCircle.src = accInStack.src;
  }
  savePosition(accInCircle);
}

function getCardElement(circleNr, isObserver, isDouble) {
  let circleID
  if (isDouble) {
    circleID = isObserver ? "#obsCircle2" : "#playerCircle2";
  } else {
    circleID = isObserver ? "#obsCircle1" : "#playerCircle1";
  }
  return document.querySelector(`${circleID} img:nth-child(${circleNr})`);
}

function updateNewCard(accInStack, accInCircle) {
  if (accInStack.amount != 0) {
    playerAccords.push(accInStack);
    //accInStack.amount--;
    accInCircle.src = accInStack.src;
    changeWinnerCards();
  } else {
    showInfo(infoAccEmpty());
    clickedCardID = -1;
    startRound();
  }
}

/*------------------------------- choose Accord -------------------------------*/

/**
 * gets param from div click in observer Circle
 * (and for playing wizzard in a second round in player Circle)
 * @param {number} circle first or second circle
 * @param {number} circleNr of clicked Accord
 * @param {string} part is clicked part in 'observer' or 'player'
 */
function chooseAccord(circle, circleNr, part) {
  choosenAcc = [];
  if (part === 'observer') {
    choosenAcc = observerAccords.find(acc => acc.circleNr === circleNr);
    let choosenAccElement = document.getElementById(`obsCircle(${circle})Acc(${circleNr})`);
    if (choosenAcc && choosenAccElement.classList.contains('accCard')) {
      checkNeighbors(circle, circleNr, part);
    }
  }
  else if (part === 'player') {
    choosenAcc = playerAccords.find(acc => acc.circleNr === circleNr);
    let choosenAccElement = document.getElementById(`playerCircle(${circle})Acc(${circleNr})`);
    if (choosenAcc && choosenAccElement.classList.contains('accCard')) {
      checkNeighbors(circle, circleNr, part);
    }
  }
}

function neighboursAround(circle) {
  if (circle === 1 && (flatNeighbour && sharpNeighbour)) {
    return true;
  }
  if (circle === 2 && flatNeighbour && sharpNeighbour &&
    flatNeighbour.amount === 2 && sharpNeighbour.amount === 2) {
    return true;
  }
  return false;
}

function oneNeighbour(circle) {
  if (circle === 1 && (!flatNeighbour || !sharpNeighbour)) {
    return true;
  }
  else if (circle === 2 &&
    ((flatNeighbour && flatNeighbour.amount === 2) ||
      (sharpNeighbour && sharpNeighbour.amount === 2))) {
    return true;
  }
  return false;
}

/**
 * check for neighbor accords from 1 to 12 to 1 in one circle
 * @param {number} circle first or second circle
 * @param {number} circleNr of clicked Accord
 * @param {string} part is clicked part in 'observer' or 'player' 
 */
function checkNeighbors(circle, circleNr, part) {
  let prevCircleNr = circleNr - 1 === 0 ? 12 : circleNr - 1;
  let nextCircleNr = circleNr + 1 === 13 ? 1 : circleNr + 1;
  flatNeighbour = [];
  sharpNeighbour = [];
  let accords = part === 'observer' ? observerAccords : playerAccords;
  flatNeighbour = accords.find(acc => acc.circleNr === prevCircleNr);
  sharpNeighbour = accords.find(acc => acc.circleNr === nextCircleNr);
  if (neighboursAround(circle)) {
    showWithTimeout(accIsBetween, 2000, chooseAnotherAcc);
    return;
  }
  else if (!neighboursAround(circle) || oneNeighbour(circle)) {
    if (part === 'observer') {
      checkConnection(circle, circleNr, part);
    }
    else if (part === 'player') {
      //checkConnection() from wizzardGives with Accs in observer not neccassary
      addToChain(circle, circleNr, part);
    }
  }
}

/**
 * set flatPlayerConnection and sharpPlayerConnection to global 
 * @param {number} circleNr from choosenAcc in observer
 */
function getPlayerConnections(circleNr) {
  let prevCircleNr = circleNr - 1 === 0 ? 12 : circleNr - 1;
  let nextCircleNr = circleNr + 1 === 13 ? 1 : circleNr + 1;
  flatPlayerConnection = playerAccords.find(acc => acc.circleNr === prevCircleNr);
  sharpPlayerConnection = playerAccords.find(acc => acc.circleNr === nextCircleNr);
}

function isSecondPlayerConnection() {
  if ((flatPlayerConnection && flatPlayerConnection.amount === 2) ||
    (sharpPlayerConnection && sharpPlayerConnection.amount === 2)) {
    return true;
  }
  return false;
}

/**
 * check the connection for choosenAcc in playerAccords
 * @param {*} circle 
 * @param {*} circleNr 
 * @param {*} part 
 * needs actually: if(askForConnectionOfNeighbor) *wenn der Ketten-Nachbar vom choosenChord
 * schon als Ketten-Nachbar vom passenden playerAccord besteht, dann wird nur der choosenAcc 
 * übergeben und nicht die ganze Kette von observer. Dafür muss die Func 
 */
function checkConnection(circle, circleNr, part) {
  let isInPlayerArr = playerAccords.find(acc => acc.circleNr === choosenAcc.circleNr);
  getPlayerConnections(circleNr);
  if ((!flatPlayerConnection && !sharpPlayerConnection) && !isSecondPlayerConnection()) {
    showWithTimeout(noConnection, 2000, chooseAnotherAcc);
    return;
  }
  else if (!isInPlayerArr && ((flatPlayerConnection || sharpPlayerConnection))
  ) {
    if (tryGoblinStrike) {
      goblinStrike();
    } else if (tryWizzardStrike) {
      addToChain(circle, circleNr, part);
    }
  }
  else if (isInPlayerArr && isSecondPlayerConnection()) {
    if (tryGoblinStrike) {
      goblinStrike();
    } else if (tryWizzardStrike) {
      addToChain(circle, circleNr, part);
    }
  }
}


/*------------------------------- USE WIZZARD -------------------------------*/

function sortAccsinCurrAccArray(currentAccArray) {
  return currentAccArray.sort((a, b) => a.circleNr - b.circleNr);
}


/**
 * Initializes the chain by selecting the correct accord array and initial accord.
 * Sorts the accord array and adds the chosen accord to the chain.
 * @param {number} circle - The circle identifier.
 * @param {number} circleNr - The circle number.
 * @param {string} part - The part identifier ('player' or 'observer').
 * @returns {Object} - An object containing the currentAccArray, chaineToChange, and currAcc.
 */
function initializeChain(circle, circleNr, part) {
  let currentAccArray = part === 'player' ? playerAccords : observerAccords;
  let chaineToChange = part === 'player' ? wizzardGives : wizzardTakes;
  currentAccArray = sortAccsinCurrAccArray(currentAccArray);

  let currAcc = choosenAcc;
  chaineToChange.push(choosenAcc);

  return { currentAccArray, chaineToChange, currAcc };
}

/**
 * Processes the dominant chain in a clockwise direction.
 * Adds accords to the chain based on the given rules.
 * @param {number} circle - The circle identifier.
 * @param {Array} currentAccArray - The array of current accords.
 * @param {Array} chaineToChange - The chain to which accords are added.
 * @param {Object} currAcc - The current accord.
 */
function processDominantChain(circle, currentAccArray, chaineToChange, currAcc) {
  let nextCircleNr = currAcc.circleNr + 1 === 13 ? 1 : currAcc.circleNr + 1;
  
  while (true) {
    let nextAcc = currentAccArray.find(acc => acc.circleNr === nextCircleNr);
    if (!nextAcc) break;
    if ((circle === 1) || (circle === 2 && nextAcc.amount === 2)) {
      
      if (playerAccords.some(a => a.circleNr === nextAcc.circleNr)) {
        // Needs actually an update of options for the possibility if the observer-chain is blocked in playerCircle1 but possible in playerCircle2
        console.log('You only get the clicked spell because its next chain neighbor is your connecting spell');
        break;
      }
      chaineToChange.push(nextAcc);
    }
    nextCircleNr = nextAcc.circleNr + 1 === 13 ? 1 : nextAcc.circleNr + 1;
  }
}

/**
 * Processes the subdominant chain in a counterclockwise direction.
 * Adds accords to the chain based on the given rules.
 * @param {number} circle - The circle identifier.
 * @param {Array} currentAccArray - The array of current accords.
 * @param {Array} chaineToChange - The chain to which accords are added.
 * @param {Object} currAcc - The current accord.
 */
function processSubdominantChain(circle, currentAccArray, chaineToChange, currAcc) {
  let prevCircleNr = currAcc.circleNr - 1 === 0 ? 12 : currAcc.circleNr - 1;

  while (true) {
    let nextAcc = currentAccArray.find(acc => acc.circleNr === prevCircleNr);
    if (!nextAcc) break;
    if ((circle === 1) || (circle === 2 && nextAcc.amount === 2)) {
      chaineToChange.push(nextAcc);
    }
    prevCircleNr = nextAcc.circleNr - 1 === 0 ? 12 : nextAcc.circleNr - 1;
  }
}

/**
 * Adds the chosen accord to the chain and processes the dominant or subdominant chain
 * based on the neighbor type.
 * @param {number} circle - The circle identifier.
 * @param {number} circleNr - The circle number.
 * @param {string} part - The part identifier ('player' or 'observer').
 */
function addToChain(circle, circleNr, part) {
  let { currentAccArray, chaineToChange, currAcc } = initializeChain(circle, circleNr, part);

  if (sharpNeighbour) {
    processDominantChain(circle, currentAccArray, chaineToChange, currAcc);
  } else if (flatNeighbour) {
    processSubdominantChain(circle, currentAccArray, chaineToChange, currAcc);
  }

  if (part === 'observer') {
    choosePlayerAccs();
  } else if (part === 'player') {
    startExchange(circle, circleNr, part);
  }
}

/**
 * Toggles between two text options and between enabledClickedAccords.
 * called by addToChain()
 */
function choosePlayerAccs() {
  if (wizzardTakes.length === 1) {
    showInfo(wizzardTookSoloCard());
  } else if (wizzardTakes.length > 1) {
    showInfo(wizzardTookChain());
  }
  choosenAcc = [];
  disableAccClicks();
  enablePlayerAccordClicks();
}

/**
 * Player choose own card(s) to exchange and finish wizzardstrike
 * @param {*} circle
 * @param {*} circleNr 
 * @param {*} part 
 */
function startExchange(circle, circleNr, part) {
  choosenAcc = playerAccords.find(acc => acc.circleNr === circleNr);

  if ((choosenAcc === flatPlayerConnection) || (choosenAcc === sharpPlayerConnection)) {
    // if choosenAcc in playerPart the connection for wizzardTakes
    showWithTimeout(needForConnection, 2000); // does return in this func working?
  }
  wizzardStrike(observerAccords, playerAccords, wizzardTakes);
  wizzardStrike(playerAccords, observerAccords, wizzardGives);
  showWithTimeout(infoWizzardComplete, 2000, finishRound);
}

/**
 * transfers the accords from player to observer, converse and renew the amounts
 * get correct order of parameters from startExchange()
 * @param {Array} source is observerAccords or playerAccords
 * @param {Array} target is playerAccords or observerAccords
 * @param {Array} items is wizzardTakes or wizzardGives
 */
function wizzardStrike(source, target, items) {
  items.forEach(item => {
    let targetItem = target.find(acc => acc.nr === item.nr);
    if (targetItem) {// if source-acc still exist in target-array
      targetItem.amount++;
    } else {
      target.push({ ...item, amount: 1 }); // set amount to 1 if adding new item
    }

    const sourceItem = source.find(acc => acc.nr === item.nr);
    if (sourceItem) {
      if (sourceItem.amount > 1) {
        // if more than one acc in source
        sourceItem.amount--; // decrement by 1 since amount is always 1 in items
      } else {
        const index = source.indexOf(sourceItem);
        source.splice(index, 1);
      }
    }
  });
}


/*------------------------------- USE GOBLIN -------------------------------*/

function goblinStrike() {
  let index = observerAccords.findIndex(acc => acc === choosenAcc);
  if (choosenAcc.amount === 2) {
    choosenAcc.amount--;
  } else {
    observerAccords.splice(index, 1);
  }
  let double = playerAccords.find(acc => acc.nr === choosenAcc.nr);
  if (double) {
    double.amount++;
  } else {
    playerAccords.push(choosenAcc);
  }
  specialInProgress = false;
  tryGoblinStrike = false;
  showInfo(infoGoblinComplete())
  setTimeout(() => {
    finishRound();
  }, 2000);
}