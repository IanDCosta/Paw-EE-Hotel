if(process.env.NODE_ENV !== 'production'){ //check if were running in the production environment
    require('dotenv').config()
} 

const express = require('express') //importar express
const app = express() //pegar a porção app de express
const expressLayouts = require('express-ejs-layouts')

const indexRouter = require('./routes/index')

app.set('view engine', 'ejs') //set ejs as view engine
app.set('views', __dirname + '/views') //set views file
app.set('layout', 'layouts/layout') //set layout file
app.use(expressLayouts)
app.use(express.static('public')) //where public files will be

const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, { 
    useNewUrlParser: true 
}) //conexão com a base de dados
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))

app.use('/', indexRouter) //raiz da app

app.listen(process.env.PORT || 3000) //default port pra 3000