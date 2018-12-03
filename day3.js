const fs = require('fs');

fs.readFile('./data3.txt', "utf8", (err, data) => {
  if (err) throw err;
  
  const inputArray = data.split('\r\n');

  const result = commonClaims(inputArray);
  console.log(result);
  
});

function commonClaims(array) {
  // creates 1001*1001 fabric (array containing arrays)
  const fabricLength = 1001;
  const fabric = Array(fabricLength).fill(2).map(x => Array(fabricLength).fill(2))

  // loops elves and fills fabric data based to elves array
  fillFabricData(fabric, array);
    
  // loop fabric. count values <= 0
  const commonClaims = overLappingClaims(fabric, fabricLength);
  // check elv with no overlapping
  const elvData = checkFabricDataForNoOverLaps(fabric, array);

  return [commonClaims, elvData];
}

function overLappingClaims(fabric, fabricLength) {
  let commonClaims = 0;
  for(let i = 0; i < fabricLength; i++) {
    for(let j = 0; j < fabricLength; j++) {
      if (fabric[i][j] <= 0) {
        commonClaims++;
      }
    }
  }
  return commonClaims;
}

function fillFabricData(fabric, array) {
  const length = array.length;
  for(let i = 0; i < length; i++) {
    // change fabric data
    const coordinates = getCoordinates(array[i]);
    for(let x = coordinates[0]; x <= coordinates[2]; x++) {
      for(let y = coordinates[1]; y <= coordinates[3]; y++) {
        fabric[x][y]--;
      }
    }
  }
}

function getCoordinates(dataString) {
  let data = dataString.split('@ ');
  data = data[1].split(': ');
  let startCoordinates = data[0].split(',');
  let claimArea = data[1].split('x');
  let xEndCoord = Number(startCoordinates[0]) + Number(claimArea[0] - 1);
  let yEndCoord = Number(startCoordinates[1]) + Number(claimArea[1] - 1);
  return [Number(startCoordinates[0]), Number(startCoordinates[1]), xEndCoord, yEndCoord]; // returns xS, yS, xE, yE
}

function checkFabricDataForNoOverLaps(fabric, array) {
  const arrayL = array.length;
  // loop elves to find one with no overlapping (no coords < 1)
  for(let i = 0; i < arrayL; i++) { // next elv
    let allok = true;
    const coordinates = getCoordinates(array[i]);
    for(let x = coordinates[0]; x <= coordinates[2]; x++) { // x coords
      for(let y = coordinates[1]; y <= coordinates[3]; y++) { // y coords
        // check corresponding fabric value for overlapping
        if (fabric[x][y] !== 1) {
          // overlap, should be continued from next elv
          allok = false;
          break;
        }
      } 
    }
    // if here, all coords ok
    if (allok === true) {
      return array[i];
    } 
  }
}


