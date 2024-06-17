const allAudio = document.querySelectorAll('mp3');

let isMuted = false;

/**
 * Is playing any sound from the game
 * @param {string} folder 
 * @param {string} sound 
 * @param {number} volume 
 */
function playSound(folder, title, volume) {
    console.log('title of card', title);
    if (!isMuted) {
        let currentSound = new Audio(`assets/sounds/${folder}/${title}.mp3`);
        currentSound.play();
        if (volume) {
            currentSound.volume
        } else {
            currentSound.volume = 0.5;
        }
    }
}

/**
 * Stopps the current audio sound
 * @param {audio} sound 
 */
function stopSound() {
    if (allAudio) {
        allAudio.pause();
        allAudio.currentTime = 0;
    } else {
        console.error('Sound not found:', sound);
    }
}
