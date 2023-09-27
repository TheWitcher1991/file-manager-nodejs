const path = require('path')
const fs = require('fs')

const Launch = require(path.join(__dirname, '/Launch'))

const { rpath } = require(path.join(__dirname, '/config'))
let $ = require(path.join(__dirname, '/config'))

module.exports = function () {
    document.querySelector('.apply__danger-pop').addEventListener('click', function () {
        $.db.length = 0
        $.files_.length = 0
        $.tmpf_ = {}
        $.config = {}
        $.size = 0

        $._fs.cleanActiveList()
        $._fs.cleanBase()

        fs.writeFileSync(path.join(__dirname, rpath.db), JSON.stringify($.db))
        fs.writeFileSync(path.join(__dirname, rpath.config), JSON.stringify({
            theme: 'dark',
            lang: 'ru',
            FileDeleteNotice: 1,
            PresetDeleteNotice: 1,
            ReadSubfolders: 1,
            ActivePreset: 'start'
        }))

        document.querySelector('.delpreset__from-pop').style.display = 'none'
        document.querySelector('.delpreset__from-container').style.display = 'none'

        Launch()
    })

    document.querySelector('#global__change').addEventListener('change', function () {
        if (!this.checked) {
            this.removeAttribute('checked')
            this.checked = false
            $.config.ReadSubfolders = 0
            $._fs.setReadSubfolders(0)
        }

        if (this.checked) {
            this.setAttribute('checked', 'true')
            this.checked = true
            $.config.ReadSubfolders = 1
            $._fs.setReadSubfolders(1)
        }

        fs.writeFileSync(path.join(__dirname, rpath.config), JSON.stringify($.config))
    })

    document.querySelector('.update__files').addEventListener('click', function () {
        document.querySelector('#preset-id').value = ''
        document.querySelector('#change-name').value = ''
        document.querySelector('#change-from').value = ''
        document.querySelector('#change-to').value = ''
        document.querySelector('#change-file').value = ''
        document.querySelector('#change-name-from').value = ''
        document.querySelector('#change-name-to').value = ''
        document.querySelector('#change-size').value = ''

        $.files_ = []

        $._fs.cleanActiveList()

        document.querySelector('.global__button-danger').style.display = 'none'
        document.querySelector('.need__block > div').innerHTML = ''

        document.querySelector('.check__all').removeAttribute('checked')
        document.querySelector('.check__all').checked = false

        document.querySelector('.global__button-tran').style.display = 'none'

        document.querySelector('.file__tbody').innerHTML = `
            <div class="loader">
                <div class="sk-circle-bounce">
                    <div class="loading-chat">
                        <svg class="spinner" viewBox="0 0 50 50">
                            <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
                        </svg>
                    </div>
                </div>
            </div>`
        setTimeout(() => {
            document.querySelector('.loader').style.display = 'none'
            $._fs.updatePath()
        }, 300)
    })

    document.querySelector('.search__apply').addEventListener('click', function () {
        const text = document.querySelector('#global__search')
        const column = document.querySelector('#sort__column')
        const type = document.querySelector('#sort__type')

        document.querySelector('.check__all').checked = false
        document.querySelector('.check__all').setAttribute('checked', '')

        document.querySelector('.search__popup').style.display = 'none'
        document.querySelector('.search__button-span').classList.remove('tb__bth-active')

        $._fs.searchFiles(text.value, Number(column.value), Number(type.value))
    })

    document.querySelector('.new__apply').addEventListener('click', function () {
        const column = document.querySelector('#sort__column')
        const type = document.querySelector('#sort__type')

        document.querySelector('.check__all').checked = false
        document.querySelector('.check__all').setAttribute('checked', '')

        document.querySelector('.new__popup').style.display = 'none'
        document.querySelector('.new__button-span').classList.remove('tb__bth-active')

        $._fs.sortFiles(Number(column.value), Number(type.value))
    })

    document.querySelector('.setting-button').addEventListener('click', function () {
        let $this = document.documentElement.getAttribute('theme')

        if ($this === 'dark') {
            $._fs.setTheme('light')
            $.config.theme = 'light'
        } else {
            $._fs.setTheme('dark')
            $.config.theme = 'dark'
        }

        fs.writeFileSync(path.join(__dirname, rpath.config), JSON.stringify($.config))
    })

    document.querySelector('.lang-button').addEventListener('click', function () {
        let $this = document.documentElement.getAttribute('lang')

        if ($this === 'ru') {
            $._fs.setLang('en')
            $.config.lang = 'en'
        } else {
            $._fs.setLang('ru')
            $.config.lang = 'ru'
        }

        fs.writeFileSync(path.join(__dirname, rpath.config), JSON.stringify($.config))
    })

    document.querySelector('.preset__list').addEventListener('click', function (event) {
        const targetPreset = this.querySelectorAll('input')
        if (!targetPreset) return false;

        [].forEach.call(targetPreset, el => {
            el.onclick = () => {
                $.tmpf['id'] = el.dataset.id
                $.tmpf['from'] = el.dataset.from
                $.tmpf['to'] = el.dataset.to
                $.tmpf['remember'] = el.dataset.remember
                $.tmpf['regexp'] = el.dataset.regexp

                $.config.ActivePreset = el.dataset.id

                $._fs.setPreset($.tmpf['id'], $.tmpf['from'], $.tmpf['to'], $.tmpf['remember'], $.tmpf['regexp'])
                fs.writeFileSync(path.join(__dirname, rpath.config), JSON.stringify($.config))

                document.querySelector('.tb__popup').style.display = 'none'
                document.querySelector('.check__all').removeAttribute('checked')
                document.querySelector('.check__all').checked = false
            }
        })

        const targetTrashPreset = this.querySelectorAll('.trash__preset');

        [].forEach.call(targetTrashPreset, el => {
            el.onclick = () => {
                let preset = el.dataset.id
                let active = $._fs.getPreset()

                let tmpdb = []

                if (preset === active) {
                    $._fs.createNotice('Данный пресет активен')
                } else {
                    for (let x in $.db) {
                        let tmp = String(Object.keys($.db[x]))
                        if (tmp !== preset) {
                            tmpdb.push($.db[x])
                        }
                    }

                    $.db.length = 0

                    $.db.push(...tmpdb)

                    $._fs.updateDB($.db)
                    $._fs.updatePreset()
                    fs.writeFileSync(path.join(__dirname, rpath.db), JSON.stringify($.db))
                }
            }
        })
    })
}
