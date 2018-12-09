// Advent of Code - Day8 Part1 (Part1 commented)

const fs = require('fs');

fs.readFile('./data8.txt', "utf8", (err, data) => {
  if (err) throw err;

  const inputArray = data.split(' ');
  const numbersArray = inputArray.map(Number);
  let tree = makeTree(numbersArray);

  // let testdata = '2 3 0 3 10 11 12 1 1 0 1 99 2 1 1 2';
  // testdata = testdata.split(' ');
  // testdata = testdata.map(Number);
  // let tree = makeTree(testdata);

  // PART2
  // const metas = [];
  // const collectedMetadata = tree.collectMetadata(tree.root, metas);
  // console.log(collectedMetadata);
  // const sum = tree.sumMetadata(collectedMetadata);
  // console.log(sum);

  // PART2
  const rootValue = tree.getNodeValue(tree.root, 0);
  console.log(rootValue);

});

const makeTree = (data) => {
  const tree = new Tree(data);
  return tree;
}

class Node {
  constructor(cCount, mCount) {
    this.cCount = cCount;
    this.mCount = mCount;
    this.ch = [];
    this.meta = null;
  }
  insertChild(cCount, mCount) {
    const newNode = new Node(cCount, mCount);
    this.ch.push(newNode);
    return newNode;
  }
}

class Tree {
  constructor(data){
    this.datalength = data.length;
    this.root = null;
    this.i = 0;
    this.data = data;
    this.insertChild(this.i, null);
  }


  getNodeValue(node, sum) {
    debugger;
    if (!node.ch.length) { // no children to check
      return this.getMetaSum(node); // return metasum added to previous sum
    } else {
      // check the children // added to sum only if child marked by parent node's metadata
      for (let i = 0; i < node.meta.length; i++) {  // check one metadata value at a time
        if ( node.ch[ node.meta[i] - 1] ) { // if node child exists..
          sum += this.getNodeValue(node.ch[node.meta[i] - 1], 0);
        } 
      }
      return sum;
    }
  }

  // fill the three
  insertChild(i, node) {
    let newNode;
    if (this.i + 1 > this.datalength) {
      return; 
    }
    if (node === null) { // first one --> root
      newNode = new Node(this.data[i], this.data[i+1]); this.i += 2;
      this.root = newNode;
      this.insertChild(i, newNode); 
    } else {
      while (node.cCount > 0) {  // recursive: luodaan uusi lapsi kunnes loppuu
        node.cCount--;
        newNode = node.insertChild(this.data[this.i], this.data[this.i+1]); this.i += 2; 
        this.insertChild(i, newNode);
      }
      // jos nodella lapsia 0, metadata haetaan ja asetetaan ja päivitetään i
      
      node.meta = this.data.slice(this.i,this.i+node.mCount); 
      this.i += node.mCount;
    } 
  }

    getMetaSum(node) {
    let sum = 0;
    for (let i = 0; i < node.meta.length; i++) {
      sum += node.meta[i];
    }
    return sum;
  }

  ////// PART ONE:
  // collectMetadata(node, metas) {
  //   if (node.ch === null) {
  //     return metas;
  //   }
  //   metas.push(node.meta);
  //   for (let i = 0; i < node.ch.length; i++) {
  //     this.collectMetadata(node.ch[i], metas);
  //   }
  //   return metas;
  // }

  // sumMetadata(collectedMetadata) { // arrays in array
  //   let sum = 0;
  //   for (let i = 0; i < collectedMetadata.length; i++) {
  //     for (let j = 0; j < collectedMetadata[i].length; j++) { 
  //       sum += collectedMetadata[i][j];
  //     }
  //   }
  //   return sum;
  // }
}








