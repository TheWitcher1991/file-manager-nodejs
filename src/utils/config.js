let GLOBAL = {

    PORT: process.env.PORT || 8080,

    API_BASE_URL: `http://localhost:${process.env.PORT || 8080}/`,

    ROUTES: {
        index: {
            url: '/',
            path: 'index'
        },
    },

    SESSION_COOKIE_OPTION: {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
    },

}

module.exports = {
    GLOBAL
}