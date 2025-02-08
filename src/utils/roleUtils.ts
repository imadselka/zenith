import { Guild, Role } from "discord.js";

/**
 * Retrieves all roles from the guild whose name matches the pattern "number group".
 * For example: "18 group"
 *
 * @param guild The Discord guild to filter roles from.
 * @returns An array of Role objects matching the pattern.
 */
export function getGroupRoles(guild: Guild): Role[] {
  const groupRoleRegex = /^[0-9]+\sgroup$/;
  const groupRoles = guild.roles.cache.filter(role => groupRoleRegex.test(role.name));
  return Array.from(groupRoles.values());
}
