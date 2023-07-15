var isAwaitNextLine = false;

function mkLineRow(lineObj) {
    let e = document.createElement('tr');
    
    let cursor = document.createElement('th');
    cursor.innerHTML = ".";
    e.appendChild(cursor);

    let start = document.createElement('td');
    start.innerText = "???";
    e.appendChild(start);

    let end = document.createElement('td');
    end.innerText = "???";
    e.appendChild(end);

    let preview = document.createElement('td');
    preview.innerText = lineObj.preview;
    e.appendChild(preview);

    return e;
}

function updateLineRow(lineObj, lineRow, isCurrent) {
    lineRow.childNodes[1].innerText = assFmtTimeMs(lineObj.start*1000);
    lineRow.childNodes[2].innerText = assFmtTimeMs(lineObj.end*1000);

    if(!isCurrent) {
        lineRow.childNodes[0].innerHTML = ".";
        lineRow.classList.remove('current');
    } else {
        lineRow.childNodes[0].innerHTML = ">";
        lineRow.classList.add('current');
        lineRow.scrollIntoView({
            behavior: "instant",
            block: "center"
        });
    }
}

function updateCurrLineDisp() {
    if(currLine == -1 || currLine >= lines.length || isAwaitNextLine) {
        curLinePreview.innerText = "... empty ...";
    } else {
        curLinePreview.innerText = lines[currLine].preview;
    }
}

function nextLineStart() {
    if(player.paused) return;
    if(currLine > -1 && currLine < lines.length && !isAwaitNextLine) {
        lines[currLine].end = player.currentTime;
        updateLineRow(lines[currLine], lineTimerContent.childNodes[currLine], false);
    }
    isAwaitNextLine = false;
    currLine++;
    if(currLine < lines.length) {
        lines[currLine].start = player.currentTime;
        updateLineRow(lines[currLine], lineTimerContent.childNodes[currLine], true);
    }
    updateCurrLineDisp();
}

function awaitLineStart() {
    if(player.paused) return;
    if(currLine > -1) {
        lines[currLine].end = player.currentTime;
        updateLineRow(lines[currLine], lineTimerContent.childNodes[currLine], false);

        isAwaitNextLine = true;
        updateCurrLineDisp();
    }
}

function nudgeLineStart() {
    if(player.paused || currLine < 0 || isAwaitNextLine) return;

    lines[currLine].start = player.currentTime;
    updateLineRow(lines[currLine], lineTimerContent.childNodes[currLine], true);
}

function lineTimingOnKeyPress(e) {
    if(e.isComposing || e.keyCode == 229) return; // https://developer.mozilla.org/en-US/docs/Web/API/Element/keydown_event

    switch(e.key) {
        case ' ':
            nextLineStart();
        break;

        case '.':
            awaitLineStart();
        break;

        case '/':
            nudgeLineStart();
        break;
    }

    e.preventDefault = true;
}