if (localStorage.getItem("adminLogado") !== "true") {
  alert("Acesso restrito. Faça login como administrador.");
  window.location.href = "login-admin.html";
}

const params = new URLSearchParams(window.location.search);
const id = params.get("id");
const form = document.getElementById("formEditarPerfume");
const mensagemErro = document.getElementById("mensagemErro");

if (!id) {
  mensagemErro.textContent = "ID do perfume não fornecido na URL.";
  form.style.display = "none";
} else {
  carregarPerfume();

  async function carregarPerfume() {
    try {
      const response = await fetch(`http://localhost:8000/perfumes/${id}`);
      if (!response.ok) throw new Error("Erro ao buscar perfume.");

      const perfume = await response.json();

      document.getElementById("nome").value = perfume.nome;
      document.getElementById("descricao").value = perfume.descricao;
      document.getElementById("preco").value = perfume.preco;
      document.getElementById("imagem").value = perfume.imagem_url;
      document.getElementById("marca").value = perfume.marca;
      document.getElementById("estoque").value = perfume.estoque;
      document.getElementById("volume").value = perfume.volume;
    } catch (erro) {
      console.error("Erro ao carregar perfume:", erro);
      mensagemErro.textContent = "Erro ao carregar os dados do perfume.";
      form.style.display = "none";
    }
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const descricao = document.getElementById("descricao").value.trim();
    const preco = parseFloat(document.getElementById("preco").value);
    const imagem_url = document.getElementById("imagem").value.trim();
    const marca = document.getElementById("marca").value.trim();
    const estoque = parseInt(document.getElementById("estoque").value);
    const volume = document.getElementById("volume").value.trim();

    if (!nome || !descricao || isNaN(preco) || !imagem_url || !marca || isNaN(estoque) || !volume) {
      mensagemErro.textContent = "Preencha todos os campos corretamente.";
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const resposta = await fetch(`http://localhost:8000/perfumes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nome,
          descricao,
          preco,
          imagem_url,
          marca,
          estoque,
          volume,
        }),
      });

      if (!resposta.ok) throw new Error("Erro ao atualizar perfume");

      alert("Perfume atualizado com sucesso!");
      window.location.href = "gerenciar-perfumes.html";
    } catch (erro) {
      console.error("Erro ao atualizar perfume:", erro);
      alert("Erro ao atualizar perfume.");
    }
  });
}
