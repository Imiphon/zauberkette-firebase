
  
  /**
   * add new random card into the playerCards and 
   * old card is getting amount++ in allTones[]
   */
  function changeCard() {
    let newCard = randomStack(); // get randomNewCard with amount:1 --Kay-- or height
    let oldNr = playerCards[currentCardID]['nr']; // Kay-- Selected card?
    let allTonesUpdate = allTones.find((card) => card.nr === oldNr); // Kay -- work it correct?
    if (allTonesUpdate) {
      allTonesUpdate.amount++;
    }
    playerCards[currentCardID] = newCard; // Kay -- add card to player cards
    let cardElement = docID(`playerCard${currentCardID}`);
    cardElement.src = newCard.src; //all infos include
    renderStack("playerCard", "playerStackID"); //Kay --render the player Stack
    disableCardClicks(); //Kay --remove Pointer and Click-eventlistener of 
    btnGroup2(); //Kay -- set Btns
  }
  
  function randomStack() {
    let availableCards = allTones.filter(card => card.amount > 0);
    let randomIndex = Math.floor(Math.random() * availableCards.length);
    let randomCard = availableCards[randomIndex];
  
    do { //Kay -- nutzt man noch do 
      randomIndex = Math.floor(Math.random() * allTones.length);
      randomCard = allTones[randomIndex];
  
      if (randomCard.amount >= 1) {
        let newAmount = 1; // set amount for userCard to 1
        allTones[randomIndex].amount -= 1; // reduce  amount in allTones - 1
        return { ...randomCard, amount: newAmount };
      }   //repeat process 
    } while (randomCard === null || randomCard.amount === 0);
  }
  
  function changeWinnerCards() { // Kay -- cards combine to magic card. 
    for (i = 0; i < cardCombi.length; i++) {
      currentCardID = cardCombi[i].stackNr;
      changeCard();
      cardCombi[i].stackNr = -1;
    }
    noBtns(); //Kay reset all Button style
    showInfo(infoWinMagic());
    setTimeout(() => {
      finishRound();
    }, 5000);
  }
  
  /*------------------------------- CLICK CARD STUFF -------------------------------*/
  
  function stepBack() {
    if (specialInProgress) {
      let special = usedSpecials.pop();
      special.card.style.opacity = 1;
      specialInProgress = false;
      mellotArray = [];
      tryWizzardStrike = false;
      tryGoblinStrike = false;
    }
    if (isAwaitChangeCard) {
      if (cardClickHandler) {
        document.removeEventListener('click', cardClickHandler);
        cardClickHandler = null;
      }
      btnGroup1();
    } else {
      btnGroup2();
    }
    stackOpacity1(playerCards, 'playerCard');
    setBackArrays();
    setBackBooleans();
    playSound('failed', 'backMag', 0.5);
    disableCardClicks();
  }
  
  function enablePlayerCards() {
    const styledCards = document.querySelectorAll('#playerStackID .card');
    styledCards.forEach((card) => {
      card.style.pointerEvents = 'auto';
    });
  }
  
  function enableObserverCards() {
    const styledCards = document.querySelectorAll('#observerStackID .card');
    styledCards.forEach((card) => {
      card.style.pointerEvents = 'auto';
    });
  }
  
  function disableCardClicks() {
    const styledCards = document.querySelectorAll('.card');
    styledCards.forEach((card) => {
      card.style.pointerEvents = 'none';
      card.removeEventListener('click', getCardInfo);
    });
  }
  
  function getCardInfo(i) { 
    currentCardID = i; // Set glob arr
  }
  
  function enableObserverAccordClicks() {
    const styledCards = document.querySelectorAll('#obsCircle1 .accCard, #obsCircle2 .accCard');
    styledCards.forEach((accordCard) => {
      accordCard.style.pointerEvents = 'auto';
    });
  }
  
  function enablePlayerAccordClicks() {
    const styledCards = document.querySelectorAll('#playerCircle1 .accCard, #playerCircle2 .accCard');
    styledCards.forEach((accordCard) => {
      accordCard.style.pointerEvents = 'auto';
    });
  }
  
  function disableAccClicks() {
    const styledCards = document.querySelectorAll('.accCard');
    styledCards.forEach((card) => {
      card.style.pointerEvents = 'none';
      card.removeEventListener('click', getCardInfo);
    });
  }
  
  /**
   * is saving position to find back after hover and grow up
   * @param {} accInCircle 
   */
  function savePosition(accInCircle) {
    let originalTransform = window.getComputedStyle(accInCircle).transform;
    let originalZIndex = window.getComputedStyle(accInCircle).zIndex;
    let originalLeft = window.getComputedStyle(accInCircle).left;
    //let originalTop = window.getComputedStyle(accInCircle).top;
  
    accInCircle.dataset.originalTransform = originalTransform === 'none' ? '' : originalTransform;
    accInCircle.dataset.originalZIndex = originalZIndex === 'auto' ? '0' : originalZIndex;
    accInCircle.dataset.originalLeft = originalLeft;
    //accInCircle.dataset.originalTop= originalTop;
  
    accInCircle.addEventListener('mouseenter', function () {
      this.style.transform = `${this.dataset.originalTransform} scale(15)`;
      this.style.zIndex = '100';
      this.style.left = `calc(${this.dataset.originalLeft} + 90%)`;
      //this.style.top = `calc(${this.dataset.originalTop} - 30%)`;
    });
    accInCircle.addEventListener('mouseleave', function () {
      this.style.transform = this.style.transform = this.dataset.originalTransform;
      this.style.zIndex = this.dataset.originalZIndex;
      this.style.left = this.dataset.originalLeft;
      //this.style.top = this.dataset.originalTop;
    });
  }
  
  async function awaitChangeCard() {
    isAwaitChangeCard = true;
    enablePlayerCards(); // getCardInfo activ
    showInfo(infoChange());
    btnGroup3();
    // docID('changeClicks(1)').style.display = 'none';
    currentCardID = await waitForCardClick();
    changeCard();
    currentCardID = -1;
    isAwaitChangeCard = false;
  }
  
  function waitForCardClick() {
    return new Promise((resolve, reject) => {
      cardClickHandler = function (event) {
        const cardIndex = event.target.getAttribute('stackNr');
        if (cardIndex === null) return; // Ignore other clicks
        currentCardID = parseInt(cardIndex, 10); // 10 stands for decimal count system
        document.removeEventListener('click', cardClickHandler);
        resolve(cardIndex);
      };
      document.addEventListener('click', cardClickHandler);
    });
  }
  
  //Parameters with ()
  function showInfo(infoTemplate) {
    let info = docID("infoTextID");
    if (!info) {
      console.log('found not the info div');
      return;
    }
    info.innerHTML = '';
    info.innerHTML += infoTemplate;
    // Setzt die Animation direkt über JavaScript
    info.style.animation = 'none';
    info.offsetHeight; // Trigger reflow
    info.style.animation = null; // Reset die Animation
    info.style.animation = 'yellowNameFade 4s forwards';
  }
  
  //Parameters without () 
  function showWithTimeout(func, timeout, optFunc) {
    showInfo(func());
    setTimeout(() => {
      if (optFunc) {
        showInfo(optFunc());
      } else {
        return;
      }
    }, timeout);
  }
  
  /**
   * Vergleicht neue 
   */
  function youWin(part, length) {
    alert(part + ' gewinnt mit einer Kettenzahl von: ' + length);
  }
