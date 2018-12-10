// Advent of code 2018 - Day9 - Part2 (also Part1 is in order here)

class Game {
  constructor(numberOfMarbles, numberOfPlayers) {
    // marble 0 added here, other's in playMarbles
    const newMarble = new Marble(0);
    newMarble.next = newMarble;
    newMarble.prev = newMarble;
    this.currentMarble = newMarble;
    this.playerTable = Array(numberOfPlayers + 1).fill(0); // no need to fill? first index not used
    this.numberOfPlayers = numberOfPlayers; 
    this.numberOfMarbles = 1; 
    this.playMarbles(numberOfMarbles);
  }
  placeMarble(value) {
    // creates and adds a new marble between the marbles 
    // 1 and 2 marbles clockwise of the current marble
    const newMarble = new Marble(value);
    newMarble.next = this.currentMarble.next.next; // before 2 marbles from current
    newMarble.prev = this.currentMarble.next;
    this.currentMarble.next.next.prev = newMarble;
    this.currentMarble.next.next = newMarble; // after 1 marble from current
    this.currentMarble = newMarble;
    this.numberOfMarbles++;
  }
  playMarbles(lastMarble) {
    // marbles added
    for (let i = 1; i <= lastMarble; i++) {
      // i is value of marble tried to be added here, already i marbles 0..22, 
      if (i%23 === 0) { 
        // if the value of marble that is about to be placed has a number that is a multiple of 23..
        // the current player keeps the marble they would have placed, adding it to their score
        // the marble 7 marbles counter-clockwise from the current marble is removed from the circle 
        // and added to the current player's score
        // marble located immediately clockwise of the marble that was removed becomes the new current marble
        let marbleToDie = this.currentMarble.prev.prev.prev.prev.prev.prev.prev; 
        let beforeMarbleToDie = marbleToDie.prev;
        let afterMarbleToDie = marbleToDie.next;
        
        let points = marbleToDie.value + i;
        beforeMarbleToDie.next = afterMarbleToDie;
        afterMarbleToDie.prev = beforeMarbleToDie;
        this.currentMarble = afterMarbleToDie;
        // add points to player
        this.addPoints(points, (i-1)%this.numberOfPlayers + 1); 
        // marble not added but one removed
        this.numberOfMarbles--;
      } else {
        // place marble in ordinary fashion
        this.placeMarble(i);
      }
    }
  }
  addPoints(points, playernumber) {
    this.playerTable[playernumber] += points;
  }
}

class Marble {
  constructor(value) {
    this.value = value;
    this.next = null;
    this.prev;
  }
}

const marbleGame = new Game(7103500, 479); // 1st param: last marble is worth, 2nd param: players
const table = marbleGame.playerTable;
let max = 0;
for (let i = 1; i < table.length; i++) {
  if (table[i] > max) {
    max = table[i];
  }
}
console.log("the winning Elf's score: " , max);
