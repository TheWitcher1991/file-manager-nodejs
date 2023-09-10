const path = require('path')
const fs = require('fs')

const Launch = require(path.join(__dirname, '/Launch'))

const { rpath } = require(path.join(__dirname, '/config'))
let $ = require(path.join(__dirname, '/config'))

module.exports = function () {
    document.querySelector('.apply__danger-pop').addEventListener('click', function () {
        $.db = []
        $.files_ = []
        $.tmpf_ = []
        $.size = 0

        $._fs.cleanBase()

        fs.writeFileSync(path.join(__dirname, rpath.db), JSON.stringify($.db));

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

        $.files_ = []

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
        let text = document.querySelector('#global__search'),
            column = document.querySelector('#sort__column'),
            type   = document.querySelector('#sort__type')

        $._fs.searchFiles(text.value, Number(column.value), Number(type.value))
    })

    document.querySelector('.new__apply').addEventListener('click', function () {
        let column = document.querySelector('#sort__column'),
            type   = document.querySelector('#sort__type')

        $._fs.sortFiles(Number(column.value), Number(type.value))
    })
}