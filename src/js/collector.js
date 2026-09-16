const elementos = {
    buscar: document.getElementById('buscar'),
    contador: document.getElementById('contador'),
    sprite: document.getElementById('sprite'),
    nome: document.getElementById('nome'),
    raridade: document.getElementById('raridade'),
    adicionarOutro: document.getElementById('adicionar'),
    limparColecao: document.getElementById('limpar-colecao'),
    mensagemErro: document.getElementById('mensagem-erro'),
    adicionado: document.getElementById('adicionado'),
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
let pokemonAtual = null;


async function buscarPokemon(){
    elementos.adicionado.textContent = '';
    const aleatorio = Math.floor(Math.random() * 1025) + 1;

    try {
        const resposta = await fetch(`https://pokeapi.co/api/v2/pokemon/${aleatorio}`)
       if(!resposta.ok){
        throw new Error('Nome de pokémon invalido!')
       }

       const dados = await resposta.json();
       pokemonAtual = dados;
       const respostaSpecies = await fetch (dados.species.url);
       if (!respostaSpecies.ok) {
    throw new Error('Não foi possível carregar a espécie do Pokémon.');
}

       const dadosSpecies = await respostaSpecies.json();
       const raridade = descubrirRaridade(dadosSpecies);
    pokemonAtual = { ...dados, raridade };
       console.log(raridade);

       elementos.mensagemErro.textContent = '';
        elementos.sprite.src = dados.sprites.front_default;
       elementos.nome.textContent = `Nome: ${dados.name}`
       elementos.raridade.textContent = `Raridade: ${raridade}`

       
    }

    catch(erro){
        pokemonAtual = null;
        elementos.mensagemErro.textContent = erro.message
    }

}

function adicionarPokemon(pokemonAtual){
    elementos.adicionado.textContent = '';

    if(pokemonAtual === null){
        elementos.mensagemErro.textContent = `Gire um Pokemon primeiro!`
        return;
    }
    if(colecao.length<25){
        const jaTem = colecao.some(pokemon => pokemon.name === pokemonAtual.name);

        if(!jaTem) {
            const pokemonSalvo = {
                id: pokemonAtual.id,
                name: pokemonAtual.name,
                sprite: pokemonAtual.sprites.front_default,
                raridade: pokemonAtual.raridade
            };

            colecao.push(pokemonSalvo);

            try {
                localStorage.setItem(CHAVE_COLECAO, JSON.stringify(colecao));
                elementos.adicionado.textContent = `Pokemon Adicionado a Coleção!`;
                atualizarContador();
                console.log(colecao);
            } catch (erro) {
                colecao.pop();
                elementos.mensagemErro.textContent = 'Não foi possível salvar a coleção. O armazenamento do navegador está cheio.';
            }

        }

        else {
            elementos.mensagemErro.textContent = 'Voce ja tem este Pokemon!';
        }
    }

    else {
        elementos.mensagemErro.textContent = 'Coleção Cheia';
    }

  

}

function atualizarContador(){
    elementos.contador.textContent = `Coleção: ${colecao.length}/25`;
}


function descubrirRaridade(buscarRaridade){
     elementos.raridade.classList.remove(
        'mythical',
        'legendary',
        'epic',
        'rare',
        'incomum',
        'comum');
    if(buscarRaridade.is_mythical){
        elementos.raridade.classList.add('mythical');
        return 'Mitico'
      
    }

    else if(buscarRaridade.is_legendary){
        elementos.raridade.classList.add('legendary');
        return 'Lendario'
    }

    else {
        if(buscarRaridade.capture_rate <= 35){
            elementos.raridade.classList.add('epic');
            return 'épico'
        }


        else if(buscarRaridade.capture_rate <= 100){
            elementos.raridade.classList.add('rare');
            return 'Raro'
        }

        else if(buscarRaridade.capture_rate <=165){
            elementos.raridade.classList.add('incomum');
            return 'Incomum'
        }

        else {
            elementos.raridade.classList.add('comum');
            return 'Comum'
        }
    }

}


elementos.buscar.addEventListener('click', buscarPokemon);
elementos.adicionarOutro.addEventListener('click', () => adicionarPokemon(pokemonAtual));

atualizarContador();


