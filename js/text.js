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
                            preview: x.replaceAll(/.\|(.)|(.)/g, "$1$2").replaceAll('#','')
                        })),
            start: 0,
            end: 0,
        };

        lines.push(lineObj);
    }
}