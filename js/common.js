function lyricAutoSave() {
    window.localStorage.lyric = lyricInput.value;
}

function download(content, mimeType, filename){
    const a = document.createElement('a') // Create "a" element
    const blob = new Blob([content], {type: mimeType}) // Create a blob (file-like object)
    const url = URL.createObjectURL(blob) // Create an object URL from blob
    a.setAttribute('href', url) // Set "a" element link
    a.setAttribute('download', filename) // Set download filename
    a.click() // Start downloading
}

function playPause() {
    player.paused ? player.play() : player.pause();
}

function faster() {
    if(player.playbackRate >= 1.25) return;
    player.playbackRate += 0.25;
    playerSpeedDisplay.innerText = player.playbackRate;
}

function slower() {
    if(player.playbackRate <= 0.5) return;
    player.playbackRate -= 0.25;
    playerSpeedDisplay.innerText = player.playbackRate;
}


function commonKeyPress(e) {
    if(e.isComposing || e.keyCode == 229) return; // https://developer.mozilla.org/en-US/docs/Web/API/Element/keydown_event

    switch(e.key) {
        case 'p':
        case 'P':
            playPause();
        break;

        case ']':
            faster();
        break;

        case '[':
            slower();
        break;
    }

    e.preventDefault = true;
}