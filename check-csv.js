const fs = require('fs');
const readline = require('readline');

async function checkCSV() {
    const fileStream = fs.createReadStream('INVINCOM.csv');
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    let lineCount = 0;
    for await (const line of rl) {
        lineCount++;
        if (line.includes('0.7')) {
            console.log(`Line ${lineCount}: ${line}`);
        }
    }
}

checkCSV();
