const texts = {
  optAccInfo: {
    de: `<div class="card-info-frame">
            <div class="card-info-frame brass-gear3 no-btn" alt="Info">
            </div>
          </div>`,
    en: `<div class="card-info-frame">
            <div class="card-info-frame brass-gear3 no-btn" alt="Info">
            </div>
          </div>`,
    fr: `<div class="card-info-frame">
            <div class="card-info-frame brass-gear3 no-btn" alt="Info">
            </div>
          </div>`,
  },
  optAccInfoText: {
    de: `<p>Drücke 'Zauber komponieren' und wähle drei verschiedene Wellenfische mit gleichem Zauber in 'Prime', 'Terz' und 'Quint' oder nimm Gnome als Joker.</p>`,
    en: `<p>Press 'Compose Spell' and choose three different Wave Fish with the same spell in 'Prime', 'Third', and 'Fifth' or use Gnomes as jokers.</p>`,
    fr: `<p>Appuyez sur 'Composer un sort' et choisissez trois Poissons Vague différents avec le même sort en 'Prime', 'Tierce', et 'Quinte' ou utilisez des Gnomes comme jokers.</p>`,
  },
  infoMellotText: {
    de: `Drücke den Mellot-Knopf und du kannst eine eigene Spielkarte gegen eine gegnerische Karte eintauschen.`,
    en: `Press the Mellot button and you can exchange one of your own playing cards for an opponent's card.`,
    fr: `Appuyez sur le bouton Mellot et vous pouvez échanger une de vos propres cartes contre une carte de l'adversaire.`,
  },
  infoGoblinText: {
    de: `Drücke den Kobold-Knopf und du kannst einen Zauber vom Gegner stehlen, wenn er an einen deiner Zauber passt.`,
    en: `Press the Goblin button and you can steal a spell from the opponent if it connects to one of your spells.`,
    fr: `Appuyez sur le bouton Gobelin et vous pouvez voler un sort à l'adversaire s'il se connecte à l'un de vos sorts.`,
  },
  infoWizardText: {
    de: `Drücke den Magier-Knopf und du kannst einzelne Zauber oder Zauberketten mit dem Gegner austauschen, wenn sie an einen deiner (verbliebenen) Zauber passen.`,
    en: `Press the Wizard button and you can exchange individual spells or spell chains with the opponent if they connect to one of your (remaining) spells.`,
    fr: `Appuyez sur le bouton Magicien et vous pouvez échanger des sorts individuels ou des chaînes de sorts avec l'adversaire s'ils se connectent à l'un de vos sorts (restants).`,
  },
  noText: {
    de: ``,
    en: ``,
    fr: ``,
  },
  infoStart: {
    de: `<p>Drücke "Kartentausch" um eine deiner Karten zu tauschen oder direkt "Weiter"</p>`,
    en: `<p>Press "Swap Card" to exchange a card or "Continue"</p>`,
    fr: `<p>Appuyez sur "Échanger une carte" pour échanger une carte ou "Continuer"</p>`,
  },
  infoPlayCards: {
    de: `<p>Webe aus 3 Wellenfischen oder Gnomen einen Zauber, nutze eine Spezialkarte oder beende deine Runde</p>`,
    en: `<p>Weave a spell from 3 Wave Fish or Gnomes, use a special card, or end your turn</p>`,
    fr: `<p>Tissez un sort à partir de 3 Poissons Vague ou Gnomes, utilisez une carte spéciale, ou terminez votre tour</p>`,
  },
  goblinRules: {
    de: `<p>Dies ist leider gerade nicht möglich.</p>`,
    en: `<p>Unfortunately, this is not possible at the moment.</p>`,
    fr: `<p>Malheureusement, cela n'est pas possible pour le moment.</p>`,
  },
  wizardRules: {
    de: `<p>Dies ist leider gerade nicht möglich.</p>`,
    en: `<p>Unfortunately, this is not possible at the moment.</p>`,
    fr: `<p>Malheureusement, cela n'est pas possible pour le moment.</p>`,
  },
  infoWizard: {
    de: `<p>Mit dem Magier kannst du einen Zauber oder eine Kette mit dem Gegner austauschen, solange du noch einen Zauber für die Verkettung hast. Oder du drückst 'zurück'.</p>`,
    en: `<p>With the Wizard, you can exchange a spell or a chain with the opponent, as long as you still have a spell for chaining. Or press 'back'.</p>`,
    fr: `<p>Avec le Magicien, vous pouvez échanger un sort ou une chaîne avec l'adversaire, tant que vous avez encore un sort pour la liaison. Ou appuyez sur 'retour'.</p>`,
  },
  infoGoblin: {
    de: `<p>Mit einem Kobold kannst du einen Zauber des Gegners stibitzen, wenn er nicht zwischen zwei anderen Zaubern liegt und sich mit einem deiner Zauber verketten lässt. Oder du drückst 'zurück'.</p>`,
    en: `<p>With a Goblin, you can snatch a spell from the opponent if it is not between two other spells and can be chained with one of your spells. Or press 'back'.</p>`,
    fr: `<p>Avec un Gobelin, vous pouvez dérober un sort à l'adversaire s'il n'est pas entre deux autres sorts et peut être enchaîné avec l'un de vos sorts. Ou appuyez sur 'retour'.</p>`,
  },
  infoMellot: {
    de: `<p>Mit dem Mellot kannst du eine eigene Karte gegen eine gegnerische Karte eintauschen. Oder du drückst 'zurück'.</p>`,
    en: `<p>With the Mellot, you can exchange one of your own cards for an opponent's card. Or press 'back'.</p>`,
    fr: `<p>Avec le Mellot, vous pouvez échanger une de vos propres cartes contre une carte de l'adversaire. Ou appuyez sur 'retour'.</p>`,
  },
  infoChange: {
    de: `<p>Klicke eine Karte an zum Tauschen.</p>`,
    en: `<p>Click a card to exchange.</p>`,
    fr: `<p>Cliquez sur une carte pour échanger.</p>`,
  },
  changeSameCard: {
    de: `<p>Du hast die gleiche Karte noch einmal gezogen.</p>`,
    en: `<p>You have drawn the same card again.</p>`,
    fr: `<p>Vous avez tiré la même carte à nouveau.</p>`,
  },
  infoSetCombi: {
    de: `<p>Klicke drei Wellenfische oder Gnome für einen Zauber an.</p>`,
    en: `<p>Click three Wave Fish or Gnomes for a spell.</p>`,
    fr: `<p>Cliquez sur trois Poissons Vague ou Gnomes pour un sort.</p>`,
  },
  infoNoCombi: {
    de: `<p>Das ergibt leider keinen Zauber. Gehe zurück und versuche etwas anderes oder beende diese Runde.</p>`,
    en: `<p>Unfortunately, that doesn't result in a spell. Go back and try something else or end this round.</p>`,
    fr: `<p>Malheureusement, cela ne donne pas de sort. Revenez en arrière et essayez autre chose ou terminez ce tour.</p>`,
  },
  infoWinMagic: {
    de: `<p><b>Bravo!</b> Du hast einen Zauber erlangt. Die benutzten Wellenfische werden ausgetauscht. Und es geht weiter!</p>`,
    en: `<p><b>Bravo!</b> You have gained a spell. The used Wave Fish are exchanged. And it continues!</p>`,
    fr: `<p><b>Bravo!</b> Vous avez obtenu un sort. Les Poissons Vague utilisés sont échangés. Et ça continue!</p>`,
  },
  infoAccEmpty: {
    de: `<p>Dieser Zauber ist schon zweimal im Spiel.</p>`,
    en: `<p>This spell is already in play twice.</p>`,
    fr: `<p>Ce sort est déjà en jeu deux fois.</p>`,
  },
  infoToGiveCard: {
    de: `<p>Klicke die Karte, welche du deinem Gegner zum Tausch geben möchtest.</p>`,
    en: `<p>Click the card you want to give to your opponent for exchange.</p>`,
    fr: `<p>Cliquez sur la carte que vous souhaitez donner à votre adversaire pour l'échange.</p>`,
  },
  infoToTakeCard: {
    de: `<p>Klicke die Karte beim Gegner, welche du haben möchtest.</p>`,
    en: `<p>Click the opponent's card you want to have.</p>`,
    fr: `<p>Cliquez sur la carte de l'adversaire que vous souhaitez avoir.</p>`,
  },
  infoNoSameCards: {
    de: `<p>Nicht zweimal die selbe Karte!</p>`,
    en: `<p>Not the same card twice!</p>`,
    fr: `<p>Pas deux fois la même carte !</p>`,
  },
  infoNothinToChange: {
    de: `<p>Du hast offenbar keine passenden Wellenfische für einen Zauber.</p>`,
    en: `<p>You apparently have no suitable Wave Fish for a spell.</p>`,
    fr: `<p>Vous n'avez apparemment pas de Poissons Vague adaptés pour un sort.</p>`,
  },
  infoNoSpecials: {
    de: `<p>Bitte wähle nur Wellenfische oder Gnome für einen Zauber.</p>`,
    en: `<p>Please choose only Wave Fish or Gnomes for a spell.</p>`,
    fr: `<p>Veuillez choisir uniquement des Poissons Vague ou des Gnomes pour un sort.</p>`,
  },
  AccStillThere: {
    de: `<p>Diesen Zauber besitzt du bereits oder er lässt sich nicht verketten.</p>`,
    en: `<p>You already possess this spell or it cannot be chained.</p>`,
    fr: `<p>Vous possédez déjà ce sort ou il ne peut pas être enchaîné.</p>`,
  },
  chooseAnotherAcc: {
    de: `<p>Wähle etwas anderes oder drücke "Zurück"</p>`,
    en: `<p>Choose something else or press "Back"</p>`,
    fr: `<p>Choisissez autre chose ou appuyez sur "Retour"</p>`,
  },
  accIsBetween: {
    de: `<p>Dieser Zauber liegt zwischen zwei anderen und kann nicht genommen werden.</p>`,
    en: `<p>This spell is between two others and cannot be taken.</p>`,
    fr: `<p>Ce sort est entre deux autres et ne peut pas être pris.</p>`,
  },
  noConnection: {
    de: `<p>Dieser Zauber kann sich mit keinem der deinen verbinden.</p>`,
    en: `<p>This spell cannot connect with any of yours.</p>`,
    fr: `<p>Ce sort ne peut se connecter à aucun des vôtres.</p>`,
  },
  infoUseWizard: {
    de: `<p>Klicke auf den Zauber, der sich mit einem deiner Zauber verbinden lässt, egal, ob es eine Kette oder ein einzelner Zauber ist.</p>`,
    en: `<p>Click on the spell that can connect with one of your spells, whether it's a chain or a single spell.</p>`,
    fr: `<p>Cliquez sur le sort qui peut se connecter avec l'un de vos sorts, qu'il s'agisse d'une chaîne ou d'un sort unique.</p>`,
  },
  needForConnection: {
    de: `<p>Du brauchst diesen Zauber zur Verknüpfung. Wähle einen anderen oder drücke 'Zurück'</p>`,
    en: `<p>You need this spell for linking. Choose another or press 'Back'</p>`,
    fr: `<p>Vous avez besoin de ce sort pour la liaison. Choisissez-en un autre ou appuyez sur 'Retour'</p>`,
  },
  infoWizardComplete: {
    de: `<p>Bravo! Du hast den Magier eingesetzt. Deine Runde ist zu Ende.</p>`,
    en: `<p>Bravo! You have used the Wizard. Your turn is over.</p>`,
    fr: `<p>Bravo! Vous avez utilisé le Magicien. Votre tour est terminé.</p>`,
  },
  wizardTookSoloCard: {
    de: `<p>Du hast dich für einen Zauber entschieden. Was möchtest du dafür geben? Du kannst einen einzelnen Zauber wählen oder eine Kette, die du bereit bist, deinem Gegner zu geben.</p>`,
    en: `<p>You have chosen a spell. What would you like to give in return? You can choose a single spell or a chain that you're willing to give to your opponent.</p>`,
    fr: `<p>Vous avez choisi un sort. Que souhaitez-vous donner en retour ? Vous pouvez choisir un sort unique ou une chaîne que vous êtes prêt à donner à votre adversaire.</p>`,
  },
  wizardTookChain: {
    de: `<p>Du hast dich für eine ganze Zauberkette entschieden. Was möchtest du dafür geben? Du kannst einen einzelnen Zauber wählen oder eine Kette, die du bereit bist, deinem Gegner zu geben.</p>`,
    en: `<p>You have chosen a whole spell chain. What would you like to give in return? You can choose a single spell or a chain that you're willing to give to your opponent.</p>`,
    fr: `<p>Vous avez choisi une chaîne de sorts entière. Que souhaitez-vous donner en retour ? Vous pouvez choisir un sort unique ou une chaîne que vous êtes prêt à donner à votre adversaire.</p>`,
  },
  infoUseGoblin: {
    de: `<p>Wähle einen Zauber, der sich mit einem deiner verbinden lässt.</p>`,
    en: `<p>Choose a spell that can connect with one of yours.</p>`,
    fr: `<p>Choisissez un sort qui peut se connecter avec l'un des vôtres.</p>`,
  },
  infoGoblinComplete: {
    de: `<p>Bravo! Du hast einen Kobold eingesetzt. Deine Runde ist zu Ende.</p>`,
    en: `<p>Bravo! You have used a Goblin. Your turn is over.</p>`,
    fr: `<p>Bravo! Vous avez utilisé un Gobelin. Votre tour est terminé.</p>`,
  },
  playerWin: {
    de: (name, length) => `${name} gewinnt mit einer Kettenzahl von ${length} Zaubern. <br> Wenn ihr weiterspielen wollt, erhöht die Zahl der Gewinnerkette.`,
    en: (name, length) => `${name} wins with a chain of ${length} spells. <br> If you want to keep playing, increase the number of spells needed to win.`,
    fr: (name, length) => `${name} gagne avec une chaîne de ${length} sorts. <br> Si vous voulez continuer à jouer, augmentez le nombre de sorts nécessaires pour gagner.`,
  },
  gnom: {
    de: 'Gnom',
    en: 'Gnome',
    fr: 'Gnome',
  },
  mellot: {
    de: 'Mellot',
    en: 'Mellot',
    fr: 'Mellot',
  },
  goblin: {
    de: 'Kobold',
    en: 'Goblin',
    fr: 'Gobelin',
  },
  wizard: { // Note: Correct spelling is "wizard" in English, but maintaining as per your code
    de: 'Magier',
    en: 'Wizard',
    fr: 'Magicien',
  },
  
  // Translations for musical terms if needed
  prime: {
    de: 'Prime',
    en: 'Prime',
    fr: 'Prime',
  },
  terz: {
    de: 'Terz',
    en: 'Third',
    fr: 'Tierce',
  },
  quint: {
    de: 'Quint',
    en: 'Fifth',
    fr: 'Quinte',
  },

  // Add other translations similarly...
};

// Modified functions to return content based on the current language

function optAccInfo() {
  return texts.optAccInfo[language];
}

function optAccInfoText() {
  return texts.optAccInfoText[language];
}

function infoMellotText() {
  return texts.infoMellotText[language];
}

function infoGoblinText() {
  return texts.infoGoblinText[language];
}

function infoWizardText() {
  return texts.infoWizardText[language];
}

function noText() {
  return texts.noText[language];
}

function infoStart() {
  return texts.infoStart[language];
}

function infoPlayCards() {
  return texts.infoPlayCards[language];
}

function goblinRules() {
  return texts.goblinRules[language];
}

function wizardRules() {
  return texts.wizardRules[language];
}

function infoWizard() {
  return texts.infoWizard[language];
}

function infoGoblin() {
  return texts.infoGoblin[language];
}

function infoMellot() {
  return texts.infoMellot[language];
}

function infoChange() {
  return texts.infoChange[language];
}

function changeSameCard() {
  return texts.changeSameCard[language];
}

function infoSetCombi() {
  return texts.infoSetCombi[language];
}

function infoNoCombi() {
  return texts.infoNoCombi[language];
}

function infoWinMagic() {
  return texts.infoWinMagic[language];
}

function infoAccEmpty() {
  return texts.infoAccEmpty[language];
}

function infoToGiveCard() {
  return texts.infoToGiveCard[language];
}

function infoToTakeCard() {
  return texts.infoToTakeCard[language];
}

function infoNoSameCards() {
  return texts.infoNoSameCards[language];
}

function infoNothinToChange() {
  return texts.infoNothinToChange[language];
}

function infoNoSpecials() {
  return texts.infoNoSpecials[language];
}

function AccStillThere() {
  return texts.AccStillThere[language];
}

function chooseAnotherAcc() {
  return texts.chooseAnotherAcc[language];
}

function accIsBetween() {
  return texts.accIsBetween[language];
}

function noConnection() {
  return texts.noConnection[language];
}

function infoUseWizard() {
  return texts.infoUseWizard[language];
}

function needForConnection() {
  return texts.needForConnection[language];
}

function infoWizardComplete() {
  return texts.infoWizardComplete[language];
}

function wizardTookSoloCard() {
  return texts.wizardTookSoloCard[language];
}

function wizardTookChain() {
  return texts.wizardTookChain[language];
}

function infoUseGoblin() {
  return texts.infoUseGoblin[language];
}

function infoGoblinComplete() {
  return texts.infoGoblinComplete[language];
}

function playerWin(name, length) {
  return texts.playerWin[language](name, length);
}

