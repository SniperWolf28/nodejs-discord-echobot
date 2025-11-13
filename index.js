// index.js
const { 
  Client, 
  GatewayIntentBits, 
  EmbedBuilder, 
  ActionRowBuilder, 
  ButtonBuilder, 
  ButtonStyle, 
  Events, 
  REST, 
  Routes 
} = require('discord.js');

const TOKEN = "YOUR_BOT_TOKEN_HERE";
const CLIENT_ID = "YOUR_CLIENT_ID_HERE";
const GUILD_ID = "YOUR_GUILD_ID_HERE";

// random number generator
function randomNumber() {
  return (Math.random() * 999999).toFixed(3);
}

// default number
let defaultNumber = "544.098";

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

// Slash command setup
const commands = [
  {
    name: 'statie',
    description: 'Show current station number with buttons.'
  }
];

const rest = new REST({ version: '10' }).setToken(TOKEN);
(async () => {
  try {
    console.log('🔁 Registering /statie command...');
    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: commands }
    );
    console.log('✅ Command registered!');
  } catch (error) {
    console.error(error);
  }
})();

// Bot ready
client.once(Events.ClientReady, () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

// Handle interactions
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand() && !interaction.isButton()) return;

  // Slash command
  if (interaction.commandName === 'statie') {
    const embed = new EmbedBuilder()
      .setTitle('🎧 Current Station')
      .setDescription(`\`\`\`${defaultNumber}\`\`\``)
      .setColor('DarkButNotBlack'); // black-like background

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('change')
        .setLabel('🎚️ Schimbă Stația')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId('reset')
        .setLabel('🔄 Reset')
        .setStyle(ButtonStyle.Danger)
    );

    await interaction.reply({ embeds: [embed], components: [row] });
  }

  // Button: Schimbă Stația
  if (interaction.isButton() && interaction.customId === 'change') {
    const newNumber = randomNumber();
    const newEmbed = new EmbedBuilder()
      .setTitle('🎧 Current Station')
      .setDescription(`\`\`\`${newNumber}\`\`\``)
      .setColor('DarkButNotBlack');

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('change')
        .setLabel('🎚️ Schimbă Stația')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId('reset')
        .setLabel('🔄 Reset')
        .setStyle(ButtonStyle.Danger)
    );

    await interaction.update({ embeds: [newEmbed], components: [row] });
  }

  // Button: Reset
  if (interaction.isButton() && interaction.customId === 'reset') {
    const embed = new EmbedBuilder()
      .setTitle('🎧 Current Station')
      .setDescription(`\`\`\`${defaultNumber}\`\`\``)
      .setColor('DarkButNotBlack');

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('change')
        .setLabel('🎚️ Schimbă Stația')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId('reset')
        .setLabel('🔄 Reset')
        .setStyle(ButtonStyle.Danger)
    );

    await interaction.update({ embeds: [embed], components: [row] });
  }
});

client.login(TOKEN);
