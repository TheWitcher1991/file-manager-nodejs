const path = require('path')
const fs = require('fs')

let { rpath, rkey  } = require(path.join(__dirname, '/config'))
let $ = require(path.join(__dirname, '/config'))

module.exports = function () {
    document.querySelector('.setting-button').addEventListener('click', function () {

        let $this = document.documentElement.getAttribute('theme')

        if ($this === 'dark') {
            $._fs.setTheme('light')
            $.config.theme = 'light'
        } else {
            $._fs.setTheme('dark')
            $.config.theme = 'dark'
        }

        fs.writeFileSync(path.join(__dirname, rpath.config), JSON.stringify($.config));
    })

    document.querySelector('.remember__list').addEventListener('click', function () {
        const target = this.querySelectorAll('button')
        if (!target) return false

        let els = []

        target.forEach(el => {
            el.onclick = () => {
                for (let x in $.db) {
                    let tmp = String(Object.keys($.db[x])),
                        preset = String($._fs.getPreset())
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
                fs.writeFileSync(path.join(__dirname, rpath.db), JSON.stringify($.db));
            }
        })

    })

    document.querySelector('.remember__apply').addEventListener('click', function () {
        const file = document.querySelector('#global__remember')

        if (file.value.trim() === '') {
            alert('Укажите файл')
        } else {
            for (let x in $.db) {
                let tmp = String(Object.keys($.db[x])),
                    preset = String($._fs.getPreset())
                if (tmp === preset) {
                    for (let y in $.db[x]) {
                        if ($.db[x][y].remember.includes(file.value)) {
                            alert('Такой файл записан')
                        } else {
                            $.db[x][y].remember.push(file.value)
                            file.value = ''
                            $._fs.updateDB($.db)
                            fs.writeFileSync(path.join(__dirname, rpath.db), JSON.stringify($.db));
                            $._fs.updateRemember()
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

            $.db.push(Object.fromEntries(tmp))

            fs.writeFileSync(path.join(__dirname, rpath.db), JSON.stringify($.db));

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

                let arr = JSON.parse(inp.dataset.db)

                document.querySelector('#preset-id').value = inp.dataset.id
                document.querySelector('#change-name').value = arr.name
                document.querySelector('#change-from').value = arr.pathFrom
                document.querySelector('#change-to').value = arr.pathTo
                document.querySelector('#change-file').value = arr.typeFiles
                document.querySelector('#change-name-from').value = arr.wordLeft
                document.querySelector('#change-name-to').value = arr.wordRight
                document.querySelector('#change-size').value = arr.sizeFiles

                document.querySelector('.change__from-pop').style.display = 'flex'
                document.querySelector('.change__from-container').style.display = 'block'
            }
        })
    })

    document.querySelector('.bth__change-save').addEventListener('click', function (e) {
        e.preventDefault()

        let id = document.querySelector('#preset-id').value,
            name = document.querySelector('#change-name').value,
            from = document.querySelector('#change-from').value,
            to = document.querySelector('#change-to').value,
            file = document.querySelector('#change-file').value,
            nameFrom = document.querySelector('#change-name-from').value,
            nameTo = document.querySelector('#change-name-to').value,
            size = document.querySelector('#change-size').value

        for (let x in $.db) {
            let tmp = String(Object.keys($.db[x])[0])
            for (let y in $.db[x]) {
                if (tmp === id) {
                    $.db[x][y].name = name
                    $.db[x][y].pathFrom = from
                    $.db[x][y].pathTo = to
                    $.db[x][y].typeFiles = file
                    $.db[x][y].sizeFiles = size
                    $.db[x][y].wordLeft = nameTo
                    $.db[x][y].wordRight = nameFrom
                    $._fs.updateDB($.db)
                    fs.writeFileSync(path.join(__dirname, rpath.db), JSON.stringify($.db));
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

    document.querySelector('.preset__list').addEventListener('click', function (event) {
        const targetPreset = this.querySelectorAll('input');
        if (!targetPreset) return false;

        [].forEach.call(targetPreset, el => {
            el.onclick = () => {
                $.tmpf['id'] = el.dataset.id
                $.tmpf['from'] = el.dataset.from
                $.tmpf['to'] = el.dataset.to
                $.tmpf['remember'] = el.dataset.remember

                $._fs.setPreset($.tmpf['id'], $.tmpf['from'], $.tmpf['to'], $.tmpf['remember'])
            }
        })

        const targetTrashPreset = this.querySelectorAll('.trash__preset');

        [].forEach.call(targetTrashPreset, el => {
            el.onclick = () => {
                let preset = el.dataset.id,
                    active = $._fs.getPreset()

                let tmpdb = []

                if (preset === active) {
                    alert('Данный пресет активен')
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
                    fs.writeFileSync(path.join(__dirname, rpath.db), JSON.stringify($.db));
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
                    path: el.dataset.path,
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

    document.querySelector('.file__tbody').addEventListener('click', function (event) {
        const target = this.querySelectorAll('input')
        if (!target) return false

        $._fs.cleanActiveList()

        let check =  document.querySelector('.file__table input')

        if (check.checked) {
            check.removeAttribute('checked')
            check.checked = false
        }

        target.forEach(el => {
            el.onclick = () => {
                let elems = this.querySelectorAll('input:checked');
                $.files_ = [].map.call(elems, (obj) => {
                    return {
                        id: obj.dataset.id,
                        name: obj.dataset.name,
                        path: obj.dataset.path,
                    }
                })
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

    })
}