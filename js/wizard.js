function init() {
    step1.classList.add("active");
    lyricInput.addEventListener('keydown', textKeyDown);
    if(window.localStorage.lyric) {
        lyricInput.value = window.localStorage.lyric;
    }
}

function goStep2() {
    if(!audioSelect.files.length) {
        alert("Audio not selected!");
        return;
    }

    parseLines();
    if(!lines.length) {
        alert("Text not entered!");
        return;
    }

    document.title += " - " + audioSelect.files[0].name;

    lyricAutoSave();

    lineTimerContent.innerHTML = "";
    currLine = -1;
    curLinePreview.innerText = "... empty ...";
    lines.forEach(line => lineTimerContent.appendChild(mkLineRow(line)));

    let url = URL.createObjectURL(audioSelect.files[0]);
    player.addEventListener('load', () => URL.revokeObjectURL(url));
    player.src = url;
    playerHolder.style.cssText = '';

    document.addEventListener('keydown', commonKeyPress);
    document.addEventListener('keydown', lineTimingOnKeyPress);

    step1.classList.remove("active");
    step2.classList.add("active");
}

function downloadStep2() {
    genAssFile(audioSelect.files[0].name+'_lines-only');
}

function goStep3() {
    player.pause();
    player.currentTime = lines[0].start - 3.0;
    currLine = -1;

    document.removeEventListener('keydown', lineTimingOnKeyPress);
    document.addEventListener('keydown', sylTimingOnKeyDown);
    document.addEventListener('keyup', sylTimingOnKeyUp);
    player.addEventListener('timeupdate', sylTimingOnTick);

    step2.classList.remove('active');
    step3.classList.add('active');
}

function downloadStep3() {
    // Merge down tokenized syllables
    sylTimingMergeTokens();
    // Save the file
    genAssFile(audioSelect.files[0].name);
}