// --- CONFIGURAÇÕES DO PHASER ---
const config = {
  type: Phaser.AUTO,
  width: MAP_SIZE, 
  height: MAP_SIZE, 
  backgroundColor: 'transparent',
  physics: { default: 'arcade' },
  parent: 'phaser-game',
  // 1. ADICIONA A NOVA CENA
  scene: [NivelScene, ConclusaoScene, GameOverScene] 
};

// --- CONTROLE GLOBAL DO JOGO ---
const gameManager = {
  comandos: [],
  index: 0,
  executando: false,
  cenaAtiva: null,
  
  // 2. NOVOS ESTADOS GLOBAIS
  vidas: 4,
  bateria: 5
};

// Inicia o jogo
const game = new Phaser.Game(config);

// Quando a cena estiver PRONTA, ela se registra e atualiza o HUD
game.events.on('scene-ready', (cena) => {
  console.log('EVENTO "scene-ready" CAPTURADO. Cena ativa agora é:', cena.scene.key);
  gameManager.cenaAtiva = cena;
  
  // 3. ATUALIZA O HUD TODA VEZ QUE A CENA MUDA
  atualizarStatusUI();
});

// Inicia o primeiro nível
game.scene.start('NivelScene', { nivelId: 1 });


// --- 4. NOVA FUNÇÃO: ATUALIZAR O HUD ---
function atualizarStatusUI() {
  const statusDiv = document.getElementById('game-status');
  if (!statusDiv) return; // Sai se o elemento não existir

  // --- HTML das Vidas ---
  let vidasHtml = '<div id="status-vidas">';
  for (let i = 0; i < 4; i++) {
    // Se 'i' for menor que as vidas atuais, opacidade 1 (cheio), senão 0.3 (vazio)
    const opacidade = (i < gameManager.vidas) ? '1' : '0.3';
    vidasHtml += `<img src="assets/coracao.png" style="opacity: ${opacidade};">`;
  }
  vidasHtml += '</div>';

  // --- HTML da Bateria ---
  let bateriaHtml = '<div id="status-bateria">';
  for (let i = 0; i < 5; i++) {
    const opacidade = (i < gameManager.bateria) ? '1' : '0.3';
    bateriaHtml += `<img src="assets/bateria.png" style="opacity: ${opacidade};">`;
  }
  bateriaHtml += '</div>';

  // Atualiza o HTML do HUD
  statusDiv.innerHTML = vidasHtml + bateriaHtml;
}


// --- FUNÇÕES DE CONTROLE DA UI (HTML) ---

function adicionarComando(cmd) {
  // LOG 2: Verifica se o clique no botão foi registrado
  console.log('Botão clicado:', cmd);

  // 1. Garante que a cena existe
  if (!gameManager.cenaAtiva) {
    // LOG 3: Se a cena for nula, este erro aparecerá
    console.error('ERRO: gameManager.cenaAtiva é nulo. A cena ainda não carregou?');
    return; 
  }

  // LOG 4: Mostra qual cena está ativa no momento do clique
  console.log('Cena ativa checada:', gameManager.cenaAtiva.scene.key);

  // 2. CORREÇÃO:
  // Só permite adicionar comandos se a cena ativa for a 'NivelScene'.
  if (gameManager.cenaAtiva.scene.key !== 'NivelScene') {
    // LOG 5: Se a cena errada estiver ativa (ex: ConclusaoScene), este aviso aparecerá
    console.warn('AVISO: Comando bloqueado. A cena ativa não é "NivelScene".');
    return;
  }
  
  // LOG 6: Se tudo deu certo, o comando é adicionado
  console.log('Comando adicionado:', cmd);
  gameManager.comandos.push(cmd);
  atualizarTexto();
}

function atualizarTexto() {
  const listaDiv = document.getElementById('lista-comandos');
  listaDiv.innerHTML = '';
  
  if (!gameManager.comandos) gameManager.comandos = []; 

  gameManager.comandos.forEach((cmd, i) => {
    const comandoEl = document.createElement('p');
    comandoEl.innerText = `${i + 1}. ${cmd.toUpperCase()}`;
    listaDiv.appendChild(comandoEl);
  });
  
  listaDiv.scrollTop = listaDiv.scrollHeight;
}

function executar() {
  if (gameManager.comandos.length === 0) return;
  if (gameManager.cenaAtiva && gameManager.cenaAtiva.scene.key !== 'NivelScene') return;
  
  gameManager.index = 0;
  gameManager.executando = true;
}

// Arquivo: main.js

function executar() {
  // 1. Verifica se pode executar
  if (gameManager.comandos.length === 0) return;
  if (!gameManager.cenaAtiva || gameManager.cenaAtiva.scene.key !== 'NivelScene') return;

  // 2. RESETA A POSIÇÃO DO ROBÔ
  // Chama a função da NivelScene que volta o robô ao início
  gameManager.cenaAtiva.resetarCena();

  // 3. RESETA O "POOL DE MOVIMENTOS" (o índice)
  // Define que a execução começará do primeiro item (índice 0)
  gameManager.index = 0;
  
  // 4. Inicia a execução
  gameManager.executando = true;
}

function resetar() {
  // 1. Limpa a lógica de comandos (sempre)
  gameManager.comandos = [];
  gameManager.index = 0;
  gameManager.executando = false;
  atualizarTexto(); // Limpa a UI
  
  // 5. RESETA A BATERIA AQUI
  gameManager.bateria = 5;
  atualizarStatusUI(); // Atualiza o HUD
  
  // 2. Verifica qual cena está ativa
  if (gameManager.cenaAtiva) {
    if (gameManager.cenaAtiva.scene.key === 'NivelScene') {
      gameManager.cenaAtiva.resetarCena();
    } else if (gameManager.cenaAtiva.scene.key === 'ConclusaoScene') {
      const nivelParaResetar = gameManager.cenaAtiva.currentLevelId;
      gameManager.cenaAtiva.scene.stop('ConclusaoScene');
      game.scene.start('NivelScene', { nivelId: nivelParaResetar });
    }
    // Se for 'GameOverScene', o botão 'resetar' não deve fazer nada
  }
}