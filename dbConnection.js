const mongoose = require('mongoose')

const url = 'mongodb://localhost/DevBookeryDB'

mongoose.connect(url, {useNewUrlParser:true})

const con = mongoose.connection

module.exports = con