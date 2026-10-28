import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'



// Chapters held back from the public reader until they're ready.
// Everything from Chapter 21 on (plus the Epilogue) is stripped at build time,
// so the text never ships in the site bundle. The master draft is untouched.
// To publish again, raise or remove HIDE_FROM_CHAPTER.
const HIDE_FROM_CHAPTER = 21
const hideUnreadyChapters = () => ({
  name: 'hide-unready-chapters',
  apply: 'build',
  enforce: 'pre',
  load(id) {
    if (!id.includes('Am_I_The_Bad_Guy_Master_Draft.md')) return null
    const filePath = id.split('?')[0]
    const raw = fs.readFileSync(filePath, 'utf8')
    const parts = raw.split(/(?=^# )/m)
    const kept = parts.filter((part) => {
      const m = part.match(/^# Chapter (\d+)/)
      if (m && Number(m[1]) >= HIDE_FROM_CHAPTER) return false
      if (/^# Epilogue/.test(part)) return false
      return true
    })
    return `export default ${JSON.stringify(kept.join(''))}`
  }
});

export default defineConfig({
  plugins: [hideUnreadyChapters(), react()],
  base: '/Autobiography/',
  server: {
    fs: {
      allow: ['..']
    }
  }
})
