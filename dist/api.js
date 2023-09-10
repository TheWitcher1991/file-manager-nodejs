'use strict'

const API = () => {
    const path = require('path')

    let { Files } = require(path.join(__dirname, '/module/config'))
    let $ = require(path.join(__dirname, '/module/config'))

    const BasicOperations     = require(path.join(__dirname, '/module/BasicOperations')),
        ActivationPopup     = require(path.join(__dirname, '/module/ActivationPopup')),
        SpecialOperations   = require(path.join(__dirname, '/module/SpecialOperations')),
        SwitchingOperations = require(path.join(__dirname, '/module/SwitchingOperations')),
        OtherMethods        = require(path.join(__dirname, '/module/OtherMethods')),
        Launch              = require(path.join(__dirname, '/module/Launch'))

    if ($.size <= 0) {
        Launch()
    } else {
        $._fs = new Files($.db, '.file__tbody')

        if ($.config.ReadSubfolders === 1) {
            document.querySelector('#global__change').setAttribute('checked', 'true')
            document.querySelector('#global__change').checked = true
            $._fs.setReadSubfolders(1)
        } else {
            document.querySelector('#global__change').removeAttribute('checked')
            document.querySelector('#global__change').checked = false
            $._fs.setReadSubfolders(0)
        }

        document.querySelector('.loader').style.display = 'none'

        $._fs.loadFiles()
        $._fs.setPreset()
    }

    document.addEventListener('DOMContentLoaded', function () {
        SwitchingOperations()
        OtherMethods()
        ActivationPopup()
        SpecialOperations()
        BasicOperations()
    })
}

API()

module.exports = API