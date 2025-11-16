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

// Inicia o jogo
const game = new Phaser.Game(config);

// --- LÓGICA DE BOTÕES DINÂMICOS ---
// (Mapeia o nome do comando ao ID do botão no HTML)
const mapaBotoes = {
  'if_perigo_frente': 'btn-if_perigo_frente',
  'else': 'btn-else',
  'fim_se': 'btn-fim_se',
  'esperar': 'btn-esperar',
  'saltar': 'btn-saltar',
  'cavar': 'btn-cavar',
  'direita': 'btn-direita',
  'esquerda': 'btn-esquerda',
  'cima': 'btn-cima',
  'baixo': 'btn-baixo'
};

// Quando a cena estiver PRONTA
game.events.on('scene-ready', (cena) => {
  console.log('EVENTO "scene-ready" CAPTURADO. Cena ativa agora é:', cena.scene.key);
  gameManager.cenaAtiva = cena;
  
  atualizarStatusUI(); 
  
  // 1. Esconde todos os botões
  Object.values(mapaBotoes).forEach(idBotao => {
    const btn = document.getElementById(idBotao);
    if (btn) btn.style.display = 'none';
  });

  // 2. Mostra os botões permitidos (COM LÓGICA DE HERÓI)
  if (cena.scene.key === 'NivelScene' && cena.dadosNivel) {
    const comandosPermitidos = cena.dadosNivel.comandosDisponiveis || [];
    
    // ★ INÍCIO DA LÓGICA DE FILTRO ★
    comandosPermitidos.forEach(nomeComando => {
      const idBotao = mapaBotoes[nomeComando];
      if (!idBotao) return; // Comando não mapeado
      
      const btn = document.getElementById(idBotao);
      if (!btn) return; // Botão HTML não encontrado

      let mostrarBotao = false;

      // --- Verifica Habilidades Específicas ---
      if (nomeComando === 'cavar') {
        if (gameManager.heroiAtivo === 'raposa') {
          mostrarBotao = true;
        }
      } else if (nomeComando === 'saltar') {
        if (gameManager.heroiAtivo === 'coelho') {
          mostrarBotao = true;
        }
      } else {
        // --- É um comando normal (direita, if, else, etc.) ---
        // Todos os heróis podem usar comandos normais.
        mostrarBotao = true;
      }
      
      // --- Mostra o botão se o filtro aprovou ---
      if (mostrarBotao) {
        btn.style.display = 'block';
      }
    });
    // ★ FIM DA LÓGICA DE FILTRO ★
  }
});

// --- LÓGICA DE CARREGAMENTO ---
const urlParams = new URLSearchParams(window.location.search);
const nivelParaCarregar = parseInt(urlParams.get('nivel'), 10) || 1;
console.log(`Carregando Nível ID: ${nivelParaCarregar}`);
game.scene.start('NivelScene', { nivelId: nivelParaCarregar });