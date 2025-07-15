console.log("cadastro.js carregado");
document.getElementById('cadastroForm').addEventListener('submit', async function(event) {
  event.preventDefault(); // evitar reload da página

  // pegar valores dos campos
  const nome = document.getElementById('nome').value;
  const email = document.getElementById('emailCadastro').value;
  const senha = document.getElementById('senhaCadastro').value;

  try {
    const response = await fetch('/api/usuarios/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ nome, email, senha })
    });

    if (response.ok) {
      const data = await response.json();
      alert('Usuário cadastrado com sucesso! Seja bem-vindo, ' + data.nome);
      // redirecionar para login ou home se quiser
      window.location.href = 'login.html';
    } else {
      const errorData = await response.json();
      alert('Erro: ' + (errorData.detail || 'Não foi possível cadastrar'));
    }
  } catch (error) {
    alert('Erro na requisição: ' + error.message);
  }
});
