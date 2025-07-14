
# 🧴 PerfumeShop

Sistema web de e-commerce desenvolvido para a venda de perfumes. Permite que clientes consultem, escolham e comprem produtos de forma prática e segura, com funcionalidades específicas para administração de pedidos e catálogo.

---

## 📌 Objetivo

Oferecer uma experiência de compra eficiente, moderna e segura, tanto para clientes quanto para administradores, permitindo a digitalização de vendas por vendedores autônomos.

---

## 👥 Público-alvo

- Vendedores autônomos de perfumes (ex: revendedoras como Ana Lúcia)
- Clientes interessados em adquirir perfumes pela internet

---

## ⚙️ Funcionalidades principais

### Cliente:
- Cadastro e login
- Listagem e detalhamento de perfumes
- Adição ao carrinho
- Finalização de pedido
- Acompanhamento de status
- Avaliações

### Administrador:
- Login
- Cadastro, edição e remoção de perfumes
- Controle de catálogo

---

## 📄 Requisitos

### ✅ Requisitos Funcionais (RF)

- RF001: Cadastro de cliente
- RF002: Login de cliente
- RF003: Listar perfumes
- RF004: Visualizar detalhes de perfume
- RF005: Adicionar ao carrinho
- RF006: Finalizar pedido
- RF007: Acompanhar pedidos
- RF008: Login do administrador
- RF009: Cadastrar perfume
- RF010: Editar perfume
- RF011: Remover perfume

### ✅ Requisitos Não Funcionais (RNF)

- RNF001: Usabilidade
- RNF002: Tempo de resposta ≤ 2s
- RNF003: Compatibilidade entre navegadores
- RNF004: Segurança com HTTPS e senhas criptografadas

---

## 🧪 Testes

- Casos de uso descritos no [PDF do projeto](./docs/Trabalho%20de%20ES.pdf).
- Testes manuais validados a partir dos fluxos no frontend.
- Cobertura de funcionalidades do CRUD e autenticação.

---

## 🧱 Arquitetura

### Modelo MVC + REST

- **Frontend**: HTML, CSS, JS (site responsivo)
- **Backend**: FastAPI (Python) com autenticação JWT
- **Persistência**: SQLAlchemy
- **Banco de dados**: PostgreSQL

---

## 🗂️ Estrutura do Projeto

\`\`\`
PerfumeShop/
├── public/
│   ├── html/
│   ├── css/
│   ├── js/
│   └── img/
├── backend/
│   └── api/ (endpoints REST)
├── database/
│   └── models/ (SQLAlchemy)
└── docs/
    └── Trabalho de ES.pdf
\`\`\`

---

## ▶️ Como rodar o sistema

1. **Clone o repositório:**

\`\`\`bash
git clone https://github.com/DAVIMEDX/PerfumeShop.git
\`\`\`

2. **Acesse a pasta e inicie o frontend:**

\`\`\`bash
cd PerfumeShop/public
# Abrir o arquivo index.html em um navegador
\`\`\`

3. **(Opcional) Rodar backend com FastAPI:**

\`\`\`bash
cd backend
uvicorn main:app --reload
\`\`\`

---

## 🖼️ Modelos e Diagramas

- Diagrama de Classes
- Diagrama de Atividades
- Arquitetura do Sistema
- Histórias de usuário

Acesse todos os detalhes no arquivo [docs/Trabalho de ES.pdf](./docs/Trabalho%20de%20ES.pdf)

---

## 🧑‍💻 Equipe

- Caio Jordan  
- Davi Alves  
- Gabriel Barbosa  
- Lucas Nóbrega  
- Ronald Matheus  

---

## 📬 Contato

Entre em contato via [GitHub](https://github.com/DAVIMEDX) ou pelo e-mail institucional.
