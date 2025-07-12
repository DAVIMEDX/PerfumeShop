document.addEventListener("DOMContentLoaded", function () {
  // Seleção de estrelas
  const estrelas = document.querySelectorAll(
    "#selecaoEstrelas .estrela-avaliacao"
  );
  const ratingInput = document.getElementById("valorAvaliacao");

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
        if (index < valor) {
          e.textContent = "★";
        } else {
          e.textContent = "☆";
        }
      });
    });

    estrela.addEventListener("mouseout", function () {
      const valorAtual = parseInt(ratingInput.value);
      estrelas.forEach((e, index) => {
        if (index < valorAtual) {
          e.textContent = "★";
        } else {
          e.textContent = "☆";
        }
      });
    });
  });

  const formAvaliacao = document.getElementById("formAvaliacao");
  const containerAvaliacoes = document.getElementById("containerAvaliacoes");

  formAvaliacao.addEventListener("submit", function (e) {
    e.preventDefault();

    const nome = document.getElementById("nomeUsuario").value.trim();
    const comentario = document
      .getElementById("comentarioUsuario")
      .value.trim();
    const rating = ratingInput.value;

    if (!nome || !comentario) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    if (rating === "0") {
      alert("Por favor, selecione uma classificação com as estrelas.");
      return;
    }

    const novaAvaliacao = document.createElement("div");
    novaAvaliacao.className = "item-avaliacao";

    const dataAtual = new Date();
    const dataFormatada = dataAtual.toLocaleDateString("pt-BR");

    let starsHTML = "";
    for (let i = 1; i <= 5; i++) {
      starsHTML += i <= rating ? "★" : "☆";
    }

    novaAvaliacao.innerHTML = `
            <div class="cabecalho-avaliacao">
                <span class="usuario-avaliacao">${nome}</span>
                <span class="data-avaliacao">${dataFormatada}</span>
            </div>
            <div class="estrelas-avaliacao-usuario">${starsHTML}</div>
            <div class="texto-avaliacao">${comentario}</div>
        `;

    if (containerAvaliacoes.firstChild) {
      containerAvaliacoes.insertBefore(
        novaAvaliacao,
        containerAvaliacoes.firstChild
      );
    } else {
      containerAvaliacoes.appendChild(novaAvaliacao);
    }

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
  });

  const avaliacoesExemplo = [
    {
      nome: "Ana Silva",
      data: "15/06/2023",
      rating: 4,
      comentario:
        "Adorei o perfume! A fragrância é incrível e dura o dia todo. Recomendo!",
    },
    {
      nome: "Carlos Oliveira",
      data: "10/06/2023",
      rating: 5,
      comentario:
        "Produto excelente! Superou minhas expectativas. Entrega rápida e bem embalado.",
    },
  ];

  avaliacoesExemplo.forEach((avaliacao) => {
    const avaliacaoElement = document.createElement("div");
    avaliacaoElement.className = "item-avaliacao";

    let starsHTML = "";
    for (let i = 1; i <= 5; i++) {
      starsHTML += i <= avaliacao.rating ? "★" : "☆";
    }

    avaliacaoElement.innerHTML = `
            <div class="cabecalho-avaliacao">
                <span class="usuario-avaliacao">${avaliacao.nome}</span>
                <span class="data-avaliacao">${avaliacao.data}</span>
            </div>
            <div class="estrelas-avaliacao-usuario">${starsHTML}</div>
            <div class="texto-avaliacao">${avaliacao.comentario}</div>
        `;

    containerAvaliacoes.appendChild(avaliacaoElement);
  });
});
