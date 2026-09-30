import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ActivityType,
} from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("setstatus")
    .setDescription("Change the bot's Discord status")
    .addStringOption((option) =>
      option
        .setName("text")
        .setDescription("What the bot should display")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("type")
        .setDescription("Activity type")
        .setRequired(false)
        .addChoices(
          { name: "Playing", value: "playing" },
          { name: "Listening", value: "listening" },
          { name: "Watching", value: "watching" },
          { name: "Competing", value: "competing" }
        )
    )
    .addStringOption((option) =>
      option
        .setName("status")
        .setDescription("Bot status")
        .setRequired(false)
        .addChoices(
          { name: "Online", value: "online" },
          { name: "Idle", value: "idle" },
          { name: "Do Not Disturb", value: "dnd" },
          { name: "Invisible", value: "invisible" }
        )
    ),

  async execute(interaction) {
    const ownerIds =
      process.env.OWNER_IDS
        ?.split(",")
        .map((id) => id.trim())
        .filter(Boolean) || [];

    if (!ownerIds.includes(interaction.user.id)) {
      return interaction.reply({
        content: "❌ Only the bot owner can use this command.",
        ephemeral: true,
      });
    }

    const text = interaction.options.getString("text");
    const type = interaction.options.getString("type") || "listening";
    const status = interaction.options.getString("status") || "dnd";

    const activityTypes = {
      playing: ActivityType.Playing,
      listening: ActivityType.Listening,
      watching: ActivityType.Watching,
      competing: ActivityType.Competing,
    };

    interaction.client.user.setPresence({
      status,
      activities: [
        {
          name: text,
          type: activityTypes[type],
        },
      ],
    });

    return interaction.reply({
      content: `✅ Status changed to **${status}** — ${type} **${text}**`,
      ephemeral: true,
    });
  },
};
