document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('formCadastroPerfume');
  const mensagemEl = document.getElementById('mensagem');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token'); 

    if (!token) {
      alert('Acesso não autorizado. Faça login como administrador.');
      window.location.href = 'login-admin.html';
      return;
    }
    


    const nome = document.getElementById('nome').value;
    const marca = document.getElementById('marca').value; 
    const preco = parseFloat(document.getElementById('preco').value);
    const estoque = parseInt(document.getElementById('estoque').value);
    const volume = document.getElementById('volume').value;
    const descricao = document.getElementById('descricao').value;
    const imagem_url = document.getElementById('imagem').value;

    const dados = {
      nome,
      marca,
      preco,
      estoque,
      volume,
      descricao,
      imagem_url
    };

    try {
      const response = await fetch('http://localhost:8000/perfumes/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(dados)
      });

      if (!response.ok) {
        const erro = await response.json();
        throw new Error(erro.detail || 'Erro ao cadastrar perfume');
      }

      mensagemEl.textContent = 'Perfume cadastrado com sucesso!';
      mensagemEl.style.color = 'green';
      form.reset();
    } catch (error) {
      console.error('Erro ao cadastrar perfume:', error);
      mensagemEl.textContent = `Erro: ${error.message}`;
      mensagemEl.style.color = 'red';
    }
  });
});
