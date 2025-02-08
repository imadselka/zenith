import {
    ChatInputCommandInteraction,
    PermissionFlagsBits,
    SlashCommandBuilder,
    GuildMember
  } from "discord.js";
  import { config } from "../config/config";
  import { BroadcastService } from "../services/broadcast.service";
  import { PermissionError } from "../utils/error";
  import { BotError } from "../utils/error";  // Add this import
  import { logger } from "../utils/logger";
  import { BroadcastResult } from "../types";
  
  export const broadcastCommand = new SlashCommandBuilder()
    .setName("broadcast")
    .setDescription("Broadcast a message to all groups")
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("The message to broadcast")
        .setRequired(true)
        .setMaxLength(2000)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages);
  
  export class BroadcastCommand {
    constructor(private readonly broadcastService: BroadcastService) {}
  
    async execute(interaction: ChatInputCommandInteraction) {
      try {
        const member = interaction.member as GuildMember;
        
        // Verify moderator role
        if (!member?.roles?.cache?.has(config.moderatorRoleId)) {
          throw new PermissionError("Insufficient permissions");
        }
  
        const message = interaction.options.getString("message", true);
        await interaction.deferReply({ ephemeral: true });
  
        const result = await this.broadcastService.broadcast(
          interaction.user.id,
          message
        );
  
        const responseMessage = this.formatResponse(result);
        await interaction.editReply({ content: responseMessage });
      } catch (error: unknown) {
        logger.error({ error }, "Error executing broadcast command");
  
        const errorMessage = error instanceof BotError 
          ? error.message 
          : "An unexpected error occurred";
  
        await interaction.editReply({ content: `❌ ${errorMessage}` });
      }
    }
  
    private formatResponse({ successful, failed }: BroadcastResult): string {
      const parts = [];
  
      if (successful.length) {
        parts.push(`✅ Message broadcast to: ${successful.join(", ")}`);
      }
  
      if (failed.length) {
        parts.push(`❌ Failed for: ${failed.join(", ")}`);
      }
  
      return parts.join("\n");
    }
  }