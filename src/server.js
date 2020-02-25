
let path = require('path'),
    express = require('express'),
    layout = require('express-layout'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    flash = require('express-flash'),
    routes = require('./routes'),
    app = express();

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

let middlewares = [
  layout(),
  express.static(path.join(__dirname, 'public')),
  bodyParser.urlencoded({ extended: true }),
  cookieParser(),
  session({
    secret: '076ee61d63aa10a125ea872411e486b9',
    key: 'qazxswedcvfr123',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000 }
  }),
  flash(),
]
app.use(middlewares)

app.use('/', routes)

app.use((req, res, next) => {
  res.status(404).send("Sorry can't find that!")
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

app.listen(3000, () => {
  console.log(`App running at http://localhost:3000`)
})
