import { Client, Interaction } from "discord.js";
import { AnnounceCommand } from "../commands/announce.command";
import { BroadcastCommand } from "../commands/broadcast.command";
import { ChannelsCommand } from "../commands/channels.command";
import { CleanupCommand } from "../commands/cleanup.command";
import { ClearCommand } from "../commands/clear.commands";
import { CreateGroupCommand } from "../commands/create-group.command";
import { DeleteGroupCommand } from "../commands/delete-group.command";
import { GroupNameCommand } from "../commands/group-name.command";
import { ListGroupsCommand } from "../commands/list-groups.command";
import { MessageCommand } from "../commands/message.command";
import { MoveCommand } from "../commands/move.command";
import { PinCommand } from "../commands/pin.command";
import { PollCommand } from "../commands/poll.command";
import { RemindCommand } from "../commands/remind.command";
import { RolesCommand } from "../commands/roles.command";
import { ServerInfoCommand } from "../commands/serverinfo.command";
import { SlowmodeCommand } from "../commands/slowmode.commands";
import { TTSCommand } from "../commands/tts.command";
import { UserInfoCommand } from "../commands/userinfo.command";
import { BroadcastService } from "../services/broadcast.service";
import { GroupManagementService } from "../services/group-management.service";
import { GroupNameService } from "../services/group-name.service";
import { DiscordLogger } from "../utils/discordLogger";
import { logger } from "../utils/logger";

export class InteractionHandler {
  private readonly broadcastCommand: BroadcastCommand;
  private readonly groupNameCommand: GroupNameCommand;
  private readonly rolesCommand: RolesCommand;
  private readonly channelsCommand: ChannelsCommand;
  private readonly serverInfoCommand: ServerInfoCommand;
  private readonly pollCommand: PollCommand;
  private readonly remindCommand: RemindCommand;
  private readonly userInfoCommand: UserInfoCommand;
  private readonly cleanupCommand: CleanupCommand;
  private readonly ttsCommand: TTSCommand;
  private readonly messageCommand: MessageCommand;
  private readonly announceCommand: AnnounceCommand;
  private readonly pinCommand: PinCommand;
  private readonly clearCommand: ClearCommand;
  private readonly slowmodeCommand: SlowmodeCommand;
  private readonly createGroupCommand: CreateGroupCommand;
  private readonly deleteGroupCommand: DeleteGroupCommand;
  private readonly listGroupsCommand: ListGroupsCommand;
  private readonly moveCommand: MoveCommand;

  constructor(client: Client) {
    const broadcastService = new BroadcastService(client);
    this.broadcastCommand = new BroadcastCommand(broadcastService);

    const groupNameService = new GroupNameService(client);
    this.groupNameCommand = new GroupNameCommand(groupNameService);

    this.rolesCommand = new RolesCommand();
    this.channelsCommand = new ChannelsCommand();
    this.serverInfoCommand = new ServerInfoCommand();
    this.pollCommand = new PollCommand();
    this.remindCommand = new RemindCommand();
    this.userInfoCommand = new UserInfoCommand();
    this.cleanupCommand = new CleanupCommand();
    this.ttsCommand = new TTSCommand();
    this.messageCommand = new MessageCommand();
    this.announceCommand = new AnnounceCommand();
    this.pinCommand = new PinCommand();
    this.clearCommand = new ClearCommand();
    this.slowmodeCommand = new SlowmodeCommand();

    const groupManagementService = new GroupManagementService(client);
    this.createGroupCommand = new CreateGroupCommand(groupManagementService);
    this.deleteGroupCommand = new DeleteGroupCommand(groupManagementService);
    this.listGroupsCommand = new ListGroupsCommand();
    this.moveCommand = new MoveCommand(groupManagementService);
  }

  async handle(interaction: Interaction): Promise<void> {
    try {
      if (interaction.isAutocomplete()) {
        switch (interaction.commandName) {
          case "pin":
            await this.pinCommand.handleAutocomplete(interaction);
            break;
          case "move":
            await this.moveCommand.handleAutocomplete(interaction);
            break;
        }
        return;
      }

      if (interaction.isModalSubmit()) {
        switch (interaction.customId) {
          case "broadcastModal":
            await DiscordLogger.log(
              `User ${interaction.user.tag} submitted broadcast modal`
            );
            await this.broadcastCommand.handleModalSubmit(interaction);
            break;
          case "announceModal":
            await DiscordLogger.log(
              `User ${interaction.user.tag} submitted announce modal`
            );
            await this.announceCommand.handleModalSubmit(interaction);
            break;
        }
        return;
      }

      if (interaction.isChatInputCommand()) {
        await DiscordLogger.log(
          `User ${interaction.user.tag} used /${interaction.commandName} command`
        );

        switch (interaction.commandName) {
          case "broadcast":
            await this.broadcastCommand.execute(interaction);
            break;
          case "group-name":
            await this.groupNameCommand.execute(interaction);
            break;
          case "roles":
            await this.rolesCommand.execute(interaction);
            break;
          case "channels":
            await this.channelsCommand.execute(interaction);
            break;
          case "serverinfo":
            await this.serverInfoCommand.execute(interaction);
            break;
          case "poll":
            await this.pollCommand.execute(interaction);
            break;
          case "remind":
            await this.remindCommand.execute(interaction);
            break;
          case "userinfo":
            await this.userInfoCommand.execute(interaction);
            break;
          case "cleanup":
            await this.cleanupCommand.execute(interaction);
            break;
          case "tts":
            await this.ttsCommand.execute(interaction);
            break;
          case "message":
            await this.messageCommand.execute(interaction);
            break;
          case "announce":
            await this.announceCommand.execute(interaction);
            break;
          case "pin":
            await this.pinCommand.execute(interaction);
            break;
          case "clear":
            await this.clearCommand.execute(interaction);
            break;
          case "slowmode":
            await this.slowmodeCommand.execute(interaction);
            break;
          case "create-group":
            await this.createGroupCommand.execute(interaction);
            break;
          case "delete-group":
            await this.deleteGroupCommand.execute(interaction);
            break;
          case "list-groups":
            await this.listGroupsCommand.execute(interaction);
            break;
          case "move":
            await this.moveCommand.execute(interaction);
            break;
        }
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";

      await DiscordLogger.log(
        `Error handling interaction from ${interaction.user.tag}: ${errorMessage}`,
        "error"
      );

      if (interaction.isChatInputCommand() || interaction.isModalSubmit()) {
        try {
          if (interaction.replied || interaction.deferred) {
            await interaction.editReply({ content: `❌ ${errorMessage}` });
          } else {
            await interaction.reply({
              content: `❌ ${errorMessage}`,
              ephemeral: true,
            });
          }
        } catch (replyError) {
          logger.error(
            { replyError },
            "Failed to send error response to interaction"
          );
        }
      } else {
        logger.error("Interaction type does not support replying");
      }
    }
  }
}
