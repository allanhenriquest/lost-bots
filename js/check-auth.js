// NOVO ARQUIVO: js/check-auth.js

auth.onAuthStateChanged((user) => {
  if (user) {
    // --- USUÁRIO ESTÁ LOGADO ---
    console.log('Autenticação verificada. Usuário:', user.email);
    // O usuário está logado, então podemos deixar o jogo carregar.
    
    // (Opcional) Adiciona o email e botão de Sair no header
    const statusDiv = document.getElementById('game-status');
    if (statusDiv) {
      statusDiv.innerHTML = `<span>${user.email}</span> <button onclick="fazerLogout()" class="logout-btn">Sair</button>`;
    }
    
  } else {
    // --- USUÁRIO ESTÁ DESLOGADO ---
    console.log('Usuário não autenticado. Redirecionando para login...');
    // Redireciona para a página de login
    window.location.href = 'login.html';
  }
});

function fazerLogout() {
  auth.signOut().then(() => {
    // O onAuthStateChanged vai detectar a mudança e redirecionar
    console.log('Usuário deslogado.');
  });
}