const csurf = require('csurf'),
      { GLOBAL } = require('../../utils/config.js')

const ignoreMethods = [
    'GET',
    'HEAD',
    'POST',
    'PUT',
    'DELETE',
    'OPTIONS'
]

const csrfMiddleware = {

    csrfInit: csurf({
        ignoreMethods: ignoreMethods, cookie: GLOBAL.SESSION_COOKIE_OPTION
    }),

    csrfProtection: csurf({
        cookie: GLOBAL.SESSION_COOKIE_OPTION
    }),

    csrfToken: (req, res, next) => {
        const token = req.csrfToken()
        res.cookie('XSRF-TOKEN', token)
        next()
    }

}

module.exports = {
    csrfMiddleware
}