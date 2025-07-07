document.getElementById("adminLoginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const usuario = document.getElementById("usuarioAdmin").value;
  const senha = document.getElementById("senhaAdmin").value;

  // Admin fixo para exemplo
  const adminUser = "admin";
  const adminPass = "1234";

  if (usuario === adminUser && senha === adminPass) {
    localStorage.setItem("adminLogado", "true");
    window.location.href = "admin.html";
  } else {
    alert("Usuário ou senha incorretos.");
  }
});

