let search = document.getElementById('search')
let nameInput = document.getElementById('name-input')
let dynamicName = "pikachu"
let sprite = document.getElementById('sprite')
let pokeId = document.getElementById('pokemon-id')
let pokeName = document.getElementById('pokemon-name')
let foward = document.getElementById('foward')
let back = document.getElementById('back')
let pin = document.getElementById('favorite-btn')
let favoritesGrid = document.getElementById('favorites-container')

async function buscarPokemon() {
    let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${dynamicName}`)
    let json = await response.json()
    return json;
} 

let jsonData;
buscarPokemon().then(data => {
    jsonData = data;
})

search.addEventListener('click', async function() {
    jsonData = await buscarPokemon()
    if (nameInput.value == "") {
        dynamicName = "pikachu"
    } else {
        dynamicName = nameInput.value.toLowerCase()
    }

    jsonData = await buscarPokemon()
    console.log(jsonData)
    sprite.src = jsonData.sprites.front_default
    pokeId.innerText = jsonData.id
    pokeName.innerText = jsonData.name
    atualizarEstrela()
})

foward.addEventListener('click', async function () {
    dynamicName = String(jsonData.id + 1)
    jsonData = await buscarPokemon()

    sprite.src = jsonData.sprites.front_default
    pokeId.innerText = jsonData.id
    pokeName.innerText = jsonData.name
    atualizarEstrela()
})

back.addEventListener('click', async function () {
    dynamicName = String(jsonData.id - 1)
    jsonData = await buscarPokemon()

    sprite.src = jsonData.sprites.front_default
    pokeId.innerText = jsonData.id
    pokeName.innerText = jsonData.name
    atualizarEstrela()
})


function salvarFavoritos(pokemon) {
    let favoritos = JSON.parse(localStorage.getItem('favoritos')) || []
    
    let jaExiste = favoritos.some(p => p.id === pokemon.id)
    if (jaExiste) return

    favoritos.push({
        id: pokemon.id,
        name: pokemon.name,
        sprite: pokemon.sprites.front_default
    })

    localStorage.setItem('favoritos', JSON.stringify(favoritos))
}

function carregarFavoritos() {
    let favoritos = JSON.parse(localStorage.getItem('favoritos')) || []

    favoritos.forEach(pokemon => {
        let favImg = document.createElement('img')
        favImg.src = pokemon.sprite
        favImg.alt = pokemon.name
        favImg.title = pokemon.name
        favImg.dataset.id = pokemon.id
        favImg.classList.add('fav-pokemon')
        favoritesGrid.appendChild(favImg)
    })
}

pin.addEventListener('click', function () {
    let jaFavoritado = favoritesGrid.querySelector(`[data-id="${jsonData.id}"]`)
    
    if (jaFavoritado) {
        // Se já favoritado, desfavorita
        jaFavoritado.remove()
        removerFavorito(jsonData.id)
        document.getElementById('fav-img').src = 'assets/starblank.png'
        return
    }

    // Favorita
    document.getElementById('fav-img').src = 'assets/starfill.png'

    let favImg = document.createElement('img')
    favImg.src = jsonData.sprites.front_default
    favImg.alt = jsonData.name
    favImg.title = jsonData.name
    favImg.dataset.id = jsonData.id
    favImg.classList.add('fav-pokemon')
    favoritesGrid.appendChild(favImg)

    salvarFavoritos(jsonData)
})

function removerFavorito(id) {
    let favoritos = JSON.parse(localStorage.getItem('favoritos')) || []
    favoritos = favoritos.filter(p => p.id !== id)
    localStorage.setItem('favoritos', JSON.stringify(favoritos))
}

function atualizarEstrela() {
    let favoritos = JSON.parse(localStorage.getItem('favoritos')) || []
    let ehFavorito = favoritos.some(p => p.id === jsonData.id)
    document.getElementById('fav-img').src = ehFavorito 
        ? 'assets/starfill.png' 
        : 'assets/starblank.png'
}

carregarFavoritos()