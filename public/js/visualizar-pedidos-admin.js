if (localStorage.getItem("adminLogado") !== "true") {
  alert("Acesso restrito. Faça login como administrador.");
  window.location.href = "login-admin.html";
}

const tabelaPedidos = document.getElementById("tabela-pedidos");
const token = localStorage.getItem("token");

async function carregarPedidos() {
  try {
    const response = await fetch("http://localhost:8000/admin/pedidos", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Erro ao buscar pedidos");

    const pedidos = await response.json();

    if (pedidos.length === 0) {
      tabelaPedidos.innerHTML =
        "<p class='sem-pedidos'>Nenhum pedido foi realizado ainda.</p>";
      return;
    }

    let tabelaHTML = `
      <table>
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Endereço</th>
            <th>Pagamento</th>
            <th>Itens</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
    `;

    pedidos.forEach((pedido) => {
      const itensTexto = pedido.itens
        ? pedido.itens
            .map((item) => `${item.perfume.nome} (x${item.quantidade})`)
            .join(", ")
        : "-";

      tabelaHTML += `
        <tr>
          <td>${pedido.usuario ? pedido.usuario.nome : "Desconhecido"}</td>
          <td>${pedido.endereco || "-"}</td>
          <td>${pedido.metodo_pagamento || "-"}</td>
          <td>${itensTexto}</td>
          <td>${pedido.status || "-"}</td>
        </tr>
      `;
    });

    tabelaHTML += "</tbody></table>";
    tabelaPedidos.innerHTML = tabelaHTML;
  } catch (error) {
    console.error("Erro:", error);
    tabelaPedidos.innerHTML = "<p>Erro ao carregar pedidos.</p>";
  }
}

carregarPedidos();
