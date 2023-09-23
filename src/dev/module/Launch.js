const path = require('path')
const fs = require('fs')

const { Files, config, rpath } = require(path.join(__dirname, '/config'))
const $ = require(path.join(__dirname, '/config'))

module.exports = function () {
    document.querySelector('.gload__from-pop').style.display = 'none'
    document.querySelector('.gload__from-container').style.display = 'none'

    document.querySelector('.path__from-pop').style.display = 'flex'
    document.querySelector('.path__from-container').style.display = 'block'

    document.querySelector('.bth__path-save').addEventListener('click', async function () {
        const pathFrom = document.querySelector('#path-from')
        const pathTo = document.querySelector('#path-to')

        if (pathFrom.value.replace(/\s/g, '') !== '' || pathTo.value.replace(/\s/g, '') !== '') {
            const tmp = new Map([
                ['start', {
                    name: 'Базовый',
                    pathFrom: pathFrom.value.trim(),
                    pathTo: pathTo.value.trim(),
                    typeFiles: '',
                    sizeFiles: '',
                    wordLeft: '',
                    wordRight: '',
                    changed: '',
                    remember: []
                }]
            ])

            $.db.length = 0

            $.db.push(Object.fromEntries(tmp))

            fs.writeFileSync(path.join(__dirname, rpath.db), JSON.stringify($.db))

            document.querySelector('.path__from-pop').style.display = 'none'
            document.querySelector('.path__from-container').style.display = 'none'

            pathFrom.value = ''
            pathTo.value = ''

            $._fs = new Files($.db, '.file__tbody')

            if (config.ReadSubfolders === 1) {
                document.querySelector('#global__change').setAttribute('checked', 'true')
                document.querySelector('#global__change').checked = true
                $._fs.setReadSubfolders(1)
            } else {
                document.querySelector('#global__change').removeAttribute('checked')
                document.querySelector('#global__change').checked = false
                $._fs.setReadSubfolders(0)
            }

            document.querySelector('.loader').style.display = 'none'

            $._fs.startPreset('start')
            await $._fs.loadFiles()
            $._fs.setTheme($.config.theme)
            $._fs.setLang($.config.lang)
        }
    })
}
