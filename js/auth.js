// NOVO ARQUIVO: js/auth.js

// --- Funções para alternar os formulários ---
function mostrarRegistro() {
  document.getElementById('login-form').style.display = 'none';
  document.getElementById('registro-form').style.display = 'block';
}
function mostrarLogin() {
  document.getElementById('login-form').style.display = 'block';
  document.getElementById('registro-form').style.display = 'none';
}

// --- Funções de Login/Registro ---
function fazerLogin() {
  const email = document.getElementById('login-email').value;
  const senha = document.getElementById('login-senha').value;
  const erroEl = document.getElementById('login-erro');

  auth.signInWithEmailAndPassword(email, senha)
    .then((userCredential) => {
      console.log('Login OK:', userCredential.user.email);
      // SUCESSO! Redireciona para a página do jogo
      window.location.href = 'jogo.html';
    })
    .catch((error) => {
      erroEl.textContent = 'Erro: ' + error.message;
    });
}

function fazerRegistro() {
  const email = document.getElementById('registro-email').value;
  const senha = document.getElementById('registro-senha').value;
  const erroEl = document.getElementById('registro-erro');

  auth.createUserWithEmailAndPassword(email, senha)
    .then((userCredential) => {
      console.log('Registro OK:', userCredential.user.email);
      
      // Cria o documento do usuário no Firestore
      db.collection('usuarios').doc(userCredential.user.uid).set({
        email: userCredential.user.email,
        xpTotal: 0,
        vidasAtuais: 4,
        ultimaRecargaVida: new Date()
      })
      .then(() => {
        // SUCESSO! Redireciona para a página do jogo
        window.location.href = 'jogo.html';
      })
      .catch((dbError) => {
        erroEl.textContent = 'Erro ao salvar dados: ' + dbError.message;
      });
      
    })
    .catch((error) => {
      erroEl.textContent = 'Erro: ' + error.message;
    });
}