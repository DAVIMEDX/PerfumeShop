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
    const response = await fetch(`/api/perfumes/${perfumeId}`);
    if (!response.ok) throw new Error('Perfume não encontrado');

    const perfume = await response.json();

    // Atualiza a página com os dados do perfume
    const tituloProduto = document.querySelector('.titulo-produto');
    const imagemProduto = document.querySelector('.imagem-produto img');
    const precoAtual = document.querySelector('.preco-atual');
    const descricaoCurta = document.querySelector('.descricao-curta');
    const botaoAvaliacoes = document.querySelector('.botao-avaliacao');

    if (tituloProduto) tituloProduto.textContent = perfume.nome;
    if (imagemProduto) {
      imagemProduto.src = perfume.imagem_url;
      imagemProduto.alt = perfume.nome;
    }
    if (precoAtual) precoAtual.textContent = `R$ ${perfume.preco.toFixed(2)}`;
    if (descricaoCurta) descricaoCurta.textContent = perfume.descricao;
    if (botaoAvaliacoes) botaoAvaliacoes.href = `avaliacao.?id=${perfume.id}`;

    // Atualiza contador do carrinho (se houver itens)
    await atualizarContadorCarrinho();

    // Evento para adicionar ao carrinho com prevenção de navegação imediata
    const botaoCarrinho = document.querySelector('.botao-carrinho');
    if (botaoCarrinho) {
      botaoCarrinho.addEventListener('click', async (event) => {
        event.preventDefault(); // previne o redirecionamento imediato
        await adicionarAoCarrinho(perfume.id);
        window.location.href = 'carrinho.html'; // redireciona só depois de adicionar
      });
    }

    // Evento para o ícone do carrinho no header
    if (botaoCarrinhoHeader) {
      botaoCarrinhoHeader.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = 'carrinho.html';
      });
    }

  } catch (error) {
    console.error('Erro ao carregar perfume:', error);
    if (produtoContainer) {
      produtoContainer.innerHTML = '<p>Erro ao carregar os detalhes do perfume.</p>';
    }
  }
});

async function atualizarContadorCarrinho() {
  const contador = document.querySelector('.contador-carrinho');
  const token = localStorage.getItem('token');
  if (!token || !contador) return;

  try {
    const carrinhoResponse = await fetch('/api/carrinho/itens', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!carrinhoResponse.ok) throw new Error('Erro ao buscar itens do carrinho');

    const carrinho = await carrinhoResponse.json();
    const totalItens = carrinho.reduce((total, item) => total + item.quantidade, 0);
    contador.textContent = totalItens;
  } catch (error) {
    console.error('Erro ao atualizar contador do carrinho:', error);
  }
}

async function adicionarAoCarrinho(perfumeId) {
  const token = localStorage.getItem('token'); 

  if (!token) {
    alert('Você precisa estar logado para adicionar ao carrinho.');
    window.location.href = 'login.html';
    return;
  }

  try {
    const response = await fetch('/api/carrinho/adicionar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        perfume_id: perfumeId,
        quantidade: 1
      })
    });

    if (!response.ok) throw new Error('Erro ao adicionar ao carrinho');

    // Atualiza o contador do carrinho para o valor real no backend
    await atualizarContadorCarrinho();

    const botaoCarrinho = document.querySelector('.botao-carrinho');

    // Feedback visual
    if (botaoCarrinho) {
      botaoCarrinho.textContent = '✔️ Adicionado!';
      botaoCarrinho.style.backgroundColor = '#4CAF50';
    }

    setTimeout(() => {
      if (botaoCarrinho) {
        botaoCarrinho.textContent = 'Adicionar ao Carrinho';
        botaoCarrinho.style.backgroundColor = '';
      }
    }, 2000);

  } catch (error) {
    console.error('Erro:', error);
    alert('Não foi possível adicionar ao carrinho: ' + error.message);
  }
}
