'use strict'

const API = () => {
    const path = require('path'),
          fs = require('fs')

    let $ = require(path.join(__dirname, '/module/config'))

    const BasicOperations     = require(path.join(__dirname, '/module/BasicOperations')),
          ActivationPopup     = require(path.join(__dirname, '/module/ActivationPopup')),
          SpecialOperations   = require(path.join(__dirname, '/module/SpecialOperations')),
          SwitchingOperations = require(path.join(__dirname, '/module/SwitchingOperations')),
          OtherMethods        = require(path.join(__dirname, '/module/OtherMethods')),
          Launch              = require(path.join(__dirname, '/module/Launch')),
          Reset               = require(path.join(__dirname, '/module/Reset'))

    if ($.db === undefined) {
        fs.writeFileSync(path.join(__dirname, $.rpath.launchDB), JSON.stringify([]));
        Launch()
        return false
    }

    $.size <= 0 ? Launch() : Reset()

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