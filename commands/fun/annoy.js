import { SlashCommandBuilder, userMention } from 'discord.js';

const annoy_messages = [
    "senin benin ben bir taraflarını mikim!",
    "anan.",
];

export const data = new SlashCommandBuilder()
    .setName('annoy')
    .setDescription('Annoy a user with insults!')
    .addUserOption(option => 
        option.setName('target')
            .setDescription('The user to annoy.')
            .setRequired(true));

export async function execute(interaction) {
    const target = interaction.options.getUser('target');
    
    const random_message_idx = Math.floor(Math.random() * annoy_messages.length);
    const annoy_msg = annoy_messages[random_message_idx];
    await interaction.reply(`${userMention(target.id)}, ${annoy_msg}`);
}