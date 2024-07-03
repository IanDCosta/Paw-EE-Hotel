if(process.env.NODE_ENV !== 'production'){ //check if were running in the production environment
    require('dotenv').config()
} 

const mongoose = require('mongoose')
const DATABASE_URL= "mongodb+srv://8220005:hYPR8iGf5leOPPUd@cluster0.qe1lflw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
const express = require('express') //importar express
const app = express() //pegar a porção app de express
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')

// set routes
const indexRouter = require('./routes/index')
const adminRouter = require('./routes/admin/admin')

app.set('view engine', 'ejs') //set ejs as view engine
app.set('views', __dirname + '/views') //set views file
app.set('layout', 'layouts/layout') //set layout file
app.use(expressLayouts)
app.use(express.static('public')) //where public files will be
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }))

//use routes
app.use('/', indexRouter) //raiz da app
app.use('/admin', adminRouter)

mongoose.connect(DATABASE_URL, { 
    useNewUrlParser: true 
}) //conexão com a base de dados
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))

app.listen(process.env.PORT || 3000) //default port pra 3000