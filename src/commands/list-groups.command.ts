import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";
import { config } from "../config/config";
import { DiscordLogger } from "../utils/discordLogger";

export const listGroupsCommand = new SlashCommandBuilder()
  .setName("list-groups")
  .setDescription("Lists all available groups")
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

export class ListGroupsCommand {
  async execute(interaction: ChatInputCommandInteraction) {
    try {
      await interaction.deferReply({ ephemeral: true });

      const groupsList = config.groups
        .map((group, index) => {
          const channelMention = `<#${group.channelId}>`;
          const roleMention = `<@&${group.roleId}>`;
          return `${index + 1}. ${
            group.name
          }\n   Channel: ${channelMention}\n   Role: ${roleMention}`;
        })
        .join("\n\n");

      const embed = new EmbedBuilder()
        .setTitle("📋 Available Groups")
        .setColor("#00ff00")
        .setDescription(groupsList || "No groups available")
        .setTimestamp()
        .setFooter({
          text: `Requested by ${interaction.user.tag}`,
          iconURL: interaction.user.displayAvatarURL(),
        });

      await DiscordLogger.log(
        `User ${interaction.user.tag} listed all groups`,
        "info"
      );

      await interaction.editReply({
        embeds: [embed],
      });
    } catch (error) {
      await DiscordLogger.log(
        `Error in /list-groups command from ${interaction.user.tag}: ${error}`,
        "error"
      );

      if (interaction.deferred) {
        await interaction.editReply({
          content: "❌ Failed to list groups. Please try again.",
        });
      } else {
        await interaction.reply({
          content: "❌ Failed to list groups. Please try again.",
          ephemeral: true,
        });
      }
    }
  }
}
