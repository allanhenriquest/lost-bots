// ARQUIVO: js/niveis.js (COMPLETO, COM NÍVEIS 6-10)

// Este arquivo define os dados de todos os níveis
const NIVEIS_DATA = {
  // === MÓDULO 1: PARTE 1 (Sequenciamento Básico) ===
  1: {
    id: 'Fase 1',
    numericId: 1,
    modulo: 1, 
    proximoNivelId: 2,
    roboPos: { x: 2, y: 2 },
    portaPos: { x: 4, y: 2 },
    obstaculos: [],
    botoes: [], // (Propriedade nova, vazia)
    recargas: [], // (Propriedade nova, vazia)
    comandosIdeal: 2,
    comandosMax2Estrelas: 4,
    comandosDisponiveis: ['direita', 'esquerda', 'cima', 'baixo'],
    briefing: `
      <h2>Bem-vindo ao Lost Bots!</h2>
      <p>O seu robô está perdido. O seu objetivo é guiá-lo até a <strong>Porta (Saída)</strong>.</p>
      <p><strong>REGRAS:</strong></p>
      <ul>
        <li>Use os botões em "Comandos Disponíveis" para criar uma sequência.</li>
        <li>Cada movimento gasta 1 ponto de <strong>Bateria</strong> (barra azul).</li>
        <li>Se colidir com paredes ou ficar sem bateria, você perde 1 <strong>Vida</strong> (corações).</li>
      </ul>
      <p>Boa sorte!</p>
    `
  },
  2: {
    id: 'Fase 2',
    numericId: 2,
    modulo: 1, 
    proximoNivelId: 3,
    roboPos: { x: 0, y: 0 },
    portaPos: { x: 2, y: 2 },
    obstaculos: [ { x: 1, y: 0 }, { x: 1, y: 1 } ],
    botoes: [],
    recargas: [],
    comandosIdeal: 4,
    comandosMax2Estrelas: 5,
    comandosDisponiveis: ['direita', 'esquerda', 'cima', 'baixo'],
    briefing: null
  },
  3: {
    id: 'Fase 3',
    numericId: 3,
    modulo: 1, 
    proximoNivelId: 4,
    roboPos: { x: 0, y: 2 },
    portaPos: { x: 3, y:2 },
    obstaculos: [ { x: 1, y: 2 }, { x: 2, y: 2 } ],
    botoes: [],
    recargas: [],
    comandosIdeal: 5,
    comandosMax2Estrelas: 5,
    comandosDisponiveis: ['direita', 'esquerda', 'cima', 'baixo'],
    briefing: null
  },
  4: {
    id: 'Fase 4',
    numericId: 4,
    modulo: 1, 
    proximoNivelId: 5,
    roboPos: { x: 2, y: 4 },
    portaPos: { x: 2, y: 0 },
    obstaculos: [],
    botoes: [],
    recargas: [],
    comandosIdeal: 4,
    comandosMax2Estrelas: 5,
    comandosDisponiveis: ['direita', 'esquerda', 'cima', 'baixo'],
    briefing: null
  },
  5: {
    id: 'Fase 5',
    numericId: 5,
    modulo: 1, 
    proximoNivelId: 6,
    roboPos: { x: 4, y: 4 },
    portaPos: { x: 2, y: 2 },
    obstaculos: [ { x: 3, y: 4 }, { x: 3, y: 3 }, { x: 2, y: 3 } ],
    botoes: [],
    recargas: [],
    comandosIdeal: 4,
    comandosMax2Estrelas: 5,
    comandosDisponiveis: ['direita', 'esquerda', 'cima', 'baixo'],
    briefing: null
  },

  // === MÓDULO 1: PARTE 2 (Botões e Recarga) ===
  6: {
    id: 'Fase 6',
    numericId: 6,
    modulo: 1, 
    proximoNivelId: 7,
    roboPos: { x: 0, y: 2 },
    portaPos: { x: 4, y: 2 }, // (Começa como 'porta_desligada.png')
    obstaculos: [],
    botoes: [ { x: 2, y: 2 } ], // ★ NOVO: Posição do botão
    recargas: [],
    comandosIdeal: 4, // 2 para o botão, 2 para a porta
    comandosMax2Estrelas: 5,
    comandosDisponiveis: ['direita', 'esquerda', 'cima', 'baixo'],
    briefing: `
      <h2>NOVA MECÂNICA: Botões</h2>
      <p>A porta de saída está desligada (<code>porta_desligada.png</code>).</p>
      <p>Para ligá-la, você deve primeiro passar por cima de <strong>todos</strong> os botões (<code>botao_desligado.png</code>) no mapa.</p>
      <p>Ao pisar num botão, ele ficará azul (<code>botao_ligado.png</code>).</p>
      <p>Quando todos os botões estiverem ligados, a porta será ativada!</p>
    `
  },
  7: {
    id: 'Fase 7',
    numericId: 7,
    modulo: 1, 
    proximoNivelId: 8,
    roboPos: { x: 0, y: 0 },
    portaPos: { x: 4, y: 4 },
    obstaculos: [],
    botoes: [],
    recargas: [ { x: 2, y: 2, valor: 3 } ], // ★ 'valor: 3' adicionado
    comandosIdeal: 8,
    comandosMax2Estrelas: 10,
    comandosDisponiveis: ['direita', 'esquerda', 'cima', 'baixo'],
    briefing: `...` // (Briefing igual)
  },
  8: {
    id: 'Fase 8',
    numericId: 8,
    modulo: 1, 
    proximoNivelId: 9,
    roboPos: { x: 0, y: 0 },
    portaPos: { x: 4, y: 4 },
    obstaculos: [],
    botoes: [ { x: 4, y: 0 } ],
    recargas: [ { x: 2, y: 0, valor: 3 } ], // ★ 'valor: 3' adicionado
    comandosIdeal: 8, 
    comandosMax2Estrelas: 10,
    comandosDisponiveis: ['direita', 'esquerda', 'cima', 'baixo'],
    briefing: `...` // (Briefing igual)
  },

  // ★ NÍVEL 9 (CORRIGIDO SEM HACK) ★
  9: {
    id: 'Fase 9',
    numericId: 9,
    modulo: 1, 
    proximoNivelId: 10,
    roboPos: { x: 2, y: 2 }, 
    portaPos: { x: 4, y: 4 },
    comandosDisponiveis: ['direita', 'esquerda', 'cima', 'baixo'],
    obstaculos: [ {x: 0, y: 3}, {x: 1, y: 3}, {x: 2, y: 3}, {x: 3, y: 3} ],
    botoes: [ { x: 0, y: 0 }, { x: 4, y: 0 } ], 
    
    // ★ SOLUÇÃO: Apenas UMA recarga com o valor necessário
    recargas: [ { x: 4, y: 3, valor: 15 } ],
    
    comandosIdeal: 18, // O caminho real é 18
    comandosMax2Estrelas: 20,
    briefing: `
      <h2>Puzzle: Labirinto de Botões</h2>
      <p>A porta só liga se <strong>ambos</strong> os botões estiverem ativos.</p>
      <p>Use a recarga com sabedoria.</p>
    `
  },
  
  // ★ NÍVEL 10 (CORRIGIDO SEM HACK) ★
  10: {
    id: 'Fase 10',
    numericId: 10,
    modulo: 1, 
    proximoNivelId: 11,
    roboPos: { x: 0, y: 4 },
    portaPos: { x: 4, y: 4 },
    obstaculos: [ {x: 1, y: 4}, {x: 2, y: 4}, {x: 3, y: 4} ], 
    botoes: [ { x: 0, y: 0 }, { x: 4, y: 0 } ],
    
    // ★ CORREÇÃO ★
    // A recarga foi movida de (2, 0) para (0, 2).
    // Agora ela está no caminho e pode ser alcançada.
    recargas: [ { x: 0, y: 2, valor: 9 } ], 
    
    comandosIdeal: 12, // O ideal de 12 passos agora funciona
    comandosMax2Estrelas: 14,
    comandosDisponiveis: ['direita', 'esquerda', 'cima', 'baixo'],
    briefing: `
      <h2>Desafio Final do Módulo 1</h2>
      <p>Demonstre o seu domínio de sequenciamento e gestão de bateria.</p>
    `
  },

  // === MÓDULO 2: PARTE 1 (Condicionais) ===
  11: {
    id: 'Fase 11',
    numericId: 11,
    modulo: 2, // Módulo 2
    proximoNivelId: 12, // (Prepara para a próxima fase)
    
    roboPos: { x: 0, y: 2 },
    portaPos: { x: 4, y: 2 },
    obstaculos: [],
    botoes: [],
    recargas: [],
    
    // ★ NOVO DESIGN: Um tigre estacionário bloqueia o caminho
    // (Como 'moverInimigos' só mexe em 'sentinela_teleport', o 'tigre' ficará parado)
    inimigos: [ { tipo: 'tigre', pos: { x: 2, y: 2 } } ],
    caminhoInimigo: [], 

    // Solução: cavar(0), direita(1), direita(1), direita(1), cavar(0), direita(1) = 4 Bateria
    comandosIdeal: 6, // 6 comandos no total
    comandosMax2Estrelas: 8,
    
    // ★ NOVOS COMANDOS: Remove IF/ELSE, adiciona CAVAR
    comandosDisponiveis: ['direita', 'esquerda','cima','baixo', 'cavar'],
    
    briefing: `
      <h2>MÓDULO 2: Habilidades</h2>
      <p>Este nível apresenta a <strong>Raposa</strong> e sua habilidade: <strong>CAVAR</strong>.</p>
      <p>O Tigre bloqueia o caminho. Robôs normais seriam capturados.</p>
      <p><strong>REGRAS DA RAPOSA:</strong></p>
      <ul>
        <li>O comando <strong>CAVAR</strong> não gasta bateria, mas gasta um turno.</li>
        <li>Enquanto estiver enterrada, a Raposa fica <strong>imune a inimigos</strong>.</li>
        <li>Você deve <strong>CAVAR</strong> novamente para voltar ao normal e poder interagir com a porta.</li>
      </ul>
    `
  },
12: {
    id: 'Fase 12',
    numericId: 12,
    modulo: 2, // Módulo 2
    proximoNivelId: null, // (Por enquanto)
    
    roboPos: { x: 0, y: 2 }, // Começa na esquerda
    portaPos: { x: 4, y: 2 }, // Porta na direita
    obstaculos: [],
    botoes: [],
    recargas: [],
    
    // O inimigo que se teletransporta
    inimigos: [ { tipo: 'sentinela_teleport', pos: { x: 2, y: 2 } } ],
    // O inimigo alterna entre (2, 2) e (0, 0)
    caminhoInimigo: [ { x: 2, y: 2 }, { x: 0, y: 0 } ], 

    comandosIdeal: 5, // (direita, se/senao(esperar/direita), fim-se, direita, direita)
    comandosMax2Estrelas: 7,
    
    // Comandos disponíveis para este nível
    // Note que 'cavar' não está aqui
    comandosDisponiveis: ['if_perigo_frente', 'else', 'fim_se', 'esperar', 'direita'],
    
    briefing: `
      <h2>MÓDULO 2: Condicionais (SE/SENÃO)</h2>
      <p>Este inimigo (Sentinela) muda de lugar a cada turno. Ele bloqueia o caminho em <strong>(2, 2)</strong> ou se move para <strong>(0, 0)</strong>.</p>
      <p>Você não pode usar a Raposa aqui. Você deve usar lógica!</p>
      <p><strong>REGRAS DAS CONDICIONAIS:</strong></p>
      <ul>
        <li>Use <strong>SE (INIMIGO À FRENTE)</strong> para verificar o caminho.</li>
        <li>Se for verdade, use <strong>ESPERAR</strong>.</li>
        <li>Se for falso (SENÃO), o caminho está livre e você pode usar <strong>IR PARA DIREITA</strong>.</li>
      </ul>
    `
  }
};

// Constantes do Jogo
const GRID_SIZE = 96;
const GRID_COUNT = 5;
const MAP_SIZE = GRID_SIZE * GRID_COUNT; // 480px
const SPRITE_SCALE = 0.08;