

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        userid: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true,
            match: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("User", userSchema)
