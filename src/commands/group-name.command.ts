import {
  ChatInputCommandInteraction,
  GuildMember,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";
import { config } from "../config/config";
import { GroupNameService } from "../services/group-name.service";
import { PermissionError } from "../utils/error";
import { logger } from "../utils/logger";

export const groupNameCommand = new SlashCommandBuilder()
  .setName("group-name")
  .setDescription("Send a message for a specific group")
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
  .addRoleOption((option) =>
    option
      .setName("role")
      .setDescription("Select the group role")
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("message")
      .setDescription("The message to send")
      .setRequired(true)
  );

export class GroupNameCommand {
  constructor(private readonly groupNameService: GroupNameService) {}

  async execute(interaction: ChatInputCommandInteraction) {
    try {
      const member = interaction.member as GuildMember;
      if (!member?.roles?.cache?.has(config.moderatorRoleId)) {
        throw new PermissionError("Insufficient permissions");
      }

      const role = interaction.options.getRole("role");
      if (!role) {
        throw new Error("Role option is missing.");
      }
      const message = interaction.options.getString("message", true);

      await interaction.deferReply({ ephemeral: true });

      await this.groupNameService.sendMessage(role.id, message);

      await interaction.editReply({ content: "✅ Message sent successfully." });
    } catch (error: unknown) {
      logger.error({ error }, "Error executing group-name command");
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      await interaction.reply({
        content: `❌ ${errorMessage}`,
        ephemeral: true,
      });
    }
  }
}
