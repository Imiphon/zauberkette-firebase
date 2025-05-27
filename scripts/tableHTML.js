function renderTable() {
    const mainContent = document.getElementById('mainContent');
    if (mainContent) {
      mainContent.innerHTML = /*html*/`
       
        <!-- <header id="headInfoID"></header> -->
        <div class="table-frame">
            <div class="inner-table">

                <!-------------OBSERVER PART-------------------->
                <div class="table-top" id="observerPartID">
                    <div class="accord-zone">
                        <div class="circle-frame">
                            <div class="circle-img hover-effect" id="obsCircle1">
                                <!-------------ACC CIRCLE-------------------->
                            </div>
                        </div>
                        <div class="circle-frame">
                            <div class="circle-img hover-effect" id="obsCircle2">
                                <!-------------ACC CIRCLE-------------------->
                            </div>
                        </div>
                    </div>

                    <div class="top-zone" id="topZoneID">
                        <div class="brass-long btn name-frame">
                            <h5 class="zone-descr" data-key="observer">Beobachter</h5>
                            <h2 class="name" id="obsNameID">Alfa</h2>
                        </div>
                        <div class="card-group" id="observerStackID">
                            <!-- 5 Cards -->
                        </div>
                    </div>
                </div>

                <!-------------BUTTON PART-------------------->
                <div class="table-center" id="secondPartID">

                    <div class="left-center-frame">
                        <div class="info-frame brass-long no-btn">
                            <div class="chain-frame">
                                <div class="brass-gear2 btn" alt="Info"></div>
                                <img src="assets/images/specials/acc-helper.jpg" class="chain-helper"
                                    alt="Chain Helper">
                            </div>
                            <div class="info-text" id="infoTextID"></div>
                            <img class="sand-clock" src="assets/images/specials/sand-clock.png" alt="wait...">
                        </div>
                    </div>

                    <div class="btn-group">
                        <div class="iron-long-cross btn" onclick="awaitChangeCard()" id="changeClicks(1)"
                            style="display: inline;" data-key="swapCard">Kartentausch</div>
                        <div class="iron-long-cross btn" onclick="noChanges()" id="changeClicks(2)"
                            style="display: inline;" data-key="continue">Weiter</div>
                        <div class="iron-long-cross btn" onclick="setCardCombi()" id="changeClicks(3)"
                            style="display: none;" data-key="composeSpell">Zauber komponieren</div>
                        <div class="special-frame">
                            <div class="iron-circle btn special" onclick="useMellot()" id="changeClicks(4)"
                                style="display: none;"><img src="assets/images/btn/mel-stand.png" alt="icon">
                            </div>
                            <div class="helper-frame" id="infoMellot">
                                <div class="brass-gear1 no-btn" id="mellotBrass" alt="Info"> </div>

                            </div>
                        </div>
                        <div class="special-frame">
                            <div class="iron-circle btn special" onclick="useGoblin()" id="changeClicks(5)"
                                style="display: none;"><img src="assets/images/btn/gob-stand.png" alt="icon">
                            </div>
                            <div class="helper-frame" id="infoGoblin">
                                <div class="brass-gear1 no-btn" id="goblinBrass" alt="Info"></div>

                            </div>
                        </div>
                        <div class="special-frame">
                            <div class="iron-circle btn special" onclick="useWizzard()" id="changeClicks(6)"
                                style="display: none;"><img src="assets/images/btn/wiz-stand.png" alt="icon">
                            </div>
                            <div class="helper-frame" id="infoWizzard">
                                <div class="brass-gear1 no-btn" id="wizzardBrass" alt="Info"> </div>

                            </div>
                        </div>
                        <div class="iron-long-cross btn" onclick="stepBack()" id="changeClicks(8)" data-key="back"
                            style="display: none;">
                            Zurück</div>
                        <!--actually nextPlayer() insted of changeCard()-->
                        <div class="iron-long-cross btn" onclick="handleFinishRoundClick()" id="changeClicks(7)"
                            style="display: none;" data-key="endTurn">Runde beenden</div>
                    </div>
                </div>

                <!------------------- PLAYER PART ------------------------>
                <div class="table-bottom" id="currentPlayerPartID">
                    <div class="accord-zone" id="">
                        <div class="circle-frame">
                            <div class="circle-img hover-effect" id="playerCircle1">
                                <!-------------ACC CIRCLE-------------------->
                            </div>
                        </div>
                        <div class="circle-frame">
                            <div class="circle-img hover-effect" id="playerCircle2">
                                <!-------------ACC CIRCLE-------------------->
                            </div>
                        </div>
                    </div>
                    <div class="bottom-zone" id="">
                        <div class="name-frame brass-long no-btn">
                            <h5 class="zone-descr" data-key="player">Spieler</h5>
                            <h2 class="name" id="playNameID">Beta</h2>
                        </div>
                        <div class="card-group" id="playerStackID">
                            <!-- 5 Cards -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    
      `;
    }
  }
  