// ARQUIVO: js/ConclusaoScene.js (COMPLETO E ATUALIZADO)

class ConclusaoScene extends Phaser.Scene {

  constructor() {
    super('ConclusaoScene');
    this.proximoNivelId = null;
    this.estrelas = 0;
    this.currentLevelId = null; 
  }

  init(data) {
    this.currentLevelId = data.currentLevelId;
    this.proximoNivelId = data.proximoNivelId;
    this.estrelas = data.estrelasConquistadas;
  }

  preload() {
    this.load.image('star', 'assets/star.png');
  }

  create() {
    // Fundo escuro
    this.add.rectangle(0, 0, MAP_SIZE, MAP_SIZE, 0x000000, 0.7).setOrigin(0);

    // Painel
    const painel = this.add.graphics();
    painel.fillStyle(0x00bcd4, 0.9);
    painel.fillRoundedRect(MAP_SIZE / 2 - 200, MAP_SIZE / 2 - 150, 400, 300, 16);

    // Texto "MISSÃO CUMPRIDA!"
    this.add.text(MAP_SIZE / 2, 140, 'MISSÃO CUMPRIDA!', {
      fontSize: '32px',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // --- LÓGICA DE SALVAR PROGRESSO ---
    this.salvarProgresso();
    // --- FIM ---

    // --- Lógica para desenhar as estrelas (★ CORREÇÃO 2.0) ---
    const starY = 220;
    const starCenterX = MAP_SIZE / 2; // O centro da tela (240px)
    
    // ★ 1. AUMENTA O ESPAÇAMENTO
    const starSpacing = 80; // Era 70
    
    // ★ 2. DEFINE UMA ESCALA MENOR
    const starScale = 0.08; // Era 0.1
    
    const starPositionsX = [
      starCenterX - starSpacing, // Estrela da Esquerda (ex: 240 - 80 = 160)
      starCenterX,               // Estrela do Meio   (ex: 240)
      starCenterX + starSpacing  // Estrela da Direita (ex: 240 + 80 = 320)
    ];

    // 1. Desenha as 3 estrelas de fundo (cinzas) com a nova escala
    starPositionsX.forEach(posX => {
      this.add.sprite(posX, starY, 'star').setScale(starScale).setTint(0x444444);
    });
    
    // 2. Desenha as estrelas conquistadas (amarelas) por cima
    for (let i = 0; i < this.estrelas; i++) {
      this.add.sprite(starPositionsX[i], starY, 'star').setScale(starScale);
    }
    // --- Fim da Correção ---

    // Textos de XP
    let bonusXp = (this.estrelas > 1) ? (this.estrelas - 1) * 50 : 0;
    this.add.text(MAP_SIZE / 2, 280, '• XP BASE: +100 XP', { fontSize: '18px', color: '#fff' }).setOrigin(0.5);
    this.add.text(MAP_SIZE / 2, 310, `• BÔNUS DE OTIMIZAÇÃO: +${bonusXp} XP`, { fontSize: '18px', color: '#fff' }).setOrigin(0.5);

    // Botão "PRÓXIMO DESAFIO"
    if (this.proximoNivelId) {
      this.criarBotao('PRÓXIMO DESAFIO', 370, () => {
        resetar();
        // Recarrega a cena do Phaser com o próximo nível
        this.scene.start('NivelScene', { nivelId: this.proximoNivelId });
      });
    }

    // Botão "ÁRVORE DE DOMÍNIO"
    this.criarBotao('ÁRVORE DE DOMÍNIO', 420, () => {
      resetar();
      // Redireciona para o hub (menu de níveis)
      window.location.href = 'jogo.html';
    });

    this.game.events.emit('scene-ready', this);
  }

  // --- FUNÇÃO PARA SALVAR NO FIREBASE ---
  async salvarProgresso() {
    // 1. Pega o usuário logado (o 'auth' foi inicializado no fase.html)
    const user = auth.currentUser;
    if (!user) {
      console.error("Erro: Usuário não está logado. Progresso não será salvo.");
      return;
    }

    // 2. Pega os dados deste nível
    const newStars = this.estrelas;
    const levelId = this.currentLevelId;

    // 3. Cria o ID único do documento (ex: "IDdoUsuario_1")
    const docId = `${user.uid}_${levelId}`;
    const progressoRef = db.collection('progressoNiveis').doc(docId);

    try {
      // 4. Tenta ler o documento existente (usa 'get')
      const doc = await progressoRef.get();

      let currentBestStars = 0;
      if (doc.exists) {
        currentBestStars = doc.data().estrelasObtidas || 0;
      }

      // 5. Compara: Só salva se o novo placar for MELHOR
      if (newStars > currentBestStars) {
        console.log(`Novo recorde! Salvando ${newStars} estrelas para o nível ${levelId}`);
        // 'set' com 'merge: true' (é uma operação 'write')
        await progressoRef.set({
          userId: user.uid,
          nivelId: levelId,
          estrelasObtidas: newStars
        }, { merge: true });
      } else {
        console.log(`Placar antigo (${currentBestStars} estrelas) é melhor. Nada salvo.`);
      }

    } catch (error) {
      console.error("Erro ao salvar progresso no Firestore:", error);
    }
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