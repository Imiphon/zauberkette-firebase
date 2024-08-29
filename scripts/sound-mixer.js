const allAudio = document.querySelectorAll('mp3');

let isMuted = false;

/**
 * Is playing any sound from the game
 * @param {string} folder 
 * @param {string} sound 
 * @param {number} volume 
 */
function playSound(folder, title, volume) {
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

function changeMute() {
    isMuted = !isMuted;
    const volumeUpImg = document.querySelector('.volume_up');
    const volumeOffImg = document.querySelector('.volume_off');
    
    if (isMuted) {
        volumeUpImg.style.display = 'none';
        volumeOffImg.style.display = 'block';
    } else {
        volumeUpImg.style.display = 'block';
        volumeOffImg.style.display = 'none';
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
