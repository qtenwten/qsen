export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { name, message } = req.body

  if (!name || !message) {
    return res.status(400).json({ error: 'Name and message are required' })
  }

  const TELEGRAM_BOT_TOKEN = '8609094298:AAGQEDJwuFpml6tqrStaD_rjtd1Tkp1KOQw'
  const TELEGRAM_CHAT_ID = '461685582'

  const text = `🔔 Новое сообщение с сайта QSEN.RU\n\n` +
    `👤 Имя: ${name}\n\n` +
    `💬 Сообщение:\n${message}`

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: text
        })
      }
    )

    const data = await response.json()

    if (data.ok) {
      return res.status(200).json({ success: true })
    } else {
      return res.status(500).json({ error: 'Telegram API error', details: data })
    }
  } catch (error) {
    return res.status(500).json({ error: 'Server error', details: error.message })
  }
}
