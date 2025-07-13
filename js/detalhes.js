window.onload = async () => {
  const params = new URLSearchParams(window.location.search);
  const perfumeId = params.get('id');

  const produtoContainer = document.querySelector('.produto-simples');
  const contadorCarrinho = document.querySelector('.contador-carrinho');
  const botaoCarrinhoHeader = document.querySelector('.carrinho');

  console.log('Produto container:', produtoContainer);
  console.log('Perfume ID:', perfumeId);

  if (!perfumeId) {
    if (produtoContainer) {
      produtoContainer.innerHTML = '<p>Produto não encontrado ou fora de estoque</p>';
    } else {
      console.error('Elemento .produto-simples não encontrado.');
    }
    return;
  }

  try {
    const response = await fetch(`http://localhost:8000/perfumes/${perfumeId}`);
    if (!response.ok) throw new Error('Perfume não encontrado');

    const perfume = await response.json();

    if (!produtoContainer) {
      console.error('Elemento .produto-simples não encontrado.');
      return;
    }

    const precoAntigo = perfume.preco; // preço cheio (sem desconto)
    const precoAtual = precoAntigo * 0.95; // preço com 5% de desconto
    const desconto = 5; // 5% fixo

    const tituloProduto = document.querySelector('.titulo-produto');
    const imagemProduto = document.querySelector('.imagem-produto img');
    const precoAtualElem = document.querySelector('.preco-atual');
    const precoAntigoElem = document.querySelector('.preco-antigo');
    const descontoElem = document.querySelector('.desconto');
    const descricaoCurta = document.querySelector('.descricao-curta');
    const botaoAvaliacoes = document.querySelector('.botao-avaliacao');
    const botaoCarrinho = document.querySelector('.botao-carrinho');

    if (
      !tituloProduto || !imagemProduto || !precoAtualElem || !precoAntigoElem ||
      !descontoElem || !descricaoCurta || !botaoAvaliacoes || !botaoCarrinho
    ) {
      console.error('Um ou mais elementos essenciais não foram encontrados no DOM.');
      return;
    }

    tituloProduto.textContent = perfume.nome;
    imagemProduto.src = perfume.imagem_url;
    imagemProduto.alt = perfume.nome;
    precoAtualElem.textContent = `R$ ${precoAtual.toFixed(2).replace('.', ',')}`;
    precoAntigoElem.textContent = `R$ ${precoAntigo.toFixed(2).replace('.', ',')}`;
    descontoElem.textContent = `${desconto}% OFF`;
    descricaoCurta.textContent = perfume.descricao;
    botaoAvaliacoes.href = `/html/avaliacao.html?id=${perfume.id}`;

    // Atualiza contador do carrinho, se o usuário estiver autenticado
    if (contadorCarrinho) {
      try {
        const carrinhoResponse = await fetch('http://localhost:8000/carrinho', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (carrinhoResponse.ok) {
          const carrinho = await carrinhoResponse.json();
          contadorCarrinho.textContent = carrinho.itens.reduce((total, item) => total + item.quantidade, 0);
        }
      } catch (err) {
        console.warn('Erro ao buscar carrinho:', err);
      }
    }

    // Adiciona perfume ao carrinho
    botaoCarrinho.addEventListener('click', (e) => {
      e.preventDefault(); // evitar navegação padrão do link
      adicionarAoCarrinho(perfume.id);
    });

    // Redireciona ao carrinho ao clicar no ícone do header
    if (botaoCarrinhoHeader) {
      botaoCarrinhoHeader.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = '/html/carrinho.html';
      });
    }

  } catch (error) {
    console.error('Erro ao carregar perfume:', error);
    if (produtoContainer) {
      produtoContainer.innerHTML = '<p>Erro ao carregar os detalhes do perfume.</p>';
    }
  }

};

async function adicionarAoCarrinho(perfumeId) {
  const token = localStorage.getItem('token');

  // Verificação mais robusta do token
  if (!token || token === 'null' || token === 'undefined' || token.trim() === '') {
    alert('Você precisa estar logado para adicionar ao carrinho.');
    setTimeout(() => {
      window.location.href = '/html/login.html';
    }, 100); // permite que o alert apareça antes do redirecionamento
    return;
  }

  try {
    const response = await fetch('http://localhost:8000/carrinho/adicionar', {
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

    if (!response.ok) {
      const errorMsg = await response.text();
      // Se for erro de autenticação, redireciona
      if (response.status === 401 || errorMsg.toLowerCase().includes('not authenticated')) {
        alert('Sessão expirada. Faça login novamente.');
        window.location.href = '/html/login.html';
        return;
      }
      throw new Error(errorMsg || 'Erro ao adicionar ao carrinho');
    }

    const botaoCarrinho = document.querySelector('.botao-carrinho');
    const contador = document.querySelector('.contador-carrinho');

    botaoCarrinho.textContent = '✔️ Adicionado!';
    botaoCarrinho.style.backgroundColor = '#4CAF50';

    if (contador) {
      contador.textContent = parseInt(contador.textContent || '0') + 1;
    }

    setTimeout(() => {
      botaoCarrinho.textContent = 'Adicionar ao Carrinho';
      botaoCarrinho.style.backgroundColor = '';
    }, 2000);

  } catch (error) {
    console.error('Erro:', error);
    alert('Não foi possível adicionar ao carrinho: ' + error.message);
  }
}
