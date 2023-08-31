const path = require('path'),
      cors = require('cors'),
      http = require('http'),
      express = require('express'),
      morgan = require('morgan'),
      helmet = require('helmet'),
      bodyParser = require('body-parser'),
      cookieParser = require('cookie-parser'),
      expressHandlebars = require('express-handlebars')

const baseRouter = require('./server/routes/baseRouter'),
      { csrfMiddleware } = require('./server/middleware/csrfMiddleware')

const { GLOBAL } = require('./utils/config')

const app = express()

app.set('port', GLOBAL.PORT)
app.set('views', 'build/views')
app.set('view engine', 'hbs')

if (process.env.NODE_ENV === 'dev')
    app.use(morgan('dev'))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

app.use(cors(
    {
        origin: [GLOBAL.API_BASE_URL],
        credentials: true
    }))

app.use(helmet())
app.use(csrfMiddleware.csrfInit)
app.use(csrfMiddleware.csrfToken)

app.use(express.static('build'))
app.use(express.static('build/libs'))
app.use(express.static('build/public'))
app.use(express.static('build/electron'))

app.use(GLOBAL.ROUTES.index.url, csrfMiddleware.csrfProtection, baseRouter)

let server = http.createServer(app);
server.listen(GLOBAL.PORT)

server.on('listening', () => console.log(`Сервер запущен и ожидает подключения на порту ${GLOBAL.PORT}...`));