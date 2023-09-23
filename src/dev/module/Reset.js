const path = require('path')

const { Files } = require(path.join(__dirname, '/config'))
let $ = require(path.join(__dirname, '/config'))

module.exports = async function () {
    $._fs = new Files($.db, '.file__tbody')

    if ($.config.ReadSubfolders === 1) {
        document.querySelector('#global__change').setAttribute('checked', 'true')
        document.querySelector('#global__change').checked = true
        $._fs.setReadSubfolders(1)
    } else {
        document.querySelector('#global__change').removeAttribute('checked')
        document.querySelector('#global__change').checked = false
        $._fs.setReadSubfolders(0)
    }

    document.querySelector('.loader').style.display = 'none'

    $._fs.startPreset($.config.ActivePreset)
    await $._fs.loadFiles()
    $._fs.setTheme($.config.theme)
    $._fs.setLang($.config.lang)
}
