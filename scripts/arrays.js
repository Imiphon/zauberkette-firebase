
let vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty("--vh", `${vh}px`); //Kay -- What exactly do that?

let goalValue;

let playerCards = [];//all cards in current Array of observer card-stack
let observerCards = [];//all cards in current Array of player card-stack
let playerAccords = [
  { nr: 2, circleNr: 8, title: 'Db', amount: 1, src: 'images/accords/accDb.jpg' },
  { nr: 3, circleNr: 3, title: 'D', amount: 0, src: 'images/accords/accD.jpg' },
  { nr: 4, circleNr: 10, title: 'Eb', amount: 1, src: 'images/accords/accEb.jpg' },
  { nr: 7, circleNr: 7, title: 'Gb', amount: 1, src: 'images/accords/accGb.jpg' },
  { nr: 9, circleNr: 9, title: 'Ab', amount: 1, src: 'images/accords/accAb.jpg' },
  { nr: 12, circleNr: 6, title: 'B', amount: 2, src: 'images/accords/accB.jpg' },
];//all Accords in current Array of player Accords
let observerAccords = [
  { nr: 7, circleNr: 7, title: 'Gb', amount: 1, src: 'images/accords/accGb.jpg' },
  { nr: 2, circleNr: 8, title: 'Db', amount: 1, src: 'images/accords/accDb.jpg' },
  { nr: 9, circleNr: 9, title: 'Ab', amount: 1, src: 'images/accords/accAb.jpg' },
];//all Accords in current Array of observer Accords
let clickedCardID = -1; // Variable, um den Index der ausgewählten Karte zu speichern
let clickAccount = 0; // counts clicks in setCardCombi()
let cardCombi = []; //sammelt 3 tones oder joker
let choosenCards = []; // 3 numbers for checkRightCombi()
let accOffer = []; // acc offer for user open in popup
let mellotArray = []; //to change card with opponent
let currentSpecial = null;
let specialInProgress = false; //if btn for special is clicked in process before end
let usedSpecials = []; //coming from separateSpecial()
let choosenAcc = []; //taken from observerAccords to put it into playerAccords and reversed
let tryGoblinStrike = false; //if player clicks goblin btn 
let tryWizzardStrike = false;//if player clicks wizzard btn 
let wizzardTakes = []; // is storing all neighbors in observer circle(higher OR lower) of choosenAcc, or only single Accords
let wizzardGives = []; //     -"-   in player circle     -"-
let flatNeighbour = []; //neighbor of choosenAcc (for observer (or also player in wizzardGives)
let sharpNeighbour = [];//    -"-
let playerChains = []; //Array of accord chains after every round
let observerChains = [];//    -"-
let flatPlayerConnection = []; //card neighbors in player card stack
let sharpPlayerConnection = [];//    -"-
let isChainCheck = false;

let allTones = [
  { nr: 0, stackNr: -1, title: 'gnom', amount: 3, src: 'images/joker/joker.jpg' },
  { nr: 1, stackNr: -1, title: 'C', amount: 3, src: 'images/tones/toneC.png' },
  { nr: 2, stackNr: -1, title: 'Db', amount: 3, src: 'images/tones/toneDb.png' },
  { nr: 3, stackNr: -1, title: 'D', amount: 3, src: 'images/tones/toneD.png' },
  { nr: 4, stackNr: -1, title: 'Eb', amount: 3, src: 'images/tones/toneEb.png' },
  { nr: 5, stackNr: -1, title: 'E', amount: 3, src: 'images/tones/toneE.png' },
  { nr: 6, stackNr: -1, title: 'F', amount: 3, src: 'images/tones/toneF.png' },
  { nr: 7, stackNr: -1, title: 'Gb', amount: 3, src: 'images/tones/toneGb.png' },
  { nr: 8, stackNr: -1, title: 'G', amount: 3, src: 'images/tones/toneG.png' },
  { nr: 9, stackNr: -1, title: 'Ab', amount: 3, src: 'images/tones/toneAb.png' },
  { nr: 10, stackNr: -1, title: 'A', amount: 3, src: 'images/tones/toneA.png' },
  { nr: 11, stackNr: -1, title: 'Bb', amount: 3, src: 'images/tones/toneBb.png' },
  { nr: 12, stackNr: -1, title: 'B', amount: 3, src: 'images/tones/toneB.png' },
  { nr: 13, stackNr: -1, title: 'mellot', amount: 2, inUse: false, src: 'images/specials/mellot.jpg' },
  { nr: 14, stackNr: -1, title: 'goblin', amount: 2, inUse: false, src: 'images/specials/goblin.jpg' },
  { nr: 15, stackNr: -1, title: 'wizzard', amount: 1, inUse: false, src: 'images/specials/wizzard.jpg' }
];

let allMaj = [
  { nr: 1, circleNr: 1, title: 'C', amount: 1, src: 'images/accords/accC.jpg' },
  { nr: 2, circleNr: 8, title: 'Db', amount: 0, src: 'images/accords/accDb.jpg' },
  { nr: 3, circleNr: 3, title: 'D', amount: 0, src: 'images/accords/accD.jpg' },
  { nr: 4, circleNr: 10, title: 'Eb', amount: 1, src: 'images/accords/accEb.jpg' },
  { nr: 5, circleNr: 5, title: 'E', amount: 2, src: 'images/accords/accE.jpg' },
  { nr: 6, circleNr: 12, title: 'F', amount: 0, src: 'images/accords/accF.jpg' },
  { nr: 7, circleNr: 7, title: 'Gb', amount: 1, src: 'images/accords/accGb.jpg' },
  { nr: 8, circleNr: 2, title: 'G', amount: 0, src: 'images/accords/accG.jpg' },
  { nr: 9, circleNr: 9, title: 'Ab', amount: 0, src: 'images/accords/accAb.jpg' },
  { nr: 10, circleNr: 4, title: 'A', amount: 2, src: 'images/accords/accA.jpg' },
  { nr: 11, circleNr: 11, title: 'Bb', amount: 2, src: 'images/accords/accBb.jpg' },
  { nr: 12, circleNr: 6, title: 'B', amount: 2, src: 'images/accords/accB.jpg' },
];


