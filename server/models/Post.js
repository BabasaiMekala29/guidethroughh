const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const commentSchema = new Schema({
    user: { type: String }, 
    comment: { type: String }, 
    createdAt: { type: Date, default: Date.now },
    booked: {
        type: [String], 
    },
    comUpvote: { type: Number,default:0 },
    comDownvote: { type: Number,default:0 }, 
    upvoters: {
        type: [String], 
    },
    downvoters: {
        type: [String], 
    },
});

const postSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Please enter title'],
    },
    description: {
        type: String,
        required: [true, 'This field cannot be empty'],
    },
    category: String,
    subcategory: String,
    section: String,
    upvote: Number,
    downvote: Number,
    likes: Number,
    upvotes: {
        type: [String], 
    },
    downvotes: {
        type: [String], 
    },
    loves: {
        type: [String], 
    },
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    comments: [commentSchema]
}, 
{
    timestamps: true
});

const PostModel = model('Post', postSchema);

module.exports = PostModel;