/*-------------------- BUTTONS -------------------*/


function btnGroup1() { //Kay -- shows infotext start
  noBtns(); //Kay reset all Button style
  docID("changeClicks(1)").style.display = "inline";//change card --Kay-- docID!
  docID("changeClicks(2)").style.display = "inline";//nothing to change
  currentInfoFunction = infoStart;
  showInfo(currentInfoFunction); //Kay --render text of starting round
}

function btnGroup2() { // Kay --shows infotext after card change
  noBtns(); //Kay reset all Button style
  docID("changeClicks(3)").style.display = "inline"; // check Combi
  docID("changeClicks(7)").style.display = "inline"; //next Round
  currentInfoFunction = infoPlayCards;
  showInfo(currentInfoFunction); //Kay --render
  specialBtn(); //Kay render button if special card is in deck ( Mellot, Goblin, Wizzard)
}

function btnGroup3() {
  noBtns();
  document.getElementById("changeClicks(8)").style.display = "inline"; //step back
  document.getElementById("changeClicks(7)").style.display = "inline"; //next Round
}

/**
 * Shows special btn if 
 */
function specialBtn() { // Kay -- check if special Card in deck
  for (let i = 0; i < playerCards.length; i++) {
    let currentCard = docID(`playerCard${i}`);
    let title = playerCards[i]['title'];
    if (currentCard.style.opacity != 0.5) { //Kay - use docID 
      if (title === 'mellot') { //Kay -- maybe &&-short Version
        docID("changeClicks(4)").style.display = "block"; //Mellot
        docID("infoMellot").style.display = "block";
        docID("mellotBrass").style.display = "block";
        setSpecialInfo('infoMellot');
      } else if (title === 'goblin') {
        docID("changeClicks(5)").style.display = "block"; //Goblin
        docID("infoGoblin").style.display = "block";
        docID("goblinBrass").style.display = "block";
        setSpecialInfo('infoGoblin');
      } else if (title === 'wizzard') {
        docID("changeClicks(6)").style.display = "block"; //Wizzard
        docID("infoWizzard").style.display = "block";
        docID("wizzardBrass").style.display = "block";
        setSpecialInfo('infoWizzard');
      }
    }
  }
}

function noBtns() { // Kay -- set btn-group buttons invisible
  let buttons = document.querySelectorAll('.btn-group .btn');
  buttons.forEach(function (button) {
    button.style.display = 'none';
  });
  let brassGears = document.querySelectorAll('.brass-gear1');
  brassGears.forEach(function (gear) {
    gear.style.display = 'none';
  });
}

/*-------------------- BUTTON FUNCTIONS -------------------*/

function toggleFullscreen() {
  const fullscreenEnterImg = document.querySelector('.fullscreen-enter');
  const fullscreenExitImg = document.querySelector('.fullscreen-exit');

  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
    fullscreenEnterImg.style.display = 'none';
    fullscreenExitImg.style.display = 'block';
    fullscreen = true;
    if (mirrorView) {
      let nav = document.querySelector('nav')
      nav.style.width = `100%`;
      nav.style.left = `0`;
    }
  } else {
    document.exitFullscreen();
    fullscreenEnterImg.style.display = 'block';
    fullscreenExitImg.style.display = 'none';
    fullscreen = false;
  }
}
