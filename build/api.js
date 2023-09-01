'use strict'

const { ipcRenderer, IpcRendererEvent } = require('electron'),
      path = require('path'),
      fs = require('fs')

const Files = require(process.cwd() + '/build/module/Files')

/* window.addEventListener('DOMContentLoaded', () => {
    let pathFrom = document.querySelector('.bth__pathFrom'),
        pathTo   = document.querySelector('.bth__pathTo')

    pathFrom.addEventListener('click', (e) => {
        ipcRenderer.send('showFolderDialog')
    })

    pathTo.addEventListener('click', (e) => {
        ipcRenderer.send('showFolderDialog')
    })
}) */

const rkey = i => {
    let rnd = ''
    while (rnd.length < i)
        rnd += Math.random().toString(36).substring(2)
    return rnd.substring(0, i)
}

const db = require(process.cwd() + '/build/db/db.json')

let size = Object.keys(db).length

let _fs = Files

if (size <= 0) {
    document.querySelector('.path__from-pop').style.display = 'flex'
    document.querySelector('.path__from-container').style.display = 'block'

    document.querySelector('.bth__path-save').addEventListener('click', function () {

        let pathFrom = document.querySelector('#path-from'),
            pathTo   = document.querySelector('#path-to')

        if (pathFrom.value.trim() !== '' || pathTo.value.trim() !== '') {

            let tmp = new Map([
                [`start`, {
                    name: 'Базовый',
                    pathFrom: pathFrom.value,
                    pathTo: pathTo.value,
                    typeFiles: '',
                    sizeFiles: '',
                    wordLeft: '',
                    wordRight: '',
                    changed: ''
                }]
            ])

            db.push(Object.fromEntries(tmp))

            fs.writeFileSync(process.cwd() + '/build/db/db.json', JSON.stringify(db));

            document.querySelector('.path__from-pop').style.display = 'none'
            document.querySelector('.path__from-container').style.display = 'none'

            _fs = new Files(db, '.file__tbody')

            setTimeout(() => {
                document.querySelector('.loader').style.display = 'none'
                _fs.loadFiles()
                _fs.setPreset()
            }, 1000)

        }

    })
} else {

    _fs = new Files(db, '.file__tbody')

    setTimeout(() => {
        document.querySelector('.loader').style.display = 'none'
        _fs.loadFiles()
        _fs.setPreset()
    }, 1000)

}

document.addEventListener('DOMContentLoaded', () => {
    const a = (main, tmp) => {
        document.querySelector(main).addEventListener('click', function () {
            if (tmp === '.kit__popup') {
                document.querySelector('.new__popup').style.display = 'none';
                document.querySelector('.search__popup').style.display = 'none';
            } else if (tmp === '.new__popup') {
                document.querySelector('.kit__popup').style.display = 'none';
                document.querySelector('.search__popup').style.display = 'none';
            } else if (tmp === '.search__popup') {
                document.querySelector('.kit__popup').style.display = 'none';
                document.querySelector('.new__popup').style.display = 'none';
            }
            if (main === '.kit__button-span') {
                document.querySelector('.new__button-span').classList.remove('tb__bth-active')
                document.querySelector('.search__button-span').classList.remove('tb__bth-active')
            } else if (main === '.new__button-span') {
                document.querySelector('.kit__button-span').classList.remove('tb__bth-active')
                document.querySelector('.search__button-span').classList.remove('tb__bth-active')
            } else if (main === '.search__button-span') {
                document.querySelector('.kit__button-span').classList.remove('tb__bth-active')
                document.querySelector('.new__button-span').classList.remove('tb__bth-active')
            }
            this.classList.toggle('tb__bth-active')
            if (document.querySelector(tmp).style.display === 'none') {
                document.querySelector(tmp).style.display = 'block';
            } else {
                document.querySelector(tmp).style.display = 'none';
            }
        })
    }

    a('.kit__button-span', '.kit__popup')
    a('.new__button-span', '.new__popup')
    a('.search__button-span', '.search__popup')

    document.querySelector('.update__files').addEventListener('click', function () {
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
            _fs.updatePath()
        }, 1000)
    })

    document.querySelector('.setting-button').addEventListener('click', function () {
        document.querySelector('.info__from-pop').style.display = 'flex'
        document.querySelector('.info__from-container').style.display = 'block'
    })

    document.querySelector('.close__info').addEventListener('click', function () {
        document.querySelector('.info__from-pop').style.display = 'none'
        document.querySelector('.info__from-container').style.display = 'none'
    })

    document.querySelector('.tb__apply').addEventListener('click', function () {
        document.querySelector('.preset__from-pop').style.display = 'flex'
        document.querySelector('.preset__from-container').style.display = 'block'
    })

    document.querySelector('.bth__change-cancel').addEventListener('click', function () {
        document.querySelector('.change__from-pop').style.display = 'none'
        document.querySelector('.change__from-container').style.display = 'none'
    })

    document.querySelector('.bth__preset-cancel').addEventListener('click', function () {
        document.querySelector('.preset__from-pop').style.display = 'none'
        document.querySelector('.preset__from-container').style.display = 'none'
    })

    document.querySelector('.bth__preset-save').addEventListener('click', function () {
        let pathFrom = document.querySelector('#preset-from'),
            pathTo   = document.querySelector('#preset-to'),
            name     = document.querySelector('#preset-name')

            if (pathFrom.value.trim() !== '' || pathTo.value.trim() !== ''|| name.value.trim() !== '') {

                let id = rkey(20)

                let tmp = new Map([
                    [`${id}`, {
                        name: name.value,
                        pathFrom: pathFrom.value,
                        pathTo: pathTo.value,
                        typeFiles: '',
                        sizeFiles: '',
                        wordLeft: '',
                        wordRight: '',
                        changed: ''
                    }]
                ])

                db.push(Object.fromEntries(tmp))

                fs.writeFileSync(process.cwd() + '/build/db/db.json', JSON.stringify(db));

                document.querySelector('.preset__list').innerHTML += `
                    <div class="preset__item-wrap">
                        <label class="preset__item" for="${id}">
                            <input type="radio" name="preset" id="${id}" value="${name.value}"
                            data-from="${pathFrom.value}"
                            data-to="${pathTo.value}"
                            data-id="${id}">
                            <span class="">${name.value}</span>
                        </label>
                        <div>
                            <i class="fa-duotone fa-wrench setting__preset-${id}"></i>
                            ${id !== 'start' ? '<i class="fa-duotone fa-trash"></i>' : ''}
                        </div>
                    </div>
                `

                document.querySelector('.preset__from-pop').style.display = 'none'
                document.querySelector('.preset__from-container').style.display = 'none'

                _fs.updateDB(db)

            }
    })

    let tmpf_ = {}

    document.querySelector('.kit__popup').addEventListener('click', function () {
        const target = this.querySelectorAll('.fa-wrench')
        if (!target) return false

        target.forEach(el => {
            el.onclick = () => {
                document.querySelector('.change__from-pop').style.display = 'flex'
                document.querySelector('.change__from-container').style.display = 'block'
            }
        })
    })

    document.querySelector('.preset__list').addEventListener('click', function (event) {
        const target = this.querySelectorAll('input');
        if (!target) return false;

        [].forEach.call(target, el => {
            el.onclick = () => {
                tmpf_['id'] = el.dataset.id
                tmpf_['from'] = el.dataset.from
                tmpf_['to'] = el.dataset.to

                _fs.setPreset(tmpf_['id'], tmpf_['from'], tmpf_['to'])
            }
        })

    })

    let files_ = []

    document.querySelector('.file__table').addEventListener('click', function (event) {
        const target = this.querySelector('input')
        if (!target) return false

        files_ = []

        if (target.checked) {
            target.removeAttribute('checked')
            target.checked = false
        } else {
            target.setAttribute('checked', 'true')
            target.checked = true
        }

        let check = this.parentNode.parentNode.querySelectorAll('.file__tbody input')

        check.forEach(el => {
            if (target.checked) {
                el.setAttribute('checked', 'true')
                el.checked = true

                files_.push({
                    id: el.dataset.id,
                    name: el.dataset.name,
                    path: el.dataset.path,
                })
            } else {
                el.removeAttribute('checked')
                el.checked = false
            }


        })

        let keySize = Object.keys(files_).length

        if (keySize > 0) {
            document.querySelector('.search__result').innerHTML = `Выбрано ${keySize} файлов`
            document.querySelector('.global__button-tran').style.display = 'flex'
        } else {
            document.querySelector('.search__result').innerHTML = `Выбрано 0 файлов`
            document.querySelector('.global__button-tran').style.display = 'none'
        }
    })

    document.querySelector('.file__tbody').addEventListener('click', function (event) {
        const target = this.querySelectorAll('input')
        if (!target) return false

        let check =  document.querySelector('.file__table input')

        if (check.checked) {
            check.removeAttribute('checked')
            check.checked = false
            files_ = []
        }

        target.forEach(el => {
            el.onclick = () => {
                let elems = this.querySelectorAll('input:checked');
                files_ = [].map.call(elems, (obj) => {
                    return {
                        id: obj.dataset.id,
                        name: obj.dataset.name,
                        path: obj.dataset.path,
                    }
                })
            }
        })

        let keySize = Object.keys(files_).length

        if (keySize > 0) {
            document.querySelector('.search__result').innerHTML = `Выбрано ${keySize} файлов`
            document.querySelector('.global__button-tran').style.display = 'flex'
        } else {
            document.querySelector('.search__result').innerHTML = `Выбрано 0 файлов`
            document.querySelector('.global__button-tran').style.display = 'none'
        }

    })

    document.querySelector('.search__apply').addEventListener('click', function () {
        let text = document.querySelector('#global__search'),
            column = document.querySelector('#sort__column'),
            type   = document.querySelector('#sort__type')

        _fs.searchFiles(text.value, Number(column.value), Number(type.value))
    })

    document.querySelector('.new__apply').addEventListener('click', function () {
        let column = document.querySelector('#sort__column'),
            type   = document.querySelector('#sort__type')

        _fs.sortFiles(Number(column.value), Number(type.value))
    })

    document.querySelector('.delete__button').addEventListener('click', function () {
        let keySize = Object.keys(files_).length

        if (keySize <= 0) {
            alert('Выберите файлы')
        } else {
            _fs.trashFiles(files_)
            _fs.updatePath()
        }
    })

    document.querySelector('.copy__button').addEventListener('click', function () {
        let keySize = Object.keys(files_).length

        if (keySize <= 0) {
            alert('Выберите файлы')
        } else {
            _fs.copyFiles(files_)
        }
    })

    document.querySelector('.transfer__button').addEventListener('click', function () {
        let keySize = Object.keys(files_).length

        if (keySize <= 0) {
            alert('Выберите файлы')
        } else {
            _fs.renameFiles(files_)
            _fs.updatePath()
        }
    })
})

























