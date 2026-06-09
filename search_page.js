//Function gets called once the page is loaded.
async function loadSearchPage() {
    let searchInput = document.getElementById('search');
    searchInput.addEventListener('keyup', updateSearchResults);

    let pokedex = await getPokedex();
    //Loop over every pokemon in the pokedex and add it.
    for(let i = 0; i< pokedex.length; i++) {
        await pokedex[i].initialize();
        addPokemon(pokedex[i]);
        //Add 1 because the array starts at 0, but the count of Pokemon starts at 1
        document.getElementById('number_pokemon').textContent = i+1;
    }

    //Remove the spinner.
    document.getElementById('spinner').style.display = 'none';
}

//Helper function to add each pokemon to the search results. You do not need to update this function.
function addPokemon(pokemon) {
    let list = document.getElementById('pokemon_list');

    let div = document.createElement('div');
    div.classList.add('pokemon', 'col-3', 'col-sm-2', 'col-lg-1');
    div.setAttribute('id', pokemon.getId());
    let href = document.createElement('a');
    let pokeImg = document.createElement('img');
    pokeImg.src = pokemon.getFrontSprite();
    href.appendChild(pokeImg);
    let name = document.createElement('div');
    name.textContent = pokemon.getName();
    href.appendChild(name);
    href.href = './pokedex.html?number=' + pokemon.getNumber();
    let type1 = document.createElement('div');
    type1.textContent = pokemon.getType1();
    type1.classList.add(pokemon.getType1(), 'badge');
    href.appendChild(type1);
    if(pokemon.getType2()) {
        let type2 = document.createElement('div');
        type2.textContent = pokemon.getType2();
        type2.classList.add(pokemon.getType2(), 'badge');
        href.appendChild(type2);
    }

    div.appendChild(href);
    list.appendChild(div);
}

//Part 3: Update the search results.
//This function gets called every time a person types a letter in the search box or checks or unchecks one of the type boxes.
async function updateSearchResults() {
    let pokedex = await getPokedex();

    for (let i = 0; i < pokedex.length; i++) {
        await pokedex[i].initialize();
    }

    let search = document.getElementById('search').value.toLowerCase();

    let searchedForPokemon = 0;
    document.getElementById('number_pokemon').textContent = searchedForPokemon;

    let selectedTypes = getSelectedTypes();

    for (let i = 0; i < pokedex.length; i++) {
        let p = pokedex[i];

        let nameMatches = p.getName().toLowerCase().includes(search);

        let pokemonTypes = [p.getType1(), p.getType2()]
            .filter(type => type)
            .map(type => type.toLowerCase());

        let typeMatches = selectedTypes.length === 0 ||
            selectedTypes.every(type => pokemonTypes.includes(type));

        if (nameMatches && typeMatches) {
            showPokemon(p);
            searchedForPokemon++;
        } else {
            hidePokemon(p);
        }
    }

    document.getElementById('number_pokemon').textContent = searchedForPokemon;
}

//Part 3: A helper function for showing a particular pokemon.
function showPokemon(pokemon) {
    let pokemonDOMId = pokemon.getId();
    //TODO: Find the pokemon in the DOM. Show it by removing the "hide" CSS property, if it exists.
    let pokemonElement = document.getElementById(pokemonDOMId);
    if (pokemonElement) {
        pokemonElement.classList.remove('hide');
    }
}

//Part 3: A helper function for hiding a particular pokemon.
function hidePokemon(pokemon) {
    let pokemonDOMId = pokemon.getId();
    //TODO: Find the pokemon in the DOM. Hide it by adding the "hide" CSS property, if it does not already exist.
    let pokemonElement = document.getElementById(pokemonDOMId);
    if (pokemonElement) {
        pokemonElement.classList.add('hide');
    }
}

// Part 3: A helper function for getting a list of all the types that are currently checked.
function getSelectedTypes() {
    let checkboxes = document.querySelectorAll('.form-check-input');
    let selectedTypes = [];

    for (let checkbox of checkboxes) {
        if (checkbox.checked) {
            selectedTypes.push(checkbox.value.toLowerCase());
        }
    }
    return selectedTypes;
}