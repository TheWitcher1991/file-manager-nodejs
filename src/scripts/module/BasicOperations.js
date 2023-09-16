const { config  } = require('./config')
let $ = require('./config')

module.exports = function () {
    document.querySelector('.delete__button').addEventListener('click', function () {
        let keySize = Object.keys($.files_).length

        if (keySize <= 0) {
            alert('Выберите файлы')
        } else {
            if (config.FileDeleteNotice === 1) {
                document.querySelector('.delfile__from-pop').style.display = 'flex'
                document.querySelector('.delfile__from-container').style.display = 'block'
            } else {
                $._fs.trashFiles($.files_)
            }
        }
    })

    document.querySelector('.apply__file-pop').addEventListener('click', function () {
        let keySize = Object.keys($.files_).length

        if (keySize <= 0) {
            alert('Выберите файлы')
        } else {
            $._fs.trashFiles($.files_)
        }
    })

    document.querySelector('.copy__button').addEventListener('click', function () {
        let keySize = Object.keys($.files_).length

        if (keySize <= 0) {
            alert('Выберите файлы')
        } else {
            $._fs.copyFiles($.files_)
        }
    })

    document.querySelector('.transfer__button').addEventListener('click', function () {
        let keySize = Object.keys($.files_).length

        if (keySize <= 0) {
            alert('Выберите файлы')
        } else {
            $._fs.renameFiles($.files_)
        }
    })
}