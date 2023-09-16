module.exports = {
    Files: require('./class/Files'),

    rpath: {
        db: '../../../dist/db/db.json',
        config: '../../../dist/db/config.json'
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
        return require('../../../dist/db/db.json')
    },

    get config () {
        return require('../../../dist/db/db.json')
    },

    get size () {
        return Object.keys(this.db).length
    },

    _fs: '',
}