function renderHeaderHTML() {
    return /*html*/` 
  <nav>
    <div class="nav-left">
        <img class="logo" src="assets/images/logo-wheat.png" alt="">
    </div>
    <div class="nav-center">
        <h3>Zauberkette</h3>

    </div>
    <div class="nav-right">
        <div class="nav-btns">
            <div class="game-goal" id="gameGoalID">
                <span data-key="chainLength">${staticTexts.chainLength[language]}:</span>
                <div class="num-picker" id="numberPicker">
                    <button type="button" id="decreaseBtn" onclick="decreaseValue()">-</button>
                    <span id="currentValue">5</span>
                    <button type="button" id="increaseBtn" onclick="increaseValue()">+</button>
                </div>
            </div>
            ${!isLandingpage ? `
            <button class="nav-btn" onclick="changeView()">
                <img class="turn" src="assets/images/btn/turn.png" alt="" ${mirrorView ? 'style="display:none;"' : ''}>
                <img class="turn-back" src="assets/images/btn/turn-back.png" alt="" ${!mirrorView ? 'style="display:none;"' : ''}>
            </button>
            <button class="nav-btn" onclick="changeMute()">
                <img class="volume_up" src="assets/images/btn/volume_up.png" alt="" ${isMuted ? 'style="display:none;"' : ''}>
                <img class="volume_off" src="assets/images/btn/volume_off.png" alt="" ${!isMuted ? 'style="display:none;"' : ''}>
            </button>
            <button class="nav-btn" id="fullscreenBtn" onclick="toggleFullscreen()">
                <img class="fullscreen-enter" src="assets/images/btn/fullscreen-enter-32.png" alt="Enter Fullscreen" ${fullscreen ? 'style="display:none;"' : ''}>
                <img class="fullscreen-exit" src="assets/images/btn/fullscreen-exit-32.png" alt="Exit Fullscreen" ${!fullscreen ? 'style="display:none;"' : ''}>
            </button>
            <button class="nav-btn" onclick="skipToStart()">
                <img class="volume_up" src="assets/images/btn/skip-to-start-32.png" alt="new start">
            </button>
            ` : ''}
            <button class="nav-btn" onclick="toggleLang()">
                <img class="lang" id="langImg" src="assets/images/btn/${language}.svg" alt="toggle language">
            </button>
            <div class="menu-frame">

            <button class="nav-btn" onclick="openMenu()" id="menuButton" aria-haspopup="true" aria-expanded="false">
                <img class="lang" src="assets/images/btn/burger-black-50kb.png" alt="">
            </button>

            <div class="menu" id="menuContainer" aria-hidden="true">
                <a href="#" class="menu-item" onclick="handleMenuItemClick(event, 'mirror-view')" data-key="mirrorView">${staticTexts.mirrorView[language]}</a>
                <a href="index.html" class="menu-item">Home</a>
                <a href="javascript:void(0);" class="menu-item" onclick="openRulesPopup()" data-key="gameRules">${staticTexts.gameRules[language]}</a>
                <a href="#" class="menu-item">More</a>              
            </div>
            </div>
        </div>
    </div>
</nav>
`;
}

function openRulesPopup() {
    let popup = createPopup();
    document.body.appendChild(popup);
    document.body.style.overflow = 'hidden';
    closeMenu();
}

function createPopup() {
    let popup = document.createElement('div');
    popup.className = 'popup-rules';
    popup.innerHTML = gameRules();
    popup.id = 'popupRules';
    let closeButton = createCloseButton(popup);
    popup.appendChild(closeButton);
    return popup;
}

function createCloseButton(popup) {
    let closeButton = document.createElement('img');
    closeButton.src = 'assets/images/btn/close-black-white.png';
    closeButton.alt = 'Schließen';
    closeButton.className = 'popup-close';

    closeButton.addEventListener('click', function () {
        closePopupRules(popup);
    });
    return closeButton;
}

function closePopupRules() {
    let popup = document.getElementById('popupRules');
    popup.remove();
    document.body.style.overflow = 'auto';
}

function skipToStart() {
    //window.location.reload();
    const isSkip = true;
    setupGame(isSkip); 
    playSound('success', 'clave', 0.2);
}

/**
 * to set the goal (length of winner chain)
 */
function decreaseValue() {
    let value = parseInt(document.getElementById('currentValue').textContent, 10);
    if (value > 2) {
        value--;
        document.getElementById('currentValue').textContent = value;
        updateGoal(value);
    }
}

function increaseValue() {
    let value = parseInt(document.getElementById('currentValue').textContent, 10);
    if (value < 12) {
        value++;
        document.getElementById('currentValue').textContent = value;
        updateGoal(value);
    }
}

function updateGoal(value) {
    goalValue = value;
    console.log('Goal value updated to:', goalValue);
}

function changeView() {
    mirrorView = !mirrorView;
    let navigation = document.getElementById('headInfoID');
    const turnBtn = document.querySelector('.turn');
    const turnBackBtn = document.querySelector('.turn-back');
    const navRight = document.querySelector('.nav-right');
    if (mirrorView) {
        document.body.classList.add('mirror-view'); //important for body.mirror-view .table-top
        navigation.classList.add('sideInfo');
        turnBackBtn.style.display = 'block';
        turnBtn.style.display = 'none';
        if (!fullscreen) {
            document.querySelector('nav').style.width = `${availableHeight}px`;
            navRight.style.marginRight = '60px'
        } else {
            document.querySelector('nav').style.width = `100%`;
        }
    }
    if (!mirrorView) {
        document.body.classList.remove('mirror-view'); 
        navigation.classList.remove('sideInfo');
        turnBtn.style.display = 'block';
        turnBackBtn.style.display = 'none';
        navRight.style.marginRight = '0px'
        document.querySelector('nav').style.width = '100%';
    }
    toggleRotation();
    switchTableStyle();
}

function toggleRotation() {
    const container = document.getElementById('observerPartID');
    if (isRotated) {
        container.classList.remove('rotated-180');
    } else {
        container.classList.add('rotated-180');
    }
    isRotated = !isRotated;
}

function switchTableStyle() {
    if (mirrorView) {
        let table = document.querySelector('.table-frame'); //with dot cause it's a selector
        table.classList.remove('table-frame'); //only class-name without dot
        table.classList.add('table-mirror-frame');
    } else {
        let table = document.querySelector('.table-mirror-frame');
        table.classList.remove('table-mirror-frame');
        table.classList.add('table-frame');
    }
}

function rotateWebsite() {
    let table = document.getElementsByClassName('table-mirror-frame')[0];
    let currentRotation = table.style.transform;
    if (currentRotation === "rotate(180deg)") {
        table.style.transform = "rotate(0deg)";
    } else {
        table.style.transform = "rotate(180deg)";
    }
    table.style.transformOrigin = "center";
}

// Function to handle menu opening and closing
function openMenu() {
    const menu = document.getElementById('menuContainer');
    const menuButton = document.getElementById('menuButton');
    const isMenuOpen = menu.classList.contains('show');

    if (isMenuOpen) {
        closeMenu();
    } else {
        menu.classList.add('show');
        menuButton.setAttribute('aria-expanded', 'true');
        menu.setAttribute('aria-hidden', 'false');
        // Add event listener to detect clicks outside the menu
        document.addEventListener('click', handleClickOutside);
    }
}

// Function to close the menu
function closeMenu() {
    const menu = document.getElementById('menuContainer');
    const menuButton = document.getElementById('menuButton');

    menu.classList.remove('show');
    menuButton.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-hidden', 'true');

    document.removeEventListener('click', handleClickOutside);
}

// Function to handle clicks outside the menu
function handleClickOutside(event) {
    const menu = document.getElementById('menuContainer');
    const menuButton = document.getElementById('menuButton');

    // If the click is not inside the menu or the button, close the menu
    if (!menu.contains(event.target) && !menuButton.contains(event.target)) {
        closeMenu();
    }
}

// Function to handle menu item clicks
function handleMenuItemClick(event, view) {
    // Perform any action based on the menu item clicked e.g. changeView
    changeView(view);
    closeMenu();
}

// Initial rendering of the header 
document.addEventListener('DOMContentLoaded', () => {
    const headerContainer = document.getElementById('headerContainer');
    if (headerContainer) {
        headerContainer.innerHTML = renderHeaderHTML();
    }
});