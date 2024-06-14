
function infoStartSite() { // in index.html
  return `
    <h3>Melopoiia presents:</h3>
    <h1>Zauberkette</h1>
    <div class="opener-frame">
      <p class="opener">
        In der Welt von Ionoï herrscht die Magie der Musik. Ein jeder Ton kann hier zu einem großen Zauber werden - wenn man ihn denn nur richtig verkettet. Und so kommt es, dass sich die hiesigen Magier nur allzu gern darin messen, wer die längste Zauberkette zu erschaffen vermag. Beweise deine Zauberkräfte und zeige es ihnen allen!
      </p>
    </div>
    <a href="table.html">Zauberkette auf einem Display spielen</a>
    `;
}

function infoStart() {
  return `
    <p>Drücke Kartentausch, um eine Karte zu tauschen.<br>
    Oder "Nothing to Change"</p> 
    `;
}

function infoPlayCards() {
  return `
    <p>Webe aus 3 Wellenfischen oder Jokern einen Zauber, 
    nutze eine Spezialkarte oder beende deine Runde</p> 
    `;
}

function goblinRules() {
  return `
  <p>Mit einem Kobold kannst du einen Zauber des Gegners stibitzen, wenn er nicht zwischen zwei anderen Zaubern liegt und sich mit einem deiner Zauber verketten lässt. Dies ist leider gerade nicht möglich.</p> 
  `;
}

function wizzardRules() {
  return `
  <p>Mit einem Zauberer kannst du einen Zauber oder eine Kette des Gegners mit einem eigenen Zauber oder einer Kette austauschen. Dies ist leider gerade nicht möglich.</p> 
  `;
}

function infoChange() {
  return `
    <p>Klicke eine Karte an zum Tauschen.</p>
    `;
}

function infoSetCombi() {
  return ` 
      <p>Klicke drei Wellenfische für einen Zauber an.</p> 
      `;
}

function infoNoCombi() {
  return `   
    <p>Das ergibt leider keinen Zauber. 
    Versuche eine andere Kombination oder beende diese Runde.</p> 
    `;
}

function infoWinMagic() {
  return `
    <p><b>Bravo! </b>Du hast einen Zauber erlangt. 
    Die benutzten Wellenfische werden ausgetauscht. 
    Und es geht weiter!</p> 
    `;
}

function infoAccEmpty() {
  return `
    <p>Dieser Zauber ist schon zweimal im Spiel.
    Du musst ihn deinem Mitspieler entwenden.</p> 
    `;
}

function infoToGiveCard() {
  return ` 
    <p>Klicke die Karte, 
    welche du deinem Gegner zum Tausch geben möchtest.</p> 
    `;
}

function infoToTakeCard() {
  return `
    <p>Klicke die Karte beim Gegner, welche du haben möchtest.</p> 
    `;
}

function infoNoSameCards() {
  return `
  <p>Nicht zweimal die selbe Karte!.</p> 
  `;
}

function infoNothinToChange() {
  return `
  <p>Du hast offenbar keine passenden Wellenfische für einen Zauber.</p> 
  `;
}

function infoNoSpecials() {
  return `
  <p>Bitte wähle nur Wellenfische oder Gnome für einen Zauber.</p> 
  `;
}
/*------------------------------- INFOS FOR ACCORD CHANGES -------------------------------*/

function AccStillThere() {
  return `
  <p>Diesen Zauber besitzt du bereits oder er lässt sich nicht verketten.</p> 
  `;
}

function chooseAnotherAcc() {
  return `
  <p>Wähle etwas anderes oder drücke "Step Back"</p> 
  `;
}

function accIsBetween() {
  return `
  <p>Dieser Zauber liegt zwischen zwei anderen und kann nicht genommen werden.</p> 
  `;
}

function noConnection() {
  return `
  <p>Dieser Zauber kann sich mit keinem der deinen verbinden.</p> 
  `;
}


function infoUseWizzard() {
  return `       
    <p>Klicke auf den Zauber, der sich mit einem deiner Zauber verbinden lässt, egal, ob es eine Kette oder ein einzelner Zauber ist.</p> 
    `;
}

function needForConnection() {
  return `       
  <p>Du brauchst diesen Zauber zur Verknüpfung.<br> wähle einen anderen.</p> 
  `;
}

function infoWizzardComplete() {
  return `       
    <p>Bravo! Du hast den Magier eingesetzt. 
    Deine Runde ist zu Ende.</p> 
    `;
}

function wizzardTookSoloCard() {  
  return`
  <p>Du hast dich für einen Zauber entschieden. 
  Was möchtest du dafür geben? Du kannst eine einzelnen Zauber 
  wählen oder eine Kette die du bereit bis, deinem Gegner zu geben.</p>
  `;
}
function wizzardTookChain() {
  return `
  <p>Du hast dich für eine ganze Zauberkette entschieden. 
  Was möchtest du dafür geben? Du kannst eine einzelnen Zauber wählen 
  oder eine Kette die du bereit bis, deinem Gegner zu geben.</p>
  `;
}

function infoUseGoblin() {
  return `       
    <p>Wähle einen Zauber, der sich mit einem deiner verbinden lässt.</p> 
    `;
}

function infoGoblinComplete() {
  return `       
    <p>Bravo! Du hast einen Goblin eingesetzt. 
    Deine Runde ist zu Ende.</p> 
    `;
}

function gameRules() {
  return `
	<div class="popup-info">
        <img class="close-box" onclick="closePopup()" src="images/close.png">
        <div>
            <h3>Zauberkette - Spielbeschreibung</h3>
            <p>Ein Spiel für 2-4 Spieler, ab 5 Jahre. Musikalische Vorkenntnisse sind nicht nötig!<br>
                Das Kartenspiel „Zauberkette“ spielt man auf ZWEI Spielebenen.<br>
                Auf der 1. Ebene muss man 3 Wellenfische (Töne) so kombinierendes sie einen Zauber (Akkorde)
                ergeben.<br>
                Auf der 2. Ebene muss man die erlangten Zauber miteinander zu einer Kette verbinden.<br>
                Die Länge der KeGe, die zum Sieg führt, kann vor einem Spiel vereinbart werden.<br>
            </p>
        </div>
        <div>
            <h3> Spielablauf: </h3>
            <p>
                Die Länge der zu erreichenden Zauberkette wird vereinbart, dann bekommen alle Spieler 5
                Spielkarten offen auf den Tisch gelegt. Der Rest ergibt einen verdeckten Stapel mit Spielkarten. Die im
                Laufe des Spiels abgelegten Karten kommen zunächst auf einen extra Stapel, werden letztlich gemischt und
                ergeben dann wieder den Spielkarten-Stapel.<br>
            </p>

            <h3>1. Ziel einen Zauber komponieren.</h3>
            <p> Ist man am Zug, legt man (optional) zunächst eine Spielkarte ab und zieht eine neue.<br>
                Daraufhin werden die 5 Karten in beliebiger Reihenfolge genutzt und abgelegt, bis man die Runde beendet,
                einen Zauber erlangt (egal wie!) oder mit den Karten nichts mehr anfangen kann.<br>
                Ein Zug lässt sich jederzeit beenden, spätestens jedoch wenn man durch 3 passende Wellenfische*, den
                Kobold** oder den Magier** einen Zauber oder eine Zauberkette erhalten hat.<br>
                Ist der Zug beendet, werden alle abgelegten Spielkarten durch neue ersetzt. Erst danach ist die nächste
                Person am Zug.<br>
            </p>

            <h3>2. Ziel eine Zauberkette bilden.</h3>
            <p>Jeder Zauber verbindet sich mit zwei anderen Zaubern.* Ab zwei verbundenen Zaubern hat man eine
                Zauberkette.<br>
                Wenn Zauber sich „verketten“ lassen, müssen(!) sie dies tun.<br>
                Gewonnen hat die erste Person mit der zuvor vereinbarte Kettenlänge.
            </p>
        </div>

        <div>
            <h3>Spielkarten:</h3>
            3 X 12 Wellenfische.<br>
            3 X Gnom: Joker für alle Wellenfische. Man darf auch mehrere nutzen.<br>
            2 X Mellot: lege ihn ab und tausche eine beliebige Spielkarte mit dem Gegner.<br>
            2 X Kobold: lege ihn ab und klaue einen Zauber beim Gegner, der frei oder am Anfang oder Ende einer Kette
            ist.*<br>
            1 X Magier: lege ihn ab und tausche einen Zauber oder Zauberkette mit dem Gegner. Auch der Tausch eines
            einzelnen Zaubers gegen eine Kette und umgekehrt ist möglich(!).*<br>

            *Magier und Kobold funktionieren nur(!), wenn sich die gegnerische(n) Karte(n) mit einer eigenen Zauberkarte
            oder Kette verbinden lassen.<br>

            <h3>Zauberkarten:</h3>
            2 x 12 Zauber.<br>
        </div>
    </div>

`;
}
