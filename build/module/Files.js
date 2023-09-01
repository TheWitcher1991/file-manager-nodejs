'use strict'

const path = require('path'),
      fs   = require('fs')

let { COPYFILE_EXCL } = fs.constants

class Files {

    constructor(db, selector, from = '', to = '') {
        this.db = db
        this.selector = selector
        this.from = from
        this.to = to
        this.preset = 'start'
        this.activeFiles = []
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
            let charCode=str.charCodeAt(i),
                c = str.charAt(i),
                charWidth = this.mb_strwidth(c),
                next = str.charAt(i + 1),
                nextWidth=this.mb_strwidth(next)
            trimmedLength += charWidth
            trimmedStr += c
            if (trimmedLength+trimmakerWidth+nextWidth > width) {
                trimmedStr += trimmarker
                break
            }
        }
        return trimmedStr
    }

    searchFiles (text, column, type) {
        let { count, files_ } = this.readFiles(this.from),
            ul = document.querySelector(this.selector)

        count = 0

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

        files_.forEach((el, i) => {

            if (el.name.toLowerCase().search(text.toLowerCase()) !== -1) {

                this.activeFiles.push(el)

                count++

                let time = new Date(el.changed).toLocaleString('ru', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    timezone: 'UTC'
                })

                let type = '<i class="fa-duotone fa-file"></i>'

                if (el.type === '.docx' || el.type === '.doc' || el.type === '.docm' || el.type === 'dot') type = '<i class="fa-duotone fa-file-word"></i>'
                if (el.type === '.pdf') type = '<i class="fa-duotone fa-file-pdf"></i>'
                // if (el.type === '.pptx' || el.type === '.pptm' || el.type === '.ppt') type = '<i class="fa-duotone fa-presentation-screen"></i>'
                if (el.type === '.accdb' || el.type === '.sql' || el.type === '.db' || el.type === '.mdb') type = '<i class="fa-duotone fa-database"></i>'
                if (el.type === '.zip' || el.type === '.7z' || el.type === '.cab' || el.type === '.tar' || el.type === '.deb' || el.type === '.ace' || el.type === '.pak')
                    type = '<i class="fa-duotone fa-file-zipper"></i>'
                if (el.type === '.png' || el.type === '.jpeg' || el.type === '.jpg' || el.type === '.ico' || el.type === '.pict' || el.type === '.gif' || el.type === '.bmp')
                    type = '<i class="fa-duotone fa-file-image"></i>'
                if (el.type === '.jar') type = '<i class="fa-brands fa-java"></i>'

                ul.innerHTML += `
                <label class="file__table-ctx file__ctx-${el.id}" for="file__${el.id}" 
                data-id="${el.id}"
                data-name="${el.name}"
                data-path="${el.path}"
                >
                   
                   
                    <div class="file__table-temp">
                        <div class="container">
                            <div class="sort__check"> 
                                <input type="checkbox" class="files checkbox__files" name="file__${el.id}" id="file__${el.id}" value="${el.id}" 
                                    data-id="${el.id}"
                                    data-name="${el.name}"
                                    data-path="${el.path}"
                                />
                            </div>
                            <span class="sort__name">
                                ${type}
                                ${this.mb_strimwidth(el.name, 0, 40, '...')}
                            </span>
                            <span class="sort__size">${(el.size / 1024 / 1024).toFixed(2)} МБ</span>
                            <span class="sort__type">${el.type}</span>
                            <span class="sort__time">${time}</span>
                            <span class="sort__more"></span>
                        </div>
                    </div>
                </label>
            `
            }

            document.querySelector('.search__result').innerHTML = `Найдено ${count} файлов по запросу ${text}`
        })
    }

    readFiles(from = '') {
        let files_ = []
        let files = fs.readdirSync(this.from)
        let count = 0

        for (let i in files){

            count++;

            let name = this.from + '/' + files[i],
                stats = fs.statSync(name)

            if (stats.isDirectory()) {
                this.readFiles(files_)
            } else {
                files_.push({
                    id: count,
                    path: name,
                    name: files[i],
                    size: stats.size,
                    type: path.extname(name),
                    changed: stats.ctime,
                    stats: stats,
                })
            }
        }


        return {
            count: count,
            files_
        }
    }

    trashFiles(files_) {
        let arr = []

        files_.forEach((el, i) => {
            fs.unlink(String(el.path), err => {
                if (err) arr.push(el.name)
            })
        })

        alert('Файлы успешно удалён')
    }

    copyFiles(files_) {
        let arr = []

        files_.forEach((el, i) => {
            fs.copyFile(String(el.path), String(`${this.to}\\${el.name}`), COPYFILE_EXCL, err => {
                if (err) arr.push(el.name)
            });
        })

        alert('Файлы успешно скопированы')
    }

    renameFiles(files_) {
        let arr = []

        files_.forEach((el, i) => {
            fs.rename(String(el.path), String(`${this.to}\\${el.name}`), err => {
                if (err) arr.push(el.name)
            })
        })

        alert('Файлы успешно перемещены')
    }

    sortFiles(column, type) {
        let { count, files_ } = this.readFiles(this.from),
            ul = document.querySelector(this.selector)

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

        files_.forEach((el) => {

            let time = new Date(el.changed).toLocaleString('ru', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                timezone: 'UTC'
            })

            let type = '<i class="fa-duotone fa-file"></i>'

            if (el.type === '.docx' || el.type === '.doc' || el.type === '.docm' || el.type === 'dot') type = '<i class="fa-duotone fa-file-word"></i>'
            if (el.type === '.pdf') type = '<i class="fa-duotone fa-file-pdf"></i>'
            // if (el.type === '.pptx' || el.type === '.pptm' || el.type === '.ppt') type = '<i class="fa-duotone fa-presentation-screen"></i>'
            if (el.type === '.accdb' || el.type === '.sql' || el.type === '.db' || el.type === '.mdb') type = '<i class="fa-duotone fa-database"></i>'
            if (el.type === '.zip' || el.type === '.7z' || el.type === '.cab' || el.type === '.tar' || el.type === '.deb' || el.type === '.ace' || el.type === '.pak')
                type = '<i class="fa-duotone fa-file-zipper"></i>'
            if (el.type === '.png' || el.type === '.jpeg' || el.type === '.jpg' || el.type === '.ico' || el.type === '.pict' || el.type === '.gif' || el.type === '.bmp')
                type = '<i class="fa-duotone fa-file-image"></i>'
            if (el.type === '.jar') type = '<i class="fa-brands fa-java"></i>'

            ul.innerHTML += `
                <label class="file__table-ctx file__ctx-${el.id}" for="file__${el.id}" 
                data-id="${el.id}"
                data-name="${el.name}"
                data-path="${el.path}"
                >
                  
                    <div class="file__table-temp">
                        <div class="container">
                            <div class="sort__check"> 
                                <input type="checkbox" class="files checkbox__files" name="file__${el.id}" id="file__${el.id}" value="${el.id}" 
                                    data-id="${el.id}"
                                    data-name="${el.name}"
                                    data-path="${el.path}"
                                />
                            </div>
                            <span class="sort__name">
                                ${type}
                                ${this.mb_strimwidth(el.name, 0, 40, '...')}
                            </span>
                            <span class="sort__size">${(el.size / 1024 / 1024).toFixed(2)} МБ</span>
                            <span class="sort__type">${el.type}</span>
                            <span class="sort__time">${time}</span>
                            <span class="sort__more"></span>
                        </div>
                    </div>
                </label>
            `

        })
    }

    updatePath () {
        let { count, files_ } = this.readFiles(this.from),
            ul = document.querySelector(this.selector)

        files_.sort((x, y) => x.name > y.name ? 1 : -1)

        ul.innerHTML = ''

        document.querySelectorAll('.sort__item').forEach(el => {
            el.classList.remove('sort__active')
            if (el.parentNode.querySelector('.sort__arrow')) {
                el.parentNode.querySelector('.sort__arrow').remove()
            }
        })

        document.querySelector('.sort__name').classList.add('sort__active')
        document.querySelector('.sort__name').innerHTML += '<i class="fa-solid fa-caret-down sort__arrow"></i>'

        document.querySelector('.search__result').innerHTML = `Найдено ${count} файлов`

        files_.forEach((el, i) => {

            let time = new Date(el.changed).toLocaleString('ru', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                timezone: 'UTC'
            })

            let type = '<i class="fa-duotone fa-file"></i>'

            if (el.type === '.docx' || el.type === '.doc' || el.type === '.docm' || el.type === 'dot') type = '<i class="fa-duotone fa-file-word"></i>'
            if (el.type === '.pdf') type = '<i class="fa-duotone fa-file-pdf"></i>'
            // if (el.type === '.pptx' || el.type === '.pptm' || el.type === '.ppt') type = '<i class="fa-duotone fa-presentation-screen"></i>'
            if (el.type === '.accdb' || el.type === '.sql' || el.type === '.db' || el.type === '.mdb') type = '<i class="fa-duotone fa-database"></i>'
            if (el.type === '.zip' || el.type === '.7z' || el.type === '.cab' || el.type === '.tar' || el.type === '.deb' || el.type === '.ace' || el.type === '.pak')
                type = '<i class="fa-duotone fa-file-zipper"></i>'
            if (el.type === '.png' || el.type === '.jpeg' || el.type === '.jpg' || el.type === '.ico' || el.type === '.pict' || el.type === '.gif' || el.type === '.bmp')
                type = '<i class="fa-duotone fa-file-image"></i>'
            if (el.type === '.jar') type = '<i class="fa-brands fa-java"></i>'

            ul.innerHTML += `
                <label class="file__table-ctx file__ctx-${el.id}" for="file__${el.id}" 
                data-id="${el.id}"
                data-name="${el.name}"
                data-path="${el.path}"
                >
                  
                    <div class="file__table-temp">
                        <div class="container">
                            <div class="sort__check"> 
                                <input type="checkbox" class="files checkbox__files" name="file__${el.id}" id="file__${el.id}" value="${el.id}" 
                                    data-id="${el.id}"
                                    data-name="${el.name}"
                                    data-path="${el.path}"
                                />
                            </div>
                            <span class="sort__name">
                                ${type}
                                ${this.mb_strimwidth(el.name, 0, 40, '...')}
                            </span>
                            <span class="sort__size">${(el.size / 1024 / 1024).toFixed(2)} МБ</span>
                            <span class="sort__type">${el.type}</span>
                            <span class="sort__time">${time}</span>
                            <span class="sort__more"></span>
                        </div>
                    </div>
                </label>
            `
        })

        return true
    }

    updatePreset() {
        document.querySelector('.preset__list').innerHTML = ''
        for (let x in this.db) {
            let tmp = String(Object.keys(this.db[x])[0])
            for (let y in this.db[x]) {
                document.querySelector('.preset__list').innerHTML += `
                    <div class="preset__item-wrap">
                        <label class="preset__item" for="${tmp}">
                            <input type="radio" class="preset" name="preset" id="${tmp}" value="${this.db[x][y].name}" ${tmp === this.preset ? 'checked' : ''}
                                data-from="${this.db[x][y].pathFrom}"
                                data-to="${this.db[x][y].pathTo}"
                                data-id="${tmp}">
                            <span class="">${this.db[x][y].name}</span>
                        </label>
                        <div>
                            <i class="fa-duotone fa-wrench setting__preset-${tmp}"></i>
                            ${tmp !== 'start' ? '<i class="fa-duotone fa-trash"></i>' : ''}
                        </div>
                    </div>
                `
            }
        }
    }

    setPreset(id = '', from = '', to = '') {

        if (id.trim() === '')
            this.preset = 'start'
        else {
            console.log(id)
            this.preset = id
            this.from = from
            this.to = to
            this.loadFiles()
        }

    }

    updateDB(db) {
        this.db = db
    }

    loadFiles() {

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

        this.updatePreset()
        this.updatePath()

    }

}

module.exports = Files