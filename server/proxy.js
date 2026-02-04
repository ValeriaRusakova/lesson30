import express from 'express'

const app = express()
const cache = new Map()
const TTL = 30 * 1000 // 30s cache

app.get('/api/timezone/:tz(*)', async (req, res) => {
  const tz = req.params.tz
  const key = tz
  const now = Date.now()
  const cached = cache.get(key)
  if (cached && now - cached.ts < TTL) {
    return res.json(cached.val)
  }
  try {
    const target = `https://worldtimeapi.org/api/timezone/${encodeURIComponent(tz)}`
    const r = await fetch(target)
    if (!r.ok) return res.status(r.status).send('Upstream error')
    const json = await r.json()
    cache.set(key, { ts: now, val: json })
    return res.json(json)
  } catch (err) {
    console.error('Proxy error for', tz, err)
    return res.status(502).send(String(err))
  }
})

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Proxy server listening on http://localhost:${port}`))
