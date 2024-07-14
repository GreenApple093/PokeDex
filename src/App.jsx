import { useEffect, useState } from 'react';
import Search from './components/Search/Search';
import PokemonGrid from './components/PokemonGrid/PokemonGrid';
import PokemonDetails from './components/PokemonDetails/PokemonDetails';

function App() {
  const [pokemonList, setPokemonList] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSpeciesLoading, setIsSpeciesLoading] = useState(false);

  useEffect(() => {
    const fetchAllPokemons = async () => {
      setIsLoading(true);
      const allPokemons = [];
      const limit = 60; // Number of Pokémon to fetch per request
      let offset = 0;

      while (offset < 870) {
        const url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();

        // Fetch details for each Pokémon to get their types
        const detailedPokemons = await Promise.all(
          data.results.map(async (pokemon) => {
            const response = await fetch(pokemon.url);
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            const pokemonData = await response.json();

            return {
              ...pokemon,
              id: pokemonData.id,
              types: pokemonData.types.map(typeInfo => typeInfo.type.name),
              stats: pokemonData.stats.map(statInfo => ({
                base_stat: statInfo.base_stat,
                stat: statInfo.stat.name
              })),
              height: pokemonData.height / 10,
              weight: pokemonData.weight / 10,
              abilities: pokemonData.abilities.map(abilityInfo => abilityInfo.ability.name),
              description: "No description available." // Placeholder for description
            };
          })
        );

        allPokemons.push(...detailedPokemons);

        offset += limit;
      }

      setPokemonList(allPokemons);
      setIsLoading(false);
    };

    fetchAllPokemons();
  }, []);

  // Effect to fetch species data when a Pokémon is selected
  useEffect(() => {
    const fetchSpeciesData = async (pokemonId) => {
      if (!pokemonId) return;

      setIsSpeciesLoading(true);

      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`);
        const speciesData = await response.json();

        const description = speciesData.flavor_text_entries.find(entry => entry.language.name === 'en')?.flavor_text || "No description available.";

        setSelectedPokemon((prev) => ({
          ...prev,
          description,
        }));
      } catch (error) {
        console.error('Error fetching species data:', error);
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
        <div className='w-1/3 h-full '>
          <PokemonDetails 
          className='h-full'
          selectedPokemon={selectedPokemon} isLoading={isSpeciesLoading} />
        </div>
      </div>
    </div>
  );
}

const Loader = () => (
  <div className="flex justify-center items-center h-screen w-screen bg-ivory">
    <img className="w-12 h-12 animate-spin" src="src/5.png" alt="Loading" />
  </div>
);

export default App;
