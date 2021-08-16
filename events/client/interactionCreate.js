const discord = require('discord.js');
const Ticket = require('../../schemas/ticket');
module.exports = async (client, interaction) => {
    if (interaction.isCommand() && interaction.guild) {
        const { commandName } = interaction;
        const command = client.commands.get(commandName);
        if (command) command.execute(discord, client, interaction);
    }
    if (interaction.isButton() && interaction.member.guild) {
        const ticketData = await Ticket.findOne({ guildID: interaction.member.guild.id });
        if (!ticketData) return;
        if (interaction.customId === 'ticket') {
            for (var i = 0; i < ticketData.closeMessage.length; i++) {
                if (ticketData.closeMessage[i].split('-')[2] === interaction.user.id) {
                    let channel = interaction.member.guild.channels.cache.get(ticketData.closeMessage[i].split('-')[0]);
                    if (channel) return channel.send(`${interaction.user} du hast bereits dieses Ticket... Du kannst kein zweites erstellen!`);
                }
            }
            ticketData.ticketNumber += 1;
            let channel = await interaction.member.guild.channels.create(`ticket-${'0'.repeat(4 - ticketData.ticketNumber.toString().length)}${ticketData.ticketNumber}`, { type: 'text' }).catch(error => { interaction.reply(`An Error Occured: ${error}`) });
            await channel.setParent(ticketData.parentID, { lockPermissions: false });
            await channel.permissionOverwrites.create(interaction.member.guild.id, { VIEW_CHANNEL: false });
            await channel.permissionOverwrites.create(interaction.member.id, { VIEW_CHANNEL: true, SEND_MESSAGES: true, SEND_TTS_MESSAGES: false });
            for (var i = 0; i < ticketData.modRoles.length; i++) {
                await channel.permissionOverwrites.create(ticketData.modRoles[i], { VIEW_CHANNEL: true, SEND_MESSAGES: true, SEND_TTS_MESSAGES: false });
            }
            const row = new discord.MessageActionRow()
                .addComponents(
                    new discord.MessageButton() 
                        .setCustomId('closeticket')
                        .setLabel('Ticket schließen')
                        .setStyle('DANGER')
                        .setEmoji('❎')
                );
            const embed = new discord.MessageEmbed()
                .setColor('RED')
                .setDescription(`Drücke auf den Knopf um das Ticket zu schließen!\nDieses Ticket wurde von ${interaction.user.tag} erstellt.`);
            let msg = await channel.send({ embeds: [embed], components: [row] });
            await ticketData.closeMessage.push(`${channel.id}-${msg.id}-${interaction.user.id}`);
            await ticketData.save();
        }
        let openTicket;
        let user;
        for (var i = 0; i < ticketData.closeMessage.length; i++) {
            openTicket = interaction.member.guild.channels.cache.get(ticketData.closeMessage[i].split('-')[0]);
            user = interaction.member.guild.members.cache.get(ticketData.closeMessage[i].split('-')[2]);
            if (!openTicket) ticketData.closeMessage = ticketData.closeMessage.filter(e => !e.includes(ticketData.closeMessage[i].split('-')[0]));
            await ticketData.save();
        }
        if (interaction.customId === 'closeticket') {
            if (interaction.user.id === user.id) return interaction.reply('Das Ticket kann nicht vom Ersteller geschlossen werden!');
            if (!openTicket.id) return interaction.reply('Ich konnte das Ticket nicht in meiner Datenbank finden... Bitte löscht es manuell!'); 
            await interaction.reply('Das Ticket wird in 10 Sekunden geschlossen!');
            ticketData.closeMessage = ticketData.closeMessage.filter(e => !e.includes(openTicket.id));
            await ticketData.save();
            setTimeout(async () => {
                await interaction.member.guild.channels.cache.get(interaction.channelId).delete();
            }, 10000);
        }
    }
}