import {
  ActionRowBuilder,
  ChatInputCommandInteraction,
  ModalBuilder,
  ModalSubmitInteraction,
  PermissionFlagsBits,
  SlashCommandBuilder,
  TextChannel,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import { DiscordLogger } from "../utils/discordLogger";

export const announceCommand = new SlashCommandBuilder()
  .setName("announce")
  .setDescription(
    "Opens a modal to send an announcement to the announcements channel"
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages);

export class AnnounceCommand {
  // use /channels to find the announcements channel id
  private readonly ANNOUNCEMENTS_CHANNEL_ID = "1338580553791832074";

  async execute(interaction: ChatInputCommandInteraction) {
    const modal = new ModalBuilder()
      .setCustomId("announceModal")
      .setTitle("Send Announcement");

    const announcementInput = new TextInputBuilder()
      .setCustomId("announcementContent")
      .setLabel("Announcement Message")
      .setStyle(TextInputStyle.Paragraph)
      .setPlaceholder("Enter your announcement message here...")
      .setRequired(true)
      .setMinLength(1)
      .setMaxLength(2000);

    const actionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(
      announcementInput
    );

    modal.addComponents(actionRow);
    await interaction.showModal(modal);
  }

  async handleModalSubmit(interaction: ModalSubmitInteraction) {
    try {
      await interaction.deferReply({ ephemeral: true });
      const message = interaction.fields.getTextInputValue(
        "announcementContent"
      );

      const channel = interaction.client.channels.cache.get(
        this.ANNOUNCEMENTS_CHANNEL_ID
      );

      if (!channel?.isTextBased()) {
        throw new Error(
          "Announcements channel not found or is not a text channel"
        );
      }

      const textChannel = channel as TextChannel;
      await textChannel.send({
        content: `@everyone\n\n${message}`,
        allowedMentions: { parse: ["everyone"] },
      });

      await DiscordLogger.log(
        `User ${interaction.user.tag} sent announcement: "${message}"`,
        "success"
      );

      await interaction.editReply({
        content: "✅ Announcement sent successfully!",
      });
    } catch (error) {
      await DiscordLogger.log(
        `Error in announce modal from ${interaction.user.tag}: ${error}`,
        "error"
      );
      await interaction.editReply("❌ Failed to send announcement.");
    }
  }
}
