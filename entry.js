import express from "express";
import fs from "fs";
const app = express();
const port = 1337;

import bodyParser from "body-parser";
import cors from "cors";

import BlockChain from "./chain.js";

// Vi skapar vår blockkedja
const MyChain = new BlockChain();

// Vi matar in tre block till kedjan, Kolla här med en if om det redan finns en kedja, skit då i detta.
//MyChain.addBlock({sender: "Janne", reciver: "Kalle", amount: 234});
//MyChain.addBlock({sender: "Pelle", reciver: "Anna", amount: 1234});
//MyChain.addBlock({sender: "Herbert", reciver: "Bengt", amount: 54});

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