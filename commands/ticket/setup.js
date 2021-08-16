const Ticket = require('../../schemas/ticket');
const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup')
        .setDescription('setup command for tickets')
        .addChannelOption(option => option.setName('channel').setDescription('Where do you want me to send the message?').setRequired(true))
        .addChannelOption(option => option.setName('ticketcategory').setDescription('Where do you want me to create the tickets?').setRequired(true))
        .addRoleOption(option => option.setName('role').setDescription('Please select a Moderator Role!').setRequired(true))
        .addRoleOption(option => option.setName('role2').setDescription('Please select a Moderator Role!'))
        .addRoleOption(option => option.setName('role3').setDescription('Please select a Moderator Role!'))
        .addRoleOption(option => option.setName('role4').setDescription('Please select a Moderator Role!'))
        .addRoleOption(option => option.setName('role5').setDescription('Please select a Moderator Role!'))
        .addRoleOption(option => option.setName('role6').setDescription('Please select a Moderator Role!')),
    async execute (discord, client, interaction) {
        const guild = interaction.guild;
        const ticketData = await Ticket.findOne({ guildID: guild.id }); 
        if (ticketData) {
            await Ticket.findOneAndRemove({ guildID: guild.id });
            return interaction.reply('The ticket system has been reset!');
        }
        const channel = interaction.options.getChannel('channel');
        if (channel.type !== 'GUILD_TEXT') return interaction.reply('The channel wasn\'t a text channel!');
        const ticketcategory = interaction.options.getChannel('ticketcategory');
        if (ticketcategory.type !== 'GUILD_CATEGORY') return interaction.reply('The ticketcategory wasn\'t a category!');
        const role = interaction.options.getRole('role');
        const role2 = interaction.options.getRole('role2');
        const role3 = interaction.options.getRole('role3');
        const role4 = interaction.options.getRole('role4');
        const role5 = interaction.options.getRole('role5');
        const role6 = interaction.options.getRole('role6');
        let roles = [];
        roles.push(role);
        if (role2) roles.push(role2);
        if (role3) roles.push(role3);
        if (role4) roles.push(role4);
        if (role5) roles.push(role5);
        if (role6) roles.push(role6);
        await createTicket(discord, client, guild, channel, ticketcategory, roles, interaction);
        interaction.reply('The ticket message has been sent!');
    }
}
async function createTicket(discord, client, guild, channel, parent, modroles, interaction) {
    const row = new discord.MessageActionRow()
        .addComponents(
            new discord.MessageButton() 
                .setCustomId('ticket')
                .setLabel('NeruxVace Support')
                .setStyle('DANGER')
                .setEmoji('📩')
        );
    const embed = new discord.MessageEmbed()
        .setColor('RED')
        .setTitle('NeruxVace Support')
        .setDescription('Du hast ein Problem? Öffne hier ein Support Ticket und wir werden dich so schnell wie möglich bei offenen Fragen unterstützen!')
        .setThumbnail(client.user.avatarURL({ format: 'png', size: 2048 }));
    let msg = await channel.send({ embeds: [embed], components: [row] });
    const newTicket = new Ticket({
        guildID: guild.id,
        channelID: channel.id,
        parentID: parent.id,
        messageID: msg.id,
        ticketNumber: 0,
    });
    modroles.forEach(async (role) => {
        await newTicket.modRoles.push(role.id);
    });
    await newTicket.save();
}