class GameOverScene extends Phaser.Scene {

  constructor() {
    super('GameOverScene');
    this.levelToRestart = 1; 
  }

  init(data) {
    this.levelToRestart = data.currentLevelId || 1;
  }

  create() {
    // ★ CORREÇÃO CRÍTICA: Avisa ao GameManager que ESTA é a cena ativa agora.
    // Isso impede que o 'resetar()' tente mexer no nível antigo que já foi destruído.
    if (typeof gameManager !== 'undefined') {
      gameManager.cenaAtiva = this; 
    }

    // Fundo escuro
    this.add.rectangle(0, 0, MAP_SIZE, MAP_SIZE, 0x000000, 0.9).setOrigin(0);

    // Texto "FIM DE JOGO"
    this.add.text(MAP_SIZE / 2, MAP_SIZE / 2 - 50, 'FIM DE JOGO', {
      fontSize: '48px',
      color: '#ff0000',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Texto de instrução
    this.add.text(MAP_SIZE / 2, MAP_SIZE / 2 + 20, 'Você perdeu todas as vidas.', {
      fontSize: '20px',
      color: '#ffffff'
    }).setOrigin(0.5);

    // Botão "TENTAR NOVAMENTE"
    const botaoTexto = this.add.text(MAP_SIZE / 2, MAP_SIZE / 2 + 100, 'TENTAR NOVAMENTE', {
      fontSize: '20px',
      backgroundColor: '#008c9e',
      padding: { x: 20, y: 10 },
      fontStyle: 'bold'
    }).setOrigin(0.5).setInteractive();

    botaoTexto.on('pointerover', () => botaoTexto.setBackgroundColor('#00bcd4'));
    botaoTexto.on('pointerout', () => botaoTexto.setBackgroundColor('#008c9e'));
    
    // Ação do Clique
    botaoTexto.on('pointerdown', () => {
      console.log("Reiniciando nível:", this.levelToRestart);
      
      // 1. Reseta vidas e bateria
      if (typeof gameManager !== 'undefined') {
        gameManager.vidas = 4;
        gameManager.bateria = 5;
      }
      
      // 2. Limpa os comandos (resetar global)
      // Como mudamos o 'cenaAtiva' lá em cima, o resetar() não vai dar erro!
      try {
        if (typeof resetar === 'function') resetar();
      } catch (e) {
        console.warn("Erro ao resetar UI, mas prosseguindo...", e);
      }

      // 3. Inicia a cena do nível novamente
      this.scene.start('NivelScene', { nivelId: this.levelToRestart });
    });
  }
}