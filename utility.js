let c1 = new Color('red');
let c2 = new Color('lightseagreen');
let statrange = c1.range(c2, {space: "lch", hue: "shorter"});

//When passed a percentage between 0 and 1, interpolates a color between c1 (red) and c2 (lightsegreen)
function getColorFromPercent(pct) {
    return statrange(pct);
}

//When passed a string of a pokemon name from the PokeAPI, formats it into a more readable word
function formatString(str) {
    return str.replace('-', ' ').split(' ').map(w => w[0].toUpperCase() + w.substring(1).toLowerCase()).join(' ');
}

//When passed a string of a pokemon name from the PokeAPI, formats it into a more readable word
function formatString(str) {
    return str.replace('-', ' ').split(' ').map(w => w[0].toUpperCase() + w.substring(1).toLowerCase()).join(' ');
}

//Removes an id from the DOM
function removeId(id) {
    document.getElementById(id).remove();
}