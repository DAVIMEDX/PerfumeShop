document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("loginBtn");
  const cadastroBtn = document.getElementById("cadastroBtn");
  const logoutBtn = document.getElementById("logoutBtn");

  const usuarioLogado = localStorage.getItem("usuarioLogado");

  if (usuarioLogado === "true") {
    if (loginBtn) loginBtn.style.display = "none";
    if (cadastroBtn) cadastroBtn.style.display = "none";
    if (logoutBtn) logoutBtn.style.display = "inline-block";

    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("usuarioLogado");
      location.reload();
    });
  }
});
