import { TextChannel, Client } from 'discord.js';
import { BroadcastResult, Group } from '../types';
import { logger } from '../utils/logger';
import { config } from '../config/config';
import { BotError } from '../utils/error';

export class BroadcastService {
  private cooldowns: Map<string, number> = new Map();

  constructor(private readonly client: Client) {}

  private checkCooldown(userId: string): boolean {
    const lastUsed = this.cooldowns.get(userId);
    const now = Date.now();
    
    if (lastUsed && now - lastUsed < config.cooldownMs) {
      return false;
    }
    
    this.cooldowns.set(userId, now);
    return true;
  }

  private async sendToGroup(group: Group, message: string): Promise<void> {
    const channel = this.client.channels.cache.get(group.channelId) as TextChannel;
    if (!channel) {
      throw new Error(`Channel not found for group: ${group.name}`);
    }
    
    await channel.send(`<@&${group.roleId}> ${message}`);
  }

  async broadcast(userId: string, message: string): Promise<BroadcastResult> {
    if (!this.checkCooldown(userId)) {
      throw new BotError('Command on cooldown', 'COOLDOWN_ERROR');
    }

    logger.info({ userId, groupCount: config.groups.length }, 'Starting broadcast');
    
    const results = await Promise.allSettled(
      config.groups.map(group => this.sendToGroup(group, message))
    );

    const successful: string[] = [];
    const failed: string[] = [];

    results.forEach((result, index) => {
      const groupName = config.groups[index].name;
      if (result.status === 'fulfilled') {
        successful.push(groupName);
      } else {
        failed.push(groupName);
        logger.error({ 
          error: result.reason, 
          groupName 
        }, 'Failed to broadcast to group');
      }
    });

    logger.info({ 
      successful, 
      failed, 
      userId 
    }, 'Broadcast completed');

    return { successful, failed };
  }
}