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
const CLIENT_ID = "YOUR_CLIENT_ID_HERE"; // from Discord Developer Portal
const GUILD_ID = "YOUR_GUILD_ID_HERE";   // your server ID for local command registration

// Function to generate a random number
function randomNumber() {
  return (Math.random() * 999999).toFixed(3);
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

// -------- Register Slash Command --------
const commands = [
  {
    name: 'number',
    description: 'Display a random number with buttons.'
  }
];

const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
  try {
    console.log('🔁 Registering slash command /number...');
    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: commands }
    );
    console.log('✅ Slash command /number registered!');
  } catch (error) {
    console.error(error);
  }
})();

// -------- Bot Logic --------
client.once(Events.ClientReady, () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand() && !interaction.isButton()) return;

  // --- Slash command /number ---
  if (interaction.commandName === 'number') {
    const number = randomNumber();
    const embed = new EmbedBuilder()
      .setTitle('🎲 Random Number')
      .setDescription(`\`\`\`${number}\`\`\``)
      .setColor('Blue')
      .setFooter({ text: 'Click Reset for a new number or Copy to copy it privately.' });

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('reset')
        .setLabel('🔄 Reset')
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId('copy')
        .setLabel('📋 Copy')
        .setStyle(ButtonStyle.Secondary)
    );

    await interaction.reply({ embeds: [embed], components: [row] });
  }

  // --- Button Reset ---
  if (interaction.isButton() && interaction.customId === 'reset') {
    const number = randomNumber();
    const newEmbed = new EmbedBuilder()
      .setTitle('🎲 Random Number')
      .setDescription(`\`\`\`${number}\`\`\``)
      .setColor('Blue')
      .setFooter({ text: 'Click Reset for a new number or Copy to copy it privately.' });

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('reset')
        .setLabel('🔄 Reset')
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId('copy')
        .setLabel('📋 Copy')
        .setStyle(ButtonStyle.Secondary)
    );

    await interaction.update({ embeds: [newEmbed], components: [row] });
  }

  // --- Button Copy ---
  if (interaction.isButton() && interaction.customId === 'copy') {
    const numberText = interaction.message.embeds[0].data.description.replace(/[`]/g, '');
    await interaction.reply({
      content: `🔢 The number is:\n\`\`\`${numberText}\`\`\``,
      ephemeral: true
    });
  }
});

client.login(TOKEN);
