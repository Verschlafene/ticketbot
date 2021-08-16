const Ticket = require('../../schemas/ticket');
module.exports = async (client) => {
    console.log(`${client.user.tag} ready!`);

    client.guilds.cache.forEach(async (guild) => {
        let ticketData = await Ticket.findOne({ guildID: guild.id });
        if (!ticketData) return;
        let channel = guild.channels.cache.get(ticketData.channelID);
        if (channel) channel.messages.fetch(ticketData.messageID);
        for (var i = 0; i < ticketData.closeMessage.length; i++) {
            let openTicket = guild.channels.cache.get(ticketData.closeMessage[i].split('-')[0]);
            if (openTicket) openTicket.messages.fetch(ticketData.closeMessage[i].split('-')[1]);
        }
    });
}