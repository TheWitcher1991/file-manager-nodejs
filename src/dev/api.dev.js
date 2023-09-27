#!/usr/bin/env node

'use strict'

console.timeEnd('Launch')

module.exports = (() => {
    'use strict'

    const path = require('path')
    const fs = require('fs')

    const $ = require(path.join(__dirname, '/module/config'))

    const BasicOperations = require(path.join(__dirname, '/module/BasicOperations'))
    const ActivationPopup = require(path.join(__dirname, '/module/ActivationPopup'))
    const SpecialOperations = require(path.join(__dirname, '/module/SpecialOperations'))
    const SwitchingOperations = require(path.join(__dirname, '/module/SwitchingOperations'))
    const OtherMethods = require(path.join(__dirname, '/module/OtherMethods'))
    const Launch = require(path.join(__dirname, '/module/Launch'))
    const Reset = require(path.join(__dirname, '/module/Reset'))

    if ($.db === undefined) {
        // fs.appendFileSync(path.join(__dirname, $.rpath.log), `\n[${new Date()}] | Error: not found db.json`, 'utf-8')
        fs.writeFileSync(path.join(__dirname, $.rpath.launchDB), JSON.stringify([]))
        window.onload = Launch
        return false
    }

    window.onload = $.size <= 0 ? Launch : Reset

    SwitchingOperations()
    OtherMethods()
    ActivationPopup()
    SpecialOperations()
    BasicOperations()

    // fs.appendFileSync(path.join(__dirname, $.rpath.log), `\n[${new Date()}] | Launch`, 'utf-8')
})(0)
