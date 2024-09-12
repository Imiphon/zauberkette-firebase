function buildStack(Cards) {
    let targetArray = (Cards === "playerCards") ? playerCards : observerCards;
    
    for (let i = 0; i < 5; i++) {
        let newCard = randomStack();
        targetArray.push(newCard); 
    }
   //testModus(); 
    Cards === "playerCards" ? renderStack("playerCard", "playerStackID") : renderStack("observerCard", "observerStackID");
}

const testCards = [
    { nr: 0, stackNr: -1, title: 'gnom', amount: 1, src: 'assets/images/specials/joker.jpg' },
    { nr: 0, stackNr: -1, title: 'gnom', amount: 1, src: 'assets/images/specials/joker.jpg' },
    { nr: 0, stackNr: -1, title: 'gnom', amount: 1, src: 'assets/images/specials/joker.jpg' },
    { nr: 13, stackNr: -1, title: 'mellot', amount: 1, inUse: false, src: 'assets/images/specials/mellot.jpg' },
    //{ nr: 13, stackNr: -1, title: 'mellot', amount: 1, inUse: false, src: 'assets/images/specials/mellot.jpg' },
    //{ nr: 14, stackNr: -1, title: 'goblin', amount: 1, inUse: false, src: 'assets/images/specials/goblin.jpg' },
    { nr: 15, stackNr: -1, title: 'wizzard', amount: 1, inUse: false, src: 'assets/images/specials/wizzard.jpg' }
  ]

function testModus() {
    playerCards = testCards; 
    console.log('testCards activated');
}


function renderStack(player, part) {
    let currCardStack = docID(part);
    currCardStack.innerHTML = '';
    let cards = player === "playerCard" ? playerCards : observerCards;
    
    for (let i = 0; i < cards.length; i++) {
        let card = cards[i];
        let img_id = player === "playerCard" ? `playerCard${i}` : `observerCard${i}`;
        let optAccsPart = player === "playerCard" ? `optAccsPlayer` : `optAccsObserver`;
        card.stackNr = i;
        currCardStack.innerHTML += `
        <div class="pl-card-frame">
          <img class="card" id="${img_id}" 
          stackNr="${card.stackNr}"  
          src="${card.src}"
          onclick="getCardInfo(${i}); playSound('tone', '${card.title}', 0.3)">
          <div class="brass-plate no-btn small-font" id="${optAccsPart}${i}"></div>
        </div>
        `;
        let optAccNr = findOptAccords(card.nr);
        renderOptAccords(optAccNr, card.stackNr, optAccsPart);
    }
    stackOpacity1(cards, player);
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
    const finishButton = document.getElementById('changeClicks(7)');
    finishButton.disabled = true;  // Deaktiviert den Button

    finishRound().then(() => {
        // Optional: Reaktiviere den Button nach Abschluss der Funktion
        finishButton.disabled = false;
    });
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

function setBackBooleans(){
    isChainCheck = false;
    isAwaitChangeCard = false;
}

function renderCircles() {
    for (let i = 1; i < 3; i++) {
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
    renderAccords(false);//isPlayerCircle 
    renderAccords(true); //isObserver
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