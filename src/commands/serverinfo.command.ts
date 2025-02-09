import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { DiscordLogger } from "../utils/discordLogger";

export const serverInfoCommand = new SlashCommandBuilder()
  .setName("serverinfo")
  .setDescription("Display detailed information about the server");

export class ServerInfoCommand {
  async execute(interaction: ChatInputCommandInteraction) {
    try {
      const guild = interaction.guild;
      if (!guild) return;

      const embed = new EmbedBuilder()
        .setTitle(guild.name)
        .addFields(
          {
            name: "Total Members",
            value: guild.memberCount.toString(),
            inline: true,
          },
          {
            name: "Created At",
            value: guild.createdAt.toLocaleDateString(),
            inline: true,
          },
          {
            name: "Boost Level",
            value: guild.premiumTier.toString(),
            inline: true,
          },
          {
            name: "Total Roles",
            value: guild.roles.cache.size.toString(),
            inline: true,
          },
          {
            name: "Total Channels",
            value: guild.channels.cache.size.toString(),
            inline: true,
          }
        )
        .setThumbnail(guild.iconURL() || "")
        .setColor("#ff9900");

      await interaction.reply({ embeds: [embed] });
      await DiscordLogger.log(
        `User ${interaction.user.tag} requested server info`,
        "info"
      );
    } catch (error) {
      await DiscordLogger.log(`Error in /serverinfo: ${error}`, "error");
    }
  }
}
