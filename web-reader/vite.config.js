import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// Custom Vite plugin to handle saving edits back to the local Markdown file
const saveFilePlugin = () => ({
  name: 'save-file-plugin',
  configureServer(server) {
    server.middlewares.use('/api/save', (req, res) => {
      if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
          body += chunk.toString();
        });
        req.on('end', () => {
          try {
            const data = JSON.parse(body);
            const filePath = path.resolve(__dirname, '..', 'Am_I_The_Bad_Guy_Master_Draft.md');
            fs.writeFileSync(filePath, data.content, 'utf8');
            
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify({ success: true }));
          } catch (err) {
            res.statusCode = 500;
            res.end(JSON.stringify({ success: false, error: err.message }));
          }
        });
      } else {
        res.statusCode = 405;
        res.end();
      }
    });
  }
});

export default defineConfig({
  plugins: [react(), saveFilePlugin()],
  base: '/Autobiography/',
  server: {
    fs: {
      allow: ['..']
    }
  }
})
