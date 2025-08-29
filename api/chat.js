export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Solo se permiten solicitudes POST" });
  }

  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Falta el mensaje en el body" });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: message }]
      })
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "No se pudo generar respuesta";

    res.status(200).json({ reply });
  } catch (error) {
    console.error("Error en la API:", error);
    res.status(500).json({ error: "Error al conectar con OpenAI" });
  }
}