export default async function handler(req, res) {
  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: "OPENAI_API_KEY no está configurada" });
  }
  res.status(200).json({ message: "La API key está correctamente configurada" });
}