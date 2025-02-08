import { Client, Interaction } from "discord.js";
import { BroadcastCommand } from "../commands/broadcast.command";
import { BroadcastService } from "../services/broadcast.service";
import { logger } from "../utils/logger";

export class InteractionHandler {
  private readonly broadcastCommand: BroadcastCommand;

  constructor(client: Client) {
    const broadcastService = new BroadcastService(client);
    this.broadcastCommand = new BroadcastCommand(broadcastService);
  }

  async handle(interaction: Interaction): Promise<void> {
    try {
      // Check if the interaction is a modal submission first.
      if (interaction.isModalSubmit()) {
        if (interaction.customId === "broadcastModal") {
          await this.broadcastCommand.handleModalSubmit(interaction);
        }
      }
      // Then check for chat input commands.
      else if (interaction.isChatInputCommand()) {
        if (interaction.commandName === "broadcast") {
          await this.broadcastCommand.execute(interaction);
        }
      }
    } catch (error) {
      logger.error({ error }, "Error handling interaction");
    }
  }
}
