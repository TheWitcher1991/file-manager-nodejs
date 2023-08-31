const { GLOBAL } = require('../../utils/config.js')

class baseController {



    static render (request, response) {

        response.render(GLOBAL.ROUTES.index.path)

    }

}

module.exports = baseController