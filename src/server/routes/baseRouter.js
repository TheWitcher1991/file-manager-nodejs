const express = require('express'),
      { GLOBAL } = require('../../utils/config.js'),
      homeController = require('../controllers/baseController.js')

const baseRouter = express.Router()

baseRouter.get(GLOBAL.ROUTES.index.url, homeController.render)

module.exports = baseRouter