// https://stackoverflow.com/a/19961519/565185
HTMLTextAreaElement.prototype.insertAtCaret = function (text) {
    text = text || '';
    if (document.selection) {
      // IE
      this.focus();
      var sel = document.selection.createRange();
      sel.text = text;
    } else if (this.selectionStart || this.selectionStart === 0) {
      // Others
      var startPos = this.selectionStart;
      var endPos = this.selectionEnd;
      this.value = this.value.substring(0, startPos) +
        text +
        this.value.substring(endPos, this.value.length);
      this.selectionStart = startPos + text.length;
      this.selectionEnd = startPos + text.length;
    } else {
      this.value += text;
    }
  };

var lines = [];
var currLine = -1;

function parseLines() {
    lines = [];

    let inLines = lyricInput.value
        .split('\n')
        .map(x => x.trim())
        .filter(x => x.length > 0);

    for(let txtLine of inLines) {
        let lineObj = {
            raw: txtLine,
            preview: txtLine.replaceAll(/(.)\|./g, "$1").replaceAll('#',''),
            tokens: txtLine.match(/(.\|.|[^a-zA-Z0-9]|\w+)/g)
                        .map(x => x.trim())
                        .filter(x => x.length > 0)
                        .map(x => ({ 
                            start: 0,
                            end: 0,
                            text: x,
                            preview: x.replaceAll(/.\|(.)|(.)/g, "$1$2").replaceAll('#',''),
                            isFuriSeqContinuation: x.startsWith('#|')
                        })),
            start: 0,
            end: 0,
        };

        lines.push(lineObj);
    }
}

var lastShiftTs = undefined;

function textKeyDown(e) {
    if(e.key == 'Shift') {
        let now = new Date();
        if(!lastShiftTs || (now - lastShiftTs) > 1500) {
            lastShiftTs = now;
        } else {
            let furi = prompt('Furigana input?');
            if(!furi) return;
            var first = true;
            for(let char of furi) {
                if(first) first = false;
                else lyricInput.insertAtCaret('#');

                lyricInput.insertAtCaret('|');
                lyricInput.insertAtCaret(char);
            }
        }
    }
}