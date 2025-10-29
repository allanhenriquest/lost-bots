// ARQUIVO: js/niveis.js (ATUALIZADO)

// Este arquivo define os dados de todos os níveis
const NIVEIS_DATA = {
  // === NÍVEL 1 (Sem alteração) ===
  1: {
    id: 'Fase 1',
    numericId: 1,
    proximoNivelId: 2,
    roboPos: { x: 2, y: 2 },
    portaPos: { x: 4, y: 2 },
    obstaculos: [], // Nível 1 não tem obstáculos
    comandosIdeal: 2, // "frente", "frente"
    comandosMax2Estrelas: 4
  },
  
  // === NÍVEL 2 (Redesenhado) ===
  // (Original: 8 movimentos)
  // Novo: 4 movimentos ideais. Uma parede força um desvio.
  2: {
    id: 'Fase 2',
    numericId: 2,
    proximoNivelId: 3,
    roboPos: { x: 0, y: 0 },
    portaPos: { x: 2, y: 2 },
    // ADICIONADO: Posição do(s) novo(s) obstáculo(s)
    obstaculos: [
      { x: 1, y: 0 }, // Parede bloqueando o caminho direto
      { x: 1, y: 1 }
    ],
    comandosIdeal: 4, // baixo, baixo, frente, frente
    comandosMax2Estrelas: 5
  },

  // === NÍVEL 3 (Redesenhado) ===
  // (Original: 6 movimentos)
  // Novo: 5 movimentos ideais. Um "S".
  3: {
    id: 'Fase 3',
    numericId: 3,
    proximoNivelId: 4,
    roboPos: { x: 0, y: 2 },
    portaPos: { x: 3, y:2 },
    obstaculos: [
      { x: 1, y: 2 }, // Paredes forçando um "S"
      { x: 2, y: 2 }
    ],
    comandosIdeal: 5, // cima, frente, frente, frente, baixo
    comandosMax2Estrelas: 5 // 5 é o limite da bateria
  },

  // === NÍVEL 4 (Sem alteração) ===
  4: {
    id: 'Fase 4',
    numericId: 4,
    proximoNivelId: 5,
    roboPos: { x: 2, y: 4 },
    portaPos: { x: 2, y: 0 },
    obstaculos: [],
    comandosIdeal: 4, // 4x cima
    comandosMax2Estrelas: 5 // Ajustado para 5
  },

  // === NÍVEL 5 (Redesenhado) ===
  // (Original: 8 movimentos)
  // Novo: 4 movimentos ideais. Um labirinto simples.
  5: {
    id: 'Fase 5',
    numericId: 5,
    proximoNivelId: null, // null indica que é a última fase
    roboPos: { x: 4, y: 4 },
    portaPos: { x: 2, y: 2 },
    obstaculos: [
      { x: 3, y: 4 },
      { x: 3, y: 3 },
      { x: 2, y: 3 }
    ],
    comandosIdeal: 4, // cima, cima, tras, tras
    comandosMax2Estrelas: 5
  }
};

// Constantes do Jogo (Sem alteração)
const GRID_SIZE = 96;
const GRID_COUNT = 5;
const MAP_SIZE = GRID_SIZE * GRID_COUNT; // 480px
const SPRITE_SCALE = 0.08;