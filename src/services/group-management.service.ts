import {
  ChannelType,
  Client,
  Guild,
  GuildMember,
  PermissionFlagsBits,
  Role,
  TextChannel,
} from "discord.js";
import { config } from "../config/config";

export class GroupManagementService {
  constructor(private readonly client: Client) {}

  async createGroup(guild: Guild, groupName: string): Promise<void> {
    const role = await guild.roles.create({
      name: `${groupName} group`,
      reason: "New study group creation",
    });

    const category = await guild.channels.create({
      name: `Group ${groupName}`,
      type: ChannelType.GuildCategory,
    });

    const textChannel = await guild.channels.create({
      name: `chat_${groupName}`,
      type: ChannelType.GuildText,
      parent: category,
      permissionOverwrites: [
        {
          id: guild.id,
          deny: [PermissionFlagsBits.ViewChannel],
        },
        {
          id: role.id,
          allow: [PermissionFlagsBits.ViewChannel],
        },
      ],
    });

    config.groups.push({
      channelId: textChannel.id,
      roleId: role.id,
      name: groupName,
    });
  }

  async deleteGroup(guild: Guild, groupName: string): Promise<void> {
    const group = config.groups.find((g) => g.name === groupName);
    if (!group) throw new Error("Group not found");

    const role = guild.roles.cache.get(group.roleId);
    if (role) await role.delete();

    const channel = guild.channels.cache.get(group.channelId);
    if (channel) {
      const parentCategory = channel.parent;
      await channel.delete();
      if (parentCategory) {
        await parentCategory.delete();
      }
    }

    config.groups = config.groups.filter((g) => g.name !== groupName);
  }

  async moveUser(member: GuildMember, targetGroup: string): Promise<void> {
    const group = config.groups.find((g) => g.name === targetGroup);
    if (!group) throw new Error("Target group not found");

    const otherGroupRoles = config.groups
      .map((g) => member.guild.roles.cache.get(g.roleId))
      .filter((r): r is Role => r !== undefined);

    await member.roles.remove(otherGroupRoles);

    const newRole = member.guild.roles.cache.get(group.roleId);
    if (!newRole) throw new Error("Group role not found");

    await member.roles.add(newRole);
  }

  async lockGroup(
    guild: Guild,
    groupName: string,
    locked: boolean
  ): Promise<void> {
    const group = config.groups.find((g) => g.name === groupName);
    if (!group) throw new Error("Group not found");

    const channel = guild.channels.cache.get(group.channelId) as TextChannel;
    if (!channel) throw new Error("Channel not found");

    const role = guild.roles.cache.get(group.roleId);
    if (!role) throw new Error("Role not found");

    await channel.permissionOverwrites.edit(role, {
      SendMessages: !locked,
    });
  }
}
