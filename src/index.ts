import { Client, Events, GatewayIntentBits, TextChannel } from "discord.js";
import { env } from "./config/config";
import { InteractionHandler } from "./handlers/interaction.handler";
import { DiscordLogger } from "./utils/discordLogger";
import { GuildManager } from "./utils/guild";
import { logger } from "./utils/logger";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions,
  ],
});

// Create guild manager instance
const guildManager = new GuildManager(client);
const interactionHandler = new InteractionHandler(client);

// Define the channel ID where logs should be sent.
// The Channel id u get it from the terminal logs.
const botLogsChannelId = "1337897157608603668";

client.once(Events.ClientReady, async () => {
  try {
    await guildManager.initialize();
    DiscordLogger.initialize(client, botLogsChannelId);
    await DiscordLogger.log("Bot is ready! 🚀", "success");
    logger.info("Bot is ready!");
  } catch (error) {
    logger.error({ error }, "Failed to initialize guild");
    process.exit(1);
  }
});

client.on(Events.InteractionCreate, (interaction) => {
  interactionHandler.handle(interaction).catch((error) => {
    logger.error({ error }, "Unhandled error in interaction handler");
  });
});

// Listen for every message and log it to the specified bot-commands channel.
client.on(Events.MessageCreate, async (message) => {
  // Ignore messages sent by bots.
  if (message.author.bot) return;

  // Ensure the message is in a guild.
  if (!message.guild) return;

  // Retrieve the channel by its ID.
  const logChannel = message.guild.channels.cache.get(botLogsChannelId);

  if (!logChannel) {
    logger.error(
      `Channel with ID ${botLogsChannelId} not found in guild: ${message.guild.name}`
    );
    return;
  }

  // Verify that the channel supports sending messages.
  if (!("send" in logChannel)) {
    logger.error(
      `Channel ${logChannel.name} does not support sending messages`
    );
    return;
  }

  try {
    // Cast the channel to TextChannel and send the log.
    await (logChannel as TextChannel).send(
      `Message from ${message.author.tag}: ${message.content}`
    );
  } catch (err) {
    logger.error({ err }, "Failed to send message log to bot-commands channel");
  }
});

// For serverless platforms
export async function handler(event: any) {
  if (!client.isReady()) {
    await client.login(env.DISCORD_TOKEN);
    await guildManager.initialize();
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Success" }),
  };
}

// Start bot if running directly
if (require.main === module) {
  client.login(env.DISCORD_TOKEN).catch((error) => {
    logger.error({ error }, "Failed to start bot");
    process.exit(1);
  });
}
