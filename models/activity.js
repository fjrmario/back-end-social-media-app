const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema([
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        content: {
            type: String,
        },
        contentTimeStamp: {
            type: Date,
            default: Date.now()
        }
    }
])

const postSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        post: {
          type: String,
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
            commentSchema
        ]
    }
);


const Post = mongoose.model("Post", postSchema)
const Comment = mongoose.model('comment', commentSchema)

module.exports = {
    Post,
    Comment
}
