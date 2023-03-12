const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        userid: {
            type: String,
            required: true,
            unique: true
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
        friends: [{
            type:Schema.Types.ObjectId,
            ref:'User',
        }],
        posts:[{
            type: Schema.Types.ObjectId,
            ref: 'Activity'
        }]
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("User", userSchema)
module.exports = User;
