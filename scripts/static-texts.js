
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
    de: `...`, // Include the German game rules here
    en: `...`, // Include the English translation of the game rules here
    fr: `...`, // Include the French translation of the game rules here
  },
}

function gameRules() {
  return ruleTexts.gameRules[language];
}


const staticTexts = {
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
