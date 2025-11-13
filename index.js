// index.js
const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Events, REST, Routes } = require('discord.js');
const TOKEN = "MTQzNTc2MDc1NTA4NDYyMzk1Mg.GtHy4m.IWYzPVhXE1ME8lOgMLDFzI5iH0J8k00_ED47fM";
const CLIENT_ID = "1435760755084623952"; // îl găsești în Discord Developer Portal
const GUILD_ID = "PUNE_AICI_GUILD_ID";   // id-ul serverului tău (pentru comenzi locale)

// Funcție pentru număr random
function randomNumber() {
  return (Math.random() * 999999).toFixed(3);
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

// -------- Slash Command Setup --------
const commands = [
  {
    name: 'numar',
    description: 'Afișează un număr random cu butoane.'
  }
];

const rest = new REST({ version: '10' }).setToken(TOKEN);
(async () => {
  try {
    console.log('🔁 Se înregistrează comanda /numar...');
    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands });
    console.log('✅ Comandă /numar înregistrată!');
  } catch (error) {
    console.error(error);
  }
})();

// -------- Bot Logic --------
client.once(Events.ClientReady, () => {
  console.log(`✅ Bot conectat ca ${client.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand() && !interaction.isButton()) return;

  // --- Slash command /numar ---
  if (interaction.commandName === 'numar') {
    const number = randomNumber();
    const embed = new EmbedBuilder()
      .setTitle('🎲 Număr Random')
      .setDescription(`\`\`\`${number}\`\`\``)
      .setColor('Blue')
      .setFooter({ text: 'Apasă Reset pentru un nou număr sau Copy pentru a-l copia.' });

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

  // --- Buton Reset ---
  if (interaction.isButton() && interaction.customId === 'reset') {
    const number = randomNumber();
    const newEmbed = new EmbedBuilder()
      .setTitle('🎲 Număr Random')
      .setDescription(`\`\`\`${number}\`\`\``)
      .setColor('Blue')
      .setFooter({ text: 'Apasă Reset pentru un nou număr sau Copy pentru a-l copia.' });

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

  // --- Buton Copy ---
  if (interaction.isButton() && interaction.customId === 'copy') {
    const numberText = interaction.message.embeds[0].data.description.replace(/[`]/g, '');
    await interaction.reply({ content: `🔢 Numărul este:\n\`\`\`${numberText}\`\`\``, ephemeral: true });
  }
});

client.login(TOKEN);
