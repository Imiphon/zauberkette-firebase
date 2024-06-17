function buildStack(Cards) { // Kay -- joined function for player and observer
    for (let i = 0; i < 5; i++) {
        let newCard = randomStack(); //is given to eval()
        eval(Cards + ".push(newCard)") // Kay -- could just use randomStack directly
    }
    Cards === "playerCards" ? renderStack("playerCard", "playerStackID") : renderStack("observerCard", "observerStackID");
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
          onclick="getCardInfo(${i})">
          <div class="optAccContainer" id="${optAccsPart}${i}"></div>
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

/**
 * async function renderObserverStack() {
    let currObserverCards = document.getElementById("observerStackID");
    currObserverCards.innerHTML = '';
    for (let i = 0; i < observerCards.length; i++) {
        let card = observerCards[i];
        currObserverCards.innerHTML += `      
          <img class="card" id="observerCard${i}" 
          stackNr="${i}"         
           src="${card.src}"
           >`;

        let cardInStack = document.getElementById(`observerCard${i}`);
        cardInStack.style.opacity = 1;
    }
    stackOpacity1(observerCards, 'observerCard');
}
*/

function changeSpecial() {
    usedSpecials.forEach(element => {
        clickedCardID = element.getAttribute('stackNr');
        element.style.visibility = 'visible';
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

async function finishRound() {
    if (specialInProgress) {
        usedSpecials.pop(); //last special will be removed
        specialInProgress = false;
    }
    if (usedSpecials.length != 0) {
        changeSpecial();
    }

    checkChainLength('player');
    checkChainLength('observer');
    await swapParts();
    changeNames();
    startRound();
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
    //console.log('new playerAcc: ', playerAccords);
    //console.log('new observerAcc: ', observerAccords);
    renderStack("playerCard", "playerStackID");
    renderStack("observerCard", "observerStackID");
    renderCircles();
}

function startRound() {
    btnGroup1();
    disableCardClicks();
    setBackArrays();
    // AN DIESER STELLE AUF FIREBASE DEN AKTUELLEN STAND VON PLAYER UND OBSERVER ÜBERGEBEN 
    // ALSO: post {playerCards, observerCards, playerAccords, observerAccords und die Namen der Spieler }
    // DANN VON FIREBASE DEN AKTUELLEN STAND HERUNTERLADEN
    // ABER AUCH BEI JEDER KARTENBEWEGUNG NOCH EINMAL POSTEN UND OBSERVER AKTIVIEREN BEIM GEGNER
}

/**
 * Is checking for accord chains in accord(-Arrays) while finishRound() 
 * @param {string} part is 'player'or 'observer'
 */
function checkChainLength(part) {
    let currentAccArray = part === 'player' ? playerAccords : observerAccords;
    let currChainArr = part === 'player' ? playerChains : observerChains;
    currentAccArray.forEach((accord) => {
        if (accord) {
            const prevCircleNr = accord.circleNr - 1 === 0 ? 12 : accord.circleNr - 1;
            const nextCircleNr = accord.circleNr + 1 === 13 ? 1 : accord.circleNr + 1;

            const isPrev = currentAccArray.find(a => a.circleNr === prevCircleNr);
            const isNext = currentAccArray.find(a => a.circleNr === nextCircleNr);

            //one chain in one of the circles
            if ((!isPrev && accord.amount === 1 && isNext && isNext.amount >= 1) ||
                (!isPrev && accord.amount === 2 && isNext && isNext.amount === 1) ||
                (isPrev && isPrev.amount === 1 && accord.amount === 2 && isNext && isNext.amount === 2)) {
                addToChainArray(1, accord.circleNr, part); //'player' or 'observer'
            }

            if (!isPrev && accord.amount === 2 && isNext && isNext.amount === 2) {
                addToChainArray(1, accord.circleNr, part);
                addToChainArray(2, accord.circleNr, part);
            }
        } else {
            return;
        }
    });
    console.log(part, 'Ende checkChainLength() besitzt folgende Ketten: ', currChainArr);
    let winnerChain = currChainArr.find(chain => chain.length >= goalValue);
    if (winnerChain) youWin(part, winnerChain.length); 
}


/**
 * Is adding accords in chains and collect them in chain-arrays 
 * @param {string} part is 'player'or 'observer'
 * @param {number} circle 
 * @param {number} circleNr 
 * @returns 
 */
function addToChainArray(circle, circleNr, part) {
    let currentChain = [];
    let currentAccArray = part === 'player' ? playerAccords : observerAccords;
    let currChainArr = part === 'player' ? playerChains : observerChains;

    let currAcc = currentAccArray.find(a => a.circleNr === circleNr);
    if (!currAcc) return; // If the starting accord is not found, return

    currentChain.push(currAcc);

    let nextCircleNr = currAcc.circleNr + 1 === 13 ? 1 : currAcc.circleNr + 1;

    while (true) {
        let nextAcc = currentAccArray.find(acc => acc.circleNr === nextCircleNr);
        if (!nextAcc) {
            currChainArr.push(currentChain);
            break;
        }
        if ((circle === 1) || (circle === 2 && nextAcc.amount === 2)) {
            currentChain.push(nextAcc);
        } else {
            currChainArr.push(currentChain);
            break;
        }
        nextCircleNr = nextAcc.circleNr + 1 === 13 ? 1 : nextAcc.circleNr + 1;
    }

}

function setBackArrays() {
    clickedCardID = -1;
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
    isChainCheck = false;
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
    //isPlayerCircle or isObserver
    renderAccords(false);
    renderAccords(true);
}

function renderAccords(isObserver) {
    let array;
    if (isObserver) {
        array = observerAccords;
    } else {
        array = playerAccords;
    }
    if (array != []) {
        array.forEach(accord => {
            //accNr,isNew,isObserver,isDouble
            setAcc(accord.nr, false, isObserver, false);
            if (accord.amount === 2) {
                setAcc(accord.nr, false, isObserver, true);
            }
        });
    }
}