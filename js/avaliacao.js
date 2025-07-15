document.addEventListener("DOMContentLoaded", function () {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Você precisa estar logado para acessar essa página.");
    window.location.href = "html/login.html"; 
    return; 
  }

  const estrelas = document.querySelectorAll("#selecaoEstrelas .estrela-avaliacao");
  const ratingInput = document.getElementById("valorAvaliacao");
  const formAvaliacao = document.getElementById("formAvaliacao");
  const containerAvaliacoes = document.getElementById("containerAvaliacoes");
  const perfumeId = new URLSearchParams(window.location.search).get("id");

  // Seleção visual de estrelas
  estrelas.forEach((estrela) => {
    estrela.addEventListener("click", function () {
      const valor = parseInt(this.getAttribute("data-valor"));
      ratingInput.value = valor;

      estrelas.forEach((e, index) => {
        if (index < valor) {
          e.classList.add("ativa");
          e.textContent = "★";
        } else {
          e.classList.remove("ativa");
          e.textContent = "☆";
        }
      });
    });

    estrela.addEventListener("mouseover", function () {
      const valor = parseInt(this.getAttribute("data-valor"));
      estrelas.forEach((e, index) => {
        e.textContent = index < valor ? "★" : "☆";
      });
    });

    estrela.addEventListener("mouseout", function () {
      const valorAtual = parseInt(ratingInput.value);
      estrelas.forEach((e, index) => {
        e.textContent = index < valorAtual ? "★" : "☆";
      });
    });
  });

  // Envia avaliação para o backend
  formAvaliacao.addEventListener("submit", async function (e) {
    e.preventDefault();

    const comentario = document.getElementById("comentarioUsuario").value.trim();
    const nota = parseInt(ratingInput.value);

    if (!comentario || nota === 0) {
      alert("Por favor, preencha o comentário e selecione uma nota.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/avaliacoes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          comentario,
          nota,
          perfume_id: parseInt(perfumeId),
        }),
      });

      if (!response.ok) throw new Error("Erro ao enviar avaliação.");

      await response.json();
      await carregarAvaliacoes();
      await carregarMediaAvaliacao();

      formAvaliacao.reset();
      ratingInput.value = "0";
      estrelas.forEach((e) => {
        e.classList.remove("ativa");
        e.textContent = "☆";
      });

      const btnEnviar = formAvaliacao.querySelector("button");
      const textoOriginal = btnEnviar.textContent;
      btnEnviar.textContent = "Obrigado! ✓";
      btnEnviar.style.backgroundColor = "#107010";
      setTimeout(() => {
        btnEnviar.textContent = textoOriginal;
        btnEnviar.style.backgroundColor = "";
      }, 2000);
    } catch (error) {
      console.error(error);
      alert("Erro ao enviar avaliação: " + error.message);
    }
  });

  // Carrega avaliações do banco
  async function carregarAvaliacoes() {
    try {
      const response = await fetch(`http://localhost:8000/avaliacoes/perfume/${perfumeId}`);
      if (!response.ok) throw new Error("Erro ao carregar avaliações.");

      const avaliacoes = await response.json();
      containerAvaliacoes.innerHTML = "";

      avaliacoes.forEach((avaliacao) => {
        const elemento = document.createElement("div");
        elemento.className = "item-avaliacao";

        let starsHTML = "";
        for (let i = 1; i <= 5; i++) {
          starsHTML += i <= avaliacao.nota ? "★" : "☆";
        }

        const dataFormatada = new Date(avaliacao.data).toLocaleDateString("pt-BR");

        elemento.innerHTML = `
          <div class="cabecalho-avaliacao">
              <span class="usuario-avaliacao">Usuário #${avaliacao.usuario_id}</span>
              <span class="data-avaliacao">${dataFormatada}</span>
          </div>
          <div class="estrelas-avaliacao-usuario">${starsHTML}</div>
          <div class="texto-avaliacao">${avaliacao.comentario || ""}</div>
        `;

        containerAvaliacoes.appendChild(elemento);
      });
    } catch (error) {
      console.error(error);
      containerAvaliacoes.innerHTML = "<p>Erro ao carregar avaliações.</p>";
    }
  }

  // Carrega média da avaliação
  async function carregarMediaAvaliacao() {
    const estrelasMedia = document.querySelector(".estrelas-avaliacao");
    const contagemAvaliacoes = document.querySelector(".contagem-avaliacoes");

    try {
      const responseLista = await fetch(`http://localhost:8000/avaliacoes/perfume/${perfumeId}`);
      const responseMedia = await fetch(`http://localhost:8000/avaliacoes/perfume/${perfumeId}/media`);

      if (!responseLista.ok || !responseMedia.ok) throw new Error("Erro ao buscar dados");

      const avaliacoes = await responseLista.json();
      const { media } = await responseMedia.json();

      const estrelasCheias = Math.round(media);
      let starsHTML = "";
      for (let i = 1; i <= 5; i++) {
        starsHTML += i <= estrelasCheias ? "★" : "☆";
      }

      if (estrelasMedia) estrelasMedia.innerHTML = starsHTML;
      if (contagemAvaliacoes) contagemAvaliacoes.textContent = `(${avaliacoes.length} avaliações)`;
    } catch (err) {
      console.warn("Erro ao carregar média de avaliação", err);
    }
  }

  // Carrega detalhes do perfume (imagem e nome) dinamicamente
  async function carregarDetalhesPerfume() {
    if (!perfumeId) return;

    try {
      const response = await fetch(`http://localhost:8000/perfumes/${perfumeId}`);
      if (!response.ok) throw new Error("Erro ao carregar detalhes do perfume.");

      const perfume = await response.json();

      const img = document.querySelector(".imagem-produto");
      if (img) {
        img.src = perfume.imagem_url || "https://via.placeholder.com/400";
        img.alt = perfume.nome || "Imagem do perfume";
      }

      const nome = document.querySelector(".titulo-produto");
      if (nome) nome.textContent = perfume.nome || "Perfume";

    } catch (error) {
      console.error("Erro ao carregar detalhes do perfume:", error);
    }
  }

  // Inicializar carregamento
  carregarDetalhesPerfume();
  carregarAvaliacoes();
  carregarMediaAvaliacao();
});
