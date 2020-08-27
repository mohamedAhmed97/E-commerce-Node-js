const express = require('express')
const route = express()

//multer
const multer = require("multer")
const update = multer({});

const Product = require('../model/Product')
const auth = require('../middleware/Auth')
//create user
route.post('/products', auth, update.any('image'), async (req, res) => {
    try {
        //  console.log(req.user._id);
        const files = req.files
        req.body.images = Array();

        files.forEach(element => {
            req.body.images.push(element.buffer)
        });
        console.log(req.body.images);
        const product = new Product({ ...req.body, "owner": req.user._id });
        if (!product) {
            res.status(404).send("error in Save");
        }
        await product.save();
        await product.populate('owner').execPopulate();
        res.send(product);

    } catch (error) {
        res.status(500).send(error);
    }
});
//get user ID
route.get('/products/:id', async (req, res) => {
    try {
        const _id = req.params.id;
        const product = await Product.findById({ _id });
        await product.populate('owner').execPopulate();
        if (!product) {
            res.status(404).send("Not Found");
        }

        res.send(product)
    } catch (error) {
        res.send(error);
    }
});
//delete user
route.delete('/products/:id', async (req, res) => {
    try {
        const _id = req.params.id;
        const product = await Product.findByIdAndDelete({ _id });
        if (!product) {
            res.status(404).send("no User have this id");
        }
        res.send(product)
    } catch (error) {
        res.status(500).send(error);
    }
});

//edit user
route.patch('/products/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'desc', 'price', 'quantity', 'images'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        if (!product) {
            return res.status(404).send()
        }
        res.send(product)
    } catch (error) {
        res.send(error);
    }
})

module.exports = route