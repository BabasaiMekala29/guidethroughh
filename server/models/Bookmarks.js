const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const bookmarkSchema = new Schema({
    userinfo: {
        type: Schema.Types.ObjectId, ref: 'User'
    },
    saves:[{
        type: Schema.Types.ObjectId, ref: 'Post'
    }]
})

const BookmarksModel = model('Bookmarks', bookmarkSchema);

module.exports = BookmarksModel;