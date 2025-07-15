document.addEventListener('DOMContentLoaded', async () => {
    const container = document.querySelector('.produto-lista');

    try {
     const response = await fetch('/api/perfumes/destaques');
        
      if (!response.ok) throw new Error('Erro ao buscar perfumes');

      const perfumes = await response.json();

      container.innerHTML = ""; // limpa os produtos estáticos

      perfumes.forEach(perfume => {
        const card = document.createElement('div');
        card.className = 'produto';
        card.innerHTML = `
          <img src="${perfume.imagem_url}" alt="${perfume.nome}">
          <h3>${perfume.nome}</h3>
          <p>R$ ${perfume.preco.toFixed(2)}</p>
          <button class="btn" onclick="window.location.href = 'html/detalhes.html?id=${perfume.id}'">Ver detalhes</button>
        `;
        container.appendChild(card);
      });

    } catch (error) {
      console.error('Erro ao carregar perfumes em destaque:', error);
      container.innerHTML = '<p>Erro ao carregar produtos em destaque.</p>';
    }
  });
