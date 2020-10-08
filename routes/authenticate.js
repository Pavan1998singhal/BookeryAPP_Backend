const express = require('express')
const jwt = require('jsonwebtoken')
const con = require('../dbConnection')
const router = express.Router()

const User = require('../models/signup')
const acessTokenSecret = 'youracessTokenSecret'


router.post('/', async(req, res) => {
    const username = req.body.username
    const password = req.body.password

    try{
        var query = { username: username, password: password}
        const user = await User.find(query)
        console.log('User is->', user)
        const avatar = user[0].avatar

        if(user.length >= 1){
            jwt.sign({
                username: user[0].username,
                role: user[0].role
            }, acessTokenSecret, (err, accessToken) => {
                res.json({
                    accessToken,
                })
            })
        }else{
            res.send('Username or Password not match')
        }
    }catch(err){
        res.json('Error', err)
    }
})

module.exports = router