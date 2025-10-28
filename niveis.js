// Este arquivo define os dados de todos os níveis
const NIVEIS_DATA = {
  1: {
    id: 'Fase 1',
    numericId: 1,
    proximoNivelId: 2,
    roboPos: { x: 2, y: 2 },
    portaPos: { x: 4, y: 2 },
    comandosIdeal: 2, // "frente", "frente"
    comandosMax2Estrelas: 4 // Limite para 2 estrelas
  },
  2: {
    id: 'Fase 2',
    numericId: 2,
    proximoNivelId: 3,
    roboPos: { x: 0, y: 0 },
    portaPos: { x: 4, y: 4 },
    comandosIdeal: 8, // 4x frente, 4x baixo
    comandosMax2Estrelas: 10
  },
  3: {
    id: 'Fase 3',
    numericId: 3,
    proximoNivelId: 4,
    roboPos: { x: 0, y: 2 },
    portaPos: { x: 4, y: 0 },
    comandosIdeal: 6, // 4x frente, 2x cima
    comandosMax2Estrelas: 8
  },
  4: {
    id: 'Fase 4',
    numericId: 4,
    proximoNivelId: 5,
    roboPos: { x: 2, y: 4 },
    portaPos: { x: 2, y: 0 },
    comandosIdeal: 4, // 4x cima
    comandosMax2Estrelas: 6
  },
  5: {
    id: 'Fase 5',
    numericId: 5,
    proximoNivelId: null, // null indica que é a última fase
    roboPos: { x: 4, y: 4 },
    portaPos: { x: 0, y: 0 },
    comandosIdeal: 8, // 4x tras, 4x cima
    comandosMax2Estrelas: 10
  }
};

// Constantes do Jogo
const GRID_SIZE = 96;
const GRID_COUNT = 5;
const MAP_SIZE = GRID_SIZE * GRID_COUNT; // 480px
const SPRITE_SCALE = 0.08;