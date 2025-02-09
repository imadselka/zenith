import {
    ChatInputCommandInteraction,
    PermissionFlagsBits,
    SlashCommandBuilder,
  } from "discord.js";
  import { GroupManagementService } from "../services/group-management.service";
  import { DiscordLogger } from "../utils/discordLogger";
  
  export const createGroupCommand = new SlashCommandBuilder()
    .setName("create-group")
    .setDescription("Creates a new group")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addStringOption((option) =>
      option
        .setName("name")
        .setDescription("Name of the group")
        .setRequired(true)
    );
  
  export class CreateGroupCommand {
    constructor(private readonly groupManagementService: GroupManagementService) {}
  
    async execute(interaction: ChatInputCommandInteraction) {
      try {
        const groupName = interaction.options.getString("name", true);
        
        if (!interaction.guild) {
          throw new Error("Command must be used in a guild");
        }
  
        await interaction.deferReply({ ephemeral: true });
  
        await this.groupManagementService.createGroup(interaction.guild, groupName);
  
        await DiscordLogger.log(
          `User ${interaction.user.tag} created group: ${groupName}`,
          "success"
        );
  
        await interaction.editReply(`✅ Group "${groupName}" created successfully!`);
      } catch (error) {
        await DiscordLogger.log(
          `Error in /create-group command from ${interaction.user.tag}: ${error}`,
          "error"
        );
        await interaction.editReply(`❌ Failed to create group: ${error}`);
      }
    }
  }