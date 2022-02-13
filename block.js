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

export default Block;