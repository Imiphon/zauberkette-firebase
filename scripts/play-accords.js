
/**
 * is saving position to find back after hover and grow up
 * handle click and touch events 
 * @param {} accInCircle is src of 
 */
function savePosition(accInCircle) {
  let originalTransform = window.getComputedStyle(accInCircle).transform;
  let originalZIndex = window.getComputedStyle(accInCircle).zIndex;

  accInCircle.dataset.originalTransform = originalTransform === 'none' ? '' : originalTransform;
  accInCircle.dataset.originalZIndex = originalZIndex === 'auto' ? '0' : originalZIndex;

  accInCircle.addEventListener('mouseenter', function () {
    this.style.transform = `${this.dataset.originalTransform} scale(15) translate(60%, 0%)`;
    this.style.zIndex = '100';
  });

  accInCircle.addEventListener('touchstart', function (e) {
    e.preventDefault(); //prevents direcly retransform
    this.style.transform = `${this.dataset.originalTransform} scale(15) translate(60%, 0%)`;
    this.style.zIndex = '100';
  });

  accInCircle.addEventListener('touchend', function (e) {
    e.preventDefault();
    e.stopPropagation();
    this.click(); // starts clickEvent (choosenAcc())
  });

   accInCircle.addEventListener('click', function (e) {
    e.stopPropagation(); 
  });

  accInCircle.addEventListener('contextmenu', function (e) {
    e.preventDefault(); // prevents options/context-menu of cause to long touch
  });

   document.addEventListener('click', function () {
    accInCircle.style.transform = accInCircle.dataset.originalTransform; 
    accInCircle.style.zIndex = accInCircle.dataset.originalZIndex;
  });
}

/**
* 
* @param {number} prime nr of the allMaj-Object
* @param {boolean} isNew Acc is coming from stack 
* @param {boolean} isObserver is observer or undefined and then player
* @param {boolean} isDouble is set by renderAccords() due to amount from player- or observer
*/
function setAcc(prime, isNew, isObserver, isDouble) {
  let accInAllMajStack = allMaj.find((acc) => acc.nr === prime);
  let circleNr = accInAllMajStack.circleNr;
  let accInCircle = getCardElement(circleNr, isObserver, isDouble);
  if (!accInCircle) return;
  positionAccCards();
  if (isNew && accInAllMajStack.amount <= 0) {
    playSound('failed', 'backMag', 0.5);
    showInfo(infoAccEmpty());
    setTimeout(() => {
      stepBack();
    }, 5000);
    return;
  } else if (isNew && accInAllMajStack.amount > 0) {
    let title = accInAllMajStack.title;
    playSound('accords-magic', 'Maj-mag-' + title, 0.5);
    updateNewCard(accInAllMajStack, accInCircle, isDouble);
  } else {
    accInCircle.src = accInAllMajStack.src;
  }
  savePosition(accInCircle); //to manage zoom position element
}

/** * 
 * @param {*} circleNr 
 * @param {*} isObserver 
 * @param {*} isDouble 
 * @returns circleID of element in html
 */
function getCardElement(circleNr, isObserver, isDouble) {
  let circleID;
  if (isDouble) {
    circleID = isObserver ? "#obsCircle2" : "#playerCircle2";
  } else {
    circleID = isObserver ? "#obsCircle1" : "#playerCircle1";
  }
  return document.querySelector(`${circleID} img:nth-child(${circleNr})`);
}

function updateNewCard(accInAllMajStack, accInCircle, isDouble) {
  let currAcc = { ...accInAllMajStack };
  if (accInAllMajStack.amount != 0) {
    if (isDouble) {
      let accInPlayerStack = playerAccords.find((acc) => acc.nr === accInAllMajStack.nr);
      accInPlayerStack.amount++;
      accInAllMajStack.amount--;
    } else if (!isDouble) {
      currAcc.amount = 1;
      playerAccords.push(currAcc);
      accInAllMajStack.amount--;
    }
    accInCircle.src = accInAllMajStack.src;
    changeWinnerCards();
  } else {
    showWithTimeout(infoAccEmpty(), 4000);
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
  let acc = allMaj.find(acc => acc.circleNr === circleNr);
  playSound('accords-maj', 'Maj-' + acc.title, 0.5);
  if (!tryWizzardStrike && !tryGoblinStrike) return;
  choosenAcc = [];
  if (part === 'observer') {
    if (tryWizzardStrike) {
      observerConnection = choosenAcc;
    }
    choosenAcc = observerAccords.find(acc => acc.circleNr === circleNr);
    let choosenAccElement = document.getElementById(`obsCircle(${circle})Acc(${circleNr})`);
    if (!choosenAccElement.src) return;
    if (choosenAcc && choosenAccElement.classList.contains('accCard')) {
      checkNeighbors(circle, circleNr, part);
    }
  }
  else if (part === 'player') {
    choosenAcc = playerAccords.find(acc => acc.circleNr === circleNr);
    let choosenAccElement = document.getElementById(`playerCircle(${circle})Acc(${circleNr})`);
    if (!choosenAccElement.src) return;
    if (choosenAcc && choosenAccElement.classList.contains('accCard')) {
      checkNeighbors(circle, circleNr, part);
    }
  }
}

function NeighborsAround(circle) {
  if (circle === 1 && (flatNeighbor && sharpNeighbor)) {
    return true;
  }
  if (circle === 2 && flatNeighbor && sharpNeighbor &&
    flatNeighbor.amount === 2 && sharpNeighbor.amount === 2) {
    return true;
  }
  return false;
}

function oneNeighbor(circle) {
  if (circle === 1 && (!flatNeighbor || !sharpNeighbor)) {
    return true;
  }
  else if (circle === 2 &&
    ((flatNeighbor && flatNeighbor.amount === 2) ||
      (sharpNeighbor && sharpNeighbor.amount === 2))) {
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
  flatNeighbor = [];
  sharpNeighbor = [];
  let accords = part === 'observer' ? observerAccords : playerAccords;
  flatNeighbor = accords.find(acc => acc.circleNr === prevCircleNr);
  sharpNeighbor = accords.find(acc => acc.circleNr === nextCircleNr);
  if (NeighborsAround(circle)) {
    showWithTimeout(accIsBetween, 4000, chooseAnotherAcc);
    return;
  }
  else if (!NeighborsAround(circle) || oneNeighbor(circle)) {
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

function isOneSecondPlayerConnection() {
  if (((flatPlayerConnection && flatPlayerConnection.amount === 2) && (sharpPlayerConnection && sharpPlayerConnection.amount != 2)) ||
    (sharpPlayerConnection && sharpPlayerConnection.amount === 2) && (flatPlayerConnection && flatPlayerConnection.amount != 2)) {
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
  if (((!flatPlayerConnection && !sharpPlayerConnection) && !isSecondPlayerConnection()) || 
  ((flatPlayerConnection || sharpPlayerConnection) && isInPlayerArr && !isSecondPlayerConnection()) ) {
    showWithTimeout(noConnection, 5000, chooseAnotherAcc);
    return;
  }
  if (isInPlayerArr && isOneSecondPlayerConnection()) {
    console.log('there is one second player connection');
    addToChain(circle, circleNr, part);
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
function initializeChain(part) {
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
    if ((circle === 1)) {

      if (playerAccords.some(a => a.circleNr === nextAcc.circleNr)) {
        if (!isOneSecondPlayerConnection) {
          console.log('You only get the clicked spell because its next chain neighbor is your connecting spell');
          break;
        }
      }
      chaineToChange.push(nextAcc);
    }
    if (circle === 2 && nextAcc.amount === 2) {
      console.log('circle === 2 && nextAcc.amount === 2');
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
 * @param {string} part - The part identifier ('player' or 'observer').
 */
function addToChain(circle, circleNr, part) {
  let { currentAccArray, chaineToChange, currAcc } = initializeChain(part);
  if (sharpNeighbor) {
    processDominantChain(circle, currentAccArray, chaineToChange, currAcc);
  } else if (flatNeighbor) {
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

  if (((choosenAcc === flatPlayerConnection) || (choosenAcc === sharpPlayerConnection)) && !(flatPlayerConnection && sharpPlayerConnection) && choosenAcc.amount != 2) {
    // if choosenAcc in playerPart the connection for wizzardTakes
    showWithTimeout(needForConnection, 4000);
    wizzardGives = [];
    return;
  }
  wizzardStrike(observerAccords, playerAccords, wizzardTakes);
  wizzardStrike(playerAccords, observerAccords, wizzardGives);
  tryWizzardStrike = false;
  showWithTimeout(infoWizzardComplete);
  setTimeout(() => {
    specialInProgress = false;
    finishRound();
  }, 4000);
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
    specialInProgress = false;    
    finishRound();
  }, 2000);
}