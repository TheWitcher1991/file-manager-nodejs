const path = require('path')
const fs = require('fs')

let { rpath, rkey } = require(path.join(__dirname, '/config'))
let $ = require(path.join(__dirname, '/config'))

module.exports = function () {
    document.querySelector('.gil__to').addEventListener('dblclick', function () {
        this.style.display = 'none'
        document.querySelector('.gih__to').style.display = 'flex'
        document.querySelector('#gih__to').focus()
    })

    document.querySelector('.gil__from').addEventListener('dblclick', function () {
        this.style.display = 'none'
        document.querySelector('.gih__from').style.display = 'flex'
        document.querySelector('#gih__from').focus()
    })

    document.querySelector('#gih__to').addEventListener('blur', e => {
        for (let x in $.db) {
            let tmp = String(Object.keys($.db[x]))
            let preset = String($._fs.getPreset())
            if (tmp === preset) {
                for (let y in $.db[x]) {
                    document.querySelector('.gih__to').style.display = 'none'
                    document.querySelector('.gil__to').style.display = 'flex'

                    if (document.querySelector('#gih__to').value.replace(/\s/g, '') === '') {
                        $._fs.createNotice('Поле не должно быть пустым')
                        document.querySelector('#gih__to').value = ''
                        return false
                    }

                    $.db[x][y].pathTo = document.querySelector('#gih__to').value.trim()
                    $._fs.setPathTo(document.querySelector('#gih__to').value.trim())
                    $._fs.updateDB($.db)
                    fs.writeFileSync(path.join(__dirname, rpath.db), JSON.stringify($.db))
                    document.querySelector('.home__to').innerHTML = document.querySelector('#gih__to').value.trim()
                    document.querySelector('.global__to').value = document.querySelector('#gih__to').value
                    document.querySelector('#gih__to').value = ''
                    return false
                }
            }
        }
    })

    document.querySelector('#gih__from').addEventListener('blur', e => {
        for (let x in $.db) {
            let tmp = String(Object.keys($.db[x]))
            let preset = String($._fs.getPreset())
            if (tmp === preset) {
                for (let y in $.db[x]) {
                    document.querySelector('.gih__from').style.display = 'none'
                    document.querySelector('.gil__from').style.display = 'flex'

                    if (document.querySelector('#gih__from').value.replace(/\s/g, '') === '') {
                        $._fs.createNotice('Поле не должно быть пустым')
                        document.querySelector('#gih__from').value = ''
                        return false
                    }

                    $.db[x][y].pathFrom = document.querySelector('#gih__from').value.trim()
                    $._fs.setPathFrom(document.querySelector('#gih__from').value.trim())
                    $._fs.updateDB($.db)
                    fs.writeFileSync(path.join(__dirname, rpath.db), JSON.stringify($.db))
                    document.querySelector('.home__path').innerHTML = document.querySelector('#gih__from').value.trim()
                    document.querySelector('.global__from').value = document.querySelector('#gih__from').value
                    document.querySelector('#gih__from').value = ''
                    $._fs.loadFiles()
                    return false
                }
            }
        }
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

    document.querySelector('.remember__list').addEventListener('click', function () {
        const target = this.querySelectorAll('button')
        if (!target) return false

        let els = []

        target.forEach(el => {
            el.onclick = () => {
                for (let x in $.db) {
                    let tmp = String(Object.keys($.db[x]))
                    let preset = String($._fs.getPreset())
                    if (tmp === preset) {
                        for (let y in $.db[x]) {
                            if ($.db[x][y].remember.includes(el.dataset.name)) {
                                els = $.db[x][y].remember.filter(i => i !== el.dataset.name)
                                $.db[x][y].remember = els
                            }
                        }
                    }
                }

                $._fs.updateRemember()
                $._fs.updateDB($.db)
                fs.writeFileSync(path.join(__dirname, rpath.db), JSON.stringify($.db))
            }
        })
    })

    document.querySelector('.remember__apply').addEventListener('click', function () {
        const file = document.querySelector('#global__remember')

        if (file.value.replace(/\s/g, '') === '') {
            $._fs.createNotice('Укажите файл')
        } else {
            for (let x in $.db) {
                let tmp = String(Object.keys($.db[x]))
                let preset = String($._fs.getPreset())
                if (tmp === preset) {
                    for (let y in $.db[x]) {
                        if ($.db[x][y].remember.includes(file.value)) {
                            $._fs.createNotice('Такой файл записан')
                        } else {
                            $.db[x][y].remember.push(file.value)
                            file.value = ''
                            $._fs.updateDB($.db)
                            fs.writeFileSync(path.join(__dirname, rpath.db), JSON.stringify($.db))
                            $._fs.updateRemember()
                        }
                    }
                }
            }
        }
    })

    document.querySelector('.bth__preset-save').addEventListener('click', function () {
        let pathFrom = document.querySelector('#preset-from')
        let pathTo = document.querySelector('#preset-to')
        let name = document.querySelector('#preset-name')

        if (pathFrom.value.replace(/\s/g, '') !== '' || pathTo.value.replace(/\s/g, '') !== '' || name.value.replace(/\s/g, '') !== '') {
            let id = rkey(20)

            let tmp = new Map([
                [`${id}`, {
                    name: name.value,
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

            $.db.push(Object.fromEntries(tmp))

            fs.writeFileSync(path.join(__dirname, rpath.db), JSON.stringify($.db))

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

            $._fs.updateDB($.db)

            pathFrom.value = ''
            pathTo.value = ''
            name.value = ''
        }
    })

    document.querySelector('.kit__popup').addEventListener('click', function () {
        const target = this.querySelectorAll('.fa-wrench')
        if (!target) return false

        target.forEach(el => {
            el.onclick = () => {
                let inp = el.parentNode.parentNode.querySelector('input')

                let arr = {}

                for (let x in $.db) {
                    let tmp = String(Object.keys($.db[x])[0])
                    for (let y in $.db[x]) {
                        if (tmp === inp.dataset.id) {
                            arr.name = $.db[x][y].name
                            arr.pathFrom = $.db[x][y].pathFrom
                            arr.pathTo = $.db[x][y].pathTo
                            arr.typeFiles = $.db[x][y].typeFiles
                            arr.sizeFiles = $.db[x][y].sizeFiles
                            arr.wordLeft = $.db[x][y].wordLeft
                            arr.wordRight = $.db[x][y].wordRight
                            break
                        }
                    }
                }

                document.querySelector('#preset-id').value = inp.dataset.id
                document.querySelector('#change-name').value = arr.name
                document.querySelector('#change-from').value = arr.pathFrom
                document.querySelector('#change-to').value = arr.pathTo
                document.querySelector('#change-file').value = arr.typeFiles
                document.querySelector('#change-name-from').value = arr.wordLeft
                document.querySelector('#change-name-to').value = arr.wordRight
                document.querySelector('#change-size').value = arr.sizeFiles

                document.querySelectorAll('.tb__popup').forEach(el => el.style.display = 'none')
                document.querySelectorAll('.tb__span').forEach(el => el.classList.remove('tb__bth-active'))

                document.querySelector('.change__from-pop').style.display = 'flex'
                document.querySelector('.change__from-container').style.display = 'block'
            }
        })
    })

    document.querySelector('.bth__change-save').addEventListener('click', function (e) {
        e.preventDefault()

        let id = document.querySelector('#preset-id').value
        let name = document.querySelector('#change-name').value
        let from = document.querySelector('#change-from').value
        let to = document.querySelector('#change-to').value
        let file = document.querySelector('#change-file').value
        let nameFrom = document.querySelector('#change-name-from').value
        let nameTo = document.querySelector('#change-name-to').value
        let size = document.querySelector('#change-size').value

        for (let x in $.db) {
            let tmp = String(Object.keys($.db[x])[0])
            for (let y in $.db[x]) {
                if (tmp === id) {
                    $.db[x][y].name = name
                    $.db[x][y].pathFrom = from.trim()
                    $.db[x][y].pathTo = to.trim()
                    $.db[x][y].typeFiles = file
                    $.db[x][y].sizeFiles = size
                    $.db[x][y].wordLeft = nameFrom
                    $.db[x][y].wordRight = nameTo

                    fs.writeFileSync(path.join(__dirname, rpath.db), JSON.stringify($.db))
                    break
                }
            }
        }

        $._fs.createNotice('Данные сохранены')

        document.querySelector('.change__from-pop').style.display = 'none'
        document.querySelector('.change__from-container').style.display = 'none'

        document.querySelector('#preset-id').value = ''
        document.querySelector('#change-name').value = ''
        document.querySelector('#change-from').value = ''
        document.querySelector('#change-to').value = ''
        document.querySelector('#change-file').value = ''
        document.querySelector('#change-name-from').value = ''
        document.querySelector('#change-name-to').value = ''
        document.querySelector('#change-size').value = ''
    })

    document.querySelector('.bth__letter-save').addEventListener('click', function (e) {
        e.preventDefault()

        let from = document.querySelector('#preset__letter-from').value

        let preset = $._fs.getPreset()

        if (from.replace(/\s/g, '') !== '') {
            for (let x in $.db) {
                let tmp = String(Object.keys($.db[x])[0])
                for (let y in $.db[x]) {
                    if (tmp === preset) {
                        $.db[x][y].pathFrom = from.trim()
                        document.querySelector('#preset__letter-name').value = ''
                        document.querySelector('.preset__letter-pop').style.display = 'none'
                        document.querySelector('.preset__letter-container').style.display = 'none'
                        fs.writeFileSync(path.join(__dirname, rpath.db), JSON.stringify($.db))
                        $._fs.loadFiles()
                        return false
                    }
                }
            }
        }
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

                $.config.ActivePreset = el.dataset.id

                $._fs.setPreset($.tmpf['id'], $.tmpf['from'], $.tmpf['to'], $.tmpf['remember'])
                fs.writeFileSync(path.join(__dirname, rpath.config), JSON.stringify($.config))

                document.querySelector('.tb__popup').style.display = 'none'
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

    document.querySelector('.file__thead input').addEventListener('click', function (event) {
        $.files_ = []

        $._fs.cleanActiveList()

        let check = this.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.querySelectorAll('.file__tbody input')

        check.forEach(el => {
            if (this.checked) {
                el.setAttribute('checked', 'true')
                el.checked = true

                $.files_.push({
                    id: el.dataset.id,
                    name: el.dataset.name,
                    path: el.dataset.path
                })
            } else {
                el.removeAttribute('checked')
                el.checked = false
            }
        })

        let keySize = Object.keys($.files_).length

        if (keySize > 0) {
            document.querySelector('.search__result').innerHTML = `Выбрано ${keySize} файлов`
            document.querySelector('.global__button-tran').style.display = 'flex'
        } else {
            document.querySelector('.search__result').innerHTML = `Найдено ${$._fs.getCountFiles()} файлов`
            document.querySelector('.global__button-tran').style.display = 'none'
        }
    })

    document.querySelector('.file__tbody').addEventListener('contextmenu', function (e) {
        const target = this.querySelectorAll('.file__div')
        if (!target) return false

        e.srcElement.offsetParent.parentNode.querySelector('.context__file .create__props').addEventListener('click', function () {
            let i = e.srcElement.offsetParent.parentNode.querySelector('.file__table-ctx input')

            let changed = new Date(i.dataset.time).toLocaleString('ru', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
                timezone: 'UTC'
            })

            let open = new Date(i.dataset.open).toLocaleString('ru', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
                timezone: 'UTC'
            })

            let create = new Date(i.dataset.create).toLocaleString('ru', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
                timezone: 'UTC'
            })

            document.querySelector('.ino-img').innerHTML = `<img src="${i.dataset.img}" alt="">`
            document.querySelector('.ino-name').innerHTML = i.dataset.name
            document.querySelector('.ino-path').value = i.dataset.dir
            document.querySelector('.ino-type').innerHTML = i.dataset.type
            document.querySelector('.ino-size').innerHTML = `${i.dataset.psize} (${i.dataset.size} байт)`
            document.querySelector('.ino-create').innerHTML = create
            document.querySelector('.ino-changed').innerHTML = changed
            document.querySelector('.ino-open').innerHTML = open

            document.querySelector('.infofile__from-pop').style.display = 'flex'
            document.querySelector('.infofile__from-container').style.display = 'block'
        })

        this.querySelectorAll('.context__file').forEach(el => el.style.cssText = 'display:none')
        this.querySelectorAll('.file__table-ctx').forEach(el => el.classList.remove('context__active'))

        const clickCoordsX = e.pageX
        const clickCoordsY = e.pageY

        const menu = e.srcElement.offsetParent.parentNode.querySelector('.context__file')
        const label = e.srcElement.offsetParent.parentNode.querySelector('.file__table-ctx')

        label.classList.add('context__active')

        const windowWidth = window.innerWidth
        const windowHeight = window.innerHeight

        menu.style.display = 'block'

        if ((windowWidth - clickCoordsX) < menu.offsetWidth) {
            menu.style.left = windowWidth - menu.offsetWidth + 'px'
        } else {
            menu.style.left = clickCoordsX + 10 + 'px'
        }

        if ((windowHeight - clickCoordsY) < menu.offsetHeight) {
            menu.style.top = windowHeight - menu.offsetHeight + 'px'
        } else {
            menu.style.top = clickCoordsY + 15 + 'px'
        }
    })

    document.querySelector('.file__tbody').addEventListener('click', function (e) {
        const target = this.querySelectorAll('input')
        if (!target) return false

        let check = document.querySelector('.file__table input')

        if (check.checked) {
            check.removeAttribute('checked')
            check.checked = false
        }

        target.forEach(el => {
            el.onclick = () => {
                $._fs.cleanActiveList()
                let elems = this.querySelectorAll('input:checked')
                $.files_ = [].map.call(elems, (obj) => {
                    return {
                        id: obj.dataset.id,
                        name: obj.dataset.name,
                        path: obj.dataset.path
                    }
                })

                let keySize = Object.keys($.files_).length

                if (keySize === $._fs.getCountFiles()) {
                    check.setAttribute('checked', 'true')
                    check.checked = true
                }

                if (keySize > 0) {
                    document.querySelector('.search__result').innerHTML = `Выбрано ${keySize} файлов`
                    document.querySelector('.global__button-tran').style.display = 'flex'
                } else {
                    document.querySelector('.search__result').innerHTML = `Найдено ${$._fs.getCountFiles()} файлов`
                    document.querySelector('.global__button-tran').style.display = 'none'
                }
            }
        })
    })
}
