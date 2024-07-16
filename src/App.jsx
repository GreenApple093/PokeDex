import { useEffect, useState } from 'react';
import Search from './components/Search/Search';
import PokemonGrid from './components/PokemonGrid/PokemonGrid';
import PokemonDetails from './components/PokemonDetails/PokemonDetails';
import loaderImg from './assets/5.png';

function App() {
  const [pokemonList, setPokemonList] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSpeciesLoading, setIsSpeciesLoading] = useState(false);

  const MAX_POKEMON_COUNT = 898;  // Limit to 898 Pokémon

  const fetchWithRetry = async (url, options = {}, retries = 3, backoff = 300) => {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const text = await response.text();
      try {
        return JSON.parse(text);
      } catch (err) {
        throw new Error('Invalid JSON response');
      }
    } catch (error) {
      if (retries > 0) {
        console.warn(`Retrying ${url}: ${error.message}`);
        await new Promise((resolve) => setTimeout(resolve, backoff));
        return fetchWithRetry(url, options, retries - 1, backoff * 2);
      } else {
        throw new Error(`Failed to fetch ${url} after multiple attempts: ${error.message}`);
      }
    }
  };

  useEffect(() => {
    const fetchAllPokemons = async () => {
      setIsLoading(true);
      const allPokemons = [];

      const fetchPokemons = async (url) => {
        try {
          console.log(`Fetching: ${url}`);
          const data = await fetchWithRetry(url);
          allPokemons.push(...data.results);

          if (data.next && allPokemons.length < MAX_POKEMON_COUNT) {
            await fetchPokemons(data.next);
          }
        } catch (error) {
          console.error(`Error during fetchPokemons: ${error.message}`);
          throw error;
        }
      };

      try {
        await fetchPokemons('https://pokeapi.co/api/v2/pokemon?limit=100');
        
        // Limit the results to the first 898 Pokémon
        const limitedPokemons = allPokemons.slice(0, MAX_POKEMON_COUNT);
        
        const detailedPokemons = await Promise.all(
          limitedPokemons.map(async (pokemon) => {
            try {
              console.log(`Fetching details for: ${pokemon.name}`);
              const pokemonData = await fetchWithRetry(pokemon.url);
              return {
                ...pokemon,
                id: pokemonData.id,
                types: pokemonData.types.map(typeInfo => typeInfo.type.name),
                stats: pokemonData.stats.map(statInfo => ({
                  base_stat: statInfo.base_stat,
                  stat: statInfo.stat.name,
                })),
                height: pokemonData.height / 10,
                weight: pokemonData.weight / 10,
                abilities: pokemonData.abilities.map(abilityInfo => abilityInfo.ability.name),
                description: "No description available",
              };
            } catch (error) {
              console.error(`Error fetching details for ${pokemon.name}: ${error.message}`);
              throw error;
            }
          })
        );

        setPokemonList(detailedPokemons);
      } catch (error) {
        console.error('Error fetching Pokémon data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllPokemons();
  }, []);

  useEffect(() => {
    const fetchSpeciesData = async (pokemonId) => {
      if (!pokemonId) return;
      setIsSpeciesLoading(true);
      try {
        console.log(`Fetching species data for ID: ${pokemonId}`);
        const speciesData = await fetchWithRetry(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`);
        const description = speciesData.flavor_text_entries.find(entry => entry.language.name === 'en')?.flavor_text || "No description available.";
        setSelectedPokemon(prev => ({ ...prev, description }));
      } catch (error) {
        console.error(`Error fetching species data for ID ${pokemonId}: ${error.message}`);
      } finally {
        setIsSpeciesLoading(false);
      }
    };

    if (selectedPokemon) {
      fetchSpeciesData(selectedPokemon.id);
    }
  }, [selectedPokemon]);

  const filteredPokemon = pokemonList.filter(pokemon =>
    pokemon.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className='text-center bg-slate-900 h-screen w-screen'>
        <Loader />
      </div>
    );
  }

  return (
    <div className='bg-cover bg-center min-h-screen h-full bg-slate-100 scroll-smooth p-0 m-0'>
      <Search onSearchChange={setSearchQuery} />
      <div className='container mx-auto p-4 flex h-[90vh]'>
        <div className='w-2/3 h-full overflow-y-scroll pr-4 custom-scrollbar'>
          <PokemonGrid
            pokemonList={filteredPokemon}
            onPokemonSelect={setSelectedPokemon}
          />
        </div>
        <div className='w-1/3 h-full'>
          <PokemonDetails className='h-full' selectedPokemon={selectedPokemon} isLoading={isSpeciesLoading} />
        </div>
      </div>
    </div>
  );
}

const Loader = () => (
  <div className="flex justify-center items-center h-screen w-screen bg-ivory">
    <img className="w-12 h-12 animate-spin" src={loaderImg} alt="Loading" />
  </div>
);

export default App;
