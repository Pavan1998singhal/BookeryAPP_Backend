const express = require('express')
const jwt = require('jsonwebtoken')
const multer = require('multer')
const router = express.Router()

const User = require('../models/signup')
const Book = require('../models/book')
const acessTokenSecret = 'youracessTokenSecret'


const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization']

    if(authHeader){
        const token = authHeader.split(' ')[1]

        jwt.verify(token, acessTokenSecret, (err, user) => {
            if(err){
                res.json('Not Valid User')
            }else{
                req.user = user
                next()
            }
        })
    }else{
        res.json('Token not found')
    }
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './assests/uploads/books')
    },
    filename:(req, file, cb) => {
        cb(null, file.originalname)
    }
})

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 10,   // accepting only upto 5mb
        //file: 1     // accepting only one imahge file
    },
})

router.post('/:username', upload.array('bookFiles', 2), verifyToken, async(req, res) => {

    console.log('Request files is->', req.files)
    console.log('Request body is->', req.body)
    console.log('Book image is->', req.files[0])
    console.log('Book PDF is->', req.files[1])
    
    try{

        const bookImage = req.files[0]
        const bookPdf = req.files[1]

        const username = req.params.username
        const bookname = req.body.bookname
        const author = req.body.author
        const pages = req.body.pages
        const date = req.body.date

        const query = { username: username, bookDetail: { $elemMatch: { bookname: bookname } } }
        const bookExist = await Book.find(query)

        if(bookExist.length == 1){
            res.json('Book already exist !!')
        }else{
            var bookInfo = { bookname: bookname, author: author, pages: pages, date: date, bookImage: bookImage.path, bookPdf: bookPdf.path }
            
            try{

                await Book.findOneAndUpdate(
                    { username: username },
                    { $push: { bookDetail: bookInfo } },
                    { upsert: true }
                ).exec();
                res.json('Book added successfully !!')

            }catch(err){
                res.json('Error '+ err)
            }
        }

    }catch(err){
        res.json('Error '+ err)
    }



    // try{

    //     console.log('Request file is->', req.files)

    //     const pdf = req.files[0]
    //     console.log('Uploaded Pdf is ->', pdf)

    //     const username = req.params.username
    //     const bookname = req.body.bookname

    //     const query = { username: username, bookDetail: { $elemMatch: { bookname: bookname } } }
    //     const bookExist = await testBook.find(query)

    //     if(bookExist.length >= 1){
    //         res.json('Book already exist !!')
    //     }else{
    //         var bookInfo = { bookname: bookname, author: req.body.author, pages: req.body.pages }
    //         try{
                
    //             await testBook.findOneAndUpdate(
    //                 { username: username },
    //                 { $push: { bookDetail: bookInfo } },
    //                 { upsert: true }
    //             ).exec();
    //             res.json('Added successfully')
    //         }catch(err){
    //             res.json('Error '+ err)
    //         }
    //     }
    // }catch(err){
    //     res.json('Error '+ err)
    // }
})


module.exports = router