
const elementos = {
    cardColecao: document.getElementById('card-colecao'),
    contador: document.getElementById('contador')
};
const CHAVE_COLECAO = 'colecao-salva';
function carregarColecao() {
    try {
        const dadosSalvos = localStorage.getItem(CHAVE_COLECAO);
        const dados = dadosSalvos ? JSON.parse(dadosSalvos) : [];
        return Array.isArray(dados) ? dados : [];
    } catch {
        return [];
    }
}

const colecao = carregarColecao();

for (const pokemon of colecao) {
    const card = document.createElement('div');
    const nome = document.createElement('p');
    const sprite = document.createElement('img');
    const excluirPokemon = document.createElement('button');
    const raridade = document.createElement('p')
    excluirPokemon.type = "button";

    nome.textContent = `Nome: ${pokemon.name}`;
    raridade.textContent = `Raridade: ${pokemon.raridade}`
    const classesRaridade = {
        Mitico: 'mythical',
        Lendario: 'legendary',
        'épico': 'epic',
        Raro: 'rare',
        Incomum: 'incomum',
        Comum: 'comum'
    };
    raridade.classList.add('raridade', classesRaridade[pokemon.raridade] || 'comum');
    sprite.src = pokemon.sprite;
    sprite.alt = `Sprite de ${pokemon.name}`;
    excluirPokemon.textContent = `Excluir`

    card.append(sprite, nome, raridade, excluirPokemon);
    elementos.cardColecao.appendChild(card);


  excluirPokemon.addEventListener('click', (event) => {
    event.stopPropagation();
    const indice = colecao.findIndex(pokemonColecao => pokemonColecao.name === pokemon.name)
    if (indice === -1) {
    return;
}

    colecao.splice(indice, 1);
    localStorage.setItem(CHAVE_COLECAO, JSON.stringify(colecao));
    card.remove();
    atualizarContador();

  });


}

function atualizarContador() {
      elementos.contador.textContent = `Coleção: ${colecao.length}/25`;
}

atualizarContador();







