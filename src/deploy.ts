import { Client, GatewayIntentBits, REST, Routes } from "discord.js";
import { broadcastCommand } from "./commands/broadcast.command";
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
      body: [broadcastCommand.toJSON()],
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
