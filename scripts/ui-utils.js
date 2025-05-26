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
    if (usedSpecials.length != 0 && cardString === "playerCard") {
      usedSpecials.forEach((usedSpecial) => {
        let specialCard = document.getElementById(
          cardString + `${usedSpecial.index}`
        );
        if (specialCard) {
          specialCard.style.opacity = 0.5;
          specialCard.style.pointerEvents = "none";
        }
      });
    }
  });
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

  // get local <img> from #playerStackID
  const playerContainer = document.getElementById("playerStackID");
  const clickedCard = playerContainer.querySelector(
    `.card[stackNr="${stackNr}"]`
  );
  if (!clickedCard) return;

  // 2) Toggle Opacity
  const curOp = clickedCard.style.opacity == 1 ? 0.5 : 1;
  clickedCard.style.opacity = curOp;
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