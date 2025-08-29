export default async function handler(req, res) {
  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: "Falta la API KEY en las variables de entorno" });
  }

  res.status(200).json({ message: "La API KEY está configurada correctamente 🚀" });
}