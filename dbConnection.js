const mongoose = require('mongoose')

const url = 'mongodb://localhost/DevBookeryDB'

mongoose.connect(url, {useNewUrlParser:true, useFindAndModify: false})

const con = mongoose.connection

module.exports = con