import fs from 'node:fs';
import path from 'node:path';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Client, Collection, Events, GatewayIntentBits, InteractionType } from 'discord.js';
import { config } from 'dotenv';

// Get the __dirname for a ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config();

// Create a new client instance
const client = new Client({
    intents: [GatewayIntentBits.Guilds],
});

// Commands are attacjed to client for easy access in other files etc.
client.commands = new Collection();

// The commands handler
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);

        const command = await import(filePath);
        // Set a new item in the Collection with the key as the command name and the value as the exported module
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}


// When the client is ready, run this code (only once)
client.once(Events.ClientReady, readyDiscord);

// Event listener for when a slash command is executed
client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;
    
    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) {
        console.error(`No command matching ${Interaction.commandName}`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
    }
})

// Login to Discord with your client's token
client.login(process.env.TOKEN);

function readyDiscord() {
    console.log('Bot is running!');
}
