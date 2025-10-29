// ARQUIVO: js/main.js (COMPLETO E ATUALIZADO)

// --- CONFIGURAÇÕES DO PHASER ---
const config = {
  type: Phaser.AUTO,
  width: MAP_SIZE, 
  height: MAP_SIZE, 
  backgroundColor: 'transparent',
  physics: { default: 'arcade' },
  parent: 'phaser-game',
  scene: [NivelScene, ConclusaoScene, GameOverScene] 
};

// --- CONTROLE GLOBAL DO JOGO ---
const gameManager = {
  comandos: [],
  index: 0,
  executando: false,
  cenaAtiva: null,
  vidas: 4,
  bateria: 5
};

// Inicia o jogo
const game = new Phaser.Game(config);

// Quando a cena estiver PRONTA, ela se registra e atualiza o HUD
game.events.on('scene-ready', (cena) => {
  console.log('EVENTO "scene-ready" CAPTURADO. Cena ativa agora é:', cena.scene.key);
  gameManager.cenaAtiva = cena;
  
  atualizarStatusUI();
});


// --- FUNÇÃO PARA ATUALIZAR O HUD (MODIFICADA) ---
// (Esta função agora aponta para o #hud-container)
function atualizarStatusUI() {
  const statusDiv = document.getElementById('hud-container');
  if (!statusDiv) return; // Sai se o elemento não existir

  // --- HTML das Vidas ---
  let vidasHtml = '<div id="status-vidas">';
  for (let i = 0; i < 4; i++) {
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
  if (!gameManager.cenaAtiva) {
    console.error('ERRO: gameManager.cenaAtiva é nulo.');
    return; 
  }
  if (gameManager.cenaAtiva.scene.key !== 'NivelScene') {
    console.warn('AVISO: Comando bloqueado. A cena ativa não é "NivelScene".');
    return;
  }
  
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
  if (!gameManager.cenaAtiva || gameManager.cenaAtiva.scene.key !== 'NivelScene') return;

  gameManager.cenaAtiva.resetarCena();
  gameManager.index = 0;
  gameManager.executando = true;
}

function resetar() {
  gameManager.comandos = [];
  gameManager.index = 0;
  gameManager.executando = false;
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

// --- LÓGICA DE INICIALIZAÇÃO (MODIFICADA) ---
// (Isto substitui o "game.scene.start('NivelScene', { nivelId: 1 });" original)

// 1. Pega os parâmetros do URL (ex: ?nivel=3)
const urlParams = new URLSearchParams(window.location.search);

// 2. Pega o valor 'nivel', converte para número, ou usa 1 se for nulo
const nivelParaCarregar = parseInt(urlParams.get('nivel'), 10) || 1;

console.log(`Carregando Nível ID: ${nivelParaCarregar}`);

// 3. Inicia o jogo no nível correto
game.scene.start('NivelScene', { nivelId: nivelParaCarregar });