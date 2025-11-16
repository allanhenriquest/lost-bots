// ARQUIVO: js/ui.js (NOVO)

// --- CONTROLE GLOBAL DO JOGO ---
// (Movido do main.js)
const gameManager = {
  comandos: [], 
  index: 0,
  executando: false,
  cenaAtiva: null,
  vidas: 4,
  bateria: 5,
  buildState: 'root',
  currentIfBlock: null,
  heroiAtivo: 'robo' 
};

// --- FUNÇÃO DE ATUALIZAR HUD ---
function atualizarStatusUI() {
  const statusDiv = document.getElementById('hud-container');
  if (!statusDiv) return;

  // 1. Lógica das Vidas (Permanece igual)
  let vidasHtml = '<div id="status-vidas">';
  for (let i = 0; i < 4; i++) {
    const opacidade = (i < gameManager.vidas) ? '1' : '0.3';
    vidasHtml += `<img src="assets/coracao.png" style="opacity: ${opacidade};">`;
  }
  vidasHtml += '</div>';

  // ★ 2. LÓGICA DA BATERIA (MODIFICADA) ★
  // Mostra um ícone e o contador numérico
  let bateriaHtml = '<div id="status-bateria-numerico">';
  bateriaHtml += '<img src="assets/bateria.png">'; // Ícone
  bateriaHtml += `<span>${gameManager.bateria}</span>`; // O número
  bateriaHtml += '</div>';

  // Combina os dois HTMLs
  statusDiv.innerHTML = vidasHtml + bateriaHtml;
}

// --- FUNÇÃO DE SELEÇÃO DE HERÓI ---
function selecionarHeroi(nomeHeroi) {
  gameManager.heroiAtivo = nomeHeroi;
  
  document.getElementById('hero-robo').classList.remove('ativo');
  document.getElementById('hero-coelho').classList.remove('ativo');
  document.getElementById('hero-raposa').classList.remove('ativo');
  document.getElementById(`hero-${nomeHeroi}`).classList.add('ativo');
  
  if (gameManager.cenaAtiva && gameManager.cenaAtiva.scene.key === 'NivelScene') {
    resetar(); 
    gameManager.cenaAtiva.scene.restart({ nivelId: gameManager.cenaAtiva.dadosNivel.numericId });
  }
}

// --- FUNÇÕES DE CONTROLO DE COMANDOS ---
function adicionarComando(cmd) {
  if (!gameManager.cenaAtiva || gameManager.cenaAtiva.scene.key !== 'NivelScene') {
    return;
  }
  
  if (cmd === 'if_perigo_frente') {
    if (gameManager.buildState !== 'root') return; 
    const newIfBlock = { type: 'if', condition: 'perigo_frente', then: [], else: [] };
    gameManager.comandos.push(newIfBlock);
    gameManager.currentIfBlock = newIfBlock;
    gameManager.buildState = 'building_if';
  } else if (cmd === 'else') {
    if (gameManager.buildState === 'building_if') {
      gameManager.buildState = 'building_else';
    }
  } else if (cmd === 'fim_se') {
    if (gameManager.buildState === 'building_if' || gameManager.buildState === 'building_else') {
      gameManager.buildState = 'root';
      gameManager.currentIfBlock = null;
    }
  } else {
    if (gameManager.buildState === 'root') {
      gameManager.comandos.push(cmd);
    } else if (gameManager.buildState === 'building_if') {
      gameManager.currentIfBlock.then.push(cmd);
    } else if (gameManager.buildState === 'building_else') {
      gameManager.currentIfBlock.else.push(cmd);
    }
  }
  atualizarTexto();
}

function atualizarTexto() {
  const listaDiv = document.getElementById('lista-comandos');
  listaDiv.innerHTML = '';
  
  function renderizarLista(lista, nivelIndentacao) {
    lista.forEach((cmd, i) => {
      let numLinha = (nivelIndentacao === 0) ? `${i + 1}. ` : '&nbsp;&nbsp;&nbsp;&nbsp;L ';
      let classeCss = (nivelIndentacao > 0) ? `aninhado-${nivelIndentacao}` : '';
      
      if (typeof cmd === 'string') {
        listaDiv.innerHTML += `<p class="${classeCss}">${numLinha}${cmd.toUpperCase()}</p>`;
      } else if (typeof cmd === 'object' && cmd.type === 'if') {
        listaDiv.innerHTML += `<p class="bloco ${classeCss}">${numLinha}SE (INIMIGO À FRENTE) FAÇA:</p>`;
        renderizarLista(cmd.then, nivelIndentacao + 1);
        if (cmd.else.length > 0) {
          listaDiv.innerHTML += `<p class="bloco ${classeCss}">${numLinha}SENÃO (ELSE):</p>`;
          renderizarLista(cmd.else, nivelIndentacao + 1);
        }
        listaDiv.innerHTML += `<p class="bloco ${classeCss}">${numLinha}FIM-SE</p>`;
      }
    });
  }
  
  renderizarLista(gameManager.comandos, 0);
  
  if (gameManager.buildState === 'building_if') {
    listaDiv.innerHTML += `<p class="bloco">(Construindo bloco SE...)</p>`;
  } else if (gameManager.buildState === 'building_else') {
    listaDiv.innerHTML += `<p class="bloco">(Construindo bloco SENÃO...)</p>`;
  }
  
  listaDiv.scrollTop = listaDiv.scrollHeight;
}

function executar() {
  if (gameManager.buildState !== 'root') {
    console.warn("Complete o bloco SE/SENÃO/FIM-SE antes de executar.");
    return;
  }
  if (gameManager.comandos.length === 0) return;
  if (!gameManager.cenaAtiva || gameManager.cenaAtiva.scene.key !== 'NivelScene') return;

  gameManager.cenaAtiva.resetarCena();
  gameManager.bateria = 5; 
  atualizarStatusUI(); 
  gameManager.index = 0;
  gameManager.executando = true;
}

function resetar() {
  gameManager.comandos = [];
  gameManager.index = 0;
  gameManager.executando = false;
  gameManager.buildState = 'root';
  gameManager.currentIfBlock = null; 
  
  atualizarTexto(); 
  
  gameManager.bateria = 5;
  atualizarStatusUI(); 
  
  if (gameManager.cenaAtiva) {
    if (gameManager.cenaAtiva.scene.key === 'NivelScene') {
      gameManager.cenaAtiva.resetarCena();
    } else if (gameManager.cenaAtiva.scene.key === 'ConclusaoScene') {
      const nivelParaResetar = gameManager.cenaAtiva.currentLevelId;
      gameManager.cenaAtiva.scene.stop('ConclusaoScene');
      game.scene.start('NivelScene', { nivelId: nivelParaResetar });
    }
  }
}