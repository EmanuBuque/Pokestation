const equipe = [];

const elementos = {
   inputPokemon: document.getElementById('pokemon'),
   botaoBuscar: document.getElementById('buscar'),
   mensagemErro: document.getElementById('mensagem-erro'),
   infoEquipe: document.getElementById('info-equipe'),
   cardEquipe: document.getElementById('equipe'),
   statusEquipe: document.getElementById('status-equipe'),
   vidaStatus: document.getElementById('status-vida'),
   ataqueStatus: document.getElementById('status-ataque'),
   defesaStatus: document.getElementById('status-defesa'),
   ataqueEspecialStatus: document.getElementById('status-ataque-especial'),
   defesaEspecialStatus: document.getElementById('status-defesa-especial'),
   velocidadeStatus: document.getElementById('status-velocidade'),
   poderTotalStatus: document.getElementById('status-poder-total'),
   contadorEquipe: document.getElementById('contador-equipe'),
};

async function buscarPokemon() {
   const input = elementos.inputPokemon.value.trim().toLowerCase();
   elementos.inputPokemon.value = '';

   if (!input) {
      elementos.mensagemErro.textContent = 'Digite o nome de um Pokémon!';
      return;
   }

   try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${input}`);

      if (!response.ok) {
         throw new Error('Pokemon não encontrado!');
      }

      const dados = await response.json();

      if (equipe.length < 6) {
         const jaExiste = equipe.some(
            pokemon => pokemon.name === dados.name
         );

         if (!jaExiste) {
            equipe.push(dados);
            console.log(equipe);
            criarCard(dados);
            calcularEquipe();
            atualizarContador();
         } else {
            elementos.infoEquipe.textContent = 'Você já tem esse Pokémon!';
         }
      } else {
         elementos.infoEquipe.textContent = 'Equipe Cheia!';
      }
   } catch (erro) {
      elementos.mensagemErro.textContent = erro.message;
   }
}

elementos.botaoBuscar.addEventListener('click', buscarPokemon);

function criarCard(pokemon) {
   const card = document.createElement('div');
   const sprite = document.createElement('img');
   const nome = document.createElement('h3');
   const hp = document.createElement('p');
   const ataque = document.createElement('p');
   const defesa = document.createElement('p');
   const ataqueEspecial = document.createElement('p');
   const defesaEspecial = document.createElement('p');
   const velocidade = document.createElement('p');
   const poderTotal = document.createElement('p');
   const excluirCard = document.createElement('button');

   sprite.src = pokemon.sprites.front_default;
   sprite.alt = pokemon.name;

   const stats = pokemon.stats;

   nome.textContent = pokemon.name;
   excluirCard.textContent = 'X';

   hp.textContent = `HP: ${stats[0].base_stat}`;
   ataque.textContent = `Ataque: ${stats[1].base_stat}`;
   defesa.textContent = `Defesa: ${stats[2].base_stat}`;
   ataqueEspecial.textContent = `Ataque Especial: ${stats[3].base_stat}`;
   defesaEspecial.textContent = `Defesa Especial: ${stats[4].base_stat}`;
   velocidade.textContent = `Velocidade: ${stats[5].base_stat}`;

   card.append(
      sprite,
      nome,
      hp,
      ataque,
      defesa,
      ataqueEspecial,
      defesaEspecial,
      velocidade,
      poderTotal,
      excluirCard
   );

   elementos.cardEquipe.appendChild(card);

   const total =
      stats[0].base_stat +
      stats[1].base_stat +
      stats[2].base_stat +
      stats[3].base_stat +
      stats[4].base_stat +
      stats[5].base_stat;

   poderTotal.textContent = `Poder Total: ${total}`;

   excluirCard.addEventListener('click', () => {
      const indice = equipe.findIndex(
         pokemonEquipe => pokemonEquipe.name === pokemon.name
      );

      equipe.splice(indice, 1);
      card.remove();
      atualizarContador();
      calcularEquipe();
   });
}

function calcularEquipe() {
   let totalHP = 0;
   let totalDefesa = 0;
   let totalAtaque = 0;
   let totalAtaqueEspecial = 0;
   let totalDefesaEspecial = 0;
   let totalVelocidade = 0;

   for (const pokemon of equipe) {
      totalHP += pokemon.stats[0].base_stat;
      totalAtaque += pokemon.stats[1].base_stat;
      totalDefesa += pokemon.stats[2].base_stat;
      totalAtaqueEspecial += pokemon.stats[3].base_stat;
      totalDefesaEspecial += pokemon.stats[4].base_stat;
      totalVelocidade += pokemon.stats[5].base_stat;
   }

   const poderTotalEquipe =
      totalHP +
      totalAtaque +
      totalDefesa +
      totalAtaqueEspecial +
      totalDefesaEspecial +
      totalVelocidade;

   elementos.statusEquipe.innerHTML = `
      <p><strong>HP da Equipe</strong><span>${totalHP}</span></p>
      <p><strong>Ataque da Equipe</strong><span>${totalAtaque}</span></p>
      <p><strong>Defesa da Equipe</strong><span>${totalDefesa}</span></p>
      <p><strong>Defesa Especial</strong><span>${totalDefesaEspecial}</span></p>
      <p><strong>Ataque Especial</strong><span>${totalAtaqueEspecial}</span></p>
      <p><strong>Velocidade da Equipe</strong><span>${totalVelocidade}</span></p>
      <p><strong>Poder Total da Equipe</strong><span>${poderTotalEquipe}</span></p>
   `;

   let statusVida = '';
   elementos.vidaStatus.classList.remove('fraco', 'mediano', 'forte');

   if (totalHP < 300) {
      statusVida = 'Vida Fraca!';
      elementos.vidaStatus.classList.add('fraco');
   } else if (totalHP >= 300 && totalHP <= 550) {
      statusVida = 'Vida Mediana!';
      elementos.vidaStatus.classList.add('mediano');
   } else {
      statusVida = 'Vida Forte!';
      elementos.vidaStatus.classList.add('forte');
   }

   elementos.vidaStatus.textContent = `Status Vida Equipe: ${statusVida}`;

   let statusAtaque = '';
   elementos.ataqueStatus.classList.remove('fraco', 'mediano', 'forte');

   if (totalAtaque < 300) {
      statusAtaque = 'Ataque Fraco!';
      elementos.ataqueStatus.classList.add('fraco');
   } else if (totalAtaque >= 300 && totalAtaque <= 550) {
      statusAtaque = 'Ataque Mediano!';
      elementos.ataqueStatus.classList.add('mediano');
   } else {
      statusAtaque = 'Ataque Forte';
      elementos.ataqueStatus.classList.add('forte');
   }

   elementos.ataqueStatus.textContent = `Status Ataque Equipe: ${statusAtaque}`;

   let statusDefesa = '';
   elementos.defesaStatus.classList.remove('fraco', 'mediano', 'forte');

   if (totalDefesa < 300) {
      statusDefesa = 'Defesa Fraca!';
      elementos.defesaStatus.classList.add('fraco');
   } else if (totalDefesa >= 300 && totalDefesa <= 550) {
      statusDefesa = 'Defesa Mediana!';
      elementos.defesaStatus.classList.add('mediano');
   } else {
      statusDefesa = 'Defesa Forte!';
      elementos.defesaStatus.classList.add('forte');
   }

   elementos.defesaStatus.textContent = `Status Defesa Equipe: ${statusDefesa}`;

   let statusAtaqueEspecial = '';
   elementos.ataqueEspecialStatus.classList.remove('fraco', 'mediano', 'forte');

   if (totalAtaqueEspecial < 300) {
      statusAtaqueEspecial = 'Ataque Especial Fraco!';
      elementos.ataqueEspecialStatus.classList.add('fraco');
   } else if (totalAtaqueEspecial >= 300 && totalAtaqueEspecial <= 550) {
      statusAtaqueEspecial = 'Ataque especial Mediano!';
      elementos.ataqueEspecialStatus.classList.add('mediano');
   } else {
      statusAtaqueEspecial = 'Ataque especial forte!';
      elementos.ataqueEspecialStatus.classList.add('forte');
   }

   elementos.ataqueEspecialStatus.textContent =
      `Status Ataque especial Equipe: ${statusAtaqueEspecial}`;

   let statusDefesaEspecial = '';
   elementos.defesaEspecialStatus.classList.remove('fraco', 'mediano', 'forte');

   if (totalDefesaEspecial < 300) {
      statusDefesaEspecial = 'Defesa Especial Fraca!';
      elementos.defesaEspecialStatus.classList.add('fraco');
   } else if (totalDefesaEspecial >= 300 && totalDefesaEspecial <= 550) {
      statusDefesaEspecial = 'Defesa Especial Mediana!';
      elementos.defesaEspecialStatus.classList.add('mediano');
   } else {
      statusDefesaEspecial = 'Defesa Especial Forte!';
      elementos.defesaEspecialStatus.classList.add('forte');
   }

   elementos.defesaEspecialStatus.textContent =
      `Status Defesa Especial Equipe: ${statusDefesaEspecial}`;

   let statusVelocidade = '';
   elementos.velocidadeStatus.classList.remove('fraco', 'mediano', 'forte');

   if (totalVelocidade < 300) {
      statusVelocidade = 'Velocidade Fraca!';
      elementos.velocidadeStatus.classList.add('fraco');
   } else if (totalVelocidade >= 300 && totalVelocidade <= 550) {
      statusVelocidade = 'Velocidade Mediana!';
      elementos.velocidadeStatus.classList.add('mediano');
   } else {
      statusVelocidade = 'Velocidade Forte!';
      elementos.velocidadeStatus.classList.add('forte');
   }

   elementos.velocidadeStatus.textContent =
      `Status Velocidade Equipe: ${statusVelocidade}`;

   let statusGeral = '';
   elementos.poderTotalStatus.classList.remove('fraco', 'mediano', 'forte');

   if (poderTotalEquipe < 1500) {
      statusGeral = 'Equipe Fraca!';
      elementos.poderTotalStatus.classList.add('fraco');
   } else if (poderTotalEquipe >= 1500 && poderTotalEquipe <= 2500) {
      statusGeral = 'Equipe Mediana';
      elementos.poderTotalStatus.classList.add('mediano');
   } else {
      statusGeral = 'Equipe forte!';
      elementos.poderTotalStatus.classList.add('forte');
   }

   elementos.poderTotalStatus.textContent =
      `Status Poder Total Equipe: ${statusGeral}`;
}

function atualizarContador() {
   elementos.contadorEquipe.textContent = `Equipe: ${equipe.length}/6`;
}


