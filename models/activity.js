const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const activitySchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        post: {
          type: String,
          required: true,
        },
        postTimestamp:{
            type: Date,
            default: Date.now()
        },
        likes: [{
          type: Schema.Types.ObjectId,
          ref: 'User'
        }],
        comments: [
            {
                user: {
                    type: Schema.Types.ObjectId,
                    ref: 'User',
                    required: true
                },
                content: {
                    type: String,
                    required: true
                },
                contentTimeStamp: {
                    type: Date,
                    default: Date.now()
                }
            }
        ]
    }
);

const Activity = mongoose.model("activity", activitySchema)
module.exports = Activity;
