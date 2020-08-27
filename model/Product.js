var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProductSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    desc: {
        type: String,
        required: true,
    },
    images:
        [{
            //image: [{
            type: [Buffer],
            required: true,
            //}]
        }],
    price: {
        type: Number,
    },
    quantity: {
        type: Number
    },
    owner: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
},
    {
        timestamps: true
    }


);

ProductSchema.methods.toJSON = function () {
    const Product = this.toObject();;
    delete Product.images;

    return Product;
}
var Product = mongoose.model('Product', ProductSchema);
module.exports = Product;
