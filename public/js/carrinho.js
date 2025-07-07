document.getElementById('formFinalizarPedido').addEventListener('submit', function (event) {
  event.preventDefault();

  const endereco = document.getElementById('endereco').value;
  const cidade = document.getElementById('cidade').value;
  const cep = document.getElementById('cep').value;
  const metodo = document.querySelector('input[name="metodo-pagamento"]:checked').value;

  const pedido = {
    produtos: [
      { nome: "Perfume Genérico", preco: 107.90 },
      { nome: "Perfume 2", preco: 24.75 }
    ],
    enderecoCompleto: `${endereco}, ${cidade} - ${cep}`,
    metodoPagamento: metodo,
    total: 132.65
  };

  // Armazenando no localStorage (simulando envio)
  let pedidosSalvos = JSON.parse(localStorage.getItem("pedidos")) || [];
  pedidosSalvos.push(pedido);
  localStorage.setItem("pedidos", JSON.stringify(pedidosSalvos));

  alert("Pedido finalizado com sucesso!");
  window.location.href = "meus-pedidos.html"; // redireciona (se você criar essa página)
});

