const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const notifSchema = new Schema({
    postDetails: { type: Schema.Types.ObjectId, ref: 'Post' },
    commentText: { type: String },
    createdAt: { type: Date, default: Date.now },
    category: { type: String },
    subcategory: { type: String },
    section: { type: String },
    by: { type: String },
    viewed: {type: Boolean, default:false}
});

const notificationSchema = new Schema({
    userinfo: {
        type: Schema.Types.ObjectId, ref: 'User'
    },
    notifs: [notifSchema]
})

const NotificationsModel = model('Notifications', notificationSchema);

module.exports = NotificationsModel;