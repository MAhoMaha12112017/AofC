// ADVENT OF CODE 2018 - DAY13. Part1. 

const fs = require('fs');

fs.readFile('./data13.txt', "utf-8", (err, data) => {
  if (err) throw err;

  const roadArray = data.split('\r\n'); // console.log(roadArray); // console.log(data);
  console.log(roadArray);

  const tickCount = playGame(roadArray); // start simulation, array's rows will be rows in map - y-coords
  console.log(tickCount);
})

const playGame = (gameMap) => {
  // create map
  const map = new Map(gameMap);
  // add carts in method
  map.getCartsFromMap(); 
  // console.log(map.carts);
  map.sortCarts();
  map.drawMap(); 
  // tick at a time
  for (let tick = 0; tick < 222; tick++) {
    map.sortCarts();
    // console.log(tick, ' ennen movea ', map.carts)
    // move carts
    for (let i = 0; i < map.carts.length; i++) {
      let result = map.move(map.carts[i]);
      // added 20.1
      if (result) {
        console.log('tikissä, result', result);
        return result;
      }
    }
    // draw new map
    map.drawMap();
  }
}

class Map {
  constructor(mapData) {
    this.map = mapData; // to be drawn
    this.originalMap = [...mapData]; // is this ok? // to be copied - no carts
    this.carts = [];
  }
  // before first move -> //////////
  getCartsFromMap() { // loops rows of map to find carts - done once only
    // also edits the map - updates data under the carts
    // edits should be done only to map to be drawn only once
    for (let j = 0; j < this.map.length; j++) { // y
      for (let i = 0; i < this.map[j].length; i++) { // x
        if (this.map[j].charAt(i) === '>') {
          this.updateMapUnderCart(i,j, this.originalMap);
          this.addCart('>', [i, j]);
        } else if (this.map[j].charAt(i) === '<') { 
          this.addCart('<', [i, j]);
          this.updateMapUnderCart(i,j, this.originalMap);
        } else if (this.map[j].charAt(i) === '^') {
          this.addCart('^', [i, j]);
          this.updateMapUnderCart(i,j, this.originalMap);
        } else if (this.map[j].charAt(i) === 'v') {
          this.addCart('v', [i, j]);
          this.updateMapUnderCart(i,j, this.originalMap);
        } 
      }
    }
  }
  updateMapUnderCart(x,y,map) { // replace carts with roads in map data (used for original map)
    if (map[y].charAt(x) === '>' || map[y].charAt(x) === '<') {
      map[y] = map[y].substring(0,x) + '-' + map[y].substring(x+1);
    } else if (map[y].charAt(x) === 'v' || map[y].charAt(x) === '^') {
      map[y] = map[y].substring(0,x) + '|' + map[y].substring(x+1);
    }
  }
  // <-- before first move //////////

  addCart(direction, location) { // creates a cart and adds it to array
    const newCart = new Cart(direction, location);
    this.carts.push(newCart);
  }
  move(cart) { 
    const possibleDirection = this.getDirectionToGo(cart);
    cart.editLocation(possibleDirection);
    // new check - check if carts with same coordinates
    const same = this.checkSameCoords();
    if (same !== null) {
      console.log('same same but different ', same);
      return same;
    }
    // console.log(possibleDirection);
    // console.log('location before ', cart.location);
    // console.log('location after ', cart.location);
    return false;  // returns coords if collision happened, false otherwise
  }
  checkSameCoords() {
    for (let i = 0; i < this.carts.length - 1; i++) {
      for (let j = i+1; j < this.carts.length; j++) {
        if (this.carts[i].location[0] === this.carts[j].location[0] && this.carts[i].location[1] === this.carts[j].location[1] ) {
          return this.carts[i].location;
        }
      }
    }
    return null;
  }
  getDirectionToGo(cart) { // gives direction based to: cart's position, direction
  // returns [x,y] -value of possible move
    const locationData = this.getLocationData(cart.location[0],cart.location[1]);
    if (locationData === '/') {
      switch (cart.direction) {
        case 'v':
        cart.updateDirection('<')
          return [-1,0];
        case '<':
        cart.updateDirection('v')
          return  [0,1];
        case '>':
          cart.updateDirection('^')
          return  [0,-1];
        case '^':
          cart.updateDirection('>')
          return  [1,0];
      }
    } else if (locationData === '\\' || locationData === '\\\\') {  // edited 20.1
      switch (cart.direction) {
        case 'v':
          cart.updateDirection('>')
          return  [1,0];
        case '<':
          cart.updateDirection('^')
          return  [0,-1];
        case '>':
          cart.updateDirection('v')
          return  [0,1];
        case '^':
          cart.updateDirection('<')
          return  [-1,0];
      }
    } else if (locationData === '+') { // next turn must also be updated
      switch (cart.turns) {
        case 'L':
          if (cart.direction === '^') {
            cart.updateTurns();
            cart.updateDirection('<')
            return  [-1,0];
          } else if (cart.direction === 'v') {
            cart.updateTurns();
            cart.updateDirection('>')
            return  [1,0];
          } else if (cart.direction === '<') {
            cart.updateTurns();
            cart.updateDirection('v')
            return  [0,1];
          } else if (cart.direction === '>') {
            cart.updateTurns();
            cart.updateDirection('^')
            return  [0,-1];
          }
        case 'R':
        if (cart.direction === '^') {
          cart.updateTurns();
          cart.updateDirection('>')
          return  [1,0];
        } else if (cart.direction === 'v') {
          cart.updateTurns();
          cart.updateDirection('<')
          return  [-1,0];
        } else if (cart.direction === '<') {
          cart.updateTurns();
          cart.updateDirection('^')
          return  [0,-1];
        } else if (cart.direction === '>') {
          cart.updateTurns();
          cart.updateDirection('v')
          return  [0,1];
        }
        case 'S':
          if (cart.direction === '^') {
            cart.updateTurns();
            return [0,-1];
            break;
          } else if (cart.direction === 'v') {
            cart.updateTurns();
            return [0,1];
            break;
          } else if (cart.direction === '>') {
            cart.updateTurns();
            return [1,0];
            break;
          } else if (cart.direction === '<') {
            cart.updateTurns();
            return [-1,0];
            break;
          } 
      }
    } else if (locationData === '|') {
      switch (cart.direction) {
        case 'v':
          return  [0,1];
          break;
        case '^':
          return  [0,-1];
          break;
      }
    } else if (locationData === '-') {
      switch (cart.direction) {
        case '<':
          return  [-1,0];
          break;
        case '>':
          return  [1,0];
          break;
      }
    }
  }  
  getLocationData(x,y) { // returns map cells info
    return this.map[y].charAt(x); 
  }
  drawMap() { // draw map with carts
    this.addCartsToMapData();
    for (let i = 0; i < this.map.length; i++) { // draw map
      // console.log(this.map[i]);
    }
    // restore map data under the carts
    this.map = [...this.originalMap];
  }
  addCartsToMapData() { // edit map cells with a cart data - to map, not original
    for (let i = 0; i < this.carts.length; i++) {
      const x = this.carts[i].location[0];
      const y = this.carts[i].location[1];
      this.map[y] = this.map[y].substring(0,x) + this.carts[i].direction + this.map[y].substring(x+1);
    }
  }
  sortCarts() { // sorts all carts by comparing coords --> sort in place
    if (this.carts.length <= 0) {return null};
    this.carts.sort((a,b) => {
      if (a.location[1] !== b.location[1]) {
        return a.location[1] - b.location[1];
      } else {
        return a.location[0] - b.location[0];
      }
    })
  }
  collision(possibleDirection, cart) {
    // check for collision
    const targetX = cart.location[0] + possibleDirection[0];
    const targetY = cart.location[1] + possibleDirection[1];
    for (let i = 0; i < this.carts.length; i++) {
      if (this.carts[i].location[0] === targetX && this.carts[i].location[1] === targetY) {
        debugger;
        return [targetX, targetY];
      }
    }
    return false;
  }
}

class Cart {
  constructor(direction, location) {
    this.direction = direction;
    this.location = location;
    this.turns = 'L' 
  }
  editLocation([x,y]) { // edit location, no drawing here
    this.location[0] += x;
    this.location[1] += y;
  }
  updateTurns() {
    switch(this.turns) {
      case 'L':
        this.turns = 'S';
        break;
      case 'S':
        this.turns = 'R';
        break;
      case 'R':
        this.turns = 'L';
        break;
    }
  }
  updateDirection(direction) {
    this.direction = direction;
  }
}