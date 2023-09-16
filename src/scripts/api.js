'use strict'

let $ = require('./module/config')

const BasicOperations     = require('./module/BasicOperations'),
      ActivationPopup     = require('./module/ActivationPopup'),
      SpecialOperations   = require('./module/SpecialOperations'),
      SwitchingOperations = require('./module/SwitchingOperations'),
      OtherMethods        = require('./module/OtherMethods'),
      Launch              = require('./module/Launch'),
      Reset               = require('./module/Reset')

const API = () => {

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