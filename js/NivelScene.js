// ARQUIVO: js/NivelScene.js (ATUALIZADO)

class NivelScene extends Phaser.Scene {

  constructor() {
    super('NivelScene');
    this.dadosNivel = null;
    this.robo = null;
    this.porta = null;
    this.obstaculos = null; // 1. ADICIONADO: Grupo de obstáculos
  }

  init(data) {
    const nivelId = data.nivelId || 1; 
    this.dadosNivel = NIVEIS_DATA[nivelId];
    gameManager.bateria = 5; 
  }

  preload() {
    this.load.image('robo', 'assets/robo.png');
    this.load.image('porta', 'assets/porta.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('coracao', 'assets/coracao.png');
    this.load.image('bateria', 'assets/bateria.png');
    
    // 2. ADICIONADO: Carrega o novo asset (presume que está em 'assets/parede.png')
    this.load.image('parede', 'assets/parede.png'); 
  }

  create() {
    // 3. ADICIONADO: Cria o grupo de física para os obstáculos
    this.obstaculos = this.physics.add.staticGroup();

    this.desenharGrid();
    this.posicionarItens(); // Esta função agora também posiciona as paredes
    
    atualizarStatusUI();
    this.game.events.emit('scene-ready', this);
  }

  // 4. ATUALIZADO: Função mover() agora verifica obstáculos internos
  mover(cmd) {
    const passo = GRID_SIZE;
    const limiteMin = GRID_SIZE / 2;
    const limiteMax = GRID_SIZE * GRID_COUNT - GRID_SIZE / 2;

    let targetX = this.robo.x;
    let targetY = this.robo.y;

    if (cmd === 'frente') targetX += passo;
    if (cmd === 'tras') targetX -= passo;
    if (cmd === 'cima') targetY -= passo;
    if (cmd === 'baixo') targetY += passo;

    // 1. Consome bateria pelo comando de movimento
    gameManager.bateria--;
    atualizarStatusUI(); 

    // 2. Verifica colisão com a parede (limites EXTERNOS)
    if (targetX < limiteMin || targetX > limiteMax || targetY < limiteMin || targetY > limiteMax) {
      // Bateu na borda do mapa
      return 'falha_parede'; 
    }

    // 3. ADICIONADO: Verifica colisão com obstáculos INTERNOS
    // Itera por todos os obstáculos (paredes)
    let colidiuObstaculo = false;
    this.obstaculos.getChildren().forEach(obstaculo => {
      // Verifica se a posição alvo (targetX, targetY) é a mesma do obstáculo
      if (Math.abs(targetX - obstaculo.x) < 1 && Math.abs(targetY - obstaculo.y) < 1) {
        colidiuObstaculo = true;
      }
    });
    
    if (colidiuObstaculo) {
      // Bateu numa parede interna
      return 'falha_parede'; // Usa o mesmo status de falha
    }

    // 4. Se chegou aqui, o movimento é válido
    this.robo.x = targetX;
    this.robo.y = targetY;

    return 'sucesso';
  }

  desenharGrid() {
    // ... (Esta função não muda)
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

  // 5. ATUALIZADO: posicionarItens() agora desenha as paredes
  posicionarItens() {
    const getPos = (cell) => cell * GRID_SIZE + GRID_SIZE / 2;
    
    // Pega os dados do nível
    const { roboPos, portaPos, obstaculos } = this.dadosNivel;

    // === CRIA A PORTA ===
    this.porta = this.physics.add.sprite(getPos(portaPos.x), getPos(portaPos.y), 'porta');
    this.porta.setScale(SPRITE_SCALE);
    this.porta.setOrigin(0.5, 0.5);

    // === CRIA O ROBÔ ===
    this.robo = this.physics.add.sprite(getPos(roboPos.x), getPos(roboPos.y), 'robo');
    this.robo.setScale(SPRITE_SCALE);
    this.robo.setOrigin(0.5, 0.5);
    
    // === ADICIONADO: Cria os Obstáculos (Paredes) ===
    if (obstaculos && obstaculos.length > 0) {
      obstaculos.forEach(obs => {
        // Adiciona a parede ao grupo de física
        this.obstaculos.create(getPos(obs.x), getPos(obs.y), 'parede')
          .setScale(SPRITE_SCALE) // Ajuste a escala se necessário
          .setOrigin(0.5, 0.5)
          .refreshBody(); // Informa à física sobre o novo item estático
      });
    }
  }

  // 6. ATUALIZADO: penalizarVida()
  // Esta função já existia. A lógica em update() 
  // que a chama quando o 'mover' retorna 'falha_parede' 
  // agora funcionará tanto para bordas quanto para paredes internas.
  penalizarVida(motivo) {
    console.warn("Vida perdida:", motivo);
    
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

  // A função update() não precisa de alterações
  update() {
    if (gameManager.executando && gameManager.index < gameManager.comandos.length) {
      
      if (gameManager.bateria <= 0) {
        gameManager.executando = false;
        this.penalizarVida('SEM BATERIA'); 
        return; 
      }

      const cmd = gameManager.comandos[gameManager.index];
      gameManager.index++; 
      
      const resultadoMovimento = this.mover(cmd);

      // ESTA PARTE AGORA TRATA AMBAS AS COLISÕES
      if (resultadoMovimento === 'falha_parede') {
        gameManager.executando = false;
        // Chama a penalização que custa 1 vida
        this.penalizarVida('COLISÃO'); 
        return; 
      }

      if (this.checarVitoria()) {
        gameManager.executando = false; 
        return;
      }

      gameManager.executando = false; 
      if (gameManager.index < gameManager.comandos.length) {
        this.time.delayedCall(500, () => {
          gameManager.executando = true; 
        });
      }
    }
  }

  // A função calcularEstrelas() não precisa de alterações
  calcularEstrelas() {
    const { comandosIdeal, comandosMax2Estrelas } = this.dadosNivel;
    const comandosUsados = gameManager.comandos.length;

    if (comandosUsados <= comandosIdeal) {
      return 3;
    } else if (comandosUsados <= comandosMax2Estrelas) {
      return 2;
    } else {
      return 1;
    }
  }

  // A função checarVitoria() não precisa de alterações
  checarVitoria() {
    if (Math.abs(this.robo.x - this.porta.x) < 1 && Math.abs(this.robo.y - this.porta.y) < 1) {
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

  // A função resetarCena() não precisa de alterações
  resetarCena() {
    const { roboPos } = this.dadosNivel;
    const getPos = (cell) => cell * GRID_SIZE + GRID_SIZE / 2;
    this.robo.setPosition(getPos(roboPos.x), getPos(roboPos.y));
  }
}