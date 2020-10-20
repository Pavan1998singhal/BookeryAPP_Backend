const express = require('express')
const jwt = require('jsonwebtoken')
const multer = require('multer')
const router = express.Router()

const User = require('../models/signup')
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


router.get('/:username', verifyToken , async(req, res) => {

    const { role } = req.user
    const { username } = req.user

    try{

        const username = req.params.username
        try{

            const userDetails = await User.find({ username: username })
            res.json(userDetails[0])

        }catch(err){
            res.json('Error'+ err)
        }

    }catch(err){
        res.json('Error '+ err)
    }

})

router.get('/userById/:id', verifyToken , async(req, res) => {

    try{
        const id = req.params.id
        try{

            const userDetails = await User.find({ _id: id })
            res.json(userDetails[0])

        }catch(err){
            res.json('Error'+ err)
        }

    }catch(err){
        res.json('Error '+ err)
    }

})

router.get('/', verifyToken, async(req, res) => {
    try{

        const query = { role: { $in: [ "reader", "member" ] } }
        const getAllUsers = await User.find(query)

        res.json(getAllUsers)

    }catch(err){
        res.json('Error '+ err)
    }
})

router.patch('/updateWithFile/:id', uploadImage.single('avatar') ,verifyToken, async(req, res) => {

    try{
        const file = req.file;

        const id = req.params.id

        if(!file) {
            res.json('Please attch an image')
        }else{
            var query = { _id: id}
            const userExist = await User.find(query)

            if(userExist.length == 1){

                var userInfo = { username: req.body.username, role: req.body.role, firstName: req.body.firstName, lastName: req.body.lastName, email: req.body.email, avatar: req.file.path }
                console.log('User Info->', userInfo)
                await User.update(
                    {
                        _id: id
                    },
                    { $set: { username: userInfo.username, role: userInfo.role, firstName: userInfo.firstName, lastName: userInfo.lastName, email: userInfo.email, avatar: userInfo.avatar } }
                );
                
                res.json('User updated successfully !!')

            }else{
                res.json('User not exist')
            }

        }
        
    }catch(err){
        res.json('Error '+ err)
    }

})

router.patch('/updateWithoutFile/:id', verifyToken, async(req, res) => {

    try{
        const id = req.params.id

        var query = { _id: id}
        const userExist = await User.find(query)

        if(userExist.length == 1){

            var userInfo = { username: req.body.username, role: req.body.role, firstName: req.body.firstName, lastName: req.body.lastName, email: req.body.email }
            console.log('User Info->', userInfo)
            await User.update(
                {
                    _id: id
                },
                { $set: { username: userInfo.username, role: userInfo.role, firstName: userInfo.firstName, lastName: userInfo.lastName, email: userInfo.email } }
            );
            
            res.json('User updated successfully !!')

        }else{
            res.json('User not exist')
        }
        
    }catch(err){
        res.json('Error '+ err)
    }

})

router.delete('/:id', verifyToken, async(req, res) => {
    
    try{
        const id = req.params.id

        var query = { _id: id}
        const userExist = await User.find(query)

        if(userExist.length == 1){

            await User.findByIdAndDelete(userExist[0].id)
            res.json('User deleted successfully !!')
            
        }else{
            res.json('User not exist')
        }
    }catch(err){
        res.json('Error '+ err)
    }
})


module.exports = router