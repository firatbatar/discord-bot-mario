import { Events, userMention } from 'discord.js';
import { config } from 'dotenv';

config();

// An event for a message being sent in a channel by a user
export const name = Events.MessageCreate;
export function execute(message) {
    // If the message was sent by a bot, ignore it
    if (message.author.bot) return;

    // Run this event with a 5% chance
    if (Math.random() > 0.05) return;

    const user_ids = process.env.USERIDS2ANNOY.split(',');

    const annoy_messages = [
        "boş yapma mrom.",
        "anan.",
        "komik misin?",
        "komik değilsin.",
    ];

    // Check if the author id is in user_ids
    if (user_ids.includes(message.author.id)) {
        // Pick a random message from annoy_messages
        const random_index = Math.floor(Math.random() * annoy_messages.length);
        const annoy_msg = annoy_messages[random_index];
        
        // Send the message
        message.channel.send(`${userMention(message.author.id)}, ${annoy_msg}`);
    }
}
