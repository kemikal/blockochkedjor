import Block from "./block.js";

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

export default BlockChain;

