const express = require('express')
const jwt = require('jsonwebtoken')
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
    }
}

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

module.exports = router