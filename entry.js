import express from "express";
import fs from "fs";
const app = express();
const port = 1337;

import bodyParser from "body-parser";
import cors from "cors";

import bcrypt from "bcrypt";


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

// Vi matar in tre block till kedjan, Kolla här med en if om det redan finns en kedja, skit då i detta.
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
    // Denna route printar kedjan inte databasen, för test
    res.send('<h1>Block och kedjor!</h1><div>'+JSON.stringify(MyChain, null, 6)+'</div>')
});

app.get('/chain', function(req, res, next) {
    // denna route printar kedjan från databasen
    fs.readFile("db.json", function(err, data){
      if (err) {
        console.log(err);
      }

      const chain = JSON.parse(data);

      let chainPrint = "<div>"
      for (let block in chain.chain) {
        chainPrint += "<div>" + chain.chain[block].data.sender + " -> " + chain.chain[block].data.reciver + "</div>"
      }
      chainPrint += "</div>"

      console.log("get all", chain.chain);
      res.send("<h1>Kedjan</h1>" + chainPrint);
    });
});

app.post('/add', function(req, res) {

    fs.readFile("db.json", function(err, data){
      if (err) {
        console.log(err);
  
        if (err.code == "ENOENT") {
          console.log("Filen finns inte!");
        }
  
        res.send("404 - Nått gick fel!")
      }
  
      const ledger = JSON.parse(data)
  
      //let newBlock = req.body;
      MyChain.addBlock(req.body);
      
      //ledger.posts.push(newBlock);
  
      fs.writeFile("db.json", JSON.stringify(MyChain, null, 6), function(err){
        if (err) {
          console.log(err);
        }
      })
  
      res.send(MyChain)
      
    });
  });

app.listen(port, () => {
    console.log(`Server live on localhost:${port}`)
});