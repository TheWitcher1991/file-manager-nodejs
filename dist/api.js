'use strict'

const path = require('path'),
      fs = require('fs')

const Files = require(path.join(__dirname, '/module/Files'))

const rkey = i => {
    let rnd = ''
    while (rnd.length < i)
        rnd += Math.random().toString(36).substring(2)
    return rnd.substring(0, i)
}

const rpath = {
    db: '/db/db.json',
    config: '/db/config.json'
}

let db = require(path.join(__dirname, rpath.db))
const config = require(path.join(__dirname, rpath.config))

let size = Object.keys(db).length

let _fs = Files

let files_ = []

const init = () => {

    document.querySelector('.gload__from-pop').style.display = 'none'
    document.querySelector('.gload__from-container').style.display = 'none'

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
                    changed: '',
                    remember: []
                }]
            ])

            db.push(Object.fromEntries(tmp))

            fs.writeFileSync(path.join(__dirname, rpath.db), JSON.stringify(db));

            document.querySelector('.path__from-pop').style.display = 'none'
            document.querySelector('.path__from-container').style.display = 'none'

            pathFrom.value = ''
            pathTo.value = ''

            _fs = new Files(db, '.file__tbody')

            if (config.ReadSubfolders === 1) {
                document.querySelector('#global__change').setAttribute('checked', 'true')
                document.querySelector('#global__change').checked = true
                _fs.setReadSubfolders(1)
            } else {
                document.querySelector('#global__change').removeAttribute('checked')
                document.querySelector('#global__change').checked = false
                _fs.setReadSubfolders(0)
            }

            document.querySelector('.loader').style.display = 'none'

            _fs.loadFiles()
            _fs.setPreset()

        }

    })
}

if (size <= 0) {
    init()
} else {

    _fs = new Files(db, '.file__tbody')

    if (config.ReadSubfolders === 1) {
        document.querySelector('#global__change').setAttribute('checked', 'true')
        document.querySelector('#global__change').checked = true
        _fs.setReadSubfolders(1)
    } else {
        document.querySelector('#global__change').removeAttribute('checked')
        document.querySelector('#global__change').checked = false
        _fs.setReadSubfolders(0)
    }

    document.querySelector('.loader').style.display = 'none'

    _fs.loadFiles()
    _fs.setPreset()

    document.addEventListener('DOMContentLoaded', function () {
        const tar = document.querySelector('.file__tbody')
        let rs = tar.querySelectorAll('input')


        console.log(rs)
    })

}

document.addEventListener('DOMContentLoaded', function () {





    const a = (main, tmp) => {
        document.querySelector(main).addEventListener('click', function () {
            if (tmp === '.kit__popup') {
                document.querySelector('.new__popup').style.display = 'none';
                document.querySelector('.search__popup').style.display = 'none';
                document.querySelector('.remember__popup').style.display = 'none';
            } else if (tmp === '.new__popup') {
                document.querySelector('.kit__popup').style.display = 'none';
                document.querySelector('.search__popup').style.display = 'none';
                document.querySelector('.remember__popup').style.display = 'none';
            } else if (tmp === '.search__popup') {
                document.querySelector('.kit__popup').style.display = 'none';
                document.querySelector('.new__popup').style.display = 'none';
                document.querySelector('.remember__popup').style.display = 'none';
            } else if (tmp === '.remember__popup') {
                document.querySelector('.kit__popup').style.display = 'none';
                document.querySelector('.new__popup').style.display = 'none';
                document.querySelector('.search__popup').style.display = 'none';
            }
            if (main === '.kit__button-span') {
                document.querySelector('.new__button-span').classList.remove('tb__bth-active')
                document.querySelector('.search__button-span').classList.remove('tb__bth-active')
                document.querySelector('.remember__button-span').classList.remove('tb__bth-active')
            } else if (main === '.new__button-span') {
                document.querySelector('.kit__button-span').classList.remove('tb__bth-active')
                document.querySelector('.search__button-span').classList.remove('tb__bth-active')
                document.querySelector('.remember__button-span').classList.remove('tb__bth-active')
            } else if (main === '.search__button-span') {
                document.querySelector('.kit__button-span').classList.remove('tb__bth-active')
                document.querySelector('.new__button-span').classList.remove('tb__bth-active')
                document.querySelector('.remember__button-span').classList.remove('tb__bth-active')
            } else if (main === '.remember__button-span') {
                document.querySelector('.kit__button-span').classList.remove('tb__bth-active')
                document.querySelector('.new__button-span').classList.remove('tb__bth-active')
                document.querySelector('.search__button-span').classList.remove('tb__bth-active')
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
    a('.remember__button-span', '.remember__popup')

    document.querySelector('.setting-button').addEventListener('click', function () {
        document.querySelector('.info__from-pop').style.display = 'flex'
        document.querySelector('.info__from-container').style.display = 'block'
    })

    document.querySelector('.close__info').addEventListener('click', function () {
        document.querySelector('.info__from-pop').style.display = 'none'
        document.querySelector('.info__from-container').style.display = 'none'
    })

    document.querySelector('.close__need').addEventListener('click', function () {
        document.querySelector('.need__from-pop').style.display = 'none'
        document.querySelector('.need__from-container').style.display = 'none'
    })

    document.querySelector('.tb__apply').addEventListener('click', function () {
        document.querySelector('.preset__from-pop').style.display = 'flex'
        document.querySelector('.preset__from-container').style.display = 'block'
    })

    document.querySelector('.global__button-danger').addEventListener('click', function () {
        document.querySelector('.need__from-pop').style.display = 'flex'
        document.querySelector('.need__from-container').style.display = 'block'
    })

    document.querySelector('.bth__change-cancel').addEventListener('click', function () {
        document.querySelector('.change__from-pop').style.display = 'none'
        document.querySelector('.change__from-container').style.display = 'none'
    })

    document.querySelector('.bth__preset-cancel').addEventListener('click', function () {
        document.querySelector('.preset__from-pop').style.display = 'none'
        document.querySelector('.preset__from-container').style.display = 'none'
    })

    document.querySelector('.delete__preset').addEventListener('click', function () {
        document.querySelector('.delpreset__from-pop').style.display = 'flex'
        document.querySelector('.delpreset__from-container').style.display = 'block'
    })

    document.querySelector('.cancel__danger-pop').addEventListener('click', function () {
        document.querySelector('.delpreset__from-pop').style.display = 'none'
        document.querySelector('.delpreset__from-container').style.display = 'none'
    })

    document.querySelector('.cancel__file-pop').addEventListener('click', function () {
        document.querySelector('.delfile__from-pop').style.display = 'none'
        document.querySelector('.delfile__from-container').style.display = 'none'
    })

    document.querySelector('.remember__list').addEventListener('click', function () {
        const target = this.querySelectorAll('button')
        if (!target) return false

        let els = []

        target.forEach(el => {
            el.onclick = () => {
                for (let x in db) {
                    let tmp = String(Object.keys(db[x])),
                        preset = String(_fs.getPreset())
                    if (tmp === preset) {
                        for (let y in db[x]) {
                            if (db[x][y].remember.includes(el.dataset.name)) {
                                els = db[x][y].remember.filter(i => i !== el.dataset.name)
                                db[x][y].remember = els
                            }
                        }
                    }
                }

                _fs.updateRemember()
                _fs.updateDB(db)
                fs.writeFileSync(path.join(__dirname, rpath.db), JSON.stringify(db));
            }
        })

    })

    document.querySelector('.remember__apply').addEventListener('click', function () {

        const file = document.querySelector('#global__remember')

        if (file.value.trim() === '') {
            alert('Укажите файл')
        } else {

            for (let x in db) {
                let tmp = String(Object.keys(db[x])),
                    preset = String(_fs.getPreset())
                if (tmp === preset) {
                    for (let y in db[x]) {
                        if (db[x][y].remember.includes(file.value)) {
                            alert('Такой файл записан')
                        } else {
                            db[x][y].remember.push(file.value)
                            file.value = ''

                            _fs.updateDB(db)
                            fs.writeFileSync(path.join(__dirname, rpath.db), JSON.stringify(db));
                            _fs.updateRemember()
                        }
                    }
                }
            }

        }

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
                        changed: '',
                        remember: []
                    }]
                ])

                db.push(Object.fromEntries(tmp))

                fs.writeFileSync(path.join(__dirname, rpath.db), JSON.stringify(db));

                document.querySelector('.preset__list').innerHTML += `
                    <div class="preset__item-wrap">
                        <label class="preset__item" for="${id}">
                            <input type="radio" name="preset" id="${id}" value="${name.value}"
                            data-from="${pathFrom.value}"
                            data-to="${pathTo.value}"
                            data-id="${id}"
                            data-remember=""
                            />
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

                pathFrom.value = ''
                pathTo.value = ''
                name.value = ''

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
                tmpf_['remember'] = el.dataset.remember

                _fs.setPreset(tmpf_['id'], tmpf_['from'], tmpf_['to'], tmpf_['remember'])
            }
        })

    })




    document.querySelector('.update__files').addEventListener('click', function () {

        files_ = []

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
            _fs.updatePath()
        }, 300)
    })

    document.querySelector('.file__thead input').addEventListener('click', function (event) {

        files_ = []

        let check = this.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.querySelectorAll('.file__tbody input')

        check.forEach(el => {

            if (this.checked) {
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
            document.querySelector('.search__result').innerHTML = `Найдено ${_fs.getCountFiles()} файлов`
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

        if (keySize === _fs.getCountFiles()) {
            check.setAttribute('checked', 'true')
            check.checked = true
        }

        if (keySize > 0) {
            document.querySelector('.search__result').innerHTML = `Выбрано ${keySize} файлов`
            document.querySelector('.global__button-tran').style.display = 'flex'
        } else {
            document.querySelector('.search__result').innerHTML = `Найдено ${_fs.getCountFiles()} файлов`
            document.querySelector('.global__button-tran').style.display = 'none'
        }

    })

    document.querySelector('#global__change').addEventListener('change', function () {

        if (!this.checked) {
            this.removeAttribute('checked')
            this.checked = false
            config.ReadSubfolders = 0
            _fs.setReadSubfolders(0)
        }

        if (this.checked) {
            this.setAttribute('checked', 'true')
            this.checked = true
            config.ReadSubfolders = 1
            _fs.setReadSubfolders(1)
        }

        fs.writeFileSync(path.join(__dirname, rpath.config), JSON.stringify(config))
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

    document.querySelector('.apply__danger-pop').addEventListener('click', function () {
        db = []
        files_ = []
        tmpf_ = []
        size = 0

        _fs.cleanBase()

        fs.writeFileSync(path.join(__dirname, rpath.db), JSON.stringify(db));

        document.querySelector('.delpreset__from-pop').style.display = 'none'
        document.querySelector('.delpreset__from-container').style.display = 'none'

        init()
    })

    document.querySelector('.delete__button').addEventListener('click', function () {
        let keySize = Object.keys(files_).length

        if (keySize <= 0) {
            alert('Выберите файлы')
        } else {

            if (config.FileDeleteNotice === 1) {
                document.querySelector('.delfile__from-pop').style.display = 'flex'
                document.querySelector('.delfile__from-container').style.display = 'block'
            } else {
                _fs.trashFiles(files_)
            }

        }
    })

    document.querySelector('.apply__file-pop').addEventListener('click', function () {
        let keySize = Object.keys(files_).length

        if (keySize <= 0) {
            alert('Выберите файлы')
        } else {

            _fs.trashFiles(files_)

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

            console.log(files_)

            _fs.renameFiles(files_)


        }
    })
})

























