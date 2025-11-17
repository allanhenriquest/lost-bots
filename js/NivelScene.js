// ARQUIVO: js/NivelScene.js
// Esta classe controla toda a lógica principal da cena de jogo (fases).
// Ela é responsável por carregar os assets, desenhar o nível,
// executar os comandos do jogador e controlar a IA dos inimigos.

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

    // ★ NOVO ★
    this.fogo = null;
    this.pocos = null;
    this.fontes = null; 
    this.aguaElefante = 0; // Estado do Elefante

    this.heroiAtivo = 'robo';
    this.isSubterraneo = false;
  }

  init(data) {
    const nivelId = data.nivelId || 1;
    this.dadosNivel = NIVEIS_DATA[nivelId];
    gameManager.bateria = 5;

    // ★ LÓGICA MODIFICADA ★
    // Pega o herói definido no niveis.js.
    // Usa 'robo' como padrão se a propriedade não for definida.
    this.heroiAtivo = this.dadosNivel.heroi || 'robo';
    this.isSubterraneo = false;
    
    // ★ NOVO: Reseta a contagem de água ★
    this.aguaElefante = 0;
  }

  preload() {
    this.load.image('robo', 'assets/robo.png');
    this.load.image('porta', 'assets/porta.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('coracao', 'assets/coracao.png');
    this.load.image('bateria', 'assets/bateria.png');
    this.load.image('parede', 'assets/parede.png');

    this.load.image('sapo', 'assets/sapo.png');
    this.load.image('tigre', 'assets/tigre.png');
    this.load.image('lobo', 'assets/lobo.png');
    this.load.image('path', 'assets/path.png');

    this.load.image('recarga', 'assets/recarga.png');
    this.load.image('porta_desligada', 'assets/porta_desligada.png');
    this.load.image('botao_desligado', 'assets/botao_desligado.png');
    this.load.image('botao_ligado', 'assets/botao_ligado.png');

    this.load.image('coelho', 'assets/coelho.png');
    this.load.image('raposa', 'assets/raposa.png');
    this.load.image('raposa_enterrada', 'assets/raposa_enterrada.png');

    this.load.image('elefante_agua', 'assets/elefante_agua.png');
    this.load.image('elefante_vazio', 'assets/elefante_vazio.png');
    this.load.image('fogo', 'assets/fogo.png');
    this.load.image('fogo_apagado', 'assets/fogo_apagado.png');
    this.load.image('fonte_agua', 'assets/fonte_agua.png');
    this.load.image('poca_agua', 'assets/poca_agua.png');
  }

  create() {
    this.obstaculos = this.physics.add.staticGroup();
    this.caminhos = this.physics.add.staticGroup();
    this.botoes = this.physics.add.staticGroup();
    this.recargas = this.physics.add.staticGroup();

    // ★ NOVO ★
    this.fogo = this.physics.add.staticGroup();
    this.pocos = this.physics.add.staticGroup();
    this.fontes = this.physics.add.staticGroup(); // Para o Nível 3

    this.inimigos = this.physics.add.group();

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

  posicionarItens() {
    const getPos = (cell) => cell * GRID_SIZE + GRID_SIZE / 2;
    // ★ NOVO: Adicione 'fogo', 'pocos', 'fontes' ★
    const { roboPos, portaPos, obstaculos, caminhoInimigo, inimigos, botoes, recargas, fogo, pocos, fontes } = this.dadosNivel;

    if (caminhoInimigo) {
      caminhoInimigo.forEach(pos => {
        this.caminhos.create(getPos(pos.x), getPos(pos.y), 'path')
          .setScale(SPRITE_SCALE).setOrigin(0.5, 0.5).refreshBody();
      });
    }

    if (obstaculos) {
      obstaculos.forEach(obs => {
        this.obstaculos.create(getPos(obs.x), getPos(obs.y), 'parede')
          .setScale(SPRITE_SCALE).setOrigin(0.5, 0.5).refreshBody();
      });
    }

    if (recargas) {
      recargas.forEach(rec => {
        const recargaSprite = this.recargas.create(getPos(rec.x), getPos(rec.y), 'recarga')
          .setScale(SPRITE_SCALE).setOrigin(0.5, 0.5).refreshBody();
        recargaSprite.setData('usado', false);
        recargaSprite.setData('valor', rec.valor || 3);
      });
    }

    if (botoes) {
      botoes.forEach(btn => {
        const botaoSprite = this.botoes.create(getPos(btn.x), getPos(btn.y), 'botao_desligado')
          .setScale(SPRITE_SCALE).setOrigin(0.5, 0.5).refreshBody();
        botaoSprite.setData('ligado', false);
      });
    }

    if (inimigos) {
      inimigos.forEach(ini => {
        let texturaInimigo = ini.tipo;
        if (ini.tipo === 'sentinela_teleport') texturaInimigo = 'sapo';

        const inimigoSprite = this.inimigos.create(getPos(ini.pos.x), getPos(ini.pos.y), texturaInimigo);
        inimigoSprite.setScale(SPRITE_SCALE).setOrigin(0.5, 0.5);
        inimigoSprite.setData('tipo', ini.tipo);
        inimigoSprite.setData('posInicial', ini.pos);
      });
    }

    if (fogo) {
      fogo.forEach(f => {
        const fogoSprite = this.fogo.create(getPos(f.x), getPos(f.y), 'fogo')
          .setScale(SPRITE_SCALE).setOrigin(0.5, 0.5).refreshBody();
        fogoSprite.setData('aceso', true);
      });
    }

    // ★ NOVO: Lógica para desenhar Poças de Água ★
    if (pocos) {
      pocos.forEach(p => {
        const pocaSprite = this.pocos.create(getPos(p.x), getPos(p.y), 'poca_agua')
          .setScale(SPRITE_SCALE).setOrigin(0.5, 0.5).refreshBody();
        pocaSprite.setData('usado', false);
      });
    }


    
    const temBotoes = (botoes && botoes.length > 0);
    const portaTextura = temBotoes ? 'porta_desligada' : 'porta';
    this.portaSprite = this.physics.add.sprite(getPos(portaPos.x), getPos(portaPos.y), portaTextura);
    this.portaSprite.setScale(SPRITE_SCALE).setOrigin(0.5, 0.5);
    this.portaSprite.setData('ativa', !temBotoes);
    let texturaHeroi = this.heroiAtivo;
    if (this.heroiAtivo === 'elefante') {
      texturaHeroi = 'elefante_vazio'; // Garante que ele comece vazio
    }
    this.robo = this.physics.add.sprite(getPos(roboPos.x), getPos(roboPos.y), texturaHeroi);
    this.robo.setScale(SPRITE_SCALE).setOrigin(0.5, 0.5);
  }

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

    let custo = 0;
    if (typeof cmd === 'string') {
      if (['direita', 'esquerda', 'cima', 'baixo'].includes(cmd)) {
        custo = 1;
      } else if (cmd === 'saltar') {
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

    let comandoReal = null;
    let pularTurnoInimigo = false;

    if (typeof cmd === 'string') {
      gameManager.index++;
      comandoReal = cmd;

    } else if (typeof cmd === 'object' && cmd.type === 'if') {
      gameManager.index++;
      const condicaoOk = this.checarCondicao(cmd.condition);
      let comandosParaInjetar = condicaoOk ? cmd.then : cmd.else;

      gameManager.comandos.splice(gameManager.index, 0, ...comandosParaInjetar);

      comandoReal = null;
      pularTurnoInimigo = true;
    }

    if (!comandoReal) {
      gameManager.executando = false;

      this.proximoPassoTimer = this.time.delayedCall(0, () => {
        gameManager.executando = true;
        this.proximoPassoTimer = null;
      });
      return;
    }

    // ★ NOVO: Lógica de Ação (Apagar Fogo) ★
    if (comandoReal === 'apagar_fogo') {
      // O comando 'apagar_fogo' é uma ação, não um movimento.
      const resultadoAcao = this.apagarFogo(); // Tenta apagar o fogo adjacente
      if (resultadoAcao === 'falha_sem_agua') {
            gameManager.executando = false;
            this.penalizarVida('SEM ÁGUA'); // Opcional: penalizar
            return;
        }        
        if (resultadoAcao === 'falha_sem_fogo') {
            gameManager.executando = false;
            this.penalizarVida('NÃO HÁ FOGO'); // Opcional: penalizar
            return;
        }        
        // Se 'sucesso', a ação custou um turno, mas não move.
        pularTurnoInimigo = true; 
    }

    // ★ NOVO: Lógica de Ação (Absorver Água) ★
    if (comandoReal === 'absorver_agua') {
      const resultadoAcao = this.absorverAgua(); 

      if (resultadoAcao === 'falha_sem_poca') {
        gameManager.executando = false;
        this.penalizarVida('NÃO HÁ POÇA'); 
        return;
      }
      if (resultadoAcao === 'falha_cheio') {
        gameManager.executando = false;
        this.penalizarVida('RESERVATÓRIO CHEIO');
        return;
      }
      
      pularTurnoInimigo = true; 
    }

    let resultadoMovimento = null;
    if (['direita', 'esquerda', 'cima', 'baixo', 'saltar', 'cavar', 'esperar'].includes(comandoReal)) {
         resultadoMovimento = this.mover(comandoReal);
    } else {
        // Se foi 'apagar_fogo' ou 'absorver_agua', o resultado é nulo
        resultadoMovimento = 'sucesso_acao'; 
    }

  

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

   if (
      resultadoMovimento === 'sucesso' ||
      resultadoMovimento === 'sucesso_cavar' ||
      resultadoMovimento === 'sucesso_esperar' ||
      resultadoMovimento === 'sucesso_acao' // ★ NOVO ★
    ) {
      this.checarInteracoesTile(); // Verifica se pisa em poça, botão, etc.
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

    const passo = GRID_SIZE;
    const limiteMin = GRID_SIZE / 2;
    const limiteMax = GRID_SIZE * GRID_COUNT - GRID_SIZE / 2;
    let targetX = this.robo.x;
    let targetY = this.robo.y;

    if (cmd === 'direita') targetX += passo;
    if (cmd === 'esquerda') targetX -= passo;
    if (cmd === 'cima') targetY -= passo;   // Mudar para -=
    if (cmd === 'baixo') targetY += passo;  // Manter +=

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

    this.robo.x = targetX;
    this.robo.y = targetY;

    if (!this.isSubterraneo && this.checarColisaInimigo(this.robo, this.inimigos, false)) {
      return 'falha_inimigo';
    }

    return 'sucesso';
  }

  checarInteracoesTile() {
    // Lógica para Recargas de Bateria
    this.recargas.getChildren().forEach(recarga => {
      if (
        recarga.getData('usado') === false &&
        Math.abs(this.robo.x - recarga.x) < 1 &&
        Math.abs(this.robo.y - recarga.y) < 1
      ) {
        recarga.setData('usado', true);
        recarga.setVisible(false);

        const valorRecarga = recarga.getData('valor');
        gameManager.bateria += valorRecarga;
        atualizarStatusUI();
      }
    });

    // Lógica para Botões
    let botaoFoiAtivado = false;
    this.botoes.getChildren().forEach(botao => {
      if (
        botao.getData('ligado') === false &&
        Math.abs(this.robo.x - botao.x) < 1 &&
        Math.abs(this.robo.y - botao.y) < 1
      ) {
        botao.setData('ligado', true);
        botao.setTexture('botao_ligado');
        botaoFoiAtivado = true;
      }
    });

    // Se um botão foi ativado, verifica se a porta deve ser ligada
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
    if (
      this.portaSprite.getData('ativa') === true &&
      Math.abs(this.robo.x - this.portaSprite.x) < 1 &&
      Math.abs(this.robo.y - this.portaSprite.y) < 1
    ) {
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

    // 1. Reposiciona o robô
    const { roboPos } = this.dadosNivel;
    this.robo.setPosition(getPos(roboPos.x), getPos(roboPos.y));

    // ★ INÍCIO DA CORREÇÃO DE TEXTURA ★
    // Define a textura inicial correta (ex: 'robo', 'raposa', ou 'elefante_vazio')
    let texturaHeroi = this.heroiAtivo;
    if (this.heroiAtivo === 'elefante') {
      texturaHeroi = 'elefante_vazio';
    }
    this.robo.setTexture(texturaHeroi);
    // ★ FIM DA CORREÇÃO DE TEXTURA ★

    // 2. Reseta os estados
    this.isSubterraneo = false;
    this.robo.setAlpha(1.0);
    this.aguaElefante = 0; // <- Importante: Esvazia o elefante

    // 3. Reseta os itens do nível (Inimigos, Botões, Recargas)
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

    // 4. (NOVO) Reseta Poças e Fogos
    if (this.pocos) {
      this.pocos.getChildren().forEach(poca => {
        poca.setData('usado', false);
        poca.setVisible(true);
      });
    }
    if (this.fogo) {
      this.fogo.getChildren().forEach(f => {
        f.setData('aceso', true);
        f.setTexture('fogo');
      });
    }

    // 5. Reseta a porta
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

    const falhaTexto = this.add.text(
      MAP_SIZE / 2,
      MAP_SIZE / 2,
      motivo.toUpperCase(),
      { fontSize: '32px', color: '#ff0000', backgroundColor: '#000' }
    ).setOrigin(0.5);

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

      if (tipo === 'sentinela_teleport' || tipo === 'tigre') {
        const caminhos = this.dadosNivel.caminhoInimigo;
        if (!caminhos || caminhos.length === 0) return;

        let indiceAtual = caminhos.findIndex(c =>
          Math.abs(inimigo.x - getPos(c.x)) < 1 &&
          Math.abs(inimigo.y - getPos(c.y)) < 1
        );

        if (indiceAtual === -1) {
          const posInicial = inimigo.getData('posInicial');
          indiceAtual = caminhos.findIndex(c => c.x === posInicial.x && c.y === posInicial.y);
          if (indiceAtual === -1) indiceAtual = 0;
        }

        const proximoIndice = (indiceAtual + 1) % caminhos.length;
        const proximaPos = caminhos[proximoIndice];

        inimigo.setPosition(getPos(proximaPos.x), getPos(proximaPos.y));
      }
    });
  }
  checarColisaInimigo(robo, inimigos, apenasInimigosMoveis = false) {
    let colidiu = false;

    if (this.isSubterraneo) return false;

    inimigos.getChildren().forEach(inimigo => {
      if (
        Math.abs(robo.x - inimigo.x) < 1 &&
        Math.abs(robo.y - inimigo.y) < 1
      ) {
        const tipo = inimigo.getData('tipo');

        if (apenasInimigosMoveis && tipo === 'sentinela') {
          // Futuro inimigo estático — ignorar
        } else {
          colidiu = true;
        }
      }
    });

    return colidiu;
  }

 checarCondicao(condition) {
    
    // --- 1. Verificações de Estado (não-adjacência) ---
    if (condition === 'if_elefante_cheio') {
      return this.aguaElefante >= 2;
    }

    // --- 2. Verificações de Adjacência ---
    
    // Lista de condições de adjacência conhecidas
    const condicoesAdjacencia = [
      'if_inimigo_frente', 
      'if_risco_frente', 
      'if_fogo_frente'
    ];

    if (!condicoesAdjacencia.includes(condition)) {
      return false; // Não é uma condição conhecida
    }

    // (O resto da lógica de adjacência permanece o mesmo)
    const passo = GRID_SIZE;
    const x = this.robo.x;
    const y = this.robo.y;
    const alvos = [
      { x: x + passo, y: y }, // Direita
      { x: x - passo, y: y }, // Esquerda
      { x: x, y: y + passo }, // Baixo
      { x: x, y: y - passo }  // Cima
    ];

    let riscoEncontrado = false;
    let inimigoEncontrado = false;
    let fogoEncontrado = false; 

    for (const alvo of alvos) {
      // (Lógica para checar caminhos/risco)
      this.caminhos.getChildren().forEach(tileCaminho => {
        if (Math.abs(alvo.x - tileCaminho.x) < 1 && Math.abs(alvo.y - tileCaminho.y) < 1) {
          riscoEncontrado = true;
        }
      });
      // (Lógica para checar inimigos)
      this.inimigos.getChildren().forEach(inimigo => {
        if (Math.abs(alvo.x - inimigo.x) < 1 && Math.abs(alvo.y - inimigo.y) < 1) {
          inimigoEncontrado = true;
        }
      });
      // (Lógica para checar fogo)
      this.fogo.getChildren().forEach(f => {
        if (f.getData('aceso') === true && Math.abs(alvo.x - f.x) < 1 && Math.abs(alvo.y - f.y) < 1) {
          fogoEncontrado = true;
        }
      });
    } // Fim do loop 'for (const alvo of alvos)'

    if (condition === 'if_inimigo_frente') return inimigoEncontrado;
    if (condition === 'if_risco_frente') return riscoEncontrado;
    if (condition === 'if_fogo_frente') return fogoEncontrado;

    return false;
  }

  calcularEstrelas() {
    const { comandosIdeal, comandosMax2Estrelas } = this.dadosNivel;
    const comandosUsados = gameManager.comandos.length;

    if (comandosUsados <= comandosIdeal) {
      return 3;
    }
    if (comandosUsados <= comandosMax2Estrelas) {
      return 2;
    }
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

  apagarFogo() {
    // 1. Verifica se o elefante está cheio
    if (this.aguaElefante < 2) {
      return 'falha_sem_agua';
    }

    // 2. Define as posições adjacentes (baseado na correção anterior)
    const passo = GRID_SIZE;
    const x = this.robo.x;
    const y = this.robo.y;
    const alvos = [
      { x: x + passo, y: y }, // Direita
      { x: x - passo, y: y }, // Esquerda
      { x: x, y: y + passo }, // Baixo
      { x: x, y: y - passo }  // Cima
    ];

    let fogoApagado = false;

    // 3. Itera nos alvos e nos fogos
    for (const alvo of alvos) {
      this.fogo.getChildren().forEach(f => {
        if (
          f.getData('aceso') === true && // Verifica se o fogo está aceso
          Math.abs(alvo.x - f.x) < 1 &&
          Math.abs(alvo.y - f.y) < 1
        ) {
          // 4. Encontrou um fogo adjacente e aceso!
          f.setData('aceso', false);
          f.setTexture('fogo_apagado');
          fogoApagado = true;
        }
      });
    }

    // 5. Se apagou, esvazia o elefante
    if (fogoApagado) {
      this.aguaElefante = 0; // Esvazia a água
      this.robo.setTexture('elefante_vazio'); // Atualiza a textura
      return 'sucesso';
    } else {
      // Não havia fogo adjacente
      return 'falha_sem_fogo';
    }
  }

  absorverAgua() {
    // 1. Verifica se o elefante já está cheio
    if (this.aguaElefante >= 2) {
      return 'falha_cheio'; // Já está cheio
    }

    let pocaEncontrada = false;

    // 2. Procura uma poça NÃO USADA na posição ATUAL do robô
    this.pocos.getChildren().forEach(poca => {
      if (
        poca.getData('usado') === false &&
        Math.abs(this.robo.x - poca.x) < 1 &&
        Math.abs(this.robo.y - poca.y) < 1
      ) {
        // 3. Encontrou a poça!
        poca.setData('usado', true);
        poca.setVisible(false);
        pocaEncontrada = true;
      }
    });

    // 4. Se encontrou e absorveu:
    if (pocaEncontrada) {
      this.aguaElefante++; // Adiciona 1 ponto de água
      
      // 5. Atualiza a textura se ficar cheio
      if (this.aguaElefante >= 2) {
        this.robo.setTexture('elefante_agua');
      }
      return 'sucesso';
    } else {
      // Não havia poça na posição atual
      return 'falha_sem_poca';
    }
  }

} // FIM DA CLASSE NivelScene
