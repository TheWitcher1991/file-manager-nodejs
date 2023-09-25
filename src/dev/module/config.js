const path = require('path')

module.exports = {
    Files: require(path.join(__dirname, '/class/Files')),

    rpath: {
        db: '../db/db.json',
        config: '../db/config.json',
        launchDB: 'db/db.json',
        launchConfig: 'db/config.json',
        log: 'log.dev.txt',
    },

    files_: [],

    all: [],

    tmpf: {},

    rkey: i => {
        let rnd = ''
        while (rnd.length < i) rnd += Math.random().toString(36).substring(2)
        return rnd.substring(0, i)
    },

    get db () {
        try {
            return require(path.join(__dirname, this.rpath.db))
        } catch (e) {
            return undefined
        }
    },

    get config () {
        try {
            return require(path.join(__dirname, this.rpath.config))
        } catch (e) {
            return undefined
        }
    },

    get size () {
        return Object.keys(this.db).length
    },

    _fs: ''
}
