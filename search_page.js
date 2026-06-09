let loadedPokedex = [];
let selectedPokemon = undefined;

// Function gets called once the page is loaded.
async function loadSearchPage() {
    let searchInput = document.getElementById('search');
    searchInput.addEventListener('keyup', updateSearchResults);

    loadedPokedex = await getPokedex();

    for (let i = 0; i < loadedPokedex.length; i++) {
        await loadedPokedex[i].initialize();
        addPokemon(loadedPokedex[i]);

        document.getElementById('number_pokemon').textContent = i + 1;
    }

    document.getElementById('spinner').style.display = 'none';

    if (loadedPokedex.length > 0) {
        selectPokemon(loadedPokedex[0]);
    }
}

function addPokemon(pokemon) {
    let list = document.getElementById('pokemon_list');

    let div = document.createElement('div');
    div.classList.add('pokemon', 'dex-row');
    div.setAttribute('id', pokemon.getId());

    let href = document.createElement('a');
    href.href = './pokedex.html?number=' + pokemon.getNumber();

    let number = document.createElement('span');
    number.classList.add('dex-number');
    number.textContent = pokemon.getFormattedNumber();

    let name = document.createElement('span');
    name.classList.add('dex-name');
    name.textContent = pokemon.getName();

    href.appendChild(number);
    href.appendChild(name);

    div.addEventListener('mouseenter', function () {
        selectPokemon(pokemon);
    });

    div.appendChild(href);
    list.appendChild(div);
}

async function updateSearchResults() {
    let search = document.getElementById('search').value.toLowerCase();
    let searchedForPokemon = 0;
    let selectedTypes = getSelectedTypes();
    let firstVisiblePokemon = undefined;

    for (let i = 0; i < loadedPokedex.length; i++) {
        let p = loadedPokedex[i];

        let nameMatches = p.getName().toLowerCase().includes(search);

        let pokemonTypes = [p.getType1(), p.getType2()]
            .filter(type => type)
            .map(type => type.toLowerCase());

        let typeMatches = selectedTypes.length === 0 ||
            selectedTypes.every(type => pokemonTypes.includes(type));

        if (nameMatches && typeMatches) {
            showPokemon(p);
            searchedForPokemon++;

            if (!firstVisiblePokemon) {
                firstVisiblePokemon = p;
            }
        } else {
            hidePokemon(p);
        }
    }

    document.getElementById('number_pokemon').textContent = searchedForPokemon;

    if (firstVisiblePokemon) {
        selectPokemon(firstVisiblePokemon);
    } else {
        clearPreview();
    }
}

function showPokemon(pokemon) {
    let pokemonElement = document.getElementById(pokemon.getId());

    if (pokemonElement) {
        pokemonElement.classList.remove('hide');
    }
}

function hidePokemon(pokemon) {
    let pokemonElement = document.getElementById(pokemon.getId());

    if (pokemonElement) {
        pokemonElement.classList.add('hide');
        pokemonElement.classList.remove('selected');
    }
}

function getSelectedTypes() {
    let checkboxes = document.querySelectorAll('#type_dropdown_menu input[type="checkbox"]');
    let selectedTypes = [];

    for (let checkbox of checkboxes) {
        if (checkbox.checked) {
            selectedTypes.push(checkbox.value.toLowerCase());
        }
    }

    updateTypeDropdownButton(selectedTypes);

    return selectedTypes;
}

function selectPokemon(pokemon) {
    selectedPokemon = pokemon;

    let allRows = document.querySelectorAll('.dex-row');

    for (let row of allRows) {
        row.classList.remove('selected');
    }

    let selectedRow = document.getElementById(pokemon.getId());

    if (selectedRow) {
        selectedRow.classList.add('selected');
    }

    updatePreview(pokemon);
}

function updatePreview(pokemon) {
    let previewImg = document.getElementById('preview_sprite');
    let previewName = document.getElementById('preview_name');
    let previewNumber = document.getElementById('preview_number');
    let previewType1 = document.getElementById('preview_type1');
    let previewType2 = document.getElementById('preview_type2');

    if (!previewImg || !previewName || !previewNumber || !previewType1 || !previewType2) {
        return;
    }

    previewImg.src = pokemon.getFrontSprite();
    previewName.textContent = pokemon.getName();
    previewNumber.textContent = pokemon.getFormattedNumber();

    let type1 = pokemon.getType1();
    let type2 = pokemon.getType2();

    previewType1.src = pokemon.getTypeImage(type1);
    previewType1.alt = type1;
    previewType1.style.display = 'inline';

    if (type2) {
        previewType2.src = pokemon.getTypeImage(type2);
        previewType2.alt = type2;
        previewType2.style.display = 'inline';
    } else {
        previewType2.src = '';
        previewType2.alt = '';
        previewType2.style.display = 'none';
    }
}

function clearPreview() {
    let previewImg = document.getElementById('preview_sprite');
    let previewName = document.getElementById('preview_name');
    let previewNumber = document.getElementById('preview_number');
    let previewType1 = document.getElementById('preview_type1');
    let previewType2 = document.getElementById('preview_type2');

    if (previewImg) previewImg.src = '';
    if (previewName) previewName.textContent = '';
    if (previewNumber) previewNumber.textContent = '';
    if (previewType1) previewType1.style.display = 'none';
    if (previewType2) previewType2.style.display = 'none';
}

function toggleTypeDropdown() {
    document.getElementById('type_dropdown_menu').classList.toggle('hide');
}

function updateTypeDropdownButton(selectedTypes) {
    let button = document.getElementById('type_dropdown_button');

    if (selectedTypes.length === 0) {
        button.textContent = '???';
    } else if (selectedTypes.length === 1) {
        button.textContent = selectedTypes[0].toUpperCase();
    } else {
        button.textContent = selectedTypes.length + ' TYPES';
    }
}