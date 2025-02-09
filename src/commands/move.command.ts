import {
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";
import { config } from "../config/config";
import { GroupManagementService } from "../services/group-management.service";
import { DiscordLogger } from "../utils/discordLogger";

export const moveCommand = new SlashCommandBuilder()
  .setName("move")
  .setDescription("Moves a user to a different group")
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
  .addUserOption((option) =>
    option.setName("user").setDescription("The user to move").setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("group")
      .setDescription("The target group")
      .setRequired(true)
      .setAutocomplete(true)
  );

export class MoveCommand {
  constructor(
    private readonly groupManagementService: GroupManagementService
  ) {}

  async handleAutocomplete(interaction: AutocompleteInteraction) {
    try {
      if (!interaction.guild) return;

      const groups = config.groups;

      const focusedOption = interaction.options.getFocused(true);

      if (focusedOption.name !== "group") return;

      const userId = interaction.options.get("user")?.value as string;
      if (!userId) {
        await interaction.respond([
          { name: "Please select a user first", value: "none" },
        ]);
        return;
      }

      const member = await interaction.guild.members.fetch(userId);

      const currentGroupRole = member.roles.cache.find((role) =>
        groups.some((group) => group.roleId === role.id)
      );

      const choices = groups
        .filter((group) => group.roleId !== currentGroupRole?.id) 
        .map((group) => {
          const role = interaction.guild!.roles.cache.get(group.roleId);
          return {
            name: role?.name || group.name,
            value: group.name,
          };
        });

      const focused = focusedOption.value.toLowerCase();
      const filtered = choices.filter((choice) =>
        choice.name.toLowerCase().includes(focused)
      );

      await interaction.respond(filtered);
    } catch (error) {
      console.error("Error in move autocomplete:", error);
      await interaction.respond([
        {
          name: "Error loading groups",
          value: "error",
        },
      ]);
    }
  }

  async execute(interaction: ChatInputCommandInteraction) {
    try {
      if (
        !interaction.guild?.members.me?.permissions.has(
          PermissionFlagsBits.ManageRoles
        )
      ) {
        throw new Error(
          "I don't have permission to manage roles. Please check my role permissions."
        );
      }

      const user = interaction.options.getUser("user", true);
      const groupName = interaction.options.getString("group", true);

      if (!interaction.guild) {
        throw new Error("Command must be used in a guild");
      }

      const member = await interaction.guild.members.fetch(user.id);
      await interaction.deferReply({ ephemeral: true });

      const botHighestRole = interaction.guild.members.me?.roles.highest;
      const targetRole = interaction.guild.roles.cache.get(
        config.groups.find((g) => g.name === groupName)?.roleId || ""
      );

      if (!botHighestRole || !targetRole) {
        throw new Error("Could not find the required roles.");
      }

      if (botHighestRole.position <= targetRole.position) {
        throw new Error(
          "I cannot manage this role as it is above or equal to my highest role."
        );
      }

      const groupRoles = config.groups.map((group) => group.roleId);

      const existingGroupRoles = member.roles.cache.filter((role) =>
        groupRoles.includes(role.id)
      );

      if (existingGroupRoles.size > 0) {
        await member.roles.remove(existingGroupRoles);
      }

      await this.groupManagementService.moveUser(member, groupName);

      await DiscordLogger.log(
        `User ${interaction.user.tag} moved ${user.tag} to group: ${groupName}`,
        "success"
      );

      const newRole = interaction.guild.roles.cache.get(
        config.groups.find((g) => g.name === groupName)?.roleId || ""
      );

      await interaction.editReply(
        `✅ Successfully moved ${user.tag} to group "${
          newRole?.name || groupName
        }"`
      );
    } catch (error) {
      await DiscordLogger.log(
        `Error in /move command from ${interaction.user.tag}: ${error}`,
        "error"
      );
      await interaction.editReply(`❌ Failed to move user: ${error}`);
    }
  }
}
