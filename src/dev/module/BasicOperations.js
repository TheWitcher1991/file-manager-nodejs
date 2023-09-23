const path = require('path')

const { config } = require(path.join(__dirname, '/config'))
const $ = require(path.join(__dirname, '/config'))

module.exports = function () {
    document.querySelector('.delete__button').addEventListener('click', function () {
        const keySize = Object.keys($.files_).length

        const { active, list } = $._fs.getActiveList()

        if (active === 0) {
            if (keySize <= 0) {
                $._fs.createNotice('Выберите файлы')
            } else {
                if (config.FileDeleteNotice === 1) {
                    document.querySelector('.delfile__from-pop').style.display = 'flex'
                    document.querySelector('.delfile__from-container').style.display = 'block'
                } else {
                    $._fs.trashFiles($.files_)
                    $.files_.length = $.files_.length - keySize
                }
            }
        } else if (active === 1) {
            if (Object.keys(list).length <= 0) {
                $._fs.createNotice('Выберите файлы')
            } else {
                if (config.FileDeleteNotice === 1) {
                    document.querySelector('.delfile__from-pop').style.display = 'flex'
                    document.querySelector('.delfile__from-container').style.display = 'block'
                } else {
                    $._fs.trashFiles(list)
                    $.files_.length = $.files_.length - keySize
                }
            }
        }
    })

    document.querySelector('.apply__file-pop').addEventListener('click', function () {
        const keySize = Object.keys($.files_).length

        const { active, list } = $._fs.getActiveList()

        if (active === 0) {
            if (keySize <= 0) {
                $._fs.createNotice('Выберите файлы')
            } else {
                $._fs.trashFiles($.files_)
                $.files_.length = $.files_.length - keySize
            }
        } else if (active === 1) {
            if (Object.keys(list).length <= 0) {
                $._fs.createNotice('Выберите файлы')
            } else {
                $._fs.trashFiles(list)
                $.files_.length = $.files_.length - keySize
            }
        }
    })

    document.querySelector('.copy__button').addEventListener('click', function () {
        const keySize = Object.keys($.files_).length

        const { active, list } = $._fs.getActiveList()

        if (active === 0) {
            if (keySize <= 0) {
                $._fs.createNotice('Выберите файлы')
            } else {
                $._fs.copyFiles($.files_)
            }
        } else if (active === 1) {
            if (Object.keys(list).length <= 0) {
                $._fs.createNotice('Выберите файлы')
            } else {
                $._fs.copyFiles(list)
            }
        }
    })

    document.querySelector('.transfer__button').addEventListener('click', function () {
        const keySize = Object.keys($.files_).length

        const { active, list } = $._fs.getActiveList()

        if (active === 0) {
            if (keySize <= 0) {
                $._fs.createNotice('Выберите файлы')
            } else {
                $._fs.renameFiles($.files_)
                $.files_.length = $.files_.length - keySize
            }
        } else if (active === 1) {
            if (Object.keys(list).length <= 0) {
                $._fs.createNotice('Выберите файлы')
            } else {
                $._fs.renameFiles(list)
                $.files_.length = $.files_.length - keySize
            }
        }
    })
}
