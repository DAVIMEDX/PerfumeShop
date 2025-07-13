document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const perfumeId = params.get('id');

  // Elementos principais da página
  const produtoContainer = document.querySelector('.produto-simples');
  const contadorCarrinho = document.querySelector('.contador-carrinho');
  const botaoCarrinhoHeader = document.querySelector('.carrinho');

  if (!perfumeId) {
    produtoContainer.innerHTML = '<p>Produto não encontrado ou fora de estoque</p>';
    return;
  }

  try {
    // Carrega os dados do perfume
    const response = await fetch(http://localhost:8000/perfumes/${perfumeId});
    if (!response.ok) throw new Error('Perfume não encontrado');

    const perfume = await response.json();

    // Atualiza a página com os dados do perfume
    document.querySelector('.titulo-produto').textContent = perfume.nome;
    document.querySelector('.imagem-produto img').src = perfume.imagem_url;
    document.querySelector('.imagem-produto img').alt = perfume.nome;
    document.querySelector('.preco-atual').textContent = R$ ${perfume.preco.toFixed(2)};
    document.querySelector('.descricao-curta').textContent = perfume.descricao;

    // Configura o link de avaliações para incluir o ID do perfume
    const botaoAvaliacoes = document.querySelector('.botao-avaliacao');
    botaoAvaliacoes.href = avaliacoes.html?id=${perfume.id};

    // Atualiza contador do carrinho (se houver itens)
    const carrinhoResponse = await fetch('http://localhost:8000/carrinho', {
      headers: {
        'Authorization': Bearer ${localStorage.getItem('token')}
      }
    });
    
    if (carrinhoResponse.ok) {
      const carrinho = await carrinhoResponse.json();
      contadorCarrinho.textContent = carrinho.itens.reduce((total, item) => total + item.quantidade, 0);
    }

    // Evento para adicionar ao carrinho
    document.querySelector('.botao-carrinho').addEventListener('click', () => {
      adicionarAoCarrinho(perfume.id);
    });

    // Evento para o ícone do carrinho no header
    botaoCarrinhoHeader.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = '/html/carrinho.html';
    });

  } catch (error) {
    console.error('Erro ao carregar perfume:', error);
    produtoContainer.innerHTML = '<p>Erro ao carregar os detalhes do perfume.</p>';
  }
});

async function adicionarAoCarrinho(perfumeId) {
  const token = localStorage.getItem('token'); 

  if (!token) {
    alert('Você precisa estar logado para adicionar ao carrinho.');
    window.location.href = '/html/login.html';
    return;
  }

  try {
    const response = await fetch('http://localhost:8000/carrinho/adicionar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': Bearer ${token}
      },
      body: JSON.stringify({
        perfume_id: perfumeId,
        quantidade: 1
      })
    });

    if (!response.ok) throw new Error('Erro ao adicionar ao carrinho');

    const data = await response.json();
    const botaoCarrinho = document.querySelector('.botao-carrinho');
    const contador = document.querySelector('.contador-carrinho');

    // Feedback visual
    botaoCarrinho.textContent = '✔️ Adicionado!';
    botaoCarrinho.style.backgroundColor = '#4CAF50';
    
    // Atualiza contador
    contador.textContent = parseInt(contador.textContent || '0') + 1;
    
    setTimeout(() => {
      botaoCarrinho.textContent = 'Adicionar ao Carrinho';
      botaoCarrinho.style.backgroundColor = '';
    }, 2000);

  } catch (error) {
    console.error('Erro:', error);
    alert('Não foi possível adicionar ao carrinho: ' + error.message);
  }
}