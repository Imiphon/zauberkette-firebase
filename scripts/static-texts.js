
const startSide = {
  infoStartSite: {
    de: /*html*/`
      <div class="startside-top">
        <div class="startside-text">
          <div class="opener-frame">
            <p class="opener">
              In der Welt von Ionoï herrscht die Magie der Musik. 
              Töne und Klänge werden hier zu einem großen Zauber. 
              Dafür nehmen die Magier winzige Wellenfische, die einen Ton in sich tragen und verbinden sie zu Zaubern.
              Nur allzu gern messen sie sich darin, wem dann aus diesen Zaubern die längste Zauberkette gelingt. 
              Beweise deine Zauberkräfte und zeige es ihnen allen!
            </p>
          </div>
        </div>
        <div class="startside-btns">        
          <a href="table.html">
            <div id="startBtn" class="">Zauberkette spielen</div>
          </a>
        </div>
      </div>
    `,
    en: /*html*/`
        <div class="startside-top">
        <div class="startside-text">
          <div class="opener-frame">
            <p class="opener">
            In the world of Ionoï, the magic of music reigns supreme.
            Here, tones and sounds transform into powerful spells.
            To achieve this, the mages take tiny wavefish that carry a tone within themselves and bind them into spells.
            They eagerly compete to see who can create the longest chain of spells from these enchantments.
            Prove your magical abilities and show them all!
            </p>
          </div>
        </div>
        <div class="startside-btns">        
          <a href="table.html">
            <div id="startBtn" class="">Play Zauberkette</div>
          </a>
        </div>
      </div>
    `,
    fr: /*html*/`
         <div class="startside-top">
        <div class="startside-text">
          <div class="opener-frame">
            <p class="opener">
            Dans le monde d'Ionoï, la magie de la musique règne en maître.
            Ici, les tons et les sons se transforment en puissants sorts.
            Pour ce faire, les mages prennent de minuscules poissons-ondes qui portent un ton en eux-mêmes et les lient en sorts.
            Ils se mesurent avec empressement pour voir qui parvient à créer la plus longue chaîne de sorts à partir de ces enchantements.
            Prouve tes capacités magiques et montre-leur à tous !
            </p>
          </div>
        </div>
        <div class="startside-btns">        
          <a href="table.html">
            <div id="startBtn" class="">Joue Zauberkette</div>
          </a>
        </div>
      </div>
    `,
  }
}

//actually it has to be in static-texts
function infoStartSite() {
  return startSide.infoStartSite[language];
}

const ruleTexts = {
  gameRules: {
    de: /*html*/`
          <div class="game-description">
    <h2>Spielbeschreibung</h2>
    <p><strong>Karten im Spiel:</strong><br>
    2x12 Zauber, um Zauberketten zu weben.<br>
    3x12 Wellenfische, zum Komponieren eines Zaubers.<br>
    3x1 Gnom, als Joker für die Wellenfische.<br>
    2x1 Mellot<br>
    2x1 Kobold<br>
    1x1 Magier</p>

    <p><strong>Spielablauf:</strong><br>
    Die Länge der zu erreichenden Zauberkette wird vereinbart und in der Navigationsleiste unter „Gewinnerkette“ festgelegt (Standard sind 5 Zauber in einer Kette).<br>
    Für beide Spieler liegen immer 5 Spielkarten offen auf dem Tisch.<br>
    Die zwei Zirkel füllen sich mit den erlangten Zaubern.</p>

    <p>1. Ziel ist es, passende Wellenfische für einen Zauber zu erlangen.<br>
    Ist man am Zug, kann man zunächst eine Spielkarte gegen eine neue tauschen, dann werden sie ganz nach Belieben genutzt und abgelegt.<br>
    Ein Zauber besteht aus Prime, Terz und Quinte. Auf den Schildern unter den Karten siehst du zu welchen Zaubern der jeweilige Wellenfisch passt.<br>
    Beispiel: für einen C-Zauber benötigt man C (Prime in C), E (Terz in C) und G (Quinte in C).<br>
    Ein Gnom kann jeden Wellenfisch ersetzen.</p>

    <p>Der Mellot erlaubt, eine beliebige Spielkarte mit dem Gegner zu tauschen (keine Zauber!).<br>
    Drücke den Mellot-Knopf, klicke die Karte, die du dem Gegner geben möchtest (egal welche, bis auf den benutzten Mellot selbst) und dann klicke die Karte die du vom Gegner haben möchtest.</p>

    <p>Der Kobold erlaubt es dir, einen einzelnen oder am Kettenende stehenden Zauber vom Gegner zu klauen.<br>
    Klicke dazu den Kobold-Knopf, und wähle dann einen Zauber beim Gegner, der sich mit einem deiner Zauber verketten lässt.</p>

    <p>Der Magier, erlaubt dir den Tausch eines Zaubers mit dem Gegner oder einer ganzen Kette und umgekehrt, jedoch kein Aufteilen von Ketten.<br>
    Magier und Kobold funktionieren nur(!) wenn sich die gegnerischen Zauber mit einem eigenen Zauber verbinden lassen.</p>

    <p>Ein Zug lässt sich jederzeit beenden, spätestens jedoch wenn man durch 3 passende Wellenfische, den Kobold oder den Magier einen Zauber beziehungsweise eine Zauberkette erhalten hat.<br>
    Ist der Zug beendet, werden alle abgelegten Spielkarten durch neue ersetzt. Erst danach ist die nächste Person am Zug.</p>

    <p>2. Ziel ist es, eine Zauberkette zu bilden.<br>
    Ab zwei verbundenen Zaubern hast du eine Zauberkette.<br>
    Jeder Zauber verbindet sich mit zwei anderen Zaubern.<br>
    Wenn Zauber sich verketten lassen, tun sie dies automatisch.</p>

    <p>Gewonnen hat die erste Person mit der zuvor vereinbarte Kettenlänge (max. 12).</p>

    <p><strong>Tipp:</strong><br>
    Beim Sammeln der Wellenfische bedenke, welche 2 Zauber an die Zauberkette passen.</p>
</div>
    `,

    en: /*html*/`
              <div class="game-description">
    <h2>Game Description</h2>
    <p><strong>Cards in the Game:</strong><br>
    2x12 spells to weave spell chains.<br>
    3x12 wave fish for composing a spell.<br>
    3x1 gnome as a joker for the wave fish.<br>
    2x1 Mellot<br>
    2x1 Goblin<br>
    1x1 Wizard</p>

    <p><strong>Gameplay:</strong><br>
    The length of the spell chain to be achieved is agreed upon and set in the navigation bar under "Winning Chain" (standard is 5 spells in a chain).<br>
    For both players, 5 playing cards are always open on the table.<br>
    The two circles fill up with the spells obtained.</p>

    <p>1. The goal is to acquire suitable wave fish for a spell.<br>
    On your turn, you can first exchange a playing card for a new one, then the cards can be used and discarded as desired.<br>
    A spell consists of prime, third, and fifth. On the signs under the cards, you can see which spells the respective wave fish fit.<br>
    Example: For a C spell, you need C (prime in C), E (third in C), and G (fifth in C).<br>
    A gnome can replace any wave fish.</p>

    <p>The Mellot allows you to exchange any playing card with your opponent (no spells!).<br>
    Press the Mellot button, click the card you want to give to your opponent (any card except the used Mellot itself), and then click the card you want from your opponent.</p>

    <p>The goblin allows you to steal a single spell or one at the end of a chain from your opponent.<br>
    Click the goblin button, then select a spell from your opponent that can connect with one of your spells.</p>

    <p>The wizard allows you to exchange a spell with your opponent or an entire chain and vice versa, but no splitting of chains.<br>
    Wizards and goblins only work if the opponent's spells can connect with one of your spells.</p>

    <p>A turn can be ended at any time, but at the latest when you have received a spell or a spell chain through 3 matching wave fish, the goblin, or the wizard.<br>
    If the turn is over, all discarded playing cards are replaced with new ones. Only then is it the next person's turn.</p>

    <p>2. The goal is to form a spell chain.<br>
    From two connected spells, you have a spell chain.<br>
    Each spell connects with two other spells.<br>
    When spells can connect, they do so automatically.</p>

    <p>The first person to reach the previously agreed chain length (max. 12) wins.</p>

    <p><strong>Tip:</strong><br>
    When collecting wave fish, consider which 2 spells fit into the spell chain.</p>
</div>
    `,

    fr: /*html*/`
       <div class="game-description">
    <h2>Description du jeu</h2>
    <p><strong>Cartes dans le jeu :</strong><br>
    2x12 sorts pour tisser des chaînes de sorts.<br>
    3x12 poissons d'onde pour composer un sort.<br>
    3x1 gnome comme joker pour les poissons d'onde.<br>
    2x1 Mellot<br>
    2x1 lutin<br>
    1x1 mage</p>

    <p><strong>Déroulement du jeu :</strong><br>
    La longueur de la chaîne de sorts à atteindre est convenue et définie dans la barre de navigation sous "Chaîne gagnante" (la norme est de 5 sorts dans une chaîne).<br>
    Pour les deux joueurs, 5 cartes sont toujours ouvertes sur la table.<br>
    Les deux cercles se remplissent avec les sorts obtenus.</p>

    <p>1. Le but est d'obtenir des poissons d'onde appropriés pour un sort.<br>
    Lorsque c'est ton tour, tu peux d'abord échanger une carte contre une nouvelle, puis les cartes peuvent être utilisées et défaussées à volonté.<br>
    Un sort se compose de la fondamentale, de la tierce et de la quinte. Sur les panneaux sous les cartes, tu vois à quels sorts correspond chaque poisson d'onde.<br>
    Exemple : Pour un sort en C, il faut C (fondamentale en C), E (tierce en C) et G (quinte en C).<br>
    Un gnome peut remplacer n'importe quel poisson d'onde.</p>

    <p>Le Mellot permet d'échanger une carte de ton choix avec celle de l'adversaire (pas de sorts !).<br>
    Appuie sur le bouton Mellot, clique sur la carte que tu souhaites donner à ton adversaire (n'importe laquelle, sauf le Mellot utilisé), puis clique sur la carte que tu veux de ton adversaire.</p>

    <p>Le lutin te permet de voler un sort isolé ou se trouvant à la fin d'une chaîne de l'adversaire.<br>
    Clique sur le bouton lutin, puis choisis un sort chez l'adversaire qui peut se lier à l'un de tes sorts.</p>

    <p>Le mage te permet d'échanger un sort avec l'adversaire ou une chaîne entière et inversement, mais pas de diviser des chaînes.<br>
    Mages et lutins ne fonctionnent que si les sorts adverses peuvent se connecter à un de tes sorts.</p>

    <p>Un tour peut être terminé à tout moment, mais au plus tard lorsqu'un sort ou une chaîne de sorts a été obtenue grâce à 3 poissons d'onde correspondants, au lutin ou au mage.<br>
    Si le tour est terminé, toutes les cartes défaussées sont remplacées par de nouvelles. Ce n'est qu'alors que c'est le tour de la prochaine personne.</p>

    <p>2. Le but est de former une chaîne de sorts.<br>
    Dès que deux sorts sont connectés, tu as une chaîne de sorts.<br>
    Chaque sort se connecte à deux autres sorts.<br>
    Lorsque les sorts peuvent se connecter, ils le font automatiquement.</p>

    <p>Le gagnant est la première personne à atteindre la longueur de chaîne convenue (max. 12).</p>

    <p><strong>Conseil :</strong><br>
    En collectant les poissons d'onde, pense à quels 2 sorts peuvent s'ajouter à la chaîne de sorts.</p>
</div>
    `,
  },
}

function gameRules() {
  return ruleTexts.gameRules[language];
}

const staticTexts = {
  chainLength: {
    de: 'Gewinnerkette',
    en: 'Winning Chain',
    fr: 'Chaîne gagnantes',
  },
  observer: {
    de: 'Beobachter',
    en: 'Observer',
    fr: 'Observateur',
  },
  swapCard: {
    de: 'Kartentausch',
    en: 'Swap Card',
    fr: 'Échanger la carte',
  },
  continue: {
    de: 'Weiter',
    en: 'Continue',
    fr: 'Continuer',
  },
  composeSpell: {
    de: 'Zauber komponieren',
    en: 'Compose Spell',
    fr: 'Composer un sort',
  },
  back: {
    de: 'Zurück',
    en: 'Back',
    fr: 'Retour',
  },
  endTurn: {
    de: 'Runde beenden',
    en: 'End Turn',
    fr: 'Terminer le tour',
  },
  player: {
    de: 'Spieler',
    en: 'Player',
    fr: 'Joueur',
  },
  // Add other static texts as needed
};
