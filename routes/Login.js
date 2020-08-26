const express = require('express')
const route = express()
require('../database/connection')
const auth = require('../middleware/Auth')
const User = require('../model/User')

route.post('/login', async (req, res) => {
    try {
        const user = await User.findCredtional(req.body.email, req.body.password);
        const token = await user.generateToken();
        res.send({ user, token });
        //res.send(req.body.name);
    }
    catch (e) {
        res.status(400).send(e);
    }
})

//logout 
route.post('/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.send(res.user)
    } catch (e) {
        res.status(500).send()
    }
})
module.exports = route