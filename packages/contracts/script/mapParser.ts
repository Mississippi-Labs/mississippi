import fs from 'fs';
import { ethers } from "ethers";

const formatCsvToArray = (csv: string) => {
    const lines = csv.split('\n');
    const result = [];
    lines.forEach((str) => {
        const line = str.trim();
        if (line.match(/^\d/)) {
        const tempLine = line.split(',');
        tempLine.pop();
        tempLine.shift();
        const numbers = tempLine.map(str => Number(str))
        result.push(numbers);
        }
    });
    return result;
}
  
const loadMapData = async () => {
    const content = fs.readFileSync('./../../client/src/assets/map.csv', 'utf-8');
    return formatCsvToArray(content);
}

async function main() { 
    let result = await loadMapData();
    const array = [];
    let index = 0;
    let num = ethers.BigNumber.from(0);

    for(let i = 0; i < result.length; i++) {
        let row = result[i];
        for(let j = 0; j < row.length; j++) {
            let val = row[j]%100;
            row[j] = val;
        
            if (index >= 256) {
                array.push(ethers.BigNumber.from(num));
                index = 0;
                num = ethers.BigNumber.from(0);
            }

            
            if (val == 1) {
                const mask = ethers.BigNumber.from(1).shl(index); 
                num = num.or(mask);
            } 

            index++;
        }
    }

    if (index == 256) {
        // console.log(" num: ", num.toHexString());
        array.push(num);
    }

    for(let i = 0; i < array.length; i++) {
        console.log("array: ", array[i].toHexString());
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });

