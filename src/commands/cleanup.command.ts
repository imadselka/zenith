import {
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  SlashCommandBuilder,
  TextChannel,
} from "discord.js";

export const cleanupCommand = new SlashCommandBuilder()
  .setName("cleanup")
  .setDescription("Delete recent bot messages")
  .addIntegerOption((option) =>
    option
      .setName("amount")
      .setDescription("Number of messages to check (max 100)")
      .setRequired(false)
      .setMinValue(1)
      .setMaxValue(100)
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages);

export class CleanupCommand {
  async execute(interaction: ChatInputCommandInteraction) {
    const amount = interaction.options.getInteger("amount") || 50;
    const channel = interaction.channel as TextChannel;

    const messages = await channel.messages.fetch({ limit: amount });
    const botMessages = messages.filter((msg) => msg.author.bot);

    await channel.bulkDelete(botMessages);

    await interaction.reply({
      content: `Deleted ${botMessages.size} bot messages.`,
      ephemeral: true,
    });
  }
}
