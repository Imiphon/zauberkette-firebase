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

  gameRef.onSnapshot(
    (docSnapshot) => {
      if (docSnapshot.exists) {
        const game = docSnapshot.data();
        updateGameWithNewData(game);
      } else {
        console.log("Spiel nicht gefunden!");
      }
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
  //setupGame();
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
}

function uploadGameData() {
  if (!gameRef) return;

  const jsonData = {
    playerCards: playerCards,
    observerCards: observerCards,
    playerAccords: playerAccords,
    observerAccords: observerAccords,
    allTones: allTones,
    allMaj: allMaj,
    playerName1: playerName1,
    playerName2: playerName2,

    cardStyles: {
      styles: currentCardStyles,
    },
  };

  gameRef
    .set(jsonData, { merge: true })
    .then(() => {
      console.log("updated array on firestore");
    })
    .catch((error) => {
      console.error("error with udate on Firestore:", error);
    });
}

function setCardOpacity(stackNr, opacity) {
  if (!gameRef) return;

  const el = document.getElementById(`playerCard${stackNr}`);
  if (el) el.style.opacity = opacity;

  // delete old entry with stackNr
  currentCardStyles = currentCardStyles.filter((s) => s.stackNr !== stackNr);
  currentCardStyles.push({ stackNr, opacity });
  uploadGameData();
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
