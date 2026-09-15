const CHAVE_FAVORITOS = 'pokemon-favoritos';

function carregarFavoritos() {
    try {
        const dadosSalvos = localStorage.getItem(CHAVE_FAVORITOS);
        const dados = dadosSalvos ? JSON.parse(dadosSalvos) : [];
        return Array.isArray(dados) ? dados : [];
    } catch {
        return [];
    }
}

const favoritos = carregarFavoritos();
let pokemonAtual = null;

const elementos = {
    listaFavoritos: document.getElementById('favoritos'),
    mensagemFavoritos: document.getElementById('mensagem-favoritos'),
    mensagemErro: document.getElementById('mensagem-erro'),
    inputPokemon: document.getElementById('pokemon'),
    sprite: document.getElementById('sprite'),
    nome: document.getElementById('nome'),
    altura: document.getElementById('altura'),
    peso: document.getElementById('peso'),
    experiencia: document.getElementById('experiencia'),
    card: document.getElementById('card'),
    botaoBuscar: document.getElementById('buscar'),
    botaoLimpar: document.getElementById('limpar')
};

const botaoFavoritar = document.createElement('button');
botaoFavoritar.id = 'favoritar';
botaoFavoritar.className = 'botao-acao botao-favoritar';
botaoFavoritar.type = 'button';
botaoFavoritar.hidden = true;
elementos.card.appendChild(botaoFavoritar);

function salvarFavoritos() {
    localStorage.setItem(CHAVE_FAVORITOS, JSON.stringify(favoritos));
}

function pokemonEstaFavoritado(nome) {
    return favoritos.some((pokemon) => pokemon.name === nome);
}

function atualizarBotaoFavoritar() {
    const jaFavoritado = pokemonAtual && pokemonEstaFavoritado(pokemonAtual.name);
    botaoFavoritar.hidden = !pokemonAtual;
    botaoFavoritar.disabled = Boolean(jaFavoritado);
    botaoFavoritar.textContent = jaFavoritado ? '♥ Favoritado' : '♡ Favoritar';
}

function removerFavorito(nomePokemon) {
    const indice = favoritos.findIndex((pokemon) => pokemon.name === nomePokemon);

    if (indice !== -1) {
        favoritos.splice(indice, 1);
        salvarFavoritos();
    }
}

function atualizarFavoritos() {
    elementos.listaFavoritos.innerHTML = '';

    if (favoritos.length === 0) {
        elementos.mensagemFavoritos.textContent = 'Você ainda não tem pokémons favoritos :(';
        return;
    }

    elementos.mensagemFavoritos.textContent = '';

    for (const pokemon of favoritos) {
        const item = document.createElement('li');
        const nomePokemon = document.createElement('span');
        const botaoRemover = document.createElement('button');

        nomePokemon.textContent = pokemon.name;
        botaoRemover.type = 'button';
        botaoRemover.className = 'botao-acao botao-remover';
        botaoRemover.textContent = '❌ Remover';

        botaoRemover.addEventListener('click', (event) => {
            event.stopPropagation();
            removerFavorito(pokemon.name);
            atualizarFavoritos();
            atualizarBotaoFavoritar();
        });

        item.append(nomePokemon, botaoRemover);
        elementos.listaFavoritos.appendChild(item);
    }
}

function criarEfeitoCoracoes(event) {
    for (let i = 0; i < 6; i++) {
        const heart = document.createElement('div');
        heart.textContent = '❤️';
        heart.className = 'heart-float';
        heart.style.left = `${event.clientX + (Math.random() - 0.5) * 60}px`;
        heart.style.top = `${event.clientY + (Math.random() - 0.5) * 60}px`;
        heart.style.setProperty('--scale', Math.random() * 0.6 + 0.6);
        heart.style.setProperty('--rotation', (Math.random() - 0.5) * 90);
        document.body.appendChild(heart);
        setTimeout(() => heart.remove(), 1000);
    }
}

botaoFavoritar.addEventListener('click', (event) => {
    if (!pokemonAtual || pokemonEstaFavoritado(pokemonAtual.name)) return;

    favoritos.push({
        id: pokemonAtual.id,
        name: pokemonAtual.name,
        sprite: pokemonAtual.sprites.front_default
    });

    salvarFavoritos();
    atualizarFavoritos();
    atualizarBotaoFavoritar();
    criarEfeitoCoracoes(event);
});

function limparResultado() {
    pokemonAtual = null;
    elementos.inputPokemon.value = '';
    elementos.sprite.removeAttribute('src');
    elementos.nome.textContent = '';
    elementos.altura.textContent = '';
    elementos.peso.textContent = '';
    elementos.experiencia.textContent = '';
    elementos.mensagemErro.textContent = '';
    atualizarBotaoFavoritar();
}

async function buscarPokemon() {
    const nomePokemon = elementos.inputPokemon.value.trim().toLowerCase();

    if (!nomePokemon) {
        elementos.mensagemErro.textContent = 'Digite o nome de um Pokémon!';
        return;
    }

    try {
        const resposta = await fetch(`https://pokeapi.co/api/v2/pokemon/${nomePokemon}`);

        if (!resposta.ok) throw new Error('Pokémon não encontrado!');

        const dados = await resposta.json();
        pokemonAtual = dados;
        elementos.mensagemErro.textContent = '';
        elementos.inputPokemon.value = '';
        elementos.sprite.src = dados.sprites.front_default;
        elementos.sprite.alt = dados.name;
        elementos.nome.textContent = `Nome: ${dados.name}`;
        elementos.altura.textContent = `Altura: ${(dados.height / 10).toFixed(1)} m`;
        elementos.peso.textContent = `Peso: ${(dados.weight / 10).toFixed(1)} kg`;
        elementos.experiencia.textContent = `Experiência Base: ${dados.base_experience}`;
        atualizarBotaoFavoritar();
    } catch (erro) {
        pokemonAtual = null;
        elementos.mensagemErro.textContent = erro.message;
        atualizarBotaoFavoritar();
    }
}

elementos.botaoBuscar.addEventListener('click', buscarPokemon);
elementos.botaoLimpar.addEventListener('click', limparResultado);

atualizarFavoritos();
