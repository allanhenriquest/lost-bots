class ConclusaoScene extends Phaser.Scene {

  constructor() {
    super('ConclusaoScene');
    this.proximoNivelId = null;
    this.estrelas = 0;
  }

  init(data) {
    // 2. ADICIONE ESTA LINHA:
    this.currentLevelId = data.currentLevelId; 

    this.proximoNivelId = data.proximoNivelId;
    this.estrelas = data.estrelasConquistadas;
  }

  preload() {
    // Carrega a imagem da estrela que será usada
    this.load.image('star', 'assets/star.png');
  }

// Arquivo: ConclusaoScene.js

  create() {
    // Fundo escuro semi-transparente
    this.add.rectangle(0, 0, MAP_SIZE, MAP_SIZE, 0x000000, 0.7).setOrigin(0);

    // Painel de Conclusão (baseado no protótipo)
    const painel = this.add.graphics();
    painel.fillStyle(0x00bcd4, 0.9); // Ciano
    painel.fillRoundedRect(MAP_SIZE / 2 - 200, MAP_SIZE / 2 - 150, 400, 300, 16);

    // Texto "MISSÃO CUMPRIDA!"
    this.add.text(MAP_SIZE / 2, 140, 'MISSÃO CUMPRIDA!', {
      fontSize: '32px',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Lógica para desenhar as estrelas
    const starY = 220;
    for (let i = 0; i < 3; i++) {
      // Desenha 3 estrelas cinzas (vazias)
      this.add.sprite(220 + i * 80, starY, 'star').setScale(0.1).setTint(0x444444);
    }
    for (let i = 0; i < this.estrelas; i++) {
      // Desenha as estrelas conquistadas (amarelas) por cima
      this.add.sprite(220 + i * 80, starY, 'star').setScale(0.1);
    }

    // Textos de XP (baseado no protótipo)
    let bonusXp = (this.estrelas > 1) ? (this.estrelas - 1) * 50 : 0;
    this.add.text(MAP_SIZE / 2, 280, '• XP BASE: +100 XP', { fontSize: '18px', color: '#fff' }).setOrigin(0.5);
    this.add.text(MAP_SIZE / 2, 310, `• BÔNUS DE OTIMIZAÇÃO: +${bonusXp} XP`, { fontSize: '18px', color: '#fff' }).setOrigin(0.5);

    // Botão "PRÓXIMO DESAFIO"
    if (this.proximoNivelId) {
      this.criarBotao('PRÓXIMO DESAFIO', 370, () => {
        // Limpa o gameManager e inicia o próximo nível
        resetar();
        this.scene.start('NivelScene', { nivelId: this.proximoNivelId });
      });
    }

    // Botão "ÁRVORE DE DOMÍNIO" (Volta ao Nível 1 por enquanto)
    this.criarBotao('ÁRVORE DE DOMÍNIO', 420, () => {
      resetar();
      this.scene.start('NivelScene', { nivelId: 1 });
    });

    // ================================================================
    // ADICIONE ESTA LINHA:
    // Avisa ao main.js que esta cena (ConclusaoScene) é agora a ativa
    this.game.events.emit('scene-ready', this);
    // ================================================================
  }

  // Função helper para criar botões
  criarBotao(texto, y, callback) {
    const botaoTexto = this.add.text(MAP_SIZE / 2, y, texto, {
      fontSize: '20px',
      backgroundColor: '#008c9e',
      padding: { x: 20, y: 10 },
      fontStyle: 'bold'
    }).setOrigin(0.5).setInteractive();

    botaoTexto.on('pointerover', () => botaoTexto.setBackgroundColor('#00bcd4'));
    botaoTexto.on('pointerout', () => botaoTexto.setBackgroundColor('#008c9e'));
    botaoTexto.on('pointerdown', callback);
  }
}