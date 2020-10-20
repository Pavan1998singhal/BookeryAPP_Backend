const express = require('express')
const jwt = require('jsonwebtoken')
const cors = require('cors')
const bodyParser = require('body-parser');

const app = express()
app.use(express.json())
app.use(cors())
app.use(bodyParser.json());

// make images folder publicly so that it is accessible or get
app.use('/assests/uploads/images' ,express.static('assests/uploads/images'))
app.use('/assests/uploads/books' ,express.static('assests/uploads/books'))
// app.use('../../Frontend_With_Reactjs/bookery-app/public/assests/uploads/images' ,express.static('../../Frontend_With_Reactjs/bookery-app/public/assests/uploads/images'))


// Connect with DB
const connectDB = require('../Backend_With_Nodejs/dbConnection')
connectDB.on('open', () => {
    console.log('Connected with DB!!')
})


//Route for Signup
const signupRouter = require('../Backend_With_Nodejs/routes/signup')
app.use('/signup', signupRouter)


//Route for Login
const authenticateRouter = require('../Backend_With_Nodejs/routes/authenticate')
app.use('/login', authenticateRouter)


// Route for Users
const usersRouter = require('../Backend_With_Nodejs/routes/users')
app.use('/users', usersRouter)


// Route for Books
const booksRouter = require('../Backend_With_Nodejs/routes/books')
app.use('/books', booksRouter)


app.listen(8000, () => {
    console.log('server started at port 8000')
})