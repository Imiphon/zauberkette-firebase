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

const db = firebase.firestore();
let gameRef = null;
let gameID = null;
// let isGameID = gameID === null ? false : true;
let isLocalUpdate = false;

/**
 *
 * @param {boolean} isPlayer1 in first time
 */
function addDataToFirestore() {
  const jsonData = {
    playerCards: mapPlayerCards(),
    observerCards: mapObsCards(),
    playerAccords: mapPlayAccs(),
    observerAccords: mapObsAccs(),
    allTones: mapAllTones(),
    allMaj: mapAllMaj(),
    playerName1,
    playerName2,
    cardStyles: {
      styles: currentCardStyles, // e.g all opacitys
    },
    isFinishRound: false, // to game start def false
    goalValue: goalValue,
    isWinner: false,
  };
  const goalInput = document.getElementById("goalInputID");
  if (goalInput) goalInput.value = goalValue;

  db.collection("on-table")
    .add(jsonData)
    .then((docRef) => {
      gameID = docRef.id;
      gameRef = db.collection("on-table").doc(gameID);
      setupSnapshotListener();
    })
    .catch((error) => {
      console.error("error adding game:", error);
    });
}

function setupSnapshotListener() {
  if (!gameRef) {
    console.error("gameRef nicht gesetzt.");
    return;
  }

  // include MetadataChanges, metadata.hasPendingWrites
  gameRef.onSnapshot(
    { includeMetadataChanges: true },
    (docSnapshot) => {
      if (!docSnapshot.exists) {
        console.log("Game not found!");
        return;
      }
      // 🔥 ignore local Writes:
      if (docSnapshot.metadata.hasPendingWrites) {
        return;
      }
      if (isLocalUpdate) {
        isLocalUpdate = false;
        return;
      }
      // only remote from other client
      const game = docSnapshot.data();
      downloadGameData(game);
    },
    (error) => {
      console.error("Error with Snapshots:", error);
    }
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
  playerName1 = gameData.playerName1;
  playerName2 = gameData.playerName2;
  isFinishRound = gameData.isFinishRound;
  goalValue = gameData.goalValue;
  isWinner = gameData.isWinner;
  goalValue = goalValue;
  renderNames();
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
    isActiveUI = true;
    toggleUI();
    isFinishRound = false;    
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

function uploadGameData(isFinishRound) {
  if (!gameRef) return;
  isLocalUpdate = true;
  // if (typeof isFinishRound === "boolean") {
  //   jsonData.isFinishRound = isFinishRound;
  // } else isFinishRound = false;
  const jsonData = {
    playerCards: mapPlayerCards(),
    observerCards: mapObsCards(),
    playerAccords: mapPlayAccs(),
    observerAccords: mapObsAccs(),
    allTones: mapAllTones(),
    allMaj: mapAllMaj(),
    playerName1,
    playerName2,
    cardStyles: {
      styles: currentCardStyles,
    },
    isFinishRound: isFinishRound || false,
    
    goalValue: goalValue,
  };
  // if (isFinishRound) {
  //   isActiveUI = true;
  //   toggleUI();
  //   isFinishRound = false;
  // }

  gameRef
    .set(jsonData, { merge: true })
    .catch((err) => console.error("Firestore-Error:", err));
}

//get referenz of gameID
function joinGame(gameId) {
  gameRef = db.collection("on-table").doc(gameId);
  gameRef
    .get()
    .then((doc) => {
      if (!doc.exists) throw new Error("Spiel nicht gefunden!");

      const gameData = doc.data();
      initializeGameWithData(gameData);
      setupSnapshotListener();
      isActiveUI = false;
      toggleUI();
    })
    .catch((error) => {
      console.error("Fehler beim Beitreten zum Spiel:", error);
    });
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
