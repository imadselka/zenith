import { Guild, Role } from "discord.js";

export function getGroupRoles(guild: Guild): Role[] {
  const groupRoleRegex = /^[0-9]+\sgroup$/;
  const groupRoles = guild.roles.cache.filter((role) =>
    groupRoleRegex.test(role.name)
  );
  return Array.from(groupRoles.values());
}
