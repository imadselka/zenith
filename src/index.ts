import { Client, Events, GatewayIntentBits } from 'discord.js';
import { InteractionHandler } from './handlers/interaction.handler';
import { env } from './config/config';
import { logger } from './utils/logger';
import { GuildManager } from './utils/guild';

const client = new Client({ 
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages
  ]
});

// Create guild manager instance
const guildManager = new GuildManager(client);
const interactionHandler = new InteractionHandler(client);

client.once(Events.ClientReady, async () => {
  try {
    await guildManager.initialize();
    logger.info('Bot is ready!');
  } catch (error) {
    logger.error({ error }, 'Failed to initialize guild');
    process.exit(1);
  }
});

client.on(Events.InteractionCreate, (interaction) => {
  interactionHandler.handle(interaction).catch(error => {
    logger.error({ error }, 'Unhandled error in interaction handler');
  });
});

// For serverless platforms
export async function handler(event: any) {
  if (!client.isReady()) {
    await client.login(env.DISCORD_TOKEN);
    await guildManager.initialize();
  }
  
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Success' })
  };
}

// Start bot if running directly
if (require.main === module) {
  client.login(env.DISCORD_TOKEN).catch(error => {
    logger.error({ error }, 'Failed to start bot');
    process.exit(1);
  });
}