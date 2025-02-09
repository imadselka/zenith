import {
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  Message,
  PermissionFlagsBits,
  SlashCommandBuilder,
  TextChannel,
} from "discord.js";
import { DiscordLogger } from "../utils/discordLogger";

export const pinCommand = new SlashCommandBuilder()
  .setName("pin")
  .setDescription("Pin a message from recent messages")
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
  .addStringOption((option) =>
    option
      .setName("message")
      .setDescription("Select a message to pin")
      .setRequired(true)
      .setAutocomplete(true)
  );

export class PinCommand {
  private messageCache: Map<string, Message> = new Map();

  async handleAutocomplete(interaction: AutocompleteInteraction) {
    try {
      if (!interaction.channel?.isTextBased()) return;
      const textChannel = interaction.channel as TextChannel;

      // Fetch last 25 messages
      const messages = await textChannel.messages.fetch({ limit: 25 });
      this.messageCache.clear(); // Clear previous cache

      const choices = messages.map((msg) => {
        // Truncate username if too long
        const username =
          msg.author.username.length > 15
            ? msg.author.username.substring(0, 12) + "..."
            : msg.author.username;

        // Calculate remaining space for content
        const remainingSpace = 94 - username.length; // 94 to account for ": " separator

        // Process message content
        let preview = msg.content || "[No text content]";
        if (preview.length > remainingSpace) {
          preview = preview.substring(0, remainingSpace - 3) + "...";
        }

        const choice = `${username}: ${preview}`;
        this.messageCache.set(choice, msg);
        return choice;
      });

      const focused = interaction.options.getFocused().toLowerCase();
      const filtered = choices.filter((choice) =>
        choice.toLowerCase().includes(focused)
      );

      await interaction.respond(
        filtered.slice(0, 25).map((choice) => ({
          name: choice,
          value: choice,
        }))
      );
    } catch (error) {
      console.error("Error in autocomplete:", error);
      // Provide a fallback response if there's an error
      await interaction.respond([
        {
          name: "Error loading messages",
          value: "error",
        },
      ]);
    }
  }

  async execute(interaction: ChatInputCommandInteraction) {
    try {
      if (!interaction.channel?.isTextBased()) {
        throw new Error("This command can only be used in text channels");
      }

      const textChannel = interaction.channel as TextChannel;
      const selectedChoice = interaction.options.getString("message", true);
      const messageToPin = this.messageCache.get(selectedChoice);

      if (!messageToPin) {
        throw new Error("Selected message not found. Please try again.");
      }

      await messageToPin.pin();

      await DiscordLogger.log(
        `User ${
          interaction.user.tag
        } pinned a message in ${textChannel.toString()}`,
        "success"
      );

      await interaction.reply({
        content: `✅ Message pinned successfully!\nPinned message from ${
          messageToPin.author.username
        }: "${messageToPin.content.substring(0, 100)}${
          messageToPin.content.length > 100 ? "..." : ""
        }"`,
        ephemeral: true,
      });
    } catch (error) {
      await DiscordLogger.log(
        `Error in /pin command from ${interaction.user.tag}: ${error}`,
        "error"
      );
      await interaction.reply({
        content:
          "❌ Failed to pin message. Make sure you're using the command correctly.",
        ephemeral: true,
      });
    }
  }
}
