var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
//const { delete } = require('../routes/User');


var UserSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    avatar:{
        type:Buffer,
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
},
    {
        timestamps: true
    }


);

//delete User data res
UserSchema.methods.toJSON = function () {
    const userObject = this.toObject();

    delete userObject.password
    delete userObject.tokens;
    delete userObject.avatar;

    return userObject;
}

//hashing password
UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

//login 
UserSchema.statics.findCredtional = async function (email, password) {
    //check for user
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("This Name Not Existed")
    }
    //check user password
    const compare = await bcrypt.compare(password, user.password);
    if (!compare) {
      throw new Error("Error In Login Plz Check Your Email && Password");
    }
  
    return user;
  }
  

//genrate Token for user
UserSchema.methods.generateToken = async function () {
    const user = this;
  
    const token = jwt.sign({ _id: user._id.toString() }, "UserToken");
    if (!token) {
      throw new Error("Error in Login")
    }
    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
  }
  
var User = mongoose.model('User', UserSchema);
module.exports = User;
