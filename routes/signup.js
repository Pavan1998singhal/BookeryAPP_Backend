const express = require('express')
const router = express.Router()
const multer = require('multer')


const signup = require('../models/signup')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
         cb(null, './assests/uploads/images');
        //cb(null, '../../Frontend_With_Reactjs/bookery-app/public/assests/uploads/images')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
})

const fileFilterImage = (req, file, cb) => {
    
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true)
    }else{
        //reject a file
        cb(null, false)
    }

};

const uploadImage = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5,   // accepting only upto 5mb
        //file: 1     // accepting only one imahge file
    },
    fileFilter: fileFilterImage
});


router.post('/', uploadImage.single('avatar') ,async(req,res) =>{
    try{
        const file = req.file;
        console.log('FIle is ->', req.file)

        const password = req.body.password
        const confirmPassword = req.body.confirmPassword

        if(!file) {
            res.json('Please attch an image')
        }
        else if(password !== confirmPassword){
            res.json('password and confirmPassword field must be same')
        }else{
            const user = new signup({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                username: req.body.username,
                password: req.body.password,
                confirmPassword: req.body.confirmPassword,
                avatar: req.file.path
            })
    
            await user.save()
            res.json('User Added Successfully')
        }

    }catch(err){
        res.json('Error' + err)
    }
})

module.exports = router