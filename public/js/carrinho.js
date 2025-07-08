document.addEventListener('DOMContentLoaded', async () => {
  const produtosContainer = document.getElementById('produtos-carrinho');
  const subtotalEl = document.getElementById('subtotal');
  const descontoEl = document.getElementById('desconto');
  const totalEl = document.getElementById('total');

  const token = localStorage.getItem('token');
  if (!token) {
    alert('Usuário não autenticado. Faça login.');
    window.location.href = 'login.html';
    return;
  }

  try {
    const response = await fetch('http://localhost:8000/carrinho/itens', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) throw new Error('Erro ao buscar itens do carrinho');

    const itens = await response.json();
    let subtotal = 0;
    produtosContainer.innerHTML = '';

    itens.forEach(item => {
      const precoTotal = item.perfume.preco * item.quantidade;
      subtotal += precoTotal;

      const card = document.createElement('div');
      card.className = 'produto-carrinho';
      card.innerHTML = `
        <img src="${item.perfume.imagem_url}" alt="${item.perfume.nome}" />
        <div class="info">
          <strong>${item.perfume.nome}</strong>
          <small>${item.quantidade} unidade(s)</small>
        </div>
        <div class="preco">
          <s>R$ ${precoTotal.toFixed(2)}</s>
          <span>R$ ${(precoTotal * 0.95).toFixed(2)}</span>
        </div>
      `;
      produtosContainer.appendChild(card);
    });

    const desconto = subtotal * 0.05;
    const total = subtotal - desconto;

    subtotalEl.textContent = `R$ ${subtotal.toFixed(2)}`;
    descontoEl.textContent = `R$ ${desconto.toFixed(2)}`;
    totalEl.textContent = `R$ ${total.toFixed(2)}`;

  } catch (error) {
    console.error(error);
    produtosContainer.innerHTML = '<p>Erro ao carregar carrinho.</p>';
  }

  const form = document.getElementById('formFinalizarPedido');
  form.addEventListener('submit', async e => {
    e.preventDefault();

    const endereco = document.getElementById('endereco').value;
    const cidade = document.getElementById('cidade').value;
    const cep = document.getElementById('cep').value;

    try {
      const respCarrinho = await fetch('http://localhost:8000/carrinho/itens', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!respCarrinho.ok) throw new Error('Erro ao buscar itens do carrinho');
      const itens = await respCarrinho.json();

      const dados = {
        endereco,
        cidade,
        cep,
        metodo_pagamento: 'pix',
        total: itens.reduce((soma, item) =>
          soma + item.perfume.preco * item.quantidade * 0.95, 0),
        itens: itens.map(item => ({
          perfume_id: item.perfume.id,
          quantidade: item.quantidade,
          preco_unitario: item.perfume.preco
        }))
      };

      const resposta = await fetch('http://localhost:8000/pedidos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(dados)
      });

      if (!resposta.ok) throw new Error('Erro ao finalizar pedido');

      alert('Pedido realizado com sucesso!');
      window.location.href = 'home.html';
    } catch (erro) {
      console.error(erro);
      alert('Erro ao finalizar pedido');
    }
  });
});
