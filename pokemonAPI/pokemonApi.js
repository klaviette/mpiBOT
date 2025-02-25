const axios = require('axios');

// base url
const BASE_URL = 'https://api.pokemontcg.io/v2/cards';

// encironment variables
const API_KEY = import.meta.env.REACT_APP_API_KEY; 

export const getPokemonCardById = async (id) => {
    try {
        const response = await axios.get(`${BASE_URL}/${id}`, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`, 
            }
        });
        return response.data; 
    } catch (error) {
        console.error('Error fetching the card:', error.message);
        throw error; 
    }
};
