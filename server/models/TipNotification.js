const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const tipNotificationSchema = new Schema({
    userinfo: {
        type: Schema.Types.ObjectId, ref: 'User'
    },
    tip: String,
    lastNotificationTimestamp: { type: Date, default: Date.now }
})

const TipNotificationsModel = model('TipNotifications', tipNotificationSchema);

module.exports = TipNotificationsModel;