import express from "express"
const app = express();
const port = 1337;

import bodyParser from "body-parser";
import cors from "cors";

import bcrypt from "bcrypt";

// lowdb
import { join, dirname } from 'path';
import { Low, JSONFile } from 'lowdb';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Use JSON file for storage
const file = join(__dirname, 'db.json')
const adapter = new JSONFile(file)
const db = new Low(adapter)

// Read data from JSON file, this will set db.data content
await db.read()

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

app.use(cors());
// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('<h1>Block och kedjor!</h1><div>'+JSON.stringify(MyChain, null, 6)+'</div>')
});

app.post("/addblock", (req,res) => {
    const block = req.body;

    res.send("")
});

app.listen(port, () => {
    console.log(`Server live on localhost:${port}`)
});