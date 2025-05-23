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
let gameLink = null;
let isLocalUpdate = false;

function addDataToFirestore() {
  const jsonData = {
    playerCards: playerCards,
    observerCards: observerCards,
    playerAccords: playerAccords,
    observerAccords: observerAccords,
    allTones: allTones,
    allMaj: allMaj,
    playerName1: playerName1,
    playerName2: playerName2,
  };

  db.collection("on-table")
    .add(jsonData)
    .then((docRef) => {
      gameID = docRef.id;
      gameLink = `${window.location.origin}/${gameID}`;

      console.log("new ID on firestore is:", gameID);
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

  // include MetadataChanges, damit metadata.hasPendingWrites in jedem Snapshot mitgeliefert wird
  gameRef.onSnapshot(
    { includeMetadataChanges: true },
    (docSnapshot) => {
      if (!docSnapshot.exists) {
        console.log("Spiel nicht gefunden!");
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
      updateGameWithNewData(game);
    },
    (error) => {
      console.error("Fehler mit Snapshots:", error);
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
}

function updateGameWithNewData(gameData) {
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
  if (gameData.cardStyles && Array.isArray(gameData.cardStyles.styles)) {
    // local Styles-Array synchronise
    currentCardStyles = gameData.cardStyles.styles.slice();

    for (const { stackNr, opacity } of currentCardStyles) {
      const pl = document.getElementById(`playerCard${stackNr}`);
      if (pl) pl.style.opacity = opacity;
    }
  }
}

function mapPlayerCards() {
  return playerCards.map((c) => ({
    nr: c.nr,
    stackNr: c.stackNr,
    title: c.title,
    amount: c.amount,
    src: c.src,
  }))
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

function mapAllTones(){
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
    }))
}

function uploadGameData() {
  if (!gameRef) return;
  isLocalUpdate = true;
  // const cleanPlayerCards = playerCards.map((c) => ({
  //   nr: c.nr,
  //   stackNr: c.stackNr,
  //   title: c.title,
  //   amount: c.amount,
  //   src: c.src,
  // }));
  // const cleanObserverCards = observerCards.map((c) => ({
  //   nr: c.nr,
  //   stackNr: c.stackNr,
  //   title: c.title,
  //   amount: c.amount,
  //   src: c.src,
  // }));
  // const cleanPlayerAccords = playerAccords.map((a) => ({
  //   nr: a.nr,
  //   circleNr: a.circleNr,
  //   title: a.title,
  //   amount: a.amount,
  //   src: a.src,
  // }));
  const jsonData = {
    playerCards: mapPlayerCards(),//cleanPlayerCards,
    observerCards: mapObsCards(),//cleanObserverCards,
    playerAccords: mapPlayAccs(),//cleanPlayerAccords,
    observerAccords: mapObsAccs(),
    allTones: mapAllTones(),
    allMaj: mapAllMaj(),
    playerName1,
    playerName2,
    cardStyles: {
      styles: currentCardStyles,
    },
  };
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
      if (doc.exists) {
        const gameData = doc.data();
        initializeGameWithData(gameData);
        setupSnapshotListener();
      } else {
        console.error("Spiel nicht gefunden!");
      }
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
