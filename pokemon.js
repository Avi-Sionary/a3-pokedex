const P = new Pokedex.Pokedex();

let version = 'yellow';
let minId = 1;
let maxId = 151;

//Returns the Kanto pokedex entries.
async function getPokedex() {
    let kanto = await P.getPokedexByName("kanto");
    return kanto.pokemon_entries.map(p => {return new Pokemon(p.entry_number);});
}

//A helper class for accessing data from PokeAPI.
class Pokemon {
    //Creates a pokemon given its pokedex (id) number.
    constructor(id) {
        this.id = id;
        this.poke = undefined;
        this.species = undefined;
    }

    //Initializes the pokemon with its PokeAPI data.
    //A separate function because constructors can't be async
    //https://stackoverflow.com/questions/43431550/how-can-i-invoke-asynchronous-code-within-a-constructor
    async initialize() {
        if(this.id >= minId && this.id <= maxId) {
            this.species = await P.getPokemonSpeciesByName(this.id);
            this.poke = await P.getPokemonByName(this.id);
        }
    }

    //Returns the pokemon's pokedex number.
    //E.g., returns 1 for Bulbasaur.
    getNumber() {
        return this.id;
    }

    //Returns the string "pokemon_" concatenated with pokedex number, which may be useful for HTML IDs.
    //E.g., returns "pokemon_1" for Bulbasaur.
    getId() {
        return 'pokemon_' + this.id;
    }

    //Returns the pokemon's name.
    //E.g., returns "Bulbasaur" for Bulbasaur.
    getName() {
        return formatString(this.poke.name);
    }

    //Returns a link to the pokemon's back sprite, hosted by PokeAPI.
    //E.g., returns "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png" for Bulbasaur.
    getBackSprite() {
        return this.poke.sprites.back_default;
    }

    //Returns a link to the pokemon's front sprite, hosted by PokeAPI.
    //E.g., returns "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/1.png" for Bulbasaur.
    getFrontSprite() {
        return this.poke.sprites.front_default;
    }

    //Returns a link to the pokemon's cry, hosted by PokeAPI.
    //E.g., returns "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/1.ogg" for Bulbasaur.
    getCry() {
        return this.poke.cries.latest;
    }

    //Returns the pokemon's height in decimeters.
    //E.g., returns 7 for Bulbasaur.
    getHeight() {
        return this.poke.height;
    }

    //Returns the pokemon's weight in hectograms.
    //E.g., returns 69 for Bulbasaur.
    getWeight() {
        return this.poke.weight;
    }

    //Returns the pokemon's first type, or undefined if there is not one.
    //E.g., returns "Grass" for Bulbasaur.
    getType1() {
        if(this.poke.types.length > 0) {
            return this.poke.types[0].type.name;
        } else {
            return undefined;
        }
    }

    //Returns the pokemon's second type, or undefined if there is not one.
    //E.g., returns "Poison" for Bulbasaur.
    getType2() {
        if(this.poke.types.length > 1) {
            return this.poke.types[1].type.name;
        } else {
            return undefined;
        }
    }

    //Returns the pokemon's pokedex description.
    //E.g., returns "It can go for days without eating a single morsel. In the bulb on its back, it stores energy." for Bulbasaur.
    getPokedexDescription() {
        return this.species.flavor_text_entries.find((text_entry) => {return text_entry.version.name == version;}).flavor_text;
    }

    //Returns the pokemon's hp stat.
    //E.g., returns 45 for Bulbasaur.
    getHp() {
        return this.getStat('hp');
    }

    //Returns the pokemon's attack stat.
    //E.g., returns 49 for Bulbasaur.
    getAttack() {
        return this.getStat('attack');
    }

    //Returns the pokemon's special attack stat.
    //E.g., returns 65 for Bulbasaur.
    getSpecialAttack() {
        return this.getStat('special-attack');
    }

    //Returns the pokemon's defense stat.
    //E.g., returns 49 for Bulbasaur.
    getDefense() {
        return this.getStat('defense');
    }

    //Returns the pokemon's special defense stat.
    //E.g., returns 65 for Bulbasaur.
    getSpecialDefense() {
        return this.getStat('special-defense');
    }

    //Returns the pokemon's speed stat.
    //E.g., returns 45 for Bulbasaur.
    getSpeed() {
        return this.getStat('speed');
    }

    //A helper method to look up a specific stat by name.
    //Not intended to be called directly, unless you're looking to optimize your code.
    getStat(stat) {
        return this.poke.stats.find((s) => {return s.stat.name == stat;}).base_stat;
    }

    //Returns an array of dictionaries with the moves that a pokemon can learn via level-up.
    //Not intended to be called directly, unless you're looking to optimize your code.
    getLevelUpMoves() {
        let moves = [];
        this.poke.moves.forEach((move) => {
            let myVersion = move.version_group_details.find((v) => {
                return v.version_group.name == version && v.move_learn_method.name == 'level-up';
            });
            if(myVersion) {
                myVersion.name = move.move.name;
                moves.push(myVersion);
            }
        });
        moves.sort((moveA, moveB) => {
            if(moveA.level_learned_at != moveB.level_learned_at) {
                return moveA.level_learned_at - moveB.level_learned_at;
            }
            else if(moveA.order != moveB.order) {
                return moveA.order - moveB.order;
            }
            else {
                return 0;
            }
        });
        return moves;
    }

    //Returns an array with the names of moves that a pokemon can learn via level-up.
    //E.g., returns ["tackle", "growl", "leech-seed", "vine-whip", "poison-powder", "razor-leaf", "growth", "sleep-powder", "solar-beam"] for Bulbasaur.
    getLevelUpMoveNames() {
        return this.getLevelUpMoves().map((move) => {return move.name;});
    }

    //Returns an array with the levels at which a pokemon learns its moves via level-up.
    //E.g., returns [1, 1, 7, 13, 20, 27, 34, 41, 48] for Bulbasaur.
    getLevelUpMoveLevels() {
        return this.getLevelUpMoves().map((move) => {return move.level_learned_at;});
    }
}