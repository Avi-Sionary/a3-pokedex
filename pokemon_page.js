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

function updateDescription(pokemon) {
    document.getElementById('number').textContent = pokemon.getFormattedNumber();
    document.getElementById('name').textContent = pokemon.getName();

    let category = "";

    if (typeof pokemon.getCategory === "function") {
        category = pokemon.getCategory();
    } else if (pokemon.customData && pokemon.customData.category) {
        category = pokemon.customData.category;
    }

    document.getElementById('category').textContent = category;

    document.getElementById("front_sprite").src = pokemon.getFrontSprite();
    document.getElementById("back_sprite").src = pokemon.getBackSprite();
    document.getElementById("cry").src = pokemon.getCry();

    document.getElementById('height').textContent =
        pokemon.getHeight() + ' m';

    document.getElementById('weight').textContent =
        pokemon.getWeight() + ' kg';

    let type1 = pokemon.getType1();
    let type1Img = document.getElementById('type1_img');

    if (type1) {
        type1Img.src = pokemon.getTypeImage(type1);
        type1Img.style.display = 'inline';
    } else {
        type1Img.style.display = 'none';
    }

    let type2 = pokemon.getType2();
    let type2Img = document.getElementById('type2_img');

    if (type2) {
        type2Img.src = pokemon.getTypeImage(type2);
        type2Img.style.display = 'inline';
    } else {
        type2Img.src = "";
        type2Img.style.display = 'none';
    }

    document.getElementById('description').textContent =
        pokemon.getPokedexDescription();
}

async function updateNavigation(pokemon) {
    let pokemonNumber = pokemon.getNumber();

    document.getElementById('current_pokemon_img').src = pokemon.getFrontSprite();

    let previousLink = document.getElementById('previous_pokemon');
    let previousImg = document.getElementById('previous_pokemon_img');
    let previousName = document.getElementById('previous_pokemon_name');

    let nextLink = document.getElementById('next_pokemon');
    let nextImg = document.getElementById('next_pokemon_img');
    let nextName = document.getElementById('next_pokemon_name');

    if (pokemonNumber > 0) {
        let previousPokemonNumber = pokemonNumber - 1;
        let previousPokemon = new Pokemon(previousPokemonNumber);
        await previousPokemon.initialize();

        previousLink.href = './pokedex.html?number=' + previousPokemonNumber;
        previousImg.src = previousPokemon.getFrontSprite();
        previousName.textContent =
            '#' + previousPokemon.getFormattedNumber() + ' ' + previousPokemon.getName();

        previousLink.style.display = 'inline-flex';
    } else {
        previousLink.style.display = 'none';
    }

    if (pokemonNumber < 151) {
        let nextPokemonNumber = pokemonNumber + 1;
        let nextPokemon = new Pokemon(nextPokemonNumber);
        await nextPokemon.initialize();

        nextLink.href = './pokedex.html?number=' + nextPokemonNumber;
        nextImg.src = nextPokemon.getFrontSprite();
        nextName.textContent =
            '#' + nextPokemon.getFormattedNumber() + ' ' + nextPokemon.getName();

        nextLink.style.display = 'inline-flex';
    } else {
        nextLink.style.display = 'none';
    }
}

function updateStats(pokemon) {
    updateStat('hp', pokemon.getHp());
    updateStat('attack', pokemon.getAttack());
    updateStat('defense', pokemon.getDefense());
    updateStat('special-attack', pokemon.getSpecialAttack());
    updateStat('special-defense', pokemon.getSpecialDefense());
    updateStat('speed', pokemon.getSpeed());
}

function updateStat(statId, statValue) {
    let el = document.getElementById(statId);

    let label = el.parentElement.previousElementSibling;
    if (label && label.classList.contains('stat-label')) {
        label.textContent = formatString(statId);
    }

    el.textContent = statValue;

    el.style.width = (statValue / 255 * 100) + '%';
    el.style.backgroundColor = getColorFromPercent(statValue / 255);
}

function updateMoves(pokemon) {
    let moveTableBody = document.getElementById('move-table-body');
    let levelUpMoves = pokemon.getLevelUpMoves();

    moveTableBody.innerHTML = "";

    for (let i = 0; i < levelUpMoves.length; i++) {
        let moveLevel = levelUpMoves[i].level_learned_at;
        let moveName = levelUpMoves[i].name;

        addMove(moveTableBody, moveLevel, moveName);
    }
}

function addMove(moveTableBody, moveLevel, moveName) {
    let tr = document.createElement('tr');
    let td1 = document.createElement('td');
    let td2 = document.createElement('td');

    td1.textContent = moveLevel;
    td2.textContent = formatString(moveName);

    tr.appendChild(td1);
    tr.appendChild(td2);
    moveTableBody.appendChild(tr);
}