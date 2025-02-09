import { Client, TextChannel } from "discord.js";
import { config } from "../config/config";

export class GroupNameService {
  constructor(private readonly client: Client) {}

  async sendMessage(roleId: string, message: string): Promise<void> {
    const group = config.groups.find((g) => g.roleId === roleId);
    if (!group) {
      throw new Error("No group found for the specified role.");
    }

    const channel = this.client.channels.cache.get(
      group.channelId
    ) as TextChannel;
    if (!channel) {
      throw new Error("Channel not found for the specified group.");
    }

    const formattedMessage = `<@&${roleId}>\n\n${message}`;
    await channel.send(formattedMessage);
  }
}
