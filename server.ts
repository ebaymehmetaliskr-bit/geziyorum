import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { createProxyMiddleware } from 'http-proxy-middleware';

async function startServer() {
  const app = express();
  const PORT = 3000;

  let wpUrl = process.env.VITE_WP_API_URL || process.env.WP_API_URL || 'https://gezilistesi.com';
  if (!wpUrl.startsWith('http')) {
    wpUrl = 'https://' + wpUrl;
  }
  // Remove trailing slash
  wpUrl = wpUrl.replace(/\/$/, '');

  // Proxy requests to WordPress to bypass CORS
  app.use('/api/wp', createProxyMiddleware({
    target: wpUrl,
    changeOrigin: true,
    secure: false,
    pathRewrite: {
      '^/': '/wp-json/wp/v2/'
    }
  }));

  app.use('/api/wp_base', createProxyMiddleware({
    target: wpUrl,
    changeOrigin: true,
    secure: false,
    pathRewrite: {
      '^/': '/wp-json/'
    }
  }));

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
