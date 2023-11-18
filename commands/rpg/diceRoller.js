import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('roll')
    .setDescription('Roll!')
    .addStringOption(option =>
        option.setName('dice')
            .setDescription('Use: [rollCount]d[dice-1] + ... + [rollCount]d[dice-n] + [bonus]')
            .setRequired(true));


function rollDice(die, count) {
    if (die <= 0) return [-1, []];  // Dice value must be positive
    if (!Number.isInteger(die)) return [-1, []];  // Dice value must be an integer
    if (!Number.isInteger(count) || count <= 0) return [-1, []];

    let result = 0;
    let rolls = [];
    for (let i = 0; i < count; i++) {
        const roll = Math.floor(Math.random() * die + 1);  // Get a random roll between 1 and die value
        rolls.push(roll);
        result += roll;
    }

    return [result, rolls];
}

export async function execute(interaction) {
    try {
        await interaction.deferReply();

        let diceText = interaction.options.getString('dice').replaceAll(" ", "");
        if (diceText.includes("-")) {
            diceText = diceText.replaceAll("-", "+.")
        }

        const diceArr = diceText.split("+");

        let result = 0;
        let diceRolls = [];
        let bonuses = [];
        for (const die of diceArr) {
            if (die.includes('d')) {
                const dieData = die.split("d");
                let dieCount = dieData[0] != '' ? parseInt(dieData) : 1;
                let dieValue = parseInt(dieData[1]);
                
                const [dieRoll, rolls] = rollDice(dieValue, dieCount);
                if (dieRoll == -1) {
                    interaction.editReply(`Invalid dice roll ${die}.`);
                    return;
                }
                
                result += dieRoll;
                diceRolls.push(rolls);
            } else {
                let bonus;
                if (die.includes('.')) {
                    bonus = parseInt(die.slice(1, die.length)) * -1;
                } else {
                    bonus = parseInt(die);
                }

                if (!Number.isInteger(bonus)) {
                    interaction.editReply(`Invalid dice roll ${die}.`);
                    return;
                }

                result += bonus;
                bonuses.push(bonus);
            }
        }


        let result_msg = `Result: ${result}\n`;
        for (const rolls of diceRolls) {
            result_msg += "[";
            for (const roll of rolls) {
                result_msg += `${roll}, `;
            }
            result_msg = result_msg.slice(0, result_msg.length - 2) + "],\n";
        }
        result_msg += "[";
        for (const bonus of bonuses) {
            result_msg += `${bonus}, `;
        }
        result_msg = result_msg.slice(0, result_msg.length - 2) + "]";

        interaction.editReply(result_msg);

    } catch (error) {
        console.error(error);
        interaction.reply("err");
    }
}