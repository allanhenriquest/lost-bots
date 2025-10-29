// ARQUIVO: js/hub.js (Atualizado)

// Espera o DOM carregar e o check-auth.js verificar o usuário
auth.onAuthStateChanged((user) => {
  if (user) {
    // O usuário está logado, podemos carregar os dados
    carregarProgresso(user.uid);
  }
});

async function carregarProgresso(userId) {
  const containerNiveis = document.getElementById('lista-niveis-1');
  if (!containerNiveis) return;
  
  containerNiveis.innerHTML = "Carregando níveis...";

  let progressoSnapshot;
  
  // --- ADICIONADO: Bloco try...catch ---
  try {
    // 1. Pega os dados de progresso do usuário no Firestore
    progressoSnapshot = await db.collection('progressoNiveis')
                                   .where('userId', '==', userId)
                                   .get();
  } catch (error) {
    console.error("Erro do Firestore ao buscar progresso:", error);
    // Se o erro for de "Índice", o Firebase dará um link no console (F12)
    if (error.code === "failed-precondition") {
        containerNiveis.innerHTML = `<p class="erro">Erro: Índice do Firestore em falta. Abra o console (F12) e clique no link no erro para criar o índice.</p>`;
    } else {
        containerNiveis.innerHTML = `<p class="erro">Erro ao carregar níveis: ${error.message}</p>`;
    }
    return; // Para a função aqui
  }

  // 2. Mapeia o progresso para fácil acesso (ex: progresso[1] = 3 estrelas)
  const progresso = {};
  progressoSnapshot.forEach(doc => {
    const data = doc.data();
    // --- CORRIGIDO: Typo 'estrelasObtidase' para 'estrelasObtidas' ---
    progresso[data.nivelId] = data.estrelasObtidas;
  });

  // 3. Pega os dados estáticos dos níveis (do seu niveis.js)
  if (typeof NIVEIS_DATA === 'undefined') {
    containerNiveis.innerHTML = "Erro: niveis.js não foi carregado.";
    return;
  }
  
  // 4. Limpa o container e desenha os cards
  containerNiveis.innerHTML = "";
  
  // Filtra apenas os níveis do Módulo 1 (ex: 1 ao 5)
  const niveisModulo1 = Object.values(NIVEIS_DATA); 
  
  niveisModulo1.forEach(nivel => {
    const nivelId = nivel.numericId;
    const estrelas = progresso[nivelId] || 0; // Pega estrelas salvas, ou 0
    
    // Desenha o HTML do card para este nível
    containerNiveis.innerHTML += `
      <div class="nivel-card">
        <h3>${nivel.id}</h3>
        <div class="estrelas-container">
          <span class="${estrelas >= 1 ? 'cheia' : ''}">★</span>
          <span class="${estrelas >= 2 ? 'cheia' : ''}">★</span>
          <span class="${estrelas >= 3 ? 'cheia' : ''}">★</span>
        </div>
        <button onclick="jogarNivel(${nivelId})">JOGAR</button>
      </div>
    `;
    
    // TODO: Adicionar lógica para bloquear níveis futuros
  });
}

function jogarNivel(nivelId) {
  // Redireciona para a página do jogo, passando o nível na URL
  window.location.href = `fase.html?nivel=${nivelId}`;
}