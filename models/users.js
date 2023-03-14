const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        userid: {
            type: String,
            required: true,
            unique: true,
            minLength: 3,
            maxLength: 10
        },
        email:{
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            match: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/,
            minLength: 8
        },
        friends: {
            type: Array,
            default: [],
            ref:'User',
        },
        isAdmin: {
            type: Boolean,
            default: false
        },
        posts:{
            type: Array,
            default: [],
            ref: 'Post'
        }
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("User", userSchema)
module.exports = User;
