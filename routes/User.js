const express = require('express')
const route = express()

//multer
const multer = require("multer")
const update = multer({});

const Users = require('../model/User')
const auth = require('../middleware/Auth')
var jwt = require('jsonwebtoken');
//create user
route.post('/users', update.single('avatar'), async (req, res) => {
    try {
        req.body.avatar = req.file.buffer
        const user = new Users(req.body);
        if (!user) {
            res.status(404).send("error in Save");
        }
        await user.save();
        res.send(user);

    } catch (error) {
        res.status(500).send(error);
    }
});
//get user ID
route.get('/users/:id', async (req, res) => {
    try {
        const _id = req.params.id;
        const user = await Users.findById({ _id });
        if (!user) {
            res.status(404).send("Not Found");
        }
        res.send(user)
    } catch (error) {
        res.send(error);
    }
});
//delete user
route.delete('/users/:id', async (req, res) => {
    try {
        const _id = req.params.id;
        const user = await Users.findByIdAndDelete({ _id });
        if (!user) {
            res.status(404).send("no User have this id");
        }
        res.send(user)
    } catch (error) {
        res.status(500).send(error);
    }
});

//edit user
route.patch('/users/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }
    try {
        const user = await Users.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        if (!user) {
            return res.status(404).send()
        }
        await  user.populate('products').execPopulate()
        res.send(user)
    } catch (error) {
        res.send(error);
    }
})


route.get('/users', auth, async (req, res) => {
    try {
        const token = req.token;
        const decode = jwt.verify(token, "UserToken");
        const user = await Users.findOne({ _id: decode._id });
        res.send(user);
    } catch (error) {
        res.send(error)
    }

})
module.exports = route