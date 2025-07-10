document.addEventListener('DOMContentLoaded', async () => {
  const produtosContainer = document.querySelector('.carrinho-produtos');
  const subtotalEl = document.getElementById('subtotal');
  const descontoEl = document.getElementById('desconto');
  const totalEl = document.getElementById('total');

  const token = localStorage.getItem('token');
  if (!token) {
    alert('Usuário não autenticado. Faça login.');
    window.location.href = 'login.html';
    return;
  }

  async function carregarCarrinho() {
    try {
      const response = await fetch('http://localhost:8000/carrinho/itens', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Erro ao buscar itens do carrinho');
      const itens = await response.json();
     

      let subtotal = 0;
      const listaContainer = document.getElementById('produtos-carrinho');
      listaContainer.innerHTML = '';
      itens.sort((a, b) => a.id - b.id);
      itens.forEach(item => {
        const precoTotal = item.perfume.preco * item.quantidade;
        subtotal += precoTotal;
        const precoComDesconto = precoTotal * 0.95;

        const card = document.createElement('div');
        card.className = 'produto-carrinho';
        card.innerHTML = `
          <img src="${item.perfume.imagem_url}" alt="${item.perfume.nome}" />
          <div class="info">
            <strong>${item.perfume.nome}</strong><br>
            <label>Qtd: <input type="number" min="1" value="${item.quantidade}" data-id="${item.id}" class="input-quantidade" /></label>
            <button class="btn btn-remover" data-id="${item.id}">Remover</button>
          </div>
          <div class="preco">
            <s>R$ ${precoTotal.toFixed(2)}</s>
            <span>R$ ${precoComDesconto.toFixed(2)}</span>
          </div>
        `;
        listaContainer.appendChild(card);
      });

      const desconto = subtotal * 0.05;
      const total = subtotal - desconto;

      subtotalEl.textContent = `R$ ${subtotal.toFixed(2)}`;
      descontoEl.textContent = `R$ ${desconto.toFixed(2)}`;
      totalEl.textContent = `R$ ${total.toFixed(2)}`;
      
      const economiaEl = document.getElementById('valor-economia');
      const totalFinalEl = document.getElementById('total-final');

      economiaEl.textContent = `R$ ${desconto.toFixed(2)}`;
      totalFinalEl.textContent = `R$ ${total.toFixed(2)}`;

      adicionarEventos();
    } catch (error) {
      console.error(error);
      produtosContainer.innerHTML = '<p>Erro ao carregar carrinho.</p>';
    }
  }

  function adicionarEventos() {
    document.querySelectorAll('.btn-remover').forEach(btn => {
      btn.addEventListener('click', async () => {
        const itemId = btn.getAttribute('data-id');
        try {
          const res = await fetch(`http://localhost:8000/carrinho/${itemId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
          });
          if (!res.ok) throw new Error('Erro ao remover item');
          await carregarCarrinho();
        } catch (err) {
          alert('Erro ao remover item');
        }
      });
    });

    document.querySelectorAll('.input-quantidade').forEach(input => {
      input.addEventListener('change', async () => {
        const itemId = input.getAttribute('data-id');
        const novaQuantidade = parseInt(input.value);
        if (novaQuantidade < 1) return;

        try {
          const res = await fetch(`http://localhost:8000/carrinho/${itemId}`, {
          method: 'PATCH',
          headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
              },
            body: JSON.stringify({ quantidade: novaQuantidade })
        });


          if (!res.ok) throw new Error('Erro ao atualizar quantidade');
          await carregarCarrinho();
        } catch (err) {
          alert('Erro ao atualizar quantidade');
        }
      });
    });
  }

  await carregarCarrinho();

  const form = document.getElementById('formFinalizarPedido');
  form.addEventListener('submit', async e => {
    e.preventDefault();

    const endereco = document.getElementById('endereco').value;
    const cidade = document.getElementById('cidade').value;
    const cep = document.getElementById('cep').value;

    try {
      const respCarrinho = await fetch('http://localhost:8000/carrinho/itens', {
        headers: { Authorization: `Bearer ${token}` }
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
