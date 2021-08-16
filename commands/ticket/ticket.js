const Ticket = require('../../schemas/ticket');
const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
    permissions: ['MANAGE_CHANNELS'],
    data: new SlashCommandBuilder()
        .setName('ticket')
        .setDescription('Befehl für das Ticketsystem.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('reset')
                .setDescription('Setzt das Ticketsystem zurück.')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('create')
                .setDescription('Erstellt das Ticketsystem.')
                .addChannelOption(option => option.setName('channel').setDescription('Wo soll ich die Nachricht zum erstellen der Tickets senden?').setRequired(true))
                .addChannelOption(option => option.setName('ticketcategory').setDescription('In welcher Kategorie soll ich die Tickets erstellen?').setRequired(true))
                .addRoleOption(option => option.setName('role').setDescription('Welche Rolle soll Rechte zum bearbeiten der Tickets haben?').setRequired(true))
                .addRoleOption(option => option.setName('role2').setDescription('Welche Rolle soll Rechte zum bearbeiten der Tickets haben?'))
                .addRoleOption(option => option.setName('role3').setDescription('Welche Rolle soll Rechte zum bearbeiten der Tickets haben?'))
                .addRoleOption(option => option.setName('role4').setDescription('Welche Rolle soll Rechte zum bearbeiten der Tickets haben?'))
                .addRoleOption(option => option.setName('role5').setDescription('Welche Rolle soll Rechte zum bearbeiten der Tickets haben?'))
                .addRoleOption(option => option.setName('role6').setDescription('Welche Rolle soll Rechte zum bearbeiten der Tickets haben?'))),
    async execute(discord, client, interaction) {
        const guild = interaction.guild;
        const ticketData = await Ticket.findOne({ guildID: guild.id });
        if (interaction.options.getSubcommand() === 'reset') {
            if (ticketData) {
                await Ticket.deleteOne({ guildID: guild.id });
                return interaction.reply('Das Ticketsystem wurde zurückgesetzt!');
            } else {
                return interaction.reply('Du musst erst ein Ticketsystem erstellen!')
            }
        } else if (interaction.options.getSubcommand() === 'create') {
            if (ticketData) {
                return interaction.reply('Es gibt bereits ein Ticketsystem!');
            }
            const channel = interaction.options.getChannel('channel');
            if (channel.type !== 'GUILD_TEXT') return interaction.reply('Der angegebene Kanal ist kein Textkanal!');
            const ticketcategory = interaction.options.getChannel('ticketcategory');
            if (ticketcategory.type !== 'GUILD_CATEGORY') return interaction.reply('Die angegebene Kategorie ist keine Kategorie!');
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
            interaction.reply('Das Ticketsystem wurde erstellt!');
        }
    }
}
async function createTicket(discord, client, guild, channel, parent, modroles, interaction) {
    const row = new discord.MessageActionRow()
        .addComponents(
            new discord.MessageButton()
                .setCustomId('ticket')
                .setLabel(guild.name + ' Support')
                .setStyle('DANGER')
                .setEmoji('📩')
        );
    const embed = new discord.MessageEmbed()
        .setColor('RED')
        .setTitle(guild.name + ' Support')
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