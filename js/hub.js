// ARQUIVO: js/hub.js (COMPLETO E ATUALIZADO PARA MÓDULOS)

auth.onAuthStateChanged((user) => {
  if (user) {
    carregarProgresso(user.uid);
  }
});

async function carregarProgresso(userId) {
  // 1. Pega os containers dos módulos
  const containerMod1 = document.getElementById('lista-niveis-1');
  const containerMod2 = document.getElementById('lista-niveis-2');
  const moduloCondicionais = document.getElementById('modulo-condicionais');
  
  if (!containerMod1 || !containerMod2) return;
  
  containerMod1.innerHTML = "Carregando...";
  containerMod2.innerHTML = ""; // Limpa por via das dúvidas

  let progresso = {};
  let estrelasModulo1 = 0; // ★ NOVO: Contador de estrelas

  try {
    // 2. Busca todo o progresso do usuário
    const snapshot = await db.collection('progressoNiveis')
                             .where('userId', '==', userId)
                             .get();
    
    // 3. Mapeia o progresso e conta as estrelas
    snapshot.forEach(doc => {
      const data = doc.data();
      progresso[data.nivelId] = data.estrelasObtidas;
      
      // Se o nível for do Módulo 1 (ID 1 a 5), soma as estrelas
      if (data.nivelId >= 1 && data.nivelId <= 5) {
        estrelasModulo1 += data.estrelasObtidas;
      }
    });

  } catch (error) {
    console.error("Erro ao buscar progresso:", error);
    containerMod1.innerHTML = `<p class="erro">Erro ao carregar. Tente recarregar a página.</p>`;
    return;
  }

  // 4. Garante que niveis.js foi carregado
  if (typeof NIVEIS_DATA === 'undefined') {
    containerMod1.innerHTML = "Erro: Dados dos níveis não encontrados.";
    return;
  }
  
  // 5. ★ LÓGICA DE DESBLOQUEIO DE MÓDULO ★
  // (Baseado na especificação: 70% das estrelas)
  // Módulo 1 tem 15 estrelas (5 níveis * 3). 70% = 10.5. Arredondado = 11.
  const mod2Desbloqueado = (estrelasModulo1 >= 11); 
  
  if (mod2Desbloqueado) {
    moduloCondicionais.classList.remove('modulo-bloqueado');
    moduloCondicionais.querySelector('h2').innerText = 'Módulo 2: Condicionais';
  }

  // 6. Renderiza os níveis, separando por módulo
  containerMod1.innerHTML = "";
  containerMod2.innerHTML = "";
  
  const niveis = Object.values(NIVEIS_DATA);
  niveis.sort((a, b) => a.numericId - b.numericId);

  niveis.forEach(nivel => {
    const id = nivel.numericId;
    const estrelas = progresso[id] || 0;
    
    // Lógica de bloqueio de NÍVEL (igual à anterior)
    let nivelBloqueado = false;
    if (id > 1) { // Nível 1 está sempre desbloqueado
      const estrelasAnterior = progresso[id - 1] || 0;
      if (estrelasAnterior === 0) {
        nivelBloqueado = true;
      }
    }
    
    // Lógica de bloqueio de MÓDULO
    if (nivel.modulo === 2 && !mod2Desbloqueado) {
      nivelBloqueado = true;
    }

    // Cria o HTML do card
    const cardHTML = `
      <div class="nivel-card ${nivelBloqueado ? 'bloqueado' : ''}">
        <h3>${nivel.id}</h3>
        <div class="estrelas-container">
          ${nivelBloqueado ? '🔒' : gerarEstrelasHTML(estrelas)}
        </div>
        <button onclick="jogarNivel(${id})" ${nivelBloqueado ? 'disabled' : ''}>
          ${nivelBloqueado ? 'BLOQUEADO' : 'JOGAR'}
        </button>
      </div>
    `;
    
    // Adiciona o card ao container do módulo correto
    if (nivel.modulo === 1) {
      containerMod1.innerHTML += cardHTML;
    } else if (nivel.modulo === 2) {
      containerMod2.innerHTML += cardHTML;
    }
  });
}

// (As funções auxiliares permanecem as mesmas)
function gerarEstrelasHTML(numEstrelas) {
  let html = '';
  for (let i = 0; i < 3; i++) {
    html += `<span class="${i < numEstrelas ? 'cheia' : ''}">★</span>`;
  }
  return html;
}

function jogarNivel(nivelId) {
  // O 'disabled' no HTML já trata o bloqueio
  window.location.href = `fase.html?nivel=${nivelId}`;
}