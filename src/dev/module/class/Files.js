'use strict'

const path = require('path')
const fs = require('fs')
const { resolve } = require('path')

function promisify (fn) {
    return function () {
        return new Promise(
            (resolve, reject) => fn(
                ...Array.from(arguments),
                (err, data) => err ? reject(err) : resolve(data)
            )
        )
    }
}

const readdir = promisify(fs.readdir)
const stat = promisify(fs.stat)

class Files {
    constructor (db, selector, from = '', to = '', remember = [], regexp = [], count = 0, files = [], readSubfolders = 1, activeFiles = 0, activeList = [], countRender = 0) {
        this.db = db
        this.selector = selector
        this.from = from
        this.to = to
        this.preset = 'start'
        this.activeFilesSort = []
        this.remember = remember
        this.regexp = regexp
        this.count = count
        this.files = files
        this.readSubfolders = readSubfolders
        this.activeFiles = activeFiles
        this.activeList = activeList
        this.countRender = countRender
        this.baseDir = ''
        this.bindScroll = 1
        this.htmlFiles = []
        this.mod = 0

        this.typeFiles = [
            {
                img: `<img src="${path.join(__dirname, '../../public/img/png/html.png')}" />`,
                path: '../../public/img/png/html.png',
                type: ['.html', '.htm', '.htb', '.htx', '.htg']
            },
            {
                img: `<img src="${path.join(__dirname, '../../public/img/png/xml.png')}" />`,
                path: '../../public/img/png/xml.png',
                type: ['.xml']
            },
            {
                img: `<img src="${path.join(__dirname, '../../public/img/png/exe.png')}" />`,
                path: '../../public/img/png/exe.png',
                type: ['.exe']
            },
            {
                img: `<img src="${path.join(__dirname, '../../public/img/png/js.png')}" />`,
                path: '../../public/img/png/js.png',
                type: ['.js', '.jsx', '.cjs']
            },
            {
                img: `<img src="${path.join(__dirname, '../../public/img/png/java.png')}" />`,
                path: '../../public/img/png/java.png',
                type: ['.java', '.jar']
            },
            {
                img: `<img src="${path.join(__dirname, '../../public/img/png/python.png')}" />`,
                path: '../../public/img/png/python.png',
                type: ['.py']
            },
            {
                img: `<img src="${path.join(__dirname, '../../public/img/png/cpp.png')}" />`,
                path: '../../public/img/png/cpp.png',
                type: ['.cpp', '.bsc', '.cur', '.dbp']
            },
            {
                img: `<img src="${path.join(__dirname, '../../public/img/png/c.png')}" />`,
                path: '../../public/img/png/c.png',
                type: ['.c', '.h']
            },
            {
                img: `<img src="${path.join(__dirname, '../../public/img/png/csharp.png')}" />`,
                path: '../../public/img/png/csharp.png',
                type: ['.cs']
            },
            {
                img: `<img src="${path.join(__dirname, '../../public/img/png/swift.png')}" />`,
                path: '../../public/img/png/swift.png',
                type: ['.swift']
            },
            {
                img: `<img src="${path.join(__dirname, '../../public/img/png/svg.png')}" />`,
                path: '../../public/img/png/svg.png',
                type: ['.svg']
            },
            {
                img: `<img src="${path.join(__dirname, '../../public/img/png/php.png')}" />`,
                path: '../../public/img/png/php.png',
                type: ['.php']
            },
            {
                img: `<img src="${path.join(__dirname, '../../public/img/png/ejs.png')}" />`,
                path: '../../public/img/png/ejs.png',
                type: ['.ejs']
            },
            {
                img: `<img src="${path.join(__dirname, '../../public/img/png/bash.png')}" />`,
                path: '../../public/img/png/bash.png',
                type: ['.sh', '.cmd']
            },
            {
                img: `<img src="${path.join(__dirname, '../../public/img/png/json.png')}" />`,
                path: '../../public/img/png/json.png',
                type: ['.json']
            },
            {
                img: `<img src="${path.join(__dirname, '../../public/img/png/graphql.png')}" />`,
                path: '../../public/img/png/graphql.png',
                type: ['.graphql', '.agq']
            },
            {
                img: `<img src="${path.join(__dirname, '../../public/img/png/css.png')}" />`,
                path: '../../public/img/png/css.png',
                type: ['.css']
            },
            {
                img: `<img src="${path.join(__dirname, '../../public/img/png/sass.png')}" />`,
                path: '../../public/img/png/sass.png',
                type: ['.sass', '.scss']
            },
            {
                img: `<img src="${path.join(__dirname, '../../public/img/png/ts.png')}" />`,
                path: '../../public/img/png/ts.png',
                type: ['.ts', '.tsx']
            },
            {
                img: `<img src="${path.join(__dirname, '../../public/img/png/word.png')}" />`,
                path: '../../public/img/png/word.png',
                type: ['.docx', '.doc', '.docm', '.dot', '.rtf']
            },
            {
                img: `<img src="${path.join(__dirname, '../../public/img/png/pdf.png')}" />`,
                path: '../../public/img/png/pdf.png',
                type: ['.pdf']
            },
            {
                img: `<img src="${path.join(__dirname, '../../public/img/png/powerpoint.png')}" />`,
                path: '../../public/img/png/powerpoint.png',
                type: ['.pptx', '.pptm', '.ppt']
            },
            {
                img: `<img src="${path.join(__dirname, '../../public/img/png/access.png')}" />`,
                path: '../../public/img/png/access.png',
                type: ['.accdb', '.mdb', '.dat', '.sdf', '.mdf']
            },
            {
                img: `<img src="${path.join(__dirname, '../../public/img/png/database.png')}" />`,
                path: '../../public/img/png/database.png',
                type: ['.sql', '.db', '.sqlite', '.sqlite3', '.crypt']
            },
            {
                img: `<img src="${path.join(__dirname, '../../public/img/png/excel.png')}" />`,
                path: '../../public/img/png/excel.png',
                type: ['.xls', '.xlsx', '.xlsm', '.xlsb', '.xlsx']
            },
            {
                img: `<img src="${path.join(__dirname, '../../public/img/png/archive.png')}" />`,
                path: '../../public/img/png/archive.png',
                type: ['.zip', '.7z', '.cab', '.tar', '.deb', '.ace', '.pak', '.rar']
            },
            {
                img: `<img src="${path.join(__dirname, '../../public/img/png/picture.png')}" />`,
                path: '../../public/img/png/picture.png',
                type: ['.png', '.jpeg', '.jpg', '.ico', '.pict', '.gif', '.bmp', '.jfif', '.webm', '.tif']
            },
            {
                img: `<img src="${path.join(__dirname, '../../public/img/png/audio.png')}" />`,
                path: '../../public/img/png/audio.png',
                type: ['.mp3', '.mp4', '.m4a', '.wav', '.wma', '.aif', '.ac3', '.mov', '.avi', '.amr']
            }
        ]
    }

    mb_strwidth (str) {
        let i = 0
        let l = str.length
        let c = ''
        let length = 0
        for (; i < l; i++) {
            c = str.charCodeAt(i)
            if (c >= 0x0000 && c <= 0x0019) {
                length += 0
            } else if (c >= 0x0020 && c <= 0x1FFF) {
                length += 1
            } else if (c >= 0x2000 && c <= 0xFF60) {
                length += 2
            } else if (c >= 0xFF61 && c <= 0xFF9F) {
                length += 1
            } else if (c >= 0xFFA0) {
                length += 2
            }
        }
        return length
    };

    mb_strimwidth (str, start, width, trimmarker) {
        if (typeof trimmarker === 'undefined') trimmarker = ''
        let trimmakerWidth = this.mb_strwidth(trimmarker)
        let i = start
        let l = str.length
        let trimmedLength = 0
        let trimmedStr = ''

        for (; i < l; i++) {
            let charCode = str.charCodeAt(i)
            let c = str.charAt(i)
            let charWidth = this.mb_strwidth(c)
            let next = str.charAt(i + 1)
            let nextWidth = this.mb_strwidth(next)
            trimmedLength += charWidth
            trimmedStr += c
            if (trimmedLength + trimmakerWidth + nextWidth > width) {
                trimmedStr += trimmarker
                break
            }
        }
        return trimmedStr
    }

    createNotice (text, time = 3000) {
        const notice = document.createElement('div')
        notice.className = 'alert__block'
        notice.id = `alert-${Math.floor(Math.random() * 100)}`
        notice.innerHTML = `
            <i class="fa-light fa-bell-on"></i>
            <span>${text}</span>
        `

        let wrap = document.querySelector('#notice__wrapper')

        wrap.prepend(notice)

        let as = setTimeout(() => {
            notice.remove()

            clearTimeout(as)
        }, time)
    }

    async readFiles (from = '') {
        let config = this.getConfig()

        let types = config.typeFiles.replace(/\s/g, '').split(/,|-/)

        try {
            let subfolders = await readdir(from)

            const files = await Promise.all(subfolders.map(async (subfolder) => {
                const res = resolve(from, subfolder)
                const stats = await stat(res)

                if (stats.isDirectory() && this.readSubfolders === 1) {
                    return this.readFiles(res)
                } else {
                    let uri = subfolder.replace(/\.[^.]+$/, '')

                    if (
                        (config.typeFiles.replace(/\s/g, '') !== '' && !types.includes(path.extname(res).toLowerCase())) ||
                        (config.wordLeft.replace(/\s/g, '') !== '' && !uri.startsWith(config.wordLeft)) ||
                        (config.wordRight.replace(/\s/g, '') !== '' && !uri.endsWith(config.wordRight)) ||
                        (config.sizeFiles > 0 && ((stats.size / 1000) > config.sizeFiles))
                    ) {
                        return true
                    }

                    if (subfolder.replace(/\.[^.]+$/, '').replace(/\s/g, '') === '' || path.extname(res).replace(/\s/g, '') === '') {
                        return true
                    }

                    this.count += 1

                    return {
                        id: this.count,
                        path: res,
                        name: subfolder,
                        uri: uri,
                        size: stats.size,
                        type: path.extname(res),
                        dir: path.dirname(res),
                        dirName: path.dirname(res).split('\\').at(-1),
                        changed: stats.mtime,
                        create: stats.birthtime,
                        open: stats.ctime,
                        active: 0,
                        stats
                    }
                }
            }))

            if (this.count > 0) {
                document.querySelector('.gload div').innerHTML = `Прочитано файлов ${this.count}`
            }

            return files.reduce((a, f) => a.concat(f), [])
        } catch (error) {
            return 'Не найдена дирректория'
        }
    }

    trashFiles (files_) {
        let arr = []

        let setCount = files_.length
        let count = files_.length

        document.querySelector('.gdelete__from-pop').style.display = 'flex'
        document.querySelector('.gdelete__from-container').style.display = 'block'

        files_.forEach(async el => {
            try {
                await fs.unlinkSync(String(el.path))
            } catch (e) {
                arr.push(el.name)
            }

            setCount--

            if (arr.length === count) {
                alert('Произошла ошибка. Файлы не были удалены')
                document.querySelector('.gdelete__from-pop').style.display = 'none'
                document.querySelector('.gdelete__from-container').style.display = 'none'
                return false
            }

            document.querySelector(`.file__div-${el.id}`)?.remove()
            document.querySelector('.gdelete div').innerHTML = `Осталось файлов ${setCount}`
            if (setCount === 0) {
                document.querySelector('.gdelete__from-pop').style.display = 'none'
                document.querySelector('.gdelete__from-container').style.display = 'none'
                this.createNotice('Файлы успешно скопированы')
            }
        })
    }

    copyFiles (files_) {
        let arr = []

        let setCount = files_.length
        let count = files_.length

        document.querySelector('.gcopy__from-pop').style.display = 'flex'
        document.querySelector('.gcopy__from-container').style.display = 'block'

        files_.forEach(async el => {
            try {
                await fs.copyFileSync(String(el.path), String(`${this.to}\\${el.name}`))
            } catch (e) {
                arr.push(el.name)
            }

            setCount--

            if (arr.length === count) {
                alert('Произошла ошибка. Файлы не были копированы')
                document.querySelector('.gcopy__from-pop').style.display = 'none'
                document.querySelector('.gcopy__from-container').style.display = 'none'
                return false
            }

            document.querySelector('.gcopy div').innerHTML = `Осталось файлов ${setCount}`
            if (setCount === 0) {
                document.querySelector('.gcopy__from-pop').style.display = 'none'
                document.querySelector('.gcopy__from-container').style.display = 'none'
                this.createNotice('Файлы успешно скопированы')
            }
        })
    }

    renameFiles (files_) {
        let arr = []

        let setCount = files_.length
        let count = files_.length

        document.querySelector('.gtrasf__from-pop').style.display = 'flex'
        document.querySelector('.gtrasf__from-container').style.display = 'block'

        files_.forEach(async el => {
            try {
                await fs.renameSync(String(el.path), String(`${this.to}\\${el.name}`))
            } catch (e) {
                arr.push(el.name)
            }

            setCount--

            if (arr.length === count) {
                alert('Произошла ошибка. Файлы не были перемещены')
                document.querySelector('.gtrasf__from-pop').style.display = 'none'
                document.querySelector('.gtrasf__from-container').style.display = 'none'
                return
            }

            document.querySelector(`.file__div-${el.id}`)?.remove()
            document.querySelector('.gtrasf div').innerHTML = `Осталось файлов ${setCount}`
            if (setCount === 0) {
                document.querySelector('.gtrasf__from-pop').style.display = 'none'
                document.querySelector('.gtrasf__from-container').style.display = 'none'
                this.createNotice('Файлы успешно перемещены')
            }
        })
    }

    getConfig () {
        for (let x in this.db) {
            let tmp = String(Object.keys(this.db[x])[0])
            for (let y in this.db[x]) {
                if (tmp === this.preset) {
                    return this.db[x][y]
                }
            }
        }
    }

    sliceIntoChunks (arr, chunkSize) {
        const res = []
        for (let i = 0; i < arr.length; i += chunkSize) {
            const chunk = arr.slice(i, i + chunkSize)
            res.push(chunk)
        }
        return res
    }

    throttle (callee, timeout) {
        let timer = null
        return function perform (...args) {
            if (timer) return
            timer = setTimeout(() => {
                callee(...args)
                clearTimeout(timer)
                timer = null
            }, timeout)
        }
    }

    async preloadFiles (html) {
        document.querySelector('.file__wrapper')?.remove()

        let wrap = document.createElement('div')
        wrap.classList.add('file__wrapper')
        let tbody = document.createElement('div')
        tbody.id = 'file__tbody'
        tbody.classList.add('file__tbody')
        wrap.append(tbody)

        document.querySelector('.file__context').appendChild(wrap)

        let ul = document.querySelector(this.selector)

        let chuck = []

        if (window.innerHeight <= 665) {
            chuck = this.sliceIntoChunks(html, 10)
        } else {
            chuck = this.sliceIntoChunks(html, 15)
        }

        let countChuck = chuck.length
        let thisChuck = 0
        let prevChuck = 0

        if (countChuck === 0) {
            return false
        }

        if (chuck.length === 1) {
            chuck.forEach(el => {
                el.forEach(t => {
                    ul.append(t)
                })
            })
        } else {
            chuck.forEach((el, i) => {
                if (i === 0) {
                    el.forEach(t => {
                        ul.append(t)
                    })
                    prevChuck = i
                    thisChuck = i + 1
                    countChuck -= 1
                    return false
                }
                return false
            })

            function checkPosition () {
                if (countChuck === 0) {
                    return false
                }

                const height = document.querySelector('.file__context').offsetHeight
                const screenHeight = window.innerHeight

                const scrolled = window.scrollY

                const threshold = height - screenHeight / 4

                const position = scrolled + screenHeight

                if (position >= threshold) {
                    chuck[thisChuck].forEach(el => {
                        let all = document.querySelector('.check__all')

                        if (all.checked) {
                            el.querySelector('input').setAttribute('checked', 'true')
                            el.querySelector('input').checked = true
                        }

                        ul.append(el)
                    })
                    thisChuck += 1
                    countChuck -= 1
                }
            }

            let oldScrollTopPosition = 0

            document.querySelector('.file__context').addEventListener('scroll', this.throttle(() => {
                const scrollTopPosition = document.querySelector('.file__context').scrollTop

                if (scrollTopPosition > oldScrollTopPosition) {
                    checkPosition()
                }

                oldScrollTopPosition = scrollTopPosition
            }, 100))
            window.addEventListener('resize', this.throttle(checkPosition, 100))
        }
    }

    renderFiles (el, act = 1) {
        this.baseDir = this.from.split('\\').at(-1)

        try {
            let config = this.getConfig()

            let types = config.typeFiles.replace(/\s/g, '').split(/,|-/)

            if (this.remember.includes(el.uri) && act === 1) {
                el.active = 1
            } else {
                el.active = 0
            }

            if (act === 1) {
                this.regexp.forEach(t => {
                    let regexp = new RegExp(`^${t}\\s+([^\n]+)$`, 'gi')
                    if (regexp.test(el.name)) {
                        el.active = 1
                        return false
                    }
                })
            }




            let time = new Date(el.changed).toLocaleString('ru', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                timezone: 'UTC'
            })

            let size = 0

            if ((el.size / 100) <= 100) {
                size = `${this.mb_strimwidth(String((el.size / 100).toFixed(0)), 0, 15, '...')} КБ`
            } else if ((el.size / 1000) <= 1000) {
                size = `${this.mb_strimwidth(String((el.size / 1000).toFixed(0)), 0, 15, '...')} КБ`
            } else {
                size = `${this.mb_strimwidth(String((el.size / 1000 / 1000).toFixed(2)), 0, 15, '...')} МБ`
            }

            let low = el.type.toLowerCase()

            let type = `<img src="${path.join(__dirname, '../../public/img/png/file.png')}" />`

            let img = path.join(__dirname, '../../public/img/png/file.png')

            this.typeFiles.forEach(el => {
                if (el.type.includes(low)) {
                    type = el.img
                    img = path.join(__dirname, el.path)
                }
            })

            this.countRender += 1

            document.querySelector('.search__result').innerHTML = `Найдено ${this.countRender} файлов`

            let context = `
            <div class="user-select-none context__file context__${el.id}">
                <div class="user-select-none context__list context__list-sub">
                    <div class="user-select-none context__item-none">${this.mb_strimwidth(el.name, 0, 28, '...')}</div>
                </div>
                <!-- <div class="user-select-none context__list">
                    <div class="context__item"><i class="fa-regular fa-ban"></i> Снять выделение</div>
                    <div class="context__item"><i class="fa-regular fa-hashtag"></i> Переименовать</div>

                </div>-->
                <div class="user-select-none context__list context__list-sub">
                   <div class="context__item context__del"><i class="fa-regular fa-trash"></i> Удалить</div>
                    <div class="context__item create__props"><i class="fa-regular fa-gear"></i> Свойства</div>
                </div>
            </div>
            `

            let html = document.createElement('div')
            html.classList.add('file__div', `file__div-${el.id}`)

            if (el.active === 1) {
                html.innerHTML = `

                <div class="file__parent file__parent-${el.id}">
                ${context}
                <label class="file__table-ctx file__ctx-${el.id}" for="file__${el.id}"
                data-id="${el.id}"
                data-name="${el.name}"
                data-path="${el.path}"
                >
                <div class="file__table-temp">
                        <div class="container">
                            <div class="sort__check">
                                <div class="checkbox__wrap">
                                    <input type="checkbox" class="files checkbox__files custom-checkbox" name="file__${el.id}" id="file__${el.id}" value="${el.id}
                                    data-id="${el.id}"
                                    data-path="${el.path}"
                                    data-name="${el.name}"
                                    data-type="${el.type}"
                                    data-size="${el.size}"
                                    data-dir="${el.dir}"
                                    data-create="${el.create}"
                                    data-open="${el.open}"
                                    data-psize="${size}"
                                    data-time="${el.changed}"
                                    data-ptime="${time}
                                    data-asize="${size}"
                                    data-img="${img}"
                                    ${el.active === 1 ? 'checked' : ''}
                                    />
                                    <label class="checkbox__label" for="file__${el.id}"></label>
                                </div>
                            </div>
                            <span class="sort__name">
                                ${type}
                                ${this.mb_strimwidth(el.dirName === this.baseDir ? el.name : el.dirName + '/' + el.name, 0, 50, '...')}
                            </span>
                            <span class="sort__size">${size}</span>
                            <span class="sort__type">${this.mb_strimwidth(el.type, 0, 10, '...')}</span>
                            <span class="sort__time">${time}</span>
                            <span class="sort__more"></span>
                        </div>
                    </div>
                </label>
                </div>

                `
                this.activeFiles = 1
                this.activeList.push({
                    id: el.id,
                    name: el.name,
                    path: el.path
                })
                return {
                    html,
                    active: 1
                }
            } else {
                html.innerHTML = `

                <div class="file__parent file__parent-${el.id}">
                ${context}
                <label class="file__table-ctx file__ctx-${el.id}" for="file__${el.id}"
                data-id="${el.id}"
                data-name="${el.name}"
                data-path="${el.path}"
                >

                    <div class="file__table-temp">
                        <div class="container">

                             <div class="sort__check">
                                <div class="checkbox__wrap">
                                    <input type="checkbox" class="files checkbox__files custom-checkbox" name="file__${el.id}" id="file__${el.id}" value="${el.id}
                                    data-id="${el.id}"
                                    data-path="${el.path}"
                                    data-name="${el.name}"
                                    data-type="${el.type}"
                                    data-size="${el.size}"
                                    data-dir="${el.dir}"
                                    data-create="${el.create}"
                                    data-open="${el.open}"
                                    data-psize="${size}"
                                    data-time="${el.changed}"
                                    data-ptime="${time}
                                    data-asize="${size}"
                                    data-img="${img}"
                                    />
                                    <label class="checkbox__label" for="file__${el.id}"></label>
                                </div>
                            </div>

                            <span class="sort__name">
                                ${type}
                                ${this.mb_strimwidth(el.dirName === this.baseDir ? el.name : el.dirName + '/' + el.name, 0, 50, '...')}
                            </span>
                            <span class="sort__size">${size}</span>
                            <span class="sort__type">${this.mb_strimwidth(el.type, 0, 10, '...')}</span>
                            <span class="sort__time">${time}</span>
                            <span class="sort__more"></span>
                        </div>
                    </div>
                </label>
                </div>


            `
                return {
                    html,
                    active: 0
                }
            }
        } catch (e) {

        }
    }

    async searchFiles (text, column, type) {
        this.countRender = 0

        this.activeFiles = 0
        this.activeList = []

        let files_ = this.files
        let all = this.files.length
        let count = 0

        if (this.activeFilesSort.length > 0) {
            files_ = this.activeFilesSort
        } else {
            files_ = this.files
        }

        if ((column >= 1 && column <= 4) && (type >= 1 && type <= 2)) {
            let name = document.querySelector('.sort__name')
            let size = document.querySelector('.sort__size')
            let file = document.querySelector('.sort__type')
            let time = document.querySelector('.sort__time')

            document.querySelectorAll('.sort__item').forEach(el => {
                el.classList.remove('sort__active')
                if (el.parentNode.querySelector('.sort__arrow')) {
                    el.parentNode.querySelector('.sort__arrow').remove()
                }
            })

            if (column === 1 && type === 1) {
                files_.sort((x, y) => x.name > y.name ? 1 : -1)
                name.classList.add('sort__active')
                name.innerHTML += '<i class="fa-solid fa-caret-down sort__arrow"></i>'
            } else if (column === 1 && type === 2) {
                files_.sort((x, y) => x.name < y.name ? 1 : -1)
                name.classList.add('sort__active')
                name.innerHTML += '<i class="fa-solid fa-caret-up sort__arrow"></i>'
            } else if (column === 2 && type === 1) {
                files_.sort((x, y) => x.size > y.size ? 1 : -1)
                size.classList.add('sort__active')
                size.innerHTML += '<i class="fa-solid fa-caret-down sort__arrow"></i>'
            } else if (column === 2 && type === 2) {
                files_.sort((x, y) => x.size < y.size ? 1 : -1)
                size.classList.add('sort__active')
                size.innerHTML += '<i class="fa-solid fa-caret-up sort__arrow"></i>'
            } else if (column === 3 && type === 1) {
                files_.sort((x, y) => x.type > y.type ? 1 : -1)
                file.classList.add('sort__active')
                file.innerHTML += '<i class="fa-solid fa-caret-down sort__arrow"></i>'
            } else if (column === 3 && type === 2) {
                files_.sort((x, y) => x.type < y.type ? 1 : -1)
                file.classList.add('sort__active')
                file.innerHTML += '<i class="fa-solid fa-caret-up sort__arrow"></i>'
            } else if (column === 4 && type === 1) {
                files_.sort((x, y) => x.changed > y.changed ? 1 : -1)
                time.classList.add('sort__active')
                time.innerHTML += '<i class="fa-solid fa-caret-down sort__arrow"></i>'
            } else if (column === 4 && type === 2) {
                files_.sort((x, y) => x.changed < y.changed ? 1 : -1)
                time.classList.add('sort__active')
                time.innerHTML += '<i class="fa-solid fa-caret-up sort__arrow"></i>'
            }
        }

        this.activeFilesSort = []

        if (text.replace(/\s/g, '') === '') {
            await this.preloadFiles(this.htmlFiles)
            document.querySelector('.search__result').innerHTML = `Найдено ${this.files.length} файлов`
            this.mod = 0
        } else {
            await Promise
                .all(files_.filter(el => el.name.toLowerCase().search(text.toLowerCase()) !== -1).map(async (el) => {
                    this.activeFilesSort.push(el)
                    count++
                    return this.renderFiles(el, 0)
                }))
                .then(async e => this.preloadFiles(e.reduce((a, f) => a.concat(f), []).map(el => el.html)))
            this.mod = 1
            document.querySelector('.search__result').innerHTML = `Найдено ${this.activeFilesSort.length} файлов по запросу ${text}`
        }
    }

    async sortFiles (column, type) {
        this.countRender = 0

        this.activeFiles = 0
        this.activeList.length = 0

        let files_ = this.files
        let count = this.files.length

        if (this.activeFilesSort.length > 0) { files_ = this.activeFilesSort }

        if ((column >= 1 && column <= 4) && (type >= 1 && type <= 2)) {
            let name = document.querySelector('.sort__name')
            let size = document.querySelector('.sort__size')
            let file = document.querySelector('.sort__type')
            let time = document.querySelector('.sort__time')

            document.querySelectorAll('.sort__item').forEach(el => {
                el.classList.remove('sort__active')
                if (el.parentNode.querySelector('.sort__arrow')) {
                    el.parentNode.querySelector('.sort__arrow').remove()
                }
            })

            if (column === 1 && type === 1) {
                files_.sort((x, y) => x.name > y.name ? 1 : -1)
                name.classList.add('sort__active')
                name.innerHTML += '<i class="fa-solid fa-caret-down sort__arrow"></i>'
            } else if (column === 1 && type === 2) {
                files_.sort((x, y) => x.name < y.name ? 1 : -1)
                name.classList.add('sort__active')
                name.innerHTML += '<i class="fa-solid fa-caret-up sort__arrow"></i>'
            } else if (column === 2 && type === 1) {
                files_.sort((x, y) => x.size > y.size ? 1 : -1)
                size.classList.add('sort__active')
                size.innerHTML += '<i class="fa-solid fa-caret-down sort__arrow"></i>'
            } else if (column === 2 && type === 2) {
                files_.sort((x, y) => x.size < y.size ? 1 : -1)
                size.classList.add('sort__active')
                size.innerHTML += '<i class="fa-solid fa-caret-up sort__arrow"></i>'
            } else if (column === 3 && type === 1) {
                files_.sort((x, y) => x.type > y.type ? 1 : -1)
                file.classList.add('sort__active')
                file.innerHTML += '<i class="fa-solid fa-caret-down sort__arrow"></i>'
            } else if (column === 3 && type === 2) {
                files_.sort((x, y) => x.type < y.type ? 1 : -1)
                file.classList.add('sort__active')
                file.innerHTML += '<i class="fa-solid fa-caret-up sort__arrow"></i>'
            } else if (column === 4 && type === 1) {
                files_.sort((x, y) => x.changed > y.changed ? 1 : -1)
                time.classList.add('sort__active')
                time.innerHTML += '<i class="fa-solid fa-caret-down sort__arrow"></i>'
            } else if (column === 4 && type === 2) {
                files_.sort((x, y) => x.changed < y.changed ? 1 : -1)
                time.classList.add('sort__active')
                time.innerHTML += '<i class="fa-solid fa-caret-up sort__arrow"></i>'
            }
        }

        await Promise
            .all(files_.map(async (el) => await this.renderFiles(el, 0)))
            .then(e => this.preloadFiles(e.reduce((a, f) => a.concat(f), []).map(el => el.html)))
    }

    async updatePath () {
        this.countRender = 0

        document.querySelector('.gload__from-pop').style.display = 'flex'
        document.querySelector('.gload__from-container').style.display = 'block'

        this.activeFiles = 0
        this.activeList.length = 0
        this.activeFilesSort.length = 0

        this.count = 0

        this.bindScroll = 1

        this.mod = 0

        console.time('ReadFiles')

        await this.readFiles(this.from).then(async (e) => {
            console.timeEnd('ReadFiles')

            document.querySelector('.gload__from-pop').style.display = 'none'
            document.querySelector('.gload__from-container').style.display = 'none'

            if (typeof e !== 'object') {
                let name = ''
                for (let x in this.db) {
                    let tmp = String(Object.keys(this.db[x])[0])
                    for (let y in this.db[x]) {
                        if (tmp === this.getPreset()) {
                            name = this.db[x][y].name
                            break
                        }
                    }
                }

                document.querySelector('#preset__letter-name').value = name

                document.querySelector('.preset__letter-pop').style.display = 'flex'
                document.querySelector('.preset__letter-container').style.display = 'block'

                return false
            }

            let files_ = e.filter(x => typeof x === 'object')
            let count = files_.length

            this.files = files_

            document.querySelectorAll('.sort__item').forEach(el => {
                el.classList.remove('sort__active')
                if (el.parentNode.querySelector('.sort__arrow')) {
                    el.parentNode.querySelector('.sort__arrow').remove()
                }
            })

            document.querySelector('.global__button-danger').style.display = 'none'
            document.querySelector('.need__block > div').innerHTML = ''

            document.querySelector('.sort__name').classList.add('sort__active')
            document.querySelector('.sort__name').innerHTML += '<i class="fa-solid fa-caret-down sort__arrow"></i>'

            let rem = []

            let setCount = count

            document.querySelector('.load__from-pop').style.display = 'flex'
            document.querySelector('.load__from-container').style.display = 'block'

            console.time('RenderFiles')

            await Promise.all(files_.map(async (el) => {
                setCount--
                document.querySelector('.load__block div').innerHTML = `Осталось файлов ${setCount}`
                rem.push(el.uri)
                if (setCount === 0) {
                    document.querySelector('.load__from-pop').style.display = 'none'
                    document.querySelector('.load__from-container').style.display = 'none'
                }
                return this.renderFiles(el)
            })).then(e => {
                this.htmlFiles = e.reduce((a, f) => a.concat(f), []).sort(x => x.active === 1 ? -1 : 1).map(el => el.html)
                this.preloadFiles(e.reduce((a, f) => a.concat(f), []).sort(x => x.active === 1 ? -1 : 1).map(el => el.html))
            })

            console.timeEnd('RenderFiles')

            let heed = []

            this.remember.forEach(el => {
                if (!rem.includes(el)) {
                    heed.push(el)
                }
            })

            if (heed.length > 0) {
                document.querySelector('.global__button-danger').style.display = 'block'
                heed.forEach(el => document.querySelector('.need__block > div').innerHTML += `${el}; `)
            }

            if (this.activeFiles === 1) {
                document.querySelector('.search__result').innerHTML = `Выбрано ${this.activeList.length} файлов`
                document.querySelector('.global__button-tran').style.display = 'flex'
            }
        })
    }

    updateRemember () {
        document.querySelector('.remember__list').innerHTML = ''
        let id = 0
        for (let x in this.db) {
            let tmp = String(Object.keys(this.db[x]))
            if (tmp === this.preset) {
                for (let y in this.db[x]) {
                    this.remember = this.db[x][y].remember
                    this.db[x][y].remember.forEach((el, i) => {
                        id++
                        document.querySelector('.remember__list').innerHTML += `
                        <div class="remember__item remember__item-${id}">
                            <span>${el}</span>
                            <button
                                class="remember__item-bth remember__item-bth-${id}"
                                data-preset="${tmp}"
                                data-id="${id}"
                                data-name="${el}"
                            ><i class="fa-regular fa-trash"></i></button>
                        </div>
                    `
                    })
                }
            }
        }
    }

    updateRegexp () {
        document.querySelector('.regexp__list').innerHTML = ''
        let id = 0
        for (let x in this.db) {
            let tmp = String(Object.keys(this.db[x]))
            if (tmp === this.preset) {
                for (let y in this.db[x]) {
                    this.regexp = this.db[x][y].regexp
                    this.db[x][y].regexp.forEach((el, i) => {
                        id++
                        document.querySelector('.regexp__list').innerHTML += `
                        <div class="regexp__item regexp__item-${id}">
                            <span>${el}</span>
                            <button
                                class="regexp__item-bth regexp__item-bth-${id}"
                                data-preset="${tmp}"
                                data-id="${id}"
                                data-name="${el}"
                            ><i class="fa-regular fa-trash"></i></button>
                        </div>
                    `
                    })
                }
            }
        }
    }

    updatePreset () {
        document.querySelector('.preset__list').innerHTML = ''
        for (let x in this.db) {
            let tmp = String(Object.keys(this.db[x])[0])
            for (let y in this.db[x]) {
                document.querySelector('.preset__list').innerHTML += `
                    <div class="preset__item-wrap">
                        <div class="radio__wrap preset__item">
                            <input type="radio" class="preset custom-radio" name="preset" id="${tmp}" value="${this.db[x][y].name}" ${tmp === this.preset ? 'checked' : ''}
                                    data-from="${this.db[x][y].pathFrom}"
                                    data-to="${this.db[x][y].pathTo}"
                                    data-id="${tmp}"
                                    data-remember="${this.db[x][y].remember}"
                                    data-regexp="${this.db[x][y].regexp}"
                                    data-db=\'${JSON.stringify(this.db[x][y])}\'
                                    />
                            <label class="radio__label" for="${tmp}">${this.db[x][y].name}</label>
                        </div>

                        <div>
                            ${tmp !== 'start'
        ? `<i class="trash__preset fa-regular fa-trash trash__preset-${tmp}"
                                data-id="${tmp}"
                            ></i>`
        : ''}
                            <i class="fa-regular fa-wrench setting__preset-${tmp}"></i>

                        </div>
                    </div>
                `
            }
        }
    }

    updateDB (db) {
        this.db = db
    }

    getActiveList () {
        return {
            active: this.activeFiles,
            list: this.activeList
        }
    }

    getPreset () {
        return this.preset
    }

    getCountFiles () {
        if (this.mod === 0) {
            return this.files.length
        } else {
            return this.activeFilesSort.length
        }
    }

    getFiles () {
        if (this.mod === 0) {
            return this.files
        } else {
            return this.activeFilesSort
        }
    }

    updateFiles (files) {
        this.files = files
    }

    startPreset (preset = 'start') {
        this.preset = preset
    }

    setPreset (id = '', from = '', to = '', remember = [], regexp = []) {
        if (id.trim() === '') { this.preset = 'start' } else {
            this.preset = id
            this.from = from
            this.to = to
            this.remember = remember
            this.regexp = regexp
            this.loadFiles()
        }
    }

    setRemember (files) {
        this.remember.push(String(files))
    }

    setMod (val = 0) {
        this.mod = val
    }

    setPathTo (val) {
        this.to = val
    }

    setPathFrom (val) {
        this.from = val
    }

    cleanActiveList () {
        this.activeFiles = 0
        this.activeList = []
    }

    setReadSubfolders (val) {
        this.readSubfolders = val
    }

    cleanBase () {
        document.querySelector(this.selector).innerHTML = ''
        document.querySelector('.remember__list').innerHTML = ''
        document.querySelector('.preset__list').innerHTML = ''

        document.querySelector('.check__all').removeAttribute('checked')
        document.querySelector('.check__all').checked = false

        document.querySelector('.home__path').innerHTML = ''
        document.querySelector('.home__to').innerHTML = ''

        document.querySelector('.global__from').value = ''
        document.querySelector('.global__to').value = ''
        document.querySelector('.global__preset').value = ''
        document.querySelector('.global__remember').value = ''

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

        this.db = []
        this.selector = ''
        this.from = ''
        this.to = ''
        this.preset = 'start'
        this.activeFilesSort.length = 0
        this.activeList.length = 0
        this.activeFiles = 0
        this.remember.length = 0
        this.count = 0
        this.files.length = 0
    }

    setTheme (val = 'dark') {
        document.documentElement.setAttribute('theme', val)

        if (val === 'light') {
            document.querySelector('.setting-button').innerHTML = '<i class="fa-regular fa-brightness"></i>'
        } else if (val === 'dark') {
            document.querySelector('.setting-button').innerHTML = '<i class="fa-light fa-moon-cloud"></i>'
        }
    }

    setLang (val = 'ru') {
        document.documentElement.setAttribute('lang', val)

        if (val === 'ru') {
            document.querySelector('.lang-button').innerHTML = '<span>RU</span>'
        } else if (val === 'en') {
            document.querySelector('.lang-button').innerHTML = '<span>EN</span>'
        }
    }

    async loadFiles () {
        this.count = 0

        let path = ''
        let to = ''
        let preset = ''

        for (let x in this.db) {
            for (let y in this.db[x]) {
                preset = String(Object.keys(this.db[x])[0])
                if (preset === this.preset) {
                    path = this.db[x][y].pathFrom
                    to = this.db[x][y].pathTo
                }
            }
        }

        this.from = String(path)
        this.to = String(to)

        document.querySelector('.home__path').innerHTML = this.from
        document.querySelector('.home__to').innerHTML = this.to

        document.querySelector('.global__from').value = this.from
        document.querySelector('.global__to').value = this.to
        document.querySelector('.global__preset').value = this.preset
        document.querySelector('.global__remember').value = this.remember

        this.updateRemember()
        this.updateRegexp()
        this.updatePreset()
        await this.updatePath()
    }
}

module.exports = Files
