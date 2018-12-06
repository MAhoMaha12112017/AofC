const fs = require('fs')

const testData = 
"1, 1\r\n1, 6\r\n8, 3\r\n3, 4\r\n5, 5\r\n8, 9";

fs.readFile('./data6.txt', "utf8", (err, data) => {
  if (err) throw err;
 
  // data = testData;
  let points = data.split('\r\n').map((row) => row.split(', '));  
  points = editArray(points);
  // console.log('points ', points);

  areaCoords = getPossibleArea(points);
  // console.log('areaCoords ', areaCoords);
  
  const areaData = getAreaData(areaCoords, points);
  // console.log('areaData ', areaData);

  const finiteAreas = getFiniteAreaSizes(areaData, points, areaCoords);
  console.log('Part one: ', finiteAreas);

  // PART TWO //
  partTwo(10000, areaCoords, points);

});

// PART TWO //
const partTwo = (limit, areaCoords, points) => {
  const possibleDistance = Math.ceil(limit / points.length);
  let count = 0;
  for (let i = areaCoords.minY-possibleDistance; i <= areaCoords.maxY+possibleDistance; i++) { // y!
    for (let j = areaCoords.minX-possibleDistance; j <= areaCoords.maxX+possibleDistance; j++) { // x!
      // count manhattans to all points
      let manhattansum = 0;
      for (let p = 0; p < points.length; p++) {
        let man = getManhattan(j, i, points[p][0], points[p][1]);
        // console.log(i, ' ', j, ' ', man);
        manhattansum += man;
        if (manhattansum >= limit) {
          continue;
        }
      }
      if (manhattansum < limit) {
        count++;
      }
    }
  }
  console.log('Part one count: ', count);
}
  

// get sizes of finite areas (later: the biggest one?)
const getFiniteAreaSizes = (areaData, points, areaCoords) => {
  // loop by point
  // console.log(areaCoords);
  // console.log(points)
  let maxWidth = 0;
  for (let i = 0; i < points.length; i++) {
    // if in the border --> infinite
    if (borderCoordinate(areaCoords, points[i])) {
      // console.log(points[i], ' rajalla');
    } else { 
      stock = countFriends(points[i], areaData, areaCoords);
      // console.log('getFiniteAreaSizes, point ', points[i], 'stock' , stock);
      let width = Object.keys(stock).length
      if (width > maxWidth) {
        maxWidth = width;
      }
      stock = {};
    }
  }
  return maxWidth;
}

const borderCoordinate = (areaCoords, point) => {
  if (point[0] === areaCoords.minX || point[0] === areaCoords.maxX || point[1] === areaCoords.minY || point[1] === areaCoords.maxY) {
    return true;
  }
  return false;
}

let stock = {};

const countFriends = (point, areaData, areaCoords) => {
  // jos sama point naapurina --> lisätään varastoon
  // paitsi, jos on rajalla, jolloin varasto tyhjäksi ja return
  // kukin match-naapuri tutkittava samalla tavalla
  // lopulta jos naapuri ei löydä uusia naapureita se palautuu
  // kaikki tallentavat samaan tauluun, joka palautuu lopuksi ja josta lasketaan alueen koko 
  // const stock = {};
  if (borderCoordinate(areaCoords, point)) {
    // console.log('borderi')
    return null;
  }
  // loop all neighbours of point
  for (let i = point[1] - 1; i <= point[1] + 1; i++) { // y!
    for (let j = point[0] - 1; j <= point[0] + 1; j++) { // x!
      if (i === point[1] && j === point[0]) { // point itself
        // console.log('itse piste ', j, ' ', i);
      } else {
        // console.log(j, ' ', i, ' ');
        // check if same closest: point <--> areaData
        if (checkEquality([j,i], point, areaData)) {
          const id = j + ' ' + i;
          // if not in stock, added and continued the search
          if (!stock[id]) {
            stock[id] = 1;
            // console.log('stock' , stock)
            countFriends([j,i], areaData, areaCoords)
          }
        }
      }
    }
  }
  return stock;
}

const checkEquality = (friend, point, areaData) => {

  const valueForPoint = getClosestForCoord(point, areaData);
  const valueForFriend = getClosestForCoord(friend, areaData);
  if (valueForFriend === valueForPoint) {
    return true;
  }
  return false;
}

// get and return value of closest 
const getClosestForCoord = (point, areaData) => {
  const id = point[0] + ' ' + point[1];
  // console.log('ididid ', id);
  // console.log('areaData[id].manhattanPoint ', areaData[id].manhattanPoint);
  return areaData[id].manhattanPoint;
}

// get all area with data about closest points
const getAreaData = (areaCoords, points) => {
  // object to be returned
  const areaData = {};

  // loop whole area, one point at the time
  for (let i = areaCoords.minY; i <= areaCoords.maxY; i++) { // y!
    for (let j = areaCoords.minX; j <= areaCoords.maxX; j++) { // x!
      let closestPoint = getClosestPoint(j,i,points);
      id = j + ' ' + i;
      areaData[id] = closestPoint;
    }
  } 
  return areaData;
}

// get the closest point for a particular coordinate x,y
const getClosestPoint = (x,y,points) => {
  let minManhattan = getManhattan(x, y, points[0][0], points[0][1]);
  let manhattanPoint = points[0];

  for (let i = 1; i < points.length; i++) { 
    let currentMan = getManhattan(x, y, points[i][0], points[i][1]);
    if (currentMan === minManhattan) {
      manhattanPoint = null;
    }
    else if (currentMan < minManhattan) {
      manhattanPoint = points[i];
      minManhattan = currentMan;
    } 
  }
  return {
    manhattanPoint,
    coords: [x,y]
  }
}

const editArray = (points) => {
  return points.map((row) => row = [Number(row[0]), Number(row[1])] );
}

// func counts and returns area so that all points are inside of it or in the border
getPossibleArea = (coordsArray) => { 
  // starting from the first one
  let i = 0;
  let minX = coordsArray[i][0];
  let maxX = coordsArray[i][0];
  let minY = coordsArray[i][1];
  let maxY = coordsArray[i][1];
  // loop the input coords
  const length = coordsArray.length; 
  for (i = 1; i < length; i++) {
    const x = coordsArray[i][0];
    const y = coordsArray[i][1];
    if (x < minX) {
      minX = x;
    }
    if (x > maxX) {
      maxX = x;
    }
    if (y < minY) {
      minY = y;
    }
    if (y > maxY) {
      maxY = y;
    }
  }
  // return the area as corner points
  return {
    minX,
    maxX,
    minY,
    maxY
  }
}

const getManhattan = (x1, y1, x2, y2) => {
  return Math.abs(x2-x1) + Math.abs(y2-y1);
}
