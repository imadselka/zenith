import {
  ActionRowBuilder,
  ChatInputCommandInteraction,
  GuildMember,
  ModalBuilder,
  ModalSubmitInteraction,
  PermissionFlagsBits,
  SlashCommandBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import { config } from "../config/config";
import { BroadcastService } from "../services/broadcast.service";
import { BroadcastResult } from "../types";
import { BotError, PermissionError } from "../utils/error";
import { logger } from "../utils/logger";

export const broadcastCommand = new SlashCommandBuilder()
  .setName("broadcast")
  .setDescription("Open a modal to broadcast a message")
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages);

export class BroadcastCommand {
  constructor(private readonly broadcastService: BroadcastService) {}

  async execute(interaction: ChatInputCommandInteraction) {
    const member = interaction.member as GuildMember;

    // Verify moderator role
    if (!member?.roles?.cache?.has(config.moderatorRoleId)) {
      throw new PermissionError("Insufficient permissions");
    }

    // Build the modal
    const modal = new ModalBuilder()
      .setCustomId("broadcastModal")
      .setTitle("Broadcast Message");

    const messageInput = new TextInputBuilder()
      .setCustomId("broadcastMessageInput")
      .setLabel("Enter your message")
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true)
      .setMaxLength(2000);

    const actionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(
      messageInput
    );

    modal.addComponents(actionRow);

    await interaction.showModal(modal);
  }

  async handleModalSubmit(interaction: ModalSubmitInteraction) {
    try {
      const message = interaction.fields.getTextInputValue(
        "broadcastMessageInput"
      );

      await interaction.deferReply({ ephemeral: true });

      const result = await this.broadcastService.broadcast(
        interaction.user.id,
        message
      );

      const responseMessage = this.formatResponse(result);
      await interaction.editReply({ content: responseMessage });
    } catch (error: unknown) {
      logger.error({ error }, "Error processing broadcast modal submission");

      const errorMessage =
        error instanceof BotError
          ? error.message
          : "An unexpected error occurred";

      await interaction.editReply({ content: `❌ ${errorMessage}` });
    }
  }

  private formatResponse({ successful, failed }: BroadcastResult): string {
    const parts: string[] = [];

    if (successful.length) {
      parts.push(`✅ Message broadcast to: ${successful.join(", ")}`);
    }

    if (failed.length) {
      parts.push(`❌ Failed for: ${failed.join(", ")}`);
    }

    return parts.join("\n");
  }
}
