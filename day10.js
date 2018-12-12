const fs = require('fs');

fs.readFile('./data10.txt', "utf8", (err, data) => {
  if (err) throw err;

  // DATA
  const inputArray = data.split('\r\n');
  console.log(inputArray);
  editedInputArray = editToInputArray(inputArray);
  console.log(editedInputArray);
  const positions = starPositions(editedInputArray, 16000);
  
  // TESTDATA - string length not equal with DATA
  // const inputArray = data.split('\r\n');
  // testArray = testToInputArray(inputArray);
  // const positions = starPositions(testArray, 4);
  // console.log(positions);

});

// count new positions in every round and let drawing method do the checking and drawing
const starPositions = (starData, rounds) => {  
  let i = 0;
  while (i < rounds) {
    for (let i = 0; i < starData.length; i++) {
      starData[i][0] += starData[i][2];
      starData[i][1] += starData[i][3];
    }
    drawSky(starData, 100, i);
    i++;
  }
  return starData;
}

// if map not too big it is outputted to 'screen' by console.log
const drawSky = (starData, maxDistance, i) => {
  const outerCoords = getOuterCoords(starData);
  const drawable = checkMaxDistance(outerCoords, maxDistance);
  if (!drawable)  {
    // console.log('not drawable');
    return;
  }
  console.log('PART TWO: Have been waiting for ', i + 1, ' seconds');
  for (y = outerCoords[2]; y <= outerCoords[3]; y++) {
    let row = '';
    for (x = outerCoords[0]; x <= outerCoords[1]; x++) {
      if (starExists(x,y, starData)) { // star in same place --> only one found, which seems ok here
        row += '#';
      } else {
        row += '.';
      }
    }
    console.log(row);
  }
} 

// check wheather max dist between coordinates x or coordinates y is below or over the limit
const checkMaxDistance = (outerCoords, maxDistance) => {
  if (Math.abs(outerCoords[0]-outerCoords[1]) < maxDistance && Math.abs(outerCoords[2]-outerCoords[3]) < maxDistance) {
    return true;
  } else {
    return false;
  }
}

// return true if there is a star in coordinate
const starExists = (x,y, starData) => {
  for (let i = 0; i < starData.length; i++) {
    if (starData[i][0] === x && starData[i][1] === y) {
      return true;
    }
  }
}

// count and return the size of map needed, returns outer bounds in coordinates
const getOuterCoords = (starData) => {
  // values of first row saved for comparison
  let minX = starData[0][0];
  let maxX = starData[0][0];
  let minY = starData[0][1];
  let maxY = starData[0][1];
  // loop all other rows and update mins and maxes
  for (let i = 1; i < starData.length; i++) {
    if (starData[i][0] < minX) {
      minX = starData[i][0];
    }
    if (starData[i][0] > maxX) {
      maxX = starData[i][0];
    }
    if (starData[i][1] < minY) {
      minY = starData[i][1];
    }
    if (starData[i][1] > maxY) {
      maxY = starData[i][1];
    }
  }
  return [minX, maxX, minY, maxY];
}

// DATA edits
const editToInputArray = (inputArray) => {
  let editedArray = inputArray.map((row) => row.substring(10, 25)  + row.substring(36,42)).map((row) => row.replace('>', ','));
  editedArray = editedArray.map( (row) => row.split(',') );
  editedArray = editedArray.map( (row) =>  [ Number(row[0]) ,  Number(row[1]) ,  Number(row[2]) ,  Number(row[3]) ] )
  return editedArray;
}

// TEST DAT edits
// const testToInputArray = (inputArray) => {
//   let editedArray = inputArray.map((row) => row.substring(10, 16)  + row.substring(27,34)).map((row) => row.replace('<', ','));
//   editedArray = editedArray.map( (row) => row.split(',') );
//   editedArray = editedArray.map( (row) =>  [ Number(row[0]) ,  Number(row[1]) ,  Number(row[2]) ,  Number(row[3]) ] )
//   return editedArray;
// }

