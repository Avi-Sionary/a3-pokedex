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
    document.getElementById('number').textContent = '#' + pokemonNumber;

    //TODO: Call the getName() function to and assign it to the name variable.
    let name = 'MissingNo';
    document.getElementById('name').textContent = name;
    
    //TODO: Get and assign the front sprite, back sprite, and cry links.
    let backSprite = 'media/missingno_back.png';
    let frontSprite = 'media/missingno_front.png'
    let cry = 'media/missingno.ogg'

    document.getElementById("back_sprite").src = backSprite;
    document.getElementById("front_sprite").src = frontSprite;
    document.getElementById('cry').src = cry;

    //TODO: Get and assign the height and weight values. Be sure to check the units!
    let height = 3;
    let weight = 1590;
    document.getElementById('height').textContent = 'Height: ' + height + 'm';
    document.getElementById('weight').textContent = 'Weight: ' + weight + 'kg';

    //TODO: Get and assign the value for type1, and type2 if it exists.
    let type1 = 'unknown';
    document.getElementById('type1').textContent = type1;
    document.getElementById('type1').classList.add(type1, 'badge');

    //TODO: Get and assign the pokedex text description.
    let pokedexDescription = 'MissingNO appears as a bug in the original pokemon games. We\'ll fix it here!'
    document.getElementById('description').textContent = pokedexDescription;
}

//Part 1b: Call methods of the Pokemon class to update the navigation between pokedex entries.
async function updateNavigation(pokemon) {
    let pokemonNumber = pokemon.getNumber();

    //TODO: Set the id numbers for the next and previous pokemon.
    //For example, Ivysaur (#2) is the pokemon after Bulbasaur (#1).
    let previousPokemonNumber = pokemonNumber;
    let nextPokemonNumber = pokemonNumber;
    //Creates new instances of the Pokemon class for the previous and next pokemon.
    //You do not need to edit these lines.
    let previousPokemon = new Pokemon(previousPokemonNumber);
    await previousPokemon.initialize();
    let nextPokemon = new Pokemon(nextPokemonNumber);
    await nextPokemon.initialize();

    //TODO: Get and assign the front sprites, links, and names for the current, next, and previous pokemon.
    //TODO: Add an if statement to only display the next pokemon if the pokemon number is under 151 (E.g., Mew has no "next" pokemon).
    //TODO: Add an if statement to only display the previous pokemon if the pokemon number is over 1 (E.g., Bulbasaur has no "previous" pokemon).
    let currentPokemonSprite = 'media/missingno_front.png';
    let previousPokemonSprite = 'media/missingno_front.png';
    let nextPokemonSprite = 'media/missingno_front.png';
    let previousPokemonName = 'MissingNo';
    let nextPokemonName = 'MissingNo';
    document.getElementById('current_pokemon_img').src = currentPokemonSprite;
    document.getElementById('previous_pokemon').href = './pokedex.html?number=' + previousPokemonNumber;
    document.getElementById('previous_pokemon_img').src = previousPokemonSprite;
    document.getElementById('previous_pokemon_name').textContent = '#' + previousPokemonName;
    document.getElementById('next_pokemon').href = './pokedex.html?number=' + nextPokemonNumber;
    document.getElementById('next_pokemon_img').src = nextPokemonSprite;
    document.getElementById('next_pokemon_name').textContent = '#' + nextPokemonName;
}

//Part 2a: Call methods of the Pokemon class to display the stats of the pokemon.
function updateStats(pokemon) {
    //TODO: Get and assign the stats of the pokemon.
    let hpStat = 178;
    let attackStat = 19;
    let defenseStat = 11;
    let specialAttackStat = 23;
    let specialDefenseStat = 23;
    let speedStat = 0;
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
    //TODO: Read up on Bootstrap's progress bar to learn what CSS properties are used for customizing the bar's width and color.
    //https://getbootstrap.com/docs/5.3/components/progress/
    //Then, use DOM manipulation to update those styles.
    //https://www.w3schools.com/jsref/prop_html_style.asp
    //The getColorFromPercent() function in utility.js can help map stat values to colors.
    
}

//Part 2b: Call methods of the Pokemon class to display the level up moves of the pokemon.
function updateMoves(pokemon) {
    let moveTable = document.getElementById('move-table');
    //TODO: Get the move names and levels for the level up moves.
    //Use a for loop to loop over these arrays, calling addMove for each move.
    //These lines show how the addMove function is called, and can be removed.
    addMove(moveTable, 1, 'Water Gun');
    addMove(moveTable, 1, 'Water Gun');
    addMove(moveTable, 1, 'Sky Attack');
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