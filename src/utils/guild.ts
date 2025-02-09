// src/utils/guild.ts
import { Client } from 'discord.js';
import { logger } from './logger';

export class GuildManager {
  private guildId: string | null = null;

  constructor(private readonly client: Client) {}

  async initialize(): Promise<string> {
    if (!this.client.isReady()) {
      await new Promise<void>((resolve) => {
        this.client.once('ready', () => resolve());
      });
    }

    const guilds = [...this.client.guilds.cache.values()];

    if (guilds.length === 0) {
      throw new Error('Bot is not a member of any guild');
    }

    if (guilds.length > 1) {
      logger.warn({
        guildCount: guilds.length,
        guilds: guilds.map(g => ({ name: g.name, id: g.id }))
      }, 'Bot is in multiple guilds, using the first one');
    }

    this.guildId = guilds[0].id;
    logger.info({ guildId: this.guildId, guildName: guilds[0].name }, 'Guild ID set');
    
    return this.guildId;
  }

  getGuildId(): string {
    if (!this.guildId) {
      throw new Error('Guild ID not initialized. Call initialize() first');
    }
    return this.guildId;
  }
}

