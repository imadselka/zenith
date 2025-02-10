<div align="center">

# 🌟 Zenith Bot

A powerful Discord bot for seamless community management and engagement

[![Discord](https://img.shields.io/badge/Discord-7289DA?style=for-the-badge&logo=discord&logoColor=white)](https://discord.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

</div>

## ✨ Features

### 🎯 Core Functionality

- **Advanced Group Management** - Create, delete, and manage user groups with ease
- **Smart Broadcasting** - Send targeted messages to multiple groups simultaneously
- **Comprehensive Server Tools** - Access detailed channel, role, and server information
- **Engagement Tools** - Create polls, set reminders, and manage announcements

### 🛠️ Moderation Tools

- **Message Control** - Clean up channels, manage slow mode, and pin important messages
- **User Management** - Move users between groups and access detailed user information
- **Channel Management** - Send messages as the bot and manage channel settings

### 🎙️ Interactive Features

- **Text-to-Speech** - Convert text messages to speech for accessibility
- **Polling System** - Create interactive polls with up to 10 options
- **Reminder System** - Set personal reminders via direct messages

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- A Discord Bot Token

### Installation & Setup

1. **Clone & Install**

```bash
# Clone the repository
git clone <repository-url>
cd discord-bot

# Install dependencies
npm install
```

2. **Configure Environment**

```bash
# Create .env file from example
cp .env.example .env

# Add your bot token
DISCORD_TOKEN=<your_bot_token_here>
CLIENT_ID=<your-discord-client-id>

```

3. **Start Development Server**

```bash
# Run the development server
npm run dev
```

4. **Get Server Information**

- When you start the bot with `npm run dev`, it will automatically log:
  - Your Guild (Server) ID
  - All Channel IDs and their names
  - Bot Logs Channel ID
  - All available roles

5. **Launch Production**

```bash
# Build the project
npm run build

# Deploy commands
npm run deploy

# Start the bot
npm run start
```

## 💫 Commands

### 📢 Communication

| Command      | Description                        |
| ------------ | ---------------------------------- |
| `/announce`  | Send announcements to all groups   |
| `/broadcast` | Send messages to specific channels |
| `/message`   | Send messages as the bot           |
| `/tts`       | Send text-to-speech messages       |

### 👥 Group Management

| Command         | Description               |
| --------------- | ------------------------- |
| `/create-group` | Create a new group        |
| `/delete-group` | Remove an existing group  |
| `/move`         | Move users between groups |
| `/list-groups`  | View all available groups |

### 🔧 Utility

| Command    | Description              |
| ---------- | ------------------------ |
| `/cleanup` | Remove bot messages      |
| `/clear`   | Delete multiple messages |
| `/pin`     | Pin important messages   |
| `/poll`    | Create interactive polls |
| `/remind`  | Set personal reminders   |

### ℹ️ Information

| Command       | Description            |
| ------------- | ---------------------- |
| `/channels`   | List server channels   |
| `/roles`      | View server roles      |
| `/serverinfo` | Display server details |
| `/userinfo`   | Show user information  |

## ⚙️ Configuration

### Core Settings

Configure the bot's behavior through environment variables and `config.ts`:

```typescript
// config.ts example
export default {
  moderatorRole: "Moderator",
  groups: [
    {
      name: "General",
      channelId: "123456789",
      roleId: "987654321",
    },
    // Add more groups as needed
  ],
};
```

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the terms of the [LICENSE](LICENSE) file.

---

<div align="center">

Made with ❤️ by the Zenith Bot Team

[Report Bug](https://github.com/imadselka/zenith/issues) · [Request Feature](https://github.com/imadselka/zenith-/issues)

</div>
