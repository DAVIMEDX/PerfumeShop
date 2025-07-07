document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('lista-produtos');

  try {
    const response = await fetch('http://localhost:8000/perfumes/');
    if (!response.ok) throw new Error('Erro ao buscar perfumes');

    const perfumes = await response.json();

    perfumes.forEach(perfume => {
      const card = document.createElement('div');
      card.className = 'produto';
      card.innerHTML = `
        <img src="${perfume.imagem_url || 'img/'}" alt="${perfume.nome}">
        <h3>${perfume.nome}</h3>
        <p>R$ ${perfume.preco}</p>
        <button class="btn" onclick="window.location.href='detalhes.html?id=${perfume.id}'">Ver detalhes</button>
      `;
      container.appendChild(card);
    });

  } catch (error) {
    console.error('Erro ao carregar perfumes:', error);
    container.innerHTML = '<p>Erro ao carregar o catálogo.</p>';
  }
});
