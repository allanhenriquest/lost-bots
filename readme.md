# 🤖 Lost Bots

Um jogo de **lógica e programação** desenvolvido com **Phaser 3** e **Firebase**.  
O jogador controla robôs (e outros personagens) através de **comandos lógicos** para resolver puzzles e alcançar a saída.

---

## 📋 Pré-requisitos

Para executar este jogo localmente, **não basta** clicar duas vezes nos ficheiros `.html`.  
Devido às políticas de segurança dos navegadores (**CORS**), o Phaser precisa carregar *assets* (imagens, JSON) através de um **servidor web local**.

Você precisará de:

- 🌐 Um navegador web moderno (Chrome, Firefox, Edge, etc.)
- 🖥️ Um servidor local simples (ver opções abaixo)

---

## 🚀 Como Executar Localmente

Escolha **uma** das opções abaixo para iniciar o servidor:

---

### ✅ Opção 1: VS Code (Recomendado)

Se utiliza o **Visual Studio Code**:

1. Instale a extensão **Live Server** (por *Ritwick Dey*)
2. Abra a pasta do projeto no VS Code
3. Clique com o botão direito no ficheiro `login.html`
4. Selecione **"Open with Live Server"**

---

### 🐍 Opção 2: Python (Windows / Mac / Linux)

Abra o terminal na pasta do projeto e execute:

#### Python 3
```bash
python -m http.server 8000


### 🟢 Opção 3: Node.js (`http-server`)

Se tem o **Node.js** instalado:

```bash
npx http-server .
Depois, abra o endereço indicado no terminal
(geralmente http://127.0.0.1:8080/login.html).

🔥 Configuração do Firebase
Este projeto utiliza o Firebase para:

🔐 Autenticação (Login / Registo)

🗄️ Base de Dados (Firestore) para guardar progresso e estrelas

⚠️ Nota Importante
Os ficheiros atuais contêm uma configuração de Firebase hardcoded (apiKey, authDomain, etc.) nos seguintes ficheiros:

login.html

jogo.html

fase.html

Para garantir que o jogo funciona corretamente ou para usar a sua própria base de dados:

🛠️ Passo a Passo
Crie um projeto no Firebase Console

Ative Authentication (Email/Password)

Ative o Firestore Database

Copie o objeto firebaseConfig do seu projeto

Substitua o código existente nos 3 ficheiros HTML:

javascript
Copiar código
const firebaseConfig = {
    apiKey: "SUA_API_KEY",
    authDomain: "SEU_PROJETO.firebaseapp.com",
    projectId: "SEU_PROJETO",
    storageBucket: "SEU_PROJETO.firebasestorage.app",
    messagingSenderId: "SEU_ID",
    appId: "SEU_APP_ID"
};
📂 Estrutura do Projeto
text
Copiar código
/
├── login.html        # Ecrã de login e registo (ponto de partida)
├── jogo.html         # Hub principal e seleção de níveis
├── fase.html         # Motor do jogo (fases)
│
├── assets/           # Sprites, tiles, itens e UI
├── css/              # Estilos das páginas
│   ├── auth.css
│   ├── hub.css
│   └── jogo.css
│
├── js/               # Lógica do jogo
│   ├── main.js       # Inicialização do Phaser
│   ├── NivelScene.js # Lógica principal da fase
│   ├── niveis.js     # Configuração dos níveis
│   ├── auth.js       # Login / registo
│   ├── check-auth.js # Proteção de rotas
│   └── ui.js         # Interface e botões
🎮 Como Jogar
Crie uma conta ou faça login no ecrã inicial

Selecione um nível desbloqueado no Hub

Use os botões de comando à direita para programar o robô

Clique em EXECUTAR

Leve o robô até à Porta para vencer 🚪✨

🧠 Tecnologias Utilizadas

Phaser 3

Firebase Authentication

Firestore Database

HTML5 / CSS3 / JavaScript
