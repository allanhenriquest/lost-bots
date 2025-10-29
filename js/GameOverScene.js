class GameOverScene extends Phaser.Scene {

  constructor() {
    super('GameOverScene');
  }

  create() {
    // Fundo escuro
    this.add.rectangle(0, 0, MAP_SIZE, MAP_SIZE, 0x000000, 0.9).setOrigin(0);

    // Texto "FIM DE JOGO"
    this.add.text(MAP_SIZE / 2, MAP_SIZE / 2 - 50, 'FIM DE JOGO', {
      fontSize: '48px',
      color: '#ff0000', // Vermelho
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
    
    // Ao clicar, reseta o jogo (vidas e nível)
    botaoTexto.on('pointerdown', () => {
      gameManager.vidas = 4; // Reseta as vidas
      resetar(); // Reseta os comandos
      this.scene.start('NivelScene', { nivelId: 1 }); // Volta ao Nível 1
    });
  }
}