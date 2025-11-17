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
    heroi: 'robo',
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
    heroi: 'robo',
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
    heroi: 'robo',
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
    heroi: 'robo',
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
    heroi: 'raposa',
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
// NÍVEL 12: HABILIDADE CONDICIONAL (RAPOSA + RISCO)
  12: {
    id: 'Fase 12',
    numericId: 12,
    heroi: 'raposa',
    modulo: 2, 
    proximoNivelId: null, // (Por enquanto)
    
    roboPos: { x: 0, y: 2 }, // Começa na esquerda
    portaPos: { x: 4, y: 2 }, // Porta na direita
    
    // Um tigre estático bloqueia o caminho
    // Ele não se move, mas é perigoso
    inimigos: [ { tipo: 'tigre', pos: { x: 3, y: 2 } } ],
    
    // O "território inimigo" (RISCO) é marcado com 'path.png'
    // A função 'checarCondicao' vai detectar isso
    caminhoInimigo: [ { x: 2, y: 2 }, { x: 3, y: 2 } ], 
    
    obstaculos: [],
    botoes: [],
    recargas: [],

    // Solução: direita, se(risco)->[cavar, direita, direita, cavar], fim-se, direita
    comandosIdeal: 7,
    comandosMax2Estrelas: 9,
    
    // Comandos disponíveis (usando 'if_risco_frente' e 'cavar')
    comandosDisponiveis: ['if_risco_frente', 'else', 'fim_se', 'cavar', 'direita'],
    
    briefing: `
      <h2>MÓDULO 2: Habilidade Condicional</h2>
      <p>O Tigre guarda o caminho, e o território dele é marcado como uma zona de <strong>RISCO</strong> (piso diferente).</p>
      <p>Você deve usar a <strong>Raposa</strong>.</p>
      <p>Use <strong>SE (RISCO À FRENTE)</strong> para verificar se você está prestes a entrar no território inimigo e, então, <strong>CAVAR</strong> para passar com segurança.</p>
    `
  },
// NÍVEL 13: DESAFIO FINAL (Botão, Recarga, Risco, Inimigo e IF/ELSE)
  13: {
    id: 'Fase 13',
    numericId: 13,
    heroi: 'raposa',
    modulo: 2, 
    proximoNivelId: null, // Fim do Módulo 2 por enquanto
    
    roboPos: { x: 0, y: 2 }, // Começa na esquerda
    portaPos: { x: 4, y: 2 }, // Porta na direita
    
    // Obstáculos forçam o jogador a desviar por cima ou por baixo
    obstaculos: [ {x: 1, y: 2}, {x: 3, y: 2} ],
    
    // Botão (no topo) é obrigatório para ligar a porta
    botoes: [ { x: 2, y: 0 } ],
    
    // Recarga (embaixo) é obrigatória para ter bateria
    recargas: [ { x: 2, y: 4, valor: 10 } ], // Bateria extra para o caminho longo
    
    // O Tigre (Inimigo) está sobre a recarga
    inimigos: [ { tipo: 'tigre', pos: { x: 2, y: 4 } } ],
    
    // A zona da recarga é marcada como "RISCO" (path.png)
    caminhoInimigo: [ { x: 2, y: 3 }, { x: 2, y: 4 } ], 
    
    // O caminho ideal é longo, ~13-15 movimentos
    comandosIdeal: 15,
    comandosMax2Estrelas: 18,
    
    // Todos os comandos do Módulo 2 estão disponíveis
    comandosDisponiveis: [
      'if_risco_frente', 
      'else', 
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
      <p>A porta <strong>(4, 2)</strong> está desligada e o caminho é longo demais para a bateria inicial.</p>
      <p>Você deve usar a <strong>Raposa</strong> para:</p>
      <ol>
        <li>Pegar a <strong>Recarga</strong> em (2, 4).</li>
        <li>Ativar o <strong>Botão</strong> em (2, 0).</li>
        <li>Chegar à Porta.</li>
      </ol>
      <p><strong>CUIDADO:</strong> A Recarga está em uma zona de <strong>RISCO</strong> e guardada por um Tigre. Use <code>SE (RISCO À FRENTE)</code> e <code>CAVAR</code>!</p>
    `
  },
14: {
    id: 'Fase 14',
    numericId: 14,
    heroi: 'raposa',
    modulo: 2, 
    proximoNivelId: null, // Fim do Módulo 2 por enquanto
    
    roboPos: { x: 0, y: 0 }, // Canto superior esquerdo
    portaPos: { x: 4, y: 0 }, // Canto superior direito
    
    // Uma parede sólida que separa a linha 0 (segura) das linhas 1-4 (perigosas)
    obstaculos: [ {x: 0, y: 1}, {x: 1, y: 1}, {x: 3, y: 1}, {x: 4, y: 1} ],
    
    // O Botão (para a porta) está no fim do corredor de risco
    botoes: [ { x: 4, y: 2 } ],
    
    // A Recarga (necessária) está no meio do corredor
    recargas: [ { x: 2, y: 3, valor: 10 } ],
    
    // O Tigre (Inimigo) patrulha este corredor
    inimigos: [ { tipo: 'tigre', pos: { x: 2, y: 2 } } ],
    
    // O 'caminhoInimigo' (RISCO) define todo o corredor
    caminhoInimigo: [ 
      { x: 2, y: 2 }, 
      { x: 3, y: 2 }, 
      { x: 4, y: 2 }, // Onde está o Botão
      { x: 4, y: 3 }, 
      { x: 3, y: 3 },
      { x: 2, y: 3 }, // Onde está a Recarga
      { x: 1, y: 3 },
      { x: 0, y: 3 },
      { x: 0, y: 2 }
    ], 
    
    comandosIdeal: 20,
    comandosMax2Estrelas: 25,
    
    // Todos os comandos do Módulo 2 estão disponíveis
    comandosDisponiveis: [
      'if_risco_frente', 
      'else', 
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
      <p>A Porta <strong>(4, 0)</strong> está trancada. A única passagem para o Botão e a Recarga é pela abertura em (2, 1).</p>
      <p>O corredor de <strong>RISCO</strong> é patrulhado por um Tigre. Você deve usar a <strong>Raposa</strong>.</p>
      <p>Use <code>SE (RISCO À FRENTE)</code> para <code>CAVAR</code> antes de entrar, e <code>CAVAR</code> novamente para sair e apertar o botão na parede norte <strong>(4, 1)</strong>.</p>
    `
  },
15: {
    id: 'Fase 15',
    numericId: 15,
    heroi: 'elefante', // Define o herói
    modulo: 2, 
    proximoNivelId: null,
    
    // Layout do Corredor (Linha Y=2)
    roboPos: { x: 0, y: 2 },  // Início
    portaPos: { x: 4, y: 2 }, // Fim
    
    pocos: [ 
      { x: 1, y: 2 }, // Poça 1
      { x: 2, y: 2 }  // Poça 2
    ],
    
    fogo: [ { x: 3, y: 2 } ], // Fogo
    
    // Paredes que formam o corredor
    obstaculos: [ 
      // Parede de cima (y=1)
      {x: 0, y: 1}, {x: 1, y: 1}, {x: 2, y: 1}, {x: 3, y: 1}, {x: 4, y: 1},
      // Parede de baixo (y=3)
      {x: 0, y: 3}, {x: 1, y: 3}, {x: 2, y: 3}, {x: 3, y: 3}, {x: 4, y: 3}
    ],

    botoes: [],
    recargas: [],
    inimigos: [],
    caminhoInimigo: [], 
    
    // Solução: direita, absorver, direita, absorver, direita, apagar_fogo, direita
    comandosIdeal: 7,
    comandosMax2Estrelas: 9,
    
    comandosDisponiveis: [
      // Comandos Condicionais (IFs)
      'if_fogo_frente', 
      'if_elefante_cheio',
      
      // ★ CORREÇÃO: Adicionados os comandos de bloco
      'else',
      'fim_se',
      
      // Comandos de Ação (Elefante)
      'apagar_fogo', 
      'absorver_agua', 
      
      // Comandos de Movimento
      'direita', 
      'esquerda', 
      'cima', 
      'baixo'
    ],
    
    // Texto do tutorial (Briefing)
    briefing: `
      <h2>MÓDULO 2: O Elefante</h2>
      <p>Este é o <strong>Elefante</strong>. Ele precisa apagar o <strong>Fogo</strong> para chegar à porta.</p>
      <p><strong>REGRAS:</strong></p>
      <ul>
        <li>O Elefante começa vazio (<code>elefante_vazio.png</code>).</li>
        <li>Você deve parar <strong>sobre</strong> uma <strong>Poça de Água</strong> (<code>poca_agua.png</code>).</li>
        <li>Use o comando <strong>ABSORVER ÁGUA</strong> para coletar a água. A poça sumirá.</li>
        <li>Você precisa de <strong>2 poças</strong> para encher o reservatório (<code>elefante_agua.png</code>).</li>
        <li>Quando estiver cheio e <strong>adjacente</strong> (ao lado) do Fogo, use o comando <strong>APAGAR FOGO</strong>.</li>
        <li>Apagar o fogo gasta <strong>toda</strong> a sua água.</li>
      </ul>
      <p><strong>Objetivo:</strong> Colete as duas poças, apague o fogo e chegue à porta.</p>
    `
  }
};


// Constantes do Jogo
const GRID_SIZE = 96;
const GRID_COUNT = 5;
const MAP_SIZE = GRID_SIZE * GRID_COUNT; // 480px
const SPRITE_SCALE = 0.08;