import { Client, GatewayIntentBits, REST, Routes } from "discord.js";
import { announceCommand } from "./commands/announce.command";
import { broadcastCommand } from "./commands/broadcast.command";
import { channelsCommand } from "./commands/channels.command";
import { cleanupCommand } from "./commands/cleanup.command";
import { clearCommand } from "./commands/clear.commands";
import { createGroupCommand } from "./commands/create-group.command";
import { deleteGroupCommand } from "./commands/delete-group.command";
import { groupNameCommand } from "./commands/group-name.command";
import { listGroupsCommand } from "./commands/list-groups.command";
import { messageCommand } from "./commands/message.command";
import { moveCommand } from "./commands/move.command";
import { pinCommand } from "./commands/pin.command";
import { pollCommand } from "./commands/poll.command";
import { remindCommand } from "./commands/remind.command";
import { rolesCommand } from "./commands/roles.command";
import { serverInfoCommand } from "./commands/serverinfo.command";
import { slowmodeCommand } from "./commands/slowmode.commands";
import { ttsCommand } from "./commands/tts.command";
import { userInfoCommand } from "./commands/userinfo.command";
import { env } from "./config/config";
import { GuildManager } from "./utils/guild";
import { logger } from "./utils/logger";

export async function registerCommands(): Promise<void> {
  const client = new Client({
    intents: [GatewayIntentBits.Guilds],
  });

  const guildManager = new GuildManager(client);

  try {
    // Login and get guild ID auto
    await client.login(env.DISCORD_TOKEN);
    const guildId = await guildManager.initialize();

    const rest = new REST().setToken(env.DISCORD_TOKEN);

    logger.info({ guildId }, "Starting command registration");

    await rest.put(Routes.applicationGuildCommands(env.CLIENT_ID, guildId), {
      body: [
        broadcastCommand.toJSON(),
        groupNameCommand.toJSON(),
        rolesCommand.toJSON(),
        channelsCommand.toJSON(),
        serverInfoCommand.toJSON(),
        pollCommand.toJSON(),
        remindCommand.toJSON(),
        userInfoCommand.toJSON(),
        cleanupCommand.toJSON(),
        ttsCommand.toJSON(),
        messageCommand.toJSON(),
        announceCommand.toJSON(),
        pinCommand.toJSON(),
        clearCommand.toJSON(),
        slowmodeCommand.toJSON(),
        createGroupCommand.toJSON(),
        deleteGroupCommand.toJSON(),
        listGroupsCommand.toJSON(),
        moveCommand.toJSON(),
      ],
    });

    logger.info("Commands registered successfully");
  } catch (error) {
    logger.error({ error }, "Failed to register commands");
    throw error;
  } finally {
    client.destroy();
  }
}

if (require.main === module) {
  registerCommands().catch(() => process.exit(1));
}
