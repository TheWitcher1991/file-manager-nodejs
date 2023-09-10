const path = require('path')

module.exports = {
    Files: require(path.join(__dirname, '/class/Files')),

    rpath: {
        db: '../db/db.json',
        config: '../db/config.json'
    },

    files_: [],

    tmpf: {},

    rkey: i => {
        let rnd = ''
        while (rnd.length < i)
            rnd += Math.random().toString(36).substring(2)
        return rnd.substring(0, i)
    },

    get db () {
        return require(path.join(__dirname, this.rpath.db))
    },

    get config () {
        return require(path.join(__dirname, this.rpath.config))
    },

    get size () {
        return Object.keys(this.db).length
    },

    _fs: '',
}