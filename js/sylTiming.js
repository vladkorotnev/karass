var sylTimingSpaceSts = false;
var currToken = 0;

function sylTimingMergeTokens() {
    for(let lineObj of lines) {
        var newTxt = "";
        var lastEnd = lineObj.start;
        for(let tokenObj of lineObj.tokens) {
            var extraTime = 0;
            if(tokenObj.start > lastEnd) {
                if(!tokenObj.isFuriSeqContinuation) {
                    // Need to add delay until next token
                    newTxt += "{\\kf" + Math.round((tokenObj.start - lastEnd) * 100) + "}"; 
                } else {
                    // This token is a continuation of Furigana sequence
                    // So we need to instead extend it's time
                    extraTime += (tokenObj.start - lastEnd);
                }
            }
            lastEnd = tokenObj.end;
            newTxt += "{\\kf" + Math.round(((tokenObj.end - tokenObj.start) + extraTime) * 100) + "}" + tokenObj.text;
        }
        lineObj.raw = newTxt;
    }
}

function sylTimingSpacePress(isPress) {
    if(sylTimingSpaceSts == isPress) return; // ignore autorepeats

    if(currLine < 0 || currLine >= lines.length) return;
    let lineObj = lines[currLine];

    if(currToken >= lineObj.tokens.length || currToken < 0) return;

    if(isPress) {
        lineObj.tokens[currToken].start = player.currentTime;
        sylTimerSylLine.childNodes[currToken].classList.add("current");
    } else {
        lineObj.tokens[currToken].end = player.currentTime;
        sylTimerCursorLine.childNodes[currToken].innerHTML = "&nbsp;";
        sylTimerSylLine.childNodes[currToken].classList.remove("current");
        sylTimerSylLine.childNodes[currToken].classList.add("past");
        currToken++;
        if(currToken < lineObj.tokens.length)
            sylTimerCursorLine.childNodes[currToken].innerHTML = "↓";
    }

    sylTimingSpaceSts = isPress;
}

function sylTimingJumpBackLine() {
    if(currLine < 0) return;

    if(sylTimingSpaceSts)  sylTimingSpacePress(false);

    if(currToken > 0) {
        currToken = 0;
    } else if(currLine > 0) {
        currToken = 0;
        currLine -= 1;
    }
    player.currentTime = lines[currLine].start;
    sylTimingDrawLine();
}

function sylTimingOnKeyDown(e) {
    if(e.isComposing || e.keyCode == 229) return;

    switch(e.key) {
        case ' ':
            sylTimingSpacePress(true);
        break;

        case '/':
            sylTimingJumpBackLine();
        break;
    }

    e.preventDefault = true;
}

function sylTimingOnKeyUp(e) {
    if(e.isComposing || e.keyCode == 229) return;

    switch(e.key) {
        case ' ':
            sylTimingSpacePress(false);
        break;
    }

    e.preventDefault = true;
}

function sylTimingDrawLine() {
    sylTimerCursorLine.innerHTML = "";
    sylTimerSylLine.innerHTML = "";
    if(currLine == -1) return;
    for(let tokObj of lines[currLine].tokens) {
        let curSpot = document.createElement("td");
        curSpot.innerHTML = ".";
        sylTimerCursorLine.appendChild(curSpot);

        let tokSpot = document.createElement("td");
        tokSpot.innerText = tokObj.preview;
        sylTimerSylLine.appendChild(tokSpot);
    }
    sylTimerCursorLine.childNodes[currToken].innerHTML = "↓";
}

function sylTimingOnTick(e) {
    let time = player.currentTime; // what is e.timeStamp then??
    let curPlayLine = lines.findIndex(x => x.start <= time && x.end > time);
    if(curPlayLine != currLine) {
        if(sylTimingSpaceSts) {
            sylTimingSpacePress(false); // force release spacebar due to line end
        }

        currLine = curPlayLine;
        currToken = 0;
        sylTimingDrawLine();
    }

    let nxtLineIdx = lines.findIndex(x => x.start > time && x.end > time);
    if(nxtLineIdx == -1) {
        sylNextTimer.innerText = "--:--:--.---";
    } else {
        sylNextTimer.innerHTML = assFmtTimeMs((lines[nxtLineIdx].start - time) * 1000) + "(" + lines[nxtLineIdx].preview + ")";
    }
}