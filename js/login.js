document.getElementById('loginForm').addEventListener('submit', async function(event) {
  event.preventDefault();

  const email = document.getElementById('emailLogin').value;
  const senha = document.getElementById('senhaLogin').value;

  const formData = new URLSearchParams();
  formData.append('username', email);
  formData.append('password', senha);

  try {
    const response = await fetch('http://localhost:8000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData.toString()
    });

    if (response.ok) {
      const data = await response.json();
      alert('Login realizado com sucesso!');
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('email', email);  
      window.location.href = 'index.html';
    } else {
      const error = await response.json();
      alert('Erro no login: ' + (error.detail || 'Email ou senha inválidos'));
    }
  } catch (err) {
    alert('Erro na requisição: ' + err.message);
  }
});
