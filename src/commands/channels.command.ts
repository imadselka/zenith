import {
  ChannelType,
  ChatInputCommandInteraction,
  EmbedBuilder,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";
import { DiscordLogger } from "../utils/discordLogger";

export const channelsCommand = new SlashCommandBuilder()
  .setName("channels")
  .setDescription("Display all channels in the server")
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels);

export class ChannelsCommand {
  async execute(interaction: ChatInputCommandInteraction) {
    try {
      await interaction.deferReply({ ephemeral: true });

      const channels = interaction.guild?.channels.cache
        .filter((channel) => channel.type === ChannelType.GuildText)
        .map((channel) => `${channel.name}: ${channel.id}`);

      const embed = new EmbedBuilder()
        .setTitle("Server Channels")
        .setDescription(channels?.join("\n") || "No channels found")
        .setColor("#0099ff")
        .setTimestamp();

      await DiscordLogger.log(
        `User ${interaction.user.tag} requested channels list`,
        "info"
      );

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      await DiscordLogger.log(
        `Error in /channels command from ${interaction.user.tag}: ${error}`,
        "error"
      );
      await interaction.editReply("Failed to fetch channels.");
    }
  }
}
