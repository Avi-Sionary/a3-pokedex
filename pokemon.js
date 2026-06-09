const P = new Pokedex.Pokedex();

let version = 'yellow';
let minId = 0;
let maxId = 151;

// Returns the Kanto pokedex entries.
async function getPokedex() {
    let allPokemon = await loadPokemonData();

    return allPokemon.map(row => new Pokemon(row.number));
}

let pokedexData = undefined;

async function loadPokemonData() {
    if (!pokedexData) {
        let response = await fetch("pokemon.json");
        pokedexData = await response.json();
    }

    return pokedexData;
}

// A helper class for accessing data from PokeAPI and SQLite.
class Pokemon {
    constructor(id) {
        this.id = id;
        this.poke = undefined;
        this.species = undefined;
        this.customData = undefined;
    }

    async initialize() {
        let allPokemon = await loadPokemonData();

        this.customData = allPokemon.find(
            p => Number(p.number) === Number(this.id)
        );

        if (this.id >= 1 && this.id <= maxId) {
            this.species = await P.getPokemonSpeciesByName(this.id);
            this.poke = await P.getPokemonByName(this.id);
        }
    }

    getNumber() {
        return this.id;
    }

    getFormattedNumber() {
        return String(this.id).padStart(3, '0');
    }

    getId() {
        return 'pokemon_' + this.id;
    }

    getCategory() {
        return this.customData?.category || '';
    }

    getName() {
        if (this.customData?.name) {
            return this.customData.name;
        }

        return formatPokemonName(this.poke.name);
    }

    getFrontSprite() {
        if (this.customData?.picture) {
            return this.customData.picture;
        }

        if (this.poke) {
            return this.poke.sprites.front_default;
        }

        return "media/missingno_front.png";
    }

    getBackSprite() {
        if (this.id === 0) {
            return "media/missingno_back.png";
        }

        return this.poke.sprites.back_default;
    }

    getCry() {
        if (this.id === 0) {
            return "media/missingno.ogg";
        }

        return this.poke.cries.latest;
    }

    getHeight() {
        if (this.customData?.height_m != null) {
            return this.customData.height_m;
        }

        return this.poke.height / 10;
    }

    getHeightFtIn() {
        let heightIn = this.getHeight() * 39.3701;
        let heightFt = Math.floor(heightIn / 12);
        let heightInRemainder = Math.round(heightIn % 12);

        return heightFt + " Ft " + heightInRemainder + " In";
    }

    getWeight() {
        if (this.customData?.weight_kg != null) {
            return this.customData.weight_kg;
        }

        return this.poke.weight / 10;
    }

    getWeightLbs() {
        return (this.getWeight() * 2.20462).toFixed(1);
    }

    getType1() {
        if (this.poke?.types?.length > 0) {
            return this.poke.types[0].type.name;
        }

        return this.customData?.type1?.toLowerCase();
    }

    getType2() {
        if (this.poke?.types?.length > 1) {
            return this.poke.types[1].type.name;
        }

        if (this.customData?.type2 && this.customData.type2.trim() !== "") {
            return this.customData.type2.toLowerCase();
        }

        return undefined;
    }

    getTypeImage(type) {
        if (!type) return "";

        if (type.toLowerCase() === "bird") {
            return "media/types/UnknownIC_ZA.png";
        }

        let fixedType = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();

        return 'media/types/' + fixedType + 'IC_ZA.png';
    }

    getPokedexDescription() {
        if (this.customData?.entry) {
            return this.customData.entry;
        }

        return this.species.flavor_text_entries.find(
            (text_entry) => text_entry.version.name == version
        ).flavor_text;
    }

    getHp() {
        return this.id === 0 ? 0 : this.getStat('hp');
    }

    getAttack() {
        return this.id === 0 ? 0 : this.getStat('attack');
    }

    getSpecialAttack() {
        return this.id === 0 ? 0 : this.getStat('special-attack');
    }

    getDefense() {
        return this.id === 0 ? 0 : this.getStat('defense');
    }

    getSpecialDefense() {
        return this.id === 0 ? 0 : this.getStat('special-defense');
    }

    getSpeed() {
        return this.id === 0 ? 0 : this.getStat('speed');
    }

    getStat(stat) {
        return this.poke.stats.find(
            (s) => s.stat.name == stat
        ).base_stat;
    }

    getLevelUpMoves() {
        if (this.id === 0) {
            return [];
        }

        let moves = [];

        this.poke.moves.forEach((move) => {
            let myVersion = move.version_group_details.find((v) => {
                return (
                    v.version_group.name == version &&
                    v.move_learn_method.name == 'level-up'
                );
            });

            if (myVersion) {
                myVersion.name = move.move.name;
                moves.push(myVersion);
            }
        });

        moves.sort((moveA, moveB) => {
            if (moveA.level_learned_at != moveB.level_learned_at) {
                return moveA.level_learned_at - moveB.level_learned_at;
            }
            else if (moveA.order != moveB.order) {
                return moveA.order - moveB.order;
            }
            else {
                return 0;
            }
        });

        return moves;
    }

    getLevelUpMoveNames() {
        return this.getLevelUpMoves().map(
            (move) => move.name
        );
    }

    getLevelUpMoveLevels() {
        return this.getLevelUpMoves().map(
            (move) => move.level_learned_at
        );
    }
}