const bcrypt = require("bcryptjs")
class Hash {
    /**
     * @readonly
     * @type {string}
     */
    hash

    /**
     * Creates a hash object from the hash string.
     * @param {string} hash The hash.
     */
    constructor(hash) {
        this.hash = hash
    }

    /**
     * Hashes a string.
     * @param {string} value The string to hash.
     * @param {{ rounds?: number, salt?: string | number }} options Options for hashing.
     * @returns {Promise<Hash>}
     * @static
     */
    static async hash(value, { rounds = 10, salt } = {}) {
        salt ??= await bcrypt.genSalt(rounds)
        return new this(await bcrypt.hash(value, salt))
    }

    /**
     * Checks if another value hashes to this hash.
     * @param {string} value The value to check against.
     */
    async compare(value) {
        return bcrypt.compare(value, this.hash)
    }

    get rounds() {
        return bcrypt.getRounds(this.hash)
    }
    get salt() {
        return bcrypt.getSalt(this.hash)
    }

    static genSalt = bcrypt.genSalt
}

module.exports = Hash