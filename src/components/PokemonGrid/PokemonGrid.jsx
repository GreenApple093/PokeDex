import React from 'react';

const typeColors = {
    normal: 'bg-gray-400',
    fire: 'bg-orange-500',
    water: 'bg-blue-400',
    electric: 'bg-yellow-400',
    grass: 'bg-green-500',
    ice: 'bg-teal-300',
    fighting: 'bg-red-700',
    poison: 'bg-purple-600',
    ground: 'bg-red-950',
    flying: 'bg-indigo-300',
    psychic: 'bg-pink-500',
    bug: 'bg-lime-500',
    rock: 'bg-yellow-800',
    ghost: 'bg-purple-800',
    dragon: 'bg-indigo-700',
    dark: 'bg-gray-800',
    steel: 'bg-gray-500',
    fairy: 'bg-pink-300',
    // Add a default color for types that don't match
    default: 'bg-gray-200'
};

const PokemonGrid = ({ pokemonList, onPokemonSelect }) => {
    return (
        <div className='grid grid-cols-3 gap-x-6 gap-y-12 p-10'>
            {pokemonList.map((pokemon) => (
                <div key={pokemon.id} onClick={() => onPokemonSelect(pokemon)}>
                    <div className='relative bg-white shadow-lg rounded-3xl p-4 flex flex-col items-center w-50 h-44 hover:shadow-2xl hover:shadow-slate-500 cursor-pointer'>
                        <div className='relative w-full h-10 '>
                            <img
                                className='absolute top-[-150%] left-1/2 transform -translate-x-1/2 w-24 h-24 transition-transform duration-300 ease-in-out hover:scale-110'
                                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/${pokemon.id}.png`}
                                alt={pokemon.name}
                            />
                        </div>
                        <span className='font-bold text-sm mb-2'>N° {pokemon.id}</span>
                        <h3 className='text-center text-lg font-bold mb-2 capitalize'>{pokemon.name}</h3>

                        <div className='flex space-x-2 mb-2'>
                            {pokemon.types.map((type, typeIndex) => (
                                <div key={typeIndex} className={`${typeColors[type]} text-white p-2 font-bold rounded-lg capitalize text-center flex justify-center w-16 h-7 items-center`}>
                                    {type}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default PokemonGrid;
