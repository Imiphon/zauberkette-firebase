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
                <span>Gewinnerkette:</span>
                <div class="num-picker"   id="numberPicker">
                    <button type="button" id="decreaseBtn" onclick="decreaseValue()">-</button>
                    <span id="currentValue">5</span>
                    <button type="button" id="increaseBtn" onclick="increaseValue()">+</button>
                </div>
            </div>
            <button class="nav-btn" onclick="changeView()">
                <img class="turn" src="assets/images/btn/turn.png" alt="">
                <img class="turn-back" src="assets/images/btn/turn-back.png" alt="">
            </button>
            <button class="nav-btn" onclick="changeMute()">
                <img class="volume_up" src="assets/images/btn/volume_up.png" alt="">
                <img class="volume_off" src="assets/images/btn/volume_off.png" alt="">
            </button>
            <button class="nav-btn" id="fullscreenBtn" onclick="toggleFullscreen()">
                <img class="fullscreen-enter" src="assets/images/btn/fullscreen-enter-32.png" alt="Enter Fullscreen">
                <img class="fullscreen-exit" src="assets/images/btn/fullscreen-exit-32.png" alt="Exit Fullscreen"
                    style="display: none;">
            </button>
            <button class="nav-btn" onclick="skipToStart()">
                <img class="volume_up" src="assets/images/btn/skip-to-start-32.png" alt="">
            </button>
            <button class="nav-btn" onclick="toggleLang()">
                <img class="lang" id="langImg" src="assets/images/btn/de.svg" alt="">
            </button>
        </div>
        <div class="menuToggle" id="menuToggle" onclick="toggleMenu()">
            <span></span>
            <span></span>
            <span></span>
            <ul id="menu">
                <a href="#">
                    <div onclick="changeView()">mirror-view</div>
                </a>
                <a href="index.html">Home</a><br>
                <a href="javascript:void(0);" onclick="openRulesPopup()">Game Rules</a><br>
                <a href="">More</a>
            </ul>
        </div>
</nav>
`;
}
