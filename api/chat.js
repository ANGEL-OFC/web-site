export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: "No hay API KEY configurada en Vercel" });
  }

  try {
    const { message } = req.body;

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

    if (!response.ok) {
      console.error("Error OpenAI:", data);
      return res.status(500).json({ error: data });
    }

    return res.status(200).json({
      reply: data.choices?.[0]?.message?.content || "No hubo respuesta"
    });
  } catch (error) {
    console.error("Error servidor:", error);
    return res.status(500).json({ error: "Error interno en la función" });
  }
}