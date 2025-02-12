import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";

export const pollCommand = new SlashCommandBuilder()
  .setName("poll")
  .setDescription("Create a poll")
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
  .addStringOption((option) =>
    option
      .setName("question")
      .setDescription("The poll question")
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("options")
      .setDescription("Poll options (comma-separated)")
      .setRequired(true)
  );

export class PollCommand {
  async execute(interaction: ChatInputCommandInteraction) {
    const question = interaction.options.getString("question", true);
    const options = interaction.options.getString("options", true).split(",");

    if (options.length > 10) {
      await interaction.reply("Maximum 10 options allowed!");
      return;
    }

    const reactions = [
      "1️⃣",
      "2️⃣",
      "3️⃣",
      "4️⃣",
      "5️⃣",
      "6️⃣",
      "7️⃣",
      "8️⃣",
      "9️⃣",
      "🔟",
    ];
    const pollOptions = options.map(
      (opt, i) => `${reactions[i]} ${opt.trim()}`
    );

    const embed = new EmbedBuilder()
      .setTitle("📊 " + question)
      .setDescription(pollOptions.join("\n\n"))
      .setColor("#ff00ff");

    const message = await interaction.reply({
      embeds: [embed],
      fetchReply: true,
    });

    for (let i = 0; i < options.length; i++) {
      await message.react(reactions[i]);
    }
  }
}
