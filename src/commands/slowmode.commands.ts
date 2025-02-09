import {
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  SlashCommandBuilder,
  TextChannel,
} from "discord.js";
import { DiscordLogger } from "../utils/discordLogger";

export const slowmodeCommand = new SlashCommandBuilder()
  .setName("slowmode")
  .setDescription("Sets slow mode in the current channel")
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
  .addIntegerOption((option) =>
    option
      .setName("seconds")
      .setDescription("Slowmode duration in seconds (0 to disable)")
      .setRequired(true)
      .setMinValue(0)
      .setMaxValue(21600)
  );

export class SlowmodeCommand {
  async execute(interaction: ChatInputCommandInteraction) {
    try {
      const seconds = interaction.options.getInteger("seconds", true);
      const channel = interaction.channel as TextChannel;

      await channel.setRateLimitPerUser(seconds);

      const message =
        seconds === 0
          ? "✅ Slowmode disabled."
          : `✅ Slowmode set to ${seconds} seconds.`;

      await DiscordLogger.log(
        `User ${interaction.user.tag} set slowmode to ${seconds}s in #${channel.name}`,
        "success"
      );

      await interaction.reply({ content: message, ephemeral: true });
    } catch (error) {
      await DiscordLogger.log(
        `Error in /slowmode command from ${interaction.user.tag}: ${error}`,
        "error"
      );
      await interaction.reply({
        content: "❌ Failed to set slowmode.",
        ephemeral: true,
      });
    }
  }
}
