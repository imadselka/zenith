import { Client, Interaction } from "discord.js";
import { BroadcastCommand } from "../commands/broadcast.command";
import { GroupNameCommand } from "../commands/group-name.command";
import { BroadcastService } from "../services/broadcast.service";
import { GroupNameService } from "../services/group-name.service";
import { logger } from "../utils/logger";

export class InteractionHandler {
  private readonly broadcastCommand: BroadcastCommand;
  private readonly groupNameCommand: GroupNameCommand;

  constructor(client: Client) {
    const broadcastService = new BroadcastService(client);
    this.broadcastCommand = new BroadcastCommand(broadcastService);

    const groupNameService = new GroupNameService(client);
    this.groupNameCommand = new GroupNameCommand(groupNameService);
  }

  async handle(interaction: Interaction): Promise<void> {
    try {
      // Handle modal submissions first.
      if (interaction.isModalSubmit()) {
        if (interaction.customId === "broadcastModal") {
          await this.broadcastCommand.handleModalSubmit(interaction);
        }
      }
      // Then process chat input commands.
      else if (interaction.isChatInputCommand()) {
        if (interaction.commandName === "broadcast") {
          await this.broadcastCommand.execute(interaction);
        } else if (interaction.commandName === "group-name") {
          await this.groupNameCommand.execute(interaction);
        }
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      logger.error({ error }, "Error handling interaction");

      // Only attempt a reply if the interaction is one that supports it.
      if (interaction.isChatInputCommand() || interaction.isModalSubmit()) {
        try {
          // If the interaction was already deferred or replied to, try to edit the reply.
          if (interaction.replied || interaction.deferred) {
            await interaction.editReply({ content: `❌ ${errorMessage}` });
          } else {
            await interaction.reply({
              content: `❌ ${errorMessage}`,
              ephemeral: true,
            });
          }
        } catch (replyError) {
          logger.error(
            { replyError },
            "Failed to send error response to interaction"
          );
        }
      } else {
        logger.error("Interaction type does not support replying");
      }
    }
  }
}
