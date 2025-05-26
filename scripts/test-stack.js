/***************************** TEST STACK  ******************************/

//called in buildStack()
function testStack() {
  playerCards = [
    {
      nr: 1,
      stackNr: -1,
      title: "C",
      amount: 3,
      src: "assets/images/tones/toneC.png",
    },
    // {
    //   nr: 5,
    //   stackNr: -1,
    //   title: "E",
    //   amount: 3,
    //   src: "assets/images/tones/toneE.png",
    // },
    //{ nr: 8, stackNr: -1, title: 'G', amount: 3, src: 'assets/images/tones/toneG.png' },
    {
      nr: 0,
      stackNr: -1,
      title: "gnom",
      amount: 1,
      src: "assets/images/specials/joker.jpg",
    },
    //{ nr: 0, stackNr: -1, title: 'gnom', amount: 1, src: 'assets/images/specials/joker.jpg' },
    //{ nr: 0, stackNr: -1, title: 'gnom', amount: 1, src: 'assets/images/specials/joker.jpg' },
    //{ nr: 13, stackNr: -1, title: 'mellot', amount: 1, inUse: false, src: 'assets/images/specials/mellot.jpg' },
    //{ nr: 5, stackNr: -1, title: 'E', amount: 3, src: 'assets/images/tones/toneE.png' },
    {
      nr: 13,
      stackNr: -1,
      title: "mellot",
      amount: 1,
      inUse: false,
      src: "assets/images/specials/mellot.jpg",
    },
    {
      nr: 14,
      stackNr: -1,
      title: "goblin",
      amount: 1,
      inUse: false,
      src: "assets/images/specials/goblin.jpg",
    },
    // { nr: 14, stackNr: -1, title: 'goblin', amount: 1, inUse: false, src: 'assets/images/specials/goblin.jpg' },
    { nr: 15, stackNr: -1, title: 'wizzard', amount: 1, inUse: false, src: 'assets/images/specials/wizzard.jpg' }
  ];
  console.log("testCards activated");
  playerAccords = [
    {
      nr: 1,
      circleNr: 1,
      title: "C",
      amount: 1,
      src: "assets/images/accords/accC.jpg",
    },
    //{ nr: 2, circleNr: 8, title: 'Db', amount: 2, src: 'assets/images/accords/accDb.jpg' },
    //{ nr: 3, circleNr: 3, title: 'D', amount: 2, src: 'assets/images/accords/accD.jpg' },
    //{ nr: 4, circleNr: 10, title: 'Eb', amount: 2, src: 'assets/images/accords/accEb.jpg' },
    //{ nr: 5, circleNr: 5, title: 'E', amount: 2, src: 'assets/images/accords/accE.jpg' },
    {
      nr: 6,
      circleNr: 12,
      title: "F",
      amount: 1,
      src: "assets/images/accords/accF.jpg",
    },
    {
      nr: 7,
      circleNr: 7,
      title: "Gb",
      amount: 1,
      src: "assets/images/accords/accGb.jpg",
    },
    //{ nr: 8, circleNr: 2, title: 'G', amount: 1, src: 'assets/images/accords/accG.jpg' },
    //{ nr: 9, circleNr: 9, title: 'Ab', amount: 2, src: 'assets/images/accords/accAb.jpg' },
    //{ nr: 10, circleNr: 4, title: 'A', amount: 2, src: 'assets/images/accords/accA.jpg' },
    //{ nr: 11, circleNr: 11, title: 'Bb', amount: 2, src: 'assets/images/accords/accBb.jpg' },
    //{ nr: 12, circleNr: 6, title: 'B', amount: 2, src: 'assets/images/accords/accB.jpg' },
  ];

  observerAccords = [
    {
      nr: 11,
      circleNr: 11,
      title: "Bb",
      amount: 2,
      src: "assets/images/accords/accBb.jpg",
    },
  ];
}
