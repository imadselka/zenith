# Zenith Bot

## Overview

The Zenith Bot is a versatile tool designed to enhance community engagement and moderation on Discord servers. It provides a range of commands, from basic information retrieval to advanced group management and message broadcasting.

## Features

- **Broadcasts:** Allows moderators to send messages to multiple groups simultaneously ([`BroadcastCommand`](src/commands/broadcast.command.ts)).
- **Group Management:** Facilitates the creation, deletion, and management of user groups ([`CreateGroupCommand`](src/commands/create-group.command.ts), [`DeleteGroupCommand`](src/commands/delete-group.command.ts), [`MoveCommand`](src/commands/move.command.ts)).
- **Channel & Role Information:** Displays lists of channels and roles available on the server ([`ChannelsCommand`](src/commands/channels.command.ts), [`RolesCommand`](src/commands/roles.command.ts)).
- **Server Information:** Provides detailed information about the Discord server ([`ServerInfoCommand`](src/commands/serverinfo.command.ts)).
- **User Information:** Retrieves information about a specific user ([`UserInfoCommand`](src/commands/userinfo.command.ts)).
- **Message Control:** Includes tools for message cleanup, sending messages as the bot, and managing slow mode ([`CleanupCommand`](src/commands/cleanup.command.ts), [`MessageCommand`](src/commands/message.command.ts), [`SlowmodeCommand`](src/commands/slowmode.commands.ts)).
- **Text-to-Speech:** Sends Text-to-Speech messages in the channel ([`TTSCommand`](src/commands/tts.command.ts)).
- **Announcements:** Sends announcements to all configured groups ([`AnnounceCommand`](src/commands/announce.command.ts)).
- **Message Pinning:** Allows pinning of recent messages ([`PinCommand`](src/commands/pin.command.ts)).
- **Message Clearing:** Deletes a specified number of messages from a channel ([`ClearCommand`](src/commands/clear.commands.ts)).
- **Polling:** Creates polls with up to 10 options ([`PollCommand`](src/commands/poll.command.ts)).
- **Reminders:** Sets reminders for users via direct message ([`RemindCommand`](src/commands/remind.command.ts)).
- **List Groups:** Lists all available groups with their channels and roles ([`ListGroupsCommand`](src/commands/list-groups.command.ts)).
- **Group Messaging:** Sends a message to a specific group ([`GroupNameCommand`](src/commands/group-name.command.ts)).

## Installation

1.  **Clone the repository:**

    ```sh
    git clone <repository-url>
    cd discord-bot
    ```

2.  **Install dependencies:**

    ```sh
    npm install
    ```

3.  **Set up environment variables:**

    - Create a [.env](http://_vscodecontentref_/0) file based on the [.env.example](http://_vscodecontentref_/1) file.
    - Fill in the DISCORD_TOKEN, CLIENT_ID, and GUILD_ID with your bot's credentials.

    ```
    DISCORD_TOKEN=<your-discord-bot-token>
    CLIENT_ID=<your-discord-client-id>
    GUILD_ID=<your-discord-guild-id>
    ```

## Configuration

The bot's behavior is configured via environment variables and the [config.ts](http://_vscodecontentref_/2) file. Key configurations include:

- **Discord Token ([DISCORD_TOKEN](http://_vscodecontentref_/3)):** The token used to authenticate the bot with Discord.
- **Client ID ([CLIENT_ID](http://_vscodecontentref_/4)):** The application ID of the Zenith Bot.
- **Guild ID ([GUILD_ID](http://_vscodecontentref_/5)):** The ID of the Discord server where the bot will operate.
- **Groups:** Defined in [config.ts](http://_vscodecontentref_/6), these are the groups that the bot will manage. Each group is associated with a channel and a role.
- **Moderator Role:** Also configured in [config.ts](http://_vscodecontentref_/7), this role is required to use certain administrative commands.

## Usage

1.  **Build the project:**

    ```sh
    npm run build
    ```

2.  **Deploy commands:**

    ```sh
    npm run deploy
    ```

3.  **Start the bot:**

    ```sh
    npm run start
    ```

    Alternatively, for development with hot-reloads:

    ```sh
    npm run dev
    ```

## Commands

The bot includes a variety of slash commands, which can be accessed in Discord by typing `/`. Here are some of the key commands:

- `/announce`: Sends an announcement to all groups.
- `/broadcast`: Broadcasts a message to specified channels.
- `/channels`: Lists all channels in the server.
- `/cleanup`: Deletes recent Zenith Bot messages.
- `/clear`: Deletes a specified number of messages.
- `/create-group`: Creates a new group.
- `/delete-group`: Deletes an existing group.
- `/group-name`: Sends a message to a specific group.
- `/list-groups`: Lists all available groups.
- `/message`: Sends a message to a specified channel as the bot.
- `/move`: Moves a user from one group to another.
- `/pin`: Pins a message from the recent messages.
- `/poll`: Creates a poll with multiple options.
- `/remind`: Sets a reminder for the user.
- `/roles`: Lists all roles in the server.
- `/serverinfo`: Displays information about the server.
- `/slowmode`: Sets the slow mode for the current channel.
- `/tts`: Sends a text-to-speech message.
- `/userinfo`: Retrieves information about a user.

## Contributing

Contributions to the Zenith Bot are welcome! Please fork the repository, create a feature branch, and submit a pull request.

## License

See [LICENSE](LICENSE) for more information.
