import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('ping')
    .setDescription("Replies Pong!");

export async function execute(interaction) {
    await interaction.reply('Pong!');
}