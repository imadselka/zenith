import {
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  SlashCommandBuilder,
  TextChannel,
} from "discord.js";
import { DiscordLogger } from "../utils/discordLogger";

export const messageCommand = new SlashCommandBuilder()
  .setName("message")
  .setDescription("Send a message through the bot")
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
  .addChannelOption((option) =>
    option
      .setName("channel")
      .setDescription("The channel to send the message to")
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("content")
      .setDescription("The message content (text, links, etc.)")
      .setRequired(true)
  );

export class MessageCommand {
  async execute(interaction: ChatInputCommandInteraction) {
    try {
      const channel = interaction.options.getChannel("channel") as TextChannel;
      const content = interaction.options.getString("content", true);

      if (!channel.isTextBased()) {
        throw new Error("Selected channel must be a text channel");
      }

      await interaction.deferReply({ ephemeral: true });

      await channel.send(content);

      await DiscordLogger.log(
        `User ${interaction.user.tag} sent message in #${channel.name}: "${content}"`,
        "success"
      );

      await interaction.editReply({
        content: "✅ Message sent successfully!",
      });
    } catch (error) {
      await DiscordLogger.log(
        `Error in /message command from ${interaction.user.tag}: ${error}`,
        "error"
      );
      await interaction.reply({
        content: "❌ Failed to send message.",
        ephemeral: true,
      });
    }
  }
}
