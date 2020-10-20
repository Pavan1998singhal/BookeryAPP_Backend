const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    bookDetail:[
        {
            bookname:{
                type:String,
                required: true
            },
            author:{
                type:String,
                required:true
            },
            pages:{
                type:Number,
                required:true
            },
            date:{
                type: Date,
                required: true
            },
            bookImage:{
                type:String,
                required:true
            },
            bookPdf:{
                type:String,
                required:true
            }
        }
    ]
})

module.exports = mongoose.model('book', bookSchema)