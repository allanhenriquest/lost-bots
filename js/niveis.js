// ARQUIVO: js/niveis.js (COMPLETO, COM NÍVEIS 6-10)

// Este arquivo define os dados de todos os níveis
const NIVEIS_DATA = {
  // === MÓDULO 1: PARTE 1 (Sequenciamento Básico) ===
  1: {
    id: 'Fase 1',
    numericId: 1,
    heroi: 'robo',
    modulo: 1,
    proximoNivelId: 2,
    roboPos: { x: 2, y: 2 },
    portaPos: { x: 4, y: 2 },
    obstaculos: [],
    botoes: [],
    recargas: [],
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
    heroi: 'robo',
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
    heroi: 'robo',
    modulo: 1,
    proximoNivelId: 4,
    roboPos: { x: 0, y: 2 },
    portaPos: { x: 3, y: 2 },
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
    heroi: 'robo',
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
    heroi: 'robo',
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
    heroi: 'robo',
    modulo: 1,
    proximoNivelId: 7,
    roboPos: { x: 0, y: 2 },
    portaPos: { x: 4, y: 2 },
    obstaculos: [],
    botoes: [ { x: 2, y: 2 } ],
    recargas: [],
    comandosIdeal: 4,
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
    heroi: 'robo',
    modulo: 1,
    proximoNivelId: 8,
    roboPos: { x: 0, y: 0 },
    portaPos: { x: 4, y: 4 },
    obstaculos: [],
    botoes: [],
    recargas: [ { x: 2, y: 2, valor: 3 } ],
    comandosIdeal: 8,
    comandosMax2Estrelas: 10,
    comandosDisponiveis: ['direita', 'esquerda', 'cima', 'baixo'],
    briefing: `
      <h2>NOVA MECÂNICA: Recarga</h2>
      <p>A sua bateria inicial é de apenas <strong>5 unidades</strong>, mas a porta está a <strong>8 passos</strong> de distância.</p>
      <p>Você não conseguirá chegar lá diretamente.</p>
      <p><strong>OBJETIVO:</strong></p>
      <ul>
        <li>Planeje seu caminho para passar por cima do ícone de <strong>Recarga</strong> (Bateria).</li>
        <li>Isso adicionará <strong> energia</strong> ao seu robô, permitindo completar a viagem.</li>
      </ul>
    `
    
  },
  8: {
    id: 'Fase 8',
    numericId: 8,
    heroi: 'robo',
    modulo: 1,
    proximoNivelId: 9,
    roboPos: { x: 0, y: 0 },
    portaPos: { x: 4, y: 4 },
    obstaculos: [],
    botoes: [ { x: 4, y: 0 } ],
    recargas: [ { x: 2, y: 0, valor: 3 } ],
    comandosIdeal: 8,
    comandosMax2Estrelas: 10,
    comandosDisponiveis: ['direita', 'esquerda', 'cima', 'baixo'],
    briefing: `...`
  },

  // ★ NÍVEL 9 (CORRIGIDO SEM HACK) ★
  9: {
    id: 'Fase 9',
    numericId: 9,
    heroi: 'robo',
    modulo: 1,
    proximoNivelId: 10,
    roboPos: { x: 2, y: 2 },
    portaPos: { x: 4, y: 4 },
    comandosDisponiveis: ['direita', 'esquerda', 'cima', 'baixo'],
    obstaculos: [ {x: 0, y: 3}, {x: 1, y: 3}, {x: 2, y: 3}, {x: 3, y: 3} ],
    botoes: [ { x: 0, y: 0 }, { x: 4, y: 0 } ],
    recargas: [ { x: 4, y: 3, valor: 15 } ],
    comandosIdeal: 18,
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
    heroi: 'robo',
    modulo: 1,
    proximoNivelId: 11,
    roboPos: { x: 0, y: 4 },
    portaPos: { x: 4, y: 4 },
    obstaculos: [ {x: 1, y: 4}, {x: 2, y: 4}, {x: 3, y: 4} ],
    botoes: [ { x: 0, y: 0 }, { x: 4, y: 0 } ],

    // Correção: recarga movida para (0, 2)
    recargas: [ { x: 0, y: 2, valor: 9 } ],

    comandosIdeal: 12,
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
    heroi: 'raposa',
    modulo: 2,
    proximoNivelId: 12,

    roboPos: { x: 0, y: 2 },
    portaPos: { x: 4, y: 2 },
    obstaculos: [],
    botoes: [],
    recargas: [],

    inimigos: [ { tipo: 'tigre', pos: { x: 2, y: 2 } } ],
    caminhoInimigo: [],

    comandosIdeal: 6,
    comandosMax2Estrelas: 8,

    comandosDisponiveis: ['direita', 'esquerda', 'cima', 'baixo', 'cavar'],

    briefing: `
      <h2>MÓDULO 2: Habilidades</h2>
      <p>Este nível apresenta a <strong>Raposa</strong> e sua habilidade: <strong>CAVAR</strong>.</p>
      <p>O Tigre bloqueia o caminho. Robôs normais seriam capturados.</p>
      <ul>
        <li><strong>CAVAR</strong> não gasta bateria.</li>
        <li>Enterrada, a raposa é imune ao inimigo.</li>
        <li>Cave novamente para emergir e interagir com a porta.</li>
      </ul>
    `
  },

  // === NÍVEL 12: HABILIDADE CONDICIONAL ===
  12: {
    id: 'Fase 12',
    numericId: 12,
    heroi: 'raposa',
    modulo: 2,
    proximoNivelId: 13,

    roboPos: { x: 0, y: 2 },
    portaPos: { x: 4, y: 2 },

    inimigos: [ { tipo: 'tigre', pos: { x: 3, y: 2 } } ],
    caminhoInimigo: [ { x: 2, y: 2 }, { x: 3, y: 2 } ],

    obstaculos: [],
    botoes: [],
    recargas: [],

    comandosIdeal: 7,
    comandosMax2Estrelas: 9,

    comandosDisponiveis: [
      'if_risco_frente',
      'fim_se',
      'cavar',
      'direita'
    ],

    briefing: `
      <h2>MÓDULO 2: Habilidade Condicional</h2>
      <p>Use SE (RISCO À FRENTE) para detectar o território do Tigre.</p>
      <p>Quando houver risco, use CAVAR para passar com segurança.</p>
      <p>Ao cavar, o personagem pode ocupar o mesmo quadrado do Tigre.</p>
      <p>Não é necessário voltar a superfície para vencer o nível.</p>
    `
  },

  // === NÍVEL 13: DESAFIO FINAL DO MÓDULO 2 ===
  13: {
    id: 'Fase 13',
    numericId: 13,
    heroi: 'raposa',
    modulo: 2,
    proximoNivelId: 14,

    roboPos: { x: 0, y: 2 },
    portaPos: { x: 4, y: 2 },

    obstaculos: [ {x: 1, y: 2}, {x: 3, y: 2} ],
    botoes: [ { x: 2, y: 0 } ],
    recargas: [ { x: 2, y: 4, valor: 10 } ],

    inimigos: [ { tipo: 'tigre', pos: { x: 2, y: 4 } } ],
    caminhoInimigo: [ { x: 2, y: 3 }, { x: 2, y: 4 } ],

    comandosIdeal: 15,
    comandosMax2Estrelas: 18,

    comandosDisponiveis: [
      'if_risco_frente',
      'fim_se',
      'cavar',
      'esperar',
      'direita',
      'esquerda',
      'cima',
      'baixo'
    ],

    briefing: `
      <h2>MÓDULO 2: Desafio de Lógica</h2>
      <p>Passe pelo Tigre usando SE + CAVAR, pegue a recarga, ative o botão e chegue à porta.</p>
      <p>Existe uma recarga no nível e é protegida pelo Tigre.</p>
    `
  },

  // === NÍVEL 14: O CORREDOR DE RISCO ===
  14: {
    id: 'Fase 14',
    numericId: 14,
    heroi: 'raposa',
    modulo: 2,
    proximoNivelId: 15,

    roboPos: { x: 0, y: 0 },
    portaPos: { x: 4, y: 0 },

    obstaculos: [
      {x: 0, y: 1}, {x: 1, y: 1},
      {x: 3, y: 1}, {x: 4, y: 1}
    ],

    botoes: [ { x: 4, y: 2 } ],
    recargas: [ { x: 2, y: 3, valor: 10 } ],
    inimigos: [ { tipo: 'tigre', pos: { x: 2, y: 2 } } ],

    caminhoInimigo: [
      {x: 2, y: 2},
      {x: 3, y: 2},
      {x: 4, y: 2},
      {x: 4, y: 3},
      {x: 3, y: 3},
      {x: 2, y: 3},
      {x: 1, y: 3},
      {x: 0, y: 3},
      {x: 0, y: 2}
    ],

    comandosIdeal: 25,
    comandosMax2Estrelas: 25,

    comandosDisponiveis: [
      'if_risco_frente',
      'fim_se',
      'cavar',
      'esperar',
      'direita',
      'esquerda',
      'cima',
      'baixo'
    ],

    briefing: `
      <h2>MÓDULO 2: O Corredor de Risco</h2>
      <p>Use SE + CAVAR para atravessar o corredor patrulhado e ativar o botão.</p>
    `
  },

  // === NÍVEL 15: O ELEFANTE ===
  15: {
    id: 'Fase 15',
    numericId: 15,
    heroi: 'elefante',
    modulo: 2,
    proximoNivelId: null,

    roboPos: { x: 0, y: 2 },
    portaPos: { x: 4, y: 2 },

    pocos: [
      { x: 1, y: 2 },
      { x: 2, y: 2 }
    ],

    fogo: [ { x: 3, y: 2 } ],

    obstaculos: [
      {x: 0, y: 1}, {x: 1, y: 1}, {x: 2, y: 1}, {x: 3, y: 1}, {x: 4, y: 1},
      {x: 0, y: 3}, {x: 1, y: 3}, {x: 2, y: 3}, {x: 3, y: 3}, {x: 4, y: 3}
    ],

    botoes: [],
    recargas: [],
    inimigos: [],
    caminhoInimigo: [],

    comandosIdeal: 9,
    comandosMax2Estrelas: 9,

    comandosDisponiveis: [
      'if_fogo_frente',
      'if_elefante_cheio',
      'fim_se',
      'apagar_fogo',
      'absorver_agua',
      'direita',
      'esquerda',
      'cima',
      'baixo'
    ],

    briefing: `
      <h2>MÓDULO 2: O Elefante</h2>
      <p>Colete água das poças, encha o reservatório do elefante e apague o fogo.</p>
      <p>Só é possível coletar água das poças estando no quadrado delas.</p>
      <p>O Elefante só fica cheio para apagar as poças absorvendo duas poças.</p>
  `
  }
};

// Constantes do Jogo
const GRID_SIZE = 96;
const GRID_COUNT = 5;
const MAP_SIZE = GRID_SIZE * GRID_COUNT; // 480px
const SPRITE_SCALE = 0.08;