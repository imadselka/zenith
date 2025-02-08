import { Guild, GuildBasedChannel } from "discord.js";

export function displayAllChannels(guild: Guild): void {
  console.log("All Channels in the Guild:");
  guild.channels.cache.forEach((channel) => {
    console.log(`- ${channel.name} (ID: ${channel.id})`);
  });
}

export function getChatChannels(guild: Guild): GuildBasedChannel[] {
  const chatChannels = guild.channels.cache.filter((channel) =>
    channel.name.startsWith("chat_")
  );
  return Array.from(chatChannels.values());
}
