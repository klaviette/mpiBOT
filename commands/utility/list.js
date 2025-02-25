const { SlashCommandBuilder } = require('discord.js');
const { fetchCards } = require('../../pokemonAPI/indexcalculator2.js');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { start } = require('repl');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('cards')
		.setDescription('Replies with card prices'),
	async execute(interaction) {
		await interaction.deferReply();
		let score = await fetchCards();

        let length = score.length;

		// find the cards used in the score and pair with prices
		const formattedCards = score.map(card => `**Card:** ${card.name}\n**Market Price:** $${card?.tcgplayer?.prices?.holofoil?.market}`);

		// items per page
		const itemsPerPage = 20;

		// get total pages
		const totalPages = Math.ceil(formattedCards.length / itemsPerPage);

		// get the items for each page
		function getPage(page) {
			const startIndex = (page - 1) * itemsPerPage;
			let endIndex = page * itemsPerPage;
            if(endIndex > length){
                endIndex = startIndex - startIndex + endIndex;
            }
			return formattedCards.slice(startIndex, endIndex).join('\n\n');
		}

		// define the start
		let currentPage = 1;

		// embed creation
		const embed = {
			color: 0x0099ff,
			title: 'Pokémon Cards',
			description: getPage(currentPage), // description
		};

		// Create action buttons
		const row = new ActionRowBuilder().addComponents(
			new ButtonBuilder()
				.setCustomId('prev')
				.setLabel('Previous')
				.setStyle(ButtonStyle.Primary)
                .setDisabled(currentPage === totalPages),// fix this cus it aint working supposed to disable buttons
			new ButtonBuilder()
				.setCustomId('next')
				.setLabel('Next')
				.setStyle(ButtonStyle.Primary)
				.setDisabled(currentPage === totalPages) // fix this cus it aint working this too
		);

		// send message
		await interaction.editReply({ embeds: [embed], components: [row] });

		// handle button press
		const filter = i => i.user.id === interaction.user.id;
		const collector = interaction.channel.createMessageComponentCollector({ filter, time: 600000 });

		collector.on('collect', async i => {
			if (i.customId === 'next') {
				if (currentPage < totalPages) {
					currentPage++;
				}
			} else if (i.customId === 'prev') {
				if (currentPage > 1) {
					currentPage--;
				}
			}

			// update page with relevant content
			await i.update({ embeds: [{ ...embed, description: getPage(currentPage) }], components: [row] });
		});

		collector.on('end', async () => {
			// disable buttons after 60 sec
			await interaction.editReply({ components: [] });
		});
	},
};
