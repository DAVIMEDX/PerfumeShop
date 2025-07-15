document.addEventListener('DOMContentLoaded', async () => {
  const produtosContainer = document.querySelector('.carrinho-produtos');
  const subtotalEl = document.getElementById('subtotal');
  const descontoEl = document.getElementById('desconto');
  const totalEl = document.getElementById('total');
  const token = localStorage.getItem('token');

  if (!token) {
    alert('Usuário não autenticado. Faça login.');
    window.location.href = 'html/login.html';
    return;
  }

  async function carregarCarrinho() {
    try {
      const response = await fetch('/api/carrinho/itens', {
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
        card.inner = `
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
      if (economiaEl && totalFinalEl) {
        economiaEl.textContent = `R$ ${desconto.toFixed(2)}`;
        totalFinalEl.textContent = `R$ ${total.toFixed(2)}`;
      }

      adicionarEventos();
    } catch (error) {
      console.error(error);
      produtosContainer.inner = '<p>Erro ao carregar carrinho, ou carrinho vazio.</p>';
    }
  }

  function adicionarEventos() {
    document.querySelectorAll('.btn-remover').forEach(btn => {
      btn.addEventListener('click', async () => {
        const itemId = btn.getAttribute('data-id');
        try {
          const res = await fetch(`/api/carrinho/${itemId}`, {
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
          const res = await fetch(`/api/carrinho/${itemId}`, {
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

  function mostrarQRCode(base64) {
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = 0;
    modal.style.left = 0;
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0,0,0,0.7)';
    modal.style.display = 'flex';
    modal.style.flexDirection = 'column';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.style.zIndex = 9999;

    modal.inner = `
      <div style="background:#fff; padding:20px; border-radius:8px; text-align:center; max-width:320px;">
        <h2>Pague com PIX</h2>
        <img src="data:image/png;base64,${base64}" alt="QR Code PIX" style="width:250px; height:250px; margin-bottom:10px;" />
        <p>Use seu app bancário para escanear o QR code e realizar o pagamento.</p>
        <p id="status-pagamento">Aguardando pagamento...</p>
        <button id="btnFecharQR" style="margin-top:15px; padding:8px 20px; font-size:16px; cursor:pointer;">Cancelar</button>
      </div>
    `;

    document.body.appendChild(modal);

    document.getElementById('btnFecharQR').onclick = () => {
      modal.remove();
    };

    return modal;
  }

  async function verificarPagamento(pixId, dadosPedido, modal) {
    let tentativas = 0;
    const maxTentativas = 30;

    const statusPagamento = modal.querySelector('#status-pagamento');

    const intervalo = setInterval(async () => {
      tentativas++;

      try {
        const resp = await fetch(`/api/pagamento/${pixId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const data = await resp.json();

        if (data.status === 'approved' || data.status === 'aprovado') {
          clearInterval(intervalo);
          statusPagamento.textContent = "Pagamento confirmado! Finalizando pedido...";
          await criarPedido(dadosPedido);
          modal.remove();
        }

        if (tentativas >= maxTentativas) {
          clearInterval(intervalo);
          statusPagamento.textContent = "Pagamento não detectado. Tente novamente.";
        }
      } catch (err) {
        console.error("Erro ao verificar pagamento:", err);
      }
    }, 5000);
  }

  async function criarPedido(dadosPedido) {
    console.log("Dados do pedido a enviar:", dadosPedido);
    const resposta = await fetch('/api/pedidos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(dadosPedido)
    });

    if (!resposta.ok) {
      const erroMsg = await resposta.text();
      throw new Error(`Erro ao finalizar pedido: ${erroMsg}`);
    }

    alert("Pedido finalizado com sucesso!");
    window.location.href = 'index.html';
  }

 async function finalizarPedido() {
  const endereco = document.getElementById('endereco').value;
  const cidade = document.getElementById('cidade').value;
  const cep = document.getElementById('cep').value;

  const respCarrinho = await fetch('/api/carrinho/itens', {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!respCarrinho.ok) {
    alert("Erro ao buscar itens do carrinho.");
    return;
  }

  const itens = await respCarrinho.json();

  if (itens.length === 0) {
    alert("Seu carrinho está vazio.");
    return;
  }

  const total = itens.reduce((soma, item) =>
    soma + item.perfume.preco * item.quantidade * 0.95, 0);

  const email = localStorage.getItem('email');
  if (!email) {
    alert("Email do usuário não encontrado. Faça login novamente.");
    window.location.href = 'html/login.html';
    return;
  }

  const dadosPedido = {
    endereco,
    cidade,
    cep,
    metodo_pagamento: 'pix',
    total,
    itens: itens.map(item => ({
      perfume_id: item.perfume.id,
      quantidade: item.quantidade,
      preco_unitario: item.perfume.preco
    })),
    email
  };

  // Ajuste no payload para o backend Mercado Pago:
 const payloadPagamento = {
  valor: total,
  descricao: "Compra Perfume Shop",
  email: email
};


  const resposta = await fetch('/api/pagamento/pix', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payloadPagamento)
  });

  if (!resposta.ok) {
    alert("Erro ao gerar pagamento PIX.");
    return;
  }

  const pagamento = await resposta.json();
  const modal = mostrarQRCode(pagamento.point_of_interaction.transaction_data.qr_code_base64);
  verificarPagamento(pagamento.id, dadosPedido, modal);
}


  await carregarCarrinho();

  const form = document.getElementById('formFinalizarPedido');
  form.addEventListener('submit', async e => {
    e.preventDefault();
    await finalizarPedido();
  });
});
