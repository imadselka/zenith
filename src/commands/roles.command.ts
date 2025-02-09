import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";
import { DiscordLogger } from "../utils/discordLogger";

export const rolesCommand = new SlashCommandBuilder()
  .setName("roles")
  .setDescription("Display all roles in the server")
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles);

export class RolesCommand {
  async execute(interaction: ChatInputCommandInteraction) {
    try {
      await interaction.deferReply({ ephemeral: true });

      const roles = interaction.guild?.roles.cache
        .sort((a, b) => b.position - a.position)
        .map((role) => `${role.name}: ${role.id}`);

      const embed = new EmbedBuilder()
        .setTitle("Server Roles")
        .setDescription(roles?.join("\n") || "No roles found")
        .setColor("#00ff00")
        .setTimestamp();

      await DiscordLogger.log(
        `User ${interaction.user.tag} requested roles list`,
        "info"
      );

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      await DiscordLogger.log(
        `Error in /roles command from ${interaction.user.tag}: ${error}`,
        "error"
      );
      await interaction.editReply("Failed to fetch roles.");
    }
  }
}
