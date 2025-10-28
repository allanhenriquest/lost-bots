class NivelScene extends Phaser.Scene {

  constructor() {
    super('NivelScene');
    this.dadosNivel = null;
    this.robo = null;
    this.porta = null;
    // O texto de vitória foi movido para a ConclusaoScene
  }

  // init é chamado ANTES de preload. Usamos para receber dados
  init(data) {
    const nivelId = data.nivelId || 1; 
    this.dadosNivel = NIVEIS_DATA[nivelId];
    
    // 1. RESETA A BATERIA GLOBAL
    gameManager.bateria = 5; 
  }

  preload() {
    this.load.image('robo', 'assets/robo.png');
    this.load.image('porta', 'assets/porta.png');
    this.load.image('star', 'assets/star.png');
    
    // 2. CARREGA NOVOS ASSETS
    this.load.image('coracao', 'assets/coracao.png');
    this.load.image('bateria', 'assets/bateria.png');
  }

  create() {
    this.desenharGrid();
    this.posicionarItens();

    // 3. ATUALIZA O HUD (para mostrar bateria cheia)
    atualizarStatusUI();
    
    this.game.events.emit('scene-ready', this);
  }


  // 4. MOVER (Simplificado)
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
    atualizarStatusUI(); // Atualiza o HUD imediatamente

    // 2. Verifica colisão com a parede (limites)
    if (targetX < limiteMin || targetX > limiteMax || targetY < limiteMin || targetY > limiteMax) {
      // Colidiu com a parede
      // A bateria já foi consumida (energia desperdiçada) 
      
      // Retorna um status de falha
      return 'falha_parede'; 
    }

    // 3. Se chegou aqui, o movimento é válido
    // Executa o movimento
    this.robo.x = targetX;
    this.robo.y = targetY;

    return 'sucesso';
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
    // Converte a posição do grid (ex: 2) para pixels (ex: 2 * 96 + 48)
    const getPos = (cell) => cell * GRID_SIZE + GRID_SIZE / 2;

    // Pega os dados do nível que carregamos no init()
    const { roboPos, portaPos } = this.dadosNivel;

    // === CRIA A PORTA (OBJETIVO) ===
    this.porta = this.physics.add.sprite(getPos(portaPos.x), getPos(portaPos.y), 'porta');
    this.porta.setScale(SPRITE_SCALE);
    this.porta.setOrigin(0.5, 0.5);

    // === CRIA O ROBÔ ===
    this.robo = this.physics.add.sprite(getPos(roboPos.x), getPos(roboPos.y), 'robo');
    this.robo.setScale(SPRITE_SCALE);
    this.robo.setOrigin(0.5, 0.5);
  }

  // 5. NOVA FUNÇÃO: PENALIZAR VIDA
  penalizarVida(motivo) {
    console.warn("Vida perdida:", motivo);
    
    gameManager.vidas--;
    gameManager.executando = false;
    atualizarStatusUI();

    // Mostra um feedback visual rápido (texto pisca)
    const falhaTexto = this.add.text(MAP_SIZE / 2, MAP_SIZE / 2, motivo.toUpperCase(), {
      fontSize: '32px', color: '#ff0000', backgroundColor: '#000'
    }).setOrigin(0.5);
    
    // Atraso antes de reiniciar ou dar game over
    this.time.delayedCall(1500, () => {
      if (gameManager.vidas <= 0) {
        // Fim de jogo
        this.scene.start('GameOverScene');
      } else {
        // Reinicia o nível atual
        this.scene.restart({ nivelId: this.dadosNivel.numericId });
      }
    });
  }

  update() {
    // 1. Condição de entrada do loop
    if (gameManager.executando && gameManager.index < gameManager.comandos.length) {
      
      // 2. VERIFICAÇÃO DE BATERIA (ANTES DE MOVER)
      // O robô precisa de bateria para *tentar* o próximo comando
      if (gameManager.bateria <= 0) {
        // Falha Crítica: Sem bateria
        gameManager.executando = false;
        // Chama a penalização, que consome vida e reinicia 
        this.penalizarVida('SEM BATERIA'); 
        return; // Para a execução deste frame
      }

      // Pega o comando e avança o índice
      const cmd = gameManager.comandos[gameManager.index];
      gameManager.index++; 
      
      // 3. TENTA MOVER e captura o resultado
      const resultadoMovimento = this.mover(cmd);

      // 4. PROCESSA O RESULTADO
      if (resultadoMovimento === 'falha_parede') {
        // Falha Crítica: Bateu na parede
        gameManager.executando = false;
        // Chama a penalização 
        this.penalizarVida('COLISÃO'); 
        return; // Para a execução deste frame
      }

      // 5. CHECA VITÓRIA (se o movimento foi 'sucesso')
      if (this.checarVitoria()) {
        gameManager.executando = false; // Para tudo se vencer
        return;
      }

      // 6. PAUSA ENTRE PASSOS (se não venceu e não falhou)
      gameManager.executando = false; 

      // 7. AGENDA PRÓXIMO PASSO (se houver mais comandos)
      if (gameManager.index < gameManager.comandos.length) {
        // Se ainda há comandos, agenda o próximo
        this.time.delayedCall(500, () => {
          gameManager.executando = true; // Re-ativa o motor
        });
      }
      // 5. Se não houver mais comandos (index === length), 
      //    'executando' permanecerá 'false', e o motor para corretamente.
    }
  }

  // NOVA FUNÇÃO: Calcular Estrelas
  calcularEstrelas() {
    const { comandosIdeal, comandosMax2Estrelas } = this.dadosNivel;
    const comandosUsados = gameManager.comandos.length;

    if (comandosUsados <= comandosIdeal) {
      return 3; // Otimização Máxima
    } else if (comandosUsados <= comandosMax2Estrelas) {
      return 2; // Solução Aceitável
    } else {
      return 1; // Apenas Funcionalidade
    }
  }

  checarVitoria() {
    if (Math.abs(this.robo.x - this.porta.x) < 1 && Math.abs(this.robo.y - this.porta.y) < 1) {
      
      const estrelas = this.calcularEstrelas();
      atualizarTexto(); 
      
      // Inicia a cena de Conclusão, passando os dados
      this.scene.start('ConclusaoScene', { 
        // 1. ADICIONE ESTA LINHA:
        currentLevelId: this.dadosNivel.numericId, 
        
        proximoNivelId: this.dadosNivel.proximoNivelId,
        estrelasConquistadas: estrelas 
      });
      return true;
    }
    return false;
  }

  
  // Função que o botão RESETAR (do main.js) vai chamar
  resetarCena() {
    // Reposiciona o robô
    const { roboPos } = this.dadosNivel;
    const getPos = (cell) => cell * GRID_SIZE + GRID_SIZE / 2;
    this.robo.setPosition(getPos(roboPos.x), getPos(roboPos.y));
  }
}