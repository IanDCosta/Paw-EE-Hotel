//set imports
const mongoose = require('mongoose')
const DATABASE_URL= "mongodb+srv://8220005:hYPR8iGf5leOPPUd@cluster0.qe1lflw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
const express = require('express') //importar express
const cors = require('cors')
const app = express() //pegar a porção app de express
const jwt = require('jsonwebtoken');
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const cookieParser = require('cookie-parser');
const authController = require('./controllers/auth')
const path = require('path')

//set routes
const authRouter = require('./routes/auth')
const indexRouter = require('./routes/index')
const adminRouter = require('./routes/admin/admin')
const staffRouter = require('./routes/staff/staff')
const userApiRouter = require ('./routes/api/users')
const authApiRouter = require('./routes/api/auth')
const roomApiRouter = require('./routes/api/rooms')
const reservationApiRouter = require('./routes/api/reservations')
const giftCardApiRouter = require('./routes/api/giftCards')

//use imports
app.set('view engine', 'ejs') //set ejs as view engine
app.set('views', __dirname + '/views') //set views file
app.set('layout', 'layouts/layout') //set layout file
app.use(cors()); 
app.use(expressLayouts)
app.use(methodOverride('_method'))
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }))
app.use(cookieParser());

//use routes
app.use('/', indexRouter)
app.use('/login', authRouter)
app.use('/admin', authController.verifyLogin, adminRouter)
app.use('/staff', authController.verifyLogin, staffRouter)
app.use('/api/users', userApiRouter)
app.use('/api/auth', authApiRouter)
app.use('/api/rooms', roomApiRouter)
app.use('/api/reservations', reservationApiRouter)
app.use('/api/giftCards', giftCardApiRouter)

//connect to database
mongoose.connect(DATABASE_URL, { 
    useNewUrlParser: true 
})
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))

app.listen(process.env.PORT || 3000) //default port 3000