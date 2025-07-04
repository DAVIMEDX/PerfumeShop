document.addEventListener('DOMContentLoaded', () => {
  // Lógica para Cadastro
  const cadastroForm = document.getElementById('cadastroForm');
  if (cadastroForm) {
    cadastroForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const nome = document.getElementById('nome').value;
      const email = document.getElementById('emailCadastro').value;
      const senha = document.getElementById('senhaCadastro').value;
      if (!nome || !email || !senha) {
        alert('Por favor, preencha todos os campos.');
        return;
      }
      alert('Cadastro realizado com sucesso! (Simulação)');
      window.location.href = 'login.html';
    });
  }

  // Lógica para Login (usuário e administrador)
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const email = document.getElementById('emailLogin').value;
      const senha = document.getElementById('senhaLogin').value;
      if (!email || !senha) {
        alert('Por favor, preencha e-mail e senha.');
        return;
      }

      // Login de administrador (RF008)
      if (email === 'admin@admin.com' && senha === 'admin123') {
        alert('Login de administrador bem-sucedido!');
        localStorage.setItem('adminLogado', 'true');
        window.location.href = 'admin.html';
        return;
      }

      // Login de cliente (simulado)
      if (email === 'teste@example.com' && senha === 'senha123') {
        alert('Login realizado com sucesso! (Simulação)');
        localStorage.setItem('userToken', 'simulated_jwt_token');
        window.location.href = 'home.html';
      } else {
        alert('E-mail ou senha incorretos. (Simulação)');
      }
    });
  }
});

// Função global para adicionar ao carrinho (RF006)
function adicionarAoCarrinho(nomePerfume) {
  let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
  carrinho.push(nomePerfume);
  localStorage.setItem('carrinho', JSON.stringify(carrinho));
  alert(nomePerfume + ' adicionado ao carrinho!');
}

