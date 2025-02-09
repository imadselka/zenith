import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  GuildMember,
  SlashCommandBuilder,
} from "discord.js";

export const userInfoCommand = new SlashCommandBuilder()
  .setName("userinfo")
  .setDescription("Get information about a user")
  .addUserOption((option) =>
    option
      .setName("user")
      .setDescription("The user to get info about")
      .setRequired(false)
  );

export class UserInfoCommand {
  async execute(interaction: ChatInputCommandInteraction) {
    const targetUser = interaction.options.getUser("user") || interaction.user;
    const member = interaction.guild?.members.cache.get(
      targetUser.id
    ) as GuildMember;

    const embed = new EmbedBuilder()
      .setTitle(`User Info - ${targetUser.tag}`)
      .setThumbnail(targetUser.displayAvatarURL())
      .addFields(
        {
          name: "Joined Server",
          value: member.joinedAt?.toLocaleDateString() || "Unknown",
          inline: true,
        },
        {
          name: "Account Created",
          value: targetUser.createdAt.toLocaleDateString(),
          inline: true,
        },
        {
          name: "Roles",
          value: member.roles.cache.map((r) => r.name).join(", ") || "None",
        }
      )
      .setColor("#00ffff");

    await interaction.reply({ embeds: [embed] });
  }
}
