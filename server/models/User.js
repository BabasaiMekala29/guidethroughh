const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const { isEmail } = require('validator');
const bcrypt = require('bcryptjs')
const userSchema = new Schema({
    username: {
        type: String,
        required: [true, 'Please enter username'],
        unique: true,
        lowercase: true,
        minlength: [6, 'Minimum username length is 6 characters']
    },
    email: {
        type: String,
        required: [true, 'Please enter an email'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Please enter a password'],
        minlength: [6, 'Minimum password length is 6 characters']
    }
})

userSchema.pre('save', async function (next){
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

userSchema.statics.login = async function(email,password){
    const user = await this.findOne({email});
    if(user){
        const auth = await bcrypt.compare(password,user.password);
        if(auth){
            return user;
        }
        throw Error('Incorrect password');
    }
    throw Error('Incorrect email');
}

const User = mongoose.model('user',userSchema);

module.exports = User;