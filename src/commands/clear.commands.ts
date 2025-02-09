import {
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  SlashCommandBuilder,
  TextChannel,
} from "discord.js";
import { DiscordLogger } from "../utils/discordLogger";

export const clearCommand = new SlashCommandBuilder()
  .setName("clear")
  .setDescription("Deletes the specified number of messages")
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
  .addIntegerOption((option) =>
    option
      .setName("amount")
      .setDescription("Number of messages to delete (max 100)")
      .setRequired(true)
      .setMinValue(1)
      .setMaxValue(100)
  );

export class ClearCommand {
  async execute(interaction: ChatInputCommandInteraction) {
    try {
      const amount = interaction.options.getInteger("amount", true);
      const channel = interaction.channel as TextChannel;

      await interaction.deferReply({ ephemeral: true });
      const deleted = await channel.bulkDelete(amount, true);

      await DiscordLogger.log(
        `User ${interaction.user.tag} deleted ${deleted.size} messages in #${channel.name}`,
        "success"
      );

      await interaction.editReply({
        content: `✅ Successfully deleted ${deleted.size} messages.`,
      });
    } catch (error) {
      await DiscordLogger.log(
        `Error in /clear command from ${interaction.user.tag}: ${error}`,
        "error"
      );
      await interaction.editReply({
        content:
          "❌ Failed to delete messages. Messages older than 14 days cannot be bulk deleted.",
      });
    }
  }
}
