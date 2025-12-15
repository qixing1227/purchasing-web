const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Can be null if anonymous
    action: { type: String, required: true }, // e.g., 'LOGIN', 'VIEW_PRODUCT', 'PLACE_ORDER'
    targetId: { type: mongoose.Schema.Types.ObjectId }, // ID of related Product or Order
    details: { type: Object }, // Flexible field for extra info (metadata, IP, UA)
}, { timestamps: true }); // createdAt serves as the timestamp

const Log = mongoose.model('Log', logSchema);
module.exports = Log;
