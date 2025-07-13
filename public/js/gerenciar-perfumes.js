if (localStorage.getItem("adminLogado") !== "true") {
    alert("Acesso restrito. Faça login como administrador.");
    window.location.href = "login-admin.html";
  }

  const lista = document.getElementById("lista-perfumes");

  async function carregarPerfumes() {
    try {
      const response = await fetch("http://localhost:8000/perfumes/");
      if (!response.ok) throw new Error("Erro ao buscar perfumes");

      const perfumes = await response.json();
      renderizarPerfumes(perfumes);
    } catch (error) {
      console.error("Erro:", error);
      lista.innerHTML = "<p>Erro ao carregar perfumes.</p>";
    }
  }

  function renderizarPerfumes(perfumes) {
    lista.innerHTML = "";

    if (perfumes.length === 0) {
      lista.innerHTML = "<p>Nenhum perfume cadastrado ainda.</p>";
      return;
    }

    perfumes.forEach((perfume) => {
      const div = document.createElement("div");
      div.className = "perfume-card";

      div.innerHTML = `
        <h2>${perfume.nome}</h2>
        <p><strong>Marca:</strong> ${perfume.marca}</p>
        <p><strong>Volume:</strong> ${perfume.volume}</p>
        <p><strong>Preço:</strong> R$ ${perfume.preco.toFixed(2)}</p>
        <p><strong>Estoque:</strong> ${perfume.estoque}</p>
        <p><strong>Imagem:</strong> <a href="${perfume.imagem_url}" target="_blank">Ver imagem</a></p>
        <div class="btn-group">
          <button class="btn btn-editar" onclick="editarPerfume(${perfume.id})">Editar</button>
          <button class="btn btn-remover" onclick="removerPerfume(${perfume.id})">Remover</button>
        </div>
      `;

      lista.appendChild(div);
    });
  }

  function editarPerfume(id) {
    window.location.href = `editar-perfume.html?id=${id}`;
  }

  async function removerPerfume(id) {
    if (!confirm("Tem certeza que deseja remover este perfume?")) return;

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`http://localhost:8000/perfumes/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error("Erro ao remover perfume");

      alert("Perfume removido com sucesso!");
      carregarPerfumes();
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao remover perfume.");
    }
  }

  carregarPerfumes();

