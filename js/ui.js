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
  // ★ MODIFICADO: Removemos buildState e currentIfBlock
  // Esta pilha (stack) guardará o [bloco, estado] de cada IF aninhado
  contextStack: [], 
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

  // Helper: Pega o contexto atual [bloco, estado] ou null
  function getCurrentContext() {
    if (gameManager.contextStack.length === 0) return null;
    return gameManager.contextStack[gameManager.contextStack.length - 1];
  }

  // Helper: Pega o ARRAY (comandos, then, ou else) onde o próximo comando deve ser adicionado
  function getTargetArray() {
    const context = getCurrentContext();
    if (!context) {
      return gameManager.comandos; // Estamos no Root
    }
    
    const [block, state] = context;
    if (state === 'building_if') {
      return block.then;
    } else if (state === 'building_else') {
      return block.else;
    }
    return gameManager.comandos; // Fallback
  }

  // --- Lógica de Adição ---

  // 1. É um comando IF?
  if (cmd.startsWith('if_')) {
    const newIfBlock = { type: 'if', condition: cmd, then: [], else: [] }; 
    
    const targetArray = getTargetArray();
    targetArray.push(newIfBlock); // Adiciona o IF ao array 'then' do pai (ou ao root)

    // ★ PUSH: Adiciona o novo bloco e seu estado ('building_if') à pilha
    gameManager.contextStack.push([newIfBlock, 'building_if']);

  // 2. É um ELSE?
  } else if (cmd === 'else') {
    const context = getCurrentContext();
    if (context && context[1] === 'building_if') {
      // Muda o estado do contexto ATUAL de 'if' para 'else'
      context[1] = 'building_else';
    }

  // 3. É um FIM-SE?
  } else if (cmd === 'fim_se') {
    const context = getCurrentContext();
    if (context) {
      // ★ POP: Remove o contexto atual (o bloco que acabamos de fechar)
      gameManager.contextStack.pop();
    }

  // 4. É um comando normal (direita, cavar, etc.)
  } else {
    const targetArray = getTargetArray();
    targetArray.push(cmd);
  }
  
  atualizarTexto(); // Sempre atualiza a UI
}


function atualizarTexto() {
  const listaDiv = document.getElementById('lista-comandos');
  listaDiv.innerHTML = '';

  // 1. Descobre qual é o bloco que está "aberto" na pilha agora
  let activeBlock = null;
  if (gameManager.contextStack.length > 0) {
    activeBlock = gameManager.contextStack[gameManager.contextStack.length - 1][0];
  }

  function renderizarLista(lista, nivelIndentacao) {
    lista.forEach((cmd, i) => {
      let numLinha = (nivelIndentacao === 0) ? `${i + 1}. ` : '&nbsp;&nbsp;&nbsp;&nbsp;L ';
      let classeCss = (nivelIndentacao > 0) ? `aninhado-${nivelIndentacao}` : '';

      // --- Comandos de Texto (Direita, Cavar, etc.) ---
      if (typeof cmd === 'string') {
        listaDiv.innerHTML += `<p class="${classeCss}">${numLinha}${cmd.toUpperCase()}</p>`;
      
      // --- Blocos Condicionais (IF) ---
      } else if (typeof cmd === 'object' && cmd.type === 'if') {
        
        // Verifica se ESTE bloco é o que está sendo editado agora
        const isBlockActive = (cmd === activeBlock);

        // 1. Renderiza o TOPO do IF
        let textoCondicao = 'SE (CONDIÇÃO DESCONHECIDA) FAÇA:';
        if (cmd.condition === 'if_inimigo_frente') textoCondicao = 'SE (INIMIGO À FRENTE) FAÇA:';
        else if (cmd.condition === 'if_risco_frente') textoCondicao = 'SE (RISCO À FRENTE) FAÇA:';
        else if (cmd.condition === 'if_fogo_frente') textoCondicao = 'SE (FOGO À FRENTE) FAÇA:';
        else if (cmd.condition === 'if_elefante_cheio') textoCondicao = 'SE (ELEFANTE CHEIO) FAÇA:';
        
        // (Opcional) Adiciona uma cor diferente se estiver ativo
        let estiloExtra = isBlockActive ? 'border-left: 2px solid #00bcd4; padding-left: 5px;' : '';
        
        listaDiv.innerHTML += `<p class="bloco ${classeCss}" style="${estiloExtra}">${numLinha}${textoCondicao}</p>`;

        // 2. Renderiza o conteúdo (THEN)
        renderizarLista(cmd.then, nivelIndentacao + 1);

        // 3. Renderiza o SENÃO (ELSE), se houver
        if (cmd.else.length > 0) {
          listaDiv.innerHTML += `<p class="bloco ${classeCss}" style="${estiloExtra}">${numLinha}SENÃO (ELSE):</p>`;
          renderizarLista(cmd.else, nivelIndentacao + 1);
        }

        // 4. ★ A MÁGICA DO FEEDBACK AQUI ★
        // Só desenha o texto "FIM-SE" se o bloco NÃO estiver mais ativo (já foi fechado)
        if (!isBlockActive) {
           listaDiv.innerHTML += `<p class="bloco ${classeCss}">${numLinha}FIM-SE</p>`;
        } else {
           // Se estiver ativo, mostra um placeholder indicando que falta fechar
           listaDiv.innerHTML += `<p class="${classeCss}" style="color: #FFFF00; font-style: italic;">&nbsp;&nbsp;... (Aguardando Fim-Se)</p>`;
        }
      }
    });
  }

  renderizarLista(gameManager.comandos, 0);
  listaDiv.scrollTop = listaDiv.scrollHeight;
}

function executar() {
  // ★ MODIFICADO: Verifica a nova pilha ★
  if (gameManager.contextStack.length > 0) {
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
  
  // ★ MODIFICADO: Limpa a pilha ★
  gameManager.contextStack = [];
  
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
} // <--- APENAS UMA chave aqui. Apaga a chave extra se houver outra abaixo.