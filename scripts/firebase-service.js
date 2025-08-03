const firebaseConfig = {
  apiKey: "AIzaSyCV-gXP08IbrQl4LybuWmdLphKHxo1kg_E",
  authDomain: "zauberkette-34794.firebaseapp.com",
  projectId: "zauberkette-34794",
  storageBucket: "zauberkette-34794.appspot.com",
  messagingSenderId: "215710722712",
  appId: "1:215710722712:web:6af29f425305839a8bbeed",
  measurementId: "G-WPEL0B6YQL",
};

// check Firebase if fb is initialized
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Ensure there's always a function to call
window.stepBack =
  window.stepBack ||
  function () {
    console.log("waiting for stepBack() in play-table.js");
  };

const db = firebase.firestore();
let gameRef = null;
if (gameRef) gameRef.set(jsonData, { merge: true });
let gameID = null;
// let isGameID = gameID === null ? false : true;
let isLocalUpdate = false;
let onStepBack = stepBack();

function clearOldGames() {
  const cutoff = Date.now() - 5 * 60 * 1000;

  db.collection("on-table")
    .where("timeStamp", "<=", cutoff)
    .get()
    .then((snapshot) => {
      if (snapshot.empty) return;
      const batch = db.batch();
      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });

      return batch
        .commit()
        .then(() => {
          console.log(`[clearOldGames] ${snapshot.size}`);
        })
        .catch((err) => {
          console.error("[clearOldGames] Error:", err);
        });
    })
    .catch((err) => {
      console.error("[clearOldGames] Error:", err);
    });
}

/**
 * Snapshot-Listener for gameRef, react to winner-Updates.
 */
function setupWinnerListener() {
  if (setupWinnerListener._registered) return;
  setupWinnerListener._registered = true;

  gameRef.onSnapshot({ includeMetadataChanges: true }, (docSnapshot) => {
    if (!docSnapshot.exists) return;
    if (docSnapshot.metadata.hasPendingWrites) return;

    const data = docSnapshot.data();
    if (data.winner) {
      console.log('data.winner: ',data.winner);
      
      const { part, length, winnerName } = data.winner;
      // if(isActiveUI) swapParts();
      createWinPopup(part, length, winnerName);
      gameRef.update({ winner: null }).catch(console.error);
    }

    // --- 2) Continue-Action ---
    if (data.action === "continue") {
      console.log('data.action "continue": ', data.action);
      const ov = document.getElementById("winOverlay");
      if (ov) ov.remove();
      continueOnline();
     
      gameRef
        .update({ action: firebase.firestore.FieldValue.delete() })
        .catch(console.error);
    }

    // --- 3) Restart-Action ---
    if (data.action === "restart") {
      const ov = document.getElementById("winOverlay");
      if (ov) ov.remove();
      gameRef
        .update({ action: firebase.firestore.FieldValue.delete() })
        .catch(console.error);
    }
  });
}

function addDataToFirestore() {
  let timeStamp = Date.now();
  const jsonData = {
    playerCards: mapPlayerCards(),
    observerCards: mapObsCards(),
    playerAccords: mapPlayAccs(),
    observerAccords: mapObsAccs(),
    allTones: mapAllTones(),
    allMaj: mapAllMaj(),
    playerName1,
    playerName2,
    isActiveUI,
    cardStyles: {
      styles: currentCardStyles, // e.g all opacitys
    },
    isFinishRound: false, // to game start def false
    goalValue: goalValue,
    isWinner: false,
    stepBack: false, // initial/default
    timeStamp,
  };
  const goalInput = document.getElementById("goalInputID");
  if (goalInput) goalInput.value = goalValue;
  db.collection("on-table")
    .add(jsonData)
    .then((docRef) => {
      gameID = docRef.id;
      gameRef = db.collection("on-table").doc(gameID);
      setupSnapshotListener();
      setupWinnerListener();
      clearOldGames();
    })
    .catch((error) => {
      console.error("error adding game:", error);
    });
}

//  ask the other client to perform stepBack
function requestStepBack() {
  if (!gameRef) return;
  isLocalUpdate = true;
  // set the flag on the server
  gameRef
    .set({ stepBack: true }, { merge: true })
    .catch((err) => console.error("Firestore-Error:", err));
}

// include MetadataChanges, metadata.hasPendingWrites
function setupSnapshotListener() {
  if (!gameRef) {
    console.error("gameRef not set");
    return;
  }

  gameRef.onSnapshot(
    { includeMetadataChanges: true },
    (docSnapshot) => {
      // exit if no document
      if (!docSnapshot.exists) return;
      // ignore our own pending writes
      if (docSnapshot.metadata.hasPendingWrites) return;
      // ignore writes we triggered ourselves
      if (isLocalUpdate) {
        isLocalUpdate = false;
        return;
      }
      // now safe to read remote data
      const gameData = docSnapshot.data();
      // apply the rest of the game state
      downloadGameData(gameData);
      // if the other client requested stepBack, run it
      if (gameData.stepBack) {
        if (typeof window.stepBack === "function") {
          window.stepBack();
        }
        // reset the flag so next request fires again
        isLocalUpdate = true;
        gameRef
          .set({ stepBack: false }, { merge: true })
          .catch((err) => console.error("Firestore-Error:", err));
      }

      if (gameData.isFinishRound) {
        // Swap names both in DOM and variables
        swapNamesInDOM();
        [playerName1, playerName2] = [playerName2, playerName1];

        // Toggle UI roles for new round
        isActiveUI = !isActiveUI;
        toggleUI();

        // Start the next round
        startRound(true);

        // Reset finishRound flag for next use
        isLocalUpdate = true;
        gameRef
          .set({ isFinishRound: false }, { merge: true })
          .catch((err) => console.error("Firestore-Error:", err));

        return; // skip final renderUI, as toggleUI and startRound handle UI
      }
    },
    (error) => console.error("Snapshot error:", error)
  );
}

// Set game-var with gameData
function initializeGameWithData(gameData) {
  playerCards = gameData.playerCards;
  observerCards = gameData.observerCards;
  playerAccords = gameData.playerAccords;
  observerAccords = gameData.observerAccords;
  allTones = gameData.allTones;
  allMaj = gameData.allMaj;
  playerName1 = gameData?.playerName1;
  playerName2 = gameData?.playerName2;
  isFinishRound = gameData.isFinishRound;
  goalValue = gameData.goalValue;
  isWinner = gameData.isWinner;
  goalValue = goalValue;
  setTimeout(() => renderNames(gameData), 50);
}

function downloadGameData(gameData) {
  playerCards = gameData.playerCards || [];
  observerCards = gameData.observerCards || [];
  playerAccords = gameData.playerAccords || [];
  observerAccords = gameData.observerAccords || [];
  allTones = gameData.allTones || [];
  allMaj = gameData.allMaj || [];
  playerName1 = gameData.playerName1 || [];
  playerName2 = gameData.playerName2 || [];
  renderStack("playerCard", "playerStackID");
  renderStack("observerCard", "observerStackID");
  renderCircles();
  isFinishRound = gameData.isFinishRound;
  goalValue = gameData.goalValue;
  updateGoal(goalValue);
  isWinner = gameData.isWinner;
  if (gameData.cardStyles && Array.isArray(gameData.cardStyles.styles)) {
    // local Styles-Array synchronise
    currentCardStyles = gameData.cardStyles.styles.slice();

    for (const { stackNr, opacity } of currentCardStyles) {
      const pl = document.getElementById(`playerCard${stackNr}`);
      if (pl) pl.style.opacity = opacity;
    }
  }
  if (isFinishRound) {
    if (typeof gameData.isActiveUI === "boolean") {
      isActiveUI = gameData.isActiveUI;
    }
    toggleUI();
    isFinishRound = false;
    currentCardStyles = [];
    stackOpacity1(playerCards, "playerCard");
  }
}

function mapPlayerCards() {
  return playerCards.map((c) => ({
    nr: c.nr,
    stackNr: c.stackNr,
    title: c.title,
    amount: c.amount,
    src: c.src,
  }));
}

function mapObsCards() {
  return observerCards.map((c) => ({
    nr: c.nr,
    stackNr: c.stackNr,
    title: c.title,
    amount: c.amount,
    src: c.src,
  }));
}

function mapPlayAccs() {
  return playerAccords.map((a) => ({
    nr: a.nr,
    circleNr: a.circleNr,
    title: a.title,
    amount: a.amount,
    src: a.src,
  }));
}

function mapObsAccs() {
  return observerAccords.map((a) => ({
    nr: a.nr,
    circleNr: a.circleNr,
    title: a.title,
    amount: a.amount,
    src: a.src,
  }));
}

function mapAllTones() {
  return allTones.map((t) => ({
    nr: t.nr,
    title: t.title,
    amount: t.amount,
    src: t.src,
  }));
}

function mapAllMaj() {
  return allMaj.map((m) => ({
    nr: m.nr,
    circleNr: m.circleNr,
    title: m.title,
    amount: m.amount,
    src: m.src,
  }));
}
//finishFlag = default false ?
function uploadGameData(finishFlag) {
  if (!gameRef) return;
  isLocalUpdate = true;
  const jsonData = {
    isFinishRound: finishFlag,
    playerCards: mapPlayerCards(),
    observerCards: mapObsCards(),
    playerAccords: mapPlayAccs(),
    observerAccords: mapObsAccs(),
    allTones: mapAllTones(),
    allMaj: mapAllMaj(),
    playerName1: playerName1,
    playerName2: playerName2,
    isActiveUI: isActiveUI,
    cardStyles: {
      styles: currentCardStyles,
    },
    isFinishRound: finishFlag || false,
    goalValue: goalValue,
  };

  gameRef
    .set(jsonData, { merge: true })
    .catch((err) => console.error("Firestore-Error:", err));
}

//get referenz of gameID
function joinGame(invitationID) {
  gameID = invitationID;
  gameRef = db.collection("on-table").doc(gameID);

  gameRef
    .get()
    .then((doc) => {
      if (!doc.exists) throw new Error("Spiel nicht gefunden!");

      const gameData = doc.data();
      initializeGameWithData(gameData);
      setupSnapshotListener();
      setupWinnerListener();
      isActiveUI = false;
      toggleUI();
    })
    .catch((error) => {
      console.error("Fehler beim Beitreten zum Spiel:", error);
    });
}

function swapNamesInDOM() {
  const obsEl = document.getElementById("obsNameID");
  const playEl = document.getElementById("playNameID");
  [obsEl.innerHTML, playEl.innerHTML] = [playEl.innerHTML, obsEl.innerHTML];
}

function initializeContinueButton() {
  const continueBtn = document.getElementById("continueBtn");
  if (continueBtn) {
    continueBtn.addEventListener("click", () => {
      finishRound();
    });
  } else {
    console.warn("Continue button (#continueBtn) not found");
  }
}

function initializeGameHandlers() {
  setupSnapshotListener();
  initializeContinueButton();
}

//to check datas on fb
function fetchGameData(gameID) {
  var db = firebase.firestore();
  var gameRef = db.collection("on-table").doc(gameID);

  gameRef
    .get()
    .then(function (doc) {
      if (doc.exists) {
        console.log("Spieldaten:", doc.data());
        initializeGameWithData(doc.data());
      } else {
        console.log("Kein Spiel mit dieser ID gefunden!");
      }
    })
    .catch(function (error) {
      console.error("Fehler beim Abrufen der Spieldaten:", error);
    });
}
