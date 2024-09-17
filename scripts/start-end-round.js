

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

function changeSpecials() {
    usedSpecials.forEach(special => {
        currentCardID = special.index;
        special.card.style.visibility = 'visible';
        changeCard();
    });
    usedSpecials = [];
    currentSpecial = null;
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

function handleFinishRoundClick() {
    if (!finishButton) {
        finishButton = true;
        finishRound();
    }
    setTimeout(() => {
        finishButton = false;
    }, 3000);
}

async function finishRound() {
    animateTableFrame();
    await new Promise(resolve => setTimeout(resolve, 1500));
    if (specialInProgress) {
        usedSpecials.pop(); // Last special will be removed
        specialInProgress = false;
    }
    if (usedSpecials.length != 0) {
        changeSpecials();
    }
    checkForChain('player');
    checkForChain('observer');
    await swapParts();
    changeNames();
    if (mirrorView) {
        rotateWebsite();
    }
    startRound();
}

function animateTableFrame() {
    let tableFrame;
    if (!mirrorView) tableFrame = document.querySelector('.table-frame');
    else if (mirrorView) tableFrame = document.querySelector('.table-mirror-frame');
    tableFrame.style.animation = 'none';
    requestAnimationFrame(() => {
        tableFrame.style.animation = 'fadeOutIn 3s ease-in-out';
    });
}

function changeNames() {
    let obsName = document.getElementById('obsNameID');
    let playName = document.getElementById('playNameID');
    [obsName.innerHTML, playName.innerHTML] = [playName.innerHTML, obsName.innerHTML];
}

//starts after first time startRound()
async function swapParts() { // Kay why async? shorter possible
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

// AN DIESER STELLE AUF FIREBASE DEN AKTUELLEN STAND VON PLAYER UND OBSERVER ÜBERGEBEN 
// ALSO: post {playerCards, observerCards, playerAccords, observerAccords und die Namen der Spieler }
// DANN VON FIREBASE DEN AKTUELLEN STAND HERUNTERLADEN
// ABER AUCH BEI JEDER KARTENBEWEGUNG NOCH EINMAL POSTEN UND OBSERVER AKTIVIEREN BEIM GEGNER
function startRound() {
    let name = document.getElementById('playNameID');
    name.style.animation = 'none';
    //a minimal delay to get sure for full animation
    requestAnimationFrame(() => {
        name.style.animation = 'yellowNameFade 6s forwards';
    });
    btnGroup1();
    disableCardClicks();
    setBackArrays();
    setBackBooleans();
    setTimeout(() => {
        playSound('success', 'gong-deep', 0.5);
    }, 500);
}

function checkForWin(part) {
    let currChainArr = part === 'player' ? playerChains : observerChains;
    let winnerChain = currChainArr.find(chain => chain.length >= goalValue);
    if (winnerChain) youWin(part, winnerChain.length);
}

/**
 * Is checking for accord chains in accord(-Arrays) while finishRound() 
 * @param {string} part is 'player'or 'observer'
 */
function checkForChain(part) {
    let currentAccArray = part === 'player' ? playerAccords : observerAccords;

    const firstCircleAccs = [];
    const secondCircleAccs = [];

    currentAccArray.forEach((accord) => {
        if (accord) {
            const prevCircleNr = accord.circleNr - 1 === 0 ? 12 : accord.circleNr - 1;
            const nextCircleNr = accord.circleNr + 1 === 13 ? 1 : accord.circleNr + 1;

            const isPrev = currentAccArray.find(a => a.circleNr === prevCircleNr);
            const isNext = currentAccArray.find(a => a.circleNr === nextCircleNr);

            if (isNext && (!isPrev || currentAccArray.length === 12)) {
                firstCircleAccs.push(accord.circleNr);
            }
            if (isNext && isNext.amount === 2 && accord.amount === 2 && isPrev.amount != 2) {
                secondCircleAccs.push(accord.circleNr);
            }
        }
    });
    firstCircleAccs.forEach(circleNr => {
        addToChainArray(circleNr, part);
    });
    secondCircleAccs.forEach(circleNr => {
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
    let currentAccords = part === 'player' ? playerAccords : observerAccords;
    let currChainArray = part === 'player' ? playerChains : observerChains;

    let currAcc = currentAccords.find(a => a.circleNr === circleNr);
    currentChain.push(currAcc);
    let nextCircleNr = currAcc.circleNr + 1 === 13 ? 1 : currAcc.circleNr + 1;

    while (true) {
        let nextAcc = currentAccords.find(acc => acc.circleNr === nextCircleNr);
        if (nextAcc && !secondCircle && currentChain.length < 12) {
            currentChain.push(nextAcc);
        }
        else if (nextAcc && secondCircle && currentChain.length < 12) {
            currentChain.push(nextAcc);
        } else {
            currChainArray.push(currentChain);
            break;
        }
        currAcc = nextAcc;
        nextCircleNr = nextAcc.circleNr + 1 === 13 ? 1 : nextAcc.circleNr + 1;
    }
}

function setBackArrays() {
    currentCardID = -1;
    clickAccount = 0;
    cardCombi = [];
    choosenCards = [];
    accOffer = [];
    mellotArray = [];
    currentSpecial = null;
    specialInProgress = false;
    usedSpecials = [];
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