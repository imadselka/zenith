import {
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  SlashCommandBuilder,
  TextChannel,
} from "discord.js";
import { DiscordLogger } from "../utils/discordLogger";

export const ttsCommand = new SlashCommandBuilder()
  .setName("tts")
  .setDescription("Send a Text-to-Speech message")
  .addStringOption((option) =>
    option
      .setName("message")
      .setDescription("The message to be spoken")
      .setRequired(true)
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.SendTTSMessages);

export class TTSCommand {
  async execute(interaction: ChatInputCommandInteraction) {
    try {
      const message = interaction.options.getString("message", true);
      const channel = interaction.channel as TextChannel;

      await channel.send({
        content: message,
        tts: true, 
      });

      await DiscordLogger.log(
        `User ${interaction.user.tag} sent TTS message: "${message}"`,
        "info"
      );

      await interaction.reply({
        content: "✅ TTS message sent successfully!",
        ephemeral: true,
      });
    } catch (error) {
      await DiscordLogger.log(
        `Error in /tts command from ${interaction.user.tag}: ${error}`,
        "error"
      );
      await interaction.reply({
        content: "❌ Failed to send TTS message.",
        ephemeral: true,
      });
    }
  }
}
