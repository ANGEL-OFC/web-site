fetch("https://web-site-delta-flax.vercel.app/api/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ message: "Hola, ¿cómo estás?" })
})
  .then(res => res.json())
  .then(data => console.log("Respuesta del bot:", data))
  .catch(err => console.error("Error:", err));