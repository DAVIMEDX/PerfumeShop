// detalhes.js

document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const perfumeId = params.get('id');

  const section = document.querySelector('.catalogo');

  if (!perfumeId) {
    section.innerHTML = '<p>Produto não encontrado ou fora de estoque</p>';
    return;
  }

  try {
    const response = await fetch(`http://localhost:8000/perfumes/${perfumeId}`);
    if (!response.ok) throw new Error('Perfume não encontrado');

    const perfume = await response.json();

    section.innerHTML = `
      <h1>${perfume.nome}</h1>
      <img src="${perfume.imagem_url}" alt="${perfume.nome}" style="max-width:300px;">
      <p>Preço: R$ ${perfume.preco}</p>
      <p>Descrição: ${perfume.descricao}</p>
      <button class="btn" id="btn-adicionar">Adicionar ao carrinho</button>
    `;

    document.getElementById('btn-adicionar').addEventListener('click', () => {
      adicionarAoCarrinho(perfume.id);
    });

  } catch (error) {
    console.error('Erro ao carregar perfume:', error);
    section.innerHTML = '<p>Erro ao carregar os detalhes do perfume.</p>';
  }
});


function adicionarAoCarrinho(perfumeId) {
  const token = localStorage.getItem('token'); 

  if (!token) {
    alert('Você precisa estar logado para adicionar ao carrinho.');
    window.location.href = '/html/login.html';
    return;
  }

  fetch('http://localhost:8000/carrinho/adicionar', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      perfume_id: perfumeId,
      quantidade: 1
    })
  })
  .then(response => {
    if (!response.ok) throw new Error('Erro ao adicionar ao carrinho');
    return response.json();
  })
  .then(data => {
    alert('Perfume adicionado ao carrinho com sucesso!');
  })
  .catch(error => {
    console.error('Erro:', error);
    alert('Não foi possível adicionar ao carrinho.');
  });
}
