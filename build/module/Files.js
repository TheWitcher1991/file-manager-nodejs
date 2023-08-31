'use strict'

const path = require('path'),
      fs   = require('fs')

let { COPYFILE_EXCL } = fs.constants

class Files {

    static mb_strwidth (str) {
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

    static mb_strimwidth (str, start, width, trimmarker) {
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

    static searchFiles (text, selector, from) {
        let { count, files_ } = this.readFiles(from),
            ul = document.querySelector(selector)

        count = 0

        ul.innerHTML = ''

        files_.forEach((el, i) => {

            if (el.name.search(text) !== -1) {

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
                    <input type="checkbox" class="files checkbox__files" name="file__${el.id}" id="file__${el.id}" style="display: none" value="${el.id}" 
                    data-id="${el.id}"
                    data-name="${el.name}"
                    data-path="${el.path}"
                    >
                    <div class="file__table-temp">
                        <div class="container">
                            <!--<div class="sort__check"> </div>-->
                            <span class="sort__name">
                                ${type}
                                ${Files.mb_strimwidth(el.name, 0, 40, '...')}
                            </span>
                            <span class="sort__size">${(el.size / 1024 / 1024).toFixed(2)} МБ</span>
                            <span class="sort__type">${el.type}</span>
                            <span class="sort__time">${time}</span>
                            <span class="sort__more"><i class="fa-duotone fa-trash"></i></span>
                        </div>
                    </div>
                </label>
            `
            }

            document.querySelector('.search__result').innerHTML = `Найдено ${count} файлов по запросу ${text}`
        })
    }

    static readFiles(dir, files_) {
        files_ = files_ || []
        let files = fs.readdirSync(dir)
        let count = 0

        for (let i in files){

            count++;

            let name = dir + '/' + files[i],
                stats = fs.statSync(name)

            if (stats.isDirectory()) {
                this.readFiles(name, files_)
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

    static copyFiles(dir, files_) {
        let arr = []

        files_.forEach((el, i) => {
            fs.copyFile(String(el.path), String(`${dir}\\${el.name}`), COPYFILE_EXCL, err => {
                if (err) arr.push(el.name)
            });
        })

        alert('Файлы успешно скопированы')
    }

    static renameFiles(dir, files_) {
        let arr = []

        files_.forEach((el, i) => {
            fs.rename(String(el.path), String(`${dir}\\${el.name}`), err => {
                if (err) arr.push(el.name)
            })
        })

        alert('Файлы успешно перемещены')
    }

    static updatePath (path, selector, preset) {
        let { count, files_ } = this.readFiles(path),
            ul = document.querySelector(selector)


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
                    <input type="checkbox" class="files checkbox__files" name="file__${el.id}" id="file__${el.id}" style="display: none" value="${el.id}" 
                    data-id="${el.id}"
                    data-name="${el.name}"
                    data-path="${el.path}"
                    >
                    <div class="file__table-temp">
                        <div class="container">
                            <!--<div class="sort__check"> </div>-->
                            <span class="sort__name">
                                ${type}
                                ${Files.mb_strimwidth(el.name, 0, 40, '...')}
                            </span>
                            <span class="sort__size">${(el.size / 1024 / 1024).toFixed(2)} МБ</span>
                            <span class="sort__type">${el.type}</span>
                            <span class="sort__time">${time}</span>
                            <span class="sort__more"><i class="fa-duotone fa-trash"></i></span>
                        </div>
                    </div>
                </label>
            `

        })
    }

    static updatePreset(db, preset) {
        for (let x in db) {
            let tmp = String(Object.keys(db[x])[0])
            for (let y in db[x]) {
                document.querySelector('.preset__list').innerHTML += `
                    <div class="preset__item-wrap">
                        <label class="preset__item" for="${tmp}">
                            <input type="radio" name="preset" id="${tmp}" value="${db[x][y].name}" ${tmp === preset ? 'checked' : ''}
                                data-from="${db[x][y].pathFrom}"
                                data-to="${db[x][y].pathTo}"
                                data-id="${tmp}">
                            <span class="">${db[x][y].name}</span>
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

    static loadFiles(db, selector) {

        let path = '',
            to = '',
            preset = ''

        for (let x in db) {
            for (let y in db[x]) {
                path = db[x][y].pathFrom
                to = db[x][y].pathTo
                preset = String(Object.keys(db[x])[0])
            }
            break
        }

        document.querySelector('.home__path').innerHTML = path
        document.querySelector('.home__to').innerHTML = to

        document.querySelector('.global__from').value = path
        document.querySelector('.global__to').value = to
        document.querySelector('.global__preset').value = to

        this.updatePreset(db, preset)
        this.updatePath(path, selector, preset)

    }

}

module.exports = Files