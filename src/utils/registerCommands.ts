import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v10";

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

const commands = [
  {
    name: "broadcast",
    description: "Broadcast a message to all groups channels",
    options: [
      {
        type: 3,
        name: "message",
        description: "Message to broadcast",
        required: true,
      },
    ],
  },
];

const rest = new REST({ version: "10" }).setToken(DISCORD_TOKEN as string);

(async () => {
  try {
    console.log("Started refreshing application (/) commands.");

    if (GUILD_ID) {
      await rest.put(
        Routes.applicationGuildCommands(CLIENT_ID as string, GUILD_ID),
        { body: commands }
      );
    } else {
      await rest.put(Routes.applicationCommands(CLIENT_ID as string), {
        body: commands,
      });
    }

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
})();
