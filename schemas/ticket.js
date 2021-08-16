const mongoose = require('mongoose');
const ticketSchema = new mongoose.Schema({
    messageID: { type: String },
    closeMessage: { type: Array },
    guildID: { type: String },
    channelID: { type: String },
    ticketNumber: { type: Number },
    modRoles: { type: Array },
    parentID: { type: String }
});
module.exports = mongoose.model('Ticket', ticketSchema, 'neruxtickets');