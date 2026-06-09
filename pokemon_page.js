//Function gets called once the page is loaded.
async function loadPokedexEntry() {
    let params = new URLSearchParams(document.location.search);
    let id = Number(params.get('number'));

    let pokemon = new Pokemon(id);
    await pokemon.initialize();

    updateDescription(pokemon);
    updateNavigation(pokemon);
    updateStats(pokemon);
    updateMoves(pokemon);
}

//Part 1a: Call methods of the Pokemon class to display the description of the pokemon in the pokedex.
function updateDescription(pokemon) {
    let pokemonNumber = pokemon.getNumber();
    let formattedNumber = pokemon.getFormattedNumber();
    document.getElementById('number').textContent = '#' + formattedNumber;

    let name = pokemon.getName();
    document.getElementById('name').textContent = name;
    
    let backSprite = pokemon.getBackSprite();
    let frontSprite = pokemon.getFrontSprite();
    let cry = pokemon.getCry();

    document.getElementById("back_sprite").src = backSprite;
    document.getElementById("front_sprite").src = frontSprite;
    document.getElementById('cry').src = cry;

    let height = pokemon.getHeight();
    let heightFtIn = pokemon.getHeightFtIn();
    let weight = pokemon.getWeight();
    let weightLbs = pokemon.getWeightLbs();
    document.getElementById('height').textContent = 'Height: ' + height + ' m (' + heightFtIn + ')';
    document.getElementById('weight').textContent = 'Weight: ' + weight + ' kg (' + weightLbs + ' lbs)';

    let type1 = pokemon.getType1();
    let type1Img = pokemon.getTypeImage(type1);

    document.getElementById('type1_img').src = type1Img;
    document.getElementById('type1').classList.add(type1, 'badge');

    let type2 = pokemon.getType2();
    let type2ImgElement = document.getElementById('type2_img');

    if (type2) {
        let type2Img = pokemon.getTypeImage(type2);

        type2ImgElement.src = type2Img;
        type2ImgElement.style.display = 'inline';

        document.getElementById('type2').classList.add(type2, 'badge');
    } else {
        type2ImgElement.src = "";
        type2ImgElement.style.display = 'none';
    }
    
    let pokedexDescription = pokemon.getPokedexDescription();
    document.getElementById('description').textContent = pokedexDescription;
}

//Part 1b: Call methods of the Pokemon class to update the navigation between pokedex entries.
async function updateNavigation(pokemon) {
    let pokemonNumber = pokemon.getNumber();

    let previousPokemonNumber = pokemonNumber - 1;
    let nextPokemonNumber = pokemonNumber + 1;
    //Creates new instances of the Pokemon class for the previous and next pokemon.
    let previousPokemon = new Pokemon(previousPokemonNumber);
    await previousPokemon.initialize();
    let nextPokemon = new Pokemon(nextPokemonNumber);
    await nextPokemon.initialize();

    let currentPokemonSprite = pokemon.getFrontSprite();
    if (pokemonNumber > 1) {
        let previousPokemonSprite = previousPokemon.getFrontSprite();
        let previousPokemonName = previousPokemon.getName();
        document.getElementById('previous_pokemon').href = './pokedex.html?number=' + previousPokemonNumber;
        document.getElementById('previous_pokemon_img').src = previousPokemonSprite;
        document.getElementById('previous_pokemon_name').textContent = '#' + previousPokemonName;
    }
    if (pokemonNumber < 151) {
        let nextPokemonSprite = nextPokemon.getFrontSprite();
        let nextPokemonName = nextPokemon.getName();
        document.getElementById('next_pokemon').href = './pokedex.html?number=' + nextPokemonNumber;
        document.getElementById('next_pokemon_img').src = nextPokemonSprite;
        document.getElementById('next_pokemon_name').textContent = '#' + nextPokemonName;
    }
}

//Part 2a: Call methods of the Pokemon class to display the stats of the pokemon.
function updateStats(pokemon) {
    let hpStat = pokemon.getHp();
    let attackStat = pokemon.getAttack();
    let defenseStat = pokemon.getDefense();
    let specialAttackStat = pokemon.getSpecialAttack();
    let specialDefenseStat = pokemon.getSpecialDefense();
    let speedStat = pokemon.getSpeed();
    //Calls the updateStat helper function.
    updateStat('hp', hpStat);
    updateStat('attack', attackStat);
    updateStat('defense', defenseStat);
    updateStat('special-attack', specialAttackStat);
    updateStat('special-defense', specialDefenseStat);
    updateStat('speed', speedStat);
}

//Part 2a: A helper function for updating the progress bars associated with each stat.
function updateStat(statId, statValue) {
    let el = document.getElementById(statId);
    el.ariaValueNow = statValue;
    el.textContent = formatString(statId) + ': ' + statValue;
    el.style.width = (statValue / 255 * 100) + '%';
    el.style.backgroundColor = getColorFromPercent(statValue / 255);
}

//Part 2b: Call methods of the Pokemon class to display the level up moves of the pokemon.
function updateMoves(pokemon) {
    let moveTable = document.getElementById('move-table');
    let levelUpMoves = pokemon.getLevelUpMoves();
    for (let i = 0; i < levelUpMoves.length; i++) {
        let moveLevel = levelUpMoves[i].level_learned_at;
        let moveName = levelUpMoves[i].name;
        addMove(moveTable, moveLevel, moveName);
    }
}

//A helper function for adding moves to the move table.
// You do not need to edit this function.
function addMove(moveTable, moveLevel, moveName) {
    let tr = document.createElement('tr');
    let td1 = document.createElement('td');
    let td2 = document.createElement('td');
    td1.textContent = moveLevel;
    td2.textContent = formatString(moveName);
    tr.appendChild(td1);
    tr.appendChild(td2);
    moveTable.appendChild(tr);
}
