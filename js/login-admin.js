document.getElementById("adminLoginForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const usuario = document.getElementById("usuarioAdmin").value;
  const senha = document.getElementById("senhaAdmin").value;

  try {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        username: usuario,
        password: senha,
      }),
    });

    if (!response.ok) {
      throw new Error("Usuário ou senha inválidos");
    }

    const data = await response.json();

    // Verifica se o usuário é administrador
    if (!data.is_admin) {
      alert("Você não tem permissão de administrador.");
      return;
    }

    localStorage.setItem("token", data.access_token);
    localStorage.setItem("adminLogado", "true");

    window.location.href = "admin.html";
  } catch (err) {
    console.error("Erro ao logar:", err);
    alert("Falha no login. Verifique usuário e senha.");
  }
});
