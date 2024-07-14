import React, { useState } from 'react';
import blankImg from '../../assets/def-pokemon.png'
const statMapping = {
  hp: 'HP',
  attack: 'ATK',
  defense: 'DEF',
  'special-attack': 'SpA',
  'special-defense': 'SpD',
  speed: 'SPD',
};


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

const PokemonDetails = ({ selectedPokemon }) => {

  const [imgError , setImgError] = useState(false)

  if (!selectedPokemon) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 bg-white rounded-xl rounded-tl-xl">
        <div className='flex justify-center items-center'>
          <img
            src={blankImg}
            alt=""
            className='w-full h-auto max-h-48 object-contain'
          />
        </div>
        <div className='mt-20'>
          <p className="text-center">Select a Pokémon to display here.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container flex flex-col items-center justify-center max-h-full p-4 bg-white rounded-tr-xl rounded-xl text-slate-800 relative h-full">
        <img src={imgError ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/${selectedPokemon.id}.png` : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${selectedPokemon.id}.gif`} alt={selectedPokemon.name} className="h-40 w-40 relative top-[-20%]"
        onError={() => setImgError(true)} />

        <div id="current-pokemon-info" className="w-full text-center overflow-y-scroll custom-scrollbar relative top-[-10%] scroll-smooth">
          <span id="current-pokemon-id" className="text-sm font-bold">N°{selectedPokemon.id}</span>

          <h2 id="current-pokemon-name" className="text-2xl font-bold capitalize">{selectedPokemon.name}</h2>

          <div className='flex space-x-2 mb-2 justify-center mt-4'>
            {selectedPokemon.types.map((type, typeIndex) => (
              <div key={typeIndex} className={`${typeColors[type]} text-white p-2 font-bold rounded-lg capitalize text-center flex justify-center w-16 h-7 items-center`}>
                {type}
              </div>
            ))}
          </div>

          <h4 className="mt-4 text-lg font-bold mb-2">Pokedex Entry</h4>
          <span className='m-2 py-2'>{selectedPokemon.description || "No description available."}</span>

          <div className=" grid grid-cols-2 mt-4 w-full">
            <div className="px-2">
              <h4 className="font-bold m-2">Height</h4>
              <div className=" bg-slate-100 rounded-xl border-2 border-slate-200">{selectedPokemon.height}m</div>
            </div>
            <div className="px-2">
              <h4 className="font-bold m-2">Weight</h4>
              <div id="current-pokemon-weight" className=" bg-slate-100 rounded-xl border-2 border-slate-200">{selectedPokemon.weight}kg</div>
            </div>
          </div>

          <div className="column mt-4">
            <h4 className="font-bold m-4">Abilities</h4>
            <div className="flex justify-center space-x-2 ">
              {selectedPokemon.abilities.map((ability, index) => (
                <div key={index} className=" bg-slate-100 rounded-3xl border-2 border-slate-200 flex justify-center  capitalize w-full px-2">{ability}</div>
              ))}
            </div>
          </div>



          <h4 className="mt-4 text-lg font-bold mb-6">Stats</h4>
          <div className="flex justify-around">
            {selectedPokemon.stats.map((stat, index) => (
              <div key={index} className="flex flex-col items-center p-2 max-w-[90%] bg-slate-200 h-12 relative rounded-b-xl">
                <div
                  className="text-white p-3 rounded-3xl absolute top-[-40%] font-bold text-sm"
                  style={{ backgroundColor: getStatColor(statMapping[stat.stat]) }}
                >
                  {statMapping[stat.stat] || stat.stat.toUpperCase()}
                </div> 
                <h5 className="font-bold  relative top-[50%] bg-transparent text-sm">
                  {stat.base_stat}
                </h5>
              </div>
            ))}
          </div>
          <h4 className="mt-5 text-lg font-bold">Evolution</h4>
          {/* <div id="current-pokemon-evolution-chain-container" className="flex justify-center space-x-4">
          {selectedPokemon.evolution_chain.map((evolution, index) => (
            <div key={index} className="flex flex-col items-center">
              <img id={`current-pokemon-evolution-${index}`} className="current-pokemon-evolution-image h-16 w-16" src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${evolution.id}.png`} alt={evolution.name} onClick={() => openInfo(evolution.id)}/>
              {evolution.level && (
                <div id={`current-pokemon-evolution-level-${index}`} className="current-pokemon-evolution-level-container text-sm font-bold">{evolution.level}</div>
              )}
            </div>
          ))}
        </div> */}
        </div>
      </div>
    </>
  );
};

// Utility functions to get colors for types and stats
const getTypeColor = (type) => {
  const typeColors = {
    Poison: '#AB549A',
    Bug: '#ABBC1C',
    // Add more type colors as needed
  };
  return typeColors[type] || '#000'; // Default color
};

const getStatColor = (stat) => {
  const statColors = {
    HP: '#DF2140',
    ATK: '#FF994D',
    DEF: '#eecd3d',
    SpA: '#85DDFF',
    SpD: '#96da83',
    SPD: '#FB94A8',
    TOT: '#7195DC',
    // Add more stat colors as needed
  };
  return statColors[stat] || '#000'; // Default color
};

export default PokemonDetails;
