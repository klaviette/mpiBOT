const { SlashCommandBuilder } = require('discord.js');
const { fetchCards } = require('../../pokemonAPI/indexcalculator.js');

// ik this ones called ping.js but its actually the mpi command trust

module.exports = {
	data: new SlashCommandBuilder()
		.setName('mpi')
		.setDescription('replies with index'),
	async execute(interaction) {
		/// script to make the bot have a loading symbol while waiting on fetchCards function
		await interaction.deferReply();
		let score = await fetchCards();
		await interaction.editReply("**Today's market scores: **" + score);
	},
};