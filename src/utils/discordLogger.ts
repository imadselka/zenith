import { Client, TextChannel } from "discord.js";
import { logger } from "./logger";

export class DiscordLogger {
  private static channel: TextChannel | null = null;

  static initialize(client: Client, channelId: string) {
    const channel = client.channels.cache.get(channelId) as TextChannel;
    if (!channel) {
      logger.error(`Discord logging channel ${channelId} not found`);
      return;
    }
    this.channel = channel;
  }

  static async log(
    message: string,
    type: "info" | "error" | "success" = "info"
  ) {
    if (!this.channel) {
      logger.error("Discord logger not initialized");
      return;
    }

    const emoji = {
      info: "ℹ️",
      error: "❌",
      success: "✅",
    }[type];

    try {
      await this.channel.send(`${emoji} ${message}`);
    } catch (error) {
      logger.error({ error }, "Failed to send log to Discord channel");
    }
  }
}
