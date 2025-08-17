function toggleMenu(btn){
  const expanded = btn.getAttribute('aria-expanded') === 'true';
  btn.setAttribute('aria-expanded', String(!expanded));
  const ul = document.querySelector('nav ul');
  ul.style.display = (ul.style.display === 'flex') ? 'none' : 'flex';
}

function enviarFormulario(e){
  e.preventDefault();
  const nombre = document.getElementById('nombre').value;
  alert(`Gracias ${nombre}, tu mensaje fue enviado (simulado).`);
  e.target.reset();
}

document.getElementById('year').textContent = new Date().getFullYear();