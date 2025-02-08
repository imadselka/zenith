import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID; // If you want to register the command for a specific server

// Define the /broadcast command.
const commands = [
  {
    name: "broadcast",
    description: "Broadcast a message to all groups channels",
    options: [
      {
        type: 3, // STRING type
        name: "message",
        description: "Message to broadcast",
        required: true,
      }
    ]
    // Note: You can restrict access via Discord's default_member_permissions if you wish,
    // but additional checks are performed in the interaction handler.
  }
];

const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN as string);

(async () => {
  try {
    console.log("Started refreshing application (/) commands.");

    // For guild-based commands:
    if (GUILD_ID) {
      await rest.put(
        Routes.applicationGuildCommands(CLIENT_ID as string, GUILD_ID),
        { body: commands }
      );
    } else {
      // For global commands:
      await rest.put(
        Routes.applicationCommands(CLIENT_ID as string),
        { body: commands }
      );
    }

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
})();