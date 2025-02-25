const axios = require('axios');
const { pokemonAPI } = require('../config.json');

const BASE_URL = 'https://api.pokemontcg.io/v2/cards?q=(set.id:sv* OR set.id:swsh* OR set.id:sm* OR set.id:xy* OR set.id:bw*) AND (tcgplayer.prices.holofoil.market:[10 TO *])';

// this function is used to just calculate the score

const fetchCards = async () => {
  try {
    let pokemonIndex = 0;
    let allCards = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const response = await axios.get(BASE_URL, {
        params: {
          page, 
          pageSize: 250, 
          orderBy: 'tcgplayer.prices.holofoil.market',
        },
        headers: {
          'Authorization': `Bearer ${pokemonAPI}`,
        },
      });

      const cards = response.data.data;
      allCards = [...allCards, ...cards];

      if (cards.length < 250) {
        hasMore = false; 
      } else {
        page++; 
      }
    }

    let count = 0;

    let size = allCards.length;
    let index1 = size*0.6;
    let index2 = size*0.95;

    let range = index2 - index1;

    allCards.forEach(card => {
        const highestPrice = card?.tcgplayer?.prices?.holofoil?.market || 0;
    

        if (highestPrice > 0) {
            console.log(`Card: ${card.name} - Highest Price: $${highestPrice.toFixed(2)}`);
            if (count >= index1 && count <= index2){
                pokemonIndex += highestPrice;
                console.log(card.name);
            }
        } else {
            console.log(`Card: ${card.name} - Price not available`);
        }
        count++;
    });

    let indexVal = pokemonIndex / range;

    console.log(indexVal.toFixed(4));

    return indexVal.toFixed(4); 
  } catch (error) {
    console.error('Error fetching cards:', error);
    throw error; 
  }
};




module.exports = { fetchCards };