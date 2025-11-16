// ARQUIVO: js/NivelScene.js (COMPLETO E CORRIGIDO)

class NivelScene extends Phaser.Scene {

  constructor() {
    super('NivelScene');
    this.dadosNivel = null;
    this.robo = null;
    this.portaSprite = null; 
    this.obstaculos = null;
    this.proximoPassoTimer = null;
    this.inimigos = null;
    this.caminhos = null;
    this.botoes = null;
    this.recargas = null;
    this.heroiAtivo = 'robo';
    this.isSubterraneo = false;
  }

  init(data) {
    const nivelId = data.nivelId || 1; 
    this.dadosNivel = NIVEIS_DATA[nivelId];
    gameManager.bateria = 5; 
    this.heroiAtivo = gameManager.heroiAtivo || 'robo';
    this.isSubterraneo = false;
  }

  preload() {
    // --- Sprites Clássicos ---
    this.load.image('robo', 'assets/robo.png');
    this.load.image('porta', 'assets/porta.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('coracao', 'assets/coracao.png');
    this.load.image('bateria', 'assets/bateria.png');
    this.load.image('parede', 'assets/parede.png');
    
    // --- Sprites dos Inimigos (Módulo 2) ---
    this.load.image('sapo', 'assets/sapo.png'); 
    this.load.image('tigre', 'assets/tigre.png');
    this.load.image('lobo', 'assets/lobo.png');
    this.load.image('path', 'assets/path.png');

    // --- Sprites (Módulo 1 Avançado) ---
    this.load.image('recarga', 'assets/recarga.png');
    this.load.image('porta_desligada', 'assets/porta_desligada.png');
    this.load.image('botao_desligado', 'assets/botao_desligado.png');
    this.load.image('botao_ligado', 'assets/botao_ligado.png');
    
    // --- Sprites (Heróis) ---
    this.load.image('coelho', 'assets/coelho.png');
    this.load.image('raposa', 'assets/raposa.png');
    this.load.image('raposa_enterrada', 'assets/raposa_enterrada.png');
  }

  create() {
    this.obstaculos = this.physics.add.staticGroup();
    this.caminhos = this.physics.add.staticGroup();
    this.inimigos = this.physics.add.group();
    this.botoes = this.physics.add.staticGroup();
    this.recargas = this.physics.add.staticGroup();

    this.desenharGrid();
    this.posicionarItens(); 
    
    atualizarStatusUI();
    this.game.events.emit('scene-ready', this);
    
    this.mostrarBriefing();
  }

  desenharGrid() {
    for (let i = 0; i < GRID_COUNT; i++) {
      for (let j = 0; j < GRID_COUNT; j++) {
        const cor = (i + j) % 2 === 0 ? 0x1A4A5A : 0x153C4A;
        this.add.rectangle(
          i * GRID_SIZE + GRID_SIZE / 2,
          j * GRID_SIZE + GRID_SIZE / 2,
          GRID_SIZE - 2,
          GRID_SIZE - 2,
          cor
        );
      }
    }
  }

  // ★ FUNÇÃO 'posicionarItens' COMPLETA ★
  posicionarItens() {
    const getPos = (cell) => cell * GRID_SIZE + GRID_SIZE / 2;
    const { roboPos, portaPos, obstaculos, caminhoInimigo, inimigos, botoes, recargas } = this.dadosNivel;

    // 1. Desenha o Caminho do Inimigo
    if (caminhoInimigo) {
      caminhoInimigo.forEach(pos => {
        this.caminhos.create(getPos(pos.x), getPos(pos.y), 'path')
          .setScale(SPRITE_SCALE)
          .setOrigin(0.5, 0.5)
          .refreshBody();
      });
    }

    // 2. Desenha Obstáculos (Paredes)
    if (obstaculos) {
      obstaculos.forEach(obs => {
        this.obstaculos.create(getPos(obs.x), getPos(obs.y), 'parede')
          .setScale(SPRITE_SCALE)
          .setOrigin(0.5, 0.5)
          .refreshBody(); 
      });
    }

    // 3. Desenha Recargas
    if (recargas) {
      recargas.forEach(rec => {
        const recargaSprite = this.recargas.create(getPos(rec.x), getPos(rec.y), 'recarga')
          .setScale(SPRITE_SCALE).setOrigin(0.5, 0.5).refreshBody();
        recargaSprite.setData('usado', false);
        recargaSprite.setData('valor', rec.valor || 3); 
      });
    }
    
    // 4. Desenha Botões
    if (botoes) {
      botoes.forEach(btn => {
        const botaoSprite = this.botoes.create(getPos(btn.x), getPos(btn.y), 'botao_desligado')
          .setScale(SPRITE_SCALE).setOrigin(0.5, 0.5).refreshBody();
        botaoSprite.setData('ligado', false);
      });
    }
    
    // 5. Desenha Inimigos
    if (inimigos) {
      inimigos.forEach(ini => {
        let texturaInimigo = ini.tipo;
        if (ini.tipo === 'sentinela_teleport') {
            texturaInimigo = 'sapo'; 
        }
        const inimigoSprite = this.inimigos.create(getPos(ini.pos.x), getPos(ini.pos.y), texturaInimigo);
        inimigoSprite.setScale(SPRITE_SCALE).setOrigin(0.5, 0.5);
        inimigoSprite.setData('tipo', ini.tipo);
        inimigoSprite.setData('posInicial', ini.pos);
      });
    }
    
    // 6. Desenha a Porta
    const temBotoes = (botoes && botoes.length > 0);
    const portaTextura = temBotoes ? 'porta_desligada' : 'porta';
    this.portaSprite = this.physics.add.sprite(getPos(portaPos.x), getPos(portaPos.y), portaTextura);
    this.portaSprite.setScale(SPRITE_SCALE).setOrigin(0.5, 0.5);
    this.portaSprite.setData('ativa', !temBotoes);
    
    // 7. Desenha o Herói
    this.robo = this.physics.add.sprite(getPos(roboPos.x), getPos(roboPos.y), this.heroiAtivo);
    this.robo.setScale(SPRITE_SCALE).setOrigin(0.5, 0.5);
  }

  // ★ FUNÇÃO 'update' CORRIGIDA (CUSTO E LÓGICA 'IF') ★
  update() {
    if (!gameManager.executando) {
      return; 
    }
    
    if (gameManager.index >= gameManager.comandos.length) {
      gameManager.executando = false;
      this.proximoPassoTimer = this.time.delayedCall(1000, () => {
        if (this.scene.isActive('NivelScene')) {
          this.penalizarVida('CAMINHO INCORRETO');
          this.proximoPassoTimer = null;
        }
      });
      return;
    }
    
    const cmd = gameManager.comandos[gameManager.index];
    
    let custo = 0; // Padrão 0 (Grátis para IF, ESPERAR, CAVAR)
    
    if (typeof cmd === 'string') {
        if (['direita', 'esquerda', 'cima', 'baixo'].includes(cmd)) {
            custo = 1;
        } 
        else if (cmd === 'saltar') {
            custo = 2;
        }
    }
    
    if (gameManager.bateria < custo) {
      gameManager.executando = false;
      this.penalizarVida('SEM BATERIA');
      return; 
    }
    
    gameManager.bateria -= custo; 
    atualizarStatusUI(); 

    gameManager.index++; 
    let comandoReal = null;
    let pularTurnoInimigo = false; // ★ VALOR PADRÃO É 'false'

    if (typeof cmd === 'string') {
      comandoReal = cmd;
    } else if (typeof cmd === 'object' && cmd.type === 'if') {
      const condicaoOk = this.checarCondicao(cmd.condition);
      let comandosParaInjetar = condicaoOk ? cmd.then : cmd.else;
      gameManager.comandos.splice(gameManager.index, 1, ...comandosParaInjetar);
      comandoReal = null; 
      // ★ A LINHA 'pularTurnoInimigo = true' FOI REMOVIDA ★
    }
    
    if (!comandoReal) {
      gameManager.executando = false; 
      let delay = pularTurnoInimigo ? 0 : 500;
      this.proximoPassoTimer = this.time.delayedCall(delay, () => {
        gameManager.executando = true; 
        this.proximoPassoTimer = null;
      });
      return;
    }

    const resultadoMovimento = this.mover(comandoReal);

    if (resultadoMovimento === 'falha_parede') {
      gameManager.executando = false;
      this.penalizarVida('COLISÃO');
      return; 
    }
    if (resultadoMovimento === 'falha_inimigo') {
      gameManager.executando = false;
      this.penalizarVida('CAPTURADO');
      return; 
    }
    
    if (resultadoMovimento === 'sucesso' || resultadoMovimento === 'sucesso_cavar') {
      this.checarInteracoesTile();
    }
    
    if (this.checarVitoria()) {
      gameManager.executando = false; 
      return;
    }
    
    if (!pularTurnoInimigo) {
        this.moverInimigos();
    }
    
    if (this.checarColisaInimigo(this.robo, this.inimigos, true)) {
       gameManager.executando = false;
       this.penalizarVida('CAPTURADO');
       return;
    }

    gameManager.executando = false; 
    this.proximoPassoTimer = this.time.delayedCall(500, () => {
      gameManager.executando = true; 
      this.proximoPassoTimer = null;
    });
  }

  // ★ FUNÇÃO 'mover' CORRIGIDA (PERMITE MOVIMENTO DE TODOS) ★
  mover(cmd) {
    if (cmd === 'saltar') {
      return 'sucesso'; 
    }
    if (cmd === 'cavar') {
      this.isSubterraneo = !this.isSubterraneo; 
      if (this.isSubterraneo) {
        this.robo.setTexture('raposa_enterrada'); 
      } else {
        this.robo.setTexture(this.heroiAtivo); 
      }
      return 'sucesso_cavar';
    }
    if (cmd === 'esperar') {
      return 'sucesso_esperar'; 
    }
    
    // Movimento Normal
    const passo = GRID_SIZE;
    const limiteMin = GRID_SIZE / 2;
    const limiteMax = GRID_SIZE * GRID_COUNT - GRID_SIZE / 2;
    let targetX = this.robo.x;
    let targetY = this.robo.y;
    if (cmd === 'direita') targetX += passo;
    if (cmd === 'esquerda') targetX -= passo;
    if (cmd === 'cima') targetY -= passo;
    if (cmd === 'baixo') targetY += passo;
     
    if (targetX < limiteMin || targetX > limiteMax || targetY < limiteMin || targetY > limiteMax) {
      return 'falha_parede'; 
    }
    let colidiuObstaculo = false;
    this.obstaculos.getChildren().forEach(obstaculo => {
      if (Math.abs(targetX - obstaculo.x) < 1 && Math.abs(targetY - obstaculo.y) < 1) {
        colidiuObstaculo = true;
      }
    });
    if (colidiuObstaculo) {
      return 'falha_parede'; 
    }
    
    // ★ CORREÇÃO: O robô SEMPRE se move ★
    this.robo.x = targetX;
    this.robo.y = targetY;
    
    // A checagem de colisão com inimigo SÓ acontece se NÃO estiver subterrâneo
    if (!this.isSubterraneo && this.checarColisaInimigo(this.robo, this.inimigos, false)) {
      return 'falha_inimigo';
    }
    return 'sucesso';
  }

  checarInteracoesTile() {
    this.recargas.getChildren().forEach(recarga => {
      if (recarga.getData('usado') === false && 
          Math.abs(this.robo.x - recarga.x) < 1 && 
          Math.abs(this.robo.y - recarga.y) < 1) {
        
        recarga.setData('usado', true);
        recarga.setVisible(false); 
        const valorRecarga = recarga.getData('valor');
        gameManager.bateria += valorRecarga; 
        atualizarStatusUI(); 
      }
    });
    
    let botaoFoiAtivado = false;
    this.botoes.getChildren().forEach(botao => {
      if (botao.getData('ligado') === false &&
          Math.abs(this.robo.x - botao.x) < 1 && 
          Math.abs(this.robo.y - botao.y) < 1) {
        
        botao.setData('ligado', true);
        botao.setTexture('botao_ligado'); 
        botaoFoiAtivado = true;
      }
    });
    
    if (botaoFoiAtivado) {
      this.verificarCondicaoPorta();
    }
  }

  verificarCondicaoPorta() {
    if (this.portaSprite.getData('ativa') === true) return; 

    let todosLigados = true;
    this.botoes.getChildren().forEach(botao => {
      if (botao.getData('ligado') === false) {
        todosLigados = false;
      }
    });

    if (todosLigados) {
      this.portaSprite.setTexture('porta'); 
      this.portaSprite.setData('ativa', true);
    }
  }

  checarVitoria() {
    if (this.portaSprite.getData('ativa') === true && 
        Math.abs(this.robo.x - this.portaSprite.x) < 1 && 
        Math.abs(this.robo.y - this.portaSprite.y) < 1) {
      
      if (this.proximoPassoTimer) {
        this.proximoPassoTimer.remove(false);
      }
      const estrelas = this.calcularEstrelas();
      this.scene.start('ConclusaoScene', { 
        currentLevelId: this.dadosNivel.numericId, 
        proximoNivelId: this.dadosNivel.proximoNivelId,
        estrelasConquistadas: estrelas 
     });
      return true;
    }
    return false;
  }
  
  resetarCena() {
    const getPos = (cell) => cell * GRID_SIZE + GRID_SIZE / 2;
    
    const { roboPos } = this.dadosNivel;
    this.robo.setPosition(getPos(roboPos.x), getPos(roboPos.y));
    this.robo.setTexture(this.heroiAtivo); 
    this.isSubterraneo = false;
    this.robo.setAlpha(1.0);
    
    this.inimigos.getChildren().forEach(inimigo => {
      const posInicial = inimigo.getData('posInicial');
      inimigo.setPosition(getPos(posInicial.x), getPos(posInicial.y));
    });
    
    this.botoes.getChildren().forEach(botao => {
      botao.setData('ligado', false);
      botao.setTexture('botao_desligado');
    });
    
    this.recargas.getChildren().forEach(recarga => {
      recarga.setData('usado', false);
      recarga.setVisible(true);
    });
    
    const temBotoes = (this.dadosNivel.botoes && this.dadosNivel.botoes.length > 0);
    if (temBotoes) {
      this.portaSprite.setTexture('porta_desligada');
      this.portaSprite.setData('ativa', false);
    }
  }
  
  penalizarVida(motivo) {
    if (this.proximoPassoTimer) {
      this.proximoPassoTimer.remove(false);
      this.proximoPassoTimer = null;
    }
    console.warn("Vida perdida:", motivo);
    gameManager.comandos = [];
    gameManager.buildState = 'root'; 
    gameManager.currentIfBlock = null;
    atualizarTexto();
    gameManager.vidas--;
    gameManager.executando = false; 
    atualizarStatusUI(); 
    const falhaTexto = this.add.text(MAP_SIZE / 2, MAP_SIZE / 2, motivo.toUpperCase(), {
      fontSize: '32px', color: '#ff0000', backgroundColor: '#000'
    }).setOrigin(0.5);
    this.time.delayedCall(1500, () => {
      if (gameManager.vidas <= 0) {
        this.scene.start('GameOverScene');
      } else {
        this.scene.restart({ nivelId: this.dadosNivel.numericId });
      }
    });
  }

  moverInimigos() {
    const getPos = (cell) => cell * GRID_SIZE + GRID_SIZE / 2;
    this.inimigos.getChildren().forEach(inimigo => {
      const tipo = inimigo.getData('tipo');
      
      if (tipo === 'sentinela_teleport') {
        const caminhos = this.dadosNivel.caminhoInimigo;
        if (!caminhos || caminhos.length === 0) return; 
        let indiceAtual = caminhos.findIndex(c => 
          Math.abs(inimigo.x - getPos(c.x)) < 1 && Math.abs(inimigo.y - getPos(c.y)) < 1
        );
        if (indiceAtual === -1) indiceAtual = 0;
        const proximoIndice = (indiceAtual + 1) % caminhos.length;
        const proximaPos = caminhos[proximoIndice];
        inimigo.setPosition(getPos(proximaPos.x), getPos(proximaPos.y));
      }
    });
  }

  // ★ FUNÇÃO 'checarColisaInimigo' CORRIGIDA (SAPO É PERIGOSO) ★
  checarColisaInimigo(robo, inimigos, apenasInimigosMoveis = false) {
    let colidiu = false;
    if (this.isSubterraneo) return false; 
    
    inimigos.getChildren().forEach(inimigo => {
      if (Math.abs(robo.x - inimigo.x) < 1 && Math.abs(robo.y - inimigo.y) < 1) {
        const tipo = inimigo.getData('tipo');
        
        // Apenas ignora 'sentinela' (estático), mas NÃO 'sentinela_teleport' (Sapo)
        if (apenasInimigosMoveis && tipo === 'sentinela') {
           // Ignora colisão de "ser esmagado" por inimigos estáticos
        } else {
          colidiu = true; 
        }
      }
    });
    return colidiu;
 }

  // ★ FUNÇÃO 'checarCondicao' CORRIGIDA (SEM ERRO DE SINTAXE) ★
    
  checarCondicao(condition) {
    const passo = GRID_SIZE;
    let targetX = this.robo.x;
    let targetY = this.robo.y;
    
    if (condition === 'perigo_frente') {
      targetX += passo; 
    }

    let perigo = false;
    this.inimigos.getChildren().forEach(inimigo => {
      if (Math.abs(targetX - inimigo.x) < 1 && Math.abs(targetY - inimigo.y) < 1) {
        perigo = true;
      }
    });
    return perigo;
  }
  
  calcularEstrelas() {
    const { comandosIdeal, comandosMax2Estrelas } = this.dadosNivel;
    const comandosUsados = gameManager.comandos.length; 
    if (comandosUsados <= comandosIdeal) { return 3; }
    if (comandosUsados <= comandosMax2Estrelas) { return 2; }
    return 1;
  }
  
  mostrarBriefing() {
    const briefingTexto = this.dadosNivel.briefing;
    if (!briefingTexto) {
      return; 
    }
    const overlay = document.getElementById('briefing-overlay');
    const modal = document.getElementById('briefing-modal');
    const content = document.getElementById('briefing-content');
    const btn = document.getElementById('briefing-close-btn');
   if (!modal || !content || !btn || !overlay) {
      console.warn('Elementos do modal de briefing não encontrados no HTML.');
      return;
    }
    this.scene.pause();
    gameManager.executando = false;
    content.innerHTML = briefingTexto;
    overlay.style.display = 'block';
    modal.style.display = 'block';
    btn.onclick = () => {
      overlay.style.display = 'none';
      modal.style.display = 'none';
      this.scene.resume();
    };
  }
  
} // Fim da classe NivelScene