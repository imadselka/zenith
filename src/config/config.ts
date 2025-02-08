import { Client, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";
import { z } from "zod";
import { BroadcastConfig } from "../types"; // Adjust the path as needed
import { displayAllChannels, getChatChannels } from "../utils/channelutils";

dotenv.config();

// Validate environment variables using zod.
const envSchema = z.object({
  DISCORD_TOKEN: z.string(),
  CLIENT_ID: z.string(),
});
export const env = envSchema.parse(process.env);

// Create a new Discord client with guild intent.
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Initialize config – groups will be updated once we fetch channels.
export const config: BroadcastConfig = {
  groups: [],
  moderatorRoleId: "",
  cooldownMs: 1 * 60 * 1000, // 1 minute
};

client.once("ready", async () => {
  console.log(`Logged in as ${client.user?.tag}`);

  // Replace with your guild ID from the terminal ! 
  const guild = client.guilds.cache.get("1186713963946324058");
  if (!guild) {
    console.error("Guild not found.");
    return;
  }

  displayAllChannels(guild);

  // Retrieve channels whose name starts with "chat_".
  const chatChannels = getChatChannels(guild);
  if (chatChannels.length === 0) {
    console.error("No channels found starting with 'chat_'");
  } else {
    config.groups = chatChannels.map((channel) => ({
      channelId: channel.id,
      roleId: `${channel.name} role`,
      name: channel.name,
    }));
    console.log("Updated groups with chat channels:", config.groups);
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
