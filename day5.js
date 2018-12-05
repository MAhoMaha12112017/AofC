const fs = require('fs')

fs.readFile('./data5.txt', "utf8", (err, data) => {
  if (err) throw err;
  let raw = data;
  // raw = 'dabAcCaCBAcCcaDA'
  
  polymer = createPolymer(raw).join('');
  console.log('P1 - units: ', polymer.length);

  const shortersPolymer = shortestEditedPolymer(raw);
  console.log('P2 - shortest reduced polymer: ', shortersPolymer);

});

const shortestEditedPolymer = (raw, unit) => {
  const allCase = 'abcdefghijklmnopqrstuvwxyz';
  // loop removes different letters in each round...
  // and sends the result for a polymer creator.
  // length of returned polymer will be measured and compared to the shortest at the moment
  let minLengt = raw.length;
  for (let i = 0; i < allCase.length; i++) {
    let reducedUnits = removeUnits(raw, allCase[i]);
    let reducedPolymer = createPolymer(reducedUnits);
    if (reducedPolymer.length < minLengt) {
      minLengt = reducedPolymer.length;
    }
  }
  return minLengt;
}

// returns string, letter given as a parameter filtered, both caps
const removeUnits = (raw, unit) => {
  const unitArray = [];
  for (i = 0; i < raw.length; i++) {
    if (!(raw[i].toLowerCase() === unit.toLowerCase())) {
      unitArray.push(raw[i]);
    }
  }
  return unitArray.join('');
}

const createPolymer = (raw) => {
  let polymer = []; // array to collect polymer units
  polymer.push(raw[0]); // start with first unit from input
  // loop whole input string, starting from the second candidate
  let lengthOfRaw = raw.length;
  for (i = 1; i < lengthOfRaw; i++) {
    // if polymer empty, just add
    if (polymer.length === 0) {
      polymer.push(raw[i]);
    // check candidate with the last one
    } else if (sameButOpposite(polymer[polymer.length - 1], raw[i])) {
      polymer.pop(); // candidate not added <--> explosion
    } else {
      polymer.push(raw[i]); // candidate added
    }
  }
  return polymer;
}

const sameButOpposite = (a,b) => {
  if ((a.toLowerCase() === b.toLowerCase()) && (a !== b)) { 
    return true;
  }
  return false;
}

