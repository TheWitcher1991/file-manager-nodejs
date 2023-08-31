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

            setTimeout(() => {
                document.querySelector('.loader').style.display = 'none'
                Files.loadFiles(db, '.file__tbody')
            }, 1000)

        }

    })
} else {
    setTimeout(() => {
        document.querySelector('.loader').style.display = 'none'
        Files.loadFiles(db, '.file__tbody')
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
                document.querySelector('.new__popup').classList.remove('tb__bth-active')
                document.querySelector('.search__button-span').classList.remove('tb__bth-active')
            } else if (main === '.new__button-span') {
                document.querySelector('.kit__button-span').classList.remove('tb__bth-active')
                document.querySelector('.search__popup').classList.remove('tb__bth-active')
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

    document.querySelector('.search__apply').addEventListener('click', function () {
        let text = document.querySelector('#global__search')

        Files.searchFiles(text.value, '.file__tbody', document.querySelector('.global__from').value)
    })

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
            Files.updatePath(document.querySelector('.global__from').value, '.file__tbody')
        }, 1000)
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
        const target = this.querySelectorAll('input')
        if (!target) return false

        target.forEach(el => {
            el.onclick = () => {
                let elems = this.querySelector('input:checked');
                tmpf_.id = elems.dataset.id
                tmpf_.from = elems.dataset.from
                tmpf_.to = elems.dataset.to
            }
        })

        document.querySelector('.home__path').innerHTML = tmpf_.from
        document.querySelector('.home__to').innerHTML = tmpf_.to
        document.querySelector('.home__preset').innerHTML = tmpf_.id

        document.querySelector('.global__from').value = tmpf_.from
        document.querySelector('.global__to').value = tmpf_.to

        document.querySelector('.file__tbody').innerHTML = ''

        Files.updatePath(String(tmpf_.from), '.file__tbody')
    })

    let files_ = []

    document.querySelector('.file__tbody').addEventListener('click', function (event) {
        const target = this.querySelectorAll('input')
        if (!target) return false

        target.forEach(el => {

            el.onclick = () => {
                let elems = this.querySelectorAll('input:checked');
                console.log(elems)
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

        document.querySelector('.search__result').innerHTML = `Выбрано ${keySize} файлов`
    })

    document.querySelector('.copy__button').addEventListener('click', function () {
        let keySize = Object.keys(files_).length

        if (keySize <= 0) {
            alert('Выберите файлы')
        } else {
            let to = document.querySelector('.global__to').value
            Files.copyFiles(to, files_)
        }
    })

    document.querySelector('.transfer__button').addEventListener('click', function () {
        let keySize = Object.keys(files_).length

        if (keySize <= 0) {
            alert('Выберите файлы')
        } else {
            let from = document.querySelector('.global__from').value,
                to = document.querySelector('.global__to').value
            Files.renameFiles(to, files_)

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
                Files.updatePath(from, '.file__tbody')
            }, 1000)
        }
    })
})

























