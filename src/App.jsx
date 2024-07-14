import { useEffect, useState } from 'react';
import Search from './components/Search/Search';
import PokemonGrid from './components/PokemonGrid/PokemonGrid';
import PokemonDetails from './components/PokemonDetails/PokemonDetails';
import loaderImg from './assets/5.png'
import { Analytics } from '@vercel/analytics';

function App() {
  const [pokemonList, setPokemonList] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSpeciesLoading, setIsSpeciesLoading] = useState(false);

  useEffect(() => {
    const fetchAllPokemons = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=60`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();

        const detailedPokemons = await Promise.all(
          data.results.map(async (pokemon) => {
            const pokemonResponse = await fetch(pokemon.url);
            if (!pokemonResponse.ok) throw new Error('Network response was not ok');
            const pokemonData = await pokemonResponse.json();
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
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const speciesData = await response.json();
        const description = speciesData.flavor_text_entries.find(entry => entry.language.name === 'en')?.flavor_text || "No description available.";
        setSelectedPokemon(prev => ({ ...prev, description }));
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
        <div className='w-1/3 h-full'>
          <PokemonDetails className='h-full' selectedPokemon={selectedPokemon} isLoading={isSpeciesLoading} />
        </div>
      </div>
      <Analytics />
    </div>
  );
}

const Loader = () => (
  <div className="flex justify-center items-center h-screen w-screen bg-ivory">
    <img className="w-12 h-12 animate-spin" src={loaderImg} alt="Loading" />
  </div>
);

export default App;
