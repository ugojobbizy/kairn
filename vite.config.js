import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// En local, sert les fonctions de /api (déployées sur Vercel en production).
// Sans identifiants Google, la réservation tourne en mode démo.
function localApi() {
  return {
    name: 'kairn-local-api',
    configureServer(server) {
      process.env.KAIRN_BOOKING_DEMO ??= '1';
      server.middlewares.use(async (req, res, next) => {
        if (!req.url.startsWith('/api/')) return next();
        const name = req.url.slice(5).split('?')[0];
        if (!/^[a-z-]+$/.test(name)) return next();
        try {
          const mod = await server.ssrLoadModule(`/api/${name}.js`);
          await mod.default(req, res);
        } catch (err) {
          res.statusCode = 500;
          res.end(JSON.stringify({ error: String(err.message || err) }));
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), localApi()],
  server: { port: 5173, open: true },
});
