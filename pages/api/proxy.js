export default async function handler(req, res) {
  try {
    const { sheet, role } = req.query
    const response = await fetch(`${process.env.NEXT_PUBLIC_GSHEET_API}?sheet=${sheet}`)
    const data = await response.json()

    if (role) {
      const filtered = data.filter(r => r.Role === role)
      res.status(200).json(filtered)
    } else {
      res.status(200).json(data)
    }
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
