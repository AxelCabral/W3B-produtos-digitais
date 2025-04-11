document.querySelector('.btn-primary').addEventListener('click', async () => {
  const keyInput = document.querySelector('.activation-form input[type="text"]');
  const errorMsg = document.querySelector('.activation-form .error-msg');
  const key = keyInput.value.trim();

  function showError(message) {
    errorMsg.textContent = message;
    errorMsg.style.visibility = 'visible';
    keyInput.classList.add('error', 'shake');

    // Remove o efeito de shake após a animação
    setTimeout(() => keyInput.classList.remove('shake'), 300);

    // Some com a borda e mensagem depois de alguns segundos
    setTimeout(() => {
      errorMsg.style.visibility = 'hidden';
      keyInput.classList.remove('error');
    }, 3000);
  }

  if (!key) {
    showError("Por favor, insira uma chave de acesso.");
    return;
  }

  try {
    const res = await fetch('/key/content', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ key })
    });

    const data = await res.json();

    if (data.success && data.url) {
      window.location.href = data.url;
    } else {
      showError(data.message || "Chave inválida.");
    }

  } catch (err) {
    showError("Erro ao validar a chave.");
  }
});
