'use strict'

const path = require('path'),
      fs   = require('fs'),
      { promisify } = require('util'),
      { resolve } = require('path')

const readdir = promisify(fs.readdir)
const stat = promisify(fs.stat)

let { COPYFILE_EXCL } = fs.constants

class Files {

    constructor(db, selector, from = '', to = '', remember = [], count = 0, files = [], readSubfolders = 1, activeFiles = 0, activeList = [], countRender = 0) {
        this.db = db
        this.selector = selector
        this.from = from
        this.to = to
        this.preset = 'start'
        this.activeFiles = []
        this.remember = remember
        this.count = count
        this.files = files
        this.readSubfolders = readSubfolders
        this.activeFiles = activeFiles
        this.activeList = activeList
        this.countRender = countRender
    }

    mb_strwidth (str) {
        let i = 0,
            l = str.length,
            c = '',
            length = 0;
        for(; i < l; i++){
            c = str.charCodeAt(i);
            if (0x0000 <= c && c <= 0x0019) {
                length += 0;
            } else if (0x0020 <= c && c <= 0x1FFF){
                length += 1;
            } else if (0x2000 <= c && c <= 0xFF60){
                length += 2;
            } else if (0xFF61 <= c && c <= 0xFF9F){
                length += 1;
            } else if (0xFFA0 <= c){
                length += 2;
            }
        }
        return length;
    };

    mb_strimwidth (str, start, width, trimmarker) {
        if (typeof trimmarker === 'undefined') trimmarker = '';
        let trimmakerWidth = this.mb_strwidth(trimmarker),
            i = start,
            l = str.length,
            trimmedLength = 0,
            trimmedStr = ''

        for( ; i < l; i++){
            let charCode = str.charCodeAt(i),
                c = str.charAt(i),
                charWidth = this.mb_strwidth(c),
                next = str.charAt(i + 1),
                nextWidth = this.mb_strwidth(next)
            trimmedLength += charWidth
            trimmedStr += c
            if (trimmedLength + trimmakerWidth + nextWidth > width) {
                trimmedStr += trimmarker
                break
            }
        }
        return trimmedStr
    }

    createNotice(text, id = 0) {
        const notice = document.createElement('div')
        notice.className = 'alert__block'
        notice.id = `alert-${id}`
        notice.innerHTML = `
            <i class="fa-light fa-bell-on"></i>
            <span>${text}</span>
        `

        let wrap = document.querySelector('#notice__wrapper')

        wrap.prepend(notice)

        setTimeout(() => {
            notice.remove()
        }, 3000)
    }

    async readFiles(from = '') {

        let subfolders = await readdir(from)

        let config = this.getConfig()

        let types = config.typeFiles.replace(/\s/g,'').split(/,|-/)

        const files = await Promise.all(subfolders.map(async (subfolder) => {

            const res = resolve(from, subfolder),
                  stats = await stat(res)

            if (stats.isDirectory() && this.readSubfolders === 1) {
                return this.readFiles(res)
            } else {


                if (
                    (config.typeFiles.replace(/\s/g,'') !== '' && !types.includes(path.extname(res).toLowerCase()))
                    || (config.wordLeft.replace(/\s/g,'') !== '' && !subfolder.replace(/\.[^.]+$/, '').startsWith(config.wordLeft))
                    || (config.wordRight.replace(/\s/g,'') !== '' && !subfolder.replace(/\.[^.]+$/, '').endsWith(config.wordRight))
                    || (config.sizeFiles > 0 && ((stats.size / 1000) > config.sizeFiles))
                ) {
                    return true
                } else {

                }

                this.count += 1

                return {
                    id: this.count,
                    path: res,
                    name: subfolder,
                    uri: subfolder.replace(/\.[^.]+$/, ''),
                    size: stats.size,
                    type: path.extname(res),
                    changed: stats.ctime,
                    active: 0,
                    stats: stats,
                }
            }
        }));

        if (this.count > 0) {
            document.querySelector('.gload div').innerHTML = `Прочитано файлов ${this.count}`
        }

        return files.reduce((a, f) => a.concat(f), [])
    }

    trashFiles(files_) {
        let arr = []

        let setCount = files_.length

        document.querySelector('.gdelete__from-pop').style.display = 'flex'
        document.querySelector('.gdelete__from-container').style.display = 'block'

        files_.forEach(async (el, i) => {
            await new Promise((resolve, reject) => {
                fs.unlink(String(el.path), err => {
                    if (err) arr.push(el.name)
                    setCount--
                    document.querySelector(`.file__ctx-${el.id}`)?.remove()
                    document.querySelector('.gdelete div').innerHTML = `Осталось файлов ${setCount}`
                    if (setCount === 0) {
                        document.querySelector('.gdelete__from-pop').style.display = 'none'
                        document.querySelector('.gdelete__from-container').style.display = 'none'
                        setTimeout(() => {
                            this.createNotice('Файлы успешно удалены')
                        }, 100)
                    }
                })
            })
        })
    }

    copyFiles(files_) {
        let arr = []

        let setCount = files_.length

         document.querySelector('.gcopy__from-pop').style.display = 'flex'
         document.querySelector('.gcopy__from-container').style.display = 'block'

         files_.forEach(async (el, i) => {
             await new Promise((resolve, reject) => {
                 fs.copyFile(String(el.path), String(`${this.to}\\${el.name}`), COPYFILE_EXCL, err => {
                     if (err) arr.push(el.name)
                     setCount--
                     document.querySelector('.gcopy div').innerHTML = `Осталось файлов ${setCount}`
                     if (setCount === 0) {
                         document.querySelector('.gcopy__from-pop').style.display = 'none'
                         document.querySelector('.gcopy__from-container').style.display = 'none'
                         setTimeout(() => {
                             this.createNotice('Файлы успешно скопированы')
                         }, 100)
                     }
                 });
             })
         })
    }

    renameFiles(files_) {
        let arr = []

        let setCount = files_.length

        document.querySelector('.gtrasf__from-pop').style.display = 'flex'
        document.querySelector('.gtrasf__from-container').style.display = 'block'

        files_.forEach(async (el, i) => {
            await new Promise((resolve, reject) => {
                fs.rename(String(el.path), String(`${this.to}\\${el.name}`), err => {
                    if (err) arr.push(el.name)
                    setCount--
                    document.querySelector(`.file__ctx-${el.id}`)?.remove()
                    document.querySelector('.gtrasf div').innerHTML = `Осталось файлов ${setCount}`
                    if (setCount === 0) {
                        document.querySelector('.gtrasf__from-pop').style.display = 'none'
                        document.querySelector('.gtrasf__from-container').style.display = 'none'
                        setTimeout(() => {
                            this.createNotice('Файлы успешно перемещены')
                        }, 100)
                    }
                })
            })
        })
    }

    getConfig() {
        for (let x in this.db) {
            let tmp = String(Object.keys(this.db[x])[0])
            for (let y in this.db[x]) {
                if (tmp === this.preset) {
                    return this.db[x][y]
                }
            }
        }
    }

    renderFiles(ul, el, act = 1) {

        try {

            let config = this.getConfig()

            let types = config.typeFiles.replace(/\s/g,'').split(/,|-/)

            if (this.remember.includes(el.uri) && act === 1) {
                el.active = 1
            } else {
                el.active = 0
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

            if (low === '.docx' || low === '.doc' || low === '.docm' || low === 'dot' || low === '.rtf')
                type = `<img src="${path.join(__dirname, '../../public/img/png/word.png')}" />`

            if (low === '.pdf')
                type = `<img src="${path.join(__dirname, '../../public/img/png/pdf.png')}" />`

            if (low === '.pptx' || low === '.pptm' || low === 'ppt.ppt')
                type = `<img src="${path.join(__dirname, '../../public/img/png/powerpoint.png')}" />`

            if (low === '.accdb' || low === '.mdb'|| low === '.crypt' || low === '.dat'
                || low === '.sdf' || low === '.mdf' || low === '.sqlite' || low === '.sqlite3')
                type = `<img src="${path.join(__dirname, '../../public/img/png/access.png')}" />`

            if (low === '.sql' || low === '.db' || low === '.json')
                type = `<img src="${path.join(__dirname, '../../public/img/png/database.png')}" />`

            if (low === '.xls' || el.type === '.xlsx' || low === '.xlsm' || low === '.xlsb' || low === '.xlsx')
                type = `<img src="${path.join(__dirname, '../../public/img/png/excel.png')}" />`

            if (low === '.zip' || low === '.7z' || low === '.cab' || low === '.tar' || low === '.deb' || low === '.ace' || low === '.pak' || low === '.rar')
                type = `<img src="${path.join(__dirname, '../../public/img/png/archive.png')}" />`

            if (low === '.png' || low === '.jpeg' || low === '.jpg' || low === '.ico' || el.type === '.pict' || el.type === '.gif' || low === '.bmp'
                || low === '.jfif' || low === '.webm' || low === '.tif')
                type = `<img src="${path.join(__dirname, '../../public/img/png/picture.png')}" />`

            if (low === '.mp3' || low === '.mp4' || low === '.m4a' || low === '.wav' || low === '.wma' || el.type === '.aif' || low === '.ac3'
                || low === '.amr' || low === '.avi' || low === '.mov')
                type = `<img src="${path.join(__dirname, '../../public/img/png/audio.png')}" />`

            this.countRender += 1

            document.querySelector('.search__result').innerHTML = `Найдено ${this.countRender} файлов`

            if (el.active === 1) {
                let label = document.createElement('label')
                label.className = `file__table-ctx file__ctx-${el.id}`
                label.for = `file__${el.id}`
                label.dataset.id = el.id
                label.dataset.name = el.name
                label.dataset.path = el.path
                label.innerHTML = `
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
                                    data-psize="${size}"
                                    data-time="${el.changed}"
                                    data-ptime="${time}"
                                    ${el.active === 1 ? 'checked' : ''}
                                    />
                                    <label class="checkbox__label" for="file__${el.id}"></label>
                                </div>
                            </div>
                            <span class="sort__name">
                                ${type}
                                ${this.mb_strimwidth(el.name, 0, 40, '...')}
                            </span>
                            <span class="sort__size">${size}</span>
                            <span class="sort__type">${this.mb_strimwidth(el.type, 0, 10, '...')}</span>
                            <span class="sort__time">${time}</span>
                            <span class="sort__more"></span>
                        </div>
                    </div>
            `
                ul.prepend(label)
                this.activeFiles = 1
                this.activeList.push({
                    id: el.id,
                    name: el.name,
                    path: el.path,
                })

            } else {
                ul.innerHTML += `
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
                                    data-psize="${size}"
                                    data-time="${el.changed}"
                                    data-ptime="${time}"
                                    />
                                    <label class="checkbox__label" for="file__${el.id}"></label>
                                </div>
                            </div>
                       
                            <span class="sort__name">
                                ${type}
                                ${this.mb_strimwidth(el.name, 0, 40, '...')}
                            </span>
                            <span class="sort__size">${size}</span>
                            <span class="sort__type">${this.mb_strimwidth(el.type, 0, 10, '...')}</span>
                            <span class="sort__time">${time}</span>
                            <span class="sort__more"></span>
                        </div>
                    </div>
                </label>
            `
            }
        } catch (e) {

        }

    }

    getRenderFiles() {
        let target = document.querySelector(this.selector)

        let files_ = []

        target.querySelectorAll('input').forEach(el => {
            let e = el.dataset
            files_.push({
                id: e.id,
                path: e.path,
                name: e.name,
                type: e.type,
                size: e.size,
                psize: e.psize,
                time: e.time,
                ptime: e.ptime
            })
        })

        return files_
    }

    searchFiles (text, column, type) {

        this.countRender = 0

        this.activeFiles = 0
        this.activeList = []

        let files_ = this.files,
            all = this.files.length,
            count = 0

        let ul = document.querySelector(this.selector)

        ul.innerHTML = ''

        if ((column >= 1 && column <= 4) && (type >= 1 && type <= 2)) {
            let name = document.querySelector('.sort__name'),
                size = document.querySelector('.sort__size'),
                file = document.querySelector('.sort__type'),
                time = document.querySelector('.sort__time')

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

        this.activeFiles = []

        let setCount = all

        if (all > 250) {

            files_.forEach(async (el, i) => {
                await new Promise((resolve, reject) => {
                    resolve(setTimeout(() => {
                        if (el.name.toLowerCase().search(text.toLowerCase()) !== -1) {
                            this.activeFiles.push(el)
                            count++
                            setCount--
                            document.querySelector('.load__block div').innerHTML = `Осталось файлов ${setCount}`
                            this.renderFiles(ul, el, 0)
                            if (setCount === 0) {
                                document.querySelector('.load__from-pop').style.display = 'none'
                                document.querySelector('.load__from-container').style.display = 'none'
                            }
                        }
                    }, 50))

                })


            })
        } else {
            files_.forEach((el, i) => {

                if (el.name.toLowerCase().search(text.toLowerCase()) !== -1) {

                    this.activeFiles.push(el)

                    count++

                    this.renderFiles(ul, el, 0)
                }

            })
        }


        document.querySelector('.search__result').innerHTML = `Найдено ${this.activeFiles.length} файлов по запросу ${text}`

    }

    sortFiles(column, type) {

        this.countRender = 0

        this.activeFiles = 0
        this.activeList = []

        let files_ = this.files,
            count = this.files.length

        let ul = document.querySelector(this.selector)

        ul.innerHTML = ''

        if (this.activeFiles.length > 0)
            files_ = this.activeFiles

        if ((column >= 1 && column <= 4) && (type >= 1 && type <= 2)) {
            let name = document.querySelector('.sort__name'),
                size = document.querySelector('.sort__size'),
                file = document.querySelector('.sort__type'),
                time = document.querySelector('.sort__time')

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

        let setCount = count

        if (count > 250) {
            document.querySelector('.load__from-pop').style.display = 'flex'
            document.querySelector('.load__from-container').style.display = 'block'

            files_.forEach(async (el, i) => {
                await new Promise((resolve, reject) => {
                    resolve(setTimeout(() => {
                        setCount--
                        document.querySelector('.load__block div').innerHTML = `Осталось файлов ${setCount}`

                        this.renderFiles(ul, el, 0)

                        if (setCount === 0) {
                            document.querySelector('.load__from-pop').style.display = 'none'
                            document.querySelector('.load__from-container').style.display = 'none'
                        }
                    }, 50))
                })
            })

        } else {
            files_.forEach((el) => {

                this.renderFiles(ul, el, 0)

            })
        }

    }

    async updatePath () {

        this.countRender = 0

        document.querySelector('.gload__from-pop').style.display = 'flex'
        document.querySelector('.gload__from-container').style.display = 'block'

        this.activeFiles = 0
        this.activeList = []

        await this.readFiles(this.from).then((e) => {

            document.querySelector('.gload__from-pop').style.display = 'none'
            document.querySelector('.gload__from-container').style.display = 'none'

            let files_ = e.filter(x => typeof x === 'object'),
                count = files_.length

            this.files = files_

            let ul = document.querySelector(this.selector)

            ul.innerHTML = ''

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

            if (count > 250) {

                document.querySelector('.load__from-pop').style.display = 'flex'
                document.querySelector('.load__from-container').style.display = 'block'

                files_.forEach(async (el, i) => {
                    await new Promise((resolve, reject) => {
                        resolve(setTimeout(() => {
                            setCount--
                            document.querySelector('.load__block div').innerHTML = `Осталось файлов ${setCount}`
                            rem.push(el.name)
                            this.renderFiles(ul, el)
                            if (setCount === 0) {
                                document.querySelector('.load__from-pop').style.display = 'none'
                                document.querySelector('.load__from-container').style.display = 'none'
                            }
                        }, 50))
                    })

                })

            } else {
                files_.forEach((el, i) => {
                    rem.push(el.uri)
                    this.renderFiles(ul, el)
                })
            }

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

    updateRemember() {
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

    updatePreset() {
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
                                    data-db=\'${JSON.stringify(this.db[x][y])}\'
                                    />
                            <label class="radio__label" for="${tmp}">${this.db[x][y].name}</label>
                        </div>
                 
                        <div>
                            ${tmp !== 'start' ? `<i class="trash__preset fa-regular fa-trash trash__preset-${tmp}"
                                data-id="${tmp}"
                            ></i>` : ''}
                            <i class="fa-regular fa-wrench setting__preset-${tmp}"></i>
                           
                        </div>
                    </div>
                `
            }
        }
    }

    startPreset(preset = 'start') {
        this.preset = preset
    }

    setPreset(id = '', from = '', to = '') {

        if (id.trim() === '')
            this.preset = 'start'
        else {
            this.preset = id
            this.from = from
            this.to = to
            this.loadFiles()
        }

    }

    updateDB(db) {
        this.db = db
    }

    getActiveList () {
        return {
            active: this.activeFiles,
            list: this.activeList
        }
    }

    getPreset() {
        return this.preset
    }

    getCountFiles() {
        return this.files.length
    }

    setRemember(files) {
        this.remember.push(String(files))
    }

    cleanActiveList () {
        this.activeFiles = 0
        this.activeList = []
    }

    setReadSubfolders(val) {
        this.readSubfolders = val
        console.log(this.readSubfolders)
    }

    cleanBase() {
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
        this.activeFiles = []
        this.remember = []
        this.count = 0
        this.files = []
    }

    setTheme(val = 'dark') {
        document.documentElement.setAttribute('theme', val);

        if (val === 'light') {
            document.querySelector('.setting-button').innerHTML = '<i class="fa-regular fa-brightness"></i>'
        } else if (val === 'dark') {
            document.querySelector('.setting-button').innerHTML = '<i class="fa-regular fa-moon-stars"></i>'
        }

    }

    async loadFiles() {

        this.count = 0

        let path = '',
            to = '',
            preset = ''

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
        this.updatePreset()
        await this.updatePath()



    }

}

module.exports = Files