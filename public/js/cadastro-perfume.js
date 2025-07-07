document.getElementById('formCadastroPerfume').addEventListener('submit', function(event) {
  event.preventDefault();

  const nome = document.getElementById('nome').value.trim();
  const descricao = document.getElementById('descricao').value.trim();
  const preco = parseFloat(document.getElementById('preco').value);
  const imagem = document.getElementById('imagem').value.trim();

  if (!nome || !descricao || isNaN(preco) || preco <= 0 || !imagem) {
    alert('Por favor, preencha todos os campos corretamente.');
    return;
  }

  // Pega os perfumes atuais do localStorage ou cria um array vazio
  const perfumes = JSON.parse(localStorage.getItem('perfumes')) || [];

  // Cria um novo perfume
  const novoPerfume = {
    id: Date.now(),  // id único pelo timestamp
    nome,
    descricao,
    preco,
    imagem
  };

  perfumes.push(novoPerfume);

  // Salva no localStorage
  localStorage.setItem('perfumes', JSON.stringify(perfumes));

  // Mensagem de sucesso
  const msg = document.getElementById('mensagem');
  msg.textContent = `Perfume "${nome}" cadastrado com sucesso!`;

  // Reseta o formulário
  this.reset();
});

