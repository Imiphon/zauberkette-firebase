/* --------------- INDEX.HTML  ------------------------*/

function startInvitation(invitationID) {
  
  handleStartClick(startOneTable);
  joinGame(invitationID);
}

function setNames() {
  const invitationInput = document.getElementById("invitationInput");
  const invitationID = invitationInput ? invitationInput.value.trim() : null;
  if (invitationID) {
    
    startInvitation(invitationID);    
  } else {
    
    const popupOverlay = document.createElement("div");
    popupOverlay.id = "popupOverlay";
    popupOverlay.classList.add("popup-overlay");
    document.body.appendChild(popupOverlay);
    const header = nameInputHeader[language];
    popupOverlay.innerHTML = /*html*/ `  
      <div id="popupWindow" class="popup-window">
        <h2 data-key="nameInputHeader">${header}</h2>
        <input type="text" class="popup-input" id="player1Input" placeholder="Remi">
        <input type="text" class="popup-input" id="player2Input" placeholder="Lasi">
        <div class="start-btn-frame">
        <div class="btn-descr">     
         <button class="start-btn" id="popupStartBtn">
              <img src="assets/images/btn/one-display.png" alt="">            
            </button>
            <button class="start-btn" id="popupStartBtn2">
              <img src="assets/images/btn/two-display.png" alt="">            
            </button>
          </div>
            <div class="btn-descr"><span>1 client</span><span>2 clients</span></div>
          </div>
        </div>
    `;
    popupOverlay.addEventListener("click", function (event) {
      if (event.target === popupOverlay) {
        popupOverlay.parentNode.removeChild(popupOverlay);
      }
    });
    renderStartBtns();    
  }
}

/*------------- POPUP and INSERT NAMES IN INDEX ------------------*/

function handleStartClick(renderFunction) {
  // read inputs
  const input1 = document.getElementById("player1Input");
  const input2 = document.getElementById("player2Input");
  playerName1 = input1 ? input1.value.trim() : "Player1";
  playerName2 = input2 ? input2.value.trim() : "Player2";
  localStorage.setItem("player1Name", playerName1);
  localStorage.setItem("player2Name", playerName2);

  localStorage.removeItem("playerRole");
  localStorage.setItem("playerRole", "player1");
  

  const popupOverlay = document.getElementById("popupOverlay");
  if (popupOverlay) popupOverlay.remove();

  renderFunction(); // startOneTable() or startTwoTables()
  playSound("success", "clave", 0.2);
}

function renderStartBtns() {
  
  
  const startBtn = document.getElementById("popupStartBtn");
  const startBtn2 = document.getElementById("popupStartBtn2");
  if (startBtn) {
    startBtn.addEventListener("click", () => handleStartClick(startOneTable));
  }
  if (startBtn2) {
    startBtn2.addEventListener("click", () => handleStartClick(startTwoTables));
  }
}

function openCardPopup() {
  //Kay -- create Pop-Up Element
  let popup = document.createElement("div");
  popup.className = "popup";
  popup.style.display = "flex";
  document.body.appendChild(popup);
}

function closePopup() {
  //Kay -- remove Element
  let popup = document.querySelector(".popup");
  if (popup) {
    popup.remove();
    body.style.overflow = "hidden";
  }
}

function chainHelper() {
  //handle the cheat sheet for the accords. Z-Index higher!
  let chainHelper = document.querySelector(".chain-helper");
  chainHelper.addEventListener("click", function (event) {
    // that document click-Handler doesn't start
    event.stopPropagation();
    this.classList.toggle("expanded");
  });
  // a click anywhere to remove listener
  document.addEventListener("click", function () {
    chainHelper.classList.remove("expanded");
  });
}

/*------------------------------- POPUP for one or two tables  ------------*/

// called by btn
function startOneTable() {
  renderTable();
  setupGame();
}

function createLink() {
  // Add Event-Listener for "E-Mail senden"-Button
  const sendEmailBtn = document.getElementById("sendEmailBtn");
  sendEmailBtn.addEventListener("click", () => {
    const emailField = document.getElementById("emailInputField");
    const email = emailField.value.trim();

    if (validateEmail(email)) {
      // Send linkID with mail
      sendEmail(email);
    } else {
      alert("Bitte gib eine gültige E-Mail-Adresse ein.");
    }
  });

  // copy linkID
  const copyLinkBtn = document.getElementById("copyLinkBtn");
  copyLinkBtn.addEventListener("click", () => {
    copyLink();
  });
}

function startTwoTables() {
  renderTable();
  setupGame();
  addDataToFirestore();

  const popupOverlay = document.createElement("div");
  popupOverlay.id = "popupOverlay";
  popupOverlay.classList.add("popup-overlay");
  document.body.appendChild(popupOverlay);
  const text = emailInput[language];

  popupOverlay.innerHTML = /*html*/ `  
      <div id="popupWindow" class="popup-window">
        <h2 data-key="emailInput">${text}</h2>
        <input type="email" class="popup-input" id="emailInputField" placeholder="eMail">
        <div class="start-btn-frame">
          <button class="start-btn" id="sendEmailBtn"><img src="assets/images/btn/email-5-32.png" alt="email"></button>
          <button class="start-btn" id="copyLinkBtn"><img src="assets/images/btn/copy-48.png" alt="copy"></button>
        </div>
      </div>
    `;
  createLink();
  toggleUI();
}

// validate email adress
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.toLowerCase());
}

function sendEmail(email) {
  if (!gameRef) {
    console.error("gameRef ist nicht gesetzt.");
    alert("Das Spiel ist noch nicht initialisiert.");
    return;
  }

  const subject = encodeURIComponent(
    "Hier die gameID zu meinem aktuellen Spiel"
  );
  const body = encodeURIComponent(
    `Hallo,\n\nHier ist der Link zu meinem aktuellen Spiel: ${gameID}\n\nViel Spaß!`
  );
  const mailtoLink = `mailto:${email}?subject=${subject}&body=${body}`;
  // open Standard-E-Mail-Program
  window.location.href = mailtoLink;
  const popupOverlay = document.getElementById("popupOverlay");
  if (popupOverlay) {
    popupOverlay.parentNode.removeChild(popupOverlay);
  }
}

// copy game link for 2nd player
function copyLink() {
  if (!gameRef) {
    console.error("gameRef ist nicht gesetzt.");
    alert("Das Spiel ist noch nicht initialisiert.");
    return;
  }

  // use Clipboard API to copy link
  navigator.clipboard
    .writeText(gameID)
    .then(() => {
      alert("Der Spiel-Link wurde in die Zwischenablage kopiert!");
      // remove Popup-Overlay
      const popupOverlay = document.getElementById("popupOverlay");
      if (popupOverlay) {
        popupOverlay.parentNode.removeChild(popupOverlay);
      }
    })
    .catch((err) => {
      console.error("Fehler beim Kopieren des Links:", err);
      alert("Es gab ein Problem beim Kopieren des Links.");
    });
}

function closeEvent() {
  // close Popup element by click on the site
  document.addEventListener("DOMContentLoaded", function () {
    let popup = document.querySelector(".popup");
    if (popup) {
      popup.addEventListener("click", function () {
        popup.style.display = "none";
      });
    }
  });
}

function detectTouchDevice() {
  if ("ontouchstart" in window || navigator.maxTouchPoints) {
    // It is a touch device
    document.querySelectorAll(".hover-effect").forEach(function (element) {
      let hasHover = false;
      element.addEventListener("click", function (event) {
        if (!hasHover) {
          event.preventDefault();
          element.classList.add("hover");
          hasHover = true;
          setTimeout(function () {
            hasHover = false;
          }, 300); // Adjust the timeout as needed
        } else {
          element.classList.remove("hover");
          hasHover = false;
          // Trigger the original click event
          let originalClickEvent = new Event("click", {
            bubbles: true,
            cancelable: true,
          });
          element.dispatchEvent(originalClickEvent);
        }
      });
    });
  }
}
