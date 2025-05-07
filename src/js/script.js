// Elementos do DOM
const pokedexContainer = document.getElementById('pokedex');
const searchInput = document.getElementById('search');
const pokemonDetail = document.getElementById('pokemon-detail');
const closeDetailBtn = document.getElementById('close-detail');

// Variáveis globais
let allPokemons = [];

// Função para buscar todos os Pokémon
async function fetchAllPokemons() {
    try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
        const data = await response.json();
        allPokemons = data.results;
        displayPokemons(allPokemons);
    } catch (error) {
        console.error('Erro ao buscar Pokémon:', error);
    }
}

// Função para buscar detalhes de um Pokémon específico
async function fetchPokemonDetails(url) {
    try {
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.error('Erro ao buscar detalhes do Pokémon:', error);
    }
}

// Função para exibir os Pokémon na Pokédex
async function displayPokemons(pokemons) {
    pokedexContainer.innerHTML = '';
    
    for (const pokemon of pokemons) {
        const details = await fetchPokemonDetails(pokemon.url);
        const pokemonId = details.id;
        
        const pokemonCard = document.createElement('div');
        pokemonCard.className = 'pokemon-card';
        pokemonCard.innerHTML = `
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${pokemonId}.gif" alt="${pokemon.name}" 
                class="pokemon-img"
                onerror="this.src='${details.sprites.front_default}'">
            <h3>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h3>
            <p>#${details.id.toString().padStart(3, '0')}</p>
        `;
        
        pokemonCard.addEventListener('click', () => showPokemonDetail(details));
        pokedexContainer.appendChild(pokemonCard);
    }
}

// Função para exibir os detalhes de um Pokémon
function showPokemonDetail(pokemon) {
    const pokemonId = pokemon.id;
    
    document.getElementById('detail-name').textContent = 
        pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1) + 
        ` #${pokemon.id.toString().padStart(3, '0')}`;
    
    // Usando GIF animado ou fallback para imagem estática
    document.getElementById('detail-img').src = 
        `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${pokemonId}.gif`;
    document.getElementById('detail-img').onerror = function() {
        this.src = pokemon.sprites.front_default;
    };
    
    document.getElementById('detail-types').textContent = 
        'Tipo: ' + pokemon.types.map(type => type.type.name).join(', ');
    
    document.getElementById('detail-height').textContent = 
        `Altura: ${pokemon.height / 10}m`;
    
    document.getElementById('detail-weight').textContent = 
        `Peso: ${pokemon.weight / 10}kg`;
    
    const abilitiesList = document.getElementById('detail-abilities');
    abilitiesList.innerHTML = '';
    pokemon.abilities.forEach(ability => {
        const li = document.createElement('li');
        li.textContent = ability.ability.name;
        abilitiesList.appendChild(li);
    });
    
    pokemonDetail.style.display = 'block';
}

// Fechar detalhes
closeDetailBtn.addEventListener('click', () => {
    pokemonDetail.style.display = 'none';
});

// Busca de Pokémon
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredPokemons = allPokemons.filter(pokemon => 
        pokemon.name.includes(searchTerm)
    );
    displayPokemons(filteredPokemons);
});

// Inicializar a Pokédex
fetchAllPokemons();


document.addEventListener('DOMContentLoaded', () => {
    // Fechar detalhes ao clicar fora do modal
    document.addEventListener('click', (e) => {
        if (e.target === pokemonDetail) {
            pokemonDetail.style.display = 'none';
        }
    });
    
    // Melhorar a experiência de busca
    searchInput.addEventListener('focus', () => {
        searchInput.placeholder = 'Digite o nome do Pokémon...';
    });
    
    searchInput.addEventListener('blur', () => {
        searchInput.placeholder = 'Buscar Pokémon...';
    });
});