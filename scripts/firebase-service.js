const firebaseConfig = {
  apiKey: "AIzaSyCV-gXP08IbrQl4LybuWmdLphKHxo1kg_E",
  authDomain: "zauberkette-34794.firebaseapp.com",
  projectId: "zauberkette-34794",
  storageBucket: "zauberkette-34794.appspot.com",
  messagingSenderId: "215710722712",
  appId: "1:215710722712:web:6af29f425305839a8bbeed",
  measurementId: "G-WPEL0B6YQL"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
let gameRef = null;

function addDataToFirestore() {
  const jsonData = {
    playerCards: playerCards,
    observerCards: observerCards,
    playerAccords: playerAccords,
    observerAccords: observerAccords,
    allTones: allTones,
    allMaj: allMaj,
    playerName1: playerName1,
    playerName2: playerName2
  };

  db.collection('on-table').add(jsonData)
    .then((docRef) => {
      console.log('new ID on firestore is:', docRef.id);
      // Set gameRef and ID
      gameRef = db.collection('on-table').doc(docRef.id);
      // set Snapshot-Listener 
      setupSnapshotListener();
    })
    .catch((error) => {
      console.error('error:', error);
    });
}

function setupSnapshotListener() {
  if (!gameRef) {
    console.error('gameRef not set.');
    return;
  }

  gameRef.onSnapshot((docSnapshot) => {
    if (docSnapshot.exists) {
      const game = docSnapshot.data();
      updateObserver(game);
    } else {
      console.log('game not found!');
    }
  }, (error) => {
    console.error('error with Snapshots:', error);
  });
}

function updateArrays() {
  if (!gameRef) {
    console.error('no gameRef exist.');
    return;
  }

  const jsonData = {
    playerCards: playerCards,
    observerCards: observerCards,
    playerAccords: playerAccords,
    observerAccords: observerAccords,
    allTones: allTones,
    allMaj: allMaj,
    playerName1: playerName1,
    playerName2: playerName2
  };

  gameRef.set(jsonData, { merge: true })
    .then(() => {
      console.log('updated array on firestore');
    })
    .catch((error) => {
      console.error('error with udate on Firestore:', error);
    });
}

function updateObserver(currGame) {
  console.log('currGame is: ', currGame);
}