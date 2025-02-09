import {
    ChatInputCommandInteraction,
    PermissionFlagsBits,
    SlashCommandBuilder,
  } from "discord.js";
  import { GroupManagementService } from "../services/group-management.service";
  import { DiscordLogger } from "../utils/discordLogger";
  
  export const deleteGroupCommand = new SlashCommandBuilder()
    .setName("delete-group")
    .setDescription("Deletes a group")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addStringOption((option) =>
      option
        .setName("name")
        .setDescription("Name of the group to delete")
        .setRequired(true)
    );
  
  export class DeleteGroupCommand {
    constructor(private readonly groupManagementService: GroupManagementService) {}
  
    async execute(interaction: ChatInputCommandInteraction) {
      try {
        const groupName = interaction.options.getString("name", true);
        
        if (!interaction.guild) {
          throw new Error("Command must be used in a guild");
        }
  
        await interaction.deferReply({ ephemeral: true });
  
        await this.groupManagementService.deleteGroup(interaction.guild, groupName);
  
        await DiscordLogger.log(
          `User ${interaction.user.tag} deleted group: ${groupName}`,
          "success"
        );
  
        await interaction.editReply(`✅ Group "${groupName}" deleted successfully!`);
      } catch (error) {
        await DiscordLogger.log(
          `Error in /delete-group command from ${interaction.user.tag}: ${error}`,
          "error"
        );
        await interaction.editReply(`❌ Failed to delete group: ${error}`);
      }
    }
  }