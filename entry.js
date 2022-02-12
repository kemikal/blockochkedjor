const express = require('express');
const app = express();
const port = 1337;

const bcrypt = require("bcrypt")

// Klass för vårat "block" i blockkedjan
class Block{
    constructor(blockId, previousHash, data) {
        this.blockId = blockId;
        this.timestamp = Date.now();
        this.blockHash = this.getHash();
        this.prevHash = previousHash;
        this.data = data;
    }
    // Vi krypterar blocket
    getHash() {
        return bcrypt.hashSync(String(this.blockId + this.timestamp + this.blockHash + this.previousHash + JSON.stringify(this.data)), 10)
    };
}

// Klass för blockkedjan
class BlockChain{
    constructor() {
        this.chain = [];
    }

    // Metod för att lägga till ett block till kedjan.
    addBlock(data) {
        let blockId = this.chain.length;
        let previousHash = this.chain.length !== 0 ? this.chain[this.chain.length - 1].blockHash : "";
        let block = new Block(blockId, previousHash, data);

        this.chain.push(block);
    }
}

// Vi skapar vår blockkedja
const MyChain = new BlockChain();

// Vi matar in tre block till kedjan
MyChain.addBlock({sender: "Janne", reciver: "Kalle", amount: 234});
MyChain.addBlock({sender: "Pelle", reciver: "Anna", amount: 1234});
MyChain.addBlock({sender: "Herbert", reciver: "Bengt", amount: 54});

// Logga ut kedjan
console.log(JSON.stringify(MyChain, null, 6))

app.get('/', (req, res) => {
    res.send('<h1>Blocks and chains!</h1><div>'+JSON.stringify(MyChain, null, 6)+'</div>')
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});