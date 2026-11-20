// Generate site images with Gemini (Nano Banana). Usage:
//   GEMINI_API_KEY=your_key node scripts/gen-images.mjs            (all missing)
//   GEMINI_API_KEY=your_key node scripts/gen-images.mjs home about  (only these, overwrite)
import fs from 'node:fs'
import { execFileSync } from 'node:child_process'
const key = process.env.GEMINI_API_KEY
if (!key) { console.error('Set GEMINI_API_KEY first.'); process.exit(1) }
const cfg = JSON.parse(fs.readFileSync('scripts/image-prompts.json', 'utf8'))
const only = process.argv.slice(2)
const out = 'public/images'
fs.mkdirSync(out, { recursive: true })
for (const img of cfg.images) {
  const file = `${out}/${img.name}.jpg`
  if (only.length ? !only.includes(img.name) : fs.existsSync(file)) continue
  process.stdout.write(`Generating ${img.name} ... `)
  const body = { contents: [{ parts: [{ text: `${img.prompt}\n\n${cfg.style}` }] }], generationConfig: { responseModalities: ['IMAGE'], imageConfig: { aspectRatio: cfg.aspect } } }
  const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${cfg.model}:generateContent`, { method: 'POST', headers: { 'x-goog-api-key': key, 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
  const j = await r.json()
  const part = j?.candidates?.[0]?.content?.parts?.find((p) => p.inlineData || p.inline_data)
  const data = part?.inlineData?.data || part?.inline_data?.data
  if (!data) { console.log('FAILED', JSON.stringify(j).slice(0, 300)); continue }
  const tmp = `${out}/${img.name}.png`
  fs.writeFileSync(tmp, Buffer.from(data, 'base64'))
  execFileSync('sips', ['-Z', '1600', '-s', 'format', 'jpeg', '-s', 'formatOptions', '78', tmp, '--out', file], { stdio: 'ignore' })
  fs.unlinkSync(tmp)
  console.log('done', (fs.statSync(file).size / 1024).toFixed(0) + ' KB')
}
