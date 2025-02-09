import { Client, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";
import { z } from "zod";
import { BroadcastConfig } from "../types"; // Adjust the path as needed
import { displayAllChannels, getChatChannels } from "../utils/channelUtils";
import { getGroupRoles } from "../utils/roleUtils";

dotenv.config();

const envSchema = z.object({
  DISCORD_TOKEN: z.string(),
  CLIENT_ID: z.string(),
});
export const env = envSchema.parse(process.env);

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

export const config: BroadcastConfig = {
  groups: [],
  moderatorRoleId: "",
  cooldownMs: 0 * 60 * 1000, // 1 minute
};

client.once("ready", async () => {
  console.log(`Logged in as ${client.user?.tag}`);

  // Replace with your guild ID.
  const guild = client.guilds.cache.get("1186713963946324058");
  if (!guild) {
    console.error("Guild not found.");
    return;
  }

  // Display all channels in the guild.
  displayAllChannels(guild);

  // Retrieve channels whose name starts with "chat_".
  const chatChannels = getChatChannels(guild);
  if (chatChannels.length === 0) {
    console.error("No channels found starting with 'chat_'");
  } else {
    // Retrieve roles that match the "number group" pattern.
    const groupRoles = getGroupRoles(guild);
    console.log(
      "Found group roles:",
      groupRoles.map((role) => role.name)
    );

    // Map each chat channel to a group, matching by the numeric part of the channel name.
    config.groups = chatChannels.map((channel) => {
      // Assuming channel name is like "chat_0", split to extract the number.
      const parts = channel.name.split("_");
      const groupNumber = parts.length > 1 ? parts[1] : "";
      let roleId = "";
      if (groupNumber) {
        // The corresponding role name should be like "0 group".
        const matchingRole = groupRoles.find(
          (role) => role.name === `${groupNumber} group`
        );
        if (matchingRole) {
          roleId = matchingRole.id;
        }
      }
      return {
        channelId: channel.id,
        roleId,
        name: channel.name,
      };
    });
    console.log(
      "Updated groups with chat channels and group roles:",
      config.groups
    );
  }

  // Fetch the Moderator Role by its name.
  const moderatorRole = guild.roles.cache.find(
    (r) => r.name === "Community Moderator."
  );
  if (!moderatorRole) {
    console.error("Community Moderator role not found.");
    return;
  }
  config.moderatorRoleId = moderatorRole.id;
  console.log(`Moderator Role ID: ${moderatorRole.id}`);
});

// Log in to Discord with your token.
client.login(env.DISCORD_TOKEN);
