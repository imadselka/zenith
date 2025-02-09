import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export const remindCommand = new SlashCommandBuilder()
  .setName("remind")
  .setDescription("Set a reminder")
  .addStringOption((option) =>
    option
      .setName("message")
      .setDescription("What to remind you about")
      .setRequired(true)
  )
  .addIntegerOption((option) =>
    option
      .setName("minutes")
      .setDescription("After how many minutes")
      .setRequired(true)
      .setMinValue(1)
      .setMaxValue(1440)
  );

export class RemindCommand {
  async execute(interaction: ChatInputCommandInteraction) {
    const message = interaction.options.getString("message", true);
    const minutes = interaction.options.getInteger("minutes", true);

    await interaction.reply(
      `I'll remind you about "${message}" in ${minutes} minutes!`
    );

    setTimeout(async () => {
      await interaction.user.send(`Reminder: ${message}`);
    }, minutes * 60 * 1000);
  }
}
